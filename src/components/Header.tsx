import React, { useState } from 'react';
import { useEcoSphere } from '../context/EcoSphereContext';
import { UserRole } from '../types/esg';
import { 
  Globe, 
  Smartphone, 
  Share2, 
  Cloud, 
  RefreshCw, 
  Bell, 
  Coins, 
  Award, 
  PlusCircle, 
  Sliders, 
  ShieldCheck, 
  BarChart3, 
  Users, 
  Flame, 
  FileText,
  Menu,
  X,
  Lock,
  LogOut,
  LogIn,
  KeyRound
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openNotificationDrawer: () => void;
  openERPSimulator: () => void;
  openLoginModal: () => void;
  openSyncModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  openNotificationDrawer,
  openERPSimulator,
  openLoginModal,
  openSyncModal
}) => {
  const { currentUser, switchRole, state, isAuthenticated, logout, cloudSyncStatus, forceCloudSync, peerDeviceCount } = useEcoSphere();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const unreadNotifs = state.notifications.filter(n => !n.read).length;

  const navItems = [
    { id: 'dashboard', label: 'Overview', icon: <BarChart3 size={16} /> },
    { id: 'environmental', label: 'Environmental', icon: <Flame size={16} /> },
    { id: 'social', label: 'Social & CSR', icon: <Users size={16} /> },
    { id: 'governance', label: 'Governance', icon: <ShieldCheck size={16} /> },
    { id: 'gamification', label: 'Gamification', icon: <Award size={16} /> },
    { id: 'reports', label: 'Reports', icon: <FileText size={16} /> },
    { id: 'settings', label: 'Settings', icon: <Sliders size={16} /> },
  ];

  const handleNavClick = (tabId: string) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="cb-header-root">
      <div className="cb-container">
        <div className="cb-header-inner">
          
          {/* Logo & Brand */}
          <div className="cb-header-left">
            <div 
              onClick={() => handleNavClick('dashboard')}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            >
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: 'var(--cb-radius-full)',
                backgroundColor: 'var(--cb-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                flexShrink: 0
              }}>
                <Globe size={18} />
              </div>
              <div>
                <div style={{
                  fontFamily: 'var(--cb-font-sans)',
                  fontSize: '17px',
                  fontWeight: 700,
                  letterSpacing: '-0.4px',
                  color: 'var(--cb-ink)',
                  lineHeight: 1.1
                }}>
                  EcoSphere
                </div>
                <div className="cb-desktop-only" style={{ fontSize: '9px', color: 'var(--cb-muted)', fontWeight: 600 }}>
                  ESG PLATFORM
                </div>
              </div>
            </div>

            {/* Desktop Nav Items */}
            <nav className="cb-desktop-nav">
              {navItems.map(item => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      padding: '7px 12px',
                      borderRadius: 'var(--cb-radius-pill)',
                      fontSize: '13px',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? 'var(--cb-primary)' : 'var(--cb-body)',
                      backgroundColor: isActive ? 'var(--cb-primary-subtle)' : 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all var(--cb-transition-fast)'
                    }}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Action Icons & Auth Controls */}
          <div className="cb-header-right">
            
            {/* Cloud Sync Status Indicator */}
            <button
              onClick={openSyncModal}
              className="cb-btn cb-btn-outline cb-btn-sm cb-desktop-only"
              style={{
                fontSize: '11px',
                height: '28px',
                padding: '0 10px',
                gap: '5px',
                borderColor: cloudSyncStatus === 'CONNECTED' ? 'rgba(5, 177, 105, 0.4)' : 'var(--cb-hairline)'
              }}
              title="Real-time multi-device cloud synchronization active (Click to force refresh)"
            >
              <Cloud size={13} color={cloudSyncStatus === 'CONNECTED' ? 'var(--cb-semantic-up)' : 'var(--cb-primary)'} />
              <span style={{ fontSize: '10px', fontWeight: 600, color: 'var(--cb-ink)' }}>
                {peerDeviceCount > 0 ? `📱 ${peerDeviceCount + 1} Devices Synced 🟢` : '📱 Sync Devices'}
              </span>
            </button>

            {/* Quick ERP button (Desktop) */}
            <button
              onClick={openERPSimulator}
              className="cb-btn cb-btn-secondary cb-btn-sm cb-desktop-only"
              title="Simulate Purchase/Fleet/Mfg ERP Carbon Transaction"
            >
              <PlusCircle size={14} color="var(--cb-primary)" />
              <span>Record ERP</span>
            </button>

            {/* Points & XP Counter */}
            <div className="cb-points-pill">
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: '#b45309' }}>
                <Coins size={12} />
                <span className="cb-mono">{currentUser.points}</span>
                <span className="cb-desktop-only" style={{ fontSize: '10px', color: 'var(--cb-muted)' }}>PTS</span>
              </div>
              <div style={{ width: '1px', height: '10px', backgroundColor: 'var(--cb-hairline)' }} />
              <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: 'var(--cb-primary)' }}>
                <Award size={12} />
                <span className="cb-mono">{currentUser.xp}</span>
                <span className="cb-desktop-only" style={{ fontSize: '10px', color: 'var(--cb-muted)' }}>XP</span>
              </div>
            </div>

            {/* Notification Bell */}
            <button
              onClick={openNotificationDrawer}
              className="cb-icon-btn"
              aria-label="Notifications"
            >
              <Bell size={15} />
              {unreadNotifs > 0 && (
                <span className="cb-unread-badge">
                  {unreadNotifs}
                </span>
              )}
            </button>

            {/* User Account / Role & Login Button */}
            <div className="cb-user-role-badge">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: 'var(--cb-radius-full)',
                  objectFit: 'cover'
                }}
              />
              <span className="cb-desktop-only" style={{ fontSize: '11px', fontWeight: 600, color: 'var(--cb-ink)' }}>
                {currentUser.name.split(' ')[0]} ({currentUser.role})
              </span>
              
              <button
                onClick={openLoginModal}
                className="cb-btn cb-btn-outline cb-btn-sm"
                style={{ height: '24px', padding: '0 8px', fontSize: '10px', borderRadius: 'var(--cb-radius-pill)' }}
                title="Switch Account / Authenticate Persona"
              >
                <KeyRound size={11} />
                <span>Auth</span>
              </button>
            </div>

            {/* Hamburger Button (Mobile) */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="cb-icon-btn cb-mobile-only"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu with Auth & Nav */}
        {mobileMenuOpen && (
          <div className="cb-mobile-menu">
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '8px 12px',
              backgroundColor: 'rgba(0, 82, 255, 0.05)',
              borderRadius: 'var(--cb-radius-md)',
              marginBottom: '10px',
              border: '1px solid rgba(0, 82, 255, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Cloud size={14} color="var(--cb-primary)" />
                <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--cb-ink)' }}>
                  Multi-Device Cloud Sync
                </span>
              </div>
              <button
                onClick={() => { setMobileMenuOpen(false); openSyncModal(); }}
                className="cb-btn cb-btn-outline cb-btn-sm"
                style={{ height: '24px', fontSize: '10px', padding: '0 8px' }}
              >
                <RefreshCw size={10} />
                <span>Sync Now</span>
              </button>
            </div>

            {/* Active Persona Card in Mobile Menu */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px',
              backgroundColor: 'var(--cb-surface-soft)',
              borderRadius: 'var(--cb-radius-lg)',
              marginBottom: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: 'var(--cb-radius-full)',
                    objectFit: 'cover'
                  }}
                />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--cb-ink)' }}>
                    {currentUser.name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--cb-muted)' }}>
                    Role: <strong>{currentUser.role}</strong>
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  openLoginModal();
                }}
                className="cb-btn cb-btn-primary cb-btn-sm"
                style={{ height: '28px', fontSize: '11px', padding: '0 10px' }}
              >
                <KeyRound size={12} />
                <span>Switch</span>
              </button>
            </div>

            {/* Nav Links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {navItems.map(item => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 14px',
                      borderRadius: 'var(--cb-radius-md)',
                      fontSize: '14px',
                      fontWeight: isActive ? 600 : 500,
                      color: isActive ? 'var(--cb-primary)' : 'var(--cb-ink)',
                      backgroundColor: isActive ? 'var(--cb-primary-subtle)' : 'transparent',
                      border: 'none',
                      textAlign: 'left',
                      cursor: 'pointer'
                    }}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })}

              <div style={{ paddingTop: '10px', marginTop: '6px', borderTop: '1px solid var(--cb-hairline)' }}>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openERPSimulator();
                  }}
                  className="cb-btn cb-btn-primary"
                  style={{ width: '100%' }}
                >
                  <PlusCircle size={15} />
                  <span>Record ERP Carbon</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
