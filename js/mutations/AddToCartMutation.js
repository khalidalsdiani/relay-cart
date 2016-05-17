/**
 * Created by Soon on 2/28/16.
 */

import Relay from 'react-relay';

export default class AddToCartMutation extends Relay.Mutation {
  static fragments = {
    product: () => Relay.QL`
      fragment on Product {
        id
        price
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
    return Relay.QL`mutation{addToCart}`;
  }

  getFatQuery() {
    return Relay.QL`
      fragment on AddToCartPayload {
        entryEdge
        cart{
          id
          entries
          totalNumberOfItems
          totalPriceOfItems
        }
        cartEntry{
          id
          quantity
        }
      }
    `;
  }

  getConfigs() {

    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        cart: this.props.cart.id,
      },
    }, {
      type: 'RANGE_ADD',
      parentName: 'cart',
      parentID: this.props.cart.id,
      connectionName: 'entries',
      edgeName: 'cartEntryEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }];
  }

  getVariables() {
    return {
      id: this.props.product.id,
      quantity: this.props.quantity,
    };
  }

  getOptimisticResponse() {
    const { product, cart, quantity } = this.props;

    const cartPayload = {
      id: cart.id,
      totalNumberOfItems: cart.totalNumberOfItems + quantity,
      totalPriceOfItems: cart.totalPriceOfItems + quantity * product.price,
    };

    const cartEntryEdgePayload = {
      node: {
        quantity,
      },
    };

    return {
      cartPayload,
      cartEntryEdgePayload
    };
  }
}
