import React from 'react';
import { useEcoSphere } from '../context/EcoSphereContext';
import { UserRole } from '../types/esg';
import { 
  Globe, 
  Bell, 
  Award, 
  Coins, 
  Sliders, 
  PlusCircle, 
  ShieldCheck, 
  BarChart3, 
  Users, 
  Flame, 
  FileText 
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

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backgroundColor: 'var(--cb-canvas)',
      borderBottom: '1px solid var(--cb-hairline)'
    }}>
      <div className="cb-container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '70px',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <div 
            onClick={() => setActiveTab('dashboard')}
            style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--cb-radius-full)',
              backgroundColor: 'var(--cb-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Globe size={20} />
            </div>
            <div>
              <div style={{
                fontFamily: 'var(--cb-font-sans)',
                fontSize: '20px',
                fontWeight: 700,
                letterSpacing: '-0.5px',
                color: 'var(--cb-ink)',
                lineHeight: 1.1
              }}>
                EcoSphere
              </div>
              <div style={{ fontSize: '10px', color: 'var(--cb-muted)', fontWeight: 600 }}>
                ESG PLATFORM
              </div>
            </div>
          </div>

          <nav style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {navItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
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
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={openERPSimulator}
            className="cb-btn cb-btn-secondary cb-btn-sm"
            title="Simulate Purchase/Fleet/Mfg ERP Carbon Transaction"
          >
            <PlusCircle size={15} color="var(--cb-primary)" />
            <span>Record ERP Data</span>
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'var(--cb-surface-strong)',
            padding: '4px 12px',
            borderRadius: 'var(--cb-radius-pill)',
            gap: '12px',
            fontSize: '13px',
            fontWeight: 600
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#b45309' }}>
              <Coins size={14} />
              <span className="cb-mono">{currentUser.points}</span>
              <span style={{ fontSize: '10px', color: 'var(--cb-muted)' }}>PTS</span>
            </div>
            <div style={{ width: '1px', height: '14px', backgroundColor: 'var(--cb-hairline)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--cb-primary)' }}>
              <Award size={14} />
              <span className="cb-mono">{currentUser.xp}</span>
              <span style={{ fontSize: '10px', color: 'var(--cb-muted)' }}>XP</span>
            </div>
          </div>

          <button
            onClick={openNotificationDrawer}
            style={{
              position: 'relative',
              width: '38px',
              height: '38px',
              borderRadius: 'var(--cb-radius-full)',
              border: '1px solid var(--cb-hairline)',
              backgroundColor: 'var(--cb-canvas)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'var(--cb-ink)'
            }}
            aria-label="Notifications"
          >
            <Bell size={17} />
            {unreadNotifs > 0 && (
              <span style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                backgroundColor: 'var(--cb-semantic-down)',
                color: '#ffffff',
                fontSize: '10px',
                fontWeight: 700,
                width: '18px',
                height: '18px',
                borderRadius: 'var(--cb-radius-full)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid var(--cb-canvas)'
              }}>
                {unreadNotifs}
              </span>
            )}
          </button>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '4px 8px 4px 6px',
            border: '1px solid var(--cb-hairline)',
            borderRadius: 'var(--cb-radius-pill)',
            backgroundColor: 'var(--cb-surface-soft)'
          }}>
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              style={{
                width: '26px',
                height: '26px',
                borderRadius: 'var(--cb-radius-full)',
                objectFit: 'cover'
              }}
            />
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--cb-ink)', lineHeight: 1.1 }}>
                {currentUser.name}
              </div>
            </div>
            
            <select
              value={currentUser.role}
              onChange={(e) => switchRole(e.target.value as UserRole)}
              style={{
                fontSize: '11px',
                fontWeight: 600,
                padding: '2px 4px',
                borderRadius: 'var(--cb-radius-pill)',
                border: '1px solid var(--cb-hairline)',
                backgroundColor: '#ffffff',
                cursor: 'pointer',
                color: 'var(--cb-primary)'
              }}
            >
              <option value="ADMIN">Role: Admin</option>
              <option value="AUDITOR">Role: Auditor</option>
              <option value="EMPLOYEE">Role: Employee</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};
