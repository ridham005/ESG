import React, { useState, useEffect } from 'react';
import { useEcoSphere } from '../../context/EcoSphereContext';
import { 
  Sliders, 
  ToggleLeft, 
  ToggleRight, 
  Building2, 
  FolderTree, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Check, 
  Sparkles,
  RefreshCw,
  Scale
} from 'lucide-react';

export const SettingsModule: React.FC = () => {
  const { 
    state, 
    updateConfig, 
    updateWeights, 
    addDepartment, 
    deleteDepartment,
    addCategory,
    deleteCategory,
    resetToSeedData
  } = useEcoSphere();

  const [envWeight, setEnvWeight] = useState(state.config.weights.env);
  const [socWeight, setSocWeight] = useState(state.config.weights.soc);
  const [govWeight, setGovWeight] = useState(state.config.weights.gov);
  const [autoBalance, setAutoBalance] = useState(true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    setEnvWeight(state.config.weights.env);
    setSocWeight(state.config.weights.soc);
    setGovWeight(state.config.weights.gov);
  }, [state.config.weights]);

  // Modal States
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);

  // Form states
  const [deptName, setDeptName] = useState('');
  const [deptCode, setDeptCode] = useState('');
  const [deptHead, setDeptHead] = useState('');
  const [deptCount, setDeptCount] = useState(100);

  const [catName, setCatName] = useState('');
  const [catType, setCatType] = useState<'CSR Activity' | 'Challenge' | 'Emission Factor'>('CSR Activity');

  const weightSum = envWeight + socWeight + govWeight;

  const handleEnvChange = (val: number) => {
    if (autoBalance) {
      const remaining = 100 - val;
      const currentOther = (socWeight + govWeight) || 1;
      const newSoc = Math.round((socWeight / currentOther) * remaining);
      const newGov = remaining - newSoc;
      setEnvWeight(val);
      setSocWeight(newSoc);
      setGovWeight(newGov);
    } else {
      setEnvWeight(val);
    }
  };

  const handleSocChange = (val: number) => {
    if (autoBalance) {
      const remaining = 100 - val;
      const currentOther = (envWeight + govWeight) || 1;
      const newEnv = Math.round((envWeight / currentOther) * remaining);
      const newGov = remaining - newEnv;
      setSocWeight(val);
      setEnvWeight(newEnv);
      setGovWeight(newGov);
    } else {
      setSocWeight(val);
    }
  };

  const handleGovChange = (val: number) => {
    if (autoBalance) {
      const remaining = 100 - val;
      const currentOther = (envWeight + socWeight) || 1;
      const newEnv = Math.round((envWeight / currentOther) * remaining);
      const newSoc = remaining - newEnv;
      setGovWeight(val);
      setEnvWeight(newEnv);
      setSocWeight(newSoc);
    } else {
      setGovWeight(val);
    }
  };

  const normalizeTo100 = () => {
    const total = (envWeight + socWeight + govWeight) || 100;
    const nEnv = Math.round((envWeight / total) * 100);
    const nSoc = Math.round((socWeight / total) * 100);
    const nGov = 100 - nEnv - nSoc;
    setEnvWeight(nEnv);
    setSocWeight(nSoc);
    setGovWeight(nGov);
  };

  const applyPreset = (e: number, s: number, g: number) => {
    setEnvWeight(e);
    setSocWeight(s);
    setGovWeight(g);
    updateWeights({ env: e, soc: s, gov: g });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleSaveWeights = () => {
    let finalEnv = envWeight;
    let finalSoc = socWeight;
    let finalGov = govWeight;

    if (weightSum !== 100) {
      const total = weightSum || 100;
      finalEnv = Math.round((envWeight / total) * 100);
      finalSoc = Math.round((socWeight / total) * 100);
      finalGov = 100 - finalEnv - finalSoc;
      setEnvWeight(finalEnv);
      setSocWeight(finalSoc);
      setGovWeight(finalGov);
    }

    updateWeights({ env: finalEnv, soc: finalSoc, gov: finalGov });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleCreateDept = (e: React.FormEvent) => {
    e.preventDefault();
    addDepartment({
      name: deptName,
      code: deptCode,
      head: deptHead,
      employeeCount: deptCount,
      status: 'Active'
    });
    setIsDeptModalOpen(false);
    setDeptName('');
    setDeptCode('');
  };

  const handleCreateCat = (e: React.FormEvent) => {
    e.preventDefault();
    addCategory({
      name: catName,
      type: catType,
      status: 'Active'
    });
    setIsCatModalOpen(false);
    setCatName('');
  };

  return (
    <div style={{ padding: '24px 0 60px' }}>
      <div className="cb-container">
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="cb-badge cb-badge-primary">MODULE 06</span>
              <span className="cb-caption" style={{ color: 'var(--cb-muted)' }}>CONFIGURATION & BUSINESS RULES</span>
            </div>
            <h1 className="cb-display-lg" style={{ color: 'var(--cb-ink)' }}>Settings & Administration</h1>
            <p className="cb-body-md">Configure core business logic rules, scoring weighting coefficients, and master organizational data.</p>
          </div>

          <button
            onClick={resetToSeedData}
            className="cb-btn cb-btn-outline"
            style={{ color: 'var(--cb-semantic-down)', borderColor: 'var(--cb-hairline)' }}
          >
            <RotateCcw size={15} />
            <span>Reset Demo Data</span>
          </button>
        </div>

        <div className="cb-grid-2" style={{ marginBottom: '28px' }}>
          
          {/* 1. Core Business Rules Configuration */}
          <div className="cb-card">
            <h3 className="cb-title-md" style={{ marginBottom: '6px' }}>Core Business Logic Rules</h3>
            <p className="cb-body-sm" style={{ marginBottom: '20px' }}>
              Enforce system-wide calculation automation, evidence guardrails, and instant unlocks
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Toggle 1: Auto Emission Calc */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '14px', backgroundColor: 'var(--cb-surface-soft)', borderRadius: 'var(--cb-radius-lg)' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--cb-ink)' }}>
                    Auto Emission Calculation
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--cb-muted)', marginTop: '2px' }}>
                    Automatically computes Carbon Transactions from linked Purchase/Mfg/Fleet ERP records using active Emission Factors.
                  </div>
                </div>
                <button
                  onClick={() => updateConfig({ autoEmissionCalc: !state.config.autoEmissionCalc })}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: state.config.autoEmissionCalc ? 'var(--cb-primary)' : 'var(--cb-muted)' }}
                >
                  {state.config.autoEmissionCalc ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                </button>
              </div>

              {/* Toggle 2: Evidence Requirement */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '14px', backgroundColor: 'var(--cb-surface-soft)', borderRadius: 'var(--cb-radius-lg)' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--cb-ink)' }}>
                    Evidence Requirement Guard
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--cb-muted)', marginTop: '2px' }}>
                    When enabled, CSR Activity participation cannot be marked Approved without an attached proof file.
                  </div>
                </div>
                <button
                  onClick={() => updateConfig({ evidenceRequired: !state.config.evidenceRequired })}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: state.config.evidenceRequired ? 'var(--cb-primary)' : 'var(--cb-muted)' }}
                >
                  {state.config.evidenceRequired ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                </button>
              </div>

              {/* Toggle 3: Badge Auto-Award */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '14px', backgroundColor: 'var(--cb-surface-soft)', borderRadius: 'var(--cb-radius-lg)' }}>
                <div>
                  <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--cb-ink)' }}>
                    Badge Auto-Award Engine
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--cb-muted)', marginTop: '2px' }}>
                    Instantly assigns badges to employees the moment their XP, challenge count, or policy signatures meet the Unlock Rule.
                  </div>
                </div>
                <button
                  onClick={() => updateConfig({ badgeAutoAward: !state.config.badgeAutoAward })}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: state.config.badgeAutoAward ? 'var(--cb-primary)' : 'var(--cb-muted)' }}
                >
                  {state.config.badgeAutoAward ? <ToggleRight size={32} /> : <ToggleLeft size={32} />}
                </button>
              </div>
            </div>
          </div>

          {/* 2. Configurable ESG Scoring Weights */}
          <div className="cb-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', flexWrap: 'wrap', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Scale size={18} color="var(--cb-primary)" />
                <h3 className="cb-title-md">Configurable ESG Weightings</h3>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => setAutoBalance(!autoBalance)}
                  className="cb-btn cb-btn-outline cb-btn-sm"
                  style={{ height: '26px', fontSize: '11px', padding: '0 8px' }}
                  title="Auto-rebalance sliders to always total 100%"
                >
                  <RefreshCw size={11} />
                  <span>{autoBalance ? 'Auto-Balance ON' : 'Manual'}</span>
                </button>
                <span className={'cb-badge cb-mono ' + (weightSum === 100 ? 'cb-badge-up' : 'cb-badge-warning')}>
                  Sum: {weightSum}%
                </span>
              </div>
            </div>

            <p className="cb-body-sm" style={{ marginBottom: '16px' }}>
              Organizational weights must total <strong>100%</strong> to ensure synchronized composite scoring.
            </p>

            {/* Presets */}
            <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '16px' }}>
              <button
                onClick={() => applyPreset(40, 30, 30)}
                className="cb-btn cb-btn-secondary cb-btn-sm"
                style={{ fontSize: '11px', height: '26px', padding: '0 8px' }}
              >
                Standard (40/30/30)
              </button>
              <button
                onClick={() => applyPreset(60, 20, 20)}
                className="cb-btn cb-btn-secondary cb-btn-sm"
                style={{ fontSize: '11px', height: '26px', padding: '0 8px' }}
              >
                Climate Focus (60/20/20)
              </button>
              <button
                onClick={() => applyPreset(25, 50, 25)}
                className="cb-btn cb-btn-secondary cb-btn-sm"
                style={{ fontSize: '11px', height: '26px', padding: '0 8px' }}
              >
                Social/DEI (25/50/25)
              </button>
              <button
                onClick={() => applyPreset(25, 25, 50)}
                className="cb-btn cb-btn-secondary cb-btn-sm"
                style={{ fontSize: '11px', height: '26px', padding: '0 8px' }}
              >
                Governance (25/25/50)
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--cb-semantic-up)' }}>Environmental Weight</span>
                  <span className="cb-mono" style={{ fontWeight: 700 }}>{envWeight}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="90"
                  value={envWeight}
                  onChange={e => handleEnvChange(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--cb-semantic-up)', cursor: 'pointer' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--cb-primary)' }}>Social Weight</span>
                  <span className="cb-mono" style={{ fontWeight: 700 }}>{socWeight}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="90"
                  value={socWeight}
                  onChange={e => handleSocChange(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--cb-primary)', cursor: 'pointer' }}
                />
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 600, color: '#d97706' }}>Governance Weight</span>
                  <span className="cb-mono" style={{ fontWeight: 700 }}>{govWeight}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="90"
                  value={govWeight}
                  onChange={e => handleGovChange(Number(e.target.value))}
                  style={{ width: '100%', accentColor: '#d97706', cursor: 'pointer' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                {weightSum !== 100 && (
                  <button
                    onClick={normalizeTo100}
                    className="cb-btn cb-btn-outline"
                    style={{ flex: 1 }}
                  >
                    <span>Normalize to 100%</span>
                  </button>
                )}
                
                <button
                  onClick={handleSaveWeights}
                  className="cb-btn cb-btn-primary"
                  style={{ flex: 2 }}
                >
                  {savedSuccess ? <Check size={16} /> : <Sparkles size={16} />}
                  <span>{savedSuccess ? 'Weights Saved & Recomputed!' : 'Save & Recompute Composite ESG Scores'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Master Data Configuration */}
        <div className="cb-grid-2">
          
          {/* Departments Master */}
          <div className="cb-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 className="cb-title-md">Departments Master</h3>
                <p className="cb-body-sm">Enterprise business units tracked in ESG ledger</p>
              </div>
              <button
                onClick={() => setIsDeptModalOpen(true)}
                className="cb-btn cb-btn-secondary cb-btn-sm"
              >
                <Plus size={14} />
                <span>Add Dept</span>
              </button>
            </div>

            <div className="cb-table-container">
              <table className="cb-table">
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Code</th>
                    <th>Head</th>
                    <th>Staff</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {state.master.departments.map(d => (
                    <tr key={d.id}>
                      <td style={{ fontWeight: 600 }}>{d.name}</td>
                      <td className="cb-mono">{d.code}</td>
                      <td>{d.head}</td>
                      <td className="cb-mono">{d.employeeCount}</td>
                      <td>
                        <button
                          onClick={() => deleteDepartment(d.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--cb-muted)' }}
                          title="Delete department"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Categories Master */}
          <div className="cb-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 className="cb-title-md">Shared Categories Master</h3>
                <p className="cb-body-sm">Common taxonomy across Social & Gamification modules</p>
              </div>
              <button
                onClick={() => setIsCatModalOpen(true)}
                className="cb-btn cb-btn-secondary cb-btn-sm"
              >
                <Plus size={14} />
                <span>Add Category</span>
              </button>
            </div>

            <div className="cb-table-container">
              <table className="cb-table">
                <thead>
                  <tr>
                    <th>Category Name</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {state.master.categories.map(c => (
                    <tr key={c.id}>
                      <td style={{ fontWeight: 600 }}>{c.name}</td>
                      <td><span className="cb-badge cb-badge-neutral">{c.type}</span></td>
                      <td><span className="cb-badge cb-badge-up">{c.status}</span></td>
                      <td>
                        <button
                          onClick={() => deleteCategory(c.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--cb-muted)' }}
                          title="Delete category"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* Modal: Add Department */}
      {isDeptModalOpen && (
        <div className="cb-modal-overlay">
          <div className="cb-modal-content">
            <div style={{ padding: '24px', borderBottom: '1px solid var(--cb-hairline)' }}>
              <h3 className="cb-title-lg">Add Department</h3>
            </div>
            <form onSubmit={handleCreateDept} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Department Name</label>
                <input
                  type="text"
                  placeholder="e.g. Research & Innovation"
                  value={deptName}
                  onChange={e => setDeptName(e.target.value)}
                  className="cb-input"
                  required
                />
              </div>
              <div className="cb-grid-2">
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Code</label>
                  <input
                    type="text"
                    placeholder="e.g. RND"
                    value={deptCode}
                    onChange={e => setDeptCode(e.target.value)}
                    className="cb-input cb-mono"
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Staff Count</label>
                  <input
                    type="number"
                    value={deptCount}
                    onChange={e => setDeptCount(Number(e.target.value))}
                    className="cb-input cb-mono"
                    required
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Department Head</label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Jordan Vance"
                  value={deptHead}
                  onChange={e => setDeptHead(e.target.value)}
                  className="cb-input"
                  required
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsDeptModalOpen(false)} className="cb-btn cb-btn-outline">Cancel</button>
                <button type="submit" className="cb-btn cb-btn-primary">Save Department</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Category */}
      {isCatModalOpen && (
        <div className="cb-modal-overlay">
          <div className="cb-modal-content">
            <div style={{ padding: '24px', borderBottom: '1px solid var(--cb-hairline)' }}>
              <h3 className="cb-title-lg">Add Shared Category</h3>
            </div>
            <form onSubmit={handleCreateCat} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Category Name</label>
                <input
                  type="text"
                  placeholder="e.g. Biodiversity & Marine Conservation"
                  value={catName}
                  onChange={e => setCatName(e.target.value)}
                  className="cb-input"
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Type</label>
                <select
                  value={catType}
                  onChange={e => setCatType(e.target.value as any)}
                  className="cb-select"
                >
                  <option value="CSR Activity">CSR Activity Category</option>
                  <option value="Challenge">Challenge Category</option>
                  <option value="Emission Factor">Emission Factor Category</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsCatModalOpen(false)} className="cb-btn cb-btn-outline">Cancel</button>
                <button type="submit" className="cb-btn cb-btn-primary">Save Category</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
