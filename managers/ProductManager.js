import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';


// Convert the import.meta.url to a file path
const __filename = fileURLToPath(import.meta.url);
// Get the directory name from the file path
const __dirname = path.dirname(__filename);

const absoluteFilePath = path.join(__dirname, '../data/products.json');
console.log(absoluteFilePath);


class ProductManager {
    constructor(filePath) {
        this.path = filePath; // we will be working wit a file
    }

    // Read File Method to invoke insiode other methods
    async _getProducts() {
       try {

        const data =  await fs.readFile(this.path, "utf8")
        console.log(data)
        return JSON.parse(data)    
        
       } catch (error) {
        if (error.code === 'ENOENT') {
            return []; //if the file dosnt exist return empty array.
          } else {
            console.error("Error reading file:", error);
            throw error; // trow any other errors
          }
       }

    }; // end read file 

    async _saveProducts(products) { // modularize for add procts and others.
      await fs.writeFile(this.path, JSON.stringify(products, null, 2));
    };

    async addProduct(product) {

        const requiredFields = [
          'title', 
          'description', 
          'price', 
          'thumbnail', 
          'code', 
          'stock',
          'category',
          'thumbnails'
        ];

        for (const field of requiredFields) {
          if (!product.hasOwnProperty(field) || product[field] === undefined) {
            throw new Error(`El campo '${field}' es obligatorio.`);
          }
        }

        // Leer productos existentes o inicializar un arreglo vacío
        const products = await this._getProducts();
        // generate self increasing id account for 0 products and existing products
        let newId;
        if (products.length === 0) { //if there are no products, start with id 
        newId = 1;
        } else { // if there are products find the lenght of the array
        const lastProduct = products[products.length - 1];
        newId = lastProduct.id + 1;
        }
        const newProduct = { id: newId, ...product };
        // Agregar el nuevo producto al arreglo
        products.push(newProduct);
        // Guardar el arreglo actualizado en el archivo
        await this._saveProducts(products);
        return newProduct;
      }

      async getProductById(id) {
        // Lee todos los productos
        const products = await this._getProducts();
        // Busca y retorna el producto cuyo id coincida
        return products.find(product => product.id === id);
      }

      async updateProduct(id, updateData){

        const products = await this._getProducts();
        const index = products.findIndex(product => product.id === id );
        if (index === -1) {
          throw new Error('Product no encontrado');

          //Avoid updating the id

          delete updateData.id; //delete the property 
          const updatedProduct = {...products[index], ...updateData};
          products[index] = this.updateProduct;
          await this_saveProducts(products);
          return updatedProduct;
        }
      }

      async deleteProduct(id) {

        const products = await this._getProducts();
        const newProducts = products.filter(product => product.id !== id);
        if (newProducts.lenght === products.lenght) {
          throw new Error('Producto no encontrado')
        }

        await this._saveProducts(newProducts);
        return true;

      };
}


export default ProductManager;

