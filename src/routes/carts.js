import { Router } from 'express';
import CartManager from '../managers/CartManager.js';

const absolutePath = new URL('../data/carts.json', import.meta.url).pathname;
const cartManager = new CartManager(absolutePath);

const router = Router();

router.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:cid', async (req, res) => {
  try {
    const cid = parseInt(req.params.cid, 10);
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
    const cid = parseInt(req.params.cid, 10);
    const pid = parseInt(req.params.pid, 10);
    const updatedCart = await cartManager.addProductToCart(cid, pid);
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;