'use client';

import { useEffect, useState } from 'react';
import { getApiBaseUrl, updateApiBaseUrl } from '@/lib/api';

export default function ConnectionStatus() {
  const [isConnected, setIsConnected] = useState(false);
  const [apiUrl, setApiUrl] = useState('');
  const [isDetecting, setIsDetecting] = useState(true);

  useEffect(() => {
    detectBackendConnection();
  }, []);

  const detectBackendConnection = async () => {
    setIsDetecting(true);
    const commonPorts = [3001, 3002, 3003, 3004, 3005];
    
    for (const port of commonPorts) {
      try {
        const testUrl = `http://localhost:${port}`;
        const response = await fetch(`${testUrl}/api-json`, {
          method: 'GET',
          mode: 'cors',
        });
        
        if (response.ok) {
          updateApiBaseUrl(testUrl);
          setApiUrl(testUrl);
          setIsConnected(true);
          setIsDetecting(false);
          console.log(`✅ Connected to backend at ${testUrl}`);
          return;
        }
      } catch (error) {
        continue;
      }
    }
    
    // If no backend found, use default
    const defaultUrl = getApiBaseUrl();
    setApiUrl(defaultUrl);
    setIsConnected(false);
    setIsDetecting(false);
    console.warn('⚠️ Could not detect backend, using default URL');
  };

  if (isDetecting) {
    return (
      <div className="fixed top-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-3 py-2 rounded-md text-sm">
        🔍 Detecting backend...
      </div>
    );
  }

  return (
    <div className={`fixed top-4 right-4 px-3 py-2 rounded-md text-sm ${
      isConnected 
        ? 'bg-green-100 border border-green-400 text-green-700' 
        : 'bg-red-100 border border-red-400 text-red-700'
    }`}>
      {isConnected ? '✅' : '❌'} Backend: {apiUrl}
      {!isConnected && (
        <button 
          onClick={detectBackendConnection}
          className="ml-2 underline hover:no-underline"
        >
          Retry
        </button>
      )}
    </div>
  );
}