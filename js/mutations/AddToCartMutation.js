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
    const { cart, product } = this.props;
    const cartEntry = cart.entries.edges.find(({ node: entry })=>entry.product.id === product.id);
    const configs = [];

    // whether the product is new to the cart
    if (cartEntry) {
      configs.push({
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          cartEntry: cartEntry.node.id,
        },
      });
    } else {
      configs.push({
        type: 'RANGE_ADD',
        parentName: 'cart',
        parentID: this.props.cart.id,
        connectionName: 'entries',
        edgeName: 'entryEdge',
        rangeBehaviors: {
          '': 'append',
        },
      });

      configs.push({
        type: 'REQUIRED_CHILDREN',
        // Forces these fragments to be included in the query
        children: [Relay.QL`
          fragment on AddToCartPayload {
            entryEdge
          }
        `],
      });
    }

    // 'totalNumberOfItems' of cart needs to be update
    configs.push({
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        cart: cart.id,
      },
    });

    return configs;
  }

  getVariables() {
    return {
      id: this.props.product.id,
      quantity: this.props.quantity,
    };
  }

  getOptimisticResponse() {
    const { product, cart, quantity } = this.props;
    const cartEntry = cart.entries.edges.find(({ node: entry })=>entry.product.id === product.id);

    const payloads = {};

    // whether the product is new to the cart
    if (cartEntry) {
      // just update the quantity of cartEntry if it is existed already
      payloads.cartEntry = {
        id: cartEntry.node.id,
        quantity: cartEntry.node.quantity + quantity,
      };
    } else {
      payloads.entryEdge = {
        node: {
          product,
        },
      };
    }

    // update 'totalNumberOfItems' of cart optimistically
    payloads.cart = {
      id: cart.id,
      totalNumberOfItems: cart.totalNumberOfItems + quantity,
      totalPriceOfItems: cart.totalPriceOfItems + quantity * product.price,
    };

    return payloads;
  }
}
