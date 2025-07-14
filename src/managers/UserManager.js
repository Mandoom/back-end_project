import UserModel from '../models/UserModel.js';

export default class UserManager {
  async createUser(userData) {
    return await UserModel.create(userData);
  }

  async getUserByEmail(email) {
    return await UserModel.findOne({ email }).populate('cart');
  }

  async getUserById(id) {
    return await UserModel.findById(id).populate('cart');
  }
}