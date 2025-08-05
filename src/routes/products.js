import { Router } from 'express';

const router = Router();

// Obtener productos paginados, filtrados y ordenados
router.get('/', async (req, res) => {
  try {
    const productRepository = req.app.get('productRepository');
    const result = await productRepository.getProducts(req.query);
    const { docs, ...pagination } = result;

    const buildLink = (page) =>
      `http://localhost:8080/api/products?page=${page}` +
      (req.query.limit ? `&limit=${req.query.limit}` : '') +
      (req.query.sort ? `&sort=${req.query.sort}` : '') +
      (req.query.query ? `&query=${req.query.query}` : '');

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

// Obtener un producto por ID
router.get('/:pid', async (req, res) => {
  try {
    const productRepository = req.app.get('productRepository');
    const pid = req.params.pid;
    const product = await productRepository.getProductById(pid);

    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear un nuevo producto
router.post('/', async (req, res) => {
  try {
    const productRepository = req.app.get('productRepository');
    const io = req.app.get('io');

    const newProduct = await productRepository.createProduct(req.body);

    const allProducts = await productRepository.getProducts(req.query);
    io.emit('products', allProducts);

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un producto existente
router.put('/:pid', async (req, res) => {
  try {
    const productRepository = req.app.get('productRepository');
    const updatedProduct = await productRepository.updateProduct(req.params.pid, req.body);
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un producto
router.delete('/:pid', async (req, res) => {
  try {
    const productRepository = req.app.get('productRepository');
    const io = req.app.get('io');

    await productRepository.deleteProduct(req.params.pid);

    const allProducts = await productRepository.getProducts();
    io.emit('products', allProducts);

    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
