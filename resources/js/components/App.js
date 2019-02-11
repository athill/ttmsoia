import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router-dom';

import history from '../history';
import Index from './Index';

const App = () => (
    <Router history={history}>  
        <Route path="/" exact component={Index}/>
    </Router>
);


export default App;

if (document.getElementById('app')) {
    ReactDOM.render(<App />, document.getElementById('app'));
}
