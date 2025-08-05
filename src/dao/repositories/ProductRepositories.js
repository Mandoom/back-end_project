export default class ProductRepository {
  constructor(dao) {
    this.dao = dao;
  }

  getProducts(queryParams) {
    return this.dao._getProducts(queryParams);
  }

  getProductById(id) {
    return this.dao.getProductById(id);
  }

  createProduct(productData) {
    return this.dao.addProduct(productData);
  }

  updateProduct(id, updateData) {
    return this.dao.updateProduct(id, updateData);
  }

  deleteProduct(id) {
    return this.dao.deleteProduct(id);
  }
}