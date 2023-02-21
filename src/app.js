import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import { default as productsRouter } from "./routes/products.js";
import { default as cartsRouter } from "./routes/carts.js";
import { default as viewsRouter } from "./routes/views.js";
import __dirname from "./utils.js";
import ProductManager from "./services/ProductManager.js";

const PORT = process.env.PORT || 8080;
const app = express();

app.engine(
  'handlebars',
  handlebars.engine()
);
app.set("views",__dirname+'/views');
app.set("view engine", 'handlebars');


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter)
app.use(express.static(__dirname+'/public'));
app.use("/", viewsRouter);

const httpServer = app.listen(PORT, () => {
  console.log(`Express server listening on port ${PORT}`);
  //console.log(__dirname);
});

const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {
  console.log("Nuevo cliente en socket!");
  
  socket.on('new-product', async () => {
    const handlerProducts = new ProductManager("./src/database/Productos.json");
    let productos = []
    try {
      productos = await handlerProducts.getProducts();
    } catch (e) {
      productos = [];
    }
    socketServer.sockets.emit('all_productos', productos);
  });
});

const handlerProducts = new ProductManager("./src/database/Productos.json");






// const getProducts = async () => {
//   let productos = [];
//   let hayProductos = false;

//   try {
//     productos = await handlerProducts.getProducts();
//     hayProductos = productos.length > 0;
//   } catch (error) {
//     console.error(error);
//   }

//   return {
//     title: 'Productos',
//     hayProductos: hayProductos,
//     productos: productos
//   };
// };

// app.get('/', async (request, response) => {
//   try {
//     const data = await getProducts();
//     response.render('home', data);
//   } catch (error) {
//     console.error(error);
//     response.sendStatus(500);
//   }
// });