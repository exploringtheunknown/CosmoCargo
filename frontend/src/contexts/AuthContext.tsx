"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Hardcoded credentials for mock authentication with random passwords
const MOCK_USERS = [
  {
    email: "user@example.com",
    password: "mKv2P8dXrL9F",
    name: "Johan Andersson",
    role: "customer",
  },
  {
    email: "pilot@example.com",
    password: "zH7yB3tR5wQ9s",
    name: "Erik Nilsson",
    role: "pilot",
  },
  {
    email: "admin@example.com",
    password: "eT4xD6cV2gN8p",
    name: "Maria Johansson",
    role: "admin",
  },
];

interface User {
  email: string;
  name: string;
  role: "customer" | "pilot" | "admin";
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUserProfile?: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  // Check for stored auth on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse stored user data", error);
        localStorage.removeItem("user");
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const foundUser = MOCK_USERS.find(
      (u) =>
        u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (foundUser) {
      const userWithoutPassword: User = {
        email: foundUser.email,
        name: foundUser.name,
        role: foundUser.role as "customer" | "pilot" | "admin",
      };
      setUser(userWithoutPassword);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(userWithoutPassword));
      toast.success(`Välkommen, ${userWithoutPassword.name}!`);
      return true;
    }

    toast.error("Felaktiga inloggningsuppgifter");
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    toast.info("Du har loggats ut");
    router.push("/");
  };

  const updateUserProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, login, logout, updateUserProfile }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
