import fs from "fs";

export default class ProductManager {
	constructor(path) {
		this.id = 0;
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

	addProduct = async ({
		title,
		description,
		price,
		thumbnail,
		code,
		stock,
	}) => {
		try {
			if (title && description && price && thumbnail && code && stock) {
				const product = {
					id: this.id,
					title: title,
					description: description,
					price: price,
					thumbnail: thumbnail,
					code: code,
					stock: stock,
				};

				const productExist = this.products.find((p) => p.code === product.code);

				if (!productExist) {
					this.id++;
					this.products.push(product);
					await fs.promises.writeFile(
						this.path,
						JSON.stringify(this.products, null, "\t")
					);
					return "El producto se añadió de forma exitosa";
				} else {
					return `Ya existe un producto con el código ${productExist.code}`;
				}
			} else {
				return "Se requieren todos los campos";
			}
		} catch (error) {
			await fs.promises.writeFile(this.path, "[]");
			throw new Error(error);
		}
	};

	updateProduct = async (paramId, obj) => {
		try {
			const object = await this.getProducts();
			const resultFind = object.find((el) => el.id == paramId);
			if (resultFind === undefined)
				throw new Error(`The product with id: ${paramId} not exists`);
			else {
				resultFind.title = obj.title || resultFind.title;
				resultFind.description = obj.description || resultFind.description;
				resultFind.price = obj.price || resultFind.price;
				resultFind.thumbnail = obj.thumbnail || resultFind.thumbnail;
				resultFind.code = obj.code || resultFind.code;
				resultFind.stock = obj.stock || resultFind.stock;
				await fs.promises.writeFile(
					this.path,
					JSON.stringify(object, null, "\t")
				);
			}
		} catch (error) {
			console.log(error);
		}
	};

	deleteProduct = async (paramId) => {
		try {
			const result = await this.getProductById(paramId);
			const object = await this.getProducts();
			if (result === undefined)
				throw new Error(`The product with id: ${paramId} not exists`);
			else {
				const products = object.filter((el) => el.id != paramId);
				await fs.promises.writeFile(
					this.path,
					JSON.stringify(products, null, "\t")
				);
			}
		} catch (error) {
			console.log(error);
		}
	};
}

// Creacion del archivo con los 10 productos!

// let testing = async () => {
// 	const handlerProducts = new ProductManager("../src/database/Productos.json");

// 	let newProduct1 = {
// 		title: "Producto prueba1",
// 		description: "Este es un producto de prueba1",
// 		price: 234330,
// 		thumbnail: "sin imagen1",
// 		code: "abc123",
// 		stock: 1,
// 	};

// 	let newProduct2 = {
// 		title: "Producto prueba2",
// 		description: "Este es un producto de prueba2",
// 		price: 2006552,
// 		thumbnail: "sin imagen2",
// 		code: "ab234c12322",
// 		stock: 2,
// 	};

// 	let newProduct3 = {
// 		title: "Producto prueba3",
// 		description: "Este es un producto de prueba3",
// 		price: 24562,
// 		thumbnail: "sin imagen3",
// 		code: "ab3435c1232322",
// 		stock: 3,
// 	};

// 	let newProduct4 = {
// 		title: "Producto prueba4",
// 		description: "Este es un producto de prueba4",
// 		price: 2098762,
// 		thumbnail: "sin imagen4",
// 		code: "a543bc12322",
// 		stock: 4,
// 	};

// 	let newProduct5 = {
// 		title: "Producto prueba5",
// 		description: "Este es un producto de prueba5",
// 		price: 672,
// 		thumbnail: "sin imagen5",
// 		code: "ab32352c12322",
// 		stock: 5,
// 	};

// 	let newProduct6 = {
// 		title: "Producto prueba6",
// 		description: "Este es un producto de prueba6",
// 		price: 287672,
// 		thumbnail: "sin imagen6",
// 		code: "abc345512322",
// 		stock: 6,
// 	};

// 	let newProduct7 = {
// 		title: "Producto prueba7",
// 		description: "Este es un producto de prueba7",
// 		price: 257562,
// 		thumbnail: "sin imagen7",
// 		code: "abc154542322",
// 		stock: 7,
// 	};

// 	let newProduct8 = {
// 		title: "Producto prueba8",
// 		description: "Este es un producto de prueba8",
// 		price: 232422,
// 		thumbnail: "sin imagen8",
// 		code: "abc1236545322",
// 		stock: 8,
// 	};

// 	let newProduct9 = {
// 		title: "Producto prueba9",
// 		description: "Este es un producto de prueba9",
// 		price: 234252,
// 		thumbnail: "sin imagen9",
// 		code: "abc1234346322",
// 		stock: 9,
// 	};

// 	let newProduct10 = {
// 		title: "Producto prueba10",
// 		description: "Este es un producto de prueba10",
// 		price: 2002,
// 		thumbnail: "sin imagen10",
// 		code: "abc123234322",
// 		stock: 10,
// 	};

// 	console.log(
// 		"**********************************************************************************************"
// 	);
// 	console.log("Primer prueba, devuelve arreglo vacio");
// 	console.log(await handlerProducts.getProducts());

// 	console.log(
// 		"**********************************************************************************************"
// 	);
// 	console.log("Segunda prueba, agrego producto y lo muestro correctamente");
// 	console.log(await handlerProducts.addProduct(newProduct1));
// 	console.log(await handlerProducts.addProduct(newProduct2));
// 	console.log(await handlerProducts.addProduct(newProduct3));
// 	console.log(await handlerProducts.addProduct(newProduct4));
// 	console.log(await handlerProducts.addProduct(newProduct5));
// 	console.log(await handlerProducts.addProduct(newProduct6));
// 	console.log(await handlerProducts.addProduct(newProduct7));
// 	console.log(await handlerProducts.addProduct(newProduct8));
// 	console.log(await handlerProducts.addProduct(newProduct9));
// 	console.log(await handlerProducts.addProduct(newProduct10));
// 	console.log(await handlerProducts.getProducts());
// };

// testing();
