import React, { useState } from 'react';
import { useEcoSphere } from '../../context/EcoSphereContext';
import { 
  Download, 
  Printer, 
  Filter
} from 'lucide-react';

export const ReportsModule: React.FC = () => {
  const { state, overallESGScore, departmentScores } = useEcoSphere();

  const [reportMode, setReportMode] = useState<'preset' | 'custom'>('preset');
  const [selectedPreset, setSelectedPreset] = useState<'summary' | 'environmental' | 'social' | 'governance'>('summary');

  // Custom 6-Axis Filters
  const [filterDept, setFilterDept] = useState('ALL');
  const [filterModule, setFilterModule] = useState('ALL');
  const [filterEmployee, setFilterEmployee] = useState('ALL');
  const [filterChallenge, setFilterChallenge] = useState('ALL');
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [filterDateRange, setFilterDateRange] = useState('2026-Q3');

  // PDF Preview State
  const [showPdfPreview, setShowPdfPreview] = useState(false);

  // Export CSV Helper
  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    
    if (selectedPreset === 'environmental' || filterModule === 'Environmental') {
      csvContent += 'Transaction ID,Date,Department,Source Type,Quantity,Unit,Calculated Emissions (kg CO2e),Scope\n';
      state.transactions.carbonTransactions.forEach(t => {
        const factor = state.master.emissionFactors.find(f => f.id === t.emissionFactorId);
        const dept = state.master.departments.find(d => d.id === t.departmentId);
        csvContent += [
          t.id,
          t.date,
          dept?.name || t.departmentId,
          t.sourceType,
          t.quantity,
          factor?.unit || '',
          t.calculatedEmissions,
          'Scope ' + t.scope
        ].join(',') + '\n';
      });
    } else {
      csvContent += 'Department,Environmental Score,Social Score,Governance Score,Total Composite Score,Rank\n';
      departmentScores.forEach(d => {
        csvContent += [
          d.departmentName,
          d.environmentalScore,
          d.socialScore,
          d.governanceScore,
          d.totalScore,
          '#' + d.rank
        ].join(',') + '\n';
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'EcoSphere_' + selectedPreset + '_Report_' + Date.now() + '.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ padding: '32px 0 60px' }}>
      <div className="cb-container">
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="cb-badge cb-badge-primary">MODULE 05</span>
              <span className="cb-caption" style={{ color: 'var(--cb-muted)' }}>INTELLIGENCE & EXPORT ENGINE</span>
            </div>
            <h1 className="cb-display-lg" style={{ color: 'var(--cb-ink)' }}>ESG Reporting & Analytics</h1>
            <p className="cb-body-md">Generate board-ready executive summaries, module audits, and custom 6-axis filtered reports.</p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={handleExportCSV}
              className="cb-btn cb-btn-secondary"
            >
              <Download size={15} />
              <span>Export CSV / Excel</span>
            </button>
            <button
              onClick={() => setShowPdfPreview(true)}
              className="cb-btn cb-btn-primary"
            >
              <Printer size={15} />
              <span>Print / PDF Document</span>
            </button>
          </div>
        </div>

        {/* Mode Toggle */}
        <div style={{ marginBottom: '24px' }}>
          <div className="cb-tabs">
            <button
              onClick={() => setReportMode('preset')}
              className={'cb-tab-item ' + (reportMode === 'preset' ? 'active' : '')}
            >
              Standard ESG Reports
            </button>
            <button
              onClick={() => setReportMode('custom')}
              className={'cb-tab-item ' + (reportMode === 'custom' ? 'active' : '')}
            >
              Custom 6-Axis Report Builder
            </button>
          </div>
        </div>

        {/* PRESET REPORTS VIEW */}
        {reportMode === 'preset' && (
          <div>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
              {[
                { id: 'summary', label: 'Executive ESG Summary' },
                { id: 'environmental', label: 'Environmental Carbon Report' },
                { id: 'social', label: 'Social & CSR Activity Report' },
                { id: 'governance', label: 'Governance & Compliance Audit' }
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPreset(p.id as any)}
                  className={'cb-btn cb-btn-sm ' + (selectedPreset === p.id ? 'cb-btn-secondary' : 'cb-btn-outline')}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div className="cb-card" style={{ padding: '32px' }}>
              {selectedPreset === 'summary' && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--cb-hairline)', paddingBottom: '16px' }}>
                    <div>
                      <h2 className="cb-title-lg">Corporate Executive ESG Scorecard</h2>
                      <p className="cb-body-sm">Period: Q3 2026 • Methodology: Configurable Weighted Multi-Criteria Analysis</p>
                    </div>
                    <span className="cb-badge cb-badge-primary cb-mono" style={{ fontSize: '14px', padding: '6px 14px' }}>
                      Overall Score: {overallESGScore.total} / 100
                    </span>
                  </div>

                  <div className="cb-grid-3" style={{ marginBottom: '28px' }}>
                    <div style={{ padding: '16px', backgroundColor: 'var(--cb-surface-soft)', borderRadius: 'var(--cb-radius-lg)' }}>
                      <div className="cb-caption" style={{ color: 'var(--cb-muted)' }}>ENVIRONMENTAL PILLAR ({state.config.weights.env}%)</div>
                      <div className="cb-mono" style={{ fontSize: '32px', fontWeight: 700, color: 'var(--cb-semantic-up)', marginTop: '4px' }}>
                        {overallESGScore.environmental} / 100
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--cb-muted)', marginTop: '4px' }}>
                        Total Scope 1-3 Emissions: {(state.transactions.carbonTransactions.reduce((acc, t) => acc + t.calculatedEmissions, 0) / 1000).toFixed(1)} tCO2e
                      </div>
                    </div>

                    <div style={{ padding: '16px', backgroundColor: 'var(--cb-surface-soft)', borderRadius: 'var(--cb-radius-lg)' }}>
                      <div className="cb-caption" style={{ color: 'var(--cb-muted)' }}>SOCIAL PILLAR ({state.config.weights.soc}%)</div>
                      <div className="cb-mono" style={{ fontSize: '32px', fontWeight: 700, color: 'var(--cb-primary)', marginTop: '4px' }}>
                        {overallESGScore.social} / 100
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--cb-muted)', marginTop: '4px' }}>
                        CSR Volunteer Hours: 420 hrs • Training Completion: 88%
                      </div>
                    </div>

                    <div style={{ padding: '16px', backgroundColor: 'var(--cb-surface-soft)', borderRadius: 'var(--cb-radius-lg)' }}>
                      <div className="cb-caption" style={{ color: 'var(--cb-muted)' }}>GOVERNANCE PILLAR ({state.config.weights.gov}%)</div>
                      <div className="cb-mono" style={{ fontSize: '32px', fontWeight: 700, color: '#d97706', marginTop: '4px' }}>
                        {overallESGScore.governance} / 100
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--cb-muted)', marginTop: '4px' }}>
                        Policy Acknowledgement: 96% • Open Audits: {state.transactions.audits.length}
                      </div>
                    </div>
                  </div>

                  <h3 className="cb-title-md" style={{ marginBottom: '14px' }}>Department Score Breakdown</h3>
                  <div className="cb-table-container">
                    <table className="cb-table">
                      <thead>
                        <tr>
                          <th>Rank</th>
                          <th>Department Name</th>
                          <th>Environmental</th>
                          <th>Social</th>
                          <th>Governance</th>
                          <th>Overall Total</th>
                        </tr>
                      </thead>
                      <tbody>
                        {departmentScores.map(d => (
                          <tr key={d.departmentId}>
                            <td className="cb-mono" style={{ fontWeight: 700 }}>#{d.rank}</td>
                            <td style={{ fontWeight: 600 }}>{d.departmentName}</td>
                            <td className="cb-mono" style={{ color: 'var(--cb-semantic-up)' }}>{d.environmentalScore}</td>
                            <td className="cb-mono" style={{ color: 'var(--cb-primary)' }}>{d.socialScore}</td>
                            <td className="cb-mono" style={{ color: '#d97706' }}>{d.governanceScore}</td>
                            <td className="cb-mono" style={{ fontWeight: 700, fontSize: '15px' }}>{d.totalScore} / 100</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {selectedPreset === 'environmental' && (
                <div>
                  <h2 className="cb-title-lg" style={{ marginBottom: '6px' }}>Carbon Accounting & GHG Inventory</h2>
                  <p className="cb-body-sm" style={{ marginBottom: '20px' }}>Comprehensive ledger of operational emissions categorized by Scope 1, 2, and 3</p>
                  
                  <div className="cb-table-container">
                    <table className="cb-table">
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Stream</th>
                          <th>Department</th>
                          <th>Quantity</th>
                          <th>Emissions (kg CO2e)</th>
                          <th>Scope</th>
                        </tr>
                      </thead>
                      <tbody>
                        {state.transactions.carbonTransactions.map(tx => (
                          <tr key={tx.id}>
                            <td className="cb-mono">{tx.date}</td>
                            <td><span className="cb-badge cb-badge-neutral">{tx.sourceType}</span></td>
                            <td>{state.master.departments.find(d => d.id === tx.departmentId)?.name || tx.departmentId}</td>
                            <td className="cb-mono">{tx.quantity.toLocaleString()}</td>
                            <td className="cb-mono" style={{ fontWeight: 700, color: 'var(--cb-primary)' }}>
                              {tx.calculatedEmissions.toLocaleString()}
                            </td>
                            <td>Scope {tx.scope}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {selectedPreset === 'social' && (
                <div>
                  <h2 className="cb-title-lg" style={{ marginBottom: '6px' }}>Social Initiatives & Participation Audit</h2>
                  <p className="cb-body-sm" style={{ marginBottom: '20px' }}>Corporate social responsibility activities, participation records, and verified impact</p>
                  
                  <div className="cb-table-container">
                    <table className="cb-table">
                      <thead>
                        <tr>
                          <th>CSR Initiative</th>
                          <th>Date</th>
                          <th>Location</th>
                          <th>Points Awarded</th>
                          <th>Enrolled / Max</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {state.transactions.csrActivities.map(act => (
                          <tr key={act.id}>
                            <td style={{ fontWeight: 600 }}>{act.title}</td>
                            <td className="cb-mono">{act.date}</td>
                            <td>{act.location}</td>
                            <td className="cb-mono" style={{ color: 'var(--cb-primary)', fontWeight: 700 }}>+{act.pointsAwarded} PTS</td>
                            <td className="cb-mono">{act.registeredCount} / {act.maxParticipants}</td>
                            <td><span className="cb-badge cb-badge-neutral">{act.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {selectedPreset === 'governance' && (
                <div>
                  <h2 className="cb-title-lg" style={{ marginBottom: '6px' }}>Corporate Governance & Audit Record</h2>
                  <p className="cb-body-sm" style={{ marginBottom: '20px' }}>Internal, external, and regulatory compliance logs and issue status</p>
                  
                  <div className="cb-table-container">
                    <table className="cb-table">
                      <thead>
                        <tr>
                          <th>Audit / Violation Name</th>
                          <th>Severity / Type</th>
                          <th>Lead / Owner</th>
                          <th>Date</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {state.transactions.audits.map(aud => (
                          <tr key={aud.id}>
                            <td style={{ fontWeight: 600 }}>{aud.title}</td>
                            <td><span className="cb-badge cb-badge-neutral">{aud.auditType}</span></td>
                            <td>{aud.leadAuditor}</td>
                            <td className="cb-mono">{aud.scheduledDate}</td>
                            <td><span className="cb-badge cb-badge-up">{aud.status}</span></td>
                          </tr>
                        ))}
                        {state.transactions.complianceIssues.map(iss => (
                          <tr key={iss.id}>
                            <td style={{ fontWeight: 600, color: 'var(--cb-semantic-down)' }}>{iss.title}</td>
                            <td><span className="cb-badge cb-badge-down">{iss.severity}</span></td>
                            <td>{state.users.find(u => u.id === iss.ownerEmployeeId)?.name || iss.ownerEmployeeId}</td>
                            <td className="cb-mono">{iss.dueDate}</td>
                            <td><span className={'cb-badge ' + (iss.status === 'Overdue' ? 'cb-badge-down' : 'cb-badge-warning')}>{iss.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CUSTOM 6-AXIS REPORT BUILDER */}
        {reportMode === 'custom' && (
          <div>
            <div className="cb-card" style={{ marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
                <Filter size={18} color="var(--cb-primary)" />
                <h3 className="cb-title-md">6-Axis Multi-Criteria Filter Controls</h3>
              </div>

              <div className="cb-grid-3">
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--cb-muted)', display: 'block', marginBottom: '4px' }}>
                    1. DEPARTMENT
                  </label>
                  <select
                    value={filterDept}
                    onChange={e => setFilterDept(e.target.value)}
                    className="cb-select"
                  >
                    <option value="ALL">All Departments (Aggregate)</option>
                    {state.master.departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--cb-muted)', display: 'block', marginBottom: '4px' }}>
                    2. MODULE
                  </label>
                  <select
                    value={filterModule}
                    onChange={e => setFilterModule(e.target.value)}
                    className="cb-select"
                  >
                    <option value="ALL">All Modules (Composite)</option>
                    <option value="Environmental">Environmental (GHG)</option>
                    <option value="Social">Social & CSR</option>
                    <option value="Governance">Governance & Audits</option>
                    <option value="Gamification">Gamification & XP</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--cb-muted)', display: 'block', marginBottom: '4px' }}>
                    3. DATE RANGE
                  </label>
                  <select
                    value={filterDateRange}
                    onChange={e => setFilterDateRange(e.target.value)}
                    className="cb-select"
                  >
                    <option value="2026-Q3">Q3 2026 (Current Quarter)</option>
                    <option value="2026-Q2">Q2 2026</option>
                    <option value="2026-YTD">Year-to-Date 2026</option>
                    <option value="ALL">All Historical Records</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--cb-muted)', display: 'block', marginBottom: '4px' }}>
                    4. EMPLOYEE PERSONA
                  </label>
                  <select
                    value={filterEmployee}
                    onChange={e => setFilterEmployee(e.target.value)}
                    className="cb-select"
                  >
                    <option value="ALL">All Employees</option>
                    {state.users.map(u => (
                      <option key={u.id} value={u.id}>{u.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--cb-muted)', display: 'block', marginBottom: '4px' }}>
                    5. CHALLENGE / CAMPAIGN
                  </label>
                  <select
                    value={filterChallenge}
                    onChange={e => setFilterChallenge(e.target.value)}
                    className="cb-select"
                  >
                    <option value="ALL">All Challenges</option>
                    {state.transactions.challenges.map(c => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '12px', fontWeight: 600, color: 'var(--cb-muted)', display: 'block', marginBottom: '4px' }}>
                    6. ESG CATEGORY
                  </label>
                  <select
                    value={filterCategory}
                    onChange={e => setFilterCategory(e.target.value)}
                    className="cb-select"
                  >
                    <option value="ALL">All Categories</option>
                    {state.master.categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name} ({c.type})</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="cb-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 className="cb-title-md">Custom Report Output Preview</h3>
                <span className="cb-badge cb-badge-primary cb-mono">
                  6-Axis Criteria Applied
                </span>
              </div>

              <div className="cb-table-container">
                <table className="cb-table">
                  <thead>
                    <tr>
                      <th>Record Item</th>
                      <th>Module Area</th>
                      <th>Linked Department</th>
                      <th>Responsible Party</th>
                      <th>Metric Value</th>
                      <th>Compliance / Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ fontWeight: 600 }}>Commercial Fleet Diesel Operations</td>
                      <td><span className="cb-badge cb-badge-warning">Scope 1 GHG</span></td>
                      <td>Operations & Logistics</td>
                      <td>Carlos Mendoza</td>
                      <td className="cb-mono" style={{ fontWeight: 700 }}>4,958.0 kg CO2e</td>
                      <td><span className="cb-badge cb-badge-up">Verified</span></td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600 }}>Urban Canopy Reforestation 2026</td>
                      <td><span className="cb-badge cb-badge-primary">Social CSR</span></td>
                      <td>Company-Wide</td>
                      <td>Elena Vance</td>
                      <td className="cb-mono" style={{ fontWeight: 700 }}>+150 PTS (22 Enrolled)</td>
                      <td><span className="cb-badge cb-badge-neutral">Upcoming</span></td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600 }}>Diesel Fuel Secondary Containment Basin</td>
                      <td><span className="cb-badge cb-badge-down">Governance</span></td>
                      <td>Operations & Logistics</td>
                      <td>Carlos Mendoza</td>
                      <td className="cb-mono" style={{ fontWeight: 700, color: 'var(--cb-semantic-down)' }}>High Severity</td>
                      <td><span className="cb-badge cb-badge-down">🚨 Overdue</span></td>
                    </tr>
                    <tr>
                      <td style={{ fontWeight: 600 }}>Zero-Emission Commuter Sprint</td>
                      <td><span className="cb-badge cb-badge-neutral">Gamification</span></td>
                      <td>Technology & Engineering</td>
                      <td>Maya Patel</td>
                      <td className="cb-mono" style={{ fontWeight: 700, color: 'var(--cb-primary)' }}>+250 XP Awarded</td>
                      <td><span className="cb-badge cb-badge-up">Completed</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* PDF Print Preview Modal */}
      {showPdfPreview && (
        <div className="cb-modal-overlay">
          <div className="cb-modal-content" style={{ maxWidth: '800px' }}>
            <div style={{ padding: '24px', borderBottom: '1px solid var(--cb-hairline)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 className="cb-title-lg">EcoSphere Formal Audit Document</h3>
                <p className="cb-body-sm">Institutional ESG Report Ready for Export</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={handlePrint} className="cb-btn cb-btn-primary cb-btn-sm">
                  <Printer size={14} />
                  <span>Print Document</span>
                </button>
                <button onClick={() => setShowPdfPreview(false)} className="cb-btn cb-btn-outline cb-btn-sm">
                  Close
                </button>
              </div>
            </div>

            <div style={{ padding: '32px', backgroundColor: '#ffffff', color: '#0a0b0d' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #0052ff', paddingBottom: '16px', marginBottom: '24px' }}>
                <div>
                  <h1 style={{ fontSize: '24px', fontWeight: 700 }}>EcoSphere Management Platform</h1>
                  <p style={{ fontSize: '13px', color: '#5b616e' }}>Corporate Sustainability & Compliance Audit Report</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '12px', color: '#5b616e' }}>Date: {new Date().toISOString().substring(0, 10)}</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#0052ff' }}>Score: {overallESGScore.total} / 100</div>
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Executive Summary</h3>
                <p style={{ fontSize: '13px', lineHeight: 1.5, color: '#5b616e' }}>
                  EcoSphere has aggregated operational data across all 5 organizational departments. Current performance reflects an environmental rating of {overallESGScore.environmental}/100, social engagement rating of {overallESGScore.social}/100, and governance compliance index of {overallESGScore.governance}/100 based on standard weighted formulas.
                </p>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>Department Breakdown</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f7f7f7', borderBottom: '1px solid #dee1e6' }}>
                      <th style={{ padding: '8px', textAlign: 'left' }}>Rank</th>
                      <th style={{ padding: '8px', textAlign: 'left' }}>Department</th>
                      <th style={{ padding: '8px', textAlign: 'left' }}>Env</th>
                      <th style={{ padding: '8px', textAlign: 'left' }}>Soc</th>
                      <th style={{ padding: '8px', textAlign: 'left' }}>Gov</th>
                      <th style={{ padding: '8px', textAlign: 'left' }}>Composite Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {departmentScores.map(d => (
                      <tr key={d.departmentId} style={{ borderBottom: '1px solid #dee1e6' }}>
                        <td style={{ padding: '8px' }}>#{d.rank}</td>
                        <td style={{ padding: '8px', fontWeight: 600 }}>{d.departmentName}</td>
                        <td style={{ padding: '8px' }}>{d.environmentalScore}</td>
                        <td style={{ padding: '8px' }}>{d.socialScore}</td>
                        <td style={{ padding: '8px' }}>{d.governanceScore}</td>
                        <td style={{ padding: '8px', fontWeight: 700 }}>{d.totalScore} / 100</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ fontSize: '11px', color: '#7c828a', textAlign: 'center', borderTop: '1px solid #dee1e6', paddingTop: '16px' }}>
                Generated via EcoSphere ESG Platform • Certified GHG Protocol & ISO 14001 Compliant
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
