import { createAction, handleActions } from 'redux-actions';

// action types
const NAMESPACE = 'ttmsoia/posts/'

const GET_PAGE = NAMESPACE + 'GET_PAGE';
const FETCH_PAGE = NAMESPACE + 'FETCH_PAGE';

// helpers
export const idFromUrl = url => url ? parseInt(url.replace(/.*\?page=(\d+)/, '$1')) : null;

// actions
export const fetchPage = createAction(FETCH_PAGE, async page => {
	const { data : response } = await axios.get(`/api/posts/?page=${page}`);
	const pages = {
		[page]: {
			posts: response.data.map(post => post.post_name),
	        last: parseInt(response.last_page),
	        prev: idFromUrl(response.prev_page_url),
	        next: idFromUrl(response.next_page_url),
	        current: parseInt(page)					
		};
	};
	const posts = {};
	response.data.forEach(post => {
		posts[post.post_name] = post;
	});
	return {
		pages,
		posts
	};
};

export const getPage = createAction(GET_PAGE, page => async (dispatch, getState) => {
	let state = getState();
	if (!state.pages[page]) {
		await dispatch(fetchPage(page));
		state = getState();
	}	
	const currentPageData = state.pages[page];
	currentPageData.posts.map(id => state.posts[id]);
	return {
		currentPage: page,
		currentPageData
	}
});


// handlers
const handleFetchPage = (state, action) => {
	const { pages : existingPages, posts: existingPosts } = state;
	const { pages: newPages, posts : newPosts } = action.payload;
	return {
		...state,
		pages: {
			existingPages,
			newPages
		},
		posts: {
			existingPosts,
			newPosts
		}
	};
};

const handleFetchPage = (state, action) => {
	const { currentPage, currentPageData } = action.payload;
	return {
		...state,
		currentPage,
		currentPageData
	}
};


// default state
export const initialState = {
	currentPage: '',
	currentPageData: {},
	pages: {},
	posts: {}
}

// reducer
export default handleActions({
	[GET_PAGE]: handleGetPage
	[FETCH_PAGE]: handleFetchPage
}, initialState);
