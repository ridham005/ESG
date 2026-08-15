import React, { useState } from 'react';
import { useEcoSphere } from '../../context/EcoSphereContext';
import { 
  ShieldCheck, 
  Plus, 
  AlertTriangle, 
  CheckCircle, 
  UserCheck
} from 'lucide-react';

export const GovernanceModule: React.FC = () => {
  const { 
    state, 
    currentUser, 
    acknowledgePolicy, 
    addPolicy, 
    addAudit, 
    addComplianceIssue, 
    updateComplianceIssue 
  } = useEcoSphere();

  const [activeSubtab, setActiveSubtab] = useState<'policies' | 'audits' | 'issues'>('policies');

  // New Policy Modal
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  const [polTitle, setPolTitle] = useState('');
  const [polCode, setPolCode] = useState('POL-GOV-04');
  const [polCategory, setPolCategory] = useState('Governance');
  const [polVersion, setPolVersion] = useState('v1.0');
  const [polSummary, setPolSummary] = useState('');

  // New Audit Modal
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [audTitle, setAudTitle] = useState('');
  const [audType, setAudType] = useState<'Internal' | 'External' | 'Regulatory'>('Internal');
  const [audLead, setAudLead] = useState('Marcus Sterling');
  const [audDeptId, setAudDeptId] = useState(state.master.departments[0]?.id || 'dept-1');
  const [audDate, setAudDate] = useState('2026-10-15');

  // New Issue Modal
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [issTitle, setIssTitle] = useState('');
  const [issSeverity, setIssSeverity] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('High');
  const [issDesc, setIssDesc] = useState('');
  const [issOwnerId, setIssOwnerId] = useState(state.users[0]?.id || 'usr-1');
  const [issDueDate, setIssDueDate] = useState('2026-08-30');

  const handleCreatePolicy = (e: React.FormEvent) => {
    e.preventDefault();
    addPolicy({
      title: polTitle,
      code: polCode,
      category: polCategory,
      version: polVersion,
      effectiveDate: new Date().toISOString().substring(0, 10),
      summary: polSummary,
      content: polSummary,
      status: 'Active'
    });
    setIsPolicyModalOpen(false);
    setPolTitle('');
  };

  const handleCreateAudit = (e: React.FormEvent) => {
    e.preventDefault();
    addAudit({
      title: audTitle,
      auditType: audType,
      leadAuditor: audLead,
      departmentId: audDeptId,
      scheduledDate: audDate,
      findingsCount: 0,
      status: 'Scheduled'
    });
    setIsAuditModalOpen(false);
    setAudTitle('');
  };

  const handleCreateIssue = (e: React.FormEvent) => {
    e.preventDefault();
    addComplianceIssue({
      title: issTitle,
      severity: issSeverity,
      description: issDesc,
      ownerEmployeeId: issOwnerId,
      dueDate: issDueDate
    });
    setIsIssueModalOpen(false);
    setIssTitle('');
    setIssDesc('');
  };

  return (
    <div style={{ padding: '32px 0 60px' }}>
      <div className="cb-container">
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="cb-badge cb-badge-primary">MODULE 03</span>
              <span className="cb-caption" style={{ color: 'var(--cb-muted)' }}>COMPLIANCE, RISK & ETHICS</span>
            </div>
            <h1 className="cb-display-lg" style={{ color: 'var(--cb-ink)' }}>Governance & Compliance</h1>
            <p className="cb-body-md">Corporate ESG policy hub, 1-click digital acknowledgements, scheduled audits, and violation tracking.</p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setIsIssueModalOpen(true)}
              className="cb-btn cb-btn-secondary"
            >
              <AlertTriangle size={15} color="var(--cb-semantic-down)" />
              <span>Log Compliance Issue</span>
            </button>
          </div>
        </div>

        {/* Subtabs */}
        <div style={{ marginBottom: '24px' }}>
          <div className="cb-tabs">
            <button
              onClick={() => setActiveSubtab('policies')}
              className={'cb-tab-item ' + (activeSubtab === 'policies' ? 'active' : '')}
            >
              ESG Policies & Sign-Offs ({state.master.policies.length})
            </button>
            <button
              onClick={() => setActiveSubtab('audits')}
              className={'cb-tab-item ' + (activeSubtab === 'audits' ? 'active' : '')}
            >
              Compliance Audits ({state.transactions.audits.length})
            </button>
            <button
              onClick={() => setActiveSubtab('issues')}
              className={'cb-tab-item ' + (activeSubtab === 'issues' ? 'active' : '')}
            >
              Compliance Issues & Overdue Violations ({state.transactions.complianceIssues.length})
            </button>
          </div>
        </div>

        {/* SUBTAB 1: Policies & Sign-Offs */}
        {activeSubtab === 'policies' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 className="cb-title-md">Corporate ESG Policies</h3>
                <p className="cb-body-sm">Standard Operating Procedures with timestamped digital employee signatures</p>
              </div>
              {currentUser.role === 'ADMIN' && (
                <button
                  onClick={() => setIsPolicyModalOpen(true)}
                  className="cb-btn cb-btn-secondary cb-btn-sm"
                >
                  <Plus size={15} />
                  <span>Draft Policy</span>
                </button>
              )}
            </div>

            <div className="cb-grid-3">
              {state.master.policies.map(policy => {
                const isSigned = state.transactions.policyAcknowledgements.some(
                  pa => pa.policyId === policy.id && pa.employeeId === currentUser.id
                );
                const signatureRecord = state.transactions.policyAcknowledgements.find(
                  pa => pa.policyId === policy.id && pa.employeeId === currentUser.id
                );

                const totalSigned = state.transactions.policyAcknowledgements.filter(
                  pa => pa.policyId === policy.id
                ).length;

                return (
                  <div key={policy.id} className="cb-card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span className="cb-badge cb-badge-neutral cb-mono">{policy.code}</span>
                      <span className="cb-badge cb-badge-primary">{policy.category}</span>
                    </div>

                    <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--cb-ink)', marginBottom: '8px' }}>
                      {policy.title}
                    </h4>

                    <p style={{ fontSize: '13px', color: 'var(--cb-body)', lineHeight: 1.4, marginBottom: '16px', flex: 1 }}>
                      {policy.summary}
                    </p>

                    <div style={{ padding: '10px 12px', backgroundColor: 'var(--cb-surface-soft)', borderRadius: 'var(--cb-radius-md)', marginBottom: '16px', fontSize: '12px', color: 'var(--cb-muted)' }}>
                      <div>Version: <strong className="cb-mono" style={{ color: 'var(--cb-ink)' }}>{policy.version}</strong></div>
                      <div>Effective Date: {policy.effectiveDate}</div>
                      <div>Total Company Sign-Offs: <strong className="cb-mono" style={{ color: 'var(--cb-primary)' }}>{totalSigned} employees</strong></div>
                    </div>

                    {isSigned ? (
                      <div className="cb-badge cb-badge-up" style={{ padding: '8px', justifyContent: 'center' }}>
                        <CheckCircle size={15} />
                        <span>Signed by You ({signatureRecord?.acknowledgedAt.substring(0, 10)})</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => acknowledgePolicy(policy.id)}
                        className="cb-btn cb-btn-primary"
                      >
                        <UserCheck size={15} />
                        <span>Acknowledge & Sign Policy</span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SUBTAB 2: Compliance Audits */}
        {activeSubtab === 'audits' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 className="cb-title-md">Scheduled ESG Audits & Inspections</h3>
                <p className="cb-body-sm">ISO 14001, OSHA, and third-party assurance evaluations</p>
              </div>
              <button
                onClick={() => setIsAuditModalOpen(true)}
                className="cb-btn cb-btn-secondary cb-btn-sm"
              >
                <Plus size={15} />
                <span>Schedule Audit</span>
              </button>
            </div>

            <div className="cb-table-container">
              <table className="cb-table">
                <thead>
                  <tr>
                    <th>Audit Title</th>
                    <th>Type</th>
                    <th>Lead Auditor</th>
                    <th>Department</th>
                    <th>Scheduled Date</th>
                    <th>Findings</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {state.transactions.audits.map(audit => {
                    const dept = state.master.departments.find(d => d.id === audit.departmentId);
                    return (
                      <tr key={audit.id}>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--cb-ink)' }}>{audit.title}</div>
                        </td>
                        <td>
                          <span className="cb-badge cb-badge-neutral">{audit.auditType}</span>
                        </td>
                        <td>{audit.leadAuditor}</td>
                        <td>{dept?.name || audit.departmentId}</td>
                        <td className="cb-mono">{audit.scheduledDate}</td>
                        <td>
                          <span className={'cb-badge cb-mono ' + (audit.findingsCount > 0 ? 'cb-badge-warning' : 'cb-badge-up')}>
                            {audit.findingsCount} Findings
                          </span>
                        </td>
                        <td>
                          <span className={'cb-badge ' + (audit.status === 'Completed' ? 'cb-badge-up' : 'cb-badge-primary')}>
                            {audit.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SUBTAB 3: Compliance Issues & Overdue Violations */}
        {activeSubtab === 'issues' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 className="cb-title-md">Compliance Issue Register</h3>
                <p className="cb-body-sm">Mandatory ownership and automated overdue date tracking</p>
              </div>
              <button
                onClick={() => setIsIssueModalOpen(true)}
                className="cb-btn cb-btn-secondary cb-btn-sm"
              >
                <Plus size={15} />
                <span>Log New Issue</span>
              </button>
            </div>

            <div className="cb-table-container">
              <table className="cb-table">
                <thead>
                  <tr>
                    <th>Severity</th>
                    <th>Issue Description</th>
                    <th>Assigned Owner</th>
                    <th>Due Date</th>
                    <th>Status</th>
                    <th>Resolution Action</th>
                  </tr>
                </thead>
                <tbody>
                  {state.transactions.complianceIssues.map(issue => {
                    const owner = state.users.find(u => u.id === issue.ownerEmployeeId);
                    const isOverdue = issue.status === 'Overdue';

                    return (
                      <tr key={issue.id} style={{ backgroundColor: isOverdue ? 'rgba(207, 32, 47, 0.03)' : undefined }}>
                        <td>
                          <span className={'cb-badge ' + (issue.severity === 'Critical' || issue.severity === 'High' ? 'cb-badge-down' : 'cb-badge-warning')}>
                            {issue.severity}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--cb-ink)' }}>{issue.title}</div>
                          <div style={{ fontSize: '13px', color: 'var(--cb-body)', marginTop: '2px' }}>{issue.description}</div>
                          {issue.resolutionNotes && (
                            <div style={{ fontSize: '12px', color: 'var(--cb-semantic-up)', marginTop: '4px' }}>
                              ✅ Resolution: {issue.resolutionNotes}
                            </div>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <img
                              src={owner?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                              alt=""
                              style={{ width: '24px', height: '24px', borderRadius: '50%' }}
                            />
                            <span style={{ fontWeight: 500 }}>{owner?.name}</span>
                          </div>
                        </td>
                        <td>
                          <span className={'cb-mono ' + (isOverdue ? 'cb-badge cb-badge-down' : '')} style={{ fontWeight: 600 }}>
                            {issue.dueDate}
                          </span>
                        </td>
                        <td>
                          <span className={'cb-badge ' + (isOverdue ? 'cb-badge-down' : issue.status === 'Resolved' ? 'cb-badge-up' : 'cb-badge-warning')}>
                            {isOverdue ? '🚨 Overdue' : issue.status}
                          </span>
                        </td>
                        <td>
                          {issue.status !== 'Resolved' ? (
                            <button
                              onClick={() => updateComplianceIssue(issue.id, { status: 'Resolved', resolutionNotes: 'Resolved and closed by ' + currentUser.name })}
                              className="cb-btn cb-btn-outline cb-btn-sm"
                              style={{ height: '28px', fontSize: '12px' }}
                            >
                              <CheckCircle size={13} />
                              <span>Mark Resolved</span>
                            </button>
                          ) : (
                            <span style={{ fontSize: '12px', color: 'var(--cb-semantic-up)' }}>Closed</span>
                          )}
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

      {/* Modal: Draft Policy */}
      {isPolicyModalOpen && (
        <div className="cb-modal-overlay">
          <div className="cb-modal-content">
            <div style={{ padding: '24px', borderBottom: '1px solid var(--cb-hairline)' }}>
              <h3 className="cb-title-lg">Draft New ESG Policy</h3>
            </div>
            <form onSubmit={handleCreatePolicy} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Policy Title</label>
                <input
                  type="text"
                  placeholder="e.g. Sustainable Supply Chain Code"
                  value={polTitle}
                  onChange={e => setPolTitle(e.target.value)}
                  className="cb-input"
                  required
                />
              </div>
              <div className="cb-grid-2">
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Category</label>
                  <select
                    value={polCategory}
                    onChange={e => setPolCategory(e.target.value)}
                    className="cb-select"
                  >
                    <option value="Environmental">Environmental</option>
                    <option value="Social">Social</option>
                    <option value="Governance">Governance</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Code</label>
                  <input
                    type="text"
                    value={polCode}
                    onChange={e => setPolCode(e.target.value)}
                    className="cb-input cb-mono"
                    required
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Policy Summary</label>
                <textarea
                  placeholder="Executive summary of expectations and compliance scope..."
                  value={polSummary}
                  onChange={e => setPolSummary(e.target.value)}
                  className="cb-textarea"
                  required
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsPolicyModalOpen(false)} className="cb-btn cb-btn-outline">Cancel</button>
                <button type="submit" className="cb-btn cb-btn-primary">Publish Policy</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Schedule Audit */}
      {isAuditModalOpen && (
        <div className="cb-modal-overlay">
          <div className="cb-modal-content">
            <div style={{ padding: '24px', borderBottom: '1px solid var(--cb-hairline)' }}>
              <h3 className="cb-title-lg">Schedule Compliance Audit</h3>
            </div>
            <form onSubmit={handleCreateAudit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Audit Title</label>
                <input
                  type="text"
                  placeholder="e.g. Energy Management ISO 50001 Review"
                  value={audTitle}
                  onChange={e => setAudTitle(e.target.value)}
                  className="cb-input"
                  required
                />
              </div>
              <div className="cb-grid-2">
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Audit Type</label>
                  <select
                    value={audType}
                    onChange={e => setAudType(e.target.value as any)}
                    className="cb-select"
                  >
                    <option value="Internal">Internal Audit</option>
                    <option value="External">External Independent Audit</option>
                    <option value="Regulatory">Regulatory Compliance Audit</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Audited Department</label>
                  <select
                    value={audDeptId}
                    onChange={e => setAudDeptId(e.target.value)}
                    className="cb-select"
                  >
                    {state.master.departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="cb-grid-2">
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Lead Auditor</label>
                  <input
                    type="text"
                    value={audLead}
                    onChange={e => setAudLead(e.target.value)}
                    className="cb-input"
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Scheduled Date</label>
                  <input
                    type="date"
                    value={audDate}
                    onChange={e => setAudDate(e.target.value)}
                    className="cb-input"
                    required
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsAuditModalOpen(false)} className="cb-btn cb-btn-outline">Cancel</button>
                <button type="submit" className="cb-btn cb-btn-primary">Schedule Audit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Log Compliance Issue */}
      {isIssueModalOpen && (
        <div className="cb-modal-overlay">
          <div className="cb-modal-content">
            <div style={{ padding: '24px', borderBottom: '1px solid var(--cb-hairline)' }}>
              <h3 className="cb-title-lg">Log Compliance Issue</h3>
              <p className="cb-body-sm">Assign owner and mandatory due date for resolution tracking</p>
            </div>
            <form onSubmit={handleCreateIssue} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Issue Summary</label>
                <input
                  type="text"
                  placeholder="e.g. Hazardous chemical disposal log overdue"
                  value={issTitle}
                  onChange={e => setIssTitle(e.target.value)}
                  className="cb-input"
                  required
                />
              </div>
              <div className="cb-grid-2">
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Severity</label>
                  <select
                    value={issSeverity}
                    onChange={e => setIssSeverity(e.target.value as any)}
                    className="cb-select"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Assigned Owner</label>
                  <select
                    value={issOwnerId}
                    onChange={e => setIssOwnerId(e.target.value)}
                    className="cb-select"
                  >
                    {state.users.map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Due Date</label>
                <input
                  type="date"
                  value={issDueDate}
                  onChange={e => setIssDueDate(e.target.value)}
                  className="cb-input"
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Description & Root Cause</label>
                <textarea
                  placeholder="Details of the violation, required remedy, and impacted systems..."
                  value={issDesc}
                  onChange={e => setIssDesc(e.target.value)}
                  className="cb-textarea"
                  required
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsIssueModalOpen(false)} className="cb-btn cb-btn-outline">Cancel</button>
                <button type="submit" className="cb-btn cb-btn-primary">Register Issue</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
