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
import productService from '../services/productService';


export const productType = new GraphQLObjectType({
  name: 'Product',
  fields: () => ({
    id: globalIdField('Product'),
    name: {
      type: GraphQLString,
      description: '商品名称',
    },
    color: {
      type: GraphQLString,
      description: '商品颜色',
    },
    description: {
      type: GraphQLString,
      description: '商品描述',
    },
    price: {
      type: GraphQLFloat,
      description: '商品价格，保留两位小数',
    },
    images: {
      type: new GraphQLList(imageType),
      description: "商品图片，['primary': 主图,'thumbnail'：缩略图,'zoom':大图]",
      args: {
        format: {
          type: GraphQLString,
          defaultValue: 'any',
        },
        ...connectionArgs,
      },
      resolve: async ({ images }, { format, ...args }) => {
        if (format !== 'any') {
          images = images.filter((image) => image.format === format);
        }
        return images.slice(0, args.first);
      },
    },
  }),
  interfaces: [nodeInterface],
});

export const { connectionType: productConnectionType, edgeType: productEdgeType } =
  connectionDefinitions({
    name: 'Product',
    nodeType: productType,
    connectionFields: {
      totalNumberOfItems: {
        type: GraphQLInt,
      },
    },
  });

export const queryProduct = {
  type: productType,
  args: {
    id: {
      type: GraphQLID,
    },
  },
  resolve: ({}, { id }) => {
    logger.info('Resolving queryProduct with params:', { id });
    const result = productService.findAll({ start: 0, size: 100 });

    return result.items.find(p => p.id === id);
  },
};


export default productType;
