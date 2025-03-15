const Order = require('../models/orderModel');
const responseHandler = require('../utils/responseHandler');
const validation = require('../utils/validationUtils');
const deliveryService = require('../services/deliveryService');

// get the coordinate from address
const getGeocode = async (req, res) => {
  try{
    const validationResult = validation.validateAddress(req.body);
    if (!validationResult.isValid) {
      responseHandler.error(res, validationResult.errors);
      return;
    }

    // The client side should reject any request that is out of the state since state is not stored in the database
    // Server side is not handling the logic where the address is not in California
    const {streetAddress,city,zipCode} = req.body;
    const address = `${streetAddress}, ${city}, California, United States, ${zipCode}`;
    const sanitizedAddress = validation.sanitizeString(address);
    if (!sanitizedAddress || sanitizedAddress === '') {
      responseHandler.error(res, 'Invalid address');
      return;
    }

    // Get the coordinates from mapbox
    const coordinates = await deliveryService.getGeocode(sanitizedAddress);
    responseHandler.success(res, coordinates);
  }catch(error){
    console.log(error)
    responseHandler.error(res, error.message);
  }
}

const getRoute = async (req, res) => {
  try{
    const validationResult = validation.validateRoute(req.body);
    if (!validationResult.isValid) {
      responseHandler.error(res, validationResult.errors);
      return;
    }

    const {origin,destination} = req.body;

    // The client side should reject any request that is out of the state since state is not stored in the database
    const addressOrigin = `${origin.streetAddress}, ${origin.city}, California, United States, ${origin.zipCode}`;
    const addressDestination = `${destination.streetAddress}, ${destination.city}, California, United States, ${destination.zipCode}`;
    const sanitizedOrigin = validation.sanitizeString(addressOrigin);
    const sanitizedDestination = validation.sanitizeString(addressDestination);

    // Get the route between the two addresses from mapbox
    const route = await deliveryService.getRoute(sanitizedOrigin, sanitizedDestination);
    if (route) {
      responseHandler.success(res, route);
    } else {
      responseHandler.error(res, 'Could not find route');
    }
  }catch(error){
    console.log(error)
    responseHandler.error(res, error.message);
  }
}

module.exports = { getGeocode,getRoute };
