import React, { useState } from 'react';
import { EcoSphereProvider } from './context/EcoSphereContext';
import { Header } from './components/Header';
import { NotificationDrawer } from './components/NotificationDrawer';
import { ERPSimulatorModal } from './components/Common/ERPSimulatorModal';
import { OverviewDashboard } from './components/Dashboard/OverviewDashboard';
import { EnvironmentalModule } from './components/Environmental/EnvironmentalModule';
import { SocialModule } from './components/Social/SocialModule';
import { GovernanceModule } from './components/Governance/GovernanceModule';
import { GamificationModule } from './components/Gamification/GamificationModule';
import { ReportsModule } from './components/Reports/ReportsModule';
import { SettingsModule } from './components/Settings/SettingsModule';
import { Globe } from 'lucide-react';

export const AppContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isERPSimulatorOpen, setIsERPSimulatorOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--cb-canvas)' }}>
      {/* Sticky Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openNotificationDrawer={() => setIsNotificationOpen(true)}
        openERPSimulator={() => setIsERPSimulatorOpen(true)}
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
        padding: '36px 0 24px',
        marginTop: 'auto'
      }}>
        <div className="cb-container">
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            marginBottom: '20px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                backgroundColor: 'var(--cb-primary)',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Globe size={15} />
              </div>
              <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--cb-ink)' }}>EcoSphere</span>
              <span style={{ fontSize: '12px', color: 'var(--cb-muted)', marginLeft: '6px' }}>
                • Enterprise ESG Management Platform
              </span>
            </div>

            <div style={{ display: 'flex', gap: '16px', fontSize: '13px', color: 'var(--cb-body)' }}>
              <span style={{ cursor: 'pointer' }} onClick={() => setActiveTab('environmental')}>Carbon Accounting</span>
              <span style={{ cursor: 'pointer' }} onClick={() => setActiveTab('social')}>Social & DEI</span>
              <span style={{ cursor: 'pointer' }} onClick={() => setActiveTab('governance')}>Audit Governance</span>
              <span style={{ cursor: 'pointer' }} onClick={() => setActiveTab('gamification')}>Gamification</span>
              <span style={{ cursor: 'pointer' }} onClick={() => setActiveTab('reports')}>Reports</span>
              <span style={{ cursor: 'pointer' }} onClick={() => setActiveTab('settings')}>Settings</span>
            </div>
          </div>

          <div style={{
            borderTop: '1px solid var(--cb-hairline-soft)',
            paddingTop: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px',
            color: 'var(--cb-muted)'
          }}>
            <div>
              © 2026 EcoSphere Inc. Adheres strictly to Coinbase Design Guidelines (#0052ff, pill buttons, 24px cards).
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
