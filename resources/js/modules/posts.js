import { createAction, handleActions } from 'redux-actions';

// action types
const NAMESPACE = 'ttmsoia/posts/'

const GET_PAGE = NAMESPACE + 'GET_PAGE';
const GET_PAGE_SUCCESS = NAMESPACE + 'GET_PAGE_SUCCESS';
const FETCH_PAGE = NAMESPACE + 'FETCH_PAGE';
const FETCH_PAGE_SUCCESS = NAMESPACE + 'FETCH_PAGE_SUCCESS';

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


// default state
export const initialState = {
	currentPage: '',
	currentPageData: {},
	pages: {},
	posts: {},
	loaded: false
}

const reducer = handleActions({
	[GET_PAGE_SUCCESS]: handleGetPageSuccess,
	[FETCH_PAGE_SUCCESS]: handleFetchPage
}, initialState);


// reducer
export default reducer;
