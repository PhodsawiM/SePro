import React, { createContext, useState, useContext } from 'react';

// Create the context
const ModelContext = createContext();

// Provider component
export const ModelProvider = ({ children }) => {
  const [model, setModel] = useState(null);

  return (
    <ModelContext.Provider value={{ model, setModel }}>
      {children}
    </ModelContext.Provider>
  );
};

// Custom hook to use the ModelContext
export const useModel = () => {
  return useContext(ModelContext);
};
