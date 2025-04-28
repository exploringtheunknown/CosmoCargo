"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { api } from "../services/api";
import { UserRole } from "../model/types";
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

const mapRoleToFrontend = (backendRole: UserRole | string | number): 'customer' | 'pilot' | 'admin' => {
  
  if (typeof backendRole === 'number') {
    switch (backendRole) {
      case 0: return 'customer';
      case 1: return 'pilot';
      case 2: return 'admin';
      default: return 'customer';
    }
  }
  
  const normalizedRole = String(backendRole).trim().toLowerCase();
  
  if (normalizedRole.includes('admin')) return 'admin';
  if (normalizedRole.includes('pilot')) return 'pilot';
  if (normalizedRole.includes('customer')) return 'customer';
  
  return 'customer';
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const router = useRouter();

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
    try {
      const loginResponse = await api.post<{ message: string }>('/auth/login', { email, password });
      if (!loginResponse.ok) {
        throw new Error('Login failed');
      }
      
      const userResponse = await api.get<User>('/users/me');
      if (!userResponse.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const userData = userResponse.data;
      
      const frontendRole = mapRoleToFrontend(userData.role);
      
      setUser({
        ...userData,
        role: frontendRole
      });
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(userData));
      toast.success(`Välkommen, ${userData.name}!`);
      return true;
    } catch {
      toast.error("Felaktiga inloggningsuppgifter");
      return false;
    }
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
