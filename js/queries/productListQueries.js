/**
 * Created by Soon on 2/23/16.
 */
import Relay from 'react-relay';
export default {
  productList: () => Relay.QL` query { productList } `,
  cart: () => Relay.QL` query { cart } `,
};

