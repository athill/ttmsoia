import axios from 'axios';
import classNames from 'classnames';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTruncate from 'react-truncate';

import { getPage } from '../modules/posts';

class Posts extends Component {
    constructor(props) {
        super(props);
        this._html = this._html.bind(this);
    }

    componentDidMount() {
        const { match, getPage } = this.props;
        const current = match.params.page ? match.params.page : 1;
        
        getPage(current);
    }

    componentDidUpdate(prevProps) {
        const { match, getPage } = this.props;
        if (match !== prevProps.match) {
            const current = match.params.page ? match.params.page : 1;
            getPage(current);
        }     
    }

    _html(content) {
        const urlPattern =  /\s+https?:\/\/(youtu.be\/|www.youtube.com\/watch\?v=)(\S+)\s*/gim;
        const content2 = content.replace(urlPattern, '<div><iframe width="560" height="315" src="https://www.youtube.com/embed/$2" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>');
        return {__html: content2};
    }


    render() {
        const { current, last, loaded, next, posts, prev } = this.props;
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


const mapStateToProps = ({ posts: { currentPageData, loaded } }) => {
    return {
        ...currentPageData,
        loaded
    };
};

const mapDispatchToProps = dispatch => ({
    getPage: page => dispatch(getPage(page))

});

export default connect(mapStateToProps, mapDispatchToProps)(Posts);

