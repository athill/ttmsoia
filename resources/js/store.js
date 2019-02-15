import { createStore, applyMiddleware } from 'redux';
// import promiseMiddleware from 'redux-promise';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';


import reducer from './modules';

const logger = createLogger();

const middleware = [
  thunkMiddleware,
  // promiseMiddleware
];


if (process.env.NODE_ENV === 'development' || location.host === 'ttmsoia.test') {
  middleware.push(logger);
}

const createStoreWithMiddleware = applyMiddleware(...middleware)(createStore)

export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(reducer, initialState);
  return store;
};
