import React, { useState } from 'react';
import './CertificateChecker.css';

interface Certificate {
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
  imageUri?: string;
  description?: string;
  isVerified: boolean;
  metadataFrozen: boolean;
  owner?: string;
}

interface CertificateCheckerProps {
  onCheckCertificate: (tokenId: number) => Promise<Certificate | null>;
  onVerifyOwnership: (tokenId: number) => Promise<string | null>;
  isWalletConnected: boolean;
}

const CertificateChecker: React.FC<CertificateCheckerProps> = ({
  onCheckCertificate,
  onVerifyOwnership,
  isWalletConnected
}) => {
  const [tokenId, setTokenId] = useState<string>('');
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showDetails, setShowDetails] = useState(false);

  const handleCheckCertificate = async () => {
    if (!tokenId.trim()) {
      setError('Please enter a valid token ID');
      return;
    }

    const tokenIdNum = parseInt(tokenId);
    if (isNaN(tokenIdNum) || tokenIdNum <= 0) {
      setError('Token ID must be a positive number');
      return;
    }

    setIsLoading(true);
    setError('');
    setCertificate(null);

    try {
      // Get certificate details
      const certData = await onCheckCertificate(tokenIdNum);
      
      if (certData) {
        // Get ownership information
        const owner = await onVerifyOwnership(tokenIdNum);
        setCertificate({
          ...certData,
          owner: owner || 'Unknown'
        });
        setShowDetails(true);
      } else {
        setError('Certificate not found or does not exist');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to check certificate');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (cert: Certificate) => {
    if (cert.metadataFrozen) {
      return <span className="status-badge verified">✅ Verified & Locked</span>;
    }
    return <span className="status-badge unverified">⚠️ Unverified</span>;
  };

  const getExpiryStatus = (expiryDate?: string) => {
    if (!expiryDate) return <span className="expiry-status no-expiry">No expiry</span>;
    
    const expiry = new Date(expiryDate);
    const now = new Date();
    
    if (expiry < now) {
      return <span className="expiry-status expired">❌ Expired</span>;
    }
    return <span className="expiry-status valid">✅ Valid</span>;
  };

  return (
    <div className="certificate-checker">
      <div className="checker-header">
        <h2>🔍 Certificate Checker</h2>
        <p>Verify certificate authenticity and view details stored on the blockchain</p>
      </div>

      <div className="checker-form">
        <div className="input-group">
          <label htmlFor="tokenId">Certificate Token ID:</label>
          <div className="input-with-button">
            <input
              id="tokenId"
              type="text"
              value={tokenId}
              onChange={(e) => setTokenId(e.target.value)}
              placeholder="Enter token ID (e.g., 1, 2, 3...)"
              disabled={isLoading}
              onKeyPress={(e) => e.key === 'Enter' && handleCheckCertificate()}
            />
            <button
              onClick={handleCheckCertificate}
              disabled={isLoading || !isWalletConnected}
              className="check-button"
            >
              {isLoading ? '🔄 Checking...' : '🔍 Check'}
            </button>
          </div>
        </div>

        {!isWalletConnected && (
          <div className="wallet-warning">
            ⚠️ Please connect your wallet to check certificates
          </div>
        )}

        {error && (
          <div className="error-message">
            ❌ {error}
          </div>
        )}
      </div>

      {certificate && showDetails && (
        <div className="certificate-details">
          <div className="details-header">
            <h3>📜 Certificate Details</h3>
            <div className="certificate-badges">
              {getStatusBadge(certificate)}
              {getExpiryStatus(certificate.expiryDate)}
            </div>
          </div>

          <div className="details-grid">
            <div className="detail-section">
              <h4>Basic Information</h4>
              <div className="detail-item">
                <span className="label">Token ID:</span>
                <span className="value">#{certificate.tokenId}</span>
              </div>
              <div className="detail-item">
                <span className="label">Certificate Name:</span>
                <span className="value">{certificate.name}</span>
              </div>
              <div className="detail-item">
                <span className="label">Certificate ID:</span>
                <span className="value">{certificate.certificateId}</span>
              </div>
              <div className="detail-item">
                <span className="label">Course Name:</span>
                <span className="value">{certificate.courseName}</span>
              </div>
              {certificate.description && (
                <div className="detail-item">
                  <span className="label">Description:</span>
                  <span className="value">{certificate.description}</span>
                </div>
              )}
            </div>

            <div className="detail-section">
              <h4>Participants</h4>
              <div className="detail-item">
                <span className="label">Issuer:</span>
                <span className="value">{certificate.issuer}</span>
              </div>
              <div className="detail-item">
                <span className="label">Recipient:</span>
                <span className="value">{certificate.recipient}</span>
              </div>
              <div className="detail-item">
                <span className="label">Owner Address:</span>
                <span className="value owner-address">{certificate.owner}</span>
              </div>
              {certificate.institution && (
                <div className="detail-item">
                  <span className="label">Institution:</span>
                  <span className="value">{certificate.institution}</span>
                </div>
              )}
            </div>

            <div className="detail-section">
              <h4>Dates & Validation</h4>
              <div className="detail-item">
                <span className="label">Issue Date:</span>
                <span className="value">{formatDate(certificate.issueDate)}</span>
              </div>
              {certificate.expiryDate && (
                <div className="detail-item">
                  <span className="label">Expiry Date:</span>
                  <span className="value">{formatDate(certificate.expiryDate)}</span>
                </div>
              )}
              {certificate.grade && (
                <div className="detail-item">
                  <span className="label">Grade:</span>
                  <span className="value grade">{certificate.grade}</span>
                </div>
              )}
            </div>

            {certificate.skills && certificate.skills.length > 0 && (
              <div className="detail-section skills-section">
                <h4>Skills & Competencies</h4>
                <div className="skills-list">
                  {certificate.skills.map((skill, index) => (
                    <span key={index} className="skill-badge">{skill}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {certificate.imageUri && (
            <div className="certificate-image">
              <h4>Certificate Image</h4>
              <img 
                src={certificate.imageUri} 
                alt={certificate.name}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="blockchain-info">
            <h4>🔗 Blockchain Information</h4>
            <div className="blockchain-details">
              <div className="detail-item">
                <span className="label">Storage Status:</span>
                <span className="value">
                  {certificate.metadataFrozen ? 
                    '🔒 Permanently stored and verified' : 
                    '📝 Stored but not yet verified'
                  }
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Verification:</span>
                <span className="value">
                  ✅ Data retrieved directly from Stacks blockchain
                </span>
              </div>
            </div>
          </div>

          <div className="actions">
            <button 
              onClick={() => setShowDetails(false)}
              className="close-button"
            >
              Close Details
            </button>
          </div>
        </div>
      )}

      <div className="how-to-use">
        <details>
          <summary>ℹ️ How to use Certificate Checker</summary>
          <div className="help-content">
            <h4>Finding Token IDs:</h4>
            <ul>
              <li>Token IDs start from 1 and increment for each new certificate</li>
              <li>Check the Certificate Gallery to see existing certificates</li>
              <li>Each certificate displays its token ID in the gallery</li>
            </ul>
            
            <h4>Verification Process:</h4>
            <ul>
              <li>Data is retrieved directly from the Stacks blockchain</li>
              <li>Verified certificates have locked metadata (cannot be changed)</li>
              <li>Owner address shows who currently holds the certificate NFT</li>
            </ul>
            
            <h4>What this verifies:</h4>
            <ul>
              <li>✅ Certificate exists on the blockchain</li>
              <li>✅ Certificate data is authentic and immutable</li>
              <li>✅ Current ownership information</li>
              <li>✅ Verification status of the certificate</li>
            </ul>
          </div>
        </details>
      </div>
    </div>
  );
};

export default CertificateChecker;
