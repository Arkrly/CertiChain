// Certificate utility functions for handling JSON conversion and NFT operations

import type { StacksProvider } from './stacksUtils';

export interface CertificateData {
  name: string;
  issuer: string;
  recipient: string;
  certificateId: string;
  courseName: string;
  issueDate: string;
  expiryDate?: string;
  skills: string[];
  grade?: string;
  institution?: string;
  instructor?: string;
  imageUri?: string;
  description?: string;
  timestamp?: string;
  version?: string;
}

export interface Certificate {
  tokenId: number;
  name: string;
  issuer: string;
  recipient: string;
  certificateId: string;
  courseName: string;
  issueDate: string;
  expiryDate?: string;
  skills: string[];
  grade?: string;
  institution?: string;
  instructor?: string;
  imageUri?: string;
  description?: string;
  isVerified: boolean;
  metadataFrozen: boolean;
  createdAt: number;
}

export interface MintResult {
  success: boolean;
  tokenId: number;
  transactionId?: string;
  error?: string;
}

// Convert certificate form data to JSON format
export const convertCertificateToJSON = (certificateData: CertificateData): string => {
  const certificateJson = {
    ...certificateData,
    skills: certificateData.skills.filter(skill => skill.trim() !== ''),
    timestamp: new Date().toISOString(),
    version: '1.0',
    metadata: {
      type: 'certificate',
      format: 'json',
      blockchain: 'stacks'
    }
  };

  return JSON.stringify(certificateJson, null, 2);
};

// Validate certificate data before minting
export const validateCertificateData = (data: CertificateData): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  // Required fields validation
  if (!data.name?.trim()) errors.push('Certificate name is required');
  if (!data.issuer?.trim()) errors.push('Issuer is required');
  if (!data.recipient?.trim()) errors.push('Recipient is required');
  if (!data.certificateId?.trim()) errors.push('Certificate ID is required');
  if (!data.courseName?.trim()) errors.push('Course name is required');
  if (!data.issueDate?.trim()) errors.push('Issue date is required');

  // Date validation
  if (data.issueDate && !isValidDate(data.issueDate)) {
    errors.push('Issue date must be in YYYY-MM-DD format');
  }

  if (data.expiryDate && !isValidDate(data.expiryDate)) {
    errors.push('Expiry date must be in YYYY-MM-DD format');
  }

  // Skills validation
  const validSkills = data.skills?.filter(skill => skill.trim() !== '') || [];
  if (validSkills.length === 0) {
    errors.push('At least one skill is required');
  }

  // Certificate ID validation (alphanumeric with hyphens)
  if (data.certificateId && !/^[a-zA-Z0-9-_]+$/.test(data.certificateId)) {
    errors.push('Certificate ID can only contain letters, numbers, hyphens, and underscores');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

// Helper function to validate date format
const isValidDate = (dateString: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) return false;
  
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date.getTime());
};

// Mock function to convert certificate to NFT (will be replaced with actual Stacks integration)
export const convertCertificateToNFT = async (
  _stacksProvider: StacksProvider,
  _walletAddress: string,
  certificateData: CertificateData
): Promise<MintResult> => {
  try {
    // Validate certificate data
    const validation = validateCertificateData(certificateData);
    if (!validation.isValid) {
      return {
        success: false,
        tokenId: 0,
        error: validation.errors.join(', ')
      };
    }

    // Convert to JSON
    const certificateJson = convertCertificateToJSON(certificateData);
    console.log('Converting certificate to NFT:', certificateJson);

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock successful response (in real implementation, this would call the Stacks contract)
    const mockTokenId = Math.floor(Math.random() * 10000) + 1;
    
    return {
      success: true,
      tokenId: mockTokenId,
      transactionId: `0x${Math.random().toString(16).substr(2, 8)}...${Math.random().toString(16).substr(2, 8)}`
    };
  } catch (error) {
    console.error('Error converting certificate to NFT:', error);
    return {
      success: false,
      tokenId: 0,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
};

// Mock function to get user's certificate NFTs
export const getCertificateNFTs = async (
  walletAddress: string
): Promise<Certificate[]> => {
  try {
    console.log(`Fetching certificates for wallet: ${walletAddress}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock certificates data (in real implementation, this would query the blockchain)
    const mockCertificates: Certificate[] = [
      {
        tokenId: 1,
        name: 'Blockchain Development Certificate',
        issuer: 'Stacks Academy',
        recipient: 'John Doe',
        certificateId: 'CERT-2025-001',
        courseName: 'Advanced Stacks Development',
        issueDate: '2025-01-15',
        expiryDate: '2026-01-15',
        skills: ['Clarity', 'Smart Contracts', 'Blockchain', 'Stacks'],
        grade: 'A+',
        institution: 'Blockchain University',
        instructor: 'Dr. Smith',
        imageUri: 'https://example.com/cert1.png',
        description: 'Advanced course in Stacks blockchain development and smart contract programming.',
        isVerified: true,
        metadataFrozen: true,
        createdAt: Date.now() - 86400000 // 1 day ago
      },
      {
        tokenId: 2,
        name: 'Web3 Fundamentals',
        issuer: 'Crypto Institute',
        recipient: 'John Doe',
        certificateId: 'CERT-2025-002',
        courseName: 'Introduction to Web3 Technologies',
        issueDate: '2025-01-10',
        skills: ['Web3', 'DeFi', 'NFTs', 'DAOs'],
        grade: 'A',
        institution: 'Crypto Institute',
        description: 'Comprehensive introduction to Web3 technologies and decentralized applications.',
        isVerified: false,
        metadataFrozen: false,
        createdAt: Date.now() - 172800000 // 2 days ago
      }
    ];

    // Filter certificates for the current wallet address (mock implementation)
    return mockCertificates;
  } catch (error) {
    console.error('Error fetching certificate NFTs:', error);
    return [];
  }
};

// Generate certificate hash for verification
export const generateCertificateHash = (certificateData: CertificateData): string => {
  const dataString = `${certificateData.name}${certificateData.issuer}${certificateData.recipient}${certificateData.certificateId}${certificateData.issueDate}`;
  
  // Simple hash function (in production, use a proper cryptographic hash)
  let hash = 0;
  for (let i = 0; i < dataString.length; i++) {
    const char = dataString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  
  return Math.abs(hash).toString(16);
};

// Format certificate for display
export const formatCertificateForDisplay = (certificate: Certificate) => {
  return {
    ...certificate,
    formattedIssueDate: new Date(certificate.issueDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }),
    formattedExpiryDate: certificate.expiryDate ? new Date(certificate.expiryDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : null,
    isExpired: certificate.expiryDate ? new Date(certificate.expiryDate) < new Date() : false,
    skillsCount: certificate.skills.length,
    displayText: `This certifies that ${certificate.recipient} has successfully completed ${certificate.courseName}`
  };
};

// Export certificate data as downloadable JSON file
export const exportCertificateAsJSON = (certificate: Certificate) => {
  const dataStr = JSON.stringify(certificate, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `certificate_${certificate.certificateId}_${certificate.tokenId}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

// Utility function to copy certificate data to clipboard
export const copyCertificateToClipboard = async (certificate: Certificate): Promise<boolean> => {
  try {
    const certificateText = JSON.stringify(certificate, null, 2);
    await navigator.clipboard.writeText(certificateText);
    return true;
  } catch (error) {
    console.error('Failed to copy certificate to clipboard:', error);
    return false;
  }
};
