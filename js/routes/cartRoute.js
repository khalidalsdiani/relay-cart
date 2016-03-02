/**
 * Created by Soon on 2/26/16.
 */
export default {
  path: '/cart',
  getComponent(location, cb) {
    const self = this;
    require.ensure([], (require) => {
      self.queries = require('../queries/cartQueries').default;
      const component = require('../components/cart/Cart').default;

      self.component = component;
      cb(null, component);
    });
  },
};
