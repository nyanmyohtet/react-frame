import React, { Component } from "react";
import API from "../../api/api";
import authHeader from "../../services/auth-header.service";
import Error from "../../components/Error";
import PostForm from "../../components/PostForm";

export default class Create extends Component {
    constructor(props) {
        super(props);

        this.state = {
            errors: {}
        };

        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(values) {
        this.setState({ errors: {} });

        const data = values;

        API.post("posts", data, {
            headers: authHeader()
        })
            .then(() => {
                this.props.history.push("/post");
            })
            .catch(error => {
                if (error.response) {
                    console.log(error.response.data);
                    this.setState({
                        errors: Object.values(error.response.data.errors)
                    });
                }
            });
    }

    render() {
        return (
            <div className="sub-container">
                <h2>Create User</h2>
                <div className="mb-3">
                    <Error errors={this.state.errors} />
                </div>
                <PostForm
                    formMode="create"
                    initialValues={{ title: "", description: "" }}
                    handleSubmit={this.handleSubmit}
                />
            </div>
        );
    }
}
