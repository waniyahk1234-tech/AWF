import {
  Program,
  ApplicationRecord,
  DonationRecord,
  AuditLogEntry,
  AdminUserSession,
  SadaPaySettings
} from '../types/index.ts';

const TOKEN_KEY = 'awf_admin_token';

export const apiClient = {
  // Public Program APIs
  async getPrograms(): Promise<Program[]> {
    const res = await fetch('/api/programs');
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch programs');
    return json.data;
  },

  async getProgram(slug: string): Promise<Program> {
    const res = await fetch(`/api/programs/${slug}`);
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch program');
    return json.data;
  },

  // Public SadaPay Info
  async getSadaPayInfo(): Promise<SadaPaySettings> {
    const res = await fetch('/api/sadapay-info');
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch SadaPay info');
    return json.data;
  },

  // Public Application Submission (Healthcare, Education, Other Needs)
  async submitApplication(data: {
    category: 'Education' | 'Healthcare' | 'Other Needs';
    fullName: string;
    preferredContact: 'phone' | 'email' | 'whatsapp';
    phone: string;
    email: string;
    cityArea?: string;
    assistanceNeeded: string;
    evidenceFileName?: string;
    evidenceFileData?: string;
    evidenceFileType?: string;
    privacyConsent: boolean;
  }): Promise<{
    referenceNumber: string;
    category: string;
    status: string;
    email: string;
    createdAt: string;
    instructions: string;
  }> {
    const res = await fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Application submission failed');
    return json.data;
  },

  async trackApplication(referenceNumber: string, phoneLast4?: string): Promise<{
    referenceNumber: string;
    category: string;
    programTitle: string;
    status: string;
    statusReason: string | null;
    createdAt: string;
    updatedAt: string;
  }> {
    const res = await fetch('/api/applications/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ referenceNumber, phoneLast4 })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Tracking lookup failed');
    return json.data;
  },

  // Public Donation Submission with mandatory SadaPay screenshot proof
  async submitDonationProof(data: {
    amount: number;
    category: 'Education' | 'Healthcare' | 'Other Needs';
    donorName: string;
    donorEmail: string;
    donorPhone?: string;
    isAnonymous: boolean;
    screenshotFileName: string;
    screenshotFileData: string;
    screenshotFileType?: string;
  }): Promise<DonationRecord> {
    const res = await fetch('/api/donations/submit-proof', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to submit donation proof');
    return json.data;
  },

  // Public Contact Inquiry
  async sendContactInquiry(data: {
    category: string;
    fullName: string;
    email: string;
    phone?: string;
    message: string;
  }): Promise<{ id: string }> {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to submit inquiry');
    return json.data;
  },

  // Public Transparency
  async getTransparency(): Promise<any> {
    const res = await fetch('/api/transparency');
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch transparency records');
    return json.data;
  },

  // Admin Auth
  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  clearToken() {
    localStorage.removeItem(TOKEN_KEY);
  },

  async adminLogin(email: string, pass: string): Promise<{ token: string; user: AdminUserSession }> {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password: pass })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Authentication failed');
    this.setToken(json.token);
    return json;
  },

  async adminGetMe(): Promise<AdminUserSession | null> {
    const token = this.getToken();
    if (!token) return null;
    const res = await fetch('/api/admin/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) {
      this.clearToken();
      return null;
    }
    const json = await res.json();
    return json.user;
  },

  async adminLogout(): Promise<void> {
    const token = this.getToken();
    if (token) {
      await fetch('/api/admin/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => {});
      this.clearToken();
    }
  },

  // Admin Protected endpoints
  async adminGetOverview(): Promise<any> {
    const token = this.getToken();
    const res = await fetch('/api/admin/overview', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to load overview');
    return json.data;
  },

  async adminGetApplications(params?: { category?: string; status?: string; search?: string }): Promise<ApplicationRecord[]> {
    const token = this.getToken();
    const url = new URL('/api/admin/applications', window.location.origin);
    if (params?.category) url.searchParams.set('category', params.category);
    if (params?.status) url.searchParams.set('status', params.status);
    if (params?.search) url.searchParams.set('search', params.search);

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` }
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch applications');
    return json.data;
  },

  async adminUpdateApplication(
    id: string,
    data: { status: string; statusReason?: string; internalNote?: string; sendEmailNotice?: boolean }
  ): Promise<ApplicationRecord> {
    const token = this.getToken();
    const res = await fetch(`/api/admin/applications/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update application');
    return json.data;
  },

  async adminGetPrograms(): Promise<Program[]> {
    const token = this.getToken();
    const res = await fetch('/api/admin/programs', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch admin programs');
    return json.data;
  },

  async adminUpdateProgram(id: string, data: Partial<Program>): Promise<Program> {
    const token = this.getToken();
    const res = await fetch(`/api/admin/programs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update program');
    return json.data;
  },

  async adminGetDonations(params?: { status?: string; category?: string }): Promise<DonationRecord[]> {
    const token = this.getToken();
    const url = new URL('/api/admin/donations', window.location.origin);
    if (params?.status) url.searchParams.set('status', params.status);
    if (params?.category) url.searchParams.set('category', params.category);

    const res = await fetch(url.toString(), {
      headers: { Authorization: `Bearer ${token}` }
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch donations');
    return json.data;
  },

  async adminVerifyDonation(
    id: string,
    data: { verifiedStatus: string; notes?: string; sendEmailNotice?: boolean }
  ): Promise<DonationRecord> {
    const token = this.getToken();
    const res = await fetch(`/api/admin/donations/${id}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to verify donation');
    return json.data;
  },

  async adminGetAuditLogs(): Promise<AuditLogEntry[]> {
    const token = this.getToken();
    const res = await fetch('/api/admin/audit-logs', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to fetch audit logs');
    return json.data;
  },

  async adminUpdateSecurity(data: { newEmail?: string; newPassword?: string }): Promise<{ message: string }> {
    const token = this.getToken();
    const res = await fetch('/api/admin/security', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update security settings');
    return json;
  },

  async adminUpdateSadaPayInfo(data: Partial<SadaPaySettings>): Promise<SadaPaySettings> {
    const token = this.getToken();
    const res = await fetch('/api/admin/sadapay-info', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update SadaPay settings');
    return json.data;
  }
};
