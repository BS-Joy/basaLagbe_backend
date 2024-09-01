import express from 'express';
import { createAds, getAds, getAdsByAuthor } from '../controllers/adsController.js';

const adsRouter = express.Router();

adsRouter.post('/', createAds);
adsRouter.get('/', getAds);
adsRouter.get('/author/:authorId', getAdsByAuthor);


export default adsRouter;