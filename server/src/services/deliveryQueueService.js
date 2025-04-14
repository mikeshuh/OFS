// services/deliveryQueueService.js
const deliveryQueue = require('../queues/deliveryQueue');
const validation = require('../utils/validationUtils');
const deliveryService = require('./deliveryService');

// Thresholds for triggering the delivery process
const MAX_WEIGHT = 200; // in lbs
const MAX_ORDERS_IN_QUEUE = 2;

let inMemoryOrderQueue = [];

/**
 * Add order to the in-memory queue. When the weight or order count threshold is met,
 * trigger the delivery process.
 */
const addOrderToQueue = (order) => {
  inMemoryOrderQueue.push(order);
  console.log(`Order ${order.orderID} added to the queue.`);

  const totalWeight = inMemoryOrderQueue.reduce((sum, o) => sum + parseFloat(o.totalPounds), 0);
  if (totalWeight >= MAX_WEIGHT || inMemoryOrderQueue.length >= MAX_ORDERS_IN_QUEUE) {
    triggerDeliveryProcess();
  }
};

/**
 * Trigger the delivery process: calculate optimal route and schedule jobs in the Bull queue.
 */
const triggerDeliveryProcess = async () => {
  try {
    // Map orders to their sanitized addresses (ensure address validation)
    const orderAddresses = inMemoryOrderQueue.map(order => {
      const rawAddress = `${order.streetAddress}, ${order.city}, California, United States, ${order.zipCode}`;
      return validation.sanitizeString(rawAddress);
    });

    // Optionally, include the warehouse as the starting address.
    const warehouseAddress = "1 Washington Sq, San Jose, California, United States, 95192";
    const allAddresses = [warehouseAddress, ...orderAddresses];

    // Get the optimal route via the delivery service
    const trips = await deliveryService.getOptimalRoute(allAddresses);
    if (!trips || trips.length === 0) {
      console.error("No optimal route found for the queued orders.");
      return;
    }

    const legs = trips[0].legs;
    console.log("Optimal route calculated. Scheduling delivery jobs...");

    // Here you can use a simulation factor (e.g., 1 real minute equals 1 simulated second)
    const SIMULATION_FACTOR = 1 / 60;
    let cumulativeDelay = 0;

    // For each leg (except the first which is from the warehouse), schedule a job
    legs.forEach((leg, index) => {
      cumulativeDelay += leg.duration * SIMULATION_FACTOR * 1000; // convert to ms

      // Note: since the warehouse is index 0, the first order corresponds to leg 1.
      const orderIndex = index; // orders mapped: leg 1 => order[0], leg 2 => order[1], etc.
      if (orderIndex < inMemoryOrderQueue.length) {
        const order = inMemoryOrderQueue[orderIndex];
        // Add a job with the calculated delay
        deliveryQueue.add({ orderID: order.orderID }, { delay: cumulativeDelay });
        console.log(`Scheduled delivery for order ${order.orderID} in ${cumulativeDelay} ms.`);
      }
    });

    // Clear the in-memory queue since jobs are now scheduled
    inMemoryOrderQueue = [];
  } catch (error) {
    console.error("Error triggering delivery process:", error);
  }
};

module.exports = {
  addOrderToQueue,
  triggerDeliveryProcess, // exported for testing if needed
};
