/**
 * Created by Soon on 2/26/16.
 */

export default class CartEntry {
  constructor({ id, product, quantity }) {
    this.id = id;
    this.product = product;
    this.quantity = quantity;
    this.price = product.price;
    this.totalPrice = (product.price * quantity).toFixed(2);
  }
}
