import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { db, ProgramCategory, ProgramStatus, ApplicationStatus, DonationCategory } from './server/db.ts';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Increase payload limit to 20MB for uploaded evidence documents and payment screenshots
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));

interface SessionData {
  userId: string;
  email: string;
  name: string;
  role: 'admin' | 'reviewer' | 'finance';
  expiresAt: number;
}
const activeSessions = new Map<string, SessionData>();

function requireAuth(allowedRoles?: Array<'admin' | 'reviewer' | 'finance'>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: missing authentication token' });
    }

    const token = authHeader.substring(7).trim();
    const session = activeSessions.get(token);

    if (!session || session.expiresAt < Date.now()) {
      if (session) activeSessions.delete(token);
      return res.status(401).json({ error: 'Unauthorized: session expired or invalid' });
    }

    if (allowedRoles && !allowedRoles.includes(session.role)) {
      return res.status(403).json({
        error: `Forbidden: role "${session.role}" lacks permission for this administrative operation`
      });
    }

    (req as any).session = session;
    next();
  };
}

// ----------------------------------------------------
// PUBLIC API ROUTES
// ----------------------------------------------------

// Get all programs (Healthcare, Education, Essential Needs)
app.get('/api/programs', (_req: Request, res: Response) => {
  const programs = db.getPrograms();
  res.json({
    success: true,
    data: programs
  });
});

app.get('/api/programs/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  const program = db.getProgramBySlug(slug);
  if (!program) {
    return res.status(404).json({ error: 'Program not found' });
  }
  res.json({ success: true, data: program });
});

// SadaPay Account Info for donors
app.get('/api/sadapay-info', (_req: Request, res: Response) => {
  const settings = db.getSadaPaySettings();
  res.json({
    success: true,
    data: settings
  });
});

// Helper to count words
function countWords(str: string): number {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

// Submit a confidential help application
// Three categories: Healthcare, Education, Other Needs
// Min 30 words mandatory, max 1000 words
// Upload evidence button in any form
// Valid phone number and email required for confirmation email
app.post('/api/applications', (req: Request, res: Response) => {
  const {
    category,
    fullName,
    preferredContact,
    phone,
    email,
    cityArea,
    assistanceNeeded,
    evidenceFileName,
    evidenceFileData,
    evidenceFileType,
    privacyConsent
  } = req.body;

  if (!fullName || !phone || !email || !assistanceNeeded) {
    return res.status(400).json({ error: 'Please fill in your name, valid phone number, email, and description of need.' });
  }

  // Valid categories
  const validCategories: Array<'Education' | 'Healthcare' | 'Other Needs'> = ['Education', 'Healthcare', 'Other Needs'];
  const selectedCategory = validCategories.includes(category) ? category : 'Other Needs';

  // Word count validation: Min 30 words, Max 1000 words
  const words = countWords(String(assistanceNeeded));
  if (words < 30) {
    return res.status(400).json({
      error: `Your description must be at least 30 words so our review team can understand your situation (current count: ${words} words).`
    });
  }
  if (words > 1000) {
    return res.status(400).json({
      error: `Your description cannot exceed 1000 words (current count: ${words} words).`
    });
  }

  // Find linked program
  const programs = db.getPrograms();
  const linkedProg = programs.find((p) => {
    if (selectedCategory === 'Healthcare') return p.category === 'healthcare';
    if (selectedCategory === 'Education') return p.category === 'education';
    return p.category === 'essential_needs';
  }) || programs[0];

  const newApp = db.createApplication({
    programId: linkedProg.id,
    programTitle: linkedProg.title,
    category: selectedCategory,
    fullName: String(fullName).trim().slice(0, 150),
    preferredContact: preferredContact === 'whatsapp' || preferredContact === 'email' ? preferredContact : 'phone',
    phone: String(phone).trim().slice(0, 30),
    email: String(email).trim().slice(0, 120),
    cityArea: String(cityArea || 'Karachi').trim().slice(0, 100),
    assistanceNeeded: String(assistanceNeeded).trim(),
    wordCount: words,
    evidenceFileName: evidenceFileName ? String(evidenceFileName).slice(0, 200) : undefined,
    evidenceFileData: evidenceFileData || undefined,
    evidenceFileType: evidenceFileType || undefined,
    privacyConsent: Boolean(privacyConsent)
  });

  res.status(201).json({
    success: true,
    message: 'Application received. Confirmation email dispatched.',
    data: {
      referenceNumber: newApp.referenceNumber,
      category: newApp.category,
      status: newApp.status,
      email: newApp.email,
      createdAt: newApp.createdAt,
      instructions:
        'A confirmation email has been logged to your address. Our committee will review your evidence on the admin dashboard and notify you via email.'
    }
  });
});

// Secure status tracking for applicants
app.post('/api/applications/track', (req: Request, res: Response) => {
  const { referenceNumber, phoneLast4 } = req.body;
  if (!referenceNumber) {
    return res.status(400).json({ error: 'Please provide your application reference number.' });
  }

  const appRecord = db.getApplicationByReference(String(referenceNumber));
  if (!appRecord) {
    return res.status(404).json({
      error: 'No application found with this reference number. Please check the spelling.'
    });
  }

  if (phoneLast4) {
    const cleanLast4 = String(phoneLast4).replace(/\D/g, '');
    const phoneDigits = appRecord.phone.replace(/\D/g, '');
    if (phoneDigits.length >= 4 && !phoneDigits.endsWith(cleanLast4)) {
      return res.status(401).json({
        error: 'Phone number verification did not match the records for this reference.'
      });
    }
  }

  res.json({
    success: true,
    data: {
      referenceNumber: appRecord.referenceNumber,
      category: appRecord.category,
      programTitle: appRecord.programTitle,
      status: appRecord.status,
      statusReason: appRecord.statusReason || null,
      createdAt: appRecord.createdAt,
      updatedAt: appRecord.updatedAt
    }
  });
});

// Submit Donation with SadaPay transfer screenshot proof (mandatory)
app.post('/api/donations/submit-proof', (req: Request, res: Response) => {
  const {
    amount,
    category,
    donorName,
    donorEmail,
    donorPhone,
    isAnonymous,
    screenshotFileName,
    screenshotFileData,
    screenshotFileType
  } = req.body;

  const numAmount = Number(amount);
  if (!numAmount || numAmount < 100) {
    return res.status(400).json({ error: 'Please enter a valid donation amount of at least PKR 100.' });
  }

  if (!donorEmail) {
    return res.status(400).json({ error: 'Please provide your email address to receive your donation receipt.' });
  }

  if (!screenshotFileData || !screenshotFileName) {
    return res.status(400).json({ error: 'Uploading your SadaPay transfer screenshot is mandatory before submitting.' });
  }

  const validCategories: DonationCategory[] = ['Education', 'Healthcare', 'Other Needs'];
  const selectedCategory = validCategories.includes(category) ? category : 'Education';

  const donation = db.createDonationSubmission({
    amount: Math.round(numAmount),
    category: selectedCategory,
    donorName: isAnonymous ? 'Anonymous Donor' : String(donorName || 'Generous Donor').trim().slice(0, 100),
    donorEmail: String(donorEmail).trim().slice(0, 100),
    donorPhone: donorPhone ? String(donorPhone).trim().slice(0, 30) : undefined,
    isAnonymous: Boolean(isAnonymous),
    screenshotFileName: String(screenshotFileName).slice(0, 200),
    screenshotFileData: String(screenshotFileData),
    screenshotFileType: screenshotFileType || 'image/png'
  });

  res.status(201).json({
    success: true,
    data: donation,
    message: 'Transfer screenshot submitted. Confirmation email dispatched to your inbox. Admin will manually verify against the SadaPay ledger.'
  });
});

// Transparency & Disclosures
app.get('/api/transparency', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      foundationName: 'Aban Welfare Foundation (AWF)',
      registrationNote:
        'AWF is in its founding phase, established in Karachi, Pakistan in memory of Aban Khan. Legal trust registration filings are currently in progress with relevant regulatory bodies.',
      taxDeductibilityDisclosure:
        'Tax deductibility and formal 2(36) tax exemption status are pending formal regulatory approval. AWF does not represent donations as tax-exempt until authorized certificates are issued.'
    }
  });
});

// Public contact inquiry submission
app.post('/api/contact', (req: Request, res: Response) => {
  const { category, fullName, email, phone, message } = req.body;

  if (!fullName || !email || !message) {
    return res.status(400).json({ error: 'Please provide your name, email, and message.' });
  }

  const allowedCategories = ['general', 'donation', 'healthcare', 'education', 'essential_needs', 'volunteering', 'partnership', 'other'];
  const validCategory = allowedCategories.includes(category) ? category : 'general';

  const inquiry = db.createContactInquiry({
    category: validCategory as any,
    fullName: String(fullName).trim().slice(0, 120),
    email: String(email).trim().slice(0, 120),
    phone: phone ? String(phone).trim().slice(0, 40) : undefined,
    message: String(message).trim().slice(0, 3000)
  });

  res.status(201).json({
    success: true,
    message: 'Thank you for reaching out to Aban Welfare Foundation. Your inquiry has been received.',
    data: { id: inquiry.id }
  });
});

// ----------------------------------------------------
// ADMIN AUTHENTICATION ROUTES
// ----------------------------------------------------

app.post('/api/admin/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please enter your authorized email and password.' });
  }

  const user = db.validateAdminCredentials(email, password);
  if (!user) {
    db.addAuditLog({
      action: 'FAILED_ADMIN_LOGIN',
      category: 'security',
      details: `Failed login attempt for: ${String(email).slice(0, 60)}`,
      actorEmail: email,
      actorRole: 'unauthenticated'
    });
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = Date.now() + 8 * 60 * 60 * 1000;

  const sessionData: SessionData = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    expiresAt
  };

  activeSessions.set(token, sessionData);

  db.addAuditLog({
    action: 'ADMIN_LOGIN_SUCCESS',
    category: 'security',
    details: `Authorized admin session initiated for ${user.email}.`,
    actorEmail: user.email,
    actorRole: user.role
  });

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  });
});

app.get('/api/admin/me', requireAuth(), (req: Request, res: Response) => {
  const session = (req as any).session as SessionData;
  res.json({
    success: true,
    user: {
      userId: session.userId,
      email: session.email,
      name: session.name,
      role: session.role
    }
  });
});

app.post('/api/admin/logout', requireAuth(), (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7).trim();
    activeSessions.delete(token);
  }
  res.json({ success: true, message: 'Logged out successfully.' });
});

// Update Connected Admin Gmail or Password
app.put('/api/admin/security', requireAuth(['admin']), (req: Request, res: Response) => {
  const session = (req as any).session as SessionData;
  const { newEmail, newPassword } = req.body;

  let message = '';
  if (newEmail && newEmail.trim()) {
    db.updateAdminEmail(session.userId, newEmail.trim(), session.email);
    session.email = newEmail.trim();
    message += 'Connected Gmail updated. ';
  }
  if (newPassword && newPassword.trim()) {
    if (newPassword.trim().length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }
    db.updateAdminPassword(session.userId, newPassword.trim(), session.email);
    message += 'Password updated successfully.';
  }

  res.json({ success: true, message: message || 'Security settings updated.' });
});

// Update SadaPay Account details
app.put('/api/admin/sadapay-info', requireAuth(['admin', 'finance']), (req: Request, res: Response) => {
  const session = (req as any).session as SessionData;
  const { accountTitle, iban, accountNumber, instructions } = req.body;

  const updated = db.updateSadaPaySettings(
    { accountTitle, iban, accountNumber, instructions },
    session.email
  );

  res.json({ success: true, data: updated });
});

// ----------------------------------------------------
// PROTECTED ADMIN MANAGEMENT ROUTES
// ----------------------------------------------------

// Admin Overview
app.get('/api/admin/overview', requireAuth(), (_req: Request, res: Response) => {
  const applications = db.getApplications();
  const donations = db.getDonations();
  const auditLogs = db.getAuditLogs().slice(0, 10);

  const statusCounts = applications.reduce((acc: Record<string, number>, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});

  const donationTotals = donations.reduce(
    (acc, d) => {
      acc.totalCount += 1;
      if (d.status === 'verified') {
        acc.verifiedAmount += d.amount;
        acc.verifiedCount += 1;
      } else if (d.status === 'pending_verification') {
        acc.pendingCount += 1;
        acc.pendingAmount += d.amount;
      } else if (d.status === 'failed') {
        acc.failedCount += 1;
      } else if (d.status === 'refunded') {
        acc.refundedCount += 1;
      }
      return acc;
    },
    {
      verifiedAmount: 0,
      verifiedCount: 0,
      pendingCount: 0,
      pendingAmount: 0,
      failedCount: 0,
      refundedCount: 0,
      totalCount: 0
    }
  );

  res.json({
    success: true,
    data: {
      statusCounts,
      totalApplications: applications.length,
      donationTotals,
      recentAuditLogs: auditLogs
    }
  });
});

// Admin Applications List
app.get('/api/admin/applications', requireAuth(['admin', 'reviewer']), (req: Request, res: Response) => {
  const { category, status, search } = req.query;
  let list = db.getApplications();

  if (category) {
    list = list.filter((a) => a.category === category);
  }
  if (status) {
    list = list.filter((a) => a.status === status);
  }
  if (search) {
    const query = String(search).toLowerCase();
    list = list.filter(
      (a) =>
        a.referenceNumber.toLowerCase().includes(query) ||
        a.fullName.toLowerCase().includes(query) ||
        a.phone.includes(query) ||
        a.email.toLowerCase().includes(query) ||
        a.cityArea.toLowerCase().includes(query)
    );
  }

  res.json({ success: true, data: list });
});

// Admin Application Detail
app.get('/api/admin/applications/:id', requireAuth(['admin', 'reviewer']), (req: Request, res: Response) => {
  const appRecord = db.getApplicationById(req.params.id);
  if (!appRecord) {
    return res.status(404).json({ error: 'Application not found' });
  }
  res.json({ success: true, data: appRecord });
});

// Update Application Status & Notes + Dispatch approval email
app.patch('/api/admin/applications/:id', requireAuth(['admin', 'reviewer']), (req: Request, res: Response) => {
  const { status, statusReason, internalNote, sendEmailNotice } = req.body;
  const session = (req as any).session as SessionData;

  const validStatuses: ApplicationStatus[] = [
    'Received',
    'Under Review',
    'Additional Information Required',
    'Approved',
    'Declined',
    'Closed'
  ];

  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid application status.' });
  }

  const updated = db.updateApplicationStatus(
    req.params.id,
    status,
    statusReason,
    internalNote,
    sendEmailNotice !== false, // default true to dispatch email
    session.email,
    session.role
  );

  if (!updated) {
    return res.status(404).json({ error: 'Application not found' });
  }

  res.json({ success: true, data: updated });
});

// Admin Program Management
app.get('/api/admin/programs', requireAuth(), (_req: Request, res: Response) => {
  res.json({ success: true, data: db.getPrograms() });
});

app.put('/api/admin/programs/:id', requireAuth(['admin']), (req: Request, res: Response) => {
  const session = (req as any).session as SessionData;
  const {
    title,
    tagline,
    description,
    applicationStatus,
    geographicScope,
    requiredDocumentsNote,
    reviewProcessSummary,
    eligibilityCriteria
  } = req.body;

  const validStatuses: ProgramStatus[] = ['Planned', 'Applications Open', 'Temporarily Closed', 'Closed'];
  if (applicationStatus && !validStatuses.includes(applicationStatus)) {
    return res.status(400).json({ error: 'Invalid program status.' });
  }

  const updated = db.updateProgram(
    req.params.id,
    {
      title,
      tagline,
      description,
      applicationStatus,
      geographicScope,
      requiredDocumentsNote,
      reviewProcessSummary,
      eligibilityCriteria
    },
    session.email,
    session.role
  );

  if (!updated) {
    return res.status(404).json({ error: 'Program not found' });
  }

  res.json({ success: true, data: updated });
});

// Admin Donation Management & Manual SadaPay Verification
app.get('/api/admin/donations', requireAuth(['admin', 'finance']), (req: Request, res: Response) => {
  const { status, category } = req.query;
  let list = db.getDonations();

  if (status) {
    list = list.filter((d) => d.status === status);
  }
  if (category) {
    list = list.filter((d) => d.category === category);
  }

  res.json({ success: true, data: list });
});

// Manually verify donation screenshot against SadaPay and dispatch confirmation email
app.post('/api/admin/donations/:id/verify', requireAuth(['admin', 'finance']), (req: Request, res: Response) => {
  const { verifiedStatus, notes, sendEmailNotice } = req.body;
  const session = (req as any).session as SessionData;

  const updated = db.verifyDonation(
    req.params.id,
    verifiedStatus || 'verified',
    notes || 'Manually verified against SadaPay statement',
    sendEmailNotice !== false, // sends confirmation email to donor
    session.email,
    session.role
  );

  if (!updated) {
    return res.status(404).json({ error: 'Donation not found' });
  }

  res.json({ success: true, data: updated });
});

// Admin Audit Logs
app.get('/api/admin/audit-logs', requireAuth(['admin']), (_req: Request, res: Response) => {
  res.json({ success: true, data: db.getAuditLogs() });
});

// ----------------------------------------------------
// DEV / PROD CLIENT INTEGRATION
// ----------------------------------------------------

async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AWF Server running on http://0.0.0.0:${PORT} (env: ${isProduction ? 'prod' : 'dev'})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
