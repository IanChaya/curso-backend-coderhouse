const fs = require("fs");

class ProductManager {
	constructor(path) {
		this.id = 0;
		this.path = path;
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
			console.log(error);
		}
	};

	getProductById = async (id) => {
		const producto = this.products.find((product) => product.id === id);
		if (producto) return producto;
		else return "Producto no encontrado";
	};

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
			console.log(error);
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

// Proceso de Testing

testing = async () => {
	const handlerProducts = new ProductManager("Productos.json");

	let newProduct = {
		title: "Producto prueba",
		description: "Este es un producto de prueba",
		price: 200,
		thumbnail: "sin imagen",
		code: "abc123",
		stock: 25,
	};

	// let newProduct2 = {
	//     title: 'Producto prueba2',
	//     description: 'Este es un producto de prueba2',
	//     price: 2002,
	//     thumbnail: "sin imagen2",
	//     code: 'abc12322',
	//     stock: 252,
	// }

    console.log("**********************************************************************************************");
	console.log("Primer prueba, devuelve arreglo vacio");
	console.log(await handlerProducts.getProducts());
    
    console.log("**********************************************************************************************");
	console.log("Segunda prueba, agrego producto y lo muestro correctamente");
	console.log(await handlerProducts.addProduct(newProduct));
	console.log(await handlerProducts.getProducts());

	// console.log("Otra prueba, agrego producto y lo muestro")
	// console.log(await handlerProducts.addProduct(newProduct2 ));
	// console.log(await handlerProducts.getProducts());

    console.log("**********************************************************************************************");
	console.log("Se ingresa un ID existente y se muestra el producto encontrado");
	console.log(await handlerProducts.getProductById(0));


    console.log("**********************************************************************************************");
	console.log("Llamo a updateProduct para cambiar uno de los campos y confirmo que se haya modificado sin eliminar el ID");
	await handlerProducts.updateProduct(0, {
		price: 5000,
		description: "Este producto esta siendo probado",
	});
	console.log(await handlerProducts.getProducts());

    console.log("**********************************************************************************************");
	console.log("Elimino el item existente y verifico que se haya eliminado");
	await handlerProducts.deleteProduct(0);
	console.log(await handlerProducts.getProducts());

};

testing();
