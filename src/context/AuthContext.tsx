// context/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';


interface User {
  idUsuario: number;
  user: string;
  password: string;
  idRol: number;
  idPersona: number;
}

interface Persona {
  idPersona: number;
  nombres: string;
  cedula: string;
  correo: string;
  telefono: string;
}

interface DataUser {
  user: User;
  persona: Persona;
}


interface AuthContextType {
  user: DataUser | null;
  setUser: (user: DataUser | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUserState] = useState<DataUser | null>(null);

  // Restaurar usuario desde localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUserState(JSON.parse(storedUser));
    }
  }, []);

  // Guardar en localStorage al cambiar
  const setUser = (user: DataUser | null) => {
    setUserState(user);
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  };

  const logout = () => {
    setUser(null); // Esto ya borra de estado y localStorage
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
