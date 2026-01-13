import { createContext, useState, useEffect } from "react";
import axios from "axios";

export const UserContext = createContext();

export default function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:8000/api/v1/me", {
        withCredentials: true,
      });
      setUser(data.user);
    } catch (error) {
      if (error.response?.status === 401) {
          console.log("User not logged in yet");
          setUser(null);
      }
      else{
        console.error("Unexpected error:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, loading, fetchUser}}>
      {children}
    </UserContext.Provider>
  );
}
