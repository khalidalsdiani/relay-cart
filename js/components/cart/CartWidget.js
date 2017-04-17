/**
 * Created by Soon on 2/25/16.
 */

import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import { Map } from 'immutable';
import classNames from 'classnames';

import Portal from '../common/Portal';
import CurveBall from '../common/CurveBall';

import './CartWidget.scss';

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
      data: Map({
        curveBallWidth: document.documentElement.clientWidth,
        curveBallHeight: document.documentElement.clientHeight,
        curveBallRadius: window.rem * 0.2,
      }),
    };
  }

  componentDidMount() {

    window.addEventListener('resize', this.handleResize);
    this.cartIconDOM = ReactDOM.findDOMNode(this.cartIcon);
    this.cartIconRect = this.cartIconDOM.getBoundingClientRect();

    this.cartIconDOM.addEventListener('webkitAnimationEnd', function () {
      this.classList.remove('scale');
    });
  }

  componentWillUnmount() {
    this.cartIconDOM.removeEventListener('webkitAnimationEnd', function () {

    });
  }

  setImmState = (fn)=>
    this.setState(({ data }) => ({
      data: fn(data),
    }));

  /**
   * duration: duration of animation, the smaller the faster
   */
  animateCurveBall = (startX, startY, duration = 1000)=> {
    const endRect = this.cartIconRect;
    const endX = endRect.left + (endRect.width / 2);
    const endY = endRect.top;

    const controlX = (startX + endX) / 2;

    // make the movement track of ball more curly
    const controlY = Math.min(startY - 150, endY - 150);

    // let's move the ball
    this.curveBall.animateCurveBallMoving(startX, startY, controlX, controlY, endX, endY, duration);
  };

  resizeCurveBall = ()=> {
    this.cartIconRect = this.cartIconDOM.getBoundingClientRect();
    this.setImmState(d =>d
      .set('curveBallWidth', document.documentElement.clientWidth)
      .set('curveBallHeight', document.documentElement.clientHeight)
      .set('curveBallRadius', 15)
    );
  };

  scale = ()=> {
    const { cartIcon } = this.refs;
    // 'webkitAnimationEnd' event will finish ahead of time if we don't wrap with setTimeout
    // and then 'scale' will not remove from classList
    setTimeout(()=> {
      cartIcon.classList.add('scale');
    }, 0);
  };


  handleResize = ()=> {
    this.resizeCurveBall();
  };


  handleCartWidgetClick = ()=> {
    const { onClick } = this.props;
    if (typeof onClick === 'function') {
      onClick();
    }
  };

  handleCurveBallStepEnd = ()=> {
    setTimeout(()=> {
      this.cartIconDOM.classList.add('scale');
    }, 0);
  };

  render() {
    const { number } = this.props;
    const { curveBallWidth, curveBallHeight, curveBallRadius } = this.state.data.toJS();
    const isEmpty = number === 0;

    const iconClassnames = classNames('icon', {
      'ion-ios-cart-outline': isEmpty,
      'ion-ios-cart': !isEmpty,
    });

    return (

      <div className="CartWidget" onClick={this.handleCartWidgetClick} >
        <i className={iconClassnames} ref={(c) => { this.cartIcon = c; }} />
        <span className="bubble" >{number}</span>
        <Portal>
          { /* simulate a ball moving into the cart when click on plus button */ }
          <CurveBall
            width={curveBallWidth} height={curveBallHeight} radius={curveBallRadius} colorOfBall="#e76e41"
            ref={(c) => { this.curveBall = c; }} onStepEnd={this.handleCurveBallStepEnd} />
        </Portal>
      </div>


    );
  }
}
