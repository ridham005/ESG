import React from 'react';
import { useEcoSphere } from '../../context/EcoSphereContext';
import { 
  TrendingUp, 
  Flame, 
  Users, 
  ShieldCheck, 
  Award, 
  ArrowRight, 
  Zap,
  Leaf
} from 'lucide-react';

interface DashboardProps {
  onNavigate: (tab: string) => void;
  openERPSimulator: () => void;
}

export const OverviewDashboard: React.FC<DashboardProps> = ({ onNavigate, openERPSimulator }) => {
  const { state, overallESGScore, departmentScores } = useEcoSphere();
  const rawTotalW = (normEnv + normSoc + normGov) || 100;
  const normEnv = Math.round((normEnv / rawTotalW) * 100);
  const normSoc = Math.round((normSoc / rawTotalW) * 100);
  const normGov = 100 - normEnv - normSoc;

  const totalCarbonKg = state.transactions.carbonTransactions.reduce((acc, t) => acc + t.calculatedEmissions, 0);
  const totalCarbonTonnes = (totalCarbonKg / 1000).toFixed(1);

  const scope1Emissions = state.transactions.carbonTransactions
    .filter(t => t.scope === 1)
    .reduce((acc, t) => acc + t.calculatedEmissions, 0);
  const scope2Emissions = state.transactions.carbonTransactions
    .filter(t => t.scope === 2)
    .reduce((acc, t) => acc + t.calculatedEmissions, 0);
  const scope3Emissions = state.transactions.carbonTransactions
    .filter(t => t.scope === 3)
    .reduce((acc, t) => acc + t.calculatedEmissions, 0);

  const scope1Pct = totalCarbonKg > 0 ? Math.round((scope1Emissions / totalCarbonKg) * 100) : 0;
  const scope2Pct = totalCarbonKg > 0 ? Math.round((scope2Emissions / totalCarbonKg) * 100) : 0;
  const scope3Pct = totalCarbonKg > 0 ? Math.round((scope3Emissions / totalCarbonKg) * 100) : 0;

  const activeCsrCount = state.transactions.csrActivities.filter(a => a.status !== 'Completed').length;
  const pendingApprovalsCount = state.transactions.csrParticipations.filter(p => p.status === 'Pending').length;
  const overdueIssues = state.transactions.complianceIssues.filter(i => i.status === 'Overdue');

  return (
    <div style={{ padding: '24px 0 60px' }}>
      <div className="cb-container">
        
        {/* Dark Hero Band */}
        <div className="cb-card-dark-highlight" style={{ marginBottom: '28px' }}>
          <div className="cb-hero-grid">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px', flexWrap: 'wrap' }}>
                <span className="cb-badge cb-badge-primary" style={{ backgroundColor: 'rgba(0, 82, 255, 0.2)', color: '#60a5fa' }}>
                  INSTITUTIONAL ESG SCORECARD
                </span>
                <span style={{ fontSize: '12px', color: 'var(--cb-on-dark-soft)' }} className="cb-mono">
                  LIVE RECOMPUTATION ACTIVE
                </span>
              </div>

              <h1 className="cb-display-mega" style={{ color: '#ffffff', marginBottom: '14px' }}>
                Net-Zero & ESG Intelligence.
              </h1>

              <p className="cb-body-md" style={{ color: 'var(--cb-on-dark-body)', fontSize: '15px', maxWidth: '540px', marginBottom: '24px' }}>
                Integrated enterprise ESG accounting connecting real-time operational ERP data, employee sustainability challenges, and board-level governance audits.
              </p>

              <div className="cb-hero-cta-group">
                <button
                  onClick={openERPSimulator}
                  className="cb-btn cb-btn-primary cb-btn-pill-cta"
                >
                  <Zap size={18} />
                  <span>Record ERP Emissions</span>
                  <ArrowRight size={16} />
                </button>
                <button
                  onClick={() => onNavigate('reports')}
                  className="cb-btn cb-btn-dark-outline cb-btn-pill-cta"
                >
                  <span>Export ESG Summary Report</span>
                </button>
              </div>
            </div>

            {/* Scorecard Hero Display */}
            <div className="cb-hero-score-box">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <div className="cb-caption" style={{ color: 'var(--cb-on-dark-soft)' }}>
                    OVERALL COMPOSITE
                  </div>
                  <div className="cb-caption" style={{ color: 'var(--cb-on-dark-soft)' }}>
                    SCORE (WEIGHTED)
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--cb-semantic-up)', fontSize: '13px', fontWeight: 600 }}>
                  <TrendingUp size={15} />
                  <span>+4.2% QoQ</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '20px' }}>
                <span className="cb-mono" style={{ fontSize: '56px', fontWeight: 700, color: '#ffffff', lineHeight: 1 }}>
                  {overallESGScore.total}
                </span>
                <span style={{ fontSize: '20px', color: 'var(--cb-on-dark-soft)' }}>/ 100</span>
              </div>

              {/* 3 Pillar Progress Tracks */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--cb-on-dark-body)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Leaf size={13} color="var(--cb-semantic-up)" />
                      <span>Environmental ({normEnv}%)</span>
                    </span>
                    <span className="cb-mono" style={{ fontWeight: 600, color: '#ffffff' }}>{overallESGScore.environmental}/100</span>
                  </div>
                  <div className="cb-progress-track" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                    <div className="cb-progress-fill" style={{ width: overallESGScore.environmental + '%', backgroundColor: 'var(--cb-semantic-up)' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--cb-on-dark-body)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Users size={13} color="var(--cb-primary)" />
                      <span>Social ({normSoc}%)</span>
                    </span>
                    <span className="cb-mono" style={{ fontWeight: 600, color: '#ffffff' }}>{overallESGScore.social}/100</span>
                  </div>
                  <div className="cb-progress-track" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                    <div className="cb-progress-fill" style={{ width: overallESGScore.social + '%', backgroundColor: 'var(--cb-primary)' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                    <span style={{ color: 'var(--cb-on-dark-body)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ShieldCheck size={13} color="#f59e0b" />
                      <span>Governance ({normGov}%)</span>
                    </span>
                    <span className="cb-mono" style={{ fontWeight: 600, color: '#ffffff' }}>{overallESGScore.governance}/100</span>
                  </div>
                  <div className="cb-progress-track" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
                    <div className="cb-progress-fill" style={{ width: overallESGScore.governance + '%', backgroundColor: '#f59e0b' }} />
                  </div>
                </div>
              </div>

              <div style={{
                paddingTop: '14px',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '11px',
                color: 'var(--cb-on-dark-soft)'
              }}>
                <span>Weighting Formula:</span>
                <span className="cb-mono" style={{ color: '#ffffff', fontWeight: 600 }}>
                  {normEnv}% E + {normSoc}% S + {normGov}% G
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Up High-Impact Metrics Grid */}
        <div className="cb-grid-4" style={{ marginBottom: '28px' }}>
          
          <div className="cb-card" onClick={() => onNavigate('environmental')} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span className="cb-caption" style={{ color: 'var(--cb-muted)' }}>OPERATIONAL CARBON</span>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--cb-primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cb-primary)' }}>
                <Flame size={16} />
              </div>
            </div>
            <div className="cb-mono" style={{ fontSize: '32px', fontWeight: 700, color: 'var(--cb-ink)', lineHeight: 1.1 }}>
              {totalCarbonTonnes}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--cb-muted)', marginTop: '4px' }}>
              tCO2e GHG Total Emitted
            </div>
            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--cb-primary)', fontWeight: 600 }}>
              <span>View Carbon Ledger</span>
              <ArrowRight size={12} />
            </div>
          </div>

          <div className="cb-card" onClick={() => onNavigate('social')} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span className="cb-caption" style={{ color: 'var(--cb-muted)' }}>CSR INITIATIVES</span>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--cb-semantic-up-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--cb-semantic-up)' }}>
                <Users size={16} />
              </div>
            </div>
            <div className="cb-mono" style={{ fontSize: '32px', fontWeight: 700, color: 'var(--cb-ink)', lineHeight: 1.1 }}>
              {activeCsrCount}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--cb-muted)', marginTop: '4px' }}>
              Active Drives ({pendingApprovalsCount} in review)
            </div>
            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--cb-semantic-up)', fontWeight: 600 }}>
              <span>Review Evidence</span>
              <ArrowRight size={12} />
            </div>
          </div>

          <div className="cb-card" onClick={() => onNavigate('governance')} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span className="cb-caption" style={{ color: 'var(--cb-muted)' }}>AUDITS & COMPLIANCE</span>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: overdueIssues.length > 0 ? 'var(--cb-semantic-down-bg)' : 'var(--cb-primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: overdueIssues.length > 0 ? 'var(--cb-semantic-down)' : 'var(--cb-primary)' }}>
                <ShieldCheck size={16} />
              </div>
            </div>
            <div className="cb-mono" style={{ fontSize: '32px', fontWeight: 700, color: overdueIssues.length > 0 ? 'var(--cb-semantic-down)' : 'var(--cb-ink)', lineHeight: 1.1 }}>
              {state.transactions.audits.length}
            </div>
            <div style={{ fontSize: '13px', color: overdueIssues.length > 0 ? 'var(--cb-semantic-down)' : 'var(--cb-muted)', marginTop: '4px' }}>
              {overdueIssues.length > 0 ? overdueIssues.length + ' Overdue Issues!' : 'Audits Scheduled'}
            </div>
            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--cb-primary)', fontWeight: 600 }}>
              <span>View Policy Register</span>
              <ArrowRight size={12} />
            </div>
          </div>

          <div className="cb-card" onClick={() => onNavigate('gamification')} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span className="cb-caption" style={{ color: 'var(--cb-muted)' }}>CHALLENGES & XP</span>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--cb-accent-yellow-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#b45309' }}>
                <Award size={16} />
              </div>
            </div>
            <div className="cb-mono" style={{ fontSize: '32px', fontWeight: 700, color: '#b45309', lineHeight: 1.1 }}>
              {state.transactions.challenges.length}
            </div>
            <div style={{ fontSize: '13px', color: 'var(--cb-muted)', marginTop: '4px' }}>
              Sustainability Sprints Active
            </div>
            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#b45309', fontWeight: 600 }}>
              <span>Enter Reward Store</span>
              <ArrowRight size={12} />
            </div>
          </div>

        </div>

        {/* 2-Column: Department Score Leaderboard + Carbon Scope Breakdown */}
        <div className="cb-grid-2" style={{ marginBottom: '28px' }}>
          
          <div className="cb-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h3 className="cb-title-lg" style={{ color: 'var(--cb-ink)' }}>Department ESG Rankings</h3>
                <p className="cb-body-sm">Dynamic multi-pillar performance rating</p>
              </div>
              <button
                onClick={() => onNavigate('settings')}
                className="cb-btn cb-btn-outline cb-btn-sm"
              >
                <span>Adjust Weights</span>
              </button>
            </div>

            <div className="cb-table-container">
              <table className="cb-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Department</th>
                    <th>Env</th>
                    <th>Soc</th>
                    <th>Gov</th>
                    <th>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {departmentScores.map(dept => (
                    <tr key={dept.departmentId}>
                      <td>
                        <span className="cb-badge cb-badge-neutral cb-mono" style={{ fontWeight: 700 }}>
                          #{dept.rank}
                        </span>
                      </td>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--cb-ink)' }}>{dept.departmentName}</div>
                      </td>
                      <td className="cb-mono" style={{ color: 'var(--cb-semantic-up)', fontWeight: 600 }}>{dept.environmentalScore}</td>
                      <td className="cb-mono" style={{ color: 'var(--cb-primary)', fontWeight: 600 }}>{dept.socialScore}</td>
                      <td className="cb-mono" style={{ color: '#d97706', fontWeight: 600 }}>{dept.governanceScore}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="cb-mono" style={{ fontSize: '15px', fontWeight: 700, color: 'var(--cb-ink)' }}>
                            {dept.totalScore}
                          </span>
                          <div style={{ width: '40px', height: '6px', backgroundColor: 'var(--cb-surface-strong)', borderRadius: 'var(--cb-radius-pill)' }}>
                            <div style={{ width: dept.totalScore + '%', height: '100%', backgroundColor: 'var(--cb-primary)', borderRadius: 'var(--cb-radius-pill)' }} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="cb-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
              <div>
                <h3 className="cb-title-lg" style={{ color: 'var(--cb-ink)' }}>Carbon Accounting by Scope</h3>
                <p className="cb-body-sm">GHG Protocol certified scope distribution</p>
              </div>
              <span className="cb-badge cb-badge-primary cb-mono">
                {totalCarbonKg.toLocaleString()} kg CO2e
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '8px' }}>
              <div style={{ padding: '14px', borderRadius: 'var(--cb-radius-md)', backgroundColor: 'var(--cb-surface-soft)', border: '1px solid var(--cb-hairline-soft)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--cb-ink)' }}>Scope 1: Direct Operations</span>
                  </div>
                  <span className="cb-mono" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--cb-ink)' }}>
                    {scope1Emissions.toLocaleString()} kg ({scope1Pct}%)
                  </span>
                </div>
                <div className="cb-progress-track">
                  <div className="cb-progress-fill" style={{ width: scope1Pct + '%', backgroundColor: '#ef4444' }} />
                </div>
              </div>

              <div style={{ padding: '14px', borderRadius: 'var(--cb-radius-md)', backgroundColor: 'var(--cb-surface-soft)', border: '1px solid var(--cb-hairline-soft)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--cb-ink)' }}>Scope 2: Purchased Electricity</span>
                  </div>
                  <span className="cb-mono" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--cb-ink)' }}>
                    {scope2Emissions.toLocaleString()} kg ({scope2Pct}%)
                  </span>
                </div>
                <div className="cb-progress-track">
                  <div className="cb-progress-fill" style={{ width: scope2Pct + '%', backgroundColor: '#f59e0b' }} />
                </div>
              </div>

              <div style={{ padding: '14px', borderRadius: 'var(--cb-radius-md)', backgroundColor: 'var(--cb-surface-soft)', border: '1px solid var(--cb-hairline-soft)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--cb-primary)' }} />
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--cb-ink)' }}>Scope 3: Value Chain & Travel</span>
                  </div>
                  <span className="cb-mono" style={{ fontSize: '13px', fontWeight: 700, color: 'var(--cb-ink)' }}>
                    {scope3Emissions.toLocaleString()} kg ({scope3Pct}%)
                  </span>
                </div>
                <div className="cb-progress-track">
                  <div className="cb-progress-fill" style={{ width: scope3Pct + '%', backgroundColor: 'var(--cb-primary)' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Goals Grid */}
        <div className="cb-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h3 className="cb-title-lg" style={{ color: 'var(--cb-ink)' }}>Corporate Sustainability Targets</h3>
              <p className="cb-body-sm">Science-based net-zero reduction roadmaps</p>
            </div>
            <button
              onClick={() => onNavigate('environmental')}
              className="cb-btn cb-btn-secondary cb-btn-sm"
            >
              <span>Manage Goals</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div className="cb-grid-3">
            {state.master.goals.map(goal => {
              const progressPct = Math.min(100, Math.round(((goal.currentValue - goal.baselineValue) / (goal.targetValue - goal.baselineValue)) * 100)) || 65;
              return (
                <div
                  key={goal.id}
                  style={{
                    padding: '16px',
                    borderRadius: 'var(--cb-radius-lg)',
                    border: '1px solid var(--cb-hairline)',
                    backgroundColor: 'var(--cb-canvas)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span className="cb-badge cb-badge-neutral cb-mono" style={{ fontSize: '11px' }}>
                      Target {goal.targetYear}
                    </span>
                    <span className={'cb-badge ' + (goal.status === 'On Track' ? 'cb-badge-up' : 'cb-badge-warning')}>
                      {goal.status}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--cb-ink)', marginBottom: '8px' }}>
                    {goal.title}
                  </h4>

                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--cb-body)', marginBottom: '6px' }}>
                    <span>Current: <strong className="cb-mono" style={{ color: 'var(--cb-ink)' }}>{goal.currentValue} {goal.unit}</strong></span>
                    <span>Target: <strong className="cb-mono" style={{ color: 'var(--cb-primary)' }}>{goal.targetValue} {goal.unit}</strong></span>
                  </div>

                  <div className="cb-progress-track">
                    <div className="cb-progress-fill" style={{ width: Math.abs(progressPct) + '%' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
