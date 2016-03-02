/**
 * Created by Soon on 3/1/16.
 */

import {
  GraphQLBoolean,
  GraphQLFloat,
  GraphQLID,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLInt,
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
  offsetToCursor,
  toGlobalId,
} from 'graphql-relay';

import cartService from '../services/cartService';

import cartType from '../types/cartType';

const removeFromCartMutation = mutationWithClientMutationId({
  name: 'RemoveFromCart',
  inputFields: {
    id: { type: new GraphQLNonNull(GraphQLID) },
  },
  outputFields: {
    deletedCartEntryId: {
      type: GraphQLID,
      resolve: async({ deletedCartEntryId }) =>deletedCartEntryId,
    },
    cart: {
      type: cartType,
      resolve: ({ cart })=> cart,
    },
  },
  mutateAndGetPayload: async({ id }, { rootValue }) => {
    logger.info('Invoke removeFromCartMutation with params:', { id });

    const cart = cartService.getSessionCart(rootValue.session);
    const localCartEntryId = fromGlobalId(id).id;
    cartService.removeFromCart(cart, localCartEntryId);

    return { deletedCartEntryId: id, cart };
  },
});

export default removeFromCartMutation;
