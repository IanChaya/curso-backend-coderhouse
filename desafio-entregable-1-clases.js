class ProductManager {
    constructor() {
        this.products = [];
        this.id = 0;
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        let producto = this.products.find((product) => product.id == id);
        if(producto) return producto; else return 'Producto no encontrado';
    }

    addProduct( {title, description, price, thumbnail, code, stock} ) {
        if( title && description && price && thumbnail && code && stock ) {
            const product = {
                id: this.id,
                title: title,
                description: description,
                price: price,
                thumbnail: thumbnail,
                code: code,
                stock: stock,
            }

            const productExist = this.products.find((p) => p.code == product.code);

            if(!productExist) {
                this.id++;
                this.products.push(product);
                return 'El producto se añadió de forma exitosa';
            } else {
                return `Ya existe un producto con el código ${productExist.code}`;
            }
        } else {
            return 'Se requieren todos los campos';
        }
    }
}


// Proceso de Testing

const handlerProducts = new ProductManager();

let newProduct = {
    title: 'Producto prueba',
    description: 'Este es un producto de prueba',
    price: 200,
    thumbnail: "sin imagen",
    code: 'abc123',
    stock: 25,
}

// let newProduct2 = {
//     title: 'Producto prueba2',
//     description: 'Este es un producto de prueba2',
//     price: 2002,
//     thumbnail: "sin imagen2",
//     code: 'abc12322',
//     stock: 252,
// }

console.log("Primer prueba, devuelve arreglo vacio");
console.log(handlerProducts.getProducts());

console.log("Segunda prueba, agrego producto y lo muestro")
console.log(handlerProducts.addProduct(newProduct ));

// console.log("Segunda prueba, agrego producto y lo muestro")
// console.log(handlerProducts.addProduct(newProduct2 ));


console.log(handlerProducts.getProducts());

console.log("Tercer prueba, agrego el mismo producto (ID repetido) y da error")
console.log(handlerProducts.addProduct(newProduct));

console.log("Cuarta prueba, se ingresa un ID no existente y no se encuentra el producto");
console.log(handlerProducts.getProductById(50));

console.log("Quinta prueba, se ingresa un ID existente y se encuentra el producto");
console.log(handlerProducts.getProductById(0));