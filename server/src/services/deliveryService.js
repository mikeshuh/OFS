const { geocodingClient, directionsClient, optimizationClient } = require('../config/mapbox');

const deliveryService = {
  // Get geocode from address
  getGeocode: async (address) => {
    try {
      const response = await geocodingClient.forwardGeocode({
        query: address,
        limit: 1
      }).send();
      return response.body.features[0].geometry.coordinates
    } catch (error) {
      throw new Error(error.message);
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
      // console.error(error);
      throw new Error(error.message);
    }
  },
  getOptimalRoute: async (addresses) => {
    // Get the coordinates for the addresses
    const coordinates = [];
    for (let i = 0; i < addresses.length; i++) {
      try {
        coordinates.push({
          coordinates: await deliveryService.getGeocode(addresses[i])
        });
      }catch(error){
        throw new Error(error.message);
      }

    }

    // Get the optimized route between the coordinates
    /*
    call breakdown:
      waypoints: the points that the route will pass through
      roundtrip: start and end at the same point, in this case the warehouse
      overview: the type of overview geometry that is returned, simplified exclude unwanted data
      step: return instruction specific to each turn
    */
    try {
      const response = await optimizationClient.getOptimization({
        profile: 'driving',
        waypoints: coordinates,
        source: 'first',
        roundtrip: true,
        overview: 'simplified',
        steps: true
      }).send();
      if (response.body.code === 'Ok') {
        return response.body.trips;
      } else {
        throw new Error(response.body.message);
      }
    } catch (error) {
      console.error(error);
      throw new Error(error.message);
    }
  }

}

module.exports = deliveryService;
