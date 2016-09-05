/**
 * Created by Soon on 2/23/16.
 */

import React, { PropTypes } from 'react';
import Relay from 'react-relay';
import { Map } from 'immutable';
import debounce from 'lodash/debounce';

import Scroll from '../common/Scroll';

import CartWidget from '../cart/CartWidget';
import ProductEntry from './ProductEntry';

import AddToCartMutation from '../../mutations/AddToCartMutation';

const SIZE_PER_PAGE = 8; // 8 products per page

import './ProductList.scss';

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
      }),
    };
  }

  setImmState = (fn)=>
    this.setState(({ data }) => ({
      data: fn(data),
    }));

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


  /**
   *
   * @param target index of stepper
   */
  animateCurveBall = (target)=> {
    // we need to get the start & end points before animate
    const startRect = target.getBoundingClientRect();
    const startX = startRect.left + (startRect.width / 2);
    const startY = startRect.top + (startRect.height / 2);

    const duration = 800; // duration of animation, the smaller the faster

    // let's move the ball
    this.cartWidget.animateCurveBall(startX, startY, duration);
  };

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

  /**
   *
   * @param product
   * @param quantity
   * @param event
   */
  handleAddToCartClick = async(product, quantity, event)=> {
    this.animateCurveBall(event.target);

    if (this.addToCartTransaction) {
      await this.addToCartTransaction.rollback();
    }

    this.addToCartTransaction = await this.addToCart(product, quantity);
    this.addToCartDebounce();
  };

  handleCartWidgetClick = ()=> {
    const { router } = this.context;
    router.push({ pathname: '/cart' });
  };

  handleScrollEnd = (event)=> {
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

  render() {
    const { productList, cart } = this.props;

    const entries = productList.items.edges.map(({ node: product })=> {
      const cartEntryEdge = cart.entries.edges.find(({ node: entry })=>entry.product.id === product.id);
      const cartQuantity = cartEntryEdge ? cartEntryEdge.node.quantity : 0;

      return (<ProductEntry product={product} key={product.id} >
        <div className="operation" >
          <i className="icon ion-ios-add-circle"
             onClick={this.handleAddToCartClick.bind(this, product, cartQuantity+1)} />
          {
            cartQuantity > 0 &&
            <div className="cart-quantity" >
              <div className="arrow-left" ></div>
              <div className="quantity" >{ cartQuantity }</div>
            </div>
          }
        </div>
      </ProductEntry>);
    });

    return (
      <div className="ProductList ScrollWrap" >
        <Scroll onScrollEnd={this.handleScrollEnd} >
          <div className="entries" >
            <div className="description" >
              <p>{productList.totalNumberOfItems} results.</p>
            </div>
            {entries}
          </div>

          { /* show cart widget*/ }
          <CartWidget
            number={cart.totalNumberOfItems} ref={(c)=>{ this.cartWidget = c; }}
            onClick={this.handleCartWidgetClick} />
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
