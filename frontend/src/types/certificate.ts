// Certificate type definitions

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

export interface CertificateFormData {
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

// Type for raw certificate data from blockchain
export interface RawCertificateData {
  name?: string;
  issuer?: string;
  recipient?: string;
  'certificate-id'?: string;
  'course-name'?: string;
  'issue-date'?: string;
  'expiry-date'?: string;
  skills?: string[];
  grade?: string;
  'image-uri'?: string;
  description?: string;
  'metadata-frozen'?: boolean;
}

export interface CertificateExtraData {
  institution?: string;
  [key: string]: unknown;
}