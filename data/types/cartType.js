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

import logger from '../../logger';
import cartEntryType, { cartEntryConnectionType } from './cartEntryType';

import cartService from '../services/cartService';

import { nodeInterface } from '../defaultDefinitions';
export const cartType = new GraphQLObjectType({
  name: 'Cart',
  fields: () => ({
    id: globalIdField('Cart'),
    entries: {
      type: cartEntryConnectionType,
      args: connectionArgs,
      resolve: ({ entries }, args) => {
        logger.info('Resolving cartType.entries with params:', args);

        const connection = connectionFromArray(
          entries,
          args,
        );
        return connection;
      },
    },
    totalNumberOfItems: {
      type: GraphQLInt,
    },
    totalPriceOfItems: {
      type: GraphQLFloat,
    },
  }),
  interfaces: [nodeInterface],
});

export const { connectionType: cartConnectionType, edgeType: cartEdgeType } =
  connectionDefinitions({
    name: 'Cart',
    nodeType: cartType,
    connectionFields: {
      totalNumberOfItems: {
        type: GraphQLInt,
      },
    },
  });

export const queryCart = {
  type: cartType,
  args: {},
  resolve: ({}, {}, session) => {
    logger.info('Resolving queryCart with params:', {});

    return cartService.getSessionCart(session);
  },
};


export default cartType;
