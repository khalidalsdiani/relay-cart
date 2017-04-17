/**
 * Created by Soon on 2/28/16.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay';
import { Map } from 'immutable';
import classNames from 'classnames';

import Price from '../common/Price';

import './CartEntry.scss';


class CartEntry extends React.Component {

  static propTypes = {
    product: PropTypes.object,
    children: PropTypes.object,
    onAddToCartClick: PropTypes.func,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
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

  render() {
    const { cartEntry, children } = this.props;
    const {} = this.state.data.toJS();
    const product = cartEntry.product;
    const totalPrice = product.price * cartEntry.quantity;

    return (
      <div className="CartEntry entry" >
        <a className="link" >
          <img className="image" src={product.images[0].url} />
        </a>
        <div className="info" >
          <div className="description" >{product.name}</div>
          { children }
          <Price value={totalPrice}/>
        </div>
      </div>
    );
  }
}


export default Relay.createContainer(CartEntry, {

  fragments: {
    cartEntry: () => Relay.QL`
      fragment on CartEntry {
        id
        product{
          id
          name
          price
          images(format: "thumbnail"){
            url
          }
        }
        quantity
      }
    `,
  },
});
