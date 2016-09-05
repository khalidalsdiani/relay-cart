/**
 * Created by Soon on 3/1/16.
 */

import Relay from 'react-relay';

export default class RemoveFromCartMutation extends Relay.Mutation {
  static fragments = {
    cartEntry: () => Relay.QL`
      fragment on CartEntry {
        id
        quantity
        price
        totalPrice
      }
    `,
    cart: () => Relay.QL`
      fragment on Cart {
        id
        totalNumberOfItems
        totalPriceOfItems
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
    const { cart, cartEntry } = this.props;

    const cartPayload = {
      totalNumberOfItems: cart.totalNumberOfItems - cartEntry.quantity,
      totalPriceOfItems: cart.totalPriceOfItems - cartEntry.totalPrice,
    };

    return {
      deletedCartEntryId: this.props.cartEntry.id,
      cart: cartPayload,
    };
  }
}
