// public/js/cartManager.js

async function getOrCreateCartId() {
    let cartId = localStorage.getItem('cartId');
  
    if (!cartId) {
      const res = await fetch('/api/carts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      cartId = data._id;
      localStorage.setItem('cartId', cartId);
    }
  
    return cartId;
  }
  