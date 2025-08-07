import { Router } from 'express';

import  authorize  from '../utils/authorize.js';
import ProductModel from '../dao/models/ProductModel.js'; // para descontar stock directamente
import TicketRepository from '../dao/repositories/TicketRepository.js';
import jwt from 'jsonwebtoken';
import passport from 'passport';

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
router.post('/:cid/product/:pid', passport.authenticate('jwt', { session: false }), authorize(['user']), async (req, res) => {
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
// ruta p´rotegida user para comprar
router.post('/:cid/purchase', passport.authenticate('jwt', { session: false }),  authorize(['user']), async (req, res) => {
  const cartRepo = req.app.get('cartRepository');
  const productRepo = req.app.get('productRepository');
  const ticketRepo = req.app.get('ticketRepository');

  const cartId = req.params.cid;
  const userEmail = req.user.email;

  const cart = await cartRepo.getCartById(cartId);
  if (!cart) return res.status(404).json({ error: 'Carrito no encontrado' });

  const purchasedProducts = [];
  const productsOutOfStock = [];
  let totalAmount = 0;

  for (const item of cart.products) {
    const product = await productRepo.getProductById(item.product._id);

    if (product.stock >= item.quantity) {
      await productRepo.updateProductStock(product._id, product.stock - item.quantity);


      totalAmount += product.price * item.quantity;
      purchasedProducts.push({ product: product._id, quantity: item.quantity });
    } else {
      productsOutOfStock.push({
        product: product._id,
        requested: item.quantity,
        available: product.stock
      });
    }
  }

  // Generar ticket si hay productos comprados
  let ticket = null;
  if (purchasedProducts.length > 0) {
    ticket = await ticketRepo.createTicket({
      amount: totalAmount,
      purchaser: userEmail,
      products: purchasedProducts
    });

    // Eliminar del carrito los productos comprados
    const remainingProducts = cart.products.filter(
  item => !purchasedProducts.find(p => p.product.toString() === item.product._id.toString())
  );
  await cartRepo.updateCartProducts(cartId, remainingProducts); //
  }

  res.json({
    ticket,
    productsNotPurchased: productsOutOfStock
  });
});

export default router;
