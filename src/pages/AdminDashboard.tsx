import React, { useState, useEffect } from 'react';
import {
  Program,
  ApplicationRecord,
  DonationRecord,
  AuditLogEntry,
  AdminUserSession,
  ApplicationStatus,
  ProgramStatus,
  SadaPaySettings
} from '../types/index.ts';
import { apiClient } from '../api/client.ts';
import {
  Shield,
  Lock,
  LogOut,
  Users,
  Heart,
  FileText,
  Settings,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Edit3,
  Building,
  RefreshCw,
  Eye,
  Check,
  X,
  CreditCard,
  History,
  Info,
  Mail,
  Key,
  Download
} from 'lucide-react';

interface AdminDashboardProps {
  currentSession: AdminUserSession | null;
  onLoginSuccess: (user: AdminUserSession) => void;
  onLogout: () => void;
  onRefreshPrograms: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentSession,
  onLoginSuccess,
  onLogout,
  onRefreshPrograms
}) => {
  // Login State: Empty by default, no pre-entered passwords or emails!
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'donations' | 'sadapay' | 'security' | 'audit'>('overview');

  // Overview Data
  const [overviewData, setOverviewData] = useState<any>(null);
  const [overviewLoading, setOverviewLoading] = useState(false);

  // Applications Tab
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [appFilterCategory, setAppFilterCategory] = useState<string>('');
  const [appFilterStatus, setAppFilterStatus] = useState<string>('');
  const [appSearch, setAppSearch] = useState<string>('');
  const [appLoading, setAppLoading] = useState(false);
  const [selectedApp, setSelectedApp] = useState<ApplicationRecord | null>(null);
  const [newStatus, setNewStatus] = useState<ApplicationStatus>('Received');
  const [newStatusReason, setNewStatusReason] = useState<string>('');
  const [internalNoteText, setInternalNoteText] = useState<string>('');
  const [sendAppEmail, setSendAppEmail] = useState<boolean>(true);
  const [updatingApp, setUpdatingApp] = useState(false);

  // Evidence Modal
  const [viewingEvidence, setViewingEvidence] = useState<{ name: string; data?: string; type?: string } | null>(null);

  // Donations Tab
  const [donationsList, setDonationsList] = useState<DonationRecord[]>([]);
  const [donationFilterStatus, setDonationFilterStatus] = useState<string>('');
  const [donationFilterCategory, setDonationFilterCategory] = useState<string>('');
  const [donationsLoading, setDonationsLoading] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState<DonationRecord | null>(null);
  const [reconcileNotes, setReconcileNotes] = useState<string>('');
  const [reconcileLoading, setReconcileLoading] = useState(false);
  const [sendDonationEmail, setSendDonationEmail] = useState<boolean>(true);

  // Screenshot Modal
  const [viewingScreenshot, setViewingScreenshot] = useState<{ name: string; data: string; title: string } | null>(null);

  // SadaPay Settings Tab
  const [sadaPaySettings, setSadaPaySettings] = useState<SadaPaySettings | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editIban, setEditIban] = useState('');
  const [editAccountNumber, setEditAccountNumber] = useState('');
  const [editInstructions, setEditInstructions] = useState('');
  const [savingSadaPay, setSavingSadaPay] = useState(false);

  // Security Tab (Connected Admin Gmail & Password)
  const [connectedGmail, setConnectedGmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingSecurity, setSavingSecurity] = useState(false);

  // Audit Logs Tab
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [auditLoading, setAuditLoading] = useState(false);

  // Notification Toast
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 4000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      setLoginLoading(true);
      const res = await apiClient.adminLogin(loginEmail.trim(), loginPassword);
      onLoginSuccess(res.user);
      showToast(`Authenticated as ${res.user.email}`);
    } catch (err: any) {
      setLoginError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoginLoading(false);
    }
  };

  useEffect(() => {
    if (!currentSession) return;

    if (activeTab === 'overview') {
      loadOverview();
    } else if (activeTab === 'applications') {
      loadApplications();
    } else if (activeTab === 'donations') {
      loadDonations();
    } else if (activeTab === 'sadapay') {
      loadSadaPay();
    } else if (activeTab === 'security') {
      setConnectedGmail(currentSession.email);
    } else if (activeTab === 'audit') {
      loadAuditLogs();
    }
  }, [activeTab, currentSession]);

  const loadOverview = async () => {
    try {
      setOverviewLoading(true);
      const data = await apiClient.adminGetOverview();
      setOverviewData(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setOverviewLoading(false);
    }
  };

  const loadApplications = async () => {
    try {
      setAppLoading(true);
      const list = await apiClient.adminGetApplications({
        category: appFilterCategory || undefined,
        status: appFilterStatus || undefined,
        search: appSearch || undefined
      });
      setApplications(list);
    } catch (err: any) {
      console.error(err);
    } finally {
      setAppLoading(false);
    }
  };

  const loadDonations = async () => {
    try {
      setDonationsLoading(true);
      const list = await apiClient.adminGetDonations({
        status: donationFilterStatus || undefined,
        category: donationFilterCategory || undefined
      });
      setDonationsList(list);
    } catch (err: any) {
      console.error(err);
    } finally {
      setDonationsLoading(false);
    }
  };

  const loadSadaPay = async () => {
    try {
      const data = await apiClient.getSadaPayInfo();
      setSadaPaySettings(data);
      setEditTitle(data.accountTitle);
      setEditIban(data.iban);
      setEditAccountNumber(data.accountNumber || '');
      setEditInstructions(data.instructions);
    } catch (err: any) {
      console.error(err);
    }
  };

  const loadAuditLogs = async () => {
    try {
      setAuditLoading(true);
      const logs = await apiClient.adminGetAuditLogs();
      setAuditLogs(logs);
    } catch (err: any) {
      console.error(err);
    } finally {
      setAuditLoading(false);
    }
  };

  const handleUpdateAppStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedApp) return;

    try {
      setUpdatingApp(true);
      const updated = await apiClient.adminUpdateApplication(selectedApp.id, {
        status: newStatus,
        statusReason: newStatusReason.trim() || undefined,
        internalNote: internalNoteText.trim() || undefined,
        sendEmailNotice: sendAppEmail
      });
      setSelectedApp(updated);
      setInternalNoteText('');
      setNewStatusReason('');
      showToast(
        `Application ${updated.referenceNumber} updated to ${updated.status}.${sendAppEmail ? ` Notification email sent to ${updated.email}` : ''}`
      );
      loadApplications();
    } catch (err: any) {
      alert(err.message || 'Failed to update application');
    } finally {
      setUpdatingApp(false);
    }
  };

  const handleVerifyDonation = async (statusToSet: 'verified' | 'failed') => {
    if (!selectedDonation) return;

    try {
      setReconcileLoading(true);
      const updated = await apiClient.adminVerifyDonation(selectedDonation.id, {
        verifiedStatus: statusToSet,
        notes: reconcileNotes.trim() || `Manually verified against SadaPay statement on ${new Date().toLocaleDateString()}`,
        sendEmailNotice: sendDonationEmail
      });
      setSelectedDonation(null);
      setReconcileNotes('');
      showToast(
        `Donation ${updated.referenceNumber} marked as ${updated.status}.${sendDonationEmail ? ` Confirmation email sent to ${updated.donorEmail}` : ''}`
      );
      loadDonations();
    } catch (err: any) {
      alert(err.message || 'Verification failed');
    } finally {
      setReconcileLoading(false);
    }
  };

  const handleSaveSadaPay = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSavingSadaPay(true);
      const updated = await apiClient.adminUpdateSadaPayInfo({
        accountTitle: editTitle.trim(),
        iban: editIban.trim(),
        accountNumber: editAccountNumber.trim(),
        instructions: editInstructions.trim()
      });
      setSadaPaySettings(updated);
      showToast('SadaPay receiving account settings updated successfully.');
    } catch (err: any) {
      alert(err.message || 'Failed to update SadaPay info');
    } finally {
      setSavingSadaPay(false);
    }
  };

  const handleSaveSecurity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword && newPassword !== confirmPassword) {
      alert('New password and confirmation do not match.');
      return;
    }

    try {
      setSavingSecurity(true);
      const res = await apiClient.adminUpdateSecurity({
        newEmail: connectedGmail.trim() || undefined,
        newPassword: newPassword.trim() || undefined
      });
      setNewPassword('');
      setConfirmPassword('');
      showToast(res.message);
    } catch (err: any) {
      alert(err.message || 'Failed to update security credentials.');
    } finally {
      setSavingSecurity(false);
    }
  };

  // IF NOT AUTHENTICATED: Clean, un-revealed secure login portal
  if (!currentSession) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 space-y-8 animate-in fade-in">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#9E4927]/10 flex items-center justify-center text-[#9E4927] mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#4A2C22]">
            AWF Administrative Portal
          </h1>
          <p className="text-xs text-[#4A2C22]/80 leading-relaxed">
            Authorized access only. Enter your designated administrator Gmail and password.
          </p>
        </div>

        <div className="bg-[#FAF5ED] border border-[#D8B99A] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs">
          {loginError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#4A2C22] mb-1">
                Authorized Admin Gmail / Email
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="yourname@gmail.com"
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#D8B99A] rounded-md focus:border-[#9E4927] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#4A2C22] mb-1">
                Password
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-[#D8B99A] rounded-md focus:border-[#9E4927] focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full py-2.5 px-4 text-xs font-semibold text-[#FAF5ED] bg-[#9E4927] hover:bg-[#82381B] disabled:opacity-50 rounded-md transition-colors"
            >
              {loginLoading ? 'Authenticating...' : 'Sign In to Portal'}
            </button>
          </form>

          <div className="pt-2 text-center">
            <span className="text-[11px] text-[#4A2C22]/60">
              Credentials are protected by salted hashing and server-side authorization.
            </span>
          </div>
        </div>
      </div>
    );
  }

  // AUTHENTICATED DASHBOARD
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in">
      {/* Toast Notification */}
      {actionMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#4A2C22] text-[#FAF5ED] px-4 py-3 rounded-lg shadow-lg border border-[#D8B99A]/40 text-xs flex items-center gap-2 animate-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Top Bar for Admin */}
      <div className="bg-[#FAF5ED] border border-[#D8B99A] rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2 py-0.5 rounded uppercase tracking-wider bg-[#9E4927] text-[#FAF5ED]">
              {currentSession.role}
            </span>
            <span className="text-xs text-[#4A2C22] font-mono font-semibold">
              {currentSession.email}
            </span>
          </div>
          <h1 className="text-2xl font-serif font-bold text-[#4A2C22]">
            AWF Administrative Management
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (activeTab === 'overview') loadOverview();
              if (activeTab === 'applications') loadApplications();
              if (activeTab === 'donations') loadDonations();
              if (activeTab === 'sadapay') loadSadaPay();
              if (activeTab === 'audit') loadAuditLogs();
            }}
            className="p-2 text-[#4A2C22] border border-[#D8B99A] rounded-md hover:bg-[#F4EADB] text-xs flex items-center gap-1.5"
            title="Refresh current view"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            onClick={onLogout}
            className="px-3.5 py-2 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-[#D8B99A]/40">
        {[
          { id: 'overview', label: 'Overview', icon: History },
          { id: 'applications', label: 'Help Applications', icon: FileText },
          { id: 'donations', label: 'Donations & SadaPay Proofs', icon: Heart },
          { id: 'sadapay', label: 'SadaPay Receiving Account', icon: Building },
          { id: 'security', label: 'Connected Gmail & Security', icon: Key },
          { id: 'audit', label: 'Security & Audit Trail', icon: Shield }
        ].map((t) => {
          const isActive = activeTab === t.id;
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`px-3.5 py-2 text-xs font-medium rounded-md whitespace-nowrap flex items-center gap-2 transition-colors ${
                isActive
                  ? 'bg-[#9E4927] text-[#FAF5ED] font-semibold shadow-xs'
                  : 'bg-[#FAF5ED] text-[#4A2C22] border border-[#D8B99A]/50 hover:bg-[#F4EADB]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in">
          {overviewLoading ? (
            <div className="p-12 text-center text-xs text-[#4A2C22]/70">
              Loading metrics...
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 bg-[#FAF5ED] border border-[#D8B99A] rounded-xl space-y-1">
                  <div className="text-[11px] text-[#4A2C22]/70 uppercase font-semibold">
                    Verified Donations Total
                  </div>
                  <div className="text-2xl font-serif font-bold text-[#9E4927] tabular-nums">
                    PKR {(overviewData?.donationTotals?.verifiedAmount ?? 0).toLocaleString()}
                  </div>
                  <div className="text-[11px] text-[#4A2C22]/60">
                    {overviewData?.donationTotals?.verifiedCount ?? 0} verified via SadaPay
                  </div>
                </div>

                <div className="p-5 bg-[#FAF5ED] border border-[#D8B99A] rounded-xl space-y-1">
                  <div className="text-[11px] text-[#4A2C22]/70 uppercase font-semibold">
                    Pending Screenshots to Verify
                  </div>
                  <div className="text-2xl font-serif font-bold text-[#4A2C22] tabular-nums">
                    {overviewData?.donationTotals?.pendingCount ?? 0}
                  </div>
                  <div className="text-[11px] text-[#4A2C22]/60">
                    Awaiting manual review & approval
                  </div>
                </div>

                <div className="p-5 bg-[#FAF5ED] border border-[#D8B99A] rounded-xl space-y-1">
                  <div className="text-[11px] text-[#4A2C22]/70 uppercase font-semibold">
                    Help Applications Received
                  </div>
                  <div className="text-2xl font-serif font-bold text-[#4A2C22] tabular-nums">
                    {overviewData?.totalApplications ?? 0}
                  </div>
                  <div className="text-[11px] text-[#4A2C22]/60">
                    Education, Healthcare & Other Needs
                  </div>
                </div>

                <div className="p-5 bg-[#FAF5ED] border border-[#D8B99A] rounded-xl space-y-1">
                  <div className="text-[11px] text-[#4A2C22]/70 uppercase font-semibold">
                    Categories Active
                  </div>
                  <div className="text-2xl font-serif font-bold text-[#4A2C22]">
                    3 Core Pillars
                  </div>
                  <div className="text-[11px] text-[#4A2C22]/60">
                    Education, Healthcare, Other Needs
                  </div>
                </div>
              </div>

              {/* Status Breakdown */}
              <div className="bg-[#FAF5ED] border border-[#D8B99A] rounded-2xl p-6 space-y-4">
                <h3 className="text-lg font-serif font-bold text-[#4A2C22]">
                  Application Status Pipeline
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {[
                    'Received',
                    'Under Review',
                    'Additional Information Required',
                    'Approved',
                    'Declined',
                    'Closed'
                  ].map((st) => (
                    <div key={st} className="p-3 bg-white rounded-lg border border-[#D8B99A]/50 text-center">
                      <div className="text-xs text-[#4A2C22]/70 truncate" title={st}>
                        {st}
                      </div>
                      <div className="text-xl font-serif font-bold text-[#9E4927] mt-1 tabular-nums">
                        {overviewData?.statusCounts?.[st] ?? 0}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* TAB 2: HELP APPLICATIONS (Healthcare, Education, Other Needs) */}
      {activeTab === 'applications' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Filters */}
          <div className="bg-[#FAF5ED] border border-[#D8B99A] rounded-xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              <select
                value={appFilterCategory}
                onChange={(e) => setAppFilterCategory(e.target.value)}
                className="px-3 py-2 text-xs bg-white border border-[#D8B99A] rounded-md text-[#4A2C22]"
              >
                <option value="">All Categories</option>
                <option value="Education">Education</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Other Needs">Other Needs</option>
              </select>

              <select
                value={appFilterStatus}
                onChange={(e) => setAppFilterStatus(e.target.value)}
                className="px-3 py-2 text-xs bg-white border border-[#D8B99A] rounded-md text-[#4A2C22]"
              >
                <option value="">All Review Statuses</option>
                <option value="Received">Received</option>
                <option value="Under Review">Under Review</option>
                <option value="Approved">Approved</option>
                <option value="Additional Information Required">Additional Info Required</option>
                <option value="Declined">Declined</option>
                <option value="Closed">Closed</option>
              </select>
            </div>

            <div className="w-full sm:w-64 relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-[#4A2C22]/60" />
              <input
                type="text"
                placeholder="Search reference, phone, email..."
                value={appSearch}
                onChange={(e) => setAppSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-[#D8B99A] rounded-md focus:border-[#9E4927] focus:outline-hidden"
              />
            </div>
          </div>

          {/* Table */}
          <div className="bg-[#FAF5ED] border border-[#D8B99A] rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-[#D8B99A]/50 flex items-center justify-between">
              <h3 className="text-base font-serif font-bold text-[#4A2C22]">
                Assistance Applications ({applications.length})
              </h3>
              <span className="text-[11px] text-[#4A2C22]/70">
                Manual review & verification queue
              </span>
            </div>

            {appLoading ? (
              <div className="p-12 text-center text-xs text-[#4A2C22]/70">
                Loading applications...
              </div>
            ) : applications.length === 0 ? (
              <div className="p-12 text-center text-xs text-[#4A2C22]/70">
                No applications matching criteria.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F4EADB] border-b border-[#D8B99A]/50 text-[#4A2C22] font-semibold">
                    <tr>
                      <th className="p-3">Reference</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Applicant Name</th>
                      <th className="p-3">Phone & Email</th>
                      <th className="p-3">Evidence</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Date</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D8B99A]/30">
                    {applications.map((app) => (
                      <tr key={app.id} className="hover:bg-white/50 transition-colors">
                        <td className="p-3 font-mono font-bold text-[#9E4927]">
                          {app.referenceNumber}
                        </td>
                        <td className="p-3 font-semibold text-[#4A2C22]">
                          {app.category}
                        </td>
                        <td className="p-3 text-[#4A2C22] font-medium">
                          {app.fullName}
                        </td>
                        <td className="p-3 text-[#4A2C22]/80">
                          <div>{app.phone}</div>
                          <div className="text-[10px] text-[#4A2C22]/60">{app.email}</div>
                        </td>
                        <td className="p-3">
                          {app.evidenceFileName ? (
                            <button
                              onClick={() =>
                                setViewingEvidence({
                                  name: app.evidenceFileName || 'evidence',
                                  data: app.evidenceFileData,
                                  type: app.evidenceFileType
                                })
                              }
                              className="px-2 py-0.5 rounded text-[11px] font-medium text-[#9E4927] bg-[#EBDCCD] hover:bg-[#D8B99A] transition-colors flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              <span>View Evidence</span>
                            </button>
                          ) : (
                            <span className="text-[11px] text-[#4A2C22]/40">None attached</span>
                          )}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              app.status === 'Approved'
                                ? 'bg-emerald-100 text-emerald-800'
                                : app.status === 'Under Review'
                                ? 'bg-blue-100 text-blue-800'
                                : app.status === 'Declined'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-[#EBDCCD] text-[#82381B]'
                            }`}
                          >
                            {app.status}
                          </span>
                        </td>
                        <td className="p-3 text-[#4A2C22]/70 tabular-nums">
                          {new Date(app.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedApp(app);
                              setNewStatus(app.status);
                              setNewStatusReason(app.statusReason || '');
                              setInternalNoteText('');
                              setSendAppEmail(true);
                            }}
                            className="px-2.5 py-1 text-xs font-medium text-[#9E4927] hover:bg-[#EBDCCD] rounded transition-colors"
                          >
                            Review & Approve
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* APPLICATION REVIEW MODAL */}
          {selectedApp && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-[#FAF5ED] border border-[#D8B99A] rounded-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-xl my-8">
                <div className="flex items-start justify-between border-b border-[#D8B99A]/50 pb-4">
                  <div>
                    <span className="text-[11px] text-[#9E4927] font-semibold uppercase tracking-wider">
                      {selectedApp.category} Assistance
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-[#4A2C22]">
                      Application: {selectedApp.referenceNumber}
                    </h3>
                  </div>
                  <button onClick={() => setSelectedApp(null)} className="p-1 text-[#4A2C22] hover:text-[#9E4927]">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-white p-4 rounded-xl border border-[#D8B99A]/40">
                  <div>
                    <span className="text-[#4A2C22]/60 block">Applicant:</span>
                    <span className="font-bold text-[#4A2C22] text-sm">{selectedApp.fullName}</span>
                  </div>
                  <div>
                    <span className="text-[#4A2C22]/60 block">Phone:</span>
                    <span className="font-semibold text-[#4A2C22]">{selectedApp.phone}</span>
                  </div>
                  <div>
                    <span className="text-[#4A2C22]/60 block">Email Address (For Notices):</span>
                    <span className="font-semibold text-[#9E4927]">{selectedApp.email}</span>
                  </div>
                  <div>
                    <span className="text-[#4A2C22]/60 block">Location:</span>
                    <span>{selectedApp.cityArea}</span>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#4A2C22]">Description of Need:</span>
                    <span className="text-[11px] text-[#4A2C22]/60">Word Count: {selectedApp.wordCount} words</span>
                  </div>
                  <div className="p-3.5 bg-white border border-[#D8B99A]/50 rounded-lg text-[#4A2C22]/85 leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                    {selectedApp.assistanceNeeded}
                  </div>
                </div>

                {selectedApp.evidenceFileName && (
                  <div className="p-3 bg-white border border-[#D8B99A]/40 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[#4A2C22]/60 block text-[11px]">Attached Evidence Document:</span>
                      <span className="font-semibold text-[#4A2C22]">{selectedApp.evidenceFileName}</span>
                    </div>
                    <button
                      onClick={() =>
                        setViewingEvidence({
                          name: selectedApp.evidenceFileName || 'evidence',
                          data: selectedApp.evidenceFileData,
                          type: selectedApp.evidenceFileType
                        })
                      }
                      className="px-3 py-1 text-xs font-semibold text-[#FAF5ED] bg-[#9E4927] hover:bg-[#82381B] rounded transition-colors"
                    >
                      View / Open Evidence
                    </button>
                  </div>
                )}

                {/* Email dispatch history */}
                {selectedApp.emailLogs && selectedApp.emailLogs.length > 0 && (
                  <div className="space-y-1.5 text-xs">
                    <span className="font-bold text-[#4A2C22] block">
                      Email Notification History ({selectedApp.emailLogs.length}):
                    </span>
                    <div className="space-y-1.5 max-h-32 overflow-y-auto">
                      {selectedApp.emailLogs.map((log) => (
                        <div key={log.id} className="p-2 bg-stone-50 border border-stone-200 rounded text-[11px]">
                          <div className="flex justify-between text-[#4A2C22]/60 mb-0.5">
                            <span className="font-semibold text-[#9E4927]">{log.subject}</span>
                            <span>{new Date(log.sentAt).toLocaleString()}</span>
                          </div>
                          <p className="text-[#4A2C22]/80 truncate">{log.preview}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Review Form */}
                <form onSubmit={handleUpdateAppStatus} className="pt-4 border-t border-[#D8B99A]/50 space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-semibold text-[#4A2C22] mb-1">
                        Update Application Status
                      </label>
                      <select
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value as ApplicationStatus)}
                        className="w-full px-3 py-2 bg-white border border-[#D8B99A] rounded-md focus:outline-hidden"
                      >
                        <option value="Received">Received</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Approved">Approved (Grant Assistance)</option>
                        <option value="Additional Information Required">Additional Information Required</option>
                        <option value="Declined">Declined</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-[#4A2C22] mb-1">
                        Notice Message to Applicant
                      </label>
                      <input
                        type="text"
                        value={newStatusReason}
                        onChange={(e) => setNewStatusReason(e.target.value)}
                        placeholder="Included in email notice to applicant"
                        className="w-full px-3 py-2 bg-white border border-[#D8B99A] rounded-md focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#4A2C22] mb-1">
                      Internal Staff Note (Confidential)
                    </label>
                    <textarea
                      rows={2}
                      value={internalNoteText}
                      onChange={(e) => setInternalNoteText(e.target.value)}
                      placeholder="Add phone verification notes, hospital checks, or review remarks..."
                      className="w-full px-3 py-2 bg-white border border-[#D8B99A] rounded-md focus:outline-hidden resize-none"
                    />
                  </div>

                  <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-lg">
                    <label className="flex items-center gap-2 cursor-pointer font-semibold text-amber-900">
                      <input
                        type="checkbox"
                        checked={sendAppEmail}
                        onChange={(e) => setSendAppEmail(e.target.checked)}
                        className="rounded border-[#D8B99A] text-[#9E4927] focus:ring-[#9E4927]"
                      />
                      <span>Send approval / update notification email to applicant ({selectedApp.email})</span>
                    </label>
                  </div>

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setSelectedApp(null)}
                      className="px-4 py-2 border border-[#D8B99A] rounded-md hover:bg-[#F4EADB]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={updatingApp}
                      className="px-5 py-2 font-semibold text-[#FAF5ED] bg-[#9E4927] hover:bg-[#82381B] disabled:opacity-50 rounded-md transition-colors"
                    >
                      {updatingApp ? 'Saving & Sending Email...' : 'Save & Dispatch Notice'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* EVIDENCE PREVIEW MODAL */}
          {viewingEvidence && (
            <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
              <div className="bg-[#FAF5ED] border border-[#D8B99A] rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b border-[#D8B99A]/50 pb-2">
                  <h4 className="text-base font-serif font-bold text-[#4A2C22]">
                    Evidence: {viewingEvidence.name}
                  </h4>
                  <button onClick={() => setViewingEvidence(null)}>
                    <X className="w-5 h-5 text-[#4A2C22]" />
                  </button>
                </div>

                <div className="text-center">
                  {viewingEvidence.data && viewingEvidence.data.startsWith('data:image/') ? (
                    <img
                      src={viewingEvidence.data}
                      alt="Applicant Evidence"
                      className="max-h-[65vh] w-auto mx-auto rounded-lg border border-[#D8B99A] object-contain"
                    />
                  ) : (
                    <div className="p-8 bg-white border border-[#D8B99A] rounded-xl space-y-3">
                      <FileText className="w-12 h-12 text-[#9E4927] mx-auto" />
                      <p className="text-xs text-[#4A2C22] font-semibold">{viewingEvidence.name}</p>
                      {viewingEvidence.data && (
                        <a
                          href={viewingEvidence.data}
                          download={viewingEvidence.name}
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-[#FAF5ED] bg-[#9E4927] rounded-md"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Download / Open Document</span>
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: DONATIONS & SADAPAY SCREENSHOT PROOFS */}
      {activeTab === 'donations' && (
        <div className="space-y-6 animate-in fade-in">
          {/* Filters */}
          <div className="bg-[#FAF5ED] border border-[#D8B99A] rounded-xl p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              <select
                value={donationFilterStatus}
                onChange={(e) => setDonationFilterStatus(e.target.value)}
                className="px-3 py-2 text-xs bg-white border border-[#D8B99A] rounded-md text-[#4A2C22]"
              >
                <option value="">All Statuses</option>
                <option value="pending_verification">Pending Manual Verification</option>
                <option value="verified">Verified & Cleared</option>
                <option value="failed">Declined / Failed</option>
              </select>

              <select
                value={donationFilterCategory}
                onChange={(e) => setDonationFilterCategory(e.target.value)}
                className="px-3 py-2 text-xs bg-white border border-[#D8B99A] rounded-md text-[#4A2C22]"
              >
                <option value="">All Categories</option>
                <option value="Education">Education</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Other Needs">Other Needs</option>
              </select>
            </div>

            <div className="text-xs text-[#4A2C22]/80">
              Transfer screenshots are verified manually against the SadaPay ledger.
            </div>
          </div>

          {/* Table */}
          <div className="bg-[#FAF5ED] border border-[#D8B99A] rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 border-b border-[#D8B99A]/50 flex items-center justify-between">
              <h3 className="text-base font-serif font-bold text-[#4A2C22]">
                Donations & Transfer Receipts ({donationsList.length})
              </h3>
              <span className="text-[11px] text-[#4A2C22]/70">
                Audited Financial Registry
              </span>
            </div>

            {donationsLoading ? (
              <div className="p-12 text-center text-xs text-[#4A2C22]/70">
                Loading donation proofs...
              </div>
            ) : donationsList.length === 0 ? (
              <div className="p-12 text-center text-xs text-[#4A2C22]/70">
                No donation records found.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F4EADB] border-b border-[#D8B99A]/50 text-[#4A2C22] font-semibold">
                    <tr>
                      <th className="p-3">Reference</th>
                      <th className="p-3">Donor</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Proof Screenshot</th>
                      <th className="p-3">Status</th>
                      <th className="p-3">Date</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#D8B99A]/30">
                    {donationsList.map((don) => (
                      <tr key={don.id} className="hover:bg-white/50 transition-colors">
                        <td className="p-3 font-mono font-bold text-[#9E4927]">
                          {don.referenceNumber}
                        </td>
                        <td className="p-3">
                          <span className="font-semibold text-[#4A2C22]">{don.donorName}</span>
                          <div className="text-[10px] text-[#4A2C22]/60">{don.donorEmail}</div>
                        </td>
                        <td className="p-3 font-bold text-[#4A2C22] tabular-nums">
                          PKR {don.amount.toLocaleString()}
                        </td>
                        <td className="p-3 font-medium text-[#4A2C22]">
                          {don.category}
                        </td>
                        <td className="p-3">
                          {don.screenshotFileData ? (
                            <button
                              onClick={() =>
                                setViewingScreenshot({
                                  name: don.screenshotFileName,
                                  data: don.screenshotFileData,
                                  title: `SadaPay Transfer Receipt - ${don.referenceNumber}`
                                })
                              }
                              className="px-2 py-0.5 rounded text-[11px] font-medium text-[#9E4927] bg-[#EBDCCD] hover:bg-[#D8B99A] transition-colors flex items-center gap-1"
                            >
                              <Eye className="w-3 h-3" />
                              <span>View Screenshot</span>
                            </button>
                          ) : (
                            <span className="text-[11px] text-[#4A2C22]/40">None</span>
                          )}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                              don.status === 'verified'
                                ? 'bg-emerald-100 text-emerald-800'
                                : don.status === 'pending_verification'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {don.status === 'pending_verification' ? 'Pending Review' : don.status}
                          </span>
                        </td>
                        <td className="p-3 text-[#4A2C22]/70 tabular-nums">
                          {new Date(don.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => {
                              setSelectedDonation(don);
                              setReconcileNotes(don.reconciliationNotes || '');
                              setSendDonationEmail(true);
                            }}
                            className="px-2.5 py-1 text-xs font-semibold text-[#FAF5ED] bg-[#9E4927] hover:bg-[#82381B] rounded transition-colors"
                          >
                            Verify & Approve
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* DONATION MANUAL VERIFICATION MODAL */}
          {selectedDonation && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-[#FAF5ED] border border-[#D8B99A] rounded-2xl max-w-md w-full p-6 space-y-5 shadow-xl my-8">
                <div className="flex justify-between items-center pb-2 border-b border-[#D8B99A]/50">
                  <h3 className="text-lg font-serif font-bold text-[#4A2C22]">
                    Verify Donation: {selectedDonation.referenceNumber}
                  </h3>
                  <button onClick={() => setSelectedDonation(null)}>
                    <X className="w-5 h-5 text-[#4A2C22]" />
                  </button>
                </div>

                <div className="text-xs space-y-1.5 p-3.5 bg-white rounded-xl border border-[#D8B99A]/40">
                  <div className="flex justify-between">
                    <span className="text-[#4A2C22]/70">Amount (PKR):</span>
                    <span className="font-bold text-[#9E4927] text-sm">
                      PKR {selectedDonation.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4A2C22]/70">Target Category:</span>
                    <span className="font-semibold">{selectedDonation.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4A2C22]/70">Donor Name:</span>
                    <span>{selectedDonation.donorName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4A2C22]/70">Donor Email:</span>
                    <span className="font-mono text-[#9E4927]">{selectedDonation.donorEmail}</span>
                  </div>
                </div>

                {selectedDonation.screenshotFileData && (
                  <div className="space-y-1 text-center">
                    <span className="text-[11px] text-[#4A2C22]/70 block font-semibold">
                      Uploaded Transfer Screenshot:
                    </span>
                    <div className="max-h-52 overflow-hidden rounded-lg border border-[#D8B99A] bg-white">
                      <img
                        src={selectedDonation.screenshotFileData}
                        alt="Transfer Receipt"
                        className="w-full h-auto object-contain max-h-52"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block font-semibold text-[#4A2C22] mb-1">
                      SadaPay Ledger Reconciliation Note:
                    </label>
                    <textarea
                      rows={2}
                      value={reconcileNotes}
                      onChange={(e) => setReconcileNotes(e.target.value)}
                      placeholder="e.g. Cleared into SadaPay account, statement verified."
                      className="w-full px-3 py-2 bg-white border border-[#D8B99A] rounded-md focus:outline-hidden"
                    />
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-[#4A2C22]">
                    <input
                      type="checkbox"
                      checked={sendDonationEmail}
                      onChange={(e) => setSendDonationEmail(e.target.checked)}
                      className="rounded border-[#D8B99A] text-[#9E4927] focus:ring-[#9E4927]"
                    />
                    <span>Send confirmation approval email to donor ({selectedDonation.donorEmail})</span>
                  </label>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#D8B99A]/40">
                  <button
                    type="button"
                    disabled={reconcileLoading}
                    onClick={() => handleVerifyDonation('failed')}
                    className="px-3.5 py-2 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                  >
                    Decline / Invalid Proof
                  </button>
                  <button
                    type="button"
                    disabled={reconcileLoading}
                    onClick={() => handleVerifyDonation('verified')}
                    className="px-4 py-2 text-xs font-semibold text-[#FAF5ED] bg-[#9E4927] hover:bg-[#82381B] rounded-md transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve & Dispatch Receipt Email</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SCREENSHOT FULL MODAL */}
          {viewingScreenshot && (
            <div className="fixed inset-0 z-60 bg-black/70 flex items-center justify-center p-4">
              <div className="bg-[#FAF5ED] border border-[#D8B99A] rounded-2xl max-w-xl w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center border-b border-[#D8B99A]/50 pb-2">
                  <h4 className="text-base font-serif font-bold text-[#4A2C22]">
                    {viewingScreenshot.title}
                  </h4>
                  <button onClick={() => setViewingScreenshot(null)}>
                    <X className="w-5 h-5 text-[#4A2C22]" />
                  </button>
                </div>

                <div className="text-center">
                  <img
                    src={viewingScreenshot.data}
                    alt={viewingScreenshot.name}
                    className="max-h-[65vh] w-auto mx-auto rounded-lg border border-[#D8B99A] object-contain"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SADAPAY RECEIVING ACCOUNT CONFIGURATION */}
      {activeTab === 'sadapay' && (
        <div className="max-w-2xl bg-[#FAF5ED] border border-[#D8B99A] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs animate-in fade-in">
          <div className="border-b border-[#D8B99A]/50 pb-3 space-y-1">
            <h3 className="text-xl font-serif font-bold text-[#4A2C22]">
              SadaPay Receiving Account Details
            </h3>
            <p className="text-xs text-[#4A2C22]/80">
              The account details configured here are presented to all donors on the public donation page.
            </p>
          </div>

          <form onSubmit={handleSaveSadaPay} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#4A2C22] mb-1">
                Account Title *
              </label>
              <input
                type="text"
                required
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#D8B99A] rounded-md focus:border-[#9E4927] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#4A2C22] mb-1">
                SadaPay IBAN *
              </label>
              <input
                type="text"
                required
                value={editIban}
                onChange={(e) => setEditIban(e.target.value.toUpperCase())}
                placeholder="Enter SadaPay IBAN"
                className="w-full px-3.5 py-2.5 bg-white border border-[#D8B99A] rounded-md font-mono uppercase focus:border-[#9E4927] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#4A2C22] mb-1">
                Account Number / Phone Identifier
              </label>
              <input
                type="text"
                value={editAccountNumber}
                onChange={(e) => setEditAccountNumber(e.target.value)}
                placeholder="Enter Account Number"
                className="w-full px-3.5 py-2.5 bg-white border border-[#D8B99A] rounded-md font-mono focus:border-[#9E4927] focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#4A2C22] mb-1">
                Donor Transfer Instructions
              </label>
              <textarea
                rows={3}
                value={editInstructions}
                onChange={(e) => setEditInstructions(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-[#D8B99A] rounded-md focus:border-[#9E4927] focus:outline-hidden resize-y"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingSadaPay}
                className="px-5 py-2.5 text-xs font-semibold text-[#FAF5ED] bg-[#9E4927] hover:bg-[#82381B] rounded-md transition-colors"
              >
                {savingSadaPay ? 'Saving Changes...' : 'Save SadaPay Configuration'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 5: CONNECTED GMAIL & ADMIN SECURITY */}
      {activeTab === 'security' && (
        <div className="max-w-2xl bg-[#FAF5ED] border border-[#D8B99A] rounded-2xl p-6 sm:p-8 space-y-6 shadow-xs animate-in fade-in">
          <div className="border-b border-[#D8B99A]/50 pb-3 space-y-1">
            <h3 className="text-xl font-serif font-bold text-[#4A2C22]">
              Connected Administrator Gmail & Password
            </h3>
            <p className="text-xs text-[#4A2C22]/80">
              Only this designated Gmail and password will be authorized for administrative access. This information is private and never exposed publicly.
            </p>
          </div>

          <form onSubmit={handleSaveSecurity} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#4A2C22] mb-1">
                Connected Administrator Gmail *
              </label>
              <input
                type="email"
                required
                value={connectedGmail}
                onChange={(e) => setConnectedGmail(e.target.value)}
                placeholder="admin@gmail.com"
                className="w-full px-3.5 py-2.5 bg-white border border-[#D8B99A] rounded-md focus:border-[#9E4927] focus:outline-hidden"
              />
              <span className="text-[11px] text-[#4A2C22]/60 mt-1 block">
                You will sign into the admin portal using this Gmail.
              </span>
            </div>

            <div className="pt-2 border-t border-[#D8B99A]/40 space-y-3">
              <span className="font-bold text-[#4A2C22] block">Update Admin Password:</span>
              <div>
                <label className="block font-medium text-[#4A2C22] mb-1">
                  New Password (leave empty to keep current)
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D8B99A] rounded-md focus:border-[#9E4927] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block font-medium text-[#4A2C22] mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#D8B99A] rounded-md focus:border-[#9E4927] focus:outline-hidden"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={savingSecurity}
                className="px-5 py-2.5 text-xs font-semibold text-[#FAF5ED] bg-[#9E4927] hover:bg-[#82381B] rounded-md transition-colors"
              >
                {savingSecurity ? 'Updating Security...' : 'Save Connected Gmail & Password'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 6: AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <div className="bg-[#FAF5ED] border border-[#D8B99A] rounded-2xl overflow-hidden shadow-xs animate-in fade-in">
          <div className="p-4 border-b border-[#D8B99A]/50 flex items-center justify-between">
            <div>
              <h3 className="text-base font-serif font-bold text-[#4A2C22]">
                Immutable Security & Administrative Audit Trail
              </h3>
              <p className="text-[11px] text-[#4A2C22]/70">
                Log of all manual verifications, email dispatches, status changes, and logins.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-[#EBDCCD] text-[#82381B]">
              {auditLogs.length} Records
            </span>
          </div>

          {auditLoading ? (
            <div className="p-12 text-center text-xs text-[#4A2C22]/70">
              Loading audit logs...
            </div>
          ) : (
            <div className="divide-y divide-[#D8B99A]/30">
              {auditLogs.map((log) => (
                <div key={log.id} className="p-4 hover:bg-white/50 text-xs space-y-1 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#9E4927]">{log.action}</span>
                      <span className="px-1.5 py-0.2 rounded bg-stone-200 text-stone-800 text-[10px] uppercase">
                        {log.category}
                      </span>
                    </div>
                    <span className="text-[#4A2C22]/60 tabular-nums">
                      {new Date(log.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[#4A2C22]/85">{log.details}</p>
                  <div className="text-[10px] text-[#4A2C22]/50 font-mono">
                    Actor: {log.actorEmail} &middot; Role: {log.actorRole}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
