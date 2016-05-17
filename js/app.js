import 'babel-polyfill';
import { Router, browserHistory, applyRouterMiddleware } from 'react-router';
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import useRelay from 'react-router-relay';

import rootRoute from './routes/rootRoute';

const networkLayerOptions = {
  fetchTimeout: 30000,   // Timeout after 30s.
  retryDelays: [5000],   // Only retry once after a 5s delay.
  credentials: 'same-origin',  // pass cookies when request.
};

/* inject DefaultNetworkLayer with options */
Relay.injectNetworkLayer(
  new Relay.DefaultNetworkLayer('/graphql', networkLayerOptions)
);

ReactDOM.render(
  <Router
    history={browserHistory}
    render={applyRouterMiddleware(useRelay)}
    environment={Relay.Store}
    routes={rootRoute} />,
  document.getElementById('root')
);
