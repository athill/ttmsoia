import axios from 'axios';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactTruncate from 'react-truncate';

export default class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            posts: [],
            last: null,
            prev: null,
            next: null
        };
        this._getPosts = this._getPosts.bind(this);
        this._html = this._html.bind(this);
        this._idFromUrl = this._idFromUrl.bind(this);
    }

    componentDidMount() {
        this._getPosts(1);
    }

    _getPosts(page) {
        axios.get(`/api/posts/?page=${page}`)
        .then(({ data : response}) => {
            this.setState({
                loaded: true,
                posts: response.data,
                last: response.last_page,
                // prev: this._idFromUrl(response.prev_page_url),
                // next: this._idFromUrl(response.next_page_url)
            });
        });
    }

    _idFromUrl(url) {
        const id = url.replace(/\?page=(\d+)/, '$1');
        console.log(id);
        return id;
    }

    _html(content) {
        const urlPattern =  /\s+https?:\/\/(youtu.be\/|www.youtube.com\/watch\?v=)(\S+)\s*/gim;
        const content2 = content.replace(urlPattern, '<div><iframe width="560" height="315" src="https://www.youtube.com/embed/$2" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>');
        return {__html: content2};
    }


    render() {
        const { loaded, posts } = this.state;
        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                    { !loaded && <p>Loading ...</p> || (
                        <React.Fragment> {
                            posts.map(({ post_content, post_date, post_title }) => (
                                <div className="post" key={post_title}>
                                    <h2>{ post_title }</h2>
                                    <p>
                                        <ReactTruncate lines={-1} ellipsis={<span>... <a href='/link/to/article'>Read more</a></span>}>
                                            <span dangerouslySetInnerHTML={this._html(post_content)} />
                                        </ReactTruncate>
                                    </p>
                                </div>
                            ))
                        }
                        <nav aria-label="Page navigation example">
                          <ul className="pagination">
                            <li className="page-item"><a className="page-link" href="#">Previous</a></li>
                          </ul>
                        </nav>                        
                        </React.Fragment>
                    )}
                    </div>
                </div>
            </div>
        );
    }
}