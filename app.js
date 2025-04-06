import express from 'express';
import ProductManager from './managers/ProductManager.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Crear __dirname para ES modules usando import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Construir la ruta absoluta al archivo de productos
const absoluteFilePath = path.join(__dirname, './data/products.json');

// Crear una instancia de ProductManager
const productManager = new ProductManager(absoluteFilePath);

const app = express();
const PORT = 3000;

// Middleware para parsear JSON en el cuerpo de la petición
app.use(express.json());

// Endpoint para obtener todos los productos
app.get('/products', async (req, res) => {
  try {
    const products = await productManager._getProducts();
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving products' });
  }
});

// Endpoint para obtener un producto por su id
app.get('/products/:pid', async (req, res) => {
  try {
    const productId = parseInt(req.params.pid, 10);
    const product = await productManager.getProductById(productId);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving product' });
  }
});

// Endpoint para agregar un nuevo producto
app.post('/products', async (req, res) => {
  try {
    const productData = req.body;
    const newProduct = await productManager.addProduct(productData);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});