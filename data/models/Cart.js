/**
 * Created by Soon on 2/26/16.
 */

export default class Cart {

  constructor({ entries }) {
    this.entries = entries;
  }

  get totalNumberOfItems() {
    let totalNumberOfItems = 0;
    if (this.entries.length > 0) {
      for (let i = 0; i < this.entries.length; ++i) {
        totalNumberOfItems += this.entries[i].quantity;
      }
    }

    return totalNumberOfItems;
  }

  get totalPriceOfItems() {
    let totalPriceOfItems = 0;
    if (this.entries.length > 0) {
      for (let i = 0; i < this.entries.length; ++i) {
        const entry = this.entries[i];
        totalPriceOfItems += entry.quantity * entry.product.price;
      }
    }

    return totalPriceOfItems.toFixed(2);
  }
}
