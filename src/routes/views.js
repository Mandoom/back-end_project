import { Router } from 'express';

const router = Router();

router.get('/products', async (req, res) => {
  const productManager = req.app.get('productManager');
  const result = await productManager._getProducts(req.query);

  res.render('home', {
    products: result.docs,
    pagination: {
      page: result.page,
      totalPages: result.totalPages,
      hasNextPage: result.hasNextPage,
      hasPrevPage: result.hasPrevPage,
      nextPage: result.nextPage,
      prevPage: result.prevPage
    }
  });
});

router.get('/products/:pid', async (req, res) => {
  const productManager = req.app.get('productManager');
  const product = await productManager.getProductById(req.params.pid);
  if (!product) return res.status(404).send('Producto no encontrado');
  res.render('productDetails', { product });
});

router.get('/carts/:cid', async (req, res) => {
  const cartManager = req.app.get('cartManager');
  const cart = await cartManager.getCartById(req.params.cid);
  if (!cart) return res.status(404).send('Carrito no encontrado');
  res.render('cart', { cart });
});

export default router;
