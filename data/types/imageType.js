/**
 * Created by Soon on 2/24/16.
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

import { nodeInterface } from '../defaultDefinitions';
export const imageType = new GraphQLObjectType({
  name: 'Image',
  description: 'Just image',
  fields: () => ({
    format: {
      type: GraphQLString,
      description: 'The format of image.',
    },
    url: {
      type: GraphQLString,
      description: 'The url of image.',
    },
  }),
});

export const { connectionType: imageConnection, edgeType: imageEdge } =
  connectionDefinitions({ name: 'Image', nodeType: imageType });

export const queryImage = {
  type: imageType,
  args: {
    id: {
      type: GraphQLID,
    },
  },
  resolve: ({}, { id }) => {
    logger.info('Resolving queryImage with params:', { id });

    return {};
  },
};


export default imageType;
