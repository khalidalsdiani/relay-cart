/**
 * Created by Xin on 17/04/2017.
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
  cursorForObjectInConnection, cursorToOffset,
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
  toGlobalId,
} from 'graphql-relay';

import { nodeInterface } from '../defaultDefinitions';

import logger from '../../logger';
import { productConnectionType } from './productType';
import productService from '../services/productService';


export const productsType = new GraphQLObjectType({
  name: 'Products',
  fields: () => ({
    id: globalIdField('Products'),
    items: {
      type: productConnectionType,
      args: connectionArgs,
      resolve: ({ items, totalNumberOfItems }, args) => {
        logger.info('Resolving queryProductList with params:', { args });
        // const start = args.after ? cursorToOffset(args.after) + 1 : 0;
        // const size = (args.first || 8) + 1;

        // const result = productService.findAll({ start, size });

        // support pagination
        // const array = args.after ? new Array(start).concat(result.items) : result.items;
        const connection = connectionFromArray(
          items,
          args,
        );

        connection.totalElements = totalNumberOfItems;
        connection.pageInfo.hasNextPage = !args.last;
        connection.pageInfo.hasPreviousPage = !args.first;

        return connection;
      },
    },
  }),
  interfaces: [nodeInterface],
});

export const { connectionType: productsConnectionType, edgeType: productsEdgeType } =
  connectionDefinitions({
    name: 'Products',
    nodeType: productsType,
    connectionFields: {
      totalNumberOfItems: {
        type: GraphQLInt,
      },
    },
  });

export const queryProducts = {
  type: productsType,
  args: {
    id: {
      type: GraphQLID,
    },
  },
  resolve: async (rootValue, { id }, { api }) => {
    logger.info('Resolving queryProducts with params:', { id });

    return {};
  },
};


export default productsType;
