/**
 * Created by Soon on 2/23/16.
 */

import React, { PropTypes } from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import { Map } from 'immutable';

import Scroll from '../common/Scroll';
import CurveBall from '../common/CurveBall';


import CartWidget from '../cart/CartWidget';
import ProductEntry from './ProductEntry';

import AddToCartMutation from '../../mutations/AddToCartMutation';

const SIZE_PER_PAGE = 8; // 8 products per page

import '!style!css!postcss!sass!./ProductList.scss';
class ProductList extends React.Component {

  static propTypes = {
    productList: PropTypes.object,
    cart: PropTypes.object,
    relay: PropTypes.object,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      data: Map({
        isLoading: false,
        offsetTopToLoadNextPage: 0,
        size: SIZE_PER_PAGE,
        curveBallWidth: document.documentElement.clientWidth,
        curveBallHeight: document.documentElement.clientHeight,
        curveBallRadius: window.rem * 0.2,
      }),
    };
  }

  componentDidMount() {
    window.addEventListener('resize', this._handleResize);
    this.cartWidgetRect = this.getCartWidgetRect();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._handleResize);
  }

  setImmState = (fn)=>
    this.setState(({ data }) => ({
      data: fn(data),
    }));

  getCartWidgetRect = ()=> ReactDOM.findDOMNode(this.refs.cartWidget).getBoundingClientRect();

  resizeCurveBall = ()=> {
    this.cartWidgetRect = this.getCartWidgetRect();
    this.setImmState(d =>d
      .set('curveBallWidth', document.documentElement.clientWidth)
      .set('curveBallHeight', document.documentElement.clientHeight)
      .set('curveBallRadius', window.rem * 0.2)
    );
  };

  loadNextPage = ()=> {
    let { size } = this.state.data.toJS();
    this.setImmState(d => d.set('isLoading', true));
    const self = this;
    size = size + SIZE_PER_PAGE;

    this.props.relay.setVariables({ size }, (readyState)=> {
      if (readyState.ready) {
        self.setImmState(d => d.set('size', size).set('isLoading', false));
      }
    });
  };

  _handleAddToCartClick = (product, event)=> {
    const { cart } = this.props;
    const { curveBall } = this.refs;

    // we need to get the start & end points before throw the ball
    const startRect = event.target.getBoundingClientRect();
    const startX = startRect.left + startRect.width / 2;
    const startY = startRect.top + startRect.height / 2;

    const endRect = this.cartWidgetRect;
    const endX = endRect.left + endRect.width / 2;
    const endY = endRect.top + endRect.height / 2;

    const controlX = (startX + endX) / 2;

    // make the movement track of ball more curly
    const controlY = Math.min(startY - 150, endY - 150);
    const duration = 1000; // duration of animation, the smaller the faster

    // let's move the ball
    curveBall.animateCurveBallMoving(startX, startY, controlX, controlY, endX, endY, duration);

    Relay.Store.commitUpdate(
      new AddToCartMutation({ product, cart, quantity: 1 })
    );
  };

  _handleCartWidgetClick = ()=> {
    const { router } = this.context;
    router.push({ pathname: '/cart' });
  };

  _handleResize = ()=> {
    this.resizeCurveBall();
  };

  _handleScrollEnd = (event)=> {
    const { productList } = this.props;
    const { isLoading } = this.state.data.toJS();

    if (!isLoading) {
      const lastThirdItemDOM = [].slice.call(event.scroller.children, -3);
      if (lastThirdItemDOM.length > 0) {
        /* load next page once scroll to the last three item */
        const scrolledOffsetTop = Math.abs(event.y) + event.wrapperHeight + lastThirdItemDOM[0].offsetHeight;
        const offsetTopToLoadNextPage = lastThirdItemDOM[0].offsetTop;
        if (scrolledOffsetTop > offsetTopToLoadNextPage && productList.items.pageInfo.hasNextPage) {
          this.loadNextPage();
        }
      }
    }
  };

  _handleCurveBallStepEnd = ()=> {
    this.refs.cartWidget.scale();
  };

  render() {
    const { productList, cart } = this.props;
    const { curveBallWidth, curveBallHeight, curveBallRadius } = this.state.data.toJS();

    const entries = productList.items.edges.map(({ node: product })=> {
      const cartEntryEdge = cart.entries.edges.find(({ node: entry })=>entry.product.id === product.id);
      const cartQuantity = cartEntryEdge ? cartEntryEdge.node.quantity : 0;

      return (<ProductEntry product={product} key={product.id}>
        <div className="operation">
          <i className="icon ion-ios-plus" onClick={this._handleAddToCartClick.bind(this, product)}/>
          {
            cartQuantity > 0 &&
            <div className="cart-quantity">
              <div className="arrow-left"></div>
              <div className="quantity">{ cartQuantity }</div>
            </div>
          }
        </div>
      </ProductEntry>);
    });

    return (
      <div className="ProductList ScrollWrap">
        <Scroll onScrollEnd={this._handleScrollEnd}>
          <div className="entries">
            <div className="description">
              <p>{productList.totalNumberOfItems} results.</p>
            </div>
            {entries}
          </div>

          { /* show cart widget*/ }
          <CartWidget ref="cartWidget" number={cart.totalNumberOfItems} onClick={this._handleCartWidgetClick}/>

          { /* simulate a ball moving into the cart when click on plus button */ }
          <CurveBall width={curveBallWidth} height={curveBallHeight} radius={curveBallRadius} colorOfBall="#e76e41"
                     ref="curveBall" onStepEnd={this._handleCurveBallStepEnd}/>
        </Scroll>
      </div>
    );
  }
}

export default Relay.createContainer(ProductList, {

  initialVariables: {
    size: SIZE_PER_PAGE,
  },

  fragments: {
    productList: () => Relay.QL`
      fragment on ProductList {
        id
        items(first: $size) {
          edges {
            node {
              id
              ${ProductEntry.getFragment('product')}
              ${AddToCartMutation.getFragment('product')}
            }
          }
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
        }
        totalNumberOfItems
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
        ${AddToCartMutation.getFragment('cart')}
      }
    `,
  },
});
