import express from "express";
import * as Controller from "../controllers/products.js";

const router = express.Router();

router.get("/", Controller.getAllProducts);
router.get("/:id", Controller.getProdById);

export default router;
