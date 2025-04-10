const Order = require('../models/orderModel');
const responseHandler = require('../utils/responseHandler');
const validation = require('../utils/validationUtils');
const deliveryService = require('../services/deliveryService');
const turf = require('@turf/turf');

const WAREHOUSE_ADDRESS = "1 Washington Sq, San Jose, Californi, United States, 95192"
const DELIVERY_RADIUS = 25; // miles

// Calculate the distance between two coordinates
// Uses turf.js which mapbox heavily depends on
// Document: https://stackoverflow.com/questions/69520848/how-to-get-distance-between-two-coordinates-with-mapbox
const getEuclidieanDistance = async (req, res) => {
  const { origin, destination } = req.body;
  const [lon1, lat1] = await deliveryService.getGeocode(`${origin.streetAddress}, ${origin.city}, ${origin.state || "California"}, ${origin.country || "United States"}, ${origin.zipCode}`);
  const [lon2, lat2] = await deliveryService.getGeocode(`${destination.streetAddress}, ${destination.city}, ${destination.state || "California"}, ${destination.country || "United States"}, ${destination.zipCode}`);
  const distance = turf.distance(turf.point([lon1, lat1]), turf.point([lon2, lat2]), { units: 'miles' });
  return distance <= DELIVERY_RADIUS;
}

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
      responseHandler.badRequest(res, validationResult.errors);
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
          responseHandler.success(res, { distance: distance, message: `${distance} miles` });
          break;
        case "checkDeliveryRadius":
          return Math.round(route.routes[0].distance * 10 / 1609.34) / 10 <= DELIVERY_RADIUS;
        case "duration":
          const minutes = Math.ceil(route.routes[0].duration / 60);
          responseHandler.success(res, { duration: minutes, message: `${minutes} minutes` });
          break;
        default:
          responseHandler.success(res, route);
      }
    } else {
      responseHandler.badRequest(res, 'Could not find route');
    }
  } catch (error) {
    responseHandler.badRequest(res, error.message);
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
  try {
    req.body.origin = {
      streetAddress: "1 Washington Sq",
      city: "San Jose",
      zipCode: "95192"
    }
    // This is modified to use the Euclidean distance instead
    const isWithinRadius = await getEuclidieanDistance(req, res);

    if (isWithinRadius) {
      responseHandler.success(res, { message: 'Congratulations! Your address is within our delivery zone' });
    } else if (isWithinRadius === false) {
      responseHandler.success(res, { message: 'Sorry! Your address is outside our delivery zone' });
    }
  } catch (error){
    responseHandler.error(res, error.message);
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
      responseHandler.badRequest(res, validationResult.errors);
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
      responseHandler.badRequest(res, 'Could not find route');
    }
  } catch (error) {
    responseHandler.error(res, error.message);
  }
}
module.exports = { getGeocode, getRoute, getDistance, getDuration, getOptimalRoute, checkDeliveryRadius };
