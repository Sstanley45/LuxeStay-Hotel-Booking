import React from "react";
import { useGlobalContext } from "../context";
import { useNavigate } from "react-router-dom";

//profile page is a protected route so a user is required!
const user = JSON.parse(localStorage.getItem("user"));

const ProtectedRoute = ({ children }) => {
    const navigate= useNavigate()
    
    if (!user) {
        setTimeout(() => {
            navigate('/login')
        }, 1000)
        return;
    } else {
        return (children)
    }
};

export default ProtectedRoute;
