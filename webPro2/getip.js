import os from 'os';
import fs from 'fs';
import path from 'path';

// Function to get the local IP address (for LAN usage)
function getLocalIP() {
  const networkInterfaces = os.networkInterfaces();
  for (const interfaceName in networkInterfaces) {
    for (const interfaceInfo of networkInterfaces[interfaceName]) {
      if (interfaceInfo.family === 'IPv4' && !interfaceInfo.internal) {
        return interfaceInfo.address; // Local IP address for LAN
      }
    }
  }
  return '127.0.0.1'; // Fallback to localhost if no LAN IP found
}

// Write the local IP address to the .env file
async function writeToEnv() {
  const localIP = getLocalIP();
  
  // Get the directory of the current file
  const __dirname = path.dirname(new URL(import.meta.url).pathname); // Resolve the directory path

  const envPath = path.resolve(__dirname, '.env');
  const envContent = `VITE_API_URL=http://${localIP}:5000\n`;  // Ensure using LAN IP with port 5000

  // Writing to the .env file asynchronously
  try {
    await fs.promises.writeFile(envPath, envContent, 'utf8');
    console.log(`Successfully wrote local IP (${localIP}) to .env with port 5000`);
  } catch (error) {
    console.error('Error writing to .env file:', error);
  }
}

// Run the function
writeToEnv();
