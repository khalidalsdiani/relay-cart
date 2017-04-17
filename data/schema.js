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

import { nodeField } from './defaultDefinitions';
export * from './defaultDefinitions';

import { productType, queryProduct } from './types/productType';
export * from './types/productType';

import { productListType, queryProductList } from './types/productListType';
export * from './types/productListType';

import { cartType, queryCart } from './types/cartType';
export * from './types/cartType';

import { cartEntryType, queryCartEntry } from './types/cartEntryType';
export * from './types/cartEntryType';


const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({

    product: queryProduct,
    productList: queryProductList,
    cart: queryCart,

    node: nodeField,
  }),
});

const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addToCart: require('./mutations/addToCartMutation').default,
    removeFromCart: require('./mutations/removeFromCartMutation').default,
  }),
});

export const Schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});

export default Schema;
