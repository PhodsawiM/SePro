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
    const token = localStorage.getItem('token'); 
    const userRole = localStorage.getItem('role'); 

    if (!token) {
        return <Navigate to="/login" />;
    }

    if (requiredRole && userRole !== requiredRole) {
        return <Navigate to="/home" />;
    }

    return <Component {...rest} />; 
};

export default PrivateRoute;
