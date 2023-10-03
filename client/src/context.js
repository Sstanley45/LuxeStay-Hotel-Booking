import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const AppContext = React.createContext();

const AppProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  const saveUser = (user) => {
    setUser(user);
  };
  const removeUser = () => {
    setUser(null);
  };
  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/v1/users/showMe");
      saveUser(data.user);
    } catch (error) {
      removeUser();
    }
  };
  const logOut = async () => {
    try {
      await axios.delete("/api/v1/auth/logout");
      removeUser();
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AppContext.Provider value={{ saveUser, user, logOut ,fetchUser}}>
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppProvider };
