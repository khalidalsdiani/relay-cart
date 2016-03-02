/**
 * Created by Soon on 2/26/16.
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

import productType from './productType';
import productService from '../services/productService';

import { nodeInterface } from '../defaultDefinitions';
export const cartEntryType = new GraphQLObjectType({
  name: 'CartEntry',
  description: 'Just cartEntry',
  fields: () => ({
    id: globalIdField('CartEntry'),
    product: {
      type: productType,
      description: 'The product of the cartEntry.',
    },
    quantity: {
      type: GraphQLFloat,
    },
  }),
  interfaces: [nodeInterface],
});

export const { connectionType: cartEntryConnection, edgeType: cartEntryEdge } =
  connectionDefinitions({ name: 'CartEntry', nodeType: cartEntryType });

export const queryCartEntry = {
  type: cartEntryType,
  args: {
    id: {
      type: GraphQLID,
    },
  },
  resolve: async({}, { id }, { rootValue }) => {
    logger.info('Resolving queryCartEntry with params:', { id });

    return {};
  },
};


export default cartEntryType;
