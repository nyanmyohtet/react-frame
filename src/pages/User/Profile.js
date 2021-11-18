import React, { Component } from "react";
import { Link } from "react-router-dom";
import Loading from "../../components/Loading";
import API from "../../api/api";
import authHeader from "../../services/auth-header.service";

export default class Profile extends Component {
    constructor(props) {
        super(props);

        this._isMounted = false;

        this.id = this.props.match.params.id;

        this.state = { user: {}, profile_image: "", loading: false };
        this.fetchUser = this.fetchUser.bind(this);
    }

    fetchUser() {
        if (this._isMounted) {
            this.setState({ loading: true });
        }
        API.get("users/" + this.id, { headers: authHeader() })
            .then(res => {
                if (this._isMounted) {
                    this.setState({
                        user: res.data.user,
                        profile_image: res.data.profile_image
                    });
                }
            })
            .then(() => {
                if (this._isMounted) this.setState({ loading: false });
            });
    }

    componentDidMount() {
        this._isMounted = true;
        this.fetchUser();
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    render() {
        const loading = this.state.loading;

        if (loading) {
            return <Loading />;
        }

        const {
            id,
            name,
            email,
            type,
            phone,
            birth_date: dateOfBirth,
            address
        } = this.state.user;

        const profile_image = this.state.profile_image;

        return (
            <div className="sub-container">
                <div className="row">
                    <div className="col d-md-flex justify-content-between">
                        <div>
                            <h2>User Profile</h2>
                        </div>
                        <div>
                            <Link to={`/user/edit/${id}`}>Edit</Link>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">Name</div>
                    <div>{name}</div>
                </div>
                <div className="row">
                    <div className="col-md-4"></div>
                    <div>
                        <img
                            className="profile-image"
                            src={profile_image}
                            alt="Profile"
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4">Email</div>
                    <div>{email}</div>
                </div>
                <div className="row">
                    <div className="col-md-4">Type</div>
                    <div>{type == 0 ? "Admin" : "User"}</div>
                </div>
                <div className="row">
                    <div className="col-md-4">Phone</div>
                    <div>{phone}</div>
                </div>
                <div className="row">
                    <div className="col-md-4">Date Of Birth</div>
                    <div>{dateOfBirth}</div>
                </div>
                <div className="row">
                    <div className="col-md-4">Address</div>
                    <div>{address}</div>
                </div>
            </div>
        );
    }
}
