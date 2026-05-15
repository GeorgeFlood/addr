import 'dotenv/config';
import express from 'express';
import lookupRouter from './lookup.js';
const PORT = Number(process.env.PORT) || 3000;

const app = express();

app.use(lookupRouter);

app.listen(`${PORT}`, () => {
  console.log('Server is running on http://localhost:3000');
});

export default app;
