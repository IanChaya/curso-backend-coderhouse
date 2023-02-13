import express from "express";
import * as Controller from "../controllers/carts.js";

const router = express.Router();

router.post("/", Controller.create);
router.get("/:id", Controller.getProducts);
router.post("/:cid/product/:pid", Controller.addProduct);

export default router;
