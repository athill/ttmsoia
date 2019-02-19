import classNames from 'classnames';
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import ReactTruncate from 'react-truncate';

import { getPost } from '../modules/posts';
import { embedYoutube } from '../util';


class Post extends Component {
    constructor(props) {
        super(props);
        this._html = this._html.bind(this);
    }

    componentDidMount() {
        const { match, getPost } = this.props;
        const current = match.params.id;
        
        getPost(current);
    }

    componentDidUpdate(prevProps) {
        const { match, getPage } = this.props;
        if (match !== prevProps.match) {
            const current = match.params.id;
            getPost(current);
        }     
    }

    _html(content) {
        content = embedYoutube(content);
        return {__html: content};
    }


    render() {
        console.log(this.props);
        const { loaded, post_content, post_date, post_title } = this.props;
        return (
            <div className="container">
                <div className="row justify-content-center">
                    <div id="posts" className="col-md-10">
                    { !loaded && <p>Loading ...</p> || (
                        <div className="post" key={post_title}>
                            <h2 className="d-flex justify-content-between"><Link to={``}>{ post_title }</Link> <small>{ new Date(post_date).toLocaleString() }</small></h2>
                            <p>
                                <span dangerouslySetInnerHTML={this._html(post_content)} />
                            </p>
                        </div>
                    )}
                    </div>
                </div>
            </div>
        );
    }
}


const mapStateToProps = ({ posts: { currentPostData, loaded } }) => {
    return {
        ...currentPostData,
        loaded
    };
};

const mapDispatchToProps = dispatch => ({
    getPost: id => dispatch(getPost(id))

});

export default connect(mapStateToProps, mapDispatchToProps)(Post);

