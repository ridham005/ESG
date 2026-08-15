import React, { useState } from 'react';
import { useEcoSphere } from '../context/EcoSphereContext';
import { UserRole } from '../types/esg';
import { 
  Globe, 
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
  UserCheck
} from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  openNotificationDrawer: () => void;
  openERPSimulator: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  openNotificationDrawer,
  openERPSimulator
}) => {
  const { currentUser, switchRole, state } = useEcoSphere();
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

          {/* Right Action Icons & Role Switcher */}
          <div className="cb-header-right">
            
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

            {/* Desktop Role Selector */}
            <div className="cb-user-role-badge cb-desktop-only">
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
              <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--cb-ink)' }}>
                {currentUser.name.split(' ')[0]}
              </span>
              <select
                value={currentUser.role}
                onChange={(e) => switchRole(e.target.value as UserRole)}
                className="cb-role-select"
              >
                <option value="ADMIN">Role: Admin</option>
                <option value="AUDITOR">Role: Auditor</option>
                <option value="EMPLOYEE">Role: Employee</option>
              </select>
            </div>

            {/* Mobile Persona Avatar / Role Trigger */}
            <div className="cb-mobile-only" style={{ display: 'flex', alignItems: 'center' }}>
              <select
                value={currentUser.role}
                onChange={(e) => switchRole(e.target.value as UserRole)}
                className="cb-role-select"
                style={{ fontSize: '10px', padding: '3px 4px', maxWidth: '75px' }}
              >
                <option value="ADMIN">Admin</option>
                <option value="AUDITOR">Auditor</option>
                <option value="EMPLOYEE">Employee</option>
              </select>
            </div>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="cb-icon-btn cb-mobile-only"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X size={17} /> : <Menu size={17} />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu with Full Role Switcher & ERP Action */}
        {mobileMenuOpen && (
          <div className="cb-mobile-menu">
            {/* Active User Card in Mobile Menu */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
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
                    Active Persona • {currentUser.role}
                  </div>
                </div>
              </div>

              <select
                value={currentUser.role}
                onChange={(e) => switchRole(e.target.value as UserRole)}
                className="cb-role-select"
                style={{ padding: '4px 8px', fontSize: '12px' }}
              >
                <option value="ADMIN">Admin (Director)</option>
                <option value="AUDITOR">Auditor</option>
                <option value="EMPLOYEE">Employee</option>
              </select>
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
                  <span>Record ERP Carbon Transaction</span>
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </header>
  );
};
