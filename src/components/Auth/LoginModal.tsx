import React, { useState } from 'react';
import { useEcoSphere } from '../../context/EcoSphereContext';
import { 
  Globe, 
  Lock, 
  Mail, 
  ShieldCheck, 
  AlertCircle, 
  ArrowRight,
  Clock,
  Sparkles,
  CheckCircle
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login, state, isAuthenticated, currentUser, logout } = useEcoSphere();
  
  const [email, setEmail] = useState('admin@ecosphere.com');
  const [password, setPassword] = useState('Admin@2026!');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [lockoutSec, setLockoutSec] = useState<number | null>(null);

  if (!isOpen && isAuthenticated) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLockoutSec(null);

    const res = login(email, password);
    if (res.success) {
      onClose();
    } else {
      setErrorMsg(res.error || 'Invalid credentials.');
      if (res.retryAfter) {
        setLockoutSec(res.retryAfter);
      }
    }
  };

  const handleQuickSelect = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setErrorMsg(null);
  };

  return (
    <div className="cb-modal-overlay">
      <div className="cb-modal-content" style={{ maxWidth: '440px' }}>
        
        {/* Header */}
        <div style={{
          padding: '24px',
          borderBottom: '1px solid var(--cb-hairline)',
          textAlign: 'center',
          backgroundColor: 'var(--cb-surface-soft)'
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: 'var(--cb-radius-full)',
            backgroundColor: 'var(--cb-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            margin: '0 auto 12px'
          }}>
            <Globe size={24} />
          </div>
          <h2 className="cb-title-lg" style={{ color: 'var(--cb-ink)', marginBottom: '4px' }}>
            EcoSphere Authentication
          </h2>
          <p className="cb-body-sm">
            Role-Based Access Control & Rate-Limited Session Security
          </p>
        </div>

        {/* Form Body */}
        <div style={{ padding: '24px' }}>
          
          {errorMsg && (
            <div style={{
              padding: '12px 14px',
              borderRadius: 'var(--cb-radius-md)',
              backgroundColor: 'var(--cb-semantic-down-bg)',
              border: '1px solid var(--cb-semantic-down)',
              color: 'var(--cb-semantic-down)',
              fontSize: '13px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '16px'
            }}>
              {lockoutSec ? <Clock size={16} /> : <AlertCircle size={16} />}
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--cb-muted)', display: 'block', marginBottom: '6px' }}>
                ENTERPRISE EMAIL ADDRESS
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="name@ecosphere.com"
                  className="cb-input"
                  style={{ paddingLeft: '36px' }}
                  required
                />
                <Mail size={16} color="var(--cb-muted)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              </div>
            </div>

            <div>
              <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--cb-muted)', display: 'block', marginBottom: '6px' }}>
                PASSWORD
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="cb-input cb-mono"
                  style={{ paddingLeft: '36px' }}
                  required
                />
                <Lock size={16} color="var(--cb-muted)" style={{ position: 'absolute', left: '12px', top: '13px' }} />
              </div>
            </div>

            <button
              type="submit"
              disabled={lockoutSec !== null && lockoutSec > 0}
              className="cb-btn cb-btn-primary"
              style={{ width: '100%', height: '44px', marginTop: '6px' }}
            >
              <ShieldCheck size={16} />
              <span>Authenticate Session</span>
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--cb-hairline)' }}>
            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--cb-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>
              Select Demo Role Persona:
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <button
                type="button"
                onClick={() => handleQuickSelect('admin@ecosphere.com', 'Admin@2026!')}
                className="cb-btn cb-btn-outline cb-btn-sm"
                style={{ justifyContent: 'space-between', width: '100%', height: '34px', fontSize: '12px' }}
              >
                <span>👑 <strong>Elena Vance</strong> (Admin / Director)</span>
                <span className="cb-mono" style={{ color: 'var(--cb-muted)', fontSize: '10px' }}>Full Control</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickSelect('auditor@ecosphere.com', 'Auditor@2026!')}
                className="cb-btn cb-btn-outline cb-btn-sm"
                style={{ justifyContent: 'space-between', width: '100%', height: '34px', fontSize: '12px' }}
              >
                <span>🔍 <strong>Marcus Sterling</strong> (Auditor)</span>
                <span className="cb-mono" style={{ color: 'var(--cb-muted)', fontSize: '10px' }}>Compliance Only</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickSelect('employee@ecosphere.com', 'Employee@2026!')}
                className="cb-btn cb-btn-outline cb-btn-sm"
                style={{ justifyContent: 'space-between', width: '100%', height: '34px', fontSize: '12px' }}
              >
                <span>🌱 <strong>Samantha Hayes</strong> (Employee)</span>
                <span className="cb-mono" style={{ color: 'var(--cb-muted)', fontSize: '10px' }}>CSR & Rewards</span>
              </button>
            </div>
          </div>

          {isAuthenticated && (
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <button
                type="button"
                onClick={onClose}
                className="cb-btn cb-btn-secondary cb-btn-sm"
                style={{ width: '100%' }}
              >
                Continue as {currentUser.name}
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
