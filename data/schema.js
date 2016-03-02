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


/**
 * This is the type that will be the root of our query,
 * and the entry point into our schema.
 *
 * This implements the following type system shorthand:
 *   type Query {
 *     factions(names: [FactionName]): [Faction]
 *     node(id: String!): Node
 *   }
 */
const queryType = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({

    product: queryProduct,
    productList: queryProductList,
    cart: queryCart,

    node: nodeField,
  }),
});

/**
 * This is the type that will be the root of our mutations,
 * and the entry point into performing writes in our schema.
 *
 * This implements the following type system shorthand:
 *   type Mutation {
 *     introduceShip(input IntroduceShipInput!): IntroduceShipPayload
 *   }
 */
const mutationType = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    addToCart: require('./mutations/addToCartMutation').default,
    removeFromCart: require('./mutations/removeFromCartMutation').default,
  }),
});

/**
 * Finally,  we construct our schema (whose starting query type is the query
 * type we defined above) and export it.
 */
export const Schema = new GraphQLSchema({
  query: queryType,
  mutation: mutationType,
});

export default Schema;
