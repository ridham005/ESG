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
    <div style={{ padding: '32px 0 60px' }}>
      <div className="cb-container">
        
        {/* Dark Hero Band */}
        <div className="cb-card-dark-highlight" style={{ marginBottom: '32px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 0.8fr',
            gap: '32px',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                <span className="cb-badge cb-badge-primary" style={{ backgroundColor: 'rgba(0, 82, 255, 0.2)', color: '#60a5fa' }}>
                  INSTITUTIONAL ESG SCORECARD
                </span>
                <span style={{ fontSize: '13px', color: 'var(--cb-on-dark-soft)' }} className="cb-mono">
                  LIVE RECOMPUTATION ACTIVE
                </span>
              </div>

              <h1 className="cb-display-mega" style={{ color: '#ffffff', marginBottom: '16px' }}>
                Net-Zero & ESG Intelligence.
              </h1>

              <p className="cb-body-md" style={{ color: 'var(--cb-on-dark-body)', fontSize: '16px', maxWidth: '540px', marginBottom: '28px' }}>
                Integrated enterprise ESG accounting connecting real-time operational ERP data, employee sustainability challenges, and board-level governance audits.
              </p>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <button
                  onClick={openERPSimulator}
                  className="cb-btn cb-btn-primary cb-btn-pill-cta"
                >
                  <span>Record ERP Emissions</span>
                  <ArrowRight size={18} />
                </button>

                <button
                  onClick={() => onNavigate('reports')}
                  className="cb-btn cb-btn-dark-outline"
                >
                  <span>Export ESG Summary Report</span>
                </button>
              </div>
            </div>

            <div style={{
              backgroundColor: 'var(--cb-surface-dark-elevated)',
              border: '1px solid var(--cb-surface-dark-border)',
              borderRadius: 'var(--cb-radius-xl)',
              padding: '28px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <div style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--cb-on-dark-soft)', fontWeight: 600 }}>
                    Overall Corporate ESG Score
                  </div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '6px' }}>
                    <span className="cb-mono" style={{ fontSize: '48px', fontWeight: 700, color: '#ffffff', lineHeight: 1 }}>
                      {overallESGScore.total}
                    </span>
                    <span style={{ fontSize: '16px', color: 'var(--cb-on-dark-soft)', fontWeight: 500 }}>/ 100</span>
                    <span className="cb-badge cb-badge-up" style={{ marginLeft: '6px' }}>
                      <TrendingUp size={12} />
                      <span>Top 8% Tier</span>
                    </span>
                  </div>
                </div>

                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: 'var(--cb-radius-full)',
                  backgroundColor: 'rgba(0, 82, 255, 0.15)',
                  border: '1px solid rgba(0, 82, 255, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--cb-primary)'
                }}>
                  <Zap size={22} />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--cb-on-dark-body)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Leaf size={14} color="var(--cb-semantic-up)" />
                      Environmental ({state.config.weights.env}%)
                    </span>
                    <span className="cb-mono" style={{ fontWeight: 600, color: '#ffffff' }}>
                      {overallESGScore.environmental} / 100
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#262a33', borderRadius: 'var(--cb-radius-pill)', overflow: 'hidden' }}>
                    <div style={{ width: overallESGScore.environmental + '%', height: '100%', backgroundColor: 'var(--cb-semantic-up)', borderRadius: 'var(--cb-radius-pill)' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--cb-on-dark-body)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Users size={14} color="#60a5fa" />
                      Social ({state.config.weights.soc}%)
                    </span>
                    <span className="cb-mono" style={{ fontWeight: 600, color: '#ffffff' }}>
                      {overallESGScore.social} / 100
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#262a33', borderRadius: 'var(--cb-radius-pill)', overflow: 'hidden' }}>
                    <div style={{ width: overallESGScore.social + '%', height: '100%', backgroundColor: 'var(--cb-primary)', borderRadius: 'var(--cb-radius-pill)' }} />
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '6px' }}>
                    <span style={{ color: 'var(--cb-on-dark-body)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ShieldCheck size={14} color="#f59e0b" />
                      Governance ({state.config.weights.gov}%)
                    </span>
                    <span className="cb-mono" style={{ fontWeight: 600, color: '#ffffff' }}>
                      {overallESGScore.governance} / 100
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '6px', backgroundColor: '#262a33', borderRadius: 'var(--cb-radius-pill)', overflow: 'hidden' }}>
                    <div style={{ width: overallESGScore.governance + '%', height: '100%', backgroundColor: '#f59e0b', borderRadius: 'var(--cb-radius-pill)' }} />
                  </div>
                </div>
              </div>

              <div style={{
                marginTop: '20px',
                paddingTop: '16px',
                borderTop: '1px solid var(--cb-surface-dark-border)',
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: '12px',
                color: 'var(--cb-on-dark-soft)'
              }}>
                <span>Weights: {state.config.weights.env}% E + {state.config.weights.soc}% S + {state.config.weights.gov}% G</span>
                <span 
                  onClick={() => onNavigate('settings')}
                  style={{ color: 'var(--cb-primary)', cursor: 'pointer', fontWeight: 600 }}
                >
                  Configure
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 4 KPI Cards */}
        <div className="cb-grid-4" style={{ marginBottom: '32px' }}>
          <div className="cb-card" onClick={() => onNavigate('environmental')} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span className="cb-caption" style={{ color: 'var(--cb-muted)' }}>OPERATIONAL CARBON</span>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--cb-surface-strong)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--cb-primary)'
              }}>
                <Flame size={16} />
              </div>
            </div>
            <div className="cb-mono" style={{ fontSize: '28px', fontWeight: 700, color: 'var(--cb-ink)', lineHeight: 1.1 }}>
              {totalCarbonTonnes} <span style={{ fontSize: '15px', fontWeight: 500, color: 'var(--cb-muted)' }}>tCO2e</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
              <span className="cb-badge cb-badge-up" style={{ fontSize: '11px', padding: '2px 8px' }}>-4.2%</span>
              <span style={{ fontSize: '12px', color: 'var(--cb-muted)' }}>vs prior quarter</span>
            </div>
          </div>

          <div className="cb-card" onClick={() => onNavigate('social')} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span className="cb-caption" style={{ color: 'var(--cb-muted)' }}>SOCIAL & CSR</span>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--cb-surface-strong)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--cb-primary)'
              }}>
                <Users size={16} />
              </div>
            </div>
            <div className="cb-mono" style={{ fontSize: '28px', fontWeight: 700, color: 'var(--cb-ink)', lineHeight: 1.1 }}>
              {activeCsrCount} <span style={{ fontSize: '15px', fontWeight: 500, color: 'var(--cb-muted)' }}>Active</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
              {pendingApprovalsCount > 0 ? (
                <span className="cb-badge cb-badge-warning" style={{ fontSize: '11px', padding: '2px 8px' }}>
                  {pendingApprovalsCount} Submissions Pending
                </span>
              ) : (
                <span className="cb-badge cb-badge-up" style={{ fontSize: '11px', padding: '2px 8px' }}>
                  All Approved
                </span>
              )}
            </div>
          </div>

          <div className="cb-card" onClick={() => onNavigate('governance')} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span className="cb-caption" style={{ color: 'var(--cb-muted)' }}>GOVERNANCE AUDITS</span>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--cb-surface-strong)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: overdueIssues.length > 0 ? 'var(--cb-semantic-down)' : 'var(--cb-semantic-up)'
              }}>
                <ShieldCheck size={16} />
              </div>
            </div>
            <div className="cb-mono" style={{ fontSize: '28px', fontWeight: 700, color: 'var(--cb-ink)', lineHeight: 1.1 }}>
              {state.transactions.audits.length} <span style={{ fontSize: '15px', fontWeight: 500, color: 'var(--cb-muted)' }}>Audits</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
              {overdueIssues.length > 0 ? (
                <span className="cb-badge cb-badge-down" style={{ fontSize: '11px', padding: '2px 8px' }}>
                  🚨 {overdueIssues.length} Overdue Issue
                </span>
              ) : (
                <span className="cb-badge cb-badge-up" style={{ fontSize: '11px', padding: '2px 8px' }}>
                  100% On-Schedule
                </span>
              )}
            </div>
          </div>

          <div className="cb-card" onClick={() => onNavigate('gamification')} style={{ cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span className="cb-caption" style={{ color: 'var(--cb-muted)' }}>GAMIFICATION</span>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: 'var(--cb-surface-strong)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--cb-primary)'
              }}>
                <Award size={16} />
              </div>
            </div>
            <div className="cb-mono" style={{ fontSize: '28px', fontWeight: 700, color: 'var(--cb-ink)', lineHeight: 1.1 }}>
              {state.master.userBadges.length} <span style={{ fontSize: '15px', fontWeight: 500, color: 'var(--cb-muted)' }}>Badges</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
              <span className="cb-badge cb-badge-neutral" style={{ fontSize: '11px', padding: '2px 8px' }}>
                {state.transactions.challenges.filter(c => c.status === 'Active').length} Active Challenges
              </span>
            </div>
          </div>
        </div>

        {/* 2-Column Section */}
        <div className="cb-grid-2" style={{ marginBottom: '32px' }}>
          <div className="cb-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 className="cb-title-lg" style={{ color: 'var(--cb-ink)' }}>Department ESG Rankings</h3>
                <p className="cb-body-sm">Dynamic composite scores and organizational rankings</p>
              </div>
              <button
                onClick={() => onNavigate('reports')}
                className="cb-btn cb-btn-outline cb-btn-sm"
              >
                Full Analysis
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
                    <th>Total Score</th>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 className="cb-title-lg" style={{ color: 'var(--cb-ink)' }}>Carbon Accounting by Scope</h3>
                <p className="cb-body-sm">GHG Protocol certified scope distribution</p>
              </div>
              <span className="cb-badge cb-badge-primary cb-mono">
                {totalCarbonKg.toLocaleString()} kg CO2e
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' }}>
              <div style={{ padding: '16px', borderRadius: 'var(--cb-radius-md)', backgroundColor: 'var(--cb-surface-soft)', border: '1px solid var(--cb-hairline-soft)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ef4444' }} />
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--cb-ink)' }}>Scope 1: Direct Operations</span>
                  </div>
                  <span className="cb-mono" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--cb-ink)' }}>
                    {scope1Emissions.toLocaleString()} kg ({scope1Pct}%)
                  </span>
                </div>
                <div className="cb-progress-track">
                  <div className="cb-progress-fill" style={{ width: scope1Pct + '%', backgroundColor: '#ef4444' }} />
                </div>
              </div>

              <div style={{ padding: '16px', borderRadius: 'var(--cb-radius-md)', backgroundColor: 'var(--cb-surface-soft)', border: '1px solid var(--cb-hairline-soft)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#f59e0b' }} />
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--cb-ink)' }}>Scope 2: Purchased Electricity</span>
                  </div>
                  <span className="cb-mono" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--cb-ink)' }}>
                    {scope2Emissions.toLocaleString()} kg ({scope2Pct}%)
                  </span>
                </div>
                <div className="cb-progress-track">
                  <div className="cb-progress-fill" style={{ width: scope2Pct + '%', backgroundColor: '#f59e0b' }} />
                </div>
              </div>

              <div style={{ padding: '16px', borderRadius: 'var(--cb-radius-md)', backgroundColor: 'var(--cb-surface-soft)', border: '1px solid var(--cb-hairline-soft)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--cb-primary)' }} />
                    <span style={{ fontSize: '14px', fontWeight: 600, color: 'var(--cb-ink)' }}>Scope 3: Value Chain & Travel</span>
                  </div>
                  <span className="cb-mono" style={{ fontSize: '14px', fontWeight: 700, color: 'var(--cb-ink)' }}>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
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
                    padding: '20px',
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
