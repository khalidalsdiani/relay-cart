/**
 * Created by Soon on 2/26/16.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay';
import { Map } from 'immutable';
import debounce from 'lodash/debounce';
import classNames from 'classnames';

import Price from '../common/Price';

import AddToCartMutation from '../../mutations/AddToCartMutation';
import RemoveFromCartMutation from '../../mutations/RemoveFromCartMutation';

import CartEntry from '../cart/CartEntry';
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

  addToCartDebounce = debounce(()=> {
    this.addToCartTransaction.commit();
    this.addToCartTransaction = null;
  }, 500);

  addToCart = (product, quantity)=> {
    const { relay, cart } = this.props;
    return relay.applyUpdate(new AddToCartMutation({ cart, product, quantity }), {
      onSuccess: () => {
        console.log('added to cart!');
      },
      onFailure: async(tansition) => {
        let errors;
        if (tansition.getError().source) {
          errors = tansition.getError() && tansition.getError().source.errors;
        } else {
          errors = (await tansition.getError().json()).errors;
        }
        errors.forEach((error)=> {
          Toast.fail(error.message, 10);
        });
      },
    });
  };


  removeFromCart = (cartEntry)=> {
    const { relay, cart } = this.props;
    return relay.applyUpdate(new RemoveFromCartMutation({ cart, cartEntry }));
  };

  /**
   *
   * @param cartEntry
   * @param quantity
   */
  handleEntryQuantityChange = async(cartEntry, quantity)=> {
    if (this.addToCartTransaction) {
      await this.addToCartTransaction.rollback();
    }
    if (quantity < 1) {
      this.addToCartTransaction = await this.removeFromCart(cartEntry);
    } else {
      this.addToCartTransaction = await this.addToCart(cartEntry.product, quantity);
    }
    this.addToCartDebounce();
  };

  render() {
    const { cart } = this.props;
    const {} = this.state.data.toJS();

    const entries = cart.entries.edges.map(({ node: cartEntry })=>
      <CartEntry cartEntry={cartEntry} key={cartEntry.id} >
        <div className="operation" >
          <InputQuantity value={cartEntry.quantity}
                         onQuantityChange={this.handleEntryQuantityChange.bind(this, cartEntry)} />
        </div>
      </CartEntry>
    );

    return (
      <div className="Cart" >
        <div className="entries" >
          <div className="description" >
            <p>Subtotal ({cart.totalNumberOfItems} items): <Price value={cart.totalPriceOfItems}/></p>
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
                ${AddToCartMutation.getFragment('product')}
              }
              quantity
              ${RemoveFromCartMutation.getFragment('cartEntry')}
              ${CartEntry.getFragment('cartEntry')}
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
