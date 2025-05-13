import express from 'express';
import { engine } from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server } from 'socket.io';

import productRouter from './routes/products.js';
import cartRouter    from './routes/carts.js';
import viewsRouter from './routes/views.js'
import ProductManager from './dao/managers/ProductManagerMongo.js';
import CartManager from './dao/managers/CartManagerMongo.js';



import mongoose from 'mongoose';




const MONGO_URL = 'mongodb://localhost:27017/ecommerce';

mongoose.connect(MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error(' Error de conexión a MongoDB:', err));

// Crear __dirname para ES modules usando import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



const app = express();
const httpServer = http.createServer(app);
const io = new Server(httpServer);


// handlebars set up with engine()
app.engine('handlebars', engine())
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'));


// Middleware: process JSON and set 'public ' dir
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));


const productManager = new ProductManager();
app.set('productManager', productManager);
const cartManager = new CartManager();
app.set('cartManager', cartManager);
app.set('io', io);


// Use with /api/ as convention for specifieng endpoints that are just for data, separated from endpoints that serve views 
app.use('/', viewsRouter);
app.use('/api/products', productRouter);
app.use('/api/carts'   , cartRouter);

// WebSocket
io.on('connection', async (socket) => {
  console.log('Nuevo cliente conectado');
  const products = await productManager._getProducts();
  socket.emit('products', products);

  socket.on('addProduct', async (productData) => {
    await productManager.addProduct(productData);
    const allProducts = await productManager._getProducts();
    io.emit('products', allProducts);
  });

  socket.on('deleteProduct', async (id) => {
    await productManager.deleteProduct(id);
    const allProducts = await productManager._getProducts();
    io.emit('products', allProducts);
  });
});

const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});