// Contract configuration for different networks
// This is where you configure your deployed contract addresses

export interface ContractConfig {
  address: string;
  name: string;
}

export interface NetworkConfig {
  stacksApi: string;
  explorerUrl: string;
  network: 'mainnet' | 'testnet' | 'devnet';
  contracts: {
    certchain: ContractConfig;
    certchainUtil: ContractConfig;
  };
}

// Network configurations
export const NETWORK_CONFIG: Record<string, NetworkConfig> = {
  testnet: {
    stacksApi: 'https://api.testnet.hiro.so',
    explorerUrl: 'https://explorer.hiro.so',
    network: 'testnet',
    contracts: {
      certchain: {
        // TODO: Replace with your actual deployed contract address
        address: 'STWP05KMRQCK2S63Q78BA8HDZ84KYGGGXGYNME2A', // From deployment plan
        name: 'certchain'
      },
      certchainUtil: {
        // TODO: Replace with your actual deployed contract address
        address: 'STWP05KMRQCK2S63Q78BA8HDZ84KYGGGXGYNME2A', // From deployment plan
        name: 'certchain-util'
      }
    }
  },
  
  devnet: {
    stacksApi: 'http://localhost:3999',
    explorerUrl: 'http://localhost:8000',
    network: 'devnet',
    contracts: {
      certchain: {
        // For local development - update after deploying to devnet
        address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        name: 'certchain'
      },
      certchainUtil: {
        address: 'ST1PQHQKV0RJXZFY1DGX8MNSNYVE3VGZJSRTPGZGM',
        name: 'certchain-util'
      }
    }
  },
  
  mainnet: {
    stacksApi: 'https://api.hiro.so',
    explorerUrl: 'https://explorer.hiro.so',
    network: 'mainnet',
    contracts: {
      certchain: {
        // TODO: Replace with your mainnet contract address when ready
        address: '', // Add your mainnet contract address here
        name: 'certchain'
      },
      certchainUtil: {
        address: '', // Add your mainnet contract address here
        name: 'certchain-util'
      }
    }
  }
};

// Default network (change this to switch networks)
export const DEFAULT_NETWORK = 'testnet';

// Get current network configuration
export const getCurrentNetworkConfig = (): NetworkConfig => {
  return NETWORK_CONFIG[DEFAULT_NETWORK];
};

// Helper function to get contract info
export const getContractInfo = (contractName: 'certchain' | 'certchainUtil' = 'certchain') => {
  const config = getCurrentNetworkConfig();
  return config.contracts[contractName];
};

/* 
  🔧 CONFIGURATION INSTRUCTIONS:
  
  1. After deploying your contracts, update the contract addresses in this file
  2. For testnet: Replace STWP05KMRQCK2S63Q78BA8HDZ84KYGGGXGYNME2A with your actual testnet contract address
  3. For devnet: Update the devnet addresses for local development
  4. For mainnet: Add your mainnet contract addresses when ready for production
  
  📍 HOW TO GET YOUR CONTRACT ADDRESS:
  - After running `clarinet deploy`, check the output for the deployed contract addresses
  - Or check the Stacks Explorer using the transaction ID from deployment
  - Or use `clarinet console` to query deployed contracts
  
  🌐 NETWORK SWITCHING:
  - Change DEFAULT_NETWORK to switch between 'testnet', 'devnet', or 'mainnet'
  - Make sure your wallet is connected to the same network
*/
