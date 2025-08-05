import { Router } from 'express';

const router = Router();

router.get('/products', async (req, res) => {
  const productRepository = req.app.get('productRepository');
  const result = await productRepository.getProducts(req.query);

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
  const productRepository = req.app.get('productRepository');
  const product = await productRepository.getProductById(req.params.pid);
  if (!product) return res.status(404).send('Producto no encontrado');
  res.render('productDetails', { product });
});

router.get('/carts/:cid', async (req, res) => {
  const cartRepository = req.app.get('cartRepository');
  const cart = await cartRepository.getCartById(req.params.cid);
  if (!cart) return res.status(404).send('Carrito no encontrado');
  res.render('cart', { cart });
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.get('/register', (req, res) => {
  res.render('register');
});

export default router;
