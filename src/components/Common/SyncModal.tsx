import React, { useState } from 'react';
import { useEcoSphere } from '../../context/EcoSphereContext';
import { syncEngine } from '../../utils/syncUtils';
import { 
  Smartphone, 
  Laptop, 
  Copy, 
  Check, 
  Download, 
  Upload, 
  Share2, 
  Sparkles, 
  Globe, 
  RefreshCw,
  X
} from 'lucide-react';

interface SyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SyncModal: React.FC<SyncModalProps> = ({ isOpen, onClose }) => {
  const { state, resetToSeedData } = useEcoSphere();
  const [copied, setCopied] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  if (!isOpen) return null;

  const shareLink = syncEngine.generateShareableLink(state);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportJson = () => {
    syncEngine.exportStateToJsonFile(state);
  };

  const handleImportJson = () => {
    try {
      const parsed = JSON.parse(importJsonText);
      if (parsed && parsed.transactions && parsed.master) {
        localStorage.setItem('ecosphere_esg_platform_state_v3', JSON.stringify(parsed));
        setImportStatus('✅ Successfully imported! Reloading platform...');
        setTimeout(() => {
          window.location.reload();
        }, 1200);
      } else {
        setImportStatus('❌ Invalid EcoSphere JSON structure.');
      }
    } catch (err) {
      setImportStatus('❌ JSON syntax error. Please paste valid JSON.');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (parsed && parsed.transactions && parsed.master) {
          localStorage.setItem('ecosphere_esg_platform_state_v3', JSON.stringify(parsed));
          setImportStatus('✅ File loaded successfully! Reloading platform...');
          setTimeout(() => {
            window.location.reload();
          }, 1200);
        } else {
          setImportStatus('❌ Invalid EcoSphere JSON backup file.');
        }
      } catch (err) {
        setImportStatus('❌ Could not parse uploaded JSON file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="cb-modal-overlay">
      <div className="cb-modal-content" style={{ maxWidth: '560px' }}>
        
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--cb-hairline)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'var(--cb-surface-soft)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--cb-radius-full)',
              backgroundColor: 'var(--cb-primary)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Share2 size={18} />
            </div>
            <div>
              <h3 className="cb-title-md" style={{ color: 'var(--cb-ink)' }}>Multi-Device State Sync</h3>
              <p className="cb-body-sm">Transfer your custom challenges, ERP logs & data to any phone or computer</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--cb-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Option 1: 1-Click Shareable Link */}
          <div style={{
            padding: '16px',
            borderRadius: 'var(--cb-radius-lg)',
            border: '1px solid var(--cb-primary)',
            backgroundColor: 'var(--cb-primary-subtle)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Smartphone size={18} color="var(--cb-primary)" />
              <strong style={{ fontSize: '14px', color: 'var(--cb-ink)' }}>Option 1: 1-Click Multi-Device Link</strong>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--cb-body)', marginBottom: '12px', lineHeight: 1.4 }}>
              Copy this link and open it in your phone browser. It will automatically load all your current challenges, ERP logs, and settings!
            </p>

            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                readOnly
                value={shareLink.slice(0, 55) + '...'}
                className="cb-input cb-mono"
                style={{ fontSize: '11px', height: '36px', backgroundColor: '#ffffff' }}
              />
              <button
                onClick={handleCopyLink}
                className="cb-btn cb-btn-primary cb-btn-sm"
                style={{ height: '36px', padding: '0 16px' }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          {/* Option 2: JSON Backup Export & Import */}
          <div style={{
            padding: '16px',
            borderRadius: 'var(--cb-radius-lg)',
            border: '1px solid var(--cb-hairline)',
            backgroundColor: 'var(--cb-surface-soft)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Download size={18} color="var(--cb-ink)" />
              <strong style={{ fontSize: '14px', color: 'var(--cb-ink)' }}>Option 2: Export / Import JSON Backup</strong>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--cb-muted)', marginBottom: '12px' }}>
              Download your complete database file or upload a backup from another computer.
            </p>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <button
                onClick={handleExportJson}
                className="cb-btn cb-btn-outline cb-btn-sm"
                style={{ flex: 1, height: '36px', fontSize: '12px' }}
              >
                <Download size={14} />
                <span>Export State (.json)</span>
              </button>

              <label className="cb-btn cb-btn-secondary cb-btn-sm" style={{ flex: 1, height: '36px', fontSize: '12px', cursor: 'pointer' }}>
                <Upload size={14} />
                <span>Import File (.json)</span>
                <input
                  type="file"
                  accept=".json,application/json"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                />
              </label>
            </div>

            {importStatus && (
              <div style={{
                marginTop: '12px',
                padding: '8px 12px',
                borderRadius: 'var(--cb-radius-md)',
                backgroundColor: '#ffffff',
                border: '1px solid var(--cb-hairline)',
                fontSize: '12px',
                fontWeight: 600,
                color: importStatus.startsWith('✅') ? 'var(--cb-semantic-up)' : 'var(--cb-semantic-down)'
              }}>
                {importStatus}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
