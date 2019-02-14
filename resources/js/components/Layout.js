import React from 'react';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => (
	<div className="container" id="layout">
		<header id="header">
		<h1><Link to="/">trying to make sense of it all</Link></h1>
		</header>
		{ children }
		<footer id="footer">
			&copy; { new Date().getFullYear() } <a href="//andyhill.us" target="_blank" rel="noopener">Andy Hill</a>
		</footer>
	</div>

);

export default Layout;