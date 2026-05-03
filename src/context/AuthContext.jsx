// context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

// Demo credentials
const DEMO_USERS = [
  { id: 1, email: "tutor@brownbrick.com", password: "password123", name: "Tutor", role: "tutor" },
  { id: 2, email: "admin@brownbrick.com", password: "admin123", name: "Admin", role: "admin" },
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check for saved session
    const savedUser = localStorage.getItem("tutorhub_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved user", e);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    setError(null);
    console.log("Attempting login with:", email, password);
    
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = DEMO_USERS.find(
          u => u.email.toLowerCase() === email.toLowerCase() && u.password === password
        );
        
        if (foundUser) {
          const { password, ...userWithoutPassword } = foundUser;
          setUser(userWithoutPassword);
          localStorage.setItem("tutorhub_user", JSON.stringify(userWithoutPassword));
          console.log("Login successful:", userWithoutPassword);
          resolve(userWithoutPassword);
        } else {
          const errorMsg = "Invalid email or password. Try: tutor@brownbrick.com / password123";
          setError(errorMsg);
          console.error("Login failed:", errorMsg);
          reject(new Error(errorMsg));
        }
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("tutorhub_user");
    console.log("Logged out");
  };

  const register = async (userData) => {
    setError(null);
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Check if user already exists
        const existingUser = DEMO_USERS.find(u => u.email.toLowerCase() === userData.email.toLowerCase());
        if (existingUser) {
          const errorMsg = "User already exists with this email";
          setError(errorMsg);
          reject(new Error(errorMsg));
        } else {
          // Create new user (in real app, send to backend)
          const newUser = {
            id: DEMO_USERS.length + 1,
            email: userData.email,
            name: userData.name,
            role: "tutor",
          };
          setUser(newUser);
          localStorage.setItem("tutorhub_user", JSON.stringify(newUser));
          console.log("Registration successful:", newUser);
          resolve(newUser);
        }
      }, 500);
    });
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};