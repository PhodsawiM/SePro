import React, { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userid, setUserid] = useState(() => {
    if(!localStorage.getItem('id'))
    {
      return localStorage.getItem('id')
    }else{
      return null;
    }
  });

  // Update localStorage whenever the username changes
  useEffect(() => {
    if (userid) {
      localStorage.setItem('id', userid);
    } else {
      localStorage.removeItem('id'); // Remove if null
    }
  }, [userid]);

  return (
    <UserContext.Provider value={{ userid, setUserid}}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserid = () => {
  return useContext(UserContext);
};
