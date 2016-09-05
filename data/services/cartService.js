/**
 * Created by Soon on 2/26/16.
 */
import Cart from '../models/Cart';
import CartEntry from '../models/CartEntry';
import Product from '../models/Product';
export const cartService = {
  addToCart: (cart, productCode, quantity)=> {
    let cartEntry = cart.entries.find((entry)=>entry.product.productCode === productCode);
    const product = Product.findOne({ productCode });

    if (cartEntry) {
      cartEntry.quantity = quantity;
      cartEntry.price = product.price;
      cartEntry.totalPrice = (product.price * quantity).toFixed(2);
    } else {
      cartEntry = new CartEntry({ id: product.id, product, quantity });
      cart.entries.push(cartEntry);
    }

    return cartEntry;
  },
  removeFromCart: (cart, cartEntryId)=> {
    cart.entries = cart.entries.filter((entry)=>entry.id !== cartEntryId);
  },
  createNewCart: (session)=> {
    const cart = new Cart({
      entries: [],
    });

    Object.defineProperty(session, 'cart', {
      enumerable: true,
      writeable: true,
      value: cart,
    });

    return cart;
  },
  getSessionCart: (session)=> {
    let cart = session.cart;

    if (!cart) {
      cart = cartService.createNewCart(session);
    }

    return cart;
  },
};

export default cartService;
