import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { VpnServer, fetchVpnServers, FALLBACK_SERVERS } from '../services/vpnService';

interface VpnContextType {
  status: 'disconnected' | 'connecting' | 'connected';
  servers: VpnServer[];
  selectedServer: VpnServer | null;
  loading: boolean;
  isKillSwitch: boolean;
  isAutoConnect: boolean;
  setKillSwitch: (val: boolean) => void;
  setAutoConnect: (val: boolean) => void;
  connect: () => Promise<void>;
  disconnect: () => void;
  selectServer: (server: VpnServer) => void;
  refreshServers: (background?: boolean) => Promise<void>;
}

const VpnContext = createContext<VpnContextType | undefined>(undefined);

export const VpnProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<'disconnected' | 'connecting' | 'connected'>('disconnected');
  const [servers, setServers] = useState<VpnServer[]>(FALLBACK_SERVERS);
  const [selectedServer, setSelectedServer] = useState<VpnServer | null>(FALLBACK_SERVERS[0]);
  const [loading, setLoading] = useState(false);
  const [isKillSwitch, setKillSwitch] = useState(false);
  const [isAutoConnect, setAutoConnect] = useState(true);

  const refreshServers = useCallback(async (background = false) => {
    if (!background) setLoading(true);
    try {
      const data = await fetchVpnServers();
      if (data && data.length > 0) {
          setServers(data);
          if (!selectedServer || selectedServer.hostName.startsWith('sky-')) {
            setSelectedServer(data[0]);
            // SMART CONNECT LOGIC: Auto-connect if enabled
            if (isAutoConnect && status === 'disconnected') {
               // We'll trigger this in an effect instead to avoid state conflicts
            }
          }
      }
    } catch (error) {
      console.error('Failed to refresh servers:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedServer, isAutoConnect, status]);

  // Initial fetch on mount
  useEffect(() => {
    refreshServers(true); // Background fetch on launch
  }, []);

  const connect = async () => {
    if (!selectedServer) return;
    
    setStatus('connecting');
    // Simulate connection lag
    setTimeout(() => {
      setStatus('connected');
    }, 3000);
  };

  const disconnect = () => {
    setStatus('disconnected');
  };

  const selectServer = (server: VpnServer) => {
    setSelectedServer(server);
    if (status === 'connected') {
      setStatus('disconnected');
    }
  };

  return (
    <VpnContext.Provider
      value={{
        status,
        servers,
        selectedServer,
        loading,
        isKillSwitch,
        isAutoConnect,
        setKillSwitch,
        setAutoConnect,
        connect,
        disconnect,
        selectServer,
        refreshServers,
      }}
    >
      {children}
    </VpnContext.Provider>
  );
};

export const useVpn = () => {
  const context = useContext(VpnContext);
  if (!context) {
    throw new Error('useVpn must be used within a VpnProvider');
  }
  return context;
};
