import React from "react";
import { connect } from "react-redux";
import { Route, Redirect } from "react-router-dom";
import Header from "../components/Header";

const PrivateRoute = ({ isLoggedIn, component: Component, ...rest }) => (
    <Route
        {...rest}
        component={props =>
            isLoggedIn ? (
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
    isLoggedIn: state.auth.isLoggedIn
});

export default connect(mapStateToProps)(PrivateRoute);
