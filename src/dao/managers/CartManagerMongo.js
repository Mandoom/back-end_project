// CartManagerMongo.js
import CartModel from '../models/CartModel.js';

export default class CartManager {
  async createCart() {
    
    return await CartModel.create({ products: [] });
  }

  async getCartById(id) {
    return await CartModel.findById(id).populate('products.product').lean();
  }

  async addProductToCart(cid, pid) {
    const cart = await CartModel.findById(cid);
    const index = cart.products.findIndex(p => p.product.toString() === pid);

    if (index !== -1) {
      cart.products[index].quantity += 1;
    } else {
      cart.products.push({ product: pid, quantity: 1 });
    }

    await cart.save();
    return cart;
  }

  async deleteProductFromCart(cid, pid) {
    const cart = await CartModel.findById(cid);
    cart.products = cart.products.filter(p => p.product.toString() !== pid);
    await cart.save();
    return cart;
  }

  async updateCart(cid, products) {
    const cart = await CartModel.findById(cid);
    cart.products = products;
    await cart.save();
    return cart;
  }

  async updateProductQuantity(cid, pid, quantity) {
    const cart = await CartModel.findById(cid);
    const product = cart.products.find(p => p.product.toString() === pid);
    if (product) {
      product.quantity = quantity;
    }
    await cart.save();
    return cart;
  }

  async clearCart(cid) {
    const cart = await CartModel.findById(cid);
    cart.products = [];
    await cart.save();
    return cart;
  }
}
