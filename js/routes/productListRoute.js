/**
 * Created by Soon on 2/23/16.
 */
export default {
  path: 'product-list',
  getComponent(nextState, cb) {
    const self = this;
    require.ensure([], (require) => {
      self.queries = require('../queries/productListQueries').default;
      const component = require('../components/product/ProductList').default;

      self.component = component;
      self.queryParams = ['categoryCode', 'text'];
      cb(null, component);
    });
  },
};
