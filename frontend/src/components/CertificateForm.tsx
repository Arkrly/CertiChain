import React, { useState } from 'react';
import './CertificateForm.css';

interface CertificateFormData {
  name: string;
  issuer: string;
  recipient: string;
  certificateId: string;
  courseName: string;
  issueDate: string;
  expiryDate: string;
  skills: string[];
  grade: string;
  institution: string;
  instructor: string;
  imageUri: string;
  description: string;
}

interface CertificateFormProps {
  onSubmit: (data: CertificateFormData) => void;
  isLoading?: boolean;
}

const CertificateForm: React.FC<CertificateFormProps> = ({ onSubmit, isLoading = false }) => {
  const [formData, setFormData] = useState<CertificateFormData>({
    name: '',
    issuer: '',
    recipient: '',
    certificateId: '',
    courseName: '',
    issueDate: '',
    expiryDate: '',
    skills: [''],
    grade: '',
    institution: '',
    instructor: '',
    imageUri: '',
    description: ''
  });

  const [jsonPreview, setJsonPreview] = useState<string>('');
  const [showPreview, setShowPreview] = useState<boolean>(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSkillChange = (index: number, value: string) => {
    const newSkills = [...formData.skills];
    newSkills[index] = value;
    setFormData(prev => ({
      ...prev,
      skills: newSkills
    }));
  };

  const addSkill = () => {
    if (formData.skills.length < 10) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, '']
      }));
    }
  };

  const removeSkill = (index: number) => {
    if (formData.skills.length > 1) {
      const newSkills = formData.skills.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        skills: newSkills
      }));
    }
  };

  const generatePreview = () => {
    const certificateJson = {
      ...formData,
      skills: formData.skills.filter(skill => skill.trim() !== ''),
      timestamp: new Date().toISOString(),
      version: '1.0'
    };
    setJsonPreview(JSON.stringify(certificateJson, null, 2));
    setShowPreview(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    const requiredFields = ['name', 'issuer', 'recipient', 'certificateId', 'courseName', 'issueDate'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof CertificateFormData]);
    
    if (missingFields.length > 0) {
      alert(`Please fill in the following required fields: ${missingFields.join(', ')}`);
      return;
    }

    // Filter out empty skills
    const cleanedData = {
      ...formData,
      skills: formData.skills.filter(skill => skill.trim() !== '')
    };

    onSubmit(cleanedData);
  };

  const clearForm = () => {
    setFormData({
      name: '',
      issuer: '',
      recipient: '',
      certificateId: '',
      courseName: '',
      issueDate: '',
      expiryDate: '',
      skills: [''],
      grade: '',
      institution: '',
      instructor: '',
      imageUri: '',
      description: ''
    });
    setJsonPreview('');
    setShowPreview(false);
  };

  return (
    <div className="certificate-form-container">
      <div className="form-header">
        <h2>🏆 Certificate NFT Converter</h2>
        <p>Convert your certificate data to JSON format and mint as NFT on Stacks blockchain</p>
      </div>

      <form onSubmit={handleSubmit} className="certificate-form">
        {/* Basic Information */}
        <div className="form-section">
          <h3>📋 Basic Information</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Certificate Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g., Blockchain Development Certificate"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="certificateId">Certificate ID *</label>
              <input
                type="text"
                id="certificateId"
                name="certificateId"
                value={formData.certificateId}
                onChange={handleInputChange}
                placeholder="e.g., CERT-2025-001"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="courseName">Course Name *</label>
              <input
                type="text"
                id="courseName"
                name="courseName"
                value={formData.courseName}
                onChange={handleInputChange}
                placeholder="e.g., Advanced Stacks Development"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="grade">Grade</label>
              <select
                id="grade"
                name="grade"
                value={formData.grade}
                onChange={handleInputChange}
              >
                <option value="">Select Grade</option>
                <option value="A+">A+</option>
                <option value="A">A</option>
                <option value="B+">B+</option>
                <option value="B">B</option>
                <option value="C+">C+</option>
                <option value="C">C</option>
                <option value="Pass">Pass</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Brief description of the certificate and achievements"
              rows={3}
            />
          </div>
        </div>

        {/* Issuer & Recipient */}
        <div className="form-section">
          <h3>👤 Issuer & Recipient</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="issuer">Issuer *</label>
              <input
                type="text"
                id="issuer"
                name="issuer"
                value={formData.issuer}
                onChange={handleInputChange}
                placeholder="e.g., Stacks Academy"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="recipient">Recipient *</label>
              <input
                type="text"
                id="recipient"
                name="recipient"
                value={formData.recipient}
                onChange={handleInputChange}
                placeholder="e.g., John Doe"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="institution">Institution</label>
              <input
                type="text"
                id="institution"
                name="institution"
                value={formData.institution}
                onChange={handleInputChange}
                placeholder="e.g., Blockchain University"
              />
            </div>
            <div className="form-group">
              <label htmlFor="instructor">Instructor</label>
              <input
                type="text"
                id="instructor"
                name="instructor"
                value={formData.instructor}
                onChange={handleInputChange}
                placeholder="e.g., Dr. Smith"
              />
            </div>
          </div>
        </div>

        {/* Dates */}
        <div className="form-section">
          <h3>📅 Dates</h3>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="issueDate">Issue Date *</label>
              <input
                type="date"
                id="issueDate"
                name="issueDate"
                value={formData.issueDate}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="expiryDate">Expiry Date</label>
              <input
                type="date"
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="form-section">
          <h3>🎯 Skills & Competencies</h3>
          <div className="skills-container">
            {formData.skills.map((skill, index) => (
              <div key={index} className="skill-input-group">
                <input
                  type="text"
                  value={skill}
                  onChange={(e) => handleSkillChange(index, e.target.value)}
                  placeholder={`Skill ${index + 1}`}
                  className="skill-input"
                />
                {formData.skills.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSkill(index)}
                    className="remove-skill-btn"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            {formData.skills.length < 10 && (
              <button
                type="button"
                onClick={addSkill}
                className="add-skill-btn"
              >
                + Add Skill
              </button>
            )}
          </div>
        </div>

        {/* Media */}
        <div className="form-section">
          <h3>🖼️ Media</h3>
          <div className="form-group">
            <label htmlFor="imageUri">Certificate Image URL</label>
            <input
              type="url"
              id="imageUri"
              name="imageUri"
              value={formData.imageUri}
              onChange={handleInputChange}
              placeholder="https://example.com/certificate-image.png"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="form-actions">
          <button
            type="button"
            onClick={generatePreview}
            className="preview-btn"
            disabled={isLoading}
          >
            📄 Preview JSON
          </button>
          <button
            type="button"
            onClick={clearForm}
            className="clear-btn"
            disabled={isLoading}
          >
            🗑️ Clear Form
          </button>
          <button
            type="submit"
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? '⏳ Minting...' : '🚀 Convert to NFT'}
          </button>
        </div>
      </form>

      {/* JSON Preview Modal */}
      {showPreview && (
        <div className="modal-overlay" onClick={() => setShowPreview(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>📄 Certificate JSON Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="close-btn"
              >
                ✕
              </button>
            </div>
            <div className="modal-body">
              <pre className="json-preview">{jsonPreview}</pre>
            </div>
            <div className="modal-footer">
              <button
                onClick={() => navigator.clipboard.writeText(jsonPreview)}
                className="copy-btn"
              >
                📋 Copy JSON
              </button>
              <button
                onClick={() => setShowPreview(false)}
                className="close-modal-btn"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CertificateForm;
