/**
 * Created by Soon on 2/23/16.
 */
import Relay from 'react-relay';
export default {
  viewer: () => Relay.QL` query { viewer } `,
};

