/**
 * Created by Soon on 2/22/16.
 */

import {
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from 'graphql';

import {
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
} from 'graphql-relay';

import logger from '../logger';

import { productType, productListType, cartType, cartEntryType } from './schema';

import CartEntry from './models/CartEntry';
import cartService from './services/cartService';

import ProductList from './models/ProductList';


export const { nodeInterface, nodeField } = nodeDefinitions(
  async(globalId, { rootValue }) => {
    logger.info(`Getting node data from globalId(${globalId})`);

    const { type, id } = fromGlobalId(globalId);

    if (type === 'CartEntry') {
      const cart = cartService.getSessionCart(rootValue.session);
      return cart.entries.find((entry)=> entry.id === id);
    }

    if (type === 'ProductList') {
      return new ProductList({});
    }

    return null;
  },
  (obj) => {
    if (obj instanceof CartEntry) {
      return cartEntryType;
    }

    if (obj instanceof ProductList) {
      return productListType;
    }

    return null;
  }
);

