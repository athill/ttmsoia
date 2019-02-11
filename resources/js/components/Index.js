import axios from 'axios';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import ReactTruncate from 'react-truncate';

export default class Index extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            posts: []
        };
        this._getPosts = this._getPosts.bind(this);
        this._html = this._html.bind(this);
    }

    componentDidMount() {
        this._getPosts(1);
    }

    _getPosts(page) {
        axios.get(`/api/posts/?page=${page}`)
        .then(({ data : response}) => {
            this.setState({
                loaded: true,
                posts: response.data
            });
        });
    }

    _html(content) {
        const urlPattern =  /(\s+)(https?:\/\/(youtu.be\/|www.youtube.com\/watch\/\?v=)(\S+))(\s)/gim;
        const content2 = content.replace(urlPattern, '$1 $2 $3 $4');
        // https://www.youtube.com/watch?v=lyCubBRN24M 


        // '$1<iframe width="560" height="315" src="$2" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>$4'
        // this.replace(urlPattern, '<a href="$&">$&</a>')
        /*
            <iframe width="560" height="315" src="https://www.youtube.com/embed/ZAqnXcqNCx4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
        */
        if (content !== content2) {
            console.log('content', content);
            console.log('content2', content2)
        }
        return {__html: content};
    }


    render() {
        const { loaded, posts } = this.state;
        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-8">
                    { !loaded && <p>Loading ...</p> || (
                        posts.map(({ post_content, post_date, post_title }) => (
                            <div className="post" key={post_title}>
                                <h2>{ post_title }</h2>
                                <p>
                                    <ReactTruncate lines={-1} ellipsis={<span>... <a href='/link/to/article'>Read more</a></span>}>
                                        <span dangerouslySetInnerHTML={this._html(post_content)} />
                                    </ReactTruncate>
                                </p>
                            </div>
                        )))
                    }
                    <nav aria-label="Page navigation example">
                      <ul className="pagination">
                        <li className="page-item"><a className="page-link" href="#">Previous</a></li>
                      </ul>
                    </nav>
                    </div>
                </div>
            </div>
        );
    }
}