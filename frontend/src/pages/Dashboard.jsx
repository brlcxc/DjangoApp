import { useEffect, useState } from "react";
import api from "../api";
import { ACCESS_TOKEN } from "../constants";
import NavBar from "../components/NavBar";
import { FaHouse } from "react-icons/fa6";

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
        <div className="flex h-screen">
            <NavBar/>
            <div className="flex-1 overflow-y-auto">
              <h1>Welcome, {userName}!</h1>
            </div>
        </div>
    )
}

export default Dashboard;