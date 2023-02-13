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
		const handlerProducts = new ProductManager("./src/database/Productos.json");
		let productos = [];
		if (allProducts) {
			productos = await handlerProducts.getProducts();
		} else {
			productos = await handlerProducts.getProductsWithLimit(limit);
		}
		response.send({ success: true, products: productos });
	} catch (error) {
		response.send({ success: false, error: "Products could not be retrieved" });
	}
};

const getProdById = async (request, response) => {
	let id = request.params.id;
	id = Number(id);
	if (isNaN(id)) {
		response.status(400).send({ success: false, error: "Id must be a number" });
	} else {
		try {
			const handlerProducts = new ProductManager(
				"./src/database/Productos.json"
			);
			id = Math.floor(id);
			const producto = await handlerProducts.getProductById(id);
			if (producto) {
				response.send({ success: true, product: producto });
			} else {
				response.send({ success: false, error: "Product not found" });
			}
		} catch (error) {
			response.send({
				success: false,
				error: "Product could not be retrieved",
			});
		}
	}
};

const add = async (request, response) => {
	const product = request.body.product;
	console.log(product);
	if (product) {
		try {
			const handlerProducts = new ProductManager(
				"./src/database/Productos.json"
			);
			const createdProduct = await handlerProducts.addProduct(product);
			response.send({ success: true, product: createdProduct });
		} catch (e) {
			response.send({ success: false, error: e.message });
		}
	} else {
		response.status(400).send({ success: false, error: "This is not a correct product" });
	}
};

const update = async (request, response) => {
	const id = parseInt(request.params.id);
	if (isNaN(id)) {
		return response
			.status(400)
			.send({ success: false, error: "id must be a number" });
	}
	const product = request.body.product;
	if (!product) {
		return response
			.status(400)
			.send({ success: false, error: "Bad request, expected a product" });
	}
	try {
		const handlerProducts = new ProductManager("./src/database/Productos.json");
		const updatedProduct = await handlerProducts.updateProduct(id, product);
		response.send({ success: true, product: updatedProduct });
	} catch (error) {
		response.send({ success: false, error: error.message });
	}
};

const deleteProduct = async (request, response) => {
	let id = request.params.id;

	if (isNaN(Number(id))) {
		return response
			.status(400)
			.send({ success: false, error: "id must be a number" });
	}

	try {
		const handlerProducts = new ProductManager("./src/database/Productos.json");
		await handlerProducts.deleteProduct(Number(id));
		return response.send({ success: true });
	} catch (error) {
		return response.send({ success: false, error: error.message });
	}
};

export { getAllProducts, getProdById, add, update, deleteProduct };
