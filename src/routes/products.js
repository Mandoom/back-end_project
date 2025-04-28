import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  const productManager = req.app.get('productManager');
  const products = await productManager._getProducts();
  res.json({ products });
});

router.get('/:pid', async (req, res) => {
  const productManager = req.app.get('productManager');
  const product = await productManager.getProductById(parseInt(req.params.pid));
  if (!product) return res.status(404).json({ error: 'Producto no encontrado' });
  res.json(product);
});

router.post('/', async (req, res) => {
  const productManager = req.app.get('productManager');
  const io = req.app.get('io');
  const newProduct = await productManager.addProduct(req.body);
  const allProducts = await productManager._getProducts();
  io.emit('products', allProducts);
  res.status(201).json(newProduct);
});

router.put('/:pid', async (req, res) => {
  const productManager = req.app.get('productManager');
  const updatedProduct = await productManager.updateProduct(parseInt(req.params.pid), req.body);
  res.json(updatedProduct);
});

router.delete('/:pid', async (req, res) => {
  const productManager = req.app.get('productManager');
  const io = req.app.get('io');
  await productManager.deleteProduct(parseInt(req.params.pid));
  const allProducts = await productManager._getProducts();
  io.emit('products', allProducts);
  res.json({ message: 'Producto eliminado' });
});

export default router;
