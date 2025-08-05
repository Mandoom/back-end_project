import { Router } from 'express';

const router = Router();

// Crear nuevo carrito
router.post('/', async (req, res) => {
  try {
    const cartRepository = req.app.get('cartRepository');
    const newCart = await cartRepository.createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener carrito por ID
router.get('/:cid', async (req, res) => {
  try {
    const cartRepository = req.app.get('cartRepository');
    const cid = req.params.cid;
    const cart = await cartRepository.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.json(cart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Agregar producto al carrito
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cartRepository = req.app.get('cartRepository');
    const { cid, pid } = req.params;
    const updatedCart = await cartRepository.addProductToCart(cid, pid);
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar producto específico del carrito
router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const cartRepository = req.app.get('cartRepository');
    const { cid, pid } = req.params;
    const updatedCart = await cartRepository.deleteProductFromCart(cid, pid);
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reemplazar el arreglo de productos del carrito
router.put('/:cid', async (req, res) => {
  try {
    const cartRepository = req.app.get('cartRepository');
    const cid = req.params.cid;
    const products = req.body.products;
    const updatedCart = await cartRepository.updateCart(cid, products);
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar cantidad de un producto en el carrito
router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const cartRepository = req.app.get('cartRepository');
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const updatedCart = await cartRepository.updateProductQuantity(cid, pid, quantity);
    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Vaciar carrito
router.delete('/:cid', async (req, res) => {
  try {
    const cartRepository = req.app.get('cartRepository');
    const cid = req.params.cid;
    const clearedCart = await cartRepository.clearCart(cid);
    res.json(clearedCart);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
