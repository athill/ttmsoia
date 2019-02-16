import { combineReducers } from 'redux';
// import { reducer as formReducer } from 'redux-form';

import posts from './posts';

console.log(posts);

export default combineReducers({
  posts,
  // form: formReducer
}, {});
