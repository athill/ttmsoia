import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router-dom';

import history from '../history';
import Posts from './Posts';

const App = () => (
    <Router history={history}>  
        <div>
            <Route path="/" exact component={Posts}/>
            <Route path="/posts/:page?" component={Posts}/>
        </div>
    </Router>
);


export default App;

if (document.getElementById('app')) {
    ReactDOM.render(<App />, document.getElementById('app'));
}
