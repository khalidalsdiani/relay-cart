/**
 * Created by Soon on 2/23/16.
 */

import ProductList from '../models/ProductList';
import Product from '../models/Product';

export const productService = {
  findAll: ({ start, size }) => ProductList.findAll({ start, size }),
  findOne: ({ productCode }) => Product.findOne({ productCode }),
  findById: id => Product.findById(id),
};

export default productService;
