import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Col, Form, Modal, Table } from "react-bootstrap";
import Loading from "./Loading";
import PaginationBar from "./PaginationBar";
import API from "../api/api";
import authHeader from "../services/auth-header.service";

class PostList extends Component {
    constructor(props) {
        super(props);

        this._isMounted = false;
        this.BASE_API_ROUTE = "posts/list";

        this.state = {
            loading: false,
            showModal: false,
            title: "",
            postList: [],
            postDetailModal: {
                title: "",
                description: ""
            },
            pagination: {
                current_page: 1,
                first_page_url: "",
                last_page: 0,
                last_page_url: "",
                prev_page_url: "",
                next_page_url: ""
            }
        };

        this.handleAllSearchInputs = this.handleAllSearchInputs.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handlePostTitle = this.handlePostTitle.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.fetchPostList = this.fetchPostList.bind(this);
        this.handleDownloadCSV = this.handleDownloadCSV.bind(this);
    }

    handleAllSearchInputs(event) {
        event.preventDefault();
        let { name, value } = event.target;
        this.setState({ [name]: value });
    }

    handleSearch(event) {
        event.preventDefault();
        this.fetchPostList();
    }

    handlePostTitle(title, description, event) {
        event.preventDefault();
        const postDetailModal = { title, description };
        this.setState({ showModal: true, postDetailModal });
    }

    handleClose(event) {
        const postDetailModal = { title: "", description: "" };
        this.setState({ showModal: false, postDetailModal });
    }

    fetchPostList(url = this.BASE_API_ROUTE) {
        this.setState({ loading: true });
        const { title } = this.state;
        const data = { title };
        API.post(url, data, { headers: authHeader() }).then(res => {
            if (this._isMounted) {
                this.setState(
                    {
                        postList: res.data.data,
                        pagination: {
                            current_page: res.data.current_page,
                            first_page_url: res.data.first_page_url,
                            last_page: res.data.last_page,
                            last_page_url: res.data.last_page_url,
                            prev_page_url: res.data.prev_page_url,
                            next_page_url: res.data.next_page_url
                        }
                    },
                    () => {
                        this.setState({ loading: false });
                    }
                );
            }
        });
    }

    handleDownloadCSV(event) {
        event.preventDefault();
        window.location.href = "http://localhost:8000/api/posts/export-csv";
    }

    handleDelete(id, event) {
        event.preventDefault();

        API.delete("posts/" + id.toString(), { headers: authHeader() }).then(
            res => {
                if (res.data.success) {
                    this.fetchPostList();
                }
            }
        );
    }

    componentDidMount() {
        this._isMounted = true;
        this.fetchPostList();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const TABLE_HEADER_LIST = [
            "Title",
            "Post Description",
            "Posted User",
            "Posted Date",
            "Action",
            "Action"
        ];

        const { isLoggedIn } = this.props;

        const { loading, pagination, title } = this.state;

        return (
            <Fragment>
                <div className="row mb-5">
                    <div className="col-md-5">
                        <Form>
                            <Form.Row>
                                <Col md="9" className="mr-2">
                                    <Form.Control
                                        name="title"
                                        value={title}
                                        placeholder="Search Title"
                                        onChange={this.handleAllSearchInputs}
                                    />
                                </Col>
                                <Button
                                    type="submit"
                                    className="header-btn"
                                    onClick={this.handleSearch}
                                >
                                    Search
                                </Button>
                            </Form.Row>
                        </Form>
                    </div>
                    <div className="col d-m-flex justify-content-around">
                        {isLoggedIn && (
                            <Link
                                to="/post/create"
                                className="btn btn-primary header-btn mr-4"
                            >
                                Add
                            </Link>
                        )}
                        {isLoggedIn && (
                            <Link
                                to="/post/upload-csv"
                                className="btn btn-primary header-btn mr-4"
                            >
                                Upload
                            </Link>
                        )}
                        <Button
                            className="header-btn mr-4"
                            onClick={this.handleDownloadCSV}
                        >
                            Download
                        </Button>
                    </div>
                </div>
                <div>
                    <Modal
                        show={this.state.showModal}
                        onHide={this.handleClose}
                    >
                        <Modal.Header closeButton>
                            <Modal.Title>
                                {this.state.postDetailModal.title}
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {this.state.postDetailModal.description}
                        </Modal.Body>
                    </Modal>
                </div>
                <Table striped bordered hover className="post-list-tbl">
                    <thead>
                        <tr>
                            {TABLE_HEADER_LIST.map((header, index) => (
                                <th
                                    key={index}
                                    className={
                                        header.replace(" ", "-").toLowerCase() +
                                        "-col"
                                    }
                                >
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="9" className="text-center">
                                    <Loading />
                                </td>
                            </tr>
                        ) : this.state.postList.length == 0 ? (
                            <tr>
                                <td colSpan="9" className="text-center">
                                    Empty
                                </td>
                            </tr>
                        ) : (
                            this.state.postList.map(
                                (
                                    {
                                        id,
                                        title,
                                        description,
                                        created_user,
                                        created_at
                                    },
                                    index
                                ) => (
                                    <tr key={index}>
                                        <td>
                                            <a
                                                href="#"
                                                onClick={event =>
                                                    this.handlePostTitle(
                                                        title,
                                                        description,
                                                        event
                                                    )
                                                }
                                            >
                                                {title}
                                            </a>
                                        </td>
                                        <td>{description}</td>
                                        <td>{created_user.name}</td>
                                        <td>{created_at}</td>
                                        <td>
                                            {isLoggedIn && (
                                                <Link to={`post/edit/${id}`}>
                                                    Edit
                                                </Link>
                                            )}
                                        </td>
                                        <td>
                                            {isLoggedIn && (
                                                <a
                                                    href="#"
                                                    onClick={event =>
                                                        this.handleDelete(
                                                            id,
                                                            event
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </a>
                                            )}
                                        </td>
                                    </tr>
                                )
                            )
                        )}
                    </tbody>
                </Table>
                <div className="d-flex justify-content-center">
                    <PaginationBar
                        BASE_API_ROUTE={this.BASE_API_ROUTE}
                        pagination={pagination}
                        fetchUserList={this.fetchPostList}
                    />
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({
    isLoggedIn: state.auth.isLoggedIn
});

export default connect(mapStateToProps)(PostList);
