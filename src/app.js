import express from "express";
import { default as productsRouter } from "./routes/products.js";
import { default as cartsRouter } from "./routes/carts.js";

const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/products", productsRouter);
app.use("/api/carts", cartsRouter)

app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});