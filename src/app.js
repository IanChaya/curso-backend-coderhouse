import express from "express";
import { default as productsRouter } from "./routes/products.js";

const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/products", productsRouter);

app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
});