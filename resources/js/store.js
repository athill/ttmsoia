import { createStore, applyMiddleware } from 'redux';
// import promiseMiddleware from 'redux-promise';
import thunkMiddleware from 'redux-thunk';
import { createLogger } from 'redux-logger';


import reducer, { initialState } from './modules';

const logger = createLogger();

const middleware = [
  thunkMiddleware,
  // promiseMiddleware
];

export const configureReduxMiddleware = () => {
  const middleware = [
    thunkMiddleware,
    // promiseMiddleware,
    // routerMiddleware(history)
  ];

  if (process.env.NODE_ENV === 'development' || window.localStorage.debug) {
    middleware.push(createLogger());
  }
  return middleware;
};


if (process.env.NODE_ENV === 'development' || location.host === 'ttmsoia.test') {
  middleware.push(logger);
}

const store = createStore(reducer, {}, applyMiddleware(...configureReduxMiddleware()));

export default store;
