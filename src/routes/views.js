import express from "express";
import ProductManager from "../services/ProductManager.js";

const router = express.Router();

const handlerProducts = new ProductManager("./src/database/Productos.json");
let productos = [];

const getProducts = async (request, response) => {
	let productos = [];
	let hayProductos = false;

	try {
		productos = await handlerProducts.getProducts();
		hayProductos = productos.length > 0;
	} catch (error) {
		console.error(error);
	}

	response.render("home", {
		title: "Productos",
		hayProductos: hayProductos,
		productos: productos,
	});
};

const getProductsSocket = async (req, res) => {
    let productos = [];
    let hayProductos = false;
    
    try {
      productos = await handlerProducts.getProducts();
      hayProductos = productos.length > 0;
    } catch (error) {
      console.error(error);
    }
  
    res.render('realTimeProducts', {
      title: 'Real Time Products',
      hayProductos: hayProductos,
      productos: productos
    });
  }
  

router.get("/", getProducts);

router.get("/realtimeproducts", getProductsSocket);

export default router;
