import fs from "fs";

export default class ProductManager {
	constructor(path) {
		this.path = path;
		this.exists = false;
		this.products = [];
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

	checkFields(product) {
		const {
			title,
			description,
			code,
			price,
			status,
			stock,
			category,
			thumbnails,
		} = product;
		let realThumbnails = thumbnails;
		let valid = true;
		if (typeof title !== "string") valid = false;
		if (typeof description !== "string") valid = false;
		if (typeof code !== "string") valid = false;
		if (typeof price !== "number") valid = false;
		if (typeof status !== "boolean") valid = false;
		if (typeof stock !== "number") valid = false;
		if (typeof category !== "string") valid = false;
		if (!Array.isArray(thumbnails)) realThumbnails = [];
		if (valid) {
			let newProduct = { ...product, thumbnails: realThumbnails };
			return newProduct;
		} else {
			return null;
		}
	}

	getProducts = async () => {
		try {
			if (this.exists === false) {
				let exists = await this.checkExists();
				if (exists === false) {
					await fs.promises.writeFile(this.path, "[]");
					this.exists = true;
				}
			}
			let prods = await fs.promises.readFile(this.path, "utf-8");
			this.products = JSON.parse(prods);
			return this.products;
		} catch (error) {
			throw new Error(error.message);
		}
	};

	async getProductsWithLimit(limit) {
		try {
			await this.getProducts();
			if (limit >= this.products.length) {
				return this.products;
			} else {
				return this.products.slice(0, limit);
			}
		} catch (error) {
			throw new Error(error);
		}
	}

	async getProductById(id) {
		await this.getProducts();
		const product = this.products.find((el) => el.id === id);
		if (product) {
			return product;
		}
		return null;
	}

	async getIdMax() {
		try {
			await this.getProducts();
			const ids = this.products.map((product) => product.id);
			return ids.length === 0 ? 0 : Math.max(...ids);
		} catch (error) {
			throw new Error(error);
		}
	}

	addProduct = async (product) => {
		try {
			const newProduct = this.checkFields(product);
			if (newProduct) {
				let id = await this.getIdMax();
				if (this.products.some((el) => el.code === newProduct.code)) {
					throw new Error(
						`A product with the code ${newProduct.code} alredy exists`
					);
				}
				const product = {
					id: id + 1,
					title: newProduct.title,
					description: newProduct.description,
					code: newProduct.code,
					price: newProduct.price,
					status: newProduct.status,
					stock: newProduct.stock,
					category: newProduct.category,
					thumbnails: newProduct.thumbnails,
				};
				this.products.push(product);
				await fs.promises.writeFile(this.path, JSON.stringify(this.products));
				return product;
			} else {
				return "All files are required";
			}
		} catch (error) {
			throw new Error(error);
		}
	};

	updateProduct = async (paramId, newProduct) => {
		await this.getProducts();
		const index = this.products.findIndex((el) => el.id === paramId);
		if (index !== -1) {
			const updatedProduct = {
				...this.products[index],
				title: newProduct.title || this.products[index].title,
				description: newProduct.description || this.products[index].description,
				price: newProduct.price || this.products[index].price,
				thumbnails: newProduct.thumbnails || this.products[index].thumbnails,
				stock: newProduct.stock || this.products[index].stock,
				status: newProduct.status || this.products[index].status,
				category: newProduct.category || this.products[index].category,
			};
			this.products[index] = updatedProduct;
			await fs.promises.writeFile(this.path, JSON.stringify(this.products));
			return updatedProduct;
		} else {
			throw new Error(`The product with id ${paramId} does not exist`);
		}
	};

	async deleteProduct(paramId) {
		try {
			await this.getProducts();
			const productIndex = this.products.findIndex((el) => el.id === paramId);
			if (productIndex !== -1) {
				this.products.splice(productIndex, 1);
				await fs.promises.writeFile(this.path, JSON.stringify(this.products));
			} else {
				throw new Error(`The product with id ${paramId} does not exist`);
			}
		} catch (e) {
			throw new Error(e);
		}
	}
}
