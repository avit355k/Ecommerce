import React, {useContext} from "react";
import {Navigate, Outlet} from "react-router-dom";
import {Mycontext} from "../../App";

const ProtectedRoute = () => {
    const {isLogin} = useContext(Mycontext);

    return isLogin ? <Outlet/> : <Navigate to="/login" replace/>;
};

export default ProtectedRoute;