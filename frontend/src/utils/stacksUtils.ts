import type { CertificateData } from './certificateUtils';

// Stacks blockchain utility functions for wallet connection and contract interactions

export interface StacksProvider {
  address: string;
  network: 'mainnet' | 'testnet' | 'devnet';
  connected: boolean;
  contractAddress: string;
  contractName: string;
}

export interface ContractCallOptions {
  contractAddress: string;
  contractName: string;
  functionName: string;
  functionArgs: (string | number | boolean | null | (string | number)[])[];
  senderKey?: string;
}

export interface TransactionResult {
  success: boolean;
  txId?: string;
  error?: string;
}

// Connect to Stacks network and initialize provider
export const connectToStacks = async (walletAddress: string): Promise<StacksProvider> => {
  try {
    // Get network configuration from contracts config
    const networkConfig = await import('../config/contracts').then(m => m.getCurrentNetworkConfig());
    const contractInfo = await import('../config/contracts').then(m => m.getContractInfo('certchain'));
    
    const provider: StacksProvider = {
      address: walletAddress,
      network: networkConfig.network,
      connected: true,
      contractAddress: contractInfo.address,
      contractName: contractInfo.name
    };

    console.log('Connected to Stacks:', provider);
    console.log('🔗 Using contract:', `${contractInfo.address}.${contractInfo.name}`);
    return provider;
    
  } catch (error) {
    console.error('Failed to connect to Stacks:', error);
    throw new Error('Failed to connect to Stacks network');
  }
};

// Call a read-only function on a Stacks contract
export const callReadOnlyFunction = async (
  options: ContractCallOptions
): Promise<{ success: boolean; result: unknown }> => {
  try {
    // Mock implementation - in reality this would use @stacks/transactions
    console.log('Calling read-only function:', options);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock data based on function name
    switch (options.functionName) {
      case 'get-certificate':
        return {
          success: true,
          result: {
            name: 'Mock Certificate',
            issuer: 'Mock Issuer',
            recipient: 'Mock Recipient'
          }
        };
      case 'get-last-token-id':
        return {
          success: true,
          result: Math.floor(Math.random() * 1000)
        };
      default:
        return {
          success: true,
          result: null
        };
    }
  } catch (error) {
    console.error('Error calling read-only function:', error);
    throw error;
  }
};

// Call a public function on a Stacks contract (requires transaction)
export const callPublicFunction = async (
  options: ContractCallOptions
): Promise<TransactionResult> => {
  try {
    // Mock implementation - in reality this would use @stacks/transactions
    console.log('Calling public function:', options);
    
    // Simulate transaction processing delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock successful transaction
    const mockTxId = `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 8)}`;
    
    return {
      success: true,
      txId: mockTxId
    };
    
  } catch (error) {
    console.error('Error calling public function:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Transaction failed'
    };
  }
};

// Mint a certificate NFT on the Stacks blockchain
export const mintCertificateNFT = async (
  provider: StacksProvider,
  certificateData: CertificateData
): Promise<TransactionResult> => {
  try {
    const options: ContractCallOptions = {
      contractAddress: provider.contractAddress || '',
      contractName: provider.contractName || 'certchain',
      functionName: 'create-certificate',
      functionArgs: [
        certificateData.recipient,
        certificateData.name,
        certificateData.description || '',
        certificateData.imageUri || '',
        certificateData.issuer,
        certificateData.recipient,
        certificateData.issueDate,
        certificateData.expiryDate ? [certificateData.expiryDate] : null,
        certificateData.certificateId,
        certificateData.courseName,
        certificateData.grade ? [certificateData.grade] : null,
        certificateData.skills || []
      ]
    };

    return await callPublicFunction(options);
  } catch (error) {
    console.error('Error minting certificate NFT:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to mint NFT'
    };
  }
};

// Get details of a specific certificate
export const getCertificateDetails = async (
  provider: StacksProvider,
  tokenId: number
): Promise<{ success: boolean; result: unknown }> => {
  try {
    const options: ContractCallOptions = {
      contractAddress: provider.contractAddress || '',
      contractName: provider.contractName || 'certchain',
      functionName: 'get-certificate',
      functionArgs: [tokenId]
    };

    return await callReadOnlyFunction(options);
  } catch (error) {
    console.error('Error getting certificate details:', error);
    return { success: false, result: null };
  }
};

// Get certificate owner
export const getCertificateOwner = async (
  provider: StacksProvider,
  tokenId: number
): Promise<{ success: boolean; result: string | null }> => {
  try {
    const options: ContractCallOptions = {
      contractAddress: provider.contractAddress || '',
      contractName: provider.contractName || 'certchain',
      functionName: 'get-owner',
      functionArgs: [tokenId]
    };

    const result = await callReadOnlyFunction(options);
    return {
      success: result.success,
      result: result.success && typeof result.result === 'string' ? result.result : null
    };
  } catch (error) {
    console.error('Error getting certificate owner:', error);
    return { success: false, result: null };
  }
};

// Get certificate extra data
export const getCertificateExtraData = async (
  provider: StacksProvider,
  tokenId: number
): Promise<{ success: boolean; result: unknown }> => {
  try {
    const options: ContractCallOptions = {
      contractAddress: provider.contractAddress || '',
      contractName: provider.contractName || 'certchain',
      functionName: 'get-certificate-extra-data',
      functionArgs: [tokenId]
    };

    return await callReadOnlyFunction(options);
  } catch (error) {
    console.error('Error getting certificate extra data:', error);
    return { success: false, result: null };
  }
};

// Get the last minted token ID
export const getLastTokenId = async (provider: StacksProvider): Promise<number> => {
  try {
    const options: ContractCallOptions = {
      contractAddress: provider.contractAddress || '',
      contractName: provider.contractName || 'certchain',
      functionName: 'get-last-token-id',
      functionArgs: []
    };

    const result = await callReadOnlyFunction(options);
    return result.success && typeof result.result === 'number' ? result.result : 0;
  } catch (error) {
    console.error('Error getting last token ID:', error);
    return 0;
  }
};

// Verify a certificate on the blockchain
export const verifyCertificate = async (
  provider: StacksProvider,
  tokenId: number
): Promise<TransactionResult> => {
  try {
    const options: ContractCallOptions = {
      contractAddress: provider.contractAddress || '',
      contractName: provider.contractName || 'certchain',
      functionName: 'freeze-certificate-metadata',
      functionArgs: [tokenId]
    };

    return await callPublicFunction(options);
  } catch (error) {
    console.error('Error verifying certificate:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to verify certificate'
    };
  }
};

// Get user's certificate balance
export const getCertificateBalance = async (
  provider: StacksProvider,
  userAddress: string
): Promise<number> => {
  try {
    const options: ContractCallOptions = {
      contractAddress: provider.contractAddress || '',
      contractName: provider.contractName || 'certchain',
      functionName: 'get-balance',
      functionArgs: [userAddress]
    };

    const result = await callReadOnlyFunction(options);
    return result.success && typeof result.result === 'number' ? result.result : 0;
  } catch (error) {
    console.error('Error getting certificate balance:', error);
    return 0;
  }
};

// Format Stacks address for display
export const formatStacksAddress = (address: string, length: number = 8): string => {
  if (!address) return '';
  if (address.length <= length * 2) return address;
  
  return `${address.slice(0, length)}...${address.slice(-length)}`;
};

// Validate Stacks address format
export const isValidStacksAddress = (address: string): boolean => {
  // Basic validation for Stacks addresses
  // Should start with 'SP' or 'ST' followed by alphanumeric characters
  const stacksAddressRegex = /^S[TP][0-9A-HJ-NP-Z]{38}$/;
  return stacksAddressRegex.test(address);
};

// Convert STX amount to microSTX
export const toMicroSTX = (stx: number): number => {
  return Math.floor(stx * 1_000_000);
};

// Convert microSTX to STX
export const fromMicroSTX = (microSTX: number): number => {
  return microSTX / 1_000_000;
};

// Get network configuration
export const getNetworkConfig = (network: 'mainnet' | 'testnet') => {
  return {
    mainnet: {
      coreApiUrl: 'https://api.mainnet.hiro.so',
      explorerUrl: 'https://explorer.stacks.co',
      networkId: 1
    },
    testnet: {
      coreApiUrl: 'https://api.testnet.hiro.so',
      explorerUrl: 'https://explorer.stacks.co/?chain=testnet',
      networkId: 2147483648
    }
  }[network];
};

// Get transaction details from the blockchain
export const getTransaction = async (txId: string, network: 'mainnet' | 'testnet' = 'testnet') => {
  try {
    const config = getNetworkConfig(network);
    const response = await fetch(`${config.coreApiUrl}/extended/v1/tx/${txId}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch transaction: ${response.statusText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching transaction:', error);
    throw error;
  }
};

// Build explorer URL for transaction
export const buildExplorerUrl = (txId: string, network: 'mainnet' | 'testnet' = 'testnet'): string => {
  const config = getNetworkConfig(network);
  return `${config.explorerUrl}/txid/${txId}`;
};
