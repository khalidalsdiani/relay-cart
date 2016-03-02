/**
 * Created by Soon on 2/23/16.
 */

import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLInt,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  cursorForObjectInConnection,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
  offsetToCursor,
  toGlobalId,
} from 'graphql-relay';

import cartEntryType, { cartEntryEdge } from '../types/cartEntryType';
import cartType from '../types/cartType';

import cartService from '../services/cartService';
import productService from '../services/productService';

const addToCartMutation = mutationWithClientMutationId({
  name: 'AddToCart',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
    quantity: { type: GraphQLInt },
  },
  outputFields: {
    entryEdge: {
      type: cartEntryEdge,
      resolve: async({ cart, cartEntry }) => {
        logger.info('Resolving addToCartMutation.entryEdge with params :', {});

        return {
          cursor: cursorForObjectInConnection(cart.entries, cartEntry),
          node: cartEntry,
        };
      },
    },
    cartEntry: {
      type: cartEntryType,
      resolve: async({ cartEntry }) => {
        logger.info('Resolving addToCartMutation.cartEntry with params :', {});

        return cartEntry;
      },
    },
    cart: {
      type: cartType,
      resolve: async({ cart }) => {
        logger.info('Resolving addToCartMutation.cart with params :', {});

        return cart;
      },
    },
  },
  mutateAndGetPayload: async({ id, quantity }, { rootValue }) => {
    logger.info('Invoke addToCartMutation with params:', { id, quantity });
    const cart = cartService.getSessionCart(rootValue.session);

    const localProductId = fromGlobalId(id).id;
    const product = productService.findById(localProductId);

    const cartEntry = cartService.addToCart(cart, product.productCode, quantity);

    return { cartEntry, cart };
  },
});

export default addToCartMutation;
