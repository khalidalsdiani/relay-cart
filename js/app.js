import 'babel-polyfill';
import { browserHistory } from 'react-router';
import React from 'react';
import ReactDOM from 'react-dom';
import Relay from 'react-relay';
import { RelayRouter } from 'react-router-relay';

import FastClick from 'fastclick';

import rootRoute from './routes/rootRoute';

if (__DEBUG__) {
  const debug = require('debug');
  /* enable debug in browser */
  debug.enable('app:*');
  window.debug = debug('app:client');
} else {
  window.debug = (print)=> {
    console.log(print);
  };
}

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
  <RelayRouter history={browserHistory} routes={rootRoute} />,
  document.getElementById('root')
);

document.addEventListener('DOMContentLoaded', ()=> {
  FastClick.attach(document.body);
}, false);
