const Order = require('../models/orderModel');
const deliveryQueue = require('../queues/deliveryQueue');
const validation = require('../utils/validationUtils');
const deliveryService = require('./deliveryService');

// Thresholds for triggering the delivery process
const MAX_WEIGHT_IN_ROBOT = 200; // in lbs
const MAX_ORDERS_IN_ROBOT = 10;
const AUTO_TRIGGER_INTERVAL_MS = 1 * 60 * 1000; // 1 minute

// Simulation factor (e.g., 1 real minute equals 1 simulated second)
const SIMULATION_FACTOR = 1 / 60;

let inMemoryOrderQueue = [];
let isProcessing = false;

/**
 * On startup, reloads unqueued orders from the database into memory.
 * This helps recover from crashes where some orders were paid but not yet delivered.
 */
const loadUnqueuedOrdersIntoMemory = async () => {
  try {
    const unqueuedOrders = await Order.findUnqueuedPaidOrders();
    inMemoryOrderQueue = [...unqueuedOrders];
    console.log(`Restored ${inMemoryOrderQueue.length} unqueued orders from the database.`);
  } catch (error) {
    console.error('Error restoring in-memory queue:', error);
  }
};

/**
 * Add order to the in-memory queue. When the weight or order count threshold is met,
 * trigger the delivery process.
 */
const addOrderToQueue = (order) => {
  inMemoryOrderQueue.push(order);
  console.log(`Order ${order.orderID} added to the queue.`);

  const totalWeight = inMemoryOrderQueue.reduce((sum, o) => sum + parseFloat(o.totalPounds), 0);
  if (totalWeight >= MAX_WEIGHT_IN_ROBOT || inMemoryOrderQueue.length >= MAX_ORDERS_IN_ROBOT) {
    triggerDeliveryProcess();
  }
};

/**
 * Schedules a delivery job in the Bull queue for the given order.
 */
const scheduleDelivery = async (order, delay) => {
  try {
    await deliveryQueue.add({ orderID: order.orderID }, {
      delay: delay,
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
      removeOnComplete: true,
      removeOnFail: { count: 5 }
    });
    await Order.updateQueuedForDelivery(order.orderID, true);
    console.log(`Scheduled delivery for order ${order.orderID} in ${Math.round(delay)} ms.`);
  } catch (error) {
    console.error(`Failed to schedule delivery for order ${order.orderID}:`, error);
  }
};

/**
 * Trigger the delivery process: calculate optimal route and schedule jobs in the Bull queue.
 */
const triggerDeliveryProcess = async () => {
  if (isProcessing) {
    console.log('Delivery process is already running. Skipping this trigger.');
    return;
  }

  isProcessing = true;
  try {
    // Build a strict batch of orders based on both weight and count
    const batch = [];
    let totalWeight = 0;

    for (const order of inMemoryOrderQueue) {
      const weight = parseFloat(order.totalPounds);
      if (batch.length >= MAX_ORDERS_IN_ROBOT || totalWeight + weight > MAX_WEIGHT_IN_ROBOT) break;
      batch.push(order);
      totalWeight += weight;
    }

    if (batch.length === 0) {
      console.log("No eligible batch to process.");
      return;
    }

    const orderAddresses = batch.map(order => {
      const rawAddress = `${order.streetAddress}, ${order.city}, California, United States, ${order.zipCode}`;
      return rawAddress;
    });

    const warehouseAddress = "1 Washington Sq, San Jose, California, United States, 95192";
    const allAddresses = [warehouseAddress, ...orderAddresses];

    const trips = await deliveryService.getOptimalRoute(allAddresses);
    if (!trips || trips.length === 0) {
      console.error("No optimal route found for the queued orders.");
      return;
    }

    const legs = trips[0].legs;
    console.log("Optimal route calculated. Scheduling delivery jobs...");

    let cumulativeDelay = 0;

    // Each leg represents the route segment between two delivery points.
    // Since leg[0] is from the warehouse to the first order, leg[i] corresponds to batch[i].
    // We use this to schedule each order's delivery with a delay based on cumulative travel time.
    const deliveryLegs = legs.slice(0, batch.length);
    deliveryLegs.forEach((leg, index) => {
      cumulativeDelay += leg.duration * SIMULATION_FACTOR * 1000; // convert to ms

      if (index < batch.length) {
        const order = batch[index];
        scheduleDelivery(order, cumulativeDelay);
      }
    });

    // Remove only the processed batch from the in-memory queue
    inMemoryOrderQueue = inMemoryOrderQueue.slice(batch.length);
  } catch (error) {
    console.error("Error triggering delivery process:", error);
  } finally {
    isProcessing = false;
    const totalWeight = inMemoryOrderQueue.reduce((sum, o) => sum + parseFloat(o.totalPounds), 0);
    if (totalWeight >= MAX_WEIGHT_IN_ROBOT || inMemoryOrderQueue.length >= MAX_ORDERS_IN_ROBOT) {
      triggerDeliveryProcess();
    }
  }
};

setInterval(() => {
  if (inMemoryOrderQueue.length > 0) {
    console.log(`Auto-triggering delivery process for ${inMemoryOrderQueue.length} orders...`);
    triggerDeliveryProcess();
  }
}, AUTO_TRIGGER_INTERVAL_MS);

module.exports = {
  addOrderToQueue,
  triggerDeliveryProcess,
  loadUnqueuedOrdersIntoMemory,
};
