/**
 * Created by Soon on 2/22/16.
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
  fromGlobalId,
  globalIdField,
  mutationWithClientMutationId,
  nodeDefinitions,
  toGlobalId,
} from 'graphql-relay';

import logger from '../../logger';
import imageType from './imageType';

import { nodeInterface } from '../defaultDefinitions';
export const productType = new GraphQLObjectType({
  name: 'Product',
  fields: () => ({
    id: globalIdField('Product'),
    name: {
      type: GraphQLString,
    },
    price: {
      type: GraphQLFloat,
    },
    images: {
      type: new GraphQLList(imageType),
      args: {
        format: {
          type: GraphQLString,
          defaultValue: 'any',
        },
        ...connectionArgs,
      },
      resolve: async ({ images }, { format, ...args })=> {
        if (format !== 'any') {
          return images.filter((image)=> image.format === format);
        }

        return images;
      },
    },
  }),
  interfaces: [nodeInterface],
});

export const { connectionType: productConnectionType, edgeType: productEdgeType } =
  connectionDefinitions({ name: 'Product', nodeType: productType });

export const queryProduct = {
  type: productType,
  args: {
    id: {
      type: GraphQLID,
    },
  },
  resolve: ({}, { id }) => {
    logger.info('Resolving queryProduct with params:', { id });

    return {};
  },
};


export default productType;
