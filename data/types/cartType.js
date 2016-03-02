/**
 * Created by Soon on 2/23/16.
 */

import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
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
  cursorForObjectInConnection,
  cursorToOffset,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
  toGlobalId,
} from 'graphql-relay';

import cartEntryType, { cartEntryConnection } from './cartEntryType';

import cartService from '../services/cartService';

import { nodeInterface } from '../defaultDefinitions';
export const cartType = new GraphQLObjectType({
  name: 'Cart',
  description: 'Just cart',
  fields: () => ({
    id: globalIdField('Cart'),
    entries: {
      type: cartEntryConnection,
      args: {
        ...connectionArgs,
      },
      resolve: ({ entries }, { ...args }, { rootValue })=> {
        logger.info('Resolving cartType.entries with params:', { ...args });

        return connectionFromArray(
          entries,
          args
        );
      },
    },
    totalNumberOfItems: {
      type: GraphQLInt,
      description: 'The total number of items.',
    },
    totalPriceOfItems: {
      type: GraphQLFloat,
      description: 'The total prices of items.',
    },
  }),
  interfaces: [nodeInterface],
});

export const { connectionType: cartConnection, edgeType: cartEdge } =
  connectionDefinitions({ name: 'Cart', nodeType: cartType });

export const queryCart = {
  type: cartType,
  args: {},
  resolve: async({}, {}, { rootValue, request }) => {
    logger.info('Resolving queryCart with params:', {});

    return cartService.getSessionCart(rootValue.session);
  },
};


export default cartType;
