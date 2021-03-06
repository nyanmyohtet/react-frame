import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { Button, Col, Form, Table } from "react-bootstrap";
import Loading from "../../components/Loading";
import PaginationBar from "../../components/PaginationBar";
import axios from "../../axios";

class PostList extends Component {
  constructor(props) {
    super(props);

    this._isMounted = false;
    this.BASE_API_ROUTE = "posts/list";

    this.state = {
      loading: false,
      title: "",
      postList: [],
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
    this.fetchPostList = this.fetchPostList.bind(this);
    this.handleDownloadCSV = this.handleDownloadCSV.bind(this);
  }

  handleAllSearchInputs(event) {
    event.preventDefault();
    let { name, value } = event.target;
    this.setState({ [name]: value });
  }

  fetchPostList(url = this.BASE_API_ROUTE) {
    this.setState({ loading: true });
    const { title } = this.state;
    const data = { title };
    axios.post(url, data).then(res => {
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
      "Posted Date"
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
                    placeholder="Search keyword"
                    onChange={this.handleAllSearchInputs}
                  />
                </Col>
                <Button
                  type="submit"
                  className="text-uppercase header-btn"
                >
                  Filter
                </Button>
              </Form.Row>
            </Form>
          </div>
          <div className="col d-m-flex justify-content-around">
            {isLoggedIn && (
              <Link
                to="/post/create"
                className="btn btn-primary text-uppercase header-btn mr-4"
              >
                Create
              </Link>
            )}
            {isLoggedIn && (
              <Link
                to="/post/upload-csv"
                className="btn btn-primary text-uppercase header-btn mr-4"
              >
                Upload
              </Link>
            )}
            <Button
              className="text-uppercase header-btn mr-4"
              onClick={this.handleDownloadCSV}
            >
              Download
            </Button>
          </div>
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
            ) : this.state.postList.length === 0 ? (
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
                      >
                        {title}
                      </a>
                    </td>
                    <td>{description}</td>
                    <td>{created_user.name}</td>
                    <td>{created_at}</td>
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
            fetchList={this.fetchPostList}
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
