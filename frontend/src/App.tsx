import React, { useState, useEffect, useCallback } from 'react';
import CertificateForm from './components/CertificateForm';
import CertificateGallery from './components/CertificateGallery';
import CertificateChecker from './components/CertificateChecker';
import WalletConnection from './components/WalletConnection';
import DarkModeToggle from './components/DarkModeToggle';
import { ThemeProvider } from './contexts/ThemeContext';
import { convertCertificateToNFT, getCertificateNFTs } from './utils/certificateUtils';
import { connectToStacks, getCertificateDetails, getCertificateOwner, getCertificateExtraData } from './utils/stacksUtils';
import type { StacksProvider } from './utils/stacksUtils';
import type { Certificate, CertificateFormData, RawCertificateData, CertificateExtraData } from './types/certificate';
import { clearWalletSession, setupSessionCleanup } from './utils/sessionUtils';
import './App.css';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<'create' | 'gallery' | 'checker'>('create');
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [stacksProvider, setStacksProvider] = useState<StacksProvider | null>(null);

  // Clear wallet session on app initialization to ensure fresh login
  useEffect(() => {
    // Clear any existing session on app start
    clearWalletSession();
    
    // Setup session cleanup event listeners
    const cleanup = setupSessionCleanup();

    // Cleanup on component unmount
    return () => {
      cleanup();
      clearWalletSession();
    };
  }, []);

  // Define initializeStacks with useCallback
  const initializeStacks = useCallback(async () => {
    try {
      console.log("Initializing Stacks connection with address:", walletAddress);
      const provider = await connectToStacks(walletAddress);
      console.log("Stacks provider initialized:", provider);
      setStacksProvider(provider);
    } catch (err) {
      console.error('Failed to initialize Stacks connection:', err);
      setError('Failed to connect to Stacks network');
    }
  }, [walletAddress, setError]);

  // Define loadCertificates with useCallback
  const loadCertificates = useCallback(async () => {
    if (!stacksProvider || !walletAddress) return;
    
    try {
      setIsLoading(true);
      const userCerts = await getCertificateNFTs(walletAddress);
      setCertificates(userCerts);
    } catch (err) {
      console.error('Failed to load certificates:', err);
      setError('Failed to load certificates');
    } finally {
      setIsLoading(false);
    }
  }, [stacksProvider, walletAddress, setIsLoading, setCertificates, setError]);

  // Initialize Stacks connection when wallet is connected
  useEffect(() => {
    if (isWalletConnected && walletAddress) {
      console.log("Wallet connected, initializing Stacks connection...", { walletAddress });
      initializeStacks();
    }
  }, [isWalletConnected, walletAddress, initializeStacks]);
  
  // Load certificates when stacksProvider is available
  useEffect(() => {
    if (stacksProvider && walletAddress) {
      console.log("Stacks provider ready, loading certificates...");
      loadCertificates();
    }
  }, [stacksProvider, walletAddress, loadCertificates]);

  const handleWalletConnection = (address: string, connected: boolean) => {
    setWalletAddress(address);
    setIsWalletConnected(connected);
    
    if (!connected) {
      setCertificates([]);
      setStacksProvider(null);
      // Ensure session is cleared on disconnect using utility function
      clearWalletSession();
    }
  };

  const handleCertificateSubmit = async (formData: CertificateFormData) => {
    if (!isWalletConnected || !stacksProvider) {
      setError('Please connect your wallet first');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      // Convert form data to certificate JSON
      const certificateJson = {
        ...formData,
        skills: formData.skills.filter(skill => skill.trim() !== ''),
        timestamp: new Date().toISOString(),
        version: '1.0'
      };

      console.log('Certificate JSON:', JSON.stringify(certificateJson, null, 2));

      // Convert to NFT and mint on Stacks
      const result = await convertCertificateToNFT(
        stacksProvider,
        walletAddress,
        certificateJson
      );

      if (result.success) {
        setSuccess(`🎉 Certificate NFT minted successfully! Token ID: ${result.tokenId}`);
        
        // Add new certificate to the list
        const newCertificate: Certificate = {
          tokenId: certificates.length + 1,
          name: formData.name,
          issuer: formData.issuer,
          recipient: formData.recipient,
          certificateId: formData.certificateId,
          courseName: formData.courseName,
          issueDate: formData.issueDate,
          expiryDate: formData.expiryDate || undefined,
          skills: formData.skills,
          grade: formData.grade || undefined,
          institution: formData.institution || undefined,
          instructor: formData.instructor || undefined,
          imageUri: formData.imageUri || undefined,
          description: formData.description || undefined,
          isVerified: false,
          metadataFrozen: false,
          createdAt: Date.now()
        };
        
        setCertificates(prev => [newCertificate, ...prev]);
        
        // Switch to gallery tab to show the new NFT
        setTimeout(() => {
          setCurrentTab('gallery');
        }, 2000);
      } else {
        throw new Error(result.error || 'Failed to mint certificate NFT');
      }
    } catch (err: unknown) {
      console.error('Error minting certificate NFT:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to mint certificate NFT';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCertificate = async (tokenId: number) => {
    if (!stacksProvider) {
      setError('Stacks connection not available');
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      
      // In a real implementation, this would call the verify function on the contract
      // For now, we'll simulate the verification
      setTimeout(() => {
        setCertificates(prev => 
          prev.map(cert => 
            cert.tokenId === tokenId 
              ? { ...cert, isVerified: true, metadataFrozen: true }
              : cert
          )
        );
        setSuccess(`Certificate #${tokenId} verified successfully!`);
        setIsLoading(false);
      }, 2000);
      
    } catch (err: unknown) {
      console.error('Error verifying certificate:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify certificate';
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  // Handle certificate checking by token ID
  const handleCheckCertificate = async (tokenId: number): Promise<Certificate | null> => {
    if (!stacksProvider) {
      throw new Error('Stacks connection not available');
    }

    try {
      // Get basic certificate data
      const certResult = await getCertificateDetails(stacksProvider as StacksProvider, tokenId);
      
      if (!certResult.success || !certResult.result) {
        return null;
      }

      // Get extra certificate data
      const extraResult = await getCertificateExtraData(stacksProvider as StacksProvider, tokenId);
      
      // Parse the certificate data from the blockchain result
      const certData = certResult.result as RawCertificateData;
      const extraData = extraResult.success ? (extraResult.result as CertificateExtraData) : {};

      const certificate: Certificate = {
        tokenId,
        name: certData.name || 'Unknown Certificate',
        issuer: certData.issuer || 'Unknown Issuer',
        recipient: certData.recipient || 'Unknown Recipient',
        certificateId: certData['certificate-id'] || `cert-${tokenId}`,
        courseName: certData['course-name'] || 'Unknown Course',
        issueDate: certData['issue-date'] || new Date().toISOString(),
        expiryDate: certData['expiry-date'] || undefined,
        skills: certData.skills || [],
        grade: certData.grade || undefined,
        institution: extraData.institution || undefined,
        instructor: undefined, // Not stored in current contract
        imageUri: certData['image-uri'] || undefined,
        description: certData.description || undefined,
        isVerified: certData['metadata-frozen'] || false,
        metadataFrozen: certData['metadata-frozen'] || false,
        createdAt: Date.now()
      };

      return certificate;
    } catch (error) {
      console.error('Error checking certificate:', error);
      throw error;
    }
  };

  // Handle certificate ownership verification
  const handleVerifyOwnership = async (tokenId: number): Promise<string | null> => {
    if (!stacksProvider) {
      throw new Error('Stacks connection not available');
    }

    try {
      const ownerResult = await getCertificateOwner(stacksProvider as StacksProvider, tokenId);
      
      if (ownerResult.success && ownerResult.result) {
        return ownerResult.result;
      }
      
      return null;
    } catch (error) {
      console.error('Error verifying ownership:', error);
      throw error;
    }
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  return (
    <ThemeProvider>
      <div className="app">
        <header className="app-header">
          <div className="header-content">
            <div className="header-top">
              <DarkModeToggle />
            </div>
            <div className="header-main">
              <div className="logo-section">
                <h1>🏆 CertChain</h1>
                <p>Convert certificates to NFTs on Stacks blockchain</p>
              </div>
              
              <div className="header-actions">
                <div className="tab-navigation">
                  <button
                    className={`tab-btn ${currentTab === 'create' ? 'active' : ''}`}
                    onClick={() => setCurrentTab('create')}
                  >
                    📝 Create Certificate
                  </button>
                  <button
                    className={`tab-btn ${currentTab === 'gallery' ? 'active' : ''}`}
                    onClick={() => setCurrentTab('gallery')}
                  >
                    🎓 My Certificates ({certificates.length})
                  </button>
                  <button
                    className={`tab-btn ${currentTab === 'checker' ? 'active' : ''}`}
                    onClick={() => setCurrentTab('checker')}
                  >
                    🔍 Check Certificate
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

      <main className="app-main">
        {/* Status Messages */}
        {(error || success) && (
          <div className="status-messages">
            {error && (
              <div className="status-message error">
                <span className="status-icon">❌</span>
                <span>{error}</span>
                <button onClick={clearMessages} className="status-close">✕</button>
              </div>
            )}
            {success && (
              <div className="status-message success">
                <span className="status-icon">✅</span>
                <span>{success}</span>
                <button onClick={clearMessages} className="status-close">✕</button>
              </div>
            )}
          </div>
        )}

        {/* Wallet Connection */}
        {!isWalletConnected && (
          <section className="wallet-section">
            <WalletConnection
              onConnected={handleWalletConnection}
              isConnected={isWalletConnected}
              walletAddress={walletAddress}
            />
          </section>
        )}

        {/* Main Content */}
        {isWalletConnected && (
          <>
            {/* Connected Wallet Info */}
            <section className="connected-wallet-info">
              <WalletConnection
                onConnected={handleWalletConnection}
                isConnected={isWalletConnected}
                walletAddress={walletAddress}
              />
            </section>

            {/* Tab Content */}
            <section className="tab-content">
              {currentTab === 'create' && (
                <div className="create-tab">
                  <CertificateForm
                    onSubmit={handleCertificateSubmit}
                    isLoading={isLoading}
                  />
                </div>
              )}

              {currentTab === 'gallery' && (
                <div className="gallery-tab">
                  <CertificateGallery
                    certificates={certificates}
                    onVerify={handleVerifyCertificate}
                    isLoading={isLoading}
                  />
                </div>
              )}

              {currentTab === 'checker' && (
                <div className="checker-tab">
                  <CertificateChecker
                    onCheckCertificate={handleCheckCertificate}
                    onVerifyOwnership={handleVerifyOwnership}
                    isWalletConnected={isWalletConnected}
                  />
                </div>
              )}
            </section>
          </>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="loading-overlay">
            <div className="loading-content">
              <div className="loading-spinner-large"></div>
              <h3>Processing...</h3>
              <p>
                {currentTab === 'create' 
                  ? 'Converting certificate to NFT and minting on Stacks blockchain...'
                  : 'Loading your certificates...'
                }
              </p>
            </div>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>🔗 About CertChain</h4>
            <p>
              CertChain converts traditional certificates into verifiable NFTs on the Stacks blockchain,
              ensuring authenticity and preventing fraud.
            </p>
          </div>
          
          <div className="footer-section">
            <h4>🛠️ Features</h4>
            <ul>
              <li>Convert certificates to JSON format</li>
              <li>Mint as NFTs on Stacks blockchain</li>
              <li>Verify certificate authenticity</li>
              <li>Secure wallet integration</li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>📚 Supported Wallets</h4>
            <ul>
              <li>🔥 Leather Wallet</li>
              <li>⚡ Xverse Wallet</li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 CertChain - Powered by Stacks Blockchain</p>
        </div>
      </footer>
    </div>
    </ThemeProvider>
  );
};

export default App;
