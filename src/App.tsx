import React, { useState, Component, ErrorInfo, ReactNode } from 'react';
import { EcoSphereProvider } from './context/EcoSphereContext';
import { Header } from './components/Header';
import { NotificationDrawer } from './components/NotificationDrawer';
import { ERPSimulatorModal } from './components/Common/ERPSimulatorModal';
import { LoginModal } from './components/Auth/LoginModal';
import { OverviewDashboard } from './components/Dashboard/OverviewDashboard';
import { EnvironmentalModule } from './components/Environmental/EnvironmentalModule';
import { SocialModule } from './components/Social/SocialModule';
import { GovernanceModule } from './components/Governance/GovernanceModule';
import { GamificationModule } from './components/Gamification/GamificationModule';
import { ReportsModule } from './components/Reports/ReportsModule';
import { SettingsModule } from './components/Settings/SettingsModule';
import { Globe, ShieldCheck, RefreshCw, AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[EcoSphere Global Guard] Caught UI Exception:', error, errorInfo);
  }

  handleReset = () => {
    try {
      localStorage.clear();
    } catch(e) {}
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0a0b0d',
          color: '#ffffff',
          padding: '24px',
          fontFamily: 'Inter, sans-serif'
        }}>
          <div style={{
            maxWidth: '460px',
            width: '100%',
            backgroundColor: '#16181c',
            border: '1px solid #282c34',
            borderRadius: '24px',
            padding: '32px',
            textAlign: 'center'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: 'rgba(0, 82, 255, 0.2)',
              color: '#0052ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <Globe size={26} />
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>
              EcoSphere Recovery Guard
            </h2>
            <p style={{ fontSize: '14px', color: '#9ca3af', marginBottom: '24px', lineHeight: 1.5 }}>
              The application encountered a transient state exception and safely prevented unauthorized data access.
            </p>

            <button
              onClick={this.handleReset}
              style={{
                width: '100%',
                height: '46px',
                borderRadius: '9999px',
                backgroundColor: '#0052ff',
                color: '#ffffff',
                border: 'none',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              <RefreshCw size={16} />
              <span>Reload EcoSphere Platform</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isERPSimulatorOpen, setIsERPSimulatorOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--cb-canvas)' }}>
      {/* Sticky Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openNotificationDrawer={() => setIsNotificationOpen(true)}
        openERPSimulator={() => setIsERPSimulatorOpen(true)}
        openLoginModal={() => setIsLoginModalOpen(true)}
      />

      {/* Main Views */}
      <main style={{ flex: 1 }}>
        {activeTab === 'dashboard' && (
          <OverviewDashboard
            onNavigate={(tab) => setActiveTab(tab)}
            openERPSimulator={() => setIsERPSimulatorOpen(true)}
          />
        )}
        {activeTab === 'environmental' && (
          <EnvironmentalModule
            openERPSimulator={() => setIsERPSimulatorOpen(true)}
          />
        )}
        {activeTab === 'social' && <SocialModule />}
        {activeTab === 'governance' && <GovernanceModule />}
        {activeTab === 'gamification' && <GamificationModule />}
        {activeTab === 'reports' && <ReportsModule />}
        {activeTab === 'settings' && <SettingsModule />}
      </main>

      {/* Coinbase Institutional Footer */}
      <footer style={{
        borderTop: '1px solid var(--cb-hairline)',
        backgroundColor: 'var(--cb-surface-soft)',
        padding: '32px 0 24px',
        marginTop: 'auto'
      }}>
        <div className="cb-container">
          <div className="cb-footer-top">
            <div className="cb-footer-brand">
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: 'var(--cb-primary)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Globe size={15} />
              </div>
              <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--cb-ink)' }}>EcoSphere</span>
              <span style={{ fontSize: '12px', color: 'var(--cb-muted)', marginLeft: '4px' }}>
                • Institutional ESG Platform
              </span>
            </div>

            <div className="cb-footer-links">
              <span onClick={() => setActiveTab('environmental')}>Carbon Accounting</span>
              <span onClick={() => setActiveTab('social')}>Social & DEI</span>
              <span onClick={() => setActiveTab('governance')}>Audit Governance</span>
              <span onClick={() => setActiveTab('gamification')}>Gamification</span>
              <span onClick={() => setActiveTab('reports')}>Reports</span>
              <span onClick={() => setActiveTab('settings')}>Settings</span>
            </div>
          </div>

          <div className="cb-footer-bottom">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={14} color="var(--cb-primary)" />
              <span>© 2026 EcoSphere Inc. Enterprise Security & Rate Limiting Protected.</span>
            </div>
            <div className="cb-mono" style={{ fontSize: '11px' }}>
              GHG PROTOCOL • ISO 14001 • SBTi ALIGNED
            </div>
          </div>
        </div>
      </footer>

      {/* Notification Drawer */}
      <NotificationDrawer
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
      />

      {/* ERP Simulator Modal */}
      <ERPSimulatorModal
        isOpen={isERPSimulatorOpen}
        onClose={() => setIsERPSimulatorOpen(false)}
      />

      {/* Login / Auth Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <EcoSphereProvider>
        <AppContent />
      </EcoSphereProvider>
    </ErrorBoundary>
  );
}
