export interface Certificate {
  id: string;
  developerProfileId: string;
  title: string;
  issuedBy: string;
  issuedAt: string;
  credentialUrl?: string;
  credentialId?: string;
  createdAt: string;
}

export interface CreateCertificateInput {
  title: string;
  issuedBy: string;
  issuedAt: string;
  credentialUrl?: string;
  credentialId?: string;
}

export interface UpdateCertificateInput {
  title: string;
  issuedBy: string;
  issuedAt: string;
  credentialUrl?: string;
  credentialId?: string;
}
