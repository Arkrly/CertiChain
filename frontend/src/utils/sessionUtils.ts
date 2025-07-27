// Session management utilities for wallet connection

export const SESSION_KEYS = {
  WALLET_CONNECTION: 'walletConnection'
} as const;

/**
 * Clear all wallet-related session data
 */
export const clearWalletSession = (): void => {
  try {
    sessionStorage.removeItem(SESSION_KEYS.WALLET_CONNECTION);
    console.log('Wallet session cleared');
  } catch (error) {
    console.warn('Failed to clear wallet session:', error);
  }
};

/**
 * Get wallet connection from session storage
 */
export const getWalletSession = (): { address: string; walletType: string } | null => {
  try {
    const storedConnection = sessionStorage.getItem(SESSION_KEYS.WALLET_CONNECTION);
    if (storedConnection) {
      return JSON.parse(storedConnection);
    }
  } catch (error) {
    console.warn('Failed to parse wallet session:', error);
    clearWalletSession(); // Clear corrupted data
  }
  return null;
};

/**
 * Set wallet connection in session storage
 */
export const setWalletSession = (address: string, walletType: 'leather' | 'xverse'): void => {
  try {
    const connectionData = { address, walletType };
    sessionStorage.setItem(SESSION_KEYS.WALLET_CONNECTION, JSON.stringify(connectionData));
    console.log('Wallet session stored:', walletType);
  } catch (error) {
    console.error('Failed to store wallet session:', error);
  }
};

/**
 * Setup session cleanup event listeners
 */
export const setupSessionCleanup = (): (() => void) => {
  const handleBeforeUnload = () => {
    clearWalletSession();
  };

  const handleUnload = () => {
    clearWalletSession();
  };

  const handleVisibilityChange = () => {
    // Optional: Clear session when tab becomes hidden
    if (document.hidden) {
      clearWalletSession();
    }
  };

  // Add event listeners
  window.addEventListener('beforeunload', handleBeforeUnload);
  window.addEventListener('unload', handleUnload);
  document.addEventListener('visibilitychange', handleVisibilityChange);

  // Return cleanup function
  return () => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
    window.removeEventListener('unload', handleUnload);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
};

/**
 * Check if wallet session is valid
 */
export const isWalletSessionValid = (): boolean => {
  const session = getWalletSession();
  return session !== null && !!session.address && !!session.walletType;
};
