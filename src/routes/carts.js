import { Router } from 'express';
import CartManager from '../dao/managers/CartManagerMongo.js';

const router = Router();

router.post('/', async (req, res) => {
  try {
    const cartManager = req.app.get('cartManager');
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const cartManager = req.app.get('cartManager');
    const cid = req.params.cid;
    const cart = await cartManager.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cartManager = req.app.get('cartManager');
    const cid = req.params.cid;
    const pid = req.params.pid;
    const updatedCart = await cartManager.addProductToCart(cid, pid);
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const cartManager = req.app.get('cartManager');
    const cid = req.params.cid;
    const pid = req.params.pid;
    const updatedCart = await cartManager.deleteProductFromCart(cid, pid);
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:cid', async (req, res) => {
  try {
    const cartManager = req.app.get('cartManager');
    const cid = req.params.cid;
    const products = req.body.products;
    const updatedCart = await cartManager.updateCart(cid, products);
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const cartManager = req.app.get('cartManager');
    const cid = req.params.cid;
    const pid = req.params.pid;
    const { quantity } = req.body;
    const updatedCart = await cartManager.updateProductQuantity(cid, pid, quantity);
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:cid', async (req, res) => {
  try {
    const cartManager = req.app.get('cartManager');
    const cid = req.params.cid;
    const clearedCart = await cartManager.clearCart(cid);
    res.json(clearedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
