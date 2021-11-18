import React from "react";
import { BrowserRouter as Router, Switch } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import HomePage from "../pages/Home/Home";
import Login from "../pages/Login/Login";
import User from "../pages/User/User";
import Profile from "../pages/User/Profile";
import CreateUser from "../pages/User/Create";
import EditUser from "../pages/User/Edit";
import Post from "../pages/Post/Post";
import CreatePost from "../pages/Post/Create";
import EditPost from "../pages/Post/Edit";
import PostUploadCSV from "../pages/Post/UploadCSV";

const AppRouter = () => (
    <Router>
        <Switch>
            <PublicRoute path="/" component={HomePage} exact />
            <PublicRoute path="/login" component={Login} />
            <PrivateRoute path="/post/create" component={CreatePost} />
            <PrivateRoute path="/post/edit/:id" component={EditPost} />
            <PrivateRoute path="/post/upload-csv" component={PostUploadCSV} />
            <PublicRoute path="/post" component={Post} />
            <AdminRoute path="/user/create" component={CreateUser} />
            <AdminRoute path="/user/edit/:id" component={EditUser} />
            <AdminRoute path="/user/:id" component={Profile} />
            <AdminRoute path="/user" component={User} />
        </Switch>
    </Router>
);

export default AppRouter;
