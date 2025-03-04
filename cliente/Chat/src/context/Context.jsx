import { createContext, useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import { verifyToken } from "../apis/auth.js";

const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState({});

  const checkAuth = async () => {
    const cookie = Cookies.get("token");
    console.log(cookie);
    if (cookie) {
      try {
        const res = await verifyToken(cookie);
        console.log("recibido el res");
        if (!res) {
          setIsAuthenticated(false);
          setLoading(false);
        } else {
          setUser({ username: res.username });
          setIsAuthenticated(true);
          setLoading(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    } else {
      setLoading(false);
    }
  };

  return (
    <MyContext.Provider value={{ isAuthenticated, loading, user, checkAuth }}>
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => {
  return useContext(MyContext);
};
