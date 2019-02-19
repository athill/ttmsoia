import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router-dom';


import history from '../history';
import store from '../store';
import Layout from './Layout';
import Post from './Post';
import Posts from './Posts';
import reducers from '../modules';


// const store = createStore(reducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());

const App = () => (
    <Provider store={store}>
        <Router history={history}>  
            <Layout>
                <Route path="/" exact component={Posts}/>
                <Route path="/posts/:page?" component={Posts}/>
                <Route path="/post/:id" component={Post}/>
            </Layout>
        </Router>
    </Provider>
);


export default App;

if (document.getElementById('app')) {
    ReactDOM.render(<App />, document.getElementById('app'));
}
