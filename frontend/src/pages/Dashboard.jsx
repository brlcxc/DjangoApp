import { useEffect, useState } from "react";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";

function Dashboard() {
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
        <div>
            <h1>Welcome, {userName}!</h1>
        </div>
    )
}

export default Dashboard;