/* eslint-disable react-refresh/only-export-components */
import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getCurrentUser,
  loginUser,
} from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  // ========================================
  // LOAD USER WHEN APP STARTS
  // ========================================
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const data = await getCurrentUser();

        const currentUser = data.user || data;

        setUser(currentUser);

        localStorage.setItem(
          "user",
          JSON.stringify(currentUser)
        );
      } catch (error) {
        console.error(
          "Load user error:",
          error.response?.data?.message ||
            error.message
        );

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // ========================================
  // LOGIN
  // ========================================
  const login = async (email, password) => {
    const data = await loginUser({
      email,
      password,
    });

    if (!data.token) {
      throw new Error(
        "Login response did not contain a token"
      );
    }

    localStorage.setItem(
      "token",
      data.token
    );

    const currentUser =
      data.user || data.data?.user;

    if (currentUser) {
      setUser(currentUser);

      localStorage.setItem(
        "user",
        JSON.stringify(currentUser)
      );
    } else {
      const userResponse =
        await getCurrentUser();

      const fetchedUser =
        userResponse.user || userResponse;

      setUser(fetchedUser);

      localStorage.setItem(
        "user",
        JSON.stringify(fetchedUser)
      );
    }

    return data;
  };

  // ========================================
  // LOGOUT
  // ========================================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};