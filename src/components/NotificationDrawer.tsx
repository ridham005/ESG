import React from 'react';
import { useEcoSphere } from '../context/EcoSphereContext';
import { X, CheckCheck, Trash2, Bell, AlertTriangle, Award, CheckCircle, ShieldAlert, FileText } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { state, markNotificationAsRead, markAllNotificationsAsRead, clearNotifications } = useEcoSphere();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'ISSUE_OVERDUE':
      case 'ISSUE_RAISED':
        return <AlertTriangle size={18} color="var(--cb-semantic-down)" />;
      case 'BADGE_UNLOCKED':
        return <Award size={18} color="var(--cb-primary)" />;
      case 'CSR_APPROVED':
      case 'CHALLENGE_APPROVED':
        return <CheckCircle size={18} color="var(--cb-semantic-up)" />;
      case 'POLICY_REMINDER':
        return <ShieldAlert size={18} color="#b45309" />;
      default:
        return <FileText size={18} color="var(--cb-primary)" />;
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      backgroundColor: 'rgba(10, 11, 13, 0.4)',
      backdropFilter: 'blur(3px)',
      display: 'flex',
      justifyContent: 'flex-end'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '420px',
        height: '100%',
        backgroundColor: 'var(--cb-canvas)',
        boxShadow: '-8px 0 24px rgba(0, 0, 0, 0.15)',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--cb-hairline)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={20} color="var(--cb-primary)" />
            <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--cb-ink)' }}>
              Notifications
            </h3>
            <span className="cb-badge cb-badge-neutral cb-mono" style={{ fontSize: '11px' }}>
              {state.notifications.length}
            </span>
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--cb-muted)',
              display: 'flex',
              padding: '4px'
            }}
          >
            <X size={20} />
          </button>
        </div>

        <div style={{
          padding: '12px 24px',
          backgroundColor: 'var(--cb-surface-soft)',
          borderBottom: '1px solid var(--cb-hairline-soft)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <button
            onClick={markAllNotificationsAsRead}
            className="cb-btn cb-btn-outline cb-btn-sm"
            style={{ height: '28px', fontSize: '12px', padding: '0 10px' }}
          >
            <CheckCheck size={14} />
            <span>Mark all read</span>
          </button>

          <button
            onClick={clearNotifications}
            className="cb-btn cb-btn-outline cb-btn-sm"
            style={{ height: '28px', fontSize: '12px', padding: '0 10px', color: 'var(--cb-semantic-down)' }}
          >
            <Trash2 size={14} />
            <span>Clear list</span>
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
          {state.notifications.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--cb-muted)' }}>
              <Bell size={36} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
              <p style={{ fontWeight: 500 }}>No notifications right now.</p>
              <p style={{ fontSize: '13px', marginTop: '4px' }}>Compliance alerts, approvals, and badge unlocks will appear here.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {state.notifications.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => markNotificationAsRead(notif.id)}
                  style={{
                    padding: '14px 16px',
                    borderRadius: 'var(--cb-radius-md)',
                    border: '1px solid ' + (notif.read ? 'var(--cb-hairline)' : 'rgba(0, 82, 255, 0.3)'),
                    backgroundColor: notif.read ? 'var(--cb-canvas)' : 'rgba(0, 82, 255, 0.03)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ marginTop: '2px' }}>{getIcon(notif.type)}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '4px'
                      }}>
                        <span style={{
                          fontSize: '13px',
                          fontWeight: notif.read ? 600 : 700,
                          color: 'var(--cb-ink)'
                        }}>
                          {notif.title}
                        </span>
                        {!notif.read && (
                          <span style={{
                            width: '7px',
                            height: '7px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--cb-primary)'
                          }} />
                        )}
                      </div>
                      <p style={{ fontSize: '13px', color: 'var(--cb-body)', lineHeight: 1.4 }}>
                        {notif.message}
                      </p>
                      <div style={{ fontSize: '11px', color: 'var(--cb-muted)', marginTop: '6px' }} className="cb-mono">
                        {notif.createdAt}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
