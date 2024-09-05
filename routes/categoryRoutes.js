import express from "express";
import { getCoategories } from "../controllers/categoryController.js";

const categoryRouter = express.Router();

categoryRouter.get("/", getCoategories);

export default categoryRouter;
