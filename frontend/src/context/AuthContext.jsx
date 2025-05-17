import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getUser, loginUser, logoutUser, registerUser, reverify } from "../services/api";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on initial load
  const checkLoggedIn = async () => {
    try {
      const res = await getUser();
      if (res.data.success) {
        setUser(res.data.user);
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkLoggedIn();
  }, []);
  // Register user
  const register = async (userData) => {
    try {
      const res = await registerUser(userData);
      return { success: true, message: res.data.message };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Registration failed",
      };
    }
  };
  // Login user
  const login = async (email, password) => {
    try {
      const res = await loginUser(email, password);
      if (res.data.success) {
        setUser(res.data.user);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Login failed",
        needsVerification: error.response?.data?.needsVerification || false,
      };
    }
  };

  // Resend verification email
  const resendVerification = async (email) => {
    try {
      const res = await reverify(email);
      return { success: true, message: res.data.message };
    } catch (error) {
      return {
        success: false,
        error:
          error.response?.data?.error || "Failed to resend verification email",
      };
    }
  };

  // Logout user
  const logout = async () => {
    try {
      await logoutUser();
      setUser(null);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Logout failed",
      };
    }
  };

  // Refresh user data
  const refreshUserData = useCallback( async () => {
    try {
      const res = await getUser();
      if (res.data.success) {
        setUser(res.data.user);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to refresh user data",
      };
    }
  },[]);

    const value = {
      user,
      loading,
      register,
      login,
      logout,
      refreshUserData,
      resendVerification,
      isAdmin: user?.role === "admin",
    };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
