/**
 * Created by Soon on 2/28/16.
 */

import React from 'react';
import PropTypes from 'prop-types';
import Relay from 'react-relay';
import { Map } from 'immutable';
import classNames from 'classnames';

import Price from '../common/Price';

import './ProductEntry.scss';


class ProductEntry extends React.Component {

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
    const { product, children } = this.props;
    const {} = this.state.data.toJS();

    return (
      <div className="ProductEntry entry" >
        <a className="link" >
          <img className="image" src={product.images[0].url} />
        </a>
        <div className="info" >
          <div className="description" >{product.name}</div>
          <Price value={product.price}/>
          { children }
        </div>
      </div>
    );
  }
}


export default Relay.createContainer(ProductEntry, {

  fragments: {
    product: () => Relay.QL`
      fragment on Product {
        id
        name
        price
        images(format: "thumbnail"){
          url
        }
      }
    `,
  },
});
