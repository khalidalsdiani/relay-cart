/**
 * Created by Soon on 2/26/16.
 */

import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { Map } from 'immutable';
import classNames from 'classnames';

import AddToCartMutation from '../../mutations/AddToCartMutation';
import RemoveFromCartMutation from '../../mutations/RemoveFromCartMutation';

import ProductEntry from '../product/ProductEntry';
import InputQuantity from '../form/InputQuantity';

import './Cart.scss';
class Cart extends React.Component {

  static propTypes = {
    cart: PropTypes.object,
  };

  static contextTypes = {
    router: React.PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      data: Map({}),
    };
  }

  setImmState = (fn)=>
    this.setState(({ data }) => ({
      data: fn(data),
    }));

  _handleEntryQuantityChange = (cartEntry, quantity)=> {
    const { cart } = this.props;
    if (quantity === 0) {
      Relay.Store.commitUpdate(
        new RemoveFromCartMutation({ cart, cartEntry })
      );
    } else {
      Relay.Store.commitUpdate(
        new AddToCartMutation({ cart, product: cartEntry.product, quantity: quantity - cartEntry.quantity })
      );
    }
  };

  render() {
    const { cart } = this.props;
    const {} = this.state.data.toJS();

    const entries = cart.entries.edges.map(({ node: cartEntry })=>
      <ProductEntry product={cartEntry.product} key={cartEntry.id}>
        <div className="operation">
          <InputQuantity value={cartEntry.quantity}
                         onQuantityChange={this._handleEntryQuantityChange.bind(this, cartEntry)}/>
        </div>
      </ProductEntry>
    );

    return (
      <div className="Cart">
        <div className="entries">
          <div className="description">
            <p>Subtotal ({cart.totalNumberOfItems} items): <span
              className="price">$ {cart.totalPriceOfItems.toFixed(2)}</span></p>
          </div>
          {entries}
        </div>
      </div>
    );
  }
}

export default Relay.createContainer(Cart, {

  initialVariables: {},

  fragments: {
    cart: () => Relay.QL`
      fragment on Cart {
        id
        entries(first: 100){
          edges {
            node {
              id
              product{
                id
                ${ProductEntry.getFragment('product')}
                ${AddToCartMutation.getFragment('product')}
              }
              quantity
              ${RemoveFromCartMutation.getFragment('cartEntry')}
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
        }
        totalNumberOfItems
        totalPriceOfItems
        ${AddToCartMutation.getFragment('cart')}
        ${RemoveFromCartMutation.getFragment('cart')}
      }
    `,
  },
});
