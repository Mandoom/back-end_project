
class Product {
    constructor(name, description, price, thumbnail, code, stock) {
        this.name = name;
        this.description = description;
        this.price = price;
        this.thumbnail = thumbnail;
        this.code = code;
        this.stock = stock;
    }
}

const product1 = new Product("Longboard Deck", "Symmetrical Twin Tail Drop Trough Longboard, designed for all around freeriding and cruising", 189,"https:placehold.it/150*150", "pnm1", 5)
console.log (product1)

module.exports = Product;