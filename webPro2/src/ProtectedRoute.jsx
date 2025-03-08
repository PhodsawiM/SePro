// ProtectedRoute.js
import React from "react";
import { Route, Redirect } from "react-router-dom";

const ProtectedRoute = ({ component: Component, requiredRole, ...rest }) => {
  const user = JSON.parse(localStorage.getItem("user")); // Retrieve the user data from localStorage

  if (!user) {
    // If user is not logged in, redirect to login page
    return <Redirect to="/login" />;
  }

  if (user.role !== requiredRole) {
    // If user does not have the required role, redirect to unauthorized page
    return <Redirect to="/unauthorized" />;
  }

  return <Route {...rest} render={(props) => <Component {...props} />} />;
};

export default ProtectedRoute;
