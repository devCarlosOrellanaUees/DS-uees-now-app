import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { TokenUtils } from "@/utils/common";  // Asegúrate de importar TokenUtils

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  userData: any | null;
  setUserData: (userData: any) => void;  
  logout: () => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [userData, setUserData] = useState<any | null>(null);

  // Cargar el token desde sessionStorage al iniciar
  useEffect(() => {
    const savedToken = sessionStorage.getItem("authToken");  // Cambiar localStorage por sessionStorage
    if (savedToken) {
      setToken(savedToken);
      const decodedData = TokenUtils.getUserData(savedToken);  // Decodificar y obtener los datos del usuario
      setUserData(decodedData);
    }
  }, []);

  // Actualizar sessionStorage cada vez que el token cambie
  useEffect(() => {
    if (token) {
      sessionStorage.setItem("authToken", token);  // Guardar el token en sessionStorage
      const decodedData = TokenUtils.getUserData(token);  // Decodificar el token
      setUserData(decodedData);
    } else {
      sessionStorage.removeItem("authToken");  // Limpiar el token de sessionStorage si el token es nulo
    }
  }, [token]);

  const logout = () => {
    setToken(null);
    setUserData(null);
    sessionStorage.removeItem("authToken");  // Limpiar el token de sessionStorage al hacer logout
  };

  return (
    <AuthContext.Provider value={{ token, setToken, userData, setUserData, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
