import { createContext, useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import { verifyToken } from "../apis/auth.js";

const MyContext = createContext();

export const MyProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function checkAuth() {
      const cookie = Cookies.get();
      console.log(cookie.token);
      if (cookie.token) {
        try {
          const res = await verifyToken(cookie.token);

          if (!res.userId) {
            setIsAuthenticated(false);
            setLoading(false);
          } else {
            setIsAuthenticated(true);
            console.log(res.userId);
            console.log(isAuthenticated)
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
  }, []);



  return (
    <MyContext.Provider value={{ isAuthenticated, loading }}>
      {children}
    </MyContext.Provider>
  );
};

export const useMyContext = () => {
  return useContext(MyContext);
};
