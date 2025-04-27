import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

import productRouter from './routes/products.js';
import cartRouter    from './routes/carts.js';

// import ProductManager from './managers/ProductManager.js';
// import CartManager from './managers/CartManager.js'


// Crear __dirname para ES modules usando import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// absolute routes for JSON files. --moved to routes directly.
// const absoluteProductsPath = path.join(__dirname, './data/products.json');
// const absoluteCartsPath = path.join(__dirname, './data/carts.json')

// rutas absolutas a los JSON
const absoluteProductsPath = path.join(__dirname, 'data', 'products.json');
const absoluteCartsPath    = path.join(__dirname, 'data', 'carts.json');

// Crear una instancia de ProductManager
//const productManager = new ProductManager(absoluteProductsPath);
//const cartManager = new CartManager(absoluteCartsPath);

const app = express();
const PORT = 8080;

// Middleware para parsear JSON en el cuerpo de la petición
app.use(express.json());



// const productRouter = express.Router();

// productRouter.get('/', async (req,res) => {
//   try {
//     const products = await productManager._getProducts();
//     res.json({products});
//   } catch (error) {
//     res.status(500).json({error: error.message});
//   }
// });



// productRouter.get('/:pid', async (req, res) => { 
//   try {
//     const pid = parseInt(req.params.pid, 10);
//     const product = await productManager.getProductById(pid);
//     if (!product) {
//       return res.status(404).json({error: 'Product no encontrado'})
//     }
//     res.json(product);
    
//   } catch (error) {
//     res.status(500).json({error: error.message})
    
//   }
// });



// productRouter.post('/', async (req, res) => {
//   try {
//     const productData = req.body;
//     const newProduct = await productManager.addProduct(productData);
//     res.status(201).json(newProduct);    
//   } catch (error) {
//     res.status(500).json({ error: error.message })
//   }
// })


// productRouter.put('/:pid', async (req, res) => {
//   try {
//     const pid = parseInt(req.params.pid, 10);
//     const updateData = req.body;
//     const updatedProduct = await productManager.updateProduct(pid, updateData);
//     res.json(updatedProduct);    
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// productRouter.delete('/:pid', async (req, res) => {
//   try {
//     const pid = parseInt(req.params.pid, 10);
//     await productManager.deleteProduct(pid);
//     res.json({ message: 'Producto eliminado' });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });


// const cartRouter = express.Router();

// cartRouter.post('/', async (req, res) => {
//   try {
//     const newCart = await cartManager.createCart();
//     res.status(201).json(newCart);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// cartRouter.get('/:cid', async (req, res) => {
//   try {
//     const cid = parseInt(req.params.cid, 10);
//     const cart = await cartManager.getCartById(cid);
//     if (!cart) {
//       return res.status(404).json({ error: 'Carrito no encontrado' });
//     }
//     res.json(cart);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// cartRouter.post('/:cid/product/:pid', async (req, res) => {
//   try {
//     const cid = parseInt(req.params.cid, 10);
//     const pid = parseInt(req.params.pid, 10);
//     const updatedCart = await cartManager.addProductToCart(cid, pid);
//     res.json(updatedCart);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

//  app.use('/products', productRouter);
//  app.use('/carts', cartRouter);


// use with /api/ as convention for specifieng endpoints that are just for data, separated from endpoints that serve views ,  fro example
app.use('/api/products', productRouter);
app.use('/api/carts'   , cartRouter);



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});