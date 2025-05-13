import { Router } from 'express';

const router = Router();
router.get('/', async (req, res) => {
  try {
    const productManager = req.app.get('productManager');
    const result = await productManager._getProducts(req.query); // ✅ aquí pasas los query params
    const { docs, ...pagination } = result;

    const buildLink = (page) =>
      `http://localhost:8080/api/products?page=${page}${
        req.query.limit ? `&limit=${req.query.limit}` : ''
      }${
        req.query.sort ? `&sort=${req.query.sort}` : ''
      }${
        req.query.query ? `&query=${req.query.query}` : ''
      }`;

    res.json({
      status: 'success',
      payload: docs,
      totalPages: pagination.totalPages,
      prevPage: pagination.prevPage,
      nextPage: pagination.nextPage,
      page: pagination.page,
      hasPrevPage: pagination.hasPrevPage,
      hasNextPage: pagination.hasNextPage,
      prevLink: pagination.hasPrevPage ? buildLink(pagination.prevPage) : null,
      nextLink: pagination.hasNextPage ? buildLink(pagination.nextPage) : null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:pid', async (req, res) => {
  try {
    const productManager = req.app.get('productManager'); // aquí
    const pid = req.params.pid; //remove parsing, that makes the routes not work properly and create the products with 4 digit ids
    const product = await productManager.getProductById(pid);

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

router.post('/', async (req, res) => {
  try {
    const productManager = req.app.get('productManager');
    const io = req.app.get('io');

    const newProduct = await productManager.addProduct(req.body);

    const allProducts = await productManager._getProducts(req.query); // ✅ corregido
    io.emit('products', allProducts);

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:pid', async (req, res) => {
  const productManager = req.app.get('productManager');
  const updatedProduct = await productManager.updateProduct(req.params.pid, req.body);
  res.json(updatedProduct);
});

router.delete('/:pid', async (req, res) => {
  const productManager = req.app.get('productManager');
  const io = req.app.get('io');
  await productManager.deleteProduct(req.params.pid)
  ;
  const allProducts = await productManager._getProducts();
  io.emit('products', allProducts);
  res.json({ message: 'Producto eliminado' });
});

export default router;
