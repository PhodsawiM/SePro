import os from 'os';
import fs from 'fs';
import path from 'path';

// Function to get the local IP address
function getLocalIP() {
  const networkInterfaces = os.networkInterfaces();
  for (const interfaceName in networkInterfaces) {
    for (const interfaceInfo of networkInterfaces[interfaceName]) {
      if (interfaceInfo.family === 'IPv4' && !interfaceInfo.internal) {
        return interfaceInfo.address;
      }
    }
  }
  return '127.0.0.1'; // Default fallback to localhost
}

// Automatically get the local IP address
const localIP = getLocalIP();

// Write the local IP address to the .env file
async function writeToEnv() {
  // Get the directory of the current file
  const __dirname = path.dirname(new URL(import.meta.url).pathname); // Resolve the directory path

  const envPath = path.resolve(__dirname, '.env');
  const envContent = `VITE_API_URL=http://${localIP}:5000\n`;

  // Check if the directory exists and create it if not
  try {
    await fs.promises.mkdir(path.dirname(envPath), { recursive: true });
    await fs.promises.writeFile(envPath, envContent, 'utf8');
    console.log(`Successfully wrote local IP (${localIP}) to .env`);
  } catch (error) {
    console.error('Error writing to .env file:', error);
  }
}

// Run the function
writeToEnv();
