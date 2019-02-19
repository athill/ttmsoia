import { createAction, handleActions } from 'redux-actions';

// action types
const NAMESPACE = 'ttmsoia/posts/'

const GET_PAGE = NAMESPACE + 'GET_PAGE';
const GET_PAGE_SUCCESS = NAMESPACE + 'GET_PAGE_SUCCESS';
const FETCH_PAGE = NAMESPACE + 'FETCH_PAGE';
const FETCH_PAGE_SUCCESS = NAMESPACE + 'FETCH_PAGE_SUCCESS';

const GET_POST = NAMESPACE + 'GET_POST';
const GET_POST_SUCCESS = NAMESPACE + 'GET_POST_SUCCESS';
const FETCH_POST = NAMESPACE + 'FETCH_POST';
const FETCH_POST_SUCCESS = NAMESPACE + 'FETCH_POST_SUCCESS';

// helpers
export const idFromUrl = url => url ? parseInt(url.replace(/.*\?page=(\d+)/, '$1')) : null;

const fetchPageAction = createAction(FETCH_PAGE);

// actions
export const fetchPage = page => async (dispatch, getState) => {
	
	const { data : response } = await axios.get(`/api/posts/?page=${page}`);
	const pages = {
		[page]: {
			posts: response.data.map(post => post.post_name),
	        last: parseInt(response.last_page),
	        prev: idFromUrl(response.prev_page_url),
	        next: idFromUrl(response.next_page_url),
	        current: parseInt(page)					
		}
	};
	const posts = {};
	response.data.forEach(post => {
		posts[post.post_name] = post;
	});
	dispatch(createAction(FETCH_PAGE_SUCCESS)({ pages, posts }));
};

// const getPageAction = createAction(GET_PAGE);

export const getPage = page => async (dispatch, getState) => {
	dispatch(createAction(GET_PAGE));
	let state = getState();

	let pageData;
	if (!state.posts.pages[page]) {
		await dispatch(fetchPage(page));
		state = getState();
		pageData = state.posts.pages[page];
		
	} else {
		pageData= state.posts.pages[page];
	}
	const currentPageData = {...pageData};
	currentPageData.posts = currentPageData.posts.map(id => state.posts.posts[id]);
	dispatch(createAction(GET_PAGE_SUCCESS)({
		currentPage: page,
		currentPageData
	}));
};



// post
export const fetchPost = id => async (dispatch, getState) => {
	const { data : response } = await axios.get(`/api/posts/${id}`);
	console.log('fetchPost', response);
	dispatch(createAction(FETCH_POST_SUCCESS)(response));
};

export const getPost = id => async (dispatch, getState) => {
	dispatch(createAction(GET_POST));
	let state = getState();

	if (!state.posts.posts[id]) {
		await dispatch(fetchPost(id));
		state = getState();		
	}
	const currentPostData = state.posts.posts[id];
	dispatch(createAction(GET_POST_SUCCESS)({
		currentPost: id,
		currentPostData
	}));
};


// handlers
const handleFetchPage = (state, action) => {
	const { pages : existingPages, posts: existingPosts } = state;
	const { pages: newPages, posts : newPosts } = action.payload;
	return {
		...state,
		pages: {
			...existingPages,
			...newPages
		},
		posts: {
			...existingPosts,
			...newPosts
		}
	};
};

const handleGetPage = (state, action) => {
	return {
		...state,
		loaded: false
	};
};

const handleGetPageSuccess = (state, action) => {
	const { currentPage, currentPageData } = action.payload;
	return {
		...state,
		currentPage,
		currentPageData,
		loaded: true
	};
};

const handleFetchPost = (state, action) => {
	const post = action.payload;
	const posts = state.posts;
	const newState = {
		...state,
		posts: {
			...posts,
			[post.post_name]: post
		}
	};
	return newState;
};

const handleGetPost = (state, action) => {
	return {
		...state,
		loaded: false
	};
};

const handleGetPostSuccess = (state, action) => {
	console.log('handleGetPostSuccess', action.payload)
	const { currentPost, currentPostData } = action.payload;
	return {
		...state,
		currentPost,
		currentPostData,
		loaded: true
	};
};


// default state
export const initialState = {
	currentPage: '',
	currentPageData: {},
	currentPost: '',
	currentPostData: {},
	pages: {},
	posts: {},
	loaded: false
}

const reducer = handleActions({
	[GET_PAGE]: handleGetPage,
	[GET_PAGE_SUCCESS]: handleGetPageSuccess,
	[FETCH_PAGE_SUCCESS]: handleFetchPage,
	[GET_POST]: handleGetPost,
	[GET_POST_SUCCESS]: handleGetPostSuccess,
	[FETCH_POST_SUCCESS]: handleFetchPost	
}, initialState);


// reducer
export default reducer;
