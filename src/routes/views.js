import { Router } from 'express';

const router = Router();

router.get('/', async (req, res) => {
  const pm = req.app.get('productManager');
  const products = await pm._getProducts();
  res.render('home', { products });
});

router.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts');
});

export default router;

