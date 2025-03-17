const Order = require('../models/orderModel');
const responseHandler = require('../utils/responseHandler');
const validation = require('../utils/validationUtils');
const deliveryService = require('../services/deliveryService');

const WAREHOUSE_ADDRESS = "1 Washington Sq, San Jose, Californi, United States, 95192"
const DELIVERY_RADIUS = 25; // miles

/*
  Get the coordinates of an address
  Usage: body contains the address
  Example: localhost:5000/api/delivery/geocode
*/
const getGeocode = async (req, res) => {
  try {
    const validationResult = validation.validateAddress(req.body);
    if (!validationResult.isValid) {
      responseHandler.error(res, validationResult.errors);
      return;
    }

    // The client side should reject any request that is out of the state since state is not stored in the database
    const { streetAddress, city, zipCode } = req.body;
    const address = `${streetAddress}, ${city}, California, United States, ${zipCode}`;
    const sanitizedAddress = validation.sanitizeString(address);
    if (!sanitizedAddress || sanitizedAddress === '') {
      responseHandler.error(res, 'Invalid address');
      return;
    }

    // Get the coordinates from mapbox
    const coordinates = await deliveryService.getGeocode(sanitizedAddress);
    responseHandler.success(res, coordinates);
  } catch (error) {
    console.log(error)
    responseHandler.error(res, error.message);
  }
}

/*
  Get the route between two addresses
  Usage: body contains the origin and destination addresses
  Example: localhost:5000/api/delivery/route
*/
const getRoute = async (req, res, dataType = "") => {
  try {
    const validationResult = validation.validateRoute(req.body);
    if (!validationResult.isValid) {
      responseHandler.error(res, validationResult.errors);
      return null;
    }

    const { origin, destination } = req.body;

    // The client side should reject any request that is out of the state since state is not stored in the database
    const addressOrigin = `${origin.streetAddress}, ${origin.city}, California, United States, ${origin.zipCode}`;
    const addressDestination = `${destination.streetAddress}, ${destination.city}, California, United States, ${destination.zipCode}`;
    const sanitizedOrigin = validation.sanitizeString(addressOrigin);
    const sanitizedDestination = validation.sanitizeString(addressDestination);

    // Get the route between the two addresses from mapbox
    const route = await deliveryService.getRoute(sanitizedOrigin, sanitizedDestination);
    if (route) {
      switch (dataType) {
        case "distance":
          const distance = Math.round(route.routes[0].distance * 10 / 1609.34) / 10;
          responseHandler.success(res, `${distance} miles`);
          break;
        case "checkDeliveryRadius":
          return Math.round(route.routes[0].distance * 10 / 1609.34) / 10 <= DELIVERY_RADIUS;
        case "duration":
          const minutes = Math.ceil(route.routes[0].duration / 60);
          responseHandler.success(res, `${minutes} minutes`);
          break;
        default:
          responseHandler.success(res, route);
      }
    } else {
      responseHandler.error(res, 'Could not find route');
    }
  } catch (error) {
    responseHandler.error(res, error.message);
  }
}

/*
  Get the distance between two addresses
  Usage: body contains the origin and destination addresses
  Example: localhost:5000/api/delivery/distance
*/
const getDistance = async (req, res) => {
  getRoute(req, res, "distance");
}

/*
  Get the duration between two addresses
  Usage: body contains the origin and destination addresses
  Example: localhost:5000/api/delivery/duration
*/
const getDuration = async (req, res) => {
  getRoute(req, res, "duration");
}
/*
  Check if the destination address is within the delivery radius
  Usage: body contains the destination address to check
         Origin is set to the warehouse address
  Example: localhost:5000/api/delivery/check
*/
const checkDeliveryRadius = async (req, res) => {
  req.origin = WAREHOUSE_ADDRESS;
  const isWithinRadius = await getRoute(req, res, "checkDeliveryRadius");

  //Not checking error because it should be handled in the getRoute function
  if (isWithinRadius) {
    responseHandler.success(res, 'deliverable');
  }else if (isWithinRadius === false) {
    responseHandler.error(res, 'undeliverable');
  }
}
/*
  Get the optimal route between multiple addresses
  Usage: body contains the addresses with multiple addressees
  Example: localhost:5000/api/delivery/optimize
*/
const getOptimalRoute = async (req, res) => {
  try {
    // Note: since I am only using this once, I didn't make the instructions reusable
    const navigationInstruction = [];
    const validationResult = validation.validateOptimalRoute(req.body);
    if (!validationResult.isValid) {
      responseHandler.error(res, validationResult.errors);
      return;
    }

    // The warehouse location is stored in the environment variable
    const warehouse = WAREHOUSE_ADDRESS;
    const { addresses } = req.body;
    const sanitizedAddresses = addresses.map(address => {
      return validation.sanitizeString(`${address.streetAddress}, ${address.city}, California, United States, ${address.zipCode}`);
    });

    // Add the warehouse as the source and destination
    sanitizedAddresses.unshift(warehouse);

    // Get the optimized route between the addresses from mapbox
    const route = await deliveryService.getOptimalRoute(sanitizedAddresses);
    if (route) {
      // The route data is hard to read
      // This is a formatted response
      const legs = route[0].legs;
      legs.forEach((leg) => {
        const steps = leg.steps;

        // This is the instruction summary for the trip, including the distance and duration
        const instruction = `Instruction from ${leg.summary}`;
        const duration = `${Math.round(leg.duration / 60)} minutes`;
        const distance = `${Math.round(leg.distance * 10 / 1609.34) / 10} miles`;
        navigationInstruction.push({
          instruction: instruction,
          distance: distance,
          duration: duration,
          steps: []
        });
        steps.forEach((step, index) => {
          // distance is the distacne for each step in miles
          const distance = Math.max(0.1, Math.round(step.distance * 10 / 1609.34) / 10);
          var stepDetail = `  ${step.maneuver.instruction || "No instruction available"} for ${distance} miles`;

          // If it is the last step, the instruction is "arrive at destination", so no need for the distance
          // There exist a cleaner way to do this but I got lazy
          if (index == steps.length - 1) {
            stepDetail = `${step.maneuver.instruction}`;
          }
          // Add the step instruction to the most recent instruction
          navigationInstruction[navigationInstruction.length - 1].steps.push(stepDetail);
        });
      });
      responseHandler.success(res, navigationInstruction);
    } else {
      responseHandler.error(res, 'Could not find route');
    }
  } catch (error) {
    console.log(error)
    responseHandler.error(res, error.message);
  }
}
module.exports = { getGeocode, getRoute, getDistance, getDuration, getOptimalRoute, checkDeliveryRadius };
