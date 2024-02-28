import express from 'express';
import { createAds, getAds } from '../controllers/adsController.js';

const adsRouter = express.Router();

adsRouter.post('/', createAds);
adsRouter.get('/', getAds);


export default adsRouter;