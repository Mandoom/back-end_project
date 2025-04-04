class ProductManager {
 
    constructor() {
       this.products = [];
       this.nextId = 1;
    }

    addProduct(product) { //añade el prodcto, no lo creamos
        //validate all fields are filled
        if (!product.name || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
                console.log("Error, product Data Incomplete")
                return;
            }
        // do not repeat code 
        if (this.products.some( p => p.code === product.code)) {
            console.log("ya existe este codigo de producto ")
        }
        product.id = this.nextId // assign auto increment variable
        this.nextId ++ //increment variable
        //add product
        this.products.push(product)

    }; // add product end

    getProducts() {
        return this.products
    };

    getProductById (id) {

       const productToFind = this.products.find (p => p.id === is)
       

       if (productToFind) {
        return productToFind
       } else { 
        console.log("not found")
       }
    };
}


const stock = new ProductManager()
stock.addProduct(1)
stock.getProductById(1)

module.exports = ProductManager;