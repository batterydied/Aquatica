// CartModel
import { Sequelize, DataTypes } from "sequelize";


const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite",
});

const Cart = sequelize.define("Cart", {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  productId: { type: DataTypes.STRING, allowNull: false },
  quantity: { type: DataTypes.INTEGER, defaultValue: 1 },
  isSaved: { type: DataTypes.BOOLEAN, defaultValue: false },
});

class CartModel {
  async init() {
    await sequelize.sync();
  }

  async getCartItems() {
    return await Cart.findAll({ where: { isSaved: false } });
  }

  async addCartItem(item) {
    return await Cart.create(item);
  }

  async removeCartItem(itemId) {
    return await Cart.destroy({ where: { id: itemId } });
  }

  async saveForLater(itemId) {
    const item = await Cart.findByPk(itemId);
    item.isSaved = true;
    await item.save();
    return item;
  }

  async moveToCart(itemId) {
    const item = await Cart.findByPk(itemId);
    item.isSaved = false;
    await item.save();
    return item;
  }
}

export default new CartModel();

