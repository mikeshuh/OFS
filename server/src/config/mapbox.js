const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mbxDirections = require('@mapbox/mapbox-sdk/services/directions');

require('dotenv').config();

const mapboxToken = process.env.MAPBOX_ACCESS_TOKEN;

const geocodingClient = mbxGeocoding({ accessToken: mapboxToken });

const directionsClient = mbxDirections({ accessToken: mapboxToken });

module.exports = { geocodingClient, directionsClient };
