const socket = io();

socket.on('products', products => {
  const list = document.getElementById('productList');
  list.innerHTML = '';
  products.forEach(product => {
    const li = document.createElement('li');
    li.innerHTML = `${product.title} - $${product.price} 
      <button onclick="deleteProduct(${product.id})">Eliminar</button>`;
    list.appendChild(li);
  });
});

document.getElementById('addForm').addEventListener('submit', e => {
  e.preventDefault();
  const form = e.target;
  const formData = new FormData(form);
  const product = Object.fromEntries(formData.entries());
  product.price = Number(product.price);
  product.stock = Number(product.stock);
  socket.emit('addProduct', product);
  form.reset();
});

function deleteProduct(id) {
  socket.emit('deleteProduct', id);
}
