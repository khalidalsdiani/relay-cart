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
        entries(first: 100){
          edges {
            node {
              id
              product{
                id
              }
              quantity
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
        }
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
        cartEntryEdge 
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
    const { cart, product } = this.props;
    const configs = [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        cart: cart.id,
      },
    }];

    const cartEntryEdge = cart.entries.edges.find(({ node: en })=>en.product.id === product.id);

    if (!cartEntryEdge) {
      configs.push({
        type: 'RANGE_ADD',
        parentName: 'cart',
        parentID: cart.id,
        connectionName: 'entries',
        edgeName: 'cartEntryEdge',
        rangeBehaviors: {
          '': 'prepend',
        },
      }, {
        type: 'REQUIRED_CHILDREN',
        // Forces these fragments to be included in the query
        children: [Relay.QL`
          fragment on AddToCartPayload {
            cartEntryEdge
          }
        `],
      });
    } else {
      configs.push({
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          cart: cart.id,
          cartEntry: cartEntryEdge.node.id,
        },
      });
    }

    return configs;
    // return [{
    //   type: 'FIELDS_CHANGE',
    //   fieldIDs: {
    //     cart: this.props.cart.id,
    //   },
    // }, {
    //   type: 'RANGE_ADD',
    //   parentName: 'cart',
    //   parentID: this.props.cart.id,
    //   connectionName: 'entries',
    //   edgeName: 'cartEntryEdge',
    //   rangeBehaviors: {
    //     '': 'append',
    //   },
    // }];
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
      totalNumberOfItems: cart.totalNumberOfItems,
      totalPriceOfItems: cart.totalPriceOfItems,
    };

    let cartEntryPayload;

    let cartEntryEdge = cart.entries.edges.find(({ node: entry })=>entry.product.id === product.id);

    if (cartEntryEdge) {
      cartEntryPayload = cartEntryEdge.node;
      const marginQuantity = quantity - cartEntryPayload.quantity;
      cartPayload.totalNumberOfItems += marginQuantity;
      cartEntryPayload.quantity = quantity;
      cartPayload.totalPriceOfItems += (marginQuantity * product.price);
    } else {
      cartEntryPayload = {
        quantity,
        product,
      };
      cartEntryEdge = {
        node: cartEntryPayload,
      };
      cartPayload.totalNumberOfItems += quantity;
      cartPayload.totalPriceOfItems += (quantity * product.price);
    }

    return {
      cartPayload,
      cartEntryEdge,
      cartEntryPayload
    };
  }
}
