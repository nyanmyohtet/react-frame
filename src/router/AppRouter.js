import React from "react";
import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import Login from "../pages/Login/Login";
import Post from "../pages/Post/Post";

const AppRouter = () => (
    <Router>
        <Switch>
            <PublicRoute path="/login" component={Login} />
            <PrivateRoute path="/post" component={Post} />

            {/* Redirect all 404's to home */}
            <Redirect to='/post' />
        </Switch>
    </Router>
);

export default AppRouter;
