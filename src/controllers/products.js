import ProductManager from "../services/ProductManager.js";

const getAllProducts = async (request, response) => {
	let allProducts = false;
	let limit = request.query.limit;
	limit = Number(limit);
	if (isNaN(limit)) {
		allProducts = true;
	} else {
		limit = Math.floor(limit);
		if (limit < 1) {
			allProducts = true;
		}
	}
	try {
		const handlerProducts = new ProductManager(
			"./src/database/Productos.json"
		);
		let productos = [];
		if (allProducts) {
			productos = await handlerProducts.getProducts();
		} else {
			productos = await handlerProducts.getProductsWithLimit(limit);
		}
		response.send({ products: productos });
	} catch (error) {
		response.send({ error: "Products could not be retrieved" });
	}
};

const getProdById = async (request, response) => {
	let id = request.params.id;
	id = Number(id);
	if (isNaN(id)) {
		response.status(400).send({ error: "Id must be a number" });
	} else {
		try {
			const handlerProducts = new ProductManager(
				"./src/database/Productos.json"
			);
			id = Math.floor(id);
			const producto = await handlerProducts.getProductById(id);
			if (producto) {
				response.send({ product: producto });
			} else {
				response.send({ error: "Product not found" });
			}
		} catch (error) {
			response.send({ error: "Product could not be retrieved" });
		}
	}
};

export { getAllProducts, getProdById };
