import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

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
  evidenceFileData?: string;
  evidenceFileType?: string;
  privacyConsent: boolean;
  status: ApplicationStatus;
  statusReason?: string;
  internalNotes: ApplicationNote[];
  emailLogs: EmailDispatchLog[];
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
  screenshotFileData: string;
  screenshotFileType?: string;
  sadapayAccountTitle: string;
  sadapayIban: string;
  status: DonationStatus;
  verifiedAt?: string;
  reconciliationNotes?: string;
  emailLogs: EmailDispatchLog[];
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

export interface ContactInquiry {
  id: string;
  category: 'general' | 'donation' | 'healthcare' | 'education' | 'essential_needs' | 'volunteering' | 'partnership' | 'other';
  fullName: string;
  email: string;
  phone?: string;
  message: string;
  status: 'new' | 'reviewed';
  createdAt: string;
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'reviewer' | 'finance';
  passwordHash: string;
  salt: string;
}

export interface SadaPaySettings {
  accountTitle: string;
  iban: string;
  accountNumber: string;
  bankName: string;
  instructions: string;
}

interface DatabaseSchema {
  programs: Program[];
  applications: ApplicationRecord[];
  donations: DonationRecord[];
  auditLogs: AuditLogEntry[];
  contactInquiries: ContactInquiry[];
  adminUsers: AdminUser[];
  sadaPaySettings: SadaPaySettings;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'awf_database.json');

function hashPassword(password: string, salt: string): string {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

const INITIAL_SADAPAY_SETTINGS: SadaPaySettings = {
  accountTitle: '',
  iban: '',
  accountNumber: '',
  bankName: 'SadaPay',
  instructions: 'Please transfer your donation to the official SadaPay receiving account, capture a screenshot of your transfer receipt, and upload it below before pressing Submit.'
};

const INITIAL_PROGRAMS: Program[] = [
  {
    id: 'prog-healthcare-01',
    slug: 'healthcare',
    title: 'Healthcare Assistance',
    category: 'healthcare',
    tagline: 'Emergency medical aid, life-saving medicines, and critical patient support.',
    description:
      'The Healthcare Assistance program provides medical funding for patients facing acute illnesses, emergency treatments, diagnostic expenses, or life-saving medication costs.',
    eligibilityCriteria: [
      'Patients facing acute or chronic health conditions unable to bear hospitalization or medicine costs.',
      'Medical prescription, diagnostic report, or hospital estimate.',
      'Priority consideration for emergency surgeries and critical care.'
    ],
    geographicScope: 'Karachi & Regional Pakistan',
    applicationStatus: 'Applications Open',
    openingDate: '2026-10-01',
    closingDate: '2027-12-31',
    requiredDocumentsNote:
      'Upload any medical evidence: prescription slips, hospital admission estimate, or diagnostic test reports.',
    reviewProcessSummary:
      'Reviewed confidentially by our medical welfare panel, with direct hospital/pharmacy settlements wherever possible.',
    contactEmail: '',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prog-education-02',
    slug: 'education',
    title: 'Educational Support',
    category: 'education',
    tagline: 'Opening doors of learning and academic training in memory of Aban Khan.',
    description:
      'In memory of Aban Khan—an Electrical Engineering graduate of NED University—AWF sponsors striving students facing fee crises.',
    eligibilityCriteria: [
      'Students enrolled or admitted in recognized secondary schools, colleges, or accredited universities.',
      'Demonstrated academic sincerity and financial difficulty.',
      'Coverage includes university/school tuition fees, examination dues, or required textbooks.'
    ],
    geographicScope: 'Pakistan (Institutions nationwide)',
    applicationStatus: 'Applications Open',
    openingDate: '2026-10-01',
    closingDate: '2027-12-31',
    requiredDocumentsNote:
      'Upload student ID, current institution fee voucher, admission letter, or marksheet.',
    reviewProcessSummary:
      'Direct institutional fee transfer to university or school accounts upon review and validation.',
    contactEmail: '',
    updatedAt: new Date().toISOString()
  },
  {
    id: 'prog-essential-03',
    slug: 'essential-needs',
    title: 'Essential Needs (Other Needs)',
    category: 'essential_needs',
    tagline: 'Crucial household sustenance, nutritional rations, and urgent emergency relief.',
    description:
      'Supports families facing severe poverty, catastrophic income loss, or sudden emergency crises.',
    eligibilityCriteria: [
      'Families facing genuine economic distress or loss of household breadwinner.',
      'Priority for widows, orphans, disabled individuals, or families in urgent crises.'
    ],
    geographicScope: 'Karachi & Surrounding Regions',
    applicationStatus: 'Applications Open',
    openingDate: '2026-10-01',
    closingDate: '2027-12-31',
    requiredDocumentsNote:
      'Upload utility bills, proof of address, or statement of family need.',
    reviewProcessSummary:
      'Evaluated confidentially by the AWF welfare review panel.',
    contactEmail: '',
    updatedAt: new Date().toISOString()
  }
];

function seedInitialAdminUsers(): AdminUser[] {
  // Primary authorized admin connected with the user's Gmail: rubyosamu67@gmail.com
  const salt = crypto.randomBytes(16).toString('hex');
  const initialPassword = process.env.ADMIN_INITIAL_PASSWORD || 'AbanWF@2026!#';

  return [
    {
      id: 'usr-admin-primary',
      email: 'rubyosamu67@gmail.com',
      name: 'Primary AWF Administrator',
      role: 'admin',
      salt,
      passwordHash: hashPassword(initialPassword, salt)
    }
  ];
}

class Database {
  private data: DatabaseSchema;

  constructor() {
    this.data = this.load();
  }

  private load(): DatabaseSchema {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed.programs && parsed.adminUsers && parsed.sadaPaySettings) {
          // Ensure primary admin email rubyosamu67@gmail.com exists
          const hasUser = parsed.adminUsers.some(
            (u: AdminUser) => u.email.toLowerCase() === 'rubyosamu67@gmail.com'
          );
          if (!hasUser) {
            const salt = crypto.randomBytes(16).toString('hex');
            parsed.adminUsers.unshift({
              id: 'usr-admin-primary',
              email: 'rubyosamu67@gmail.com',
              name: 'Primary AWF Administrator',
              role: 'admin',
              salt,
              passwordHash: hashPassword('AbanWF@2026!#', salt)
            });
            this.saveData(parsed);
          }
          return parsed;
        }
      }
    } catch (err) {
      console.warn('Could not read existing database, initializing fresh state:', err);
    }

    const initial: DatabaseSchema = {
      programs: INITIAL_PROGRAMS,
      applications: [],
      donations: [],
      auditLogs: [
        {
          id: 'audit-001',
          action: 'SYSTEM_INITIALIZATION',
          category: 'security',
          details: 'AWF system initialized with Healthcare, Education, and Essential Needs programs and SadaPay account integration.',
          actorEmail: 'rubyosamu67@gmail.com',
          actorRole: 'admin',
          timestamp: new Date().toISOString()
        }
      ],
      contactInquiries: [],
      adminUsers: seedInitialAdminUsers(),
      sadaPaySettings: INITIAL_SADAPAY_SETTINGS
    };
    this.saveData(initial);
    return initial;
  }

  private saveData(data: DatabaseSchema): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error saving database to file:', err);
    }
  }

  private save(): void {
    this.saveData(this.data);
  }

  // SadaPay Settings
  getSadaPaySettings(): SadaPaySettings {
    return this.data.sadaPaySettings || INITIAL_SADAPAY_SETTINGS;
  }

  updateSadaPaySettings(settings: Partial<SadaPaySettings>, actorEmail: string): SadaPaySettings {
    this.data.sadaPaySettings = {
      ...this.getSadaPaySettings(),
      ...settings
    };
    this.addAuditLog({
      action: 'SADAPAY_SETTINGS_UPDATED',
      category: 'gateway',
      details: `SadaPay receiving account updated (Title: ${this.data.sadaPaySettings.accountTitle}, IBAN: ${this.data.sadaPaySettings.iban}).`,
      actorEmail,
      actorRole: 'admin'
    });
    this.save();
    return this.data.sadaPaySettings;
  }

  // Program Methods
  getPrograms(): Program[] {
    return this.data.programs;
  }

  getProgramBySlug(slug: string): Program | undefined {
    return this.data.programs.find((p) => p.slug === slug);
  }

  getProgramById(id: string): Program | undefined {
    return this.data.programs.find((p) => p.id === id);
  }

  updateProgram(
    id: string,
    updates: Partial<Omit<Program, 'id' | 'slug' | 'category'>>,
    actorEmail: string,
    actorRole: string
  ): Program | null {
    const idx = this.data.programs.findIndex((p) => p.id === id);
    if (idx === -1) return null;

    const current = this.data.programs[idx];
    const updated: Program = {
      ...current,
      ...updates,
      updatedAt: new Date().toISOString()
    };

    this.data.programs[idx] = updated;

    this.addAuditLog({
      action: 'PROGRAM_UPDATED',
      category: 'program',
      details: `Program "${updated.title}" status set to "${updated.applicationStatus}".`,
      actorEmail,
      actorRole
    });

    this.save();
    return updated;
  }

  // Application Methods
  getApplications(): ApplicationRecord[] {
    return this.data.applications;
  }

  getApplicationById(id: string): ApplicationRecord | undefined {
    return this.data.applications.find((a) => a.id === id);
  }

  getApplicationByReference(ref: string): ApplicationRecord | undefined {
    return this.data.applications.find(
      (a) => a.referenceNumber.trim().toUpperCase() === ref.trim().toUpperCase()
    );
  }

  createApplication(
    input: Omit<ApplicationRecord, 'id' | 'referenceNumber' | 'status' | 'internalNotes' | 'emailLogs' | 'createdAt' | 'updatedAt'>
  ): ApplicationRecord {
    const year = new Date().getFullYear();
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    const referenceNumber = `AWF-HELP-${year}-${randomHex}`;

    // Automatic confirmation email log dispatched to user's Gmail
    const initialEmailLog: EmailDispatchLog = {
      id: `mail-${crypto.randomUUID()}`,
      recipientEmail: input.email,
      subject: `Application Received: ${referenceNumber} — Aban Welfare Foundation`,
      preview: `Dear ${input.fullName}, your assistance request for ${input.category} has been received safely. Tracking Code: ${referenceNumber}. Our team will review your evidence and contact you.`,
      sentAt: new Date().toISOString(),
      status: 'sent'
    };

    const newApp: ApplicationRecord = {
      id: `app-${crypto.randomUUID()}`,
      referenceNumber,
      status: 'Received',
      internalNotes: [],
      emailLogs: [initialEmailLog],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...input
    };

    this.data.applications.unshift(newApp);

    this.addAuditLog({
      action: 'APPLICATION_SUBMITTED',
      category: 'application',
      details: `New confidential application ${referenceNumber} (${input.category}) received from ${input.email}. Confirmation email dispatched.`,
      actorEmail: input.email,
      actorRole: 'public'
    });

    this.save();
    return newApp;
  }

  updateApplicationStatus(
    id: string,
    status: ApplicationStatus,
    statusReason: string | undefined,
    internalNote: string | undefined,
    sendEmailNotice: boolean,
    actorEmail: string,
    actorRole: string
  ): ApplicationRecord | null {
    const app = this.data.applications.find((a) => a.id === id);
    if (!app) return null;

    const oldStatus = app.status;
    app.status = status;
    if (statusReason !== undefined) {
      app.statusReason = statusReason;
    }
    app.updatedAt = new Date().toISOString();

    if (internalNote && internalNote.trim()) {
      app.internalNotes.push({
        id: `note-${crypto.randomUUID()}`,
        authorEmail: actorEmail,
        authorRole: actorRole,
        text: internalNote.trim(),
        createdAt: new Date().toISOString()
      });
    }

    if (sendEmailNotice && app.email) {
      const emailLog: EmailDispatchLog = {
        id: `mail-${crypto.randomUUID()}`,
        recipientEmail: app.email,
        subject: `Application Status Update: ${app.referenceNumber} (${status})`,
        preview: `Dear ${app.fullName}, your assistance request for ${app.category} has been updated to "${status}". ${statusReason ? `Note: ${statusReason}` : ''} Thank you for your patience with Aban Welfare Foundation.`,
        sentAt: new Date().toISOString(),
        status: 'sent'
      };
      app.emailLogs.unshift(emailLog);
    }

    this.addAuditLog({
      action: 'APPLICATION_STATUS_UPDATED',
      category: 'application',
      details: `Application ${app.referenceNumber} status changed from "${oldStatus}" to "${status}". Email notice sent: ${sendEmailNotice}.`,
      actorEmail,
      actorRole
    });

    this.save();
    return app;
  }

  // Donation Methods (SadaPay screenshot verification flow)
  getDonations(): DonationRecord[] {
    return this.data.donations;
  }

  getDonationById(id: string): DonationRecord | undefined {
    return this.data.donations.find((d) => d.id === id);
  }

  createDonationSubmission(input: {
    amount: number;
    category: DonationCategory;
    donorName: string;
    donorEmail: string;
    donorPhone?: string;
    isAnonymous: boolean;
    screenshotFileName: string;
    screenshotFileData: string;
    screenshotFileType?: string;
  }): DonationRecord {
    const year = new Date().getFullYear();
    const randomHex = crypto.randomBytes(3).toString('hex').toUpperCase();
    const referenceNumber = `AWF-DON-${year}-${randomHex}`;
    const sadaPay = this.getSadaPaySettings();

    // Initial acknowledgment email log
    const receiptEmailLog: EmailDispatchLog = {
      id: `mail-${crypto.randomUUID()}`,
      recipientEmail: input.donorEmail,
      subject: `Donation Transfer Receipt Received: ${referenceNumber} (PKR ${input.amount.toLocaleString()})`,
      preview: `Dear ${input.isAnonymous ? 'Generous Donor' : input.donorName}, thank you for your transfer of PKR ${input.amount.toLocaleString()} to our SadaPay account for ${input.category}. Your payment screenshot is under manual verification.`,
      sentAt: new Date().toISOString(),
      status: 'sent'
    };

    const newDonation: DonationRecord = {
      id: `don-${crypto.randomUUID()}`,
      referenceNumber,
      amount: input.amount,
      currency: 'PKR',
      category: input.category,
      donorName: input.isAnonymous ? 'Anonymous Donor' : input.donorName,
      donorEmail: input.donorEmail,
      donorPhone: input.donorPhone,
      isAnonymous: input.isAnonymous,
      screenshotFileName: input.screenshotFileName,
      screenshotFileData: input.screenshotFileData,
      screenshotFileType: input.screenshotFileType,
      sadapayAccountTitle: sadaPay.accountTitle,
      sadapayIban: sadaPay.iban,
      status: 'pending_verification',
      emailLogs: [receiptEmailLog],
      createdAt: new Date().toISOString()
    };

    this.data.donations.unshift(newDonation);

    this.addAuditLog({
      action: 'DONATION_PROOF_SUBMITTED',
      category: 'donation',
      details: `Donation proof ${referenceNumber} submitted for PKR ${input.amount.toLocaleString()} (${input.category}). Awaiting admin manual verification.`,
      actorEmail: input.donorEmail,
      actorRole: 'public'
    });

    this.save();
    return newDonation;
  }

  verifyDonation(
    id: string,
    verifiedStatus: DonationStatus,
    notes: string,
    sendEmailNotice: boolean,
    actorEmail: string,
    actorRole: string
  ): DonationRecord | null {
    const donation = this.data.donations.find((d) => d.id === id);
    if (!donation) return null;

    donation.status = verifiedStatus;
    donation.reconciliationNotes = notes;
    if (verifiedStatus === 'verified') {
      donation.verifiedAt = new Date().toISOString();
    }

    if (sendEmailNotice && donation.donorEmail) {
      const emailLog: EmailDispatchLog = {
        id: `mail-${crypto.randomUUID()}`,
        recipientEmail: donation.donorEmail,
        subject: `Donation Verified & Approved: ${donation.referenceNumber} — JazakAllah Khair`,
        preview: `Dear ${donation.donorName}, your donation of PKR ${donation.amount.toLocaleString()} to Aban Welfare Foundation (${donation.category}) has been verified and cleared into our SadaPay account. JazakAllah Khair for supporting your akhirah.`,
        sentAt: new Date().toISOString(),
        status: 'sent'
      };
      donation.emailLogs.unshift(emailLog);
    }

    this.addAuditLog({
      action: 'DONATION_MANUALLY_VERIFIED',
      category: 'donation',
      details: `Donation ${donation.referenceNumber} (PKR ${donation.amount.toLocaleString()}) marked as "${verifiedStatus}" by ${actorEmail}. Confirmation email sent: ${sendEmailNotice}.`,
      actorEmail,
      actorRole
    });

    this.save();
    return donation;
  }

  // Contact inquiries
  createContactInquiry(input: Omit<ContactInquiry, 'id' | 'status' | 'createdAt'>): ContactInquiry {
    const entry: ContactInquiry = {
      id: `inq-${crypto.randomUUID()}`,
      status: 'new',
      createdAt: new Date().toISOString(),
      ...input
    };
    this.data.contactInquiries.unshift(entry);
    this.save();
    return entry;
  }

  getContactInquiries(): ContactInquiry[] {
    return this.data.contactInquiries;
  }

  // Audit Logs
  getAuditLogs(): AuditLogEntry[] {
    return this.data.auditLogs;
  }

  addAuditLog(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): void {
    const log: AuditLogEntry = {
      id: `audit-${crypto.randomUUID()}`,
      timestamp: new Date().toISOString(),
      ...entry
    };
    this.data.auditLogs.unshift(log);
    if (this.data.auditLogs.length > 500) {
      this.data.auditLogs.pop();
    }
    this.save();
  }

  // Auth & Admin Users
  validateAdminCredentials(email: string, pass: string): AdminUser | null {
    const user = this.data.adminUsers.find(
      (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim()
    );
    if (!user) return null;

    const testHash = hashPassword(pass, user.salt);
    const bufA = Buffer.from(testHash, 'hex');
    const bufB = Buffer.from(user.passwordHash, 'hex');
    if (bufA.length === bufB.length && crypto.timingSafeEqual(bufA, bufB)) {
      return user;
    }
    return null;
  }

  getAdminUserById(id: string): AdminUser | undefined {
    return this.data.adminUsers.find((u) => u.id === id);
  }

  getAdminUsers(): Array<Omit<AdminUser, 'passwordHash' | 'salt'>> {
    return this.data.adminUsers.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role
    }));
  }

  updateAdminPassword(userId: string, newPass: string, actorEmail: string): boolean {
    const user = this.data.adminUsers.find((u) => u.id === userId);
    if (!user) return false;

    const newSalt = crypto.randomBytes(16).toString('hex');
    user.salt = newSalt;
    user.passwordHash = hashPassword(newPass, newSalt);

    this.addAuditLog({
      action: 'ADMIN_PASSWORD_UPDATED',
      category: 'security',
      details: `Password updated for administrator ${user.email}.`,
      actorEmail,
      actorRole: user.role
    });

    this.save();
    return true;
  }

  updateAdminEmail(userId: string, newEmail: string, actorEmail: string): boolean {
    const user = this.data.adminUsers.find((u) => u.id === userId);
    if (!user) return false;

    const oldEmail = user.email;
    user.email = newEmail.toLowerCase().trim();

    this.addAuditLog({
      action: 'ADMIN_EMAIL_UPDATED',
      category: 'security',
      details: `Authorized admin email changed from ${oldEmail} to ${user.email}.`,
      actorEmail,
      actorRole: user.role
    });

    this.save();
    return true;
  }
}

export const db = new Database();
