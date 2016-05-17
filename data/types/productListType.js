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
import { productConnection } from './productType';

import productService from '../services/productService';

import { nodeInterface } from '../defaultDefinitions';
export const productListType = new GraphQLObjectType({
  name: 'ProductList',
  description: 'Just productList',
  fields: () => ({
    id: globalIdField('ProductList'),
    items: {
      type: productConnection,
      description: 'The items of product list .',
      args: {
        ...connectionArgs,
      },
      resolve: ({}, { ...args })=> {
        logger.info('Resolving queryProductList with params:', { ...args });
        const start = args.after ? cursorToOffset(args.after) + 1 : 0;
        const size = (args.first || 8) + 1;

        const result = productService.findAll({ start, size });

        // support pagination
        const array = args.after ? new Array(start).concat(result.items) : result.items;

        return connectionFromArray(
          array,
          args
        );
      },
    },
    totalNumberOfItems: {
      type: GraphQLInt,
      description: 'The total number of items.',
      resolve: ({}, {})=> {
        const start = 0;
        const size = 1;
        const result = productService.findAll({ start, size });
        return result.totalNumberOfItems;
      },
    },
  }),
  interfaces: [nodeInterface],
});

export const { connectionType: productListConnection, edgeType: productListEdge } =
  connectionDefinitions({ name: 'ProductList', nodeType: productListType });

export const queryProductList = {
  type: productListType,
  args: {},
  resolve: ({}) => {
    logger.info('Resolving queryProductList with params:', {});

    return {};
  },
};


export default productListType;
