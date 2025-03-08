// import React from 'react';
// import { Navigate } from 'react-router-dom';

// const PrivateRoute = ({ component: Component }) => {
//     const isAuthenticated = !!localStorage.getItem('token'); // Check if the token is present

//     return isAuthenticated ? <Component /> : <Navigate to="/login" />; // Navigate to login if not authenticated
//   };
  
//   export default PrivateRoute;


import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element: Component, requiredRole, ...rest }) => {
    const token = localStorage.getItem('token'); // Check if the token is present
    const userRole = localStorage.getItem('role'); // Check user's role from localStorage

    if (!token) {
        // If no token, redirect to login page
        return <Navigate to="/login" />;
    }

    if (requiredRole && userRole !== requiredRole) {
        // If the user's role does not match the required role, redirect to unauthorized page
        return <Navigate to="/home" />;
    }

    return <Component {...rest} />; // Render the component if the checks pass
};

export default PrivateRoute;
