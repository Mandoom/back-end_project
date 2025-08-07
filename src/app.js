import dotenv from 'dotenv';
dotenv.config(); // ✅ debe ir lo más arriba posible

import express from 'express';
import handlebars from 'express-handlebars';
import path from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import { Server } from 'socket.io';

import productRouter from './routes/products.js';
import cartRouter    from './routes/carts.js';
import viewsRouter from './routes/views.js'
import ProductManager from './dao/managers/ProductManagerMongo.js';
import CartManager from './dao/managers/CartManagerMongo.js';

import ProductRepository from './dao/repositories/ProductRepository.js';
import CartRepository from './dao/repositories/CartRepository.js';



// instance of the repositories
const productRepository = new ProductRepository(new ProductManager());
const cartRepository = new CartRepository(new CartManager());

import mongoose from 'mongoose';
// Session routes
import sessionRouter from './routes/sessions.js';
import passport from './config/passport.js';

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
app.engine('handlebars', handlebars.engine({
  helpers: {
    multiply: (a, b) => a * b,
    calculateTotal: (products) => {
      return products.reduce((total, item) => {
        return total + item.product.price * item.quantity;
      }, 0);
    }
  }
}));
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'views'));

// Middleware: process JSON and set 'public ' dir
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'public')));
app.use(express.urlencoded({ extended: true }));

// Repositories
app.set('productRepository', productRepository);
app.set('cartRepository', cartRepository);

// WebSocket (for real-time updates in views)
app.set('io', io);

// Use with /api/ as convention for specifieng endpoints that are just for data, separated from endpoints that serve views 
app.use('/', viewsRouter);
app.use('/api/products', productRouter);
app.use('/api/carts'   , cartRouter);

// use passport 
app.use(passport.initialize());
app.use('/api/sessions', sessionRouter);

// WebSocket
io.on('connection', async (socket) => {
  console.log('Nuevo cliente conectado');
  
  // Emitimos productos actuales al conectar
  const products = await productRepository.getProducts(); // reemplazado
  socket.emit('products', products);

  socket.on('addProduct', async (productData) => {
    await productRepository.createProduct(productData); // renombrado
    const allProducts = await productRepository.getProducts(); // reemplazado
    io.emit('products', allProducts);
  });

  socket.on('deleteProduct', async (id) => {
    await productRepository.deleteProduct(id);
    const allProducts = await productRepository.getProducts(); // reemplazado
    io.emit('products', allProducts);
  });
});

const PORT = 8080;
httpServer.listen(PORT, () => {
  console.log(`Servidor activo en http://localhost:${PORT}`);
});
