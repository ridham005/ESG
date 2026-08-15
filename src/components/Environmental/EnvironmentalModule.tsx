import React, { useState } from 'react';
import { useEcoSphere } from '../../context/EcoSphereContext';
import { 
  Flame, 
  Plus, 
  Search, 
  Target, 
  Cpu, 
  Trash2, 
  Sparkles
} from 'lucide-react';

interface EnvProps {
  openERPSimulator: () => void;
}

export const EnvironmentalModule: React.FC<EnvProps> = ({ openERPSimulator }) => {
  const { state, addEmissionFactor, deleteEmissionFactor, addEnvironmentalGoal, addProductProfile } = useEcoSphere();
  const [activeSubtab, setActiveSubtab] = useState<'transactions' | 'factors' | 'goals' | 'products'>('transactions');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isFactorModalOpen, setIsFactorModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);

  // New Factor Form
  const [factorName, setFactorName] = useState('');
  const [factorCategory, setFactorCategory] = useState('Stationary Combustion');
  const [factorScope, setFactorScope] = useState<1 | 2 | 3>(1);
  const [factorSourceType, setFactorSourceType] = useState<'Purchase' | 'Manufacturing' | 'Expenses' | 'Fleet'>('Fleet');
  const [factorVal, setFactorVal] = useState(1.5);
  const [factorUnit, setFactorUnit] = useState('liters');

  // New Goal Form
  const [goalTitle, setGoalTitle] = useState('');
  const [goalYear, setGoalYear] = useState(2028);
  const [goalBaseline, setGoalBaseline] = useState(5000);
  const [goalTarget, setGoalTarget] = useState(2500);
  const [goalUnit, setGoalUnit] = useState('tCO2e');
  const [goalScope, setGoalScope] = useState('Scope 1 & 2');

  // New Product Profile Form
  const [prodName, setProdName] = useState('');
  const [prodCode, setProdCode] = useState('');
  const [prodCarbon, setProdCarbon] = useState(45.0);
  const [prodRecycled, setProdRecycled] = useState(60);
  const [prodRating, setProdRating] = useState<'A+' | 'A' | 'B' | 'C' | 'D'>('A+');
  const [prodDeptId, setProdDeptId] = useState(state.master.departments[0]?.id || 'dept-1');

  // Filtered Carbon Transactions
  const filteredTransactions = state.transactions.carbonTransactions.filter(tx => {
    const matchesSource = sourceFilter === 'ALL' || tx.sourceType === sourceFilter;
    const factor = state.master.emissionFactors.find(f => f.id === tx.emissionFactorId);
    const dept = state.master.departments.find(d => d.id === tx.departmentId);
    const matchesSearch = 
      (tx.notes || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (tx.referenceId || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (factor?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (dept?.name || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSource && matchesSearch;
  });

  const handleCreateFactor = (e: React.FormEvent) => {
    e.preventDefault();
    addEmissionFactor({
      name: factorName,
      category: factorCategory,
      scope: factorScope,
      sourceType: factorSourceType,
      factorValue: factorVal,
      unit: factorUnit,
      description: factorName + ' (' + factorVal + ' kg CO2e / ' + factorUnit + ')'
    });
    setIsFactorModalOpen(false);
    setFactorName('');
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    addEnvironmentalGoal({
      title: goalTitle,
      targetYear: goalYear,
      baselineValue: goalBaseline,
      targetValue: goalTarget,
      currentValue: Math.round((goalBaseline + goalTarget) / 2),
      unit: goalUnit,
      scope: goalScope,
      status: 'On Track'
    });
    setIsGoalModalOpen(false);
    setGoalTitle('');
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addProductProfile({
      productName: prodName,
      productCode: prodCode,
      carbonFootprintPerUnit: prodCarbon,
      recycledMaterialPct: prodRecycled,
      energyEfficiencyRating: prodRating,
      departmentId: prodDeptId,
      status: 'Active'
    });
    setIsProductModalOpen(false);
    setProdName('');
    setProdCode('');
  };

  return (
    <div style={{ padding: '32px 0 60px' }}>
      <div className="cb-container">
        
        {/* Module Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="cb-badge cb-badge-primary">MODULE 01</span>
              <span className="cb-caption" style={{ color: 'var(--cb-muted)' }}>GHG PROTOCOL & CARBON ACCOUNTING</span>
            </div>
            <h1 className="cb-display-lg" style={{ color: 'var(--cb-ink)' }}>Environmental Management</h1>
            <p className="cb-body-md">Configure emission factors, track ERP activity streams, and monitor reduction goals.</p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={openERPSimulator}
              className="cb-btn cb-btn-primary"
            >
              <Sparkles size={16} />
              <span>Record ERP Carbon</span>
            </button>
          </div>
        </div>

        {/* Subtabs Segmented Control */}
        <div style={{ marginBottom: '24px' }}>
          <div className="cb-tabs">
            <button
              onClick={() => setActiveSubtab('transactions')}
              className={'cb-tab-item ' + (activeSubtab === 'transactions' ? 'active' : '')}
            >
              Carbon Ledger & ERP ({state.transactions.carbonTransactions.length})
            </button>
            <button
              onClick={() => setActiveSubtab('factors')}
              className={'cb-tab-item ' + (activeSubtab === 'factors' ? 'active' : '')}
            >
              Emission Factors ({state.master.emissionFactors.length})
            </button>
            <button
              onClick={() => setActiveSubtab('goals')}
              className={'cb-tab-item ' + (activeSubtab === 'goals' ? 'active' : '')}
            >
              Sustainability Goals ({state.master.goals.length})
            </button>
            <button
              onClick={() => setActiveSubtab('products')}
              className={'cb-tab-item ' + (activeSubtab === 'products' ? 'active' : '')}
            >
              Product ESG Profiles ({state.master.productProfiles.length})
            </button>
          </div>
        </div>

        {/* SUBTAB 1: Carbon Transactions Ledger */}
        {activeSubtab === 'transactions' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
              gap: '16px',
              flexWrap: 'wrap'
            }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '13px', color: 'var(--cb-muted)', fontWeight: 600 }}>SOURCE:</span>
                {(['ALL', 'Fleet', 'Purchase', 'Manufacturing', 'Expenses'] as const).map(src => (
                  <button
                    key={src}
                    onClick={() => setSourceFilter(src)}
                    className={'cb-btn cb-btn-sm ' + (sourceFilter === src ? 'cb-btn-secondary' : 'cb-btn-outline')}
                    style={{ fontSize: '12px' }}
                  >
                    {src}
                  </button>
                ))}
              </div>

              <div style={{ width: '280px', position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Search invoice, factor, notes..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="cb-input"
                  style={{ height: '36px', fontSize: '13px', paddingLeft: '34px' }}
                />
                <Search size={15} style={{ position: 'absolute', left: '12px', top: '11px', color: 'var(--cb-muted)' }} />
              </div>
            </div>

            <div className="cb-table-container">
              <table className="cb-table">
                <thead>
                  <tr>
                    <th>Date & Ref</th>
                    <th>Source Stream</th>
                    <th>Owning Department</th>
                    <th>Linked Emission Factor</th>
                    <th>Quantity</th>
                    <th>Calculated Emissions</th>
                    <th>Scope</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: 'var(--cb-muted)' }}>
                        No carbon transactions match the current filter.
                      </td>
                    </tr>
                  ) : (
                    filteredTransactions.map(tx => {
                      const factor = state.master.emissionFactors.find(f => f.id === tx.emissionFactorId);
                      const dept = state.master.departments.find(d => d.id === tx.departmentId);
                      const product = state.master.productProfiles.find(p => p.id === tx.productProfileId);

                      return (
                        <tr key={tx.id}>
                          <td>
                            <div style={{ fontWeight: 600, color: 'var(--cb-ink)' }}>{tx.date}</div>
                            <div style={{ fontSize: '11px', color: 'var(--cb-muted)' }} className="cb-mono">{tx.referenceId}</div>
                          </td>
                          <td>
                            <span className="cb-badge cb-badge-neutral">
                              {tx.sourceType}
                            </span>
                            {product && (
                              <div style={{ fontSize: '11px', color: 'var(--cb-primary)', marginTop: '3px' }}>
                                📦 {product.productName}
                              </div>
                            )}
                          </td>
                          <td>
                            <div style={{ fontWeight: 500 }}>{dept?.name || tx.departmentId}</div>
                            {tx.notes && <div style={{ fontSize: '12px', color: 'var(--cb-muted)' }}>{tx.notes}</div>}
                          </td>
                          <td>
                            <div style={{ fontWeight: 600, color: 'var(--cb-ink)' }}>{factor?.name || tx.emissionFactorId}</div>
                            <div style={{ fontSize: '11px', color: 'var(--cb-muted)' }}>
                              Factor: {factor?.factorValue} kg CO2e / {factor?.unit}
                            </div>
                          </td>
                          <td className="cb-mono" style={{ fontWeight: 600 }}>
                            {tx.quantity.toLocaleString()} {factor?.unit}
                          </td>
                          <td>
                            <span className="cb-mono" style={{ fontSize: '15px', fontWeight: 700, color: 'var(--cb-ink)' }}>
                              {tx.calculatedEmissions.toLocaleString()}
                            </span>
                            <span style={{ fontSize: '11px', color: 'var(--cb-muted)', marginLeft: '4px' }}>kg CO2e</span>
                          </td>
                          <td>
                            <span className={'cb-badge ' + (tx.scope === 1 ? 'cb-badge-warning' : tx.scope === 2 ? 'cb-badge-neutral' : 'cb-badge-primary')}>
                              Scope {tx.scope}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUBTAB 2: Emission Factors Master */}
        {activeSubtab === 'factors' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 className="cb-title-md">Emission Factor Repository</h3>
                <p className="cb-body-sm">Standard conversion rates used in automatic ERP calculations</p>
              </div>
              <button
                onClick={() => setIsFactorModalOpen(true)}
                className="cb-btn cb-btn-secondary cb-btn-sm"
              >
                <Plus size={15} />
                <span>Add Emission Factor</span>
              </button>
            </div>

            <div className="cb-table-container">
              <table className="cb-table">
                <thead>
                  <tr>
                    <th>Factor Name</th>
                    <th>Category</th>
                    <th>Applicable Scope</th>
                    <th>ERP Source</th>
                    <th>Factor Value</th>
                    <th>Unit</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {state.master.emissionFactors.map(factor => (
                    <tr key={factor.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--cb-ink)' }}>{factor.name}</div>
                        {factor.description && <div style={{ fontSize: '12px', color: 'var(--cb-muted)' }}>{factor.description}</div>}
                      </td>
                      <td>{factor.category}</td>
                      <td>
                        <span className={'cb-badge ' + (factor.scope === 1 ? 'cb-badge-warning' : factor.scope === 2 ? 'cb-badge-neutral' : 'cb-badge-primary')}>
                          Scope {factor.scope}
                        </span>
                      </td>
                      <td>
                        <span className="cb-badge cb-badge-neutral">{factor.sourceType}</span>
                      </td>
                      <td className="cb-mono" style={{ fontWeight: 700, color: 'var(--cb-primary)' }}>
                        {factor.factorValue}
                      </td>
                      <td className="cb-mono">kg CO2e / {factor.unit}</td>
                      <td>
                        <button
                          onClick={() => deleteEmissionFactor(factor.id)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--cb-muted)' }}
                          title="Delete factor"
                        >
                          <Trash2 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUBTAB 3: Sustainability Goals */}
        {activeSubtab === 'goals' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 className="cb-title-md">Corporate Decarbonization Targets</h3>
                <p className="cb-body-sm">Science-Based Targets initiative (SBTi) aligned milestones</p>
              </div>
              <button
                onClick={() => setIsGoalModalOpen(true)}
                className="cb-btn cb-btn-secondary cb-btn-sm"
              >
                <Plus size={15} />
                <span>Create Target</span>
              </button>
            </div>

            <div className="cb-grid-3">
              {state.master.goals.map(goal => {
                const progressPct = Math.min(100, Math.round(((goal.currentValue - goal.baselineValue) / (goal.targetValue - goal.baselineValue)) * 100)) || 70;
                return (
                  <div key={goal.id} className="cb-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span className="cb-badge cb-badge-neutral cb-mono">Target Year {goal.targetYear}</span>
                      <span className={'cb-badge ' + (goal.status === 'On Track' ? 'cb-badge-up' : 'cb-badge-warning')}>
                        {goal.status}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--cb-ink)', marginBottom: '8px' }}>
                      {goal.title}
                    </h4>

                    <p style={{ fontSize: '13px', color: 'var(--cb-muted)', marginBottom: '16px' }}>
                      Scope Coverage: {goal.scope}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '8px' }}>
                      <span>Baseline: <strong className="cb-mono">{goal.baselineValue} {goal.unit}</strong></span>
                      <span>Target: <strong className="cb-mono" style={{ color: 'var(--cb-primary)' }}>{goal.targetValue} {goal.unit}</strong></span>
                    </div>

                    <div className="cb-progress-track" style={{ height: '10px', marginBottom: '10px' }}>
                      <div className="cb-progress-fill" style={{ width: Math.abs(progressPct) + '%' }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: 'var(--cb-body)' }}>
                      <span>Current Status:</span>
                      <span className="cb-mono" style={{ fontWeight: 700, color: 'var(--cb-ink)' }}>{goal.currentValue} {goal.unit}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SUBTAB 4: Product ESG Profiles */}
        {activeSubtab === 'products' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 className="cb-title-md">Product ESG Profiles</h3>
                <p className="cb-body-sm">Embodied carbon and circularity data linked to manufacturing</p>
              </div>
              <button
                onClick={() => setIsProductModalOpen(true)}
                className="cb-btn cb-btn-secondary cb-btn-sm"
              >
                <Plus size={15} />
                <span>Register Product Profile</span>
              </button>
            </div>

            <div className="cb-table-container">
              <table className="cb-table">
                <thead>
                  <tr>
                    <th>Product Name & Code</th>
                    <th>Embodied Carbon / Unit</th>
                    <th>Recycled Content</th>
                    <th>Energy Rating</th>
                    <th>Department</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {state.master.productProfiles.map(p => {
                    const dept = state.master.departments.find(d => d.id === p.departmentId);
                    return (
                      <tr key={p.id}>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--cb-ink)' }}>{p.productName}</div>
                          <div style={{ fontSize: '11px', color: 'var(--cb-muted)' }} className="cb-mono">{p.productCode}</div>
                        </td>
                        <td>
                          <span className="cb-mono" style={{ fontWeight: 700, color: 'var(--cb-primary)' }}>
                            {p.carbonFootprintPerUnit} kg CO2e
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="cb-mono" style={{ fontWeight: 600 }}>{p.recycledMaterialPct}%</span>
                            <div style={{ width: '40px', height: '6px', backgroundColor: 'var(--cb-surface-strong)', borderRadius: 'var(--cb-radius-pill)' }}>
                              <div style={{ width: p.recycledMaterialPct + '%', height: '100%', backgroundColor: 'var(--cb-semantic-up)', borderRadius: 'var(--cb-radius-pill)' }} />
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className="cb-badge cb-badge-up cb-mono" style={{ fontWeight: 700 }}>
                            {p.energyEfficiencyRating}
                          </span>
                        </td>
                        <td>{dept?.name || p.departmentId}</td>
                        <td>
                          <span className="cb-badge cb-badge-neutral">{p.status}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>

      {/* Modal: Add Emission Factor */}
      {isFactorModalOpen && (
        <div className="cb-modal-overlay">
          <div className="cb-modal-content">
            <div style={{ padding: '24px', borderBottom: '1px solid var(--cb-hairline)' }}>
              <h3 className="cb-title-lg">Add New Emission Factor</h3>
              <p className="cb-body-sm">Configure GHG factor value for automated calculations</p>
            </div>
            <form onSubmit={handleCreateFactor} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Factor Name</label>
                <input
                  type="text"
                  placeholder="e.g. Bio-Gas Cogeneration"
                  value={factorName}
                  onChange={e => setFactorName(e.target.value)}
                  className="cb-input"
                  required
                />
              </div>
              <div className="cb-grid-2">
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Scope</label>
                  <select
                    value={factorScope}
                    onChange={e => setFactorScope(Number(e.target.value) as 1 | 2 | 3)}
                    className="cb-select"
                  >
                    <option value={1}>Scope 1 (Direct)</option>
                    <option value={2}>Scope 2 (Electricity)</option>
                    <option value={3}>Scope 3 (Value Chain)</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>ERP Source Stream</label>
                  <select
                    value={factorSourceType}
                    onChange={e => setFactorSourceType(e.target.value as any)}
                    className="cb-select"
                  >
                    <option value="Fleet">Fleet</option>
                    <option value="Purchase">Purchase</option>
                    <option value="Manufacturing">Manufacturing</option>
                    <option value="Expenses">Expenses</option>
                  </select>
                </div>
              </div>
              <div className="cb-grid-2">
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Factor Value (kg CO2e)</label>
                  <input
                    type="number"
                    step="0.001"
                    value={factorVal}
                    onChange={e => setFactorVal(Number(e.target.value))}
                    className="cb-input cb-mono"
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Input Unit</label>
                  <input
                    type="text"
                    placeholder="e.g. kWh, liters, kg, km"
                    value={factorUnit}
                    onChange={e => setFactorUnit(e.target.value)}
                    className="cb-input"
                    required
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsFactorModalOpen(false)} className="cb-btn cb-btn-outline">Cancel</button>
                <button type="submit" className="cb-btn cb-btn-primary">Save Emission Factor</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Goal */}
      {isGoalModalOpen && (
        <div className="cb-modal-overlay">
          <div className="cb-modal-content">
            <div style={{ padding: '24px', borderBottom: '1px solid var(--cb-hairline)' }}>
              <h3 className="cb-title-lg">Create Decarbonization Target</h3>
              <p className="cb-body-sm">Set science-based environmental milestones</p>
            </div>
            <form onSubmit={handleCreateGoal} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Goal Title</label>
                <input
                  type="text"
                  placeholder="e.g. 50% Reduction in Logistics Diesel"
                  value={goalTitle}
                  onChange={e => setGoalTitle(e.target.value)}
                  className="cb-input"
                  required
                />
              </div>
              <div className="cb-grid-2">
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Target Year</label>
                  <input
                    type="number"
                    value={goalYear}
                    onChange={e => setGoalYear(Number(e.target.value))}
                    className="cb-input cb-mono"
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Unit</label>
                  <input
                    type="text"
                    value={goalUnit}
                    onChange={e => setGoalUnit(e.target.value)}
                    className="cb-input"
                    required
                  />
                </div>
              </div>
              <div className="cb-grid-2">
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Baseline Value</label>
                  <input
                    type="number"
                    value={goalBaseline}
                    onChange={e => setGoalBaseline(Number(e.target.value))}
                    className="cb-input cb-mono"
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Target Value</label>
                  <input
                    type="number"
                    value={goalTarget}
                    onChange={e => setGoalTarget(Number(e.target.value))}
                    className="cb-input cb-mono"
                    required
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsGoalModalOpen(false)} className="cb-btn cb-btn-outline">Cancel</button>
                <button type="submit" className="cb-btn cb-btn-primary">Save Target</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Add Product Profile */}
      {isProductModalOpen && (
        <div className="cb-modal-overlay">
          <div className="cb-modal-content">
            <div style={{ padding: '24px', borderBottom: '1px solid var(--cb-hairline)' }}>
              <h3 className="cb-title-lg">Register Product ESG Profile</h3>
              <p className="cb-body-sm">Link product specifications to ERP manufacturing runs</p>
            </div>
            <form onSubmit={handleCreateProduct} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="cb-grid-2">
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Product Name</label>
                  <input
                    type="text"
                    placeholder="e.g. EcoServer Pro"
                    value={prodName}
                    onChange={e => setProdName(e.target.value)}
                    className="cb-input"
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Product Code</label>
                  <input
                    type="text"
                    placeholder="e.g. PRD-SRV-99"
                    value={prodCode}
                    onChange={e => setProdCode(e.target.value)}
                    className="cb-input cb-mono"
                    required
                  />
                </div>
              </div>
              <div className="cb-grid-3">
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Carbon / Unit (kg)</label>
                  <input
                    type="number"
                    value={prodCarbon}
                    onChange={e => setProdCarbon(Number(e.target.value))}
                    className="cb-input cb-mono"
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Recycled %</label>
                  <input
                    type="number"
                    value={prodRecycled}
                    onChange={e => setProdRecycled(Number(e.target.value))}
                    className="cb-input cb-mono"
                    min="0"
                    max="100"
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Energy Rating</label>
                  <select
                    value={prodRating}
                    onChange={e => setProdRating(e.target.value as any)}
                    className="cb-select"
                  >
                    <option value="A+">A+</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsProductModalOpen(false)} className="cb-btn cb-btn-outline">Cancel</button>
                <button type="submit" className="cb-btn cb-btn-primary">Save Product Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
