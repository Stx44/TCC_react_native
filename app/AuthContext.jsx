import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuarioId, setUsuarioId] = useState(null);

  const login = (id) => {
    setUsuarioId(id);
  };

  const logout = () => {
    setUsuarioId(null);
  };

  return (
    <AuthContext.Provider value={{ usuarioId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};