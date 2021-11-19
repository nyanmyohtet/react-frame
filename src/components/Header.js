import React, { Component } from "react";
import { connect } from "react-redux";
import { LOGOUT } from "../actions/types";
import NavBar from "./NavBar";
import { LocalStorage } from "../services/LocalStorage/LocalStorage.service";

class Header extends Component {
    constructor(props) {
        super(props);
        this.handleLogout = this.handleLogout.bind(this);
    }

    handleLogout(e) {
        e.preventDefault();
        const { dispatch } = this.props;

        LocalStorage.remove("user");

        dispatch({
            type: LOGOUT
        });
    }

    render() {
        return <NavBar handleLogout={this.handleLogout} {...this.props} />;
    }
}

const mapStateToProps = state => ({
    isLoggedIn: state.auth.isLoggedIn,
    user: state.auth.user
});

export default connect(mapStateToProps)(Header);
