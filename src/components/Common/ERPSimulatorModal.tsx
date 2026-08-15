import React, { useState } from 'react';
import { useEcoSphere } from '../../context/EcoSphereContext';
import { X, Flame, Sparkles, Check } from 'lucide-react';

interface ERPSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ERPSimulatorModal: React.FC<ERPSimulatorModalProps> = ({ isOpen, onClose }) => {
  const { state, addCarbonTransaction } = useEcoSphere();

  const [sourceType, setSourceType] = useState<'Purchase' | 'Manufacturing' | 'Expenses' | 'Fleet'>('Fleet');
  const [departmentId, setDepartmentId] = useState(state.master.departments[0]?.id || 'dept-1');
  const [emissionFactorId, setEmissionFactorId] = useState(state.master.emissionFactors[0]?.id || 'ef-1');
  const [quantity, setQuantity] = useState<number>(1200);
  const [notes, setNotes] = useState('');
  const [productProfileId, setProductProfileId] = useState('');
  const [resultEmissions, setResultEmissions] = useState<number | null>(null);

  if (!isOpen) return null;

  const selectedFactor = state.master.emissionFactors.find(f => f.id === emissionFactorId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = addCarbonTransaction({
      departmentId,
      sourceType,
      emissionFactorId,
      quantity,
      notes: notes || ('Simulated ERP ' + sourceType + ' entry'),
      productProfileId: productProfileId || undefined
    });

    setResultEmissions(res.emissions);
    setTimeout(() => {
      onClose();
      setResultEmissions(null);
    }, 1600);
  };

  return (
    <div className="cb-modal-overlay">
      <div className="cb-modal-content">
        <div style={{
          padding: '24px',
          borderBottom: '1px solid var(--cb-hairline)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--cb-radius-full)',
              backgroundColor: 'var(--cb-primary-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--cb-primary)'
            }}>
              <Flame size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--cb-ink)' }}>
                ERP Carbon Accounting Simulator
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--cb-muted)' }}>
                {state.config.autoEmissionCalc ? '⚡ Auto-Emission Calculation Active' : '⚠️ Manual Entry Mode'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--cb-muted)' }}
          >
            <X size={20} />
          </button>
        </div>

        {resultEmissions !== null ? (
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              backgroundColor: 'var(--cb-semantic-up-bg)',
              color: 'var(--cb-semantic-up)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <Check size={28} />
            </div>
            <h4 style={{ fontSize: '20px', fontWeight: 600, color: 'var(--cb-ink)', marginBottom: '8px' }}>
              Carbon Transaction Created!
            </h4>
            <p style={{ fontSize: '15px', color: 'var(--cb-body)' }}>
              Auto-calculated <span className="cb-mono" style={{ fontWeight: 700, color: 'var(--cb-primary)' }}>{resultEmissions.toLocaleString()} kg CO2e</span>
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--cb-ink)', display: 'block', marginBottom: '8px' }}>
                Operational Stream / Source
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                {(['Purchase', 'Manufacturing', 'Expenses', 'Fleet'] as const).map(stream => (
                  <button
                    type="button"
                    key={stream}
                    onClick={() => setSourceType(stream)}
                    style={{
                      padding: '10px 8px',
                      borderRadius: 'var(--cb-radius-md)',
                      border: '1px solid ' + (sourceType === stream ? 'var(--cb-primary)' : 'var(--cb-hairline)'),
                      backgroundColor: sourceType === stream ? 'var(--cb-primary-subtle)' : 'var(--cb-canvas)',
                      color: sourceType === stream ? 'var(--cb-primary)' : 'var(--cb-ink)',
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    {stream}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--cb-ink)', display: 'block', marginBottom: '6px' }}>
                Owning Department
              </label>
              <select
                value={departmentId}
                onChange={e => setDepartmentId(e.target.value)}
                className="cb-select"
              >
                {state.master.departments.map(d => (
                  <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--cb-ink)', display: 'block', marginBottom: '6px' }}>
                Linked Emission Factor
              </label>
              <select
                value={emissionFactorId}
                onChange={e => setEmissionFactorId(e.target.value)}
                className="cb-select"
              >
                {state.master.emissionFactors.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.name} — Scope {f.scope} ({f.factorValue} kg CO2e / {f.unit})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--cb-ink)', display: 'block', marginBottom: '6px' }}>
                Product ESG Profile (Optional)
              </label>
              <select
                value={productProfileId}
                onChange={e => setProductProfileId(e.target.value)}
                className="cb-select"
              >
                <option value="">-- General Operational Activity (No Product Link) --</option>
                {state.master.productProfiles.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.productName} ({p.productCode}) - Rating: {p.energyEfficiencyRating}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--cb-ink)', display: 'block', marginBottom: '6px' }}>
                Operational Quantity ({selectedFactor?.unit || 'units'})
              </label>
              <input
                type="number"
                value={quantity}
                onChange={e => setQuantity(Number(e.target.value))}
                className="cb-input cb-mono"
                min="1"
                required
              />
            </div>

            <div style={{
              padding: '14px 16px',
              borderRadius: 'var(--cb-radius-md)',
              backgroundColor: 'var(--cb-surface-soft)',
              border: '1px solid var(--cb-hairline)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--cb-body)' }}>Auto-Calculated Output:</span>
                <span className="cb-mono" style={{ fontSize: '18px', fontWeight: 700, color: 'var(--cb-primary)' }}>
                  {((quantity || 0) * (selectedFactor?.factorValue || 0)).toFixed(2)} kg CO2e
                </span>
              </div>
              <div style={{ fontSize: '11px', color: 'var(--cb-muted)', marginTop: '4px' }}>
                Formula: {quantity || 0} {selectedFactor?.unit} × {selectedFactor?.factorValue} kg CO2e / unit (Scope {selectedFactor?.scope})
              </div>
            </div>

            <div>
              <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--cb-ink)', display: 'block', marginBottom: '6px' }}>
                Reference Note / ERP Invoice #
              </label>
              <input
                type="text"
                placeholder="e.g. Fuel delivery invoice #FLT-9921"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="cb-input"
              />
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '12px' }}>
              <button
                type="button"
                onClick={onClose}
                className="cb-btn cb-btn-outline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="cb-btn cb-btn-primary"
              >
                <Sparkles size={16} />
                <span>Process & Log Transaction</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
