/**
 * Created by Soon on 2/22/16.
 */
import cookieParser from 'cookie-parser';
import express from 'express';
import graphQLHTTP from 'express-graphql';
import morgan from 'morgan';
import path from 'path';
import pkg from './package.json';
import session from 'express-session';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import { Schema } from './data/schema';
import webpackConfig from './webpack.dev.config';
import logger from './logger';

const APP_PORT = 3000;
const GRAPHQL_PORT = 8080;

const rootPath = path.join(__dirname);
const publicPath = path.join(rootPath, 'public');

const graphQLServer = express();
const MemoryStore = require('session-memory-store')(session);

graphQLServer.use(cookieParser());

graphQLServer.use(session({
  store: new MemoryStore(),
  secret: pkg.name,
  resave: false,
  saveUninitialized: true,
}));

graphQLServer.use('/graphql',
  graphQLHTTP(request => ({
    schema: Schema,
    rootValue: request,
    pretty: true,
    graphiql: false,
    context: request.session,
  }))
);

graphQLServer.listen(GRAPHQL_PORT, () => console.log(
  `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`
));

// create a single instance of the compiler to allow caching
const devCompiler = webpack(webpackConfig);

// Start a webpack-dev-server
const app = new WebpackDevServer(devCompiler, {
  publicPath: webpackConfig.output.publicPath,
  contentBase: path.join(__dirname, 'build', 'public'),
  hot: true,
  stats: {
    colors: true,
    hash: false,
    timings: true,
    assets: false,
    chunks: false,
    chunkModules: false,
    modules: false,
    children: false,
  },
  historyApiFallback: true,
  compress: true,
  proxy: { '/graphql': `http://localhost:${GRAPHQL_PORT}` },
});

// Static files middleware
app.use(express.static(publicPath));

app.use(morgan('combined', { stream: logger.stream }));

app.listen(APP_PORT, 'localhost', ()=> {
  console.log(`App Server is now running on http://localhost:${APP_PORT}`);
  console.log('[webpack-dev-server]', `http://localhost:${APP_PORT}\/webpack-dev-server/index.html`);
});
