/**
 * Created by Soon on 2/25/16.
 */

import React, { PropTypes } from 'react';
import { Map } from 'immutable';
import classNames from 'classnames';

import '!style!css!postcss!sass!./CartWidget.scss';
export default class CartWidget extends React.Component {

  static propTypes = {
    number: PropTypes.number,
    onClick: PropTypes.func,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static defaultProps = {
    number: 0,
  };

  constructor(props) {
    super(props);
    this.state = {
      data: Map({}),
    };
  }

  componentDidMount() {
    const { cartIcon } = this.refs;
    cartIcon.addEventListener('webkitAnimationEnd', function removeScala() {
      this.classList.remove('scale');
    });
  }

  componentWillUnmount() {
    const { cartIcon } = this.refs;
    cartIcon.removeEventListener('webkitAnimationEnd');
  }

  setImmState = (fn)=>
    this.setState(({ data }) => ({
      data: fn(data),
    }));

  scale = ()=> {
    const { cartIcon } = this.refs;
    // 'webkitAnimationEnd' event will finish ahead of time if we don't wrap with setTimeout
    // and then 'scale' will not remove from classList
    setTimeout(()=> {
      cartIcon.classList.add('scale');
    }, 0);
  };

  _handleCartWidgetClick = ()=> {
    const { onClick } = this.props;
    if (typeof onClick === 'function') {
      onClick();
    }
  };

  render() {
    const { number } = this.props;
    const { } = this.state.data.toJS();
    const isEmpty = number === 0;

    const iconClassnames = classNames('icon', {
      'ion-ios-cart-outline': isEmpty,
      'ion-ios-cart': !isEmpty,
    });

    return (
      <div className="CartWidget" onClick={this._handleCartWidgetClick}>
        <i className={iconClassnames} ref="cartIcon"/>
        <span className="bubble">{number}</span>
      </div>
    );
  }
}
