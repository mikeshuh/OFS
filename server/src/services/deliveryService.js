const { get } = require("../routes/userRoute");
const {geocodingClient,directionsClient} = require('../config/mapbox');
const { cookie } = require("express-validator");
const deliveryService = {
  // Get geocode from address
  getGeocode: async (address) => {
    try {
      const response = await geocodingClient.forwardGeocode({
        query: address,
        limit: 1
      }).send();
      return response.body.features[0].geometry.coordinates;
    } catch (error) {
      console.error(error);
      return null;
    }
  },
  // Get route from origin to destination
  getRoute: async (origin, destination) => {
    // Get the coordinates for the origin and destination
    coordinateOrigin = await deliveryService.getGeocode(origin);
    coordinateDestination = await deliveryService.getGeocode(destination);

    // Get the route between the two coordinates
    try {
      const response = await directionsClient.getDirections({
        profile: 'driving',
        waypoints: [
          { coordinates: coordinateOrigin },
          { coordinates: coordinateDestination }
        ],
        geometries: 'geojson'
      }).send();
      return response.body;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

}

module.exports = deliveryService;
