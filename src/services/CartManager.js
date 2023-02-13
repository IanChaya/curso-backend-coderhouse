import fs from "fs";
import ProductManager from "./ProductManager.js";

export default class CartManager {
	constructor(path) {
		this.path = path;
		this.carts = [];
		this.exists = false;
	}

	async checkExists() {
		let exists = true;
		try {
			await fs.promises.access(this.path, fs.constants.F_OK);
		} catch (e) {
			exists = false;
		}
		this.exists = exists;
		return exists;
	}

	async getCarts() {
		try {
			if (!this.exists) {
				const fileExists = await this.checkExists();
				if (!fileExists) {
					await fs.promises.writeFile(this.path, "[]");
					this.exists = true;
				}
			}
			const cartsData = await fs.promises.readFile(this.path, "utf-8");
			this.carts = JSON.parse(cartsData);
			return this.carts;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	async getIdMax() {
		try {
			await this.getCarts();
			const ids = this.carts.map((cart) => cart.id);
			return ids.length === 0 ? 0 : Math.max(...ids);
		} catch (error) {
			throw new Error(error);
		}
	}

	async create() {
		try {
			let id = await this.getIdMax();
			id++;
			this.carts.push({ id: id, products: [] });
			await fs.promises.writeFile(this.path, JSON.stringify(this.carts));
			return id;
		} catch (error) {
			throw new Error(error);
		}
	}

	async getProducts(id) {
		try {
			const carts = await this.getCarts();
			const selectedCart = carts.find((cart) => cart.id === id);
			if (selectedCart) {
				return selectedCart.products;
			}
			return null;
		} catch (error) {
			throw new Error(error.message);
		}
	}

	async addProduct(cid, pid) {
		const handlerProducts = new ProductManager("./src/database/Productos.json");
		const product = await handlerProducts.getProductById(pid).catch((error) => {
			throw new Error(`The product with id ${pid} does not exist: ${error}`);
		});

		if (!product) {
			throw new Error(`The product with id ${pid} does not exist`);
		}

		this.carts = await this.getCarts();
		const cart = this.carts.find((c) => c.id === cid);

		if (!cart) {
			throw new Error(`The cart with id ${cid} does not exist`);
		}

		const updatedCart = this.addProductToCart(cart, pid);
		this.carts = this.carts.filter((c) => c.id !== cid);
		this.carts.push(updatedCart);

		await fs.promises
			.writeFile(this.path, JSON.stringify(this.carts))
			.catch((error) => {
				throw new Error(`Error writing to file: ${error}`);
			});
	}

	addProductToCart(cart, pid) {
		let products = cart.products;
		const product = products.find((p) => p.id === pid);
		let quantity = product ? product.quantity + 1 : 1;
		products = products.filter((p) => p.id !== pid);
		products.push({ id: pid, quantity });
		return { id: cart.id, products };
	}
}
