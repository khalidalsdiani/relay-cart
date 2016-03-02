/**
 * Created by Soon on 2/23/16.
 */
import Relay from 'react-relay';
export default {
  cart: () => Relay.QL` query { cart } `,
};

