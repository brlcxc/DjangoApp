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
        const token = localStorage.getItem(ACCESS_TOKEN);
        if(!token){
            setIsAuthorized(false);
            return;
        }
        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        const now = Date.now() / 1000;
        if (tokenExpiration < now) {
            await refreshToken();
        }
        else{
            setIsAuthorized(true);
        }
    }

    if (isAuthorized === null){
        return <div>Loading...</div>;
    }

    return isAuthorized ? children : <Navigate to = "/login"/>;
}

export default ProtectedRoute;