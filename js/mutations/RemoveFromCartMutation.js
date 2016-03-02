/**
 * Created by Soon on 3/1/16.
 */

import Relay from 'react-relay';

export default class RemoveFromCartMutation extends Relay.Mutation {
  static fragments = {
    cartEntry: () => Relay.QL`
      fragment on CartEntry {
        id,
      }
    `,
    cart: () => Relay.QL`
      fragment on Cart {
        id,
      }
    `,
  };

  getMutation() {
    return Relay.QL`mutation{removeFromCart}`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on RemoveFromCartPayload {
        deletedCartEntryId
        cart{
          id
          totalNumberOfItems
          totalPriceOfItems
        }
      }
    `;
  }

  getConfigs() {
    return [{
      type: 'NODE_DELETE',
      parentName: 'cart',
      parentID: this.props.cart.id,
      connectionName: 'entries',
      deletedIDFieldName: 'deletedCartEntryId',
    }];
  }

  getVariables() {
    return {
      id: this.props.cartEntry.id,
    };
  }

  getOptimisticResponse() {
    return {

    };
  }
}
