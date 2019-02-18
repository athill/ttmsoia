import { combineReducers } from 'redux';
// import { reducer as formReducer } from 'redux-form';

import posts, { initialState as postsInitialState } from './posts';

const reducer = combineReducers({
	posts
});

export default reducer;
