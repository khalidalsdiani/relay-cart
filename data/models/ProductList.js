/**
 * Created by Soon on 2/25/16.
 */

import Product from './Product';

export default class ProductList {
  static findAll = ({ start, size })=> {
    const products = Product.getAll();
    const items = products.slice(start, start + size);
    const totalNumberOfItems = products.length;

    return new ProductList({
      items,
      totalNumberOfItems,
    });
  };

  constructor({ items, totalNumberOfItems }) {
    this.items = items;
    this.totalNumberOfItems = totalNumberOfItems;
  }
}
