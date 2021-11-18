import React from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import Header from "../components/Header";

const AdminRoute = ({ isLoggedIn, isAdmin, component: Component, ...rest }) => (
    <Route
        {...rest}
        component={props =>
            isLoggedIn && isAdmin ? (
                <div className="container">
                    <Header {...props} />
                    <Component {...props} />
                </div>
            ) : (
                <Redirect to="/" />
            )
        }
    />
);

const mapStateToProps = state => ({
    isLoggedIn: state.auth.isLoggedIn,
    isAdmin: state.auth.isAdmin
});

export default connect(mapStateToProps)(AdminRoute);
