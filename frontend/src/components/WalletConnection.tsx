import React, { useState, useEffect } from 'react';
import './WalletConnection.css';

interface WalletConnectionProps {
  onConnected: (address: string, isConnected: boolean) => void;
  isConnected?: boolean;
  walletAddress?: string;
}

const WalletConnection: React.FC<WalletConnectionProps> = ({
  onConnected,
  isConnected = false,
  walletAddress = ''
}) => {
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string>('');
  const [walletType, setWalletType] = useState<'leather' | 'xverse' | null>(null);

  // Check for stored wallet connection on component mount
  useEffect(() => {
    const checkStoredConnection = () => {
      try {
        const storedConnection = localStorage.getItem('walletConnection');
        if (storedConnection) {
          const { address, walletType: storedWalletType } = JSON.parse(storedConnection);
          if (address && storedWalletType) {
            console.log('Found stored wallet connection:', storedWalletType, address);
            setWalletType(storedWalletType);
            onConnected(address, true);
          }
        }
      } catch {
        console.log('No valid stored connection found');
        localStorage.removeItem('walletConnection');
      }
    };

    checkStoredConnection();
  }, [onConnected]);

  const connectLeatherWallet = async () => {
    try {
      setConnecting(true);
      setError('');

      if (!window.LeatherProvider) {
        throw new Error('Leather wallet not found. Please install Leather wallet extension.');
      }

      console.log('User clicked connect button - requesting wallet connection...');

      // Try the simple approach first
      let response;
      
      try {
        // This should work with most Leather wallet versions
        response = await window.LeatherProvider.request('getAddresses');
        console.log('getAddresses response:', response);
      } catch (error: unknown) {
        console.log('getAddresses failed, trying alternative method');
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        if (errorMessage.includes('User rejected') || errorMessage.includes('rejected')) {
          throw new Error('Connection was rejected. Please try again and approve the connection in your wallet.');
        }
        
        // Try alternative method
        try {
          response = await window.LeatherProvider.request('stacks_getAccounts');
          console.log('stacks_getAccounts response:', response);
        } catch (fallbackError: unknown) {
          console.error('Both methods failed:', fallbackError);
          throw new Error('Unable to connect to Leather wallet. Please ensure your wallet is unlocked and try refreshing the page.');
        }
      }
      
      console.log('Leather wallet full response:', JSON.stringify(response, null, 2));
      
      // Extract address from response
      let address = '';
      
      if (response && typeof response === 'object' && 'result' in response) {
        const result = response.result;
        
        // Handle array response
        if (Array.isArray(result) && result.length > 0) {
          const firstItem = result[0];
          if (typeof firstItem === 'string') {
            address = firstItem;
          } else if (firstItem && typeof firstItem === 'object' && 'address' in firstItem) {
            address = String(firstItem.address);
          }
        }
        // Handle object with addresses array
        else if (result && typeof result === 'object' && 'addresses' in result) {
          const addresses = (result as { addresses: unknown[] }).addresses;
          if (Array.isArray(addresses) && addresses.length > 0) {
            const firstAddr = addresses[0];
            if (typeof firstAddr === 'string') {
              address = firstAddr;
            } else if (firstAddr && typeof firstAddr === 'object' && 'address' in firstAddr) {
              address = String((firstAddr as { address: unknown }).address);
            }
          }
        }
        // Handle direct address property
        else if (result && typeof result === 'object' && 'address' in result) {
          address = String((result as { address: unknown }).address);
        }
        // Handle string result
        else if (typeof result === 'string') {
          address = result;
        }
      }
      
      console.log('Final extracted address:', address);
      
      if (address && typeof address === 'string' && address.length > 0) {
        setWalletType('leather');
        onConnected(address, true);
        
        // Store connection in localStorage
        localStorage.setItem('walletConnection', JSON.stringify({
          address,
          walletType: 'leather'
        }));
        
        console.log('Successfully connected to Leather wallet');
      } else {
        throw new Error('No valid address received from Leather wallet. Please make sure your wallet is unlocked and has at least one account.');
      }
    } catch (err: unknown) {
      console.error('Leather wallet connection error:', err);
      let errorMessage = 'Failed to connect to Leather wallet';
      
      if (err instanceof Error) {
        if (err.message.includes('User rejected') || err.message.includes('rejected')) {
          errorMessage = 'Connection was rejected. Please try again and approve the connection in your wallet.';
        } else if (err.message.includes('not found') || err.message.includes('undefined')) {
          errorMessage = 'Leather wallet not found. Please make sure it is installed and refresh the page.';
        } else if (err.message.includes('not supported')) {
          errorMessage = 'Please update your Leather wallet to the latest version for better compatibility.';
        } else {
          errorMessage = err.message;
        }
      }
      
      setError(errorMessage);
    } finally {
      setConnecting(false);
    }
  };

  const connectXverseWallet = async () => {
    try {
      setConnecting(true);
      setError('');

      if (!window.XverseProviders?.StacksProvider) {
        throw new Error('Xverse wallet not found. Please install Xverse wallet extension.');
      }

      console.log('User clicked connect button - requesting Xverse wallet connection...');

      const response = await window.XverseProviders.StacksProvider.request('getAddresses', {});
      
      if (response.result?.addresses?.length > 0) {
        const address = response.result.addresses[0].address;
        setWalletType('xverse');
        onConnected(address, true);
        
        // Store connection in localStorage
        localStorage.setItem('walletConnection', JSON.stringify({
          address,
          walletType: 'xverse'
        }));
      } else {
        throw new Error('No addresses found in Xverse wallet');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to connect to Xverse wallet';
      if (errorMessage.includes('User rejected') || errorMessage.includes('rejected')) {
        setError('Connection was rejected. Please try again and approve the connection in your wallet.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setConnecting(false);
    }
  };

  const disconnectWallet = async () => {
    try {
      if (walletType === 'leather' && window.LeatherProvider) {
        await window.LeatherProvider.request('signOut', {});
      }
      
      setWalletType(null);
      onConnected('', false);
      setError('');
      
      // Clear stored connection
      localStorage.removeItem('walletConnection');
    } catch (err: unknown) {
      console.error('Error disconnecting wallet:', err);
    }
  };

  const formatAddress = (address: string) => {
    if (!address || typeof address !== 'string') return '';
    return `${address.slice(0, 8)}...${address.slice(-8)}`;
  };

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      // You could add a toast notification here
    }
  };

  const openWalletStore = (wallet: 'leather' | 'xverse') => {
    const urls = {
      leather: {
        chrome: 'https://chrome.google.com/webstore/detail/leather/ldinpeekobnhjjdofggfgjlcehhmanlj',
        firefox: 'https://addons.mozilla.org/en-US/firefox/addon/leather/'
      },
      xverse: {
        chrome: 'https://chrome.google.com/webstore/detail/xverse-wallet/idnnbdplmphpflfnlkomgpfbpcgelopg',
        firefox: 'https://addons.mozilla.org/en-US/firefox/addon/xverse-wallet/'
      }
    };

    // Detect browser and open appropriate store
    const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    const storeUrl = isFirefox ? urls[wallet].firefox : urls[wallet].chrome;
    window.open(storeUrl, '_blank');
  };

  if (isConnected && walletAddress) {
    return (
      <div className="wallet-connection connected">
        <div className="connection-header">
          <h3>🔗 Wallet Connected</h3>
        </div>
        
        <div className="wallet-info">
          <div className="wallet-details">
            <div className="wallet-type">
              {walletType === 'leather' ? (
                <span className="wallet-badge leather">🔥 Leather Wallet</span>
              ) : (
                <span className="wallet-badge xverse">⚡ Xverse Wallet</span>
              )}
            </div>
            
            <div className="address-display">
              <span className="address-label">Address:</span>
              <div className="address-container">
                <span className="address-text">{formatAddress(walletAddress)}</span>
                <button 
                  onClick={copyAddress}
                  className="copy-address-btn"
                  title="Copy full address"
                >
                  📋
                </button>
              </div>
            </div>
          </div>

          <div className="connection-actions">
            <button 
              onClick={disconnectWallet}
              className="disconnect-btn"
            >
              🔌 Disconnect
            </button>
          </div>
        </div>

        <div className="connection-status">
          <div className="status-indicator connected"></div>
          <span>Ready to mint certificates</span>
        </div>
      </div>
    );
  }

  return (
    <div className="wallet-connection">
      <div className="connection-header">
        <h3>🔗 Connect Your Wallet</h3>
        <p>Connect your Stacks wallet to mint certificate NFTs</p>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
          <button 
            onClick={() => setError('')}
            className="error-close"
          >
            ✕
          </button>
        </div>
      )}

      <div className="wallet-options">
        <div className="wallet-option">
          <div className="wallet-info-card">
            <div className="wallet-icon">🔥</div>
            <div className="wallet-details">
              <h4>Leather Wallet</h4>
              <p>The original Stacks wallet with advanced features</p>
            </div>
          </div>
          
          <div className="wallet-actions">
            {window.LeatherProvider ? (
              <button 
                onClick={connectLeatherWallet}
                disabled={connecting}
                className="connect-btn leather"
              >
                {connecting ? '⏳ Connecting...' : '🔗 Connect Leather'}
              </button>
            ) : (
              <div className="install-section">
                <p className="install-text">Leather wallet not detected</p>
                <button 
                  onClick={() => openWalletStore('leather')}
                  className="install-btn"
                >
                  📥 Install Leather
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="wallet-option">
          <div className="wallet-info-card">
            <div className="wallet-icon">⚡</div>
            <div className="wallet-details">
              <h4>Xverse Wallet</h4>
              <p>Multi-chain wallet supporting Bitcoin and Stacks</p>
            </div>
          </div>
          
          <div className="wallet-actions">
            {window.XverseProviders?.StacksProvider ? (
              <button 
                onClick={connectXverseWallet}
                disabled={connecting}
                className="connect-btn xverse"
              >
                {connecting ? '⏳ Connecting...' : '🔗 Connect Xverse'}
              </button>
            ) : (
              <div className="install-section">
                <p className="install-text">Xverse wallet not detected</p>
                <button 
                  onClick={() => openWalletStore('xverse')}
                  className="install-btn"
                >
                  📥 Install Xverse
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="connection-info">
        <div className="info-item">
          <span className="info-icon">🔒</span>
          <span>Your wallet remains secure - we never store your private keys</span>
        </div>
        <div className="info-item">
          <span className="info-icon">⛽</span>
          <span>Small STX fee required for minting certificate NFTs</span>
        </div>
        <div className="info-item">
          <span className="info-icon">🌐</span>
          <span>Works with Stacks mainnet and testnet</span>
        </div>
      </div>
    </div>
  );
};

// Extend Window interface for wallet providers
declare global {
  interface Window {
    LeatherProvider?: {
      request: (method: string, params?: object) => Promise<{ 
        result?: unknown;
        error?: string;
      }>;
    };
    XverseProviders?: {
      StacksProvider?: {
        request: (method: string, params: object) => Promise<{ result: { addresses: { address: string }[] } }>;
      };
    };
  }
}

export default WalletConnection;
