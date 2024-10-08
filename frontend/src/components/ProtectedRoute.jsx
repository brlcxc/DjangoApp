import {Navigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useState } from "react";

function ProtectedRoute({children}) {
    const [isAuthorized, setIsAuthorized] = useState(null);

    const refreshToken = async () => {

    }

    const auth = async () => {

    }

    if (isAuthorized === null){
        return <div>Loading...</div>;
    }

    return isAuthorized ? children : <Navigate to = "/login"/>;
}

export default ProtectedRoute;