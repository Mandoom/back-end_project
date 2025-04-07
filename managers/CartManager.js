// managers/CartManager.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// Convertir import.meta.url a ruta de archivo
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class CartManager {
  constructor(filePath) {
    this.path = filePath;
  }

  async _getCarts() {
    try {
      const data = await fs.readFile(this.path, "utf8");
      if (!data) return [];
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') return [];
      else throw error;
    }
  }

  async _saveCarts(carts) {
    await fs.writeFile(this.path, JSON.stringify(carts, null, 2));
  }

  async createCart() {
    const carts = await this._getCarts();
    let newId = carts.length === 0 ? 1 : carts[carts.length - 1].id + 1;
    const newCart = { id: newId, products: [] };
    carts.push(newCart);
    await this._saveCarts(carts);
    return newCart;
  }

  async getCartById(id) {
    const carts = await this._getCarts();
    return carts.find(cart => cart.id === id);
  }

  async addProductToCart(cartId, productId) {
    const carts = await this._getCarts();
    const index = carts.findIndex(cart => cart.id === cartId);
    if (index === -1) {
      throw new Error('Carrito no encontrado');
    }
    const cart = carts[index];
    // Si el producto ya existe en el carrito, incrementar la cantidad
    const productIndex = cart.products.findIndex(p => p.product === productId);
    if (productIndex === -1) {
      cart.products.push({ product: productId, quantity: 1 });
    } else {
      cart.products[productIndex].quantity += 1;
    }
    carts[index] = cart;
    await this._saveCarts(carts);
    return cart;
  }
}

export default CartManager;
