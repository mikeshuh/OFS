
import express from 'express';
import { getAll } from './controllers/product/getAll.js';
import cors from 'cors';
const app = express();
const port = 8080;

app.use(cors());

app.get('/products', getAll)

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
