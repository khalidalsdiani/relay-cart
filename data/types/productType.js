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

import imageType from './imageType';

import { nodeInterface } from '../defaultDefinitions';
export const productType = new GraphQLObjectType({
  name: 'Product',
  description: 'Just product',
  fields: () => ({
    id: globalIdField('Product'),
    name: {
      type: GraphQLString,
      description: 'The name of the product.',
    },
    price: {
      type: GraphQLFloat,
      description: 'The price of the product.',
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

export const { connectionType: productConnection, edgeType: productEdge } =
  connectionDefinitions({ name: 'Product', nodeType: productType });

export const queryProduct = {
  type: productType,
  args: {
    id: {
      type: GraphQLID,
    },
  },
  resolve: async ({}, { id }, { rootValue }) => {
    logger.info('Resolving queryProduct with params:', { id });

    return {};
  },
};


export default productType;
