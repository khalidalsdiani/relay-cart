/**
 * Created by Soon on 2/26/16.
 */
export default {
  path: 'cart',
  getComponent(nextState, cb) {
    const self = this;
    require.ensure([], (require) => {
      self.queries = require('../queries/viewerQueries').default;
      const component = require('../components/cart/Cart').default;

      self.component = component;
      cb(null, component);
    });
  },
};
