import {Navigate} from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import api from "../api";
import { REFRESH_TOKEN, ACCESS_TOKEN } from "../constants";
import { useState, useEffect } from "react";

function ProtectedRoute({children}) {
    const [isAuthorized, setIsAuthorized] = useState(null);

    // Check authorization
    useEffect(()=>{
        auth().catch(()=>setIsAuthorized(false));
    }, []); 
    // Empty dependency array [] ensures this only runs once on mount (DOM loaded)

    const refreshToken = async () => {
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        try{
            // Request new access token
            const res = await api.post("/api/token/refresh/", {
                refresh: refreshToken
            });
            if (res.status === 200){
                // Refresh successful; save new access token and set authorized to true
                localStorage.setItem(ACCESS_TOKEN, res.data.access);
                setIsAuthorized(true);
            }
            else{
                setIsAuthorized(false);
            }
        }
        catch (error){
            console.log(error);
            setIsAuthorized(false);
        }
    }

    const auth = async () => {
        // Get access token from local storage
        const token = localStorage.getItem(ACCESS_TOKEN);
        if(!token){
            setIsAuthorized(false);
            return;
        }
        // Decode jwt token (looking for expiration)
        const decoded = jwtDecode(token);
        const tokenExpiration = decoded.exp;
        const now = Date.now() / 1000;
        if (tokenExpiration < now) {
            // If token expired, attempt refresh
            await refreshToken();
        }
        else{
            setIsAuthorized(true);
        }
    }

    // Show loading state while checking authorization (could change this)
    if (isAuthorized === null){
        return <div>Loading...</div>;
    }

    // If authorized, render protected components (children), otherwise send user to login
    return isAuthorized ? children : <Navigate to = "/login"/>;
}

export default ProtectedRoute;