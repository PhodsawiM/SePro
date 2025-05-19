import React, { createContext, useState } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    const [ip, setGlobalVariable] = useState("192.168.1.129");

    return (
        <GlobalContext.Provider value={{ ip, setGlobalVariable }}>
            {children}
        </GlobalContext.Provider>
    );
};
