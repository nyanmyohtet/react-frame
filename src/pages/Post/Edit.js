import React, { Component } from "react";
import Loading from "../../components/Loading";
import Error from "../../components/Error";
import PostForm from "../../components/PostForm";
import API from "../../api/api";
import authHeader from "../../services/auth-header.service";

export default class Edit extends Component {
    constructor(props) {
        super(props);

        this._isMounted = false;

        this.id = this.props.match.params.id;

        this.state = {
            errors: {},
            loading: false,
            initialValues: {
                id: null,
                title: "",
                description: ""
            }
        };

        this.fetchPost = this.fetchPost.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    fetchPost() {
        if (this._isMounted) {
            this.setState({ loading: true });
        }
        API.get("posts/" + this.id, {
            headers: authHeader()
        })
            .then(res => {
                const { id, title, description } = res.data.post;
                if (this._isMounted) {
                    this.setState({
                        initialValues: { id, title, description }
                    });
                }
            })
            .then(() => {
                if (this._isMounted) this.setState({ loading: false });
            });
    }

    handleSubmit(values) {
        const data = { id: this.state.initialValues.id, ...values };

        API.put("posts", data, {
            headers: authHeader()
        })
            .then(() => {
                this.props.history.push("/post");
            })
            .catch(error => {
                if (error.response) {
                    console.error(error.response.data);
                    if (error.response.data.errors) {
                        this.setState({
                            errors: Object.values(error.response.data.errors)
                        });
                    }
                }
            });
    }

    componentDidMount() {
        this._isMounted = true;
        this.fetchPost();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const loading = this.state.loading;

        if (loading) {
            return <Loading />;
        }

        const { title, description } = this.state.initialValues;

        return (
            <div className="sub-container">
                <h2>Edit Post</h2>
                <div className="mb-3">
                    <Error errors={this.state.errors} />
                </div>
                <PostForm
                    formMode="edit"
                    initialValues={{ title, description }}
                    handleSubmit={this.handleSubmit}
                />
            </div>
        );
    }
}
