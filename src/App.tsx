import React, { useState } from 'react';
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
import { Globe, ShieldCheck } from 'lucide-react';

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
    <EcoSphereProvider>
      <AppContent />
    </EcoSphereProvider>
  );
}
