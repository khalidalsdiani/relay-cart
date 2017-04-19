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
import { cartType } from './cartType';
import cartService from '../services/cartService';
import productService from '../services/productService';
import { productsType } from './productsType';
import { productConnectionType } from './productType';


export const viewerType = new GraphQLObjectType({
  name: 'Viewer',
  fields: () => ({
    id: globalIdField('Viewer'),
    name: {
      type: GraphQLString,
    },
    cart: {
      type: cartType,
      resolve: ({}, { args }, session) => cartService.getSessionCart(session),
    },
    products: {
      type: productConnectionType,
      args: connectionArgs,
      resolve: ({}, args) => {
        logger.info('Resolving queryProductList with params:', { args });
        const start = args.after ? cursorToOffset(args.after) + 1 : 0;
        const size = (args.first || 8) + 1;

        const result = productService.findAll({ start, size });

        // support pagination
        const array = args.after ? new Array(start).concat(result.items) : result.items;
        const connection = connectionFromArray(
          array,
          args,
        );

        connection.totalNumberOfItems = result.totalNumberOfItems;
        connection.pageInfo.hasNextPage = !args.last;
        connection.pageInfo.hasPreviousPage = !args.first;

        return connection;
      },
    },
  }),
  interfaces: [nodeInterface],
});

export const { connectionType: viewerConnectionType, edgeType: viewerEdgeType } =
  connectionDefinitions({ name: 'Viewer', nodeType: viewerType });

export const queryViewer = {
  type: viewerType,
  args: {
    id: {
      type: GraphQLID,
    },
  },
  resolve: async (rootValue, { id }) => {
    logger.info('Resolving queryViewer with params:', { id });

    return {};
  },
};


export default viewerType;
