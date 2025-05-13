import ProductModel from '../models/ProductModel.js';

export default class ProductManager {
  async _getProducts(queryParams) {
    const { limit = 10, page = 1, sort, query } = queryParams;

    const filter = {};

    if (query) {
      if (query === 'disponibles') filter.stock = { $gt: 0 };
      else filter.category = query;
    }

    const options = {
      limit: parseInt(limit),
      page: parseInt(page),
      lean: true
    };

    if (sort === 'asc') options.sort = { price: 1 };
    if (sort === 'desc') options.sort = { price: -1 };

    return await ProductModel.paginate(filter, options);
  }

  async getProductById(id) {
    return await ProductModel.findById(id).lean();
  }

  async addProduct(productData) {
    return await ProductModel.create(productData);
  }

  async updateProduct(id, updateData) {
    return await ProductModel.findByIdAndUpdate(id, updateData, { new: true });
  }

  async deleteProduct(id) {
    return await ProductModel.findByIdAndDelete(id);
  }
}
