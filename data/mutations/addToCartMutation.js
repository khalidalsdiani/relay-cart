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

import logger from '../../logger';

import cartEntryType, { cartEntryEdgeType } from '../types/cartEntryType';
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
    cartEntryEdge: {
      type: cartEntryEdgeType,
    },
    cartEntry: {
      type: cartEntryType,
    },
    cart: {
      type: cartType,
    },
  },
  mutateAndGetPayload: async({ id, quantity }, session) => {
    logger.info('Invoke addToCartMutation with params:', { id, quantity });
    const cart = cartService.getSessionCart(session);

    const localProductId = fromGlobalId(id).id;
    const product = productService.findById(localProductId);

    const cartEntry = cartService.addToCart(cart, product.productCode, quantity);
    const cartEntryEdge = {
      cursor: cursorForObjectInConnection(cart.entries, cartEntry),
      node: cartEntry,
    };

    return { cartEntry, cartEntryEdge, cart };
  },
});

export default addToCartMutation;
