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
    id: {
      name: 'id',
      description: 'The ID of an object',
      type: new GraphQLNonNull(GraphQLID),
      resolve: (obj)=> {
        // pick up image id from url
        const imageId = /(\w+)\.\w+(?=.jpg)/g.exec(obj.url)[1];
        return toGlobalId('Image', imageId);
      },
    },
    format: {
      type: GraphQLString,
      description: 'The format of image.',
    },
    url: {
      type: GraphQLString,
      description: 'The url of image.',
    },
  }),
  interfaces: [nodeInterface],
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
