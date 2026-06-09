import 'dotenv/config';
import express from 'express';
import lookupRouter from './addressRoutes.js';
const PORT = Number(process.env.PORT) || 3000;
import path from 'path';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const limiter = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 50,
  message: 'Reached the API daily limit',
});

const app = express();

app.use(express.static(__dirname));
app.use('/v1/address/', limiter);
app.use(lookupRouter);

app.listen(`${PORT}`, () => {
  console.log('Server is running on http://localhost:3000');
});

export default app;
