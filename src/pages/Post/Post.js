import React, { Component } from "react";
import PostList from "../../components/PostList";

class Post extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <PostList />;
    }
}

export default Post;
