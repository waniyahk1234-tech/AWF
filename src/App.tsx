import React, { useState, useEffect } from 'react';
import { Program, AdminUserSession } from './types/index.ts';
import { apiClient } from './api/client.ts';
import { Navbar } from './components/Navbar.tsx';
import { MobileBottomNav } from './components/MobileBottomNav.tsx';
import { Footer } from './components/Footer.tsx';
import { HomePage } from './pages/HomePage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { GetHelpPage } from './pages/GetHelpPage.tsx';
import { DonatePage } from './pages/DonatePage.tsx';
import { TransparencyPage } from './pages/TransparencyPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';
import { PoliciesPage } from './pages/PoliciesPage.tsx';
import { AdminDashboard } from './pages/AdminDashboard.tsx';

export default function App() {
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [routeParams, setRouteParams] = useState<any>({});
  const [programs, setPrograms] = useState<Program[]>([]);
  const [programsLoading, setProgramsLoading] = useState<boolean>(true);
  const [adminSession, setAdminSession] = useState<AdminUserSession | null>(null);

  // Load programs from server API
  const fetchPrograms = async () => {
    try {
      setProgramsLoading(true);
      const list = await apiClient.getPrograms();
      setPrograms(list);
    } catch (err) {
      console.error('Failed to load programs:', err);
    } finally {
      setProgramsLoading(false);
    }
  };

  // Check admin session on mount
  useEffect(() => {
    fetchPrograms();
    apiClient
      .adminGetMe()
      .then((user) => {
        if (user) setAdminSession(user);
      })
      .catch(() => {});
  }, []);

  const handleNavigate = (route: string, extra?: any) => {
    setCurrentRoute(route);
    setRouteParams(extra || {});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminLoginSuccess = (user: AdminUserSession) => {
    setAdminSession(user);
  };

  const handleAdminLogout = async () => {
    await apiClient.adminLogout();
    setAdminSession(null);
    setCurrentRoute('home');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF5ED] text-[#4A2C22] selection:bg-[#D8B99A]/40 selection:text-[#4A2C22]">
      {/* Top Navigation Bar */}
      <Navbar
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
        isAdminLoggedIn={!!adminSession}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-20 lg:pb-0">
        {currentRoute === 'home' && (
          <HomePage programs={programs} onNavigate={handleNavigate} />
        )}

        {currentRoute === 'about' && (
          <AboutPage onNavigate={handleNavigate} />
        )}

        {currentRoute === 'get-help' && (
          <GetHelpPage
            programs={programs}
            initialCategory={routeParams?.selectedCategory || 'Education'}
            onNavigate={handleNavigate}
            onRefreshPrograms={fetchPrograms}
          />
        )}

        {currentRoute === 'donate' && (
          <DonatePage
            defaultCategory={routeParams?.defaultCategory || 'Education'}
            onNavigate={handleNavigate}
          />
        )}

        {currentRoute === 'transparency' && (
          <TransparencyPage onNavigate={handleNavigate} />
        )}

        {currentRoute === 'contact' && (
          <ContactPage onNavigate={handleNavigate} />
        )}

        {currentRoute === 'policies' && (
          <PoliciesPage />
        )}

        {currentRoute === 'admin' && (
          <AdminDashboard
            currentSession={adminSession}
            onLoginSuccess={handleAdminLoginSuccess}
            onLogout={handleAdminLogout}
            onRefreshPrograms={fetchPrograms}
          />
        )}
      </main>

      {/* Official Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Mobile-First Bottom Navigation Bar */}
      <MobileBottomNav
        currentRoute={currentRoute}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
