import React from "react";
import { Navigate } from "react-router-dom";


const PrivateRoute = ({Component}) =>{
    
    const token = localStorage.access_token;
    return token ? <Component/>: <Navigate to="/login"></Navigate>;

}

export default PrivateRoute;