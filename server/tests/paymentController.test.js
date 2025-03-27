const request = require('supertest');
const app = require('../server');
const db = require('../src/config/db');
const { generateToken } = require('../src/utils/authUtils'); // 确保路径正确
const redisClient = require('../src/config/redis');

jest.mock('../src/config/db');
jest.mock('../src/services/paymentService', () => ({
  createPaymentIntent: jest.fn(() => Promise.resolve({ id: 'pi_test', client_secret: 'secret_test' }))
}));

describe('POST /payment', () => {
  let token;
  let server;

  beforeAll(() => {
    token = generateToken({ userID: 1, email: 'test@example.com', isAdmin: false, tokenVersion: 0 });
    server = app.listen(5000); // start server
  });

  afterAll(async () => {
    if (server) {
      server.close(); // shut down the server
    }
    if (redisClient) {
      await redisClient.quit(); // close the connection with Redis
    }
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if orderID is missing', async () => {
    const res = await request(server)
      .post('/payment')
      .set('Authorization', `Bearer ${token}`)
      .send({});
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  it('should return 404 if order not found', async () => {
    db.execute.mockResolvedValueOnce([[]]);

    const res = await request(server)
      .post('/payment')
      .set('Authorization', `Bearer ${token}`)
      .send({ orderID: 999 });

    expect(res.statusCode).toEqual(404);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe('Order not found.');
  });

  it('should create payment intent and insert payment record', async () => {
    db.execute
      .mockResolvedValueOnce([[{ orderID: 1, userID: 1, totalPrice: 1000 }]]) // Mock order exists
      .mockResolvedValueOnce([{ insertId: 123 }]); // Mock payment insert

    const res = await request(server)
      .post('/payment')
      .set('Authorization', `Bearer ${token}`)
      .send({ orderID: 1 });

    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.clientSecret).toBe('secret_test');
  });
});
