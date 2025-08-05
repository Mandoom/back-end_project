// src/repositories/CartRepository.js
export default class CartRepository {
  constructor(dao) {
    this.dao = dao;
  }

  createCart() {
    return this.dao.createCart();
  }

  getCartById(id) {
    return this.dao.getCartById(id);
  }

  addProductToCart(cid, pid) {
    return this.dao.addProductToCart(cid, pid);
  }

  deleteProductFromCart(cid, pid) {
    return this.dao.deleteProductFromCart(cid, pid);
  }

  updateCart(cid, products) {
    return this.dao.updateCart(cid, products);
  }

  updateProductQuantity(cid, pid, quantity) {
    return this.dao.updateProductQuantity(cid, pid, quantity);
  }

  clearCart(cid) {
    return this.dao.clearCart(cid);
  }
}