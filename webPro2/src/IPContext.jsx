// // IPContext.jsx
// import React, { createContext, useState, useEffect } from 'react';

// export const IPContext = createContext();

// export const IPProvider = ({ children }) => {
//   const [ip, setIP] = useState(null);

//   useEffect(() => {
//     // Fetch the LAN IP from your backend service
//     const fetchLANIP = async () => {
//       try {
//         const response = await fetch('http://localhost:5000/lan-ip'); // Replace with your backend URL
//         const data = await response.json();
//         setIP(data.lanIp);
//       } catch (error) {
//         console.error('Failed to fetch LAN IP address:', error);
//       }
//     };

//     fetchLANIP();
//   }, []);

//   return (
//     <IPContext.Provider value={ip}>
//       {children}
//     </IPContext.Provider>
//   );
// };
