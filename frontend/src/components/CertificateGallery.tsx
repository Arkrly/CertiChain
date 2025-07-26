import React, { useState } from 'react';
import './CertificateGallery.css';

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
  instructor?: string;
  imageUri?: string;
  description?: string;
  isVerified: boolean;
  createdAt: number;
}

interface CertificateGalleryProps {
  certificates: Certificate[];
  onVerify?: (tokenId: number) => void;
  isLoading?: boolean;
}

const CertificateGallery: React.FC<CertificateGalleryProps> = ({
  certificates,
  onVerify,
  isLoading = false
}) => {
  const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null);
  const [filterBy, setFilterBy] = useState<'all' | 'verified' | 'unverified'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'name'>('newest');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredAndSortedCertificates = certificates
    .filter(cert => {
      // Filter by verification status
      if (filterBy === 'verified' && !cert.isVerified) return false;
      if (filterBy === 'unverified' && cert.isVerified) return false;
      
      // Filter by search term
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        return (
          cert.name.toLowerCase().includes(term) ||
          cert.issuer.toLowerCase().includes(term) ||
          cert.recipient.toLowerCase().includes(term) ||
          cert.courseName.toLowerCase().includes(term) ||
          cert.certificateId.toLowerCase().includes(term)
        );
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'newest':
          return b.createdAt - a.createdAt;
        case 'oldest':
          return a.createdAt - b.createdAt;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

  const handleCertificateClick = (certificate: Certificate) => {
    setSelectedCertificate(certificate);
  };

  const handleCloseModal = () => {
    setSelectedCertificate(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  return (
    <div className="certificate-gallery">
      <div className="gallery-header">
        <h2>🎓 Certificate NFT Gallery</h2>
        <p>Your minted certificate NFTs on the Stacks blockchain</p>
      </div>

      {/* Controls */}
      <div className="gallery-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search certificates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>

        <div className="filter-controls">
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value as 'all' | 'verified' | 'unverified')}
            className="filter-select"
          >
            <option value="all">All Certificates</option>
            <option value="verified">Verified Only</option>
            <option value="unverified">Unverified Only</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest' | 'name')}
            className="sort-select"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name">Name A-Z</option>
          </select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading certificates...</p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && filteredAndSortedCertificates.length === 0 && (
        <div className="empty-state">
          <div className="empty-icon">🏆</div>
          <h3>No certificates found</h3>
          <p>
            {searchTerm || filterBy !== 'all'
              ? 'Try adjusting your search or filter criteria.'
              : 'Start by creating your first certificate NFT!'}
          </p>
        </div>
      )}

      {/* Certificate Grid */}
      <div className="certificate-grid">
        {filteredAndSortedCertificates.map((certificate) => (
          <div
            key={certificate.tokenId}
            className="certificate-card"
            onClick={() => handleCertificateClick(certificate)}
          >
            <div className="certificate-header">
              <div className="certificate-status">
                {certificate.isVerified ? (
                  <span className="verified-badge">✅ Verified</span>
                ) : (
                  <span className="unverified-badge">⏳ Pending</span>
                )}
                {isExpired(certificate.expiryDate) && (
                  <span className="expired-badge">⚠️ Expired</span>
                )}
              </div>
              <span className="token-id">#{certificate.tokenId}</span>
            </div>

            {certificate.imageUri && (
              <div className="certificate-image">
                <img src={certificate.imageUri} alt={certificate.name} />
              </div>
            )}

            <div className="certificate-content">
              <h3 className="certificate-name">{certificate.name}</h3>
              <p className="certificate-course">{certificate.courseName}</p>
              <div className="certificate-meta">
                <span className="issuer">📋 {certificate.issuer}</span>
                <span className="recipient">👤 {certificate.recipient}</span>
                <span className="date">📅 {formatDate(certificate.issueDate)}</span>
              </div>
              
              {certificate.skills && certificate.skills.length > 0 && (
                <div className="certificate-skills">
                  {certificate.skills.slice(0, 3).map((skill, index) => (
                    <span key={index} className="skill-tag">{skill}</span>
                  ))}
                  {certificate.skills.length > 3 && (
                    <span className="skill-tag more">+{certificate.skills.length - 3} more</span>
                  )}
                </div>
              )}
            </div>

            <div className="certificate-actions">
              <button
                className="view-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCertificateClick(certificate);
                }}
              >
                👁️ View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Certificate Details Modal */}
      {selectedCertificate && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content certificate-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <h3>🏆 Certificate Details</h3>
                <span className="token-id-large">Token #{selectedCertificate.tokenId}</span>
              </div>
              <button onClick={handleCloseModal} className="close-btn">✕</button>
            </div>

            <div className="modal-body">
              <div className="certificate-detail-section">
                <div className="detail-header">
                  {selectedCertificate.imageUri && (
                    <img
                      src={selectedCertificate.imageUri}
                      alt={selectedCertificate.name}
                      className="detail-image"
                    />
                  )}
                  <div className="detail-info">
                    <h4>{selectedCertificate.name}</h4>
                    <p className="course-name">{selectedCertificate.courseName}</p>
                    <div className="status-badges">
                      {selectedCertificate.isVerified ? (
                        <span className="verified-badge">✅ Verified</span>
                      ) : (
                        <span className="unverified-badge">⏳ Pending Verification</span>
                      )}
                      {selectedCertificate.grade && (
                        <span className="grade-badge">Grade: {selectedCertificate.grade}</span>
                      )}
                    </div>
                  </div>
                </div>

                {selectedCertificate.description && (
                  <div className="description-section">
                    <h5>📝 Description</h5>
                    <p>{selectedCertificate.description}</p>
                  </div>
                )}

                <div className="details-grid">
                  <div className="detail-item">
                    <strong>📋 Issuer:</strong>
                    <span>{selectedCertificate.issuer}</span>
                  </div>
                  <div className="detail-item">
                    <strong>👤 Recipient:</strong>
                    <span>{selectedCertificate.recipient}</span>
                  </div>
                  <div className="detail-item">
                    <strong>🆔 Certificate ID:</strong>
                    <span>{selectedCertificate.certificateId}</span>
                  </div>
                  <div className="detail-item">
                    <strong>📅 Issue Date:</strong>
                    <span>{formatDate(selectedCertificate.issueDate)}</span>
                  </div>
                  {selectedCertificate.expiryDate && (
                    <div className="detail-item">
                      <strong>⏰ Expiry Date:</strong>
                      <span className={isExpired(selectedCertificate.expiryDate) ? 'expired-text' : ''}>
                        {formatDate(selectedCertificate.expiryDate)}
                      </span>
                    </div>
                  )}
                  {selectedCertificate.institution && (
                    <div className="detail-item">
                      <strong>🏛️ Institution:</strong>
                      <span>{selectedCertificate.institution}</span>
                    </div>
                  )}
                  {selectedCertificate.instructor && (
                    <div className="detail-item">
                      <strong>👨‍🏫 Instructor:</strong>
                      <span>{selectedCertificate.instructor}</span>
                    </div>
                  )}
                </div>

                {selectedCertificate.skills && selectedCertificate.skills.length > 0 && (
                  <div className="skills-section">
                    <h5>🎯 Skills & Competencies</h5>
                    <div className="skills-list">
                      {selectedCertificate.skills.map((skill, index) => (
                        <span key={index} className="skill-tag-large">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              {onVerify && !selectedCertificate.isVerified && (
                <button
                  onClick={() => onVerify(selectedCertificate.tokenId)}
                  className="verify-btn"
                >
                  ✅ Verify Certificate
                </button>
              )}
              <button
                onClick={() => navigator.clipboard.writeText(JSON.stringify(selectedCertificate, null, 2))}
                className="copy-btn"
              >
                📋 Copy JSON
              </button>
              <button onClick={handleCloseModal} className="close-modal-btn">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateGallery;