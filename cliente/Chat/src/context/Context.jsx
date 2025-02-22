import { createContext, useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import { verifyToken } from "../apis/auth.js";
import {useLocation} from 'react-router-dom'

const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRegister, setUserRegister] = useState(false);
  const [userLogin, setUserLogin] = useState(false);
  const location = useLocation();

  useEffect(() => {
    async function checkAuth() {
      const cookie = Cookies.get();
      console.log(cookie.token);
      if (cookie.token) {
        try {
          const res = await verifyToken(cookie.token);
          console.log("recibido el res")
          if (!res) {
            setIsAuthenticated(false);
            setLoading(false);
          } else {
            setIsAuthenticated(true);
            console.log(res.userId);
            console.log(isAuthenticated);
            setLoading(false);
          }
        } catch (error) {
          setIsAuthenticated(false);
        }
      } else {
        setLoading(false);
      }
    }

    checkAuth(); // Llamar a la función async
  }, [location]);

  return (
    <MyContext.Provider
      value={{ isAuthenticated, loading, setUserLogin, setUserRegister }}
    >
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => {
  return useContext(MyContext);
};
