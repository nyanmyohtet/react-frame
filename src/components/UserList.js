import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Col, Form, Table } from "react-bootstrap";
import Loading from "./Loading";
import PaginationBar from "./PaginationBar";
import API from "../api/api";
import authHeader from "../services/auth-header.service";

class UserList extends Component {
    constructor(props) {
        super(props);

        this._isMounted = false;
        this.BASE_API_ROUTE = "users/list";

        this.state = {
            loading: false,
            userList: [],
            name: "",
            email: "",
            createdFrom: "",
            createdTo: "",
            pagination: {
                current_page: 1,
                first_page_url: "",
                last_page: 0,
                last_page_url: "",
                prev_page_url: "",
                next_page_url: ""
            }
        };
        this.handleSearch = this.handleSearch.bind(this);
        this.handleAllSearchInputs = this.handleAllSearchInputs.bind(this);
        this.fetchUserList = this.fetchUserList.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
    }

    handleSearch(event) {
        event.preventDefault();
        this.fetchUserList();
    }

    handleAllSearchInputs(event) {
        event.preventDefault();
        let { name, value } = event.target;
        this.setState({ [name]: value });
    }

    fetchUserList(url = this.BASE_API_ROUTE) {
        this.setState({ loading: true });

        const {
            name,
            email,
            createdFrom: created_from,
            createdTo: created_to
        } = this.state;
        const data = { name, email, created_from, created_to };

        API.post(url, data, { headers: authHeader() }).then(res => {
            if (this._isMounted) {
                this.setState(
                    {
                        userList: res.data.data,
                        pagination: {
                            current_page: res.data.current_page,
                            first_page_url: res.data.first_page_url,
                            last_page: res.data.last_page,
                            last_page_url: res.data.last_page_url,
                            prev_page_url: res.data.prev_page_url,
                            next_page_url: res.data.next_page_url
                        }
                    },
                    () => this.setState({ loading: false })
                );
            }
        });
    }

    handleDelete(id, event) {
        event.preventDefault();

        API.delete("users/" + id.toString(), { headers: authHeader() }).then(
            res => {
                if (res.data.success) {
                    this.fetchUserList();
                }
            }
        );
    }

    componentDidMount() {
        this._isMounted = true;
        this.fetchUserList();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const TABLE_HEADER_LIST = [
            "Name",
            "Email",
            "Created User",
            "Phone",
            "Birth Date",
            "Address",
            "Created Data",
            "Updated Date",
            "Action"
        ];
        const {
            loading,
            name,
            email,
            createdFrom,
            createdTo,
            pagination
        } = this.state;

        return (
            <Fragment>
                <h2>User List</h2>
                <div className="row mb-5">
                    <Form className="col-10">
                        <Form.Row>
                            <Col>
                                <Form.Control
                                    name="name"
                                    value={name}
                                    placeholder="Name"
                                    onChange={this.handleAllSearchInputs}
                                />
                            </Col>
                            <Col>
                                <Form.Control
                                    name="email"
                                    value={email}
                                    placeholder="Email"
                                    onChange={this.handleAllSearchInputs}
                                />
                            </Col>
                            <Col>
                                <Form.Control
                                    type="date"
                                    name="createdFrom"
                                    value={createdFrom}
                                    onChange={this.handleAllSearchInputs}
                                ></Form.Control>
                            </Col>
                            <Col>
                                <Form.Control
                                    type="date"
                                    name="createdTo"
                                    value={createdTo}
                                    onChange={this.handleAllSearchInputs}
                                ></Form.Control>
                            </Col>
                            <Button type="submit" onClick={this.handleSearch}>
                                Search
                            </Button>
                        </Form.Row>
                    </Form>
                    <Link
                        className="col-2"
                        to="/user/create"
                        className="btn btn-primary"
                    >
                        Add
                    </Link>
                </div>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            {TABLE_HEADER_LIST.map((header, index) => (
                                <th key={index}>{header}</th>
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
                        ) : this.state.userList.length == 0 ? (
                            <tr>
                                <td colSpan="9" className="text-center">
                                    Empty
                                </td>
                            </tr>
                        ) : (
                            this.state.userList.map(
                                (
                                    {
                                        id,
                                        name,
                                        email,
                                        phone,
                                        birth_date,
                                        created_user,
                                        address,
                                        created_at,
                                        updated_at
                                    },
                                    index
                                ) => (
                                    <tr key={index}>
                                        <td>
                                            <Link to={`user/${id}`}>
                                                {name}
                                            </Link>
                                        </td>
                                        <td>{email}</td>
                                        <td>{created_user.name}</td>
                                        <td>{phone}</td>
                                        <td>{birth_date}</td>
                                        <td>{address}</td>
                                        <td>{created_at}</td>
                                        <td>{updated_at}</td>
                                        <td>
                                            {id != this.props.user.id && (
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
                        fetchUserList={this.fetchUserList}
                    />
                </div>
            </Fragment>
        );
    }
}

const mapStateToProps = state => ({ user: state.auth.user });

export default connect(mapStateToProps)(UserList);
