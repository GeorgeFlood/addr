import { Router } from 'express';
import fetchAddress from './index.js';
const router = Router();

router.get('/v1/address/', async (req, res) => {
  try {
    const postcode = req.query.postcode;

    const response = await fetchAddress(postcode);
    const results = response.results;
    const addresses = results.map(item => item.DPA.ADDRESS);

    res.status(200).json({
      status: 'successful',
      data: {
        addresses,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err.message,
    });
  }
});

export default router;
