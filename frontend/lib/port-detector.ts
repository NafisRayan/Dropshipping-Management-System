import fs from 'fs';
import path from 'path';

export function getBackendUrl(): string {
  try {
    // Try to read the backend port file
    const portFilePath = path.join(process.cwd(), '../backend-port.json');
    if (fs.existsSync(portFilePath)) {
      const portData = JSON.parse(fs.readFileSync(portFilePath, 'utf8'));
      return portData.apiUrl;
    }
  } catch (error) {
    console.warn('Could not read backend port file, using default');
  }
  
  // Fallback to environment variable or default
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
}

export async function detectBackendPort(): Promise<string> {
  // For client-side detection, try common ports
  const commonPorts = [3001, 3002, 3003, 3004, 3005];
  
  for (const port of commonPorts) {
    try {
      const response = await fetch(`http://localhost:${port}/api-json`, {
        method: 'GET',
        mode: 'cors',
      });
      if (response.ok) {
        return `http://localhost:${port}`;
      }
    } catch (error) {
      // Port not available, try next
      continue;
    }
  }
  
  // Fallback
  return 'http://localhost:3001';
}