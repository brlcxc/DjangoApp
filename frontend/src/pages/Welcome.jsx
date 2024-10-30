import { useEffect, useState } from "react";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";

function Welcome() {
    const [userName, setUserName] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
          try {
            const token = localStorage.getItem(ACCESS_TOKEN);
    
            const response = await api.get('api/users/me/', {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });
    
            setUserName(response.data.display_name);
          } catch (error) {
            console.error('Error fetching user data:', error);
          }
        };
        fetchUserData();
      }, []);

    return(
        <div className="w-full h-full flex flex-col justify-center items-center bg-custom-gradient animate-gradient">
            <img className="h-1/3 w-auto" src="/Holofund.png"></img>
            <h1 className="text-8xl">Welcome, {userName}!</h1>
        </div>
    )
}

export default Welcome;