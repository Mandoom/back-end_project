import express from 'express';
import ProductManager from './managers/ProductManager.js';
//import CartManager from './managers/CartManager.js'
import path from 'path';
import { fileURLToPath } from 'url';

// Crear __dirname para ES modules usando import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// absolute routes for JSON files.
const absoluteProductsPath = path.join(__dirname, './data/products.json');
//const absoluteCartsPath = path.join(__dirname, '.data/carts.json')

// Crear una instancia de ProductManager
const productManager = new ProductManager(absoluteProductsPath);

const app = express();
const PORT = 8080;

// Middleware para parsear JSON en el cuerpo de la petición
app.use(express.json());

const productRouter = express.Router();

productRouter.get('/', async (req,res) => {
  try {
    const products = await productManager._getProducts();
    res.json({products});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});

// Endpoint para obtener todos los productos
// app.get('/products', async (req, res) => {
//   try {
//     const products = await productManager._getProducts();
//     res.json({ products });
//   } catch (error) {
//     res.status(500).json({ error: 'Error retrieving products' });
//   }
// });

productRouter.get('/:pid', async (req, res) => { 
  try {
    const pid = parseInt(req.params.pid, 10);
    const product = await productManager.getProductById(pid);
    if (!product) {
      return res.status(404).json({error: 'Product no encontrado'})
    }
    res.json(product);
    
  } catch (error) {
    res.status(500).json({error: error.message})
    
  }
});

// Endpoint para obtener un producto por su id
// app.get('/products/:pid', async (req, res) => {
//   try {
//     const productId = parseInt(req.params.pid, 10);
//     const product = await productManager.getProductById(productId);
//     if (!product) {
//       return res.status(404).json({ error: 'Producto no encontrado' });
//     }
//     res.json(product);
//   } catch (error) {
//     res.status(500).json({ error: 'Error retrieving product' });
//   }
// });

// Endpoint para agregar un nuevo producto
// app.post('/products', async (req, res) => {
//   try {
//     const productData = req.body;
//     const newProduct = await productManager.addProduct(productData);
//     res.status(201).json(newProduct);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

productRouter.post('/', async (req, res) => {
  try {
    const productData = req.body;
    const newProduct = await productManager.addProduct(productData);
    res.status(201).json(newProduct);    
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})


productRouter.put('/:pid', async (req, res) => {
  try {
    const pid = parseInt(req.params.pid, 10);
    const updateData = req.body;
    const updateddProduct = await productManager.updateProduct(pid, updateData);
    res.json(updateProduct);    
  } catch (error) {
    res.status(500),json({ error: error.message });
  }
});

productRouter.delete('/:pid', async (req, res) => {
  try {
    const pid = parseInt(req.params.pid, 10);
    await productManager.deleteProduct(pid);
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});