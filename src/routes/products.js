import { Router } from 'express';
import ProductManager from '../managers/ProductManager.js';

const absolutePath = new URL('../data/products.json', import.meta.url).pathname;
const productManager = new ProductManager(absolutePath);
const router = Router();

router.get('/', async (req,res) => {
  try {
    const products = await productManager._getProducts();
    res.json({products});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});



router.get('/:pid', async (req, res) => { 
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



router.post('/', async (req, res) => {
  try {
    const productData = req.body;
    const newProduct = await productManager.addProduct(productData);
    res.status(201).json(newProduct);    
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})


router.put('/:pid', async (req, res) => {
  try {
    const pid = parseInt(req.params.pid, 10);
    const updateData = req.body;
    const updatedProduct = await productManager.updateProduct(pid, updateData);
    res.json(updatedProduct);    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:pid', async (req, res) => {
  try {
    const pid = parseInt(req.params.pid, 10);
    await productManager.deleteProduct(pid);
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;