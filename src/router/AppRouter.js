import React from "react";
import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import LoginPage from "../pages/Login/LoginPage";
import PostPage from "../pages/Post/PostPage";

const AppRouter = () => (
  <Router>
    <Switch>
      <PublicRoute path="/login" component={LoginPage} />
      <PrivateRoute path="/post" component={PostPage} />

      {/* Redirect all 404's to home */}
      <Redirect to='/post' />
    </Switch>
  </Router>
);

export default AppRouter;
