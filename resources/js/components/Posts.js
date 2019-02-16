import axios from 'axios';
import classNames from 'classnames';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import ReactTruncate from 'react-truncate';

import { getPosts } from '../modules/posts';

export default class Posts extends Component {
    constructor(props) {
        super(props);
        const { match } = props;
        const current = match.params.page ? match.params.page : 1;
        this.state = {
            loaded: false,
            posts: [],
            last: null,
            prev: null,
            next: null,
            current
        };
        this._getPosts = this._getPosts.bind(this);
        this._html = this._html.bind(this);
        this._idFromUrl = this._idFromUrl.bind(this);
    }

    componentDidMount() {
        const { current : page } = this.state;
        this._getPosts(page);
    }

    componentDidUpdate(prevProps) {
        const { match } = this.props;
        if (match !== prevProps.match) {
            const current = match.params.page ? match.params.page : 1;
            this._getPosts(current);
        }     
    }

    _getPosts(page) {
        this.setState({
            loaded: false
        });
        axios.get(`/api/posts/?page=${page}`)
        .then(({ data : response}) => {
            this.setState({
                loaded: true,
                posts: response.data,
                last: response.last_page,
                prev: this._idFromUrl(response.prev_page_url),
                next: this._idFromUrl(response.next_page_url),
                current: parseInt(page)
            });
        });
    }

    _idFromUrl(url) {
        return url ? url.replace(/.*\?page=(\d+)/, '$1') : null;
    }

    _html(content) {
        const urlPattern =  /\s+https?:\/\/(youtu.be\/|www.youtube.com\/watch\?v=)(\S+)\s*/gim;
        const content2 = content.replace(urlPattern, '<div><iframe width="560" height="315" src="https://www.youtube.com/embed/$2" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>');
        return {__html: content2};
    }


    render() {
        const { current, last, loaded, next, posts, prev } = this.state;
        const navigation = [
            { disabled: current === 1, label: 'first', page: 1 },
            { disabled: current === 1, label: 'previous', page: prev },
            { disabled: current === last, label: 'next', page: next },
            { disabled: current === last, label: 'last', page: last },
        ];
        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div id="posts" className="col-md-10">
                    { !loaded && <p>Loading ...</p> || (
                        <div> 
                        {
                            posts.map(({ post_content, post_date, post_title }) => (
                                <div className="post" key={post_title}>
                                    <h2 className="d-flex justify-content-between"><Link to={``}>{ post_title }</Link> <small>{ new Date(post_date).toLocaleString() }</small></h2>
                                    <p>
                                        <ReactTruncate lines={5} ellipsis={<span>... <a href='/link/to/article'>Read more</a></span>}>
                                            <span dangerouslySetInnerHTML={this._html(post_content)} />
                                        </ReactTruncate>
                                    </p>
                                </div>
                            ))
                        }
                        <nav aria-label="Blog navigation">
                          <ul className="pagination">
                            {
                                navigation.map(({ disabled, label, page }) => (
                                    <li key={label} className={classNames('page-item', { disabled })}><Link className="page-link" to={`/posts/${page}`}>{ label }</Link></li>
                                ))   
                            }
                          </ul>
                        </nav>                        
                        </div>
                    )}
                    </div>
                </div>
            </div>
        );
    }
}