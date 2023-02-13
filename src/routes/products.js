import express from "express";
import * as Controller from "../controllers/products.js";

const router = express.Router();

router.get("/", Controller.getAllProducts);
router.get("/:id", Controller.getProdById);
router.post("/", Controller.add);
router.put("/:id", Controller.update);
router.delete("/:id", Controller.deleteProduct);

export default router;
