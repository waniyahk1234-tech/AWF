export type ProgramCategory = 'healthcare' | 'education' | 'essential_needs';
export type ProgramStatus = 'Planned' | 'Applications Open' | 'Temporarily Closed' | 'Closed';

export interface Program {
  id: string;
  slug: string;
  title: string;
  category: ProgramCategory;
  tagline: string;
  description: string;
  eligibilityCriteria: string[];
  geographicScope: string;
  applicationStatus: ProgramStatus;
  openingDate: string;
  closingDate: string;
  requiredDocumentsNote: string;
  reviewProcessSummary: string;
  contactEmail: string;
  updatedAt: string;
}

export type ApplicationStatus =
  | 'Received'
  | 'Under Review'
  | 'Additional Information Required'
  | 'Approved'
  | 'Declined'
  | 'Closed';

export interface ApplicationNote {
  id: string;
  authorEmail: string;
  authorRole: string;
  text: string;
  createdAt: string;
}

export interface EmailDispatchLog {
  id: string;
  recipientEmail: string;
  subject: string;
  preview: string;
  sentAt: string;
  status: 'sent' | 'queued';
}

export interface ApplicationRecord {
  id: string;
  referenceNumber: string;
  programId: string;
  programTitle: string;
  category: 'Education' | 'Healthcare' | 'Other Needs';
  fullName: string;
  preferredContact: 'phone' | 'email' | 'whatsapp';
  phone: string;
  email: string;
  cityArea: string;
  assistanceNeeded: string;
  wordCount: number;
  evidenceFileName?: string;
  evidenceFileData?: string; // base64 or storage path
  evidenceFileType?: string;
  privacyConsent: boolean;
  status: ApplicationStatus;
  statusReason?: string;
  internalNotes: ApplicationNote[];
  emailLogs?: EmailDispatchLog[];
  createdAt: string;
  updatedAt: string;
}

export type DonationStatus = 'pending_verification' | 'verified' | 'failed' | 'cancelled' | 'refunded';
export type DonationCategory = 'Education' | 'Healthcare' | 'Other Needs';

export interface DonationRecord {
  id: string;
  referenceNumber: string;
  amount: number;
  currency: 'PKR';
  category: DonationCategory;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  isAnonymous: boolean;
  screenshotFileName: string;
  screenshotFileData: string; // base64 representation
  screenshotFileType?: string;
  sadapayAccountTitle: string;
  sadapayIban: string;
  status: DonationStatus;
  verifiedAt?: string;
  reconciliationNotes?: string;
  emailLogs?: EmailDispatchLog[];
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  category: 'application' | 'program' | 'donation' | 'security' | 'gateway';
  details: string;
  actorEmail: string;
  actorRole: string;
  timestamp: string;
}

export interface AdminUserSession {
  userId: string;
  email: string;
  name: string;
  role: 'admin' | 'reviewer' | 'finance';
}

export interface SadaPaySettings {
  accountTitle: string;
  iban: string;
  accountNumber: string;
  bankName: string;
  instructions: string;
}
