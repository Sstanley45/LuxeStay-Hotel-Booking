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
    localStorage.removeItem('user');
  };

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/v1/users/showMe");
    //  console.log(data.user);
      saveUser(data.user); 
      localStorage.setItem('user', JSON.stringify(data.user));
    } catch (error) {
      // removeUser();
     // console.log('err while fetching user',error);
    }
  };
  const logOut = async () => {
    try {
      await axios.delete("/api/v1/auth/logout");
      removeUser();
       localStorage.removeItem("user");
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
    <AppContext.Provider value={{ user, logOut, fetchUser }}>
      {children}
    </AppContext.Provider>
  );
};

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppProvider };
