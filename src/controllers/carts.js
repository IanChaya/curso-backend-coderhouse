import CartManager from "../services/CartManager.js";

const create = async (request, response) => {
	try {
		const handlerCarts = new CartManager("./src/database/Carritos.json");
		const id = await handlerCarts.create();
		response.status(200).json({ success: true, cart: { id, products: [] } });
	} catch (error) {
		response.status(500).json({ success: false, error: error.message });
	}
};

const getProducts = async (request, response) => {
	const id = Number(request.params.id);

	if (isNaN(id)) {
		return response
			.status(400)
			.json({ success: false, error: "id must be a number" });
	}

	try {
		const handlerCarts = new CartManager("./src/database/Carritos.json");
		const products = await handlerCarts.getProducts(id);

		if (Array.isArray(products)) {
			return response.status(200).json({ success: true, products });
		} else {
			return response
				.status(404)
				.json({ success: false, error: "Cart not found" });
		}
	} catch (error) {
		return response.status(500).json({ success: false, error: error.message });
	}
};

const addProduct = async (request, response) => {
	const cid = Number(request.params.cid);
	if (isNaN(cid)) {
		return response
			.status(400)
			.json({ success: false, error: "cid must be a number" });
	}

	const pid = Number(request.params.pid);
	if (isNaN(pid)) {
		return response
			.status(400)
			.json({ success: false, error: "pid must be a number" });
	}

	try {
		const handlerCarts = new CartManager("./src/database/Carritos.json");
		await handlerCarts.addProduct(cid, pid);
		response
			.status(200)
			.json({ success: true, message: `Product ${pid} added to cart ${cid}` });
	} catch (error) {
		response.status(500).json({ success: false, error: error.message });
	}
};

export { create, getProducts, addProduct };
