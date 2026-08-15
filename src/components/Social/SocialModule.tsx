import React, { useState } from 'react';
import { useEcoSphere } from '../../context/EcoSphereContext';
import { 
  Users, 
  Plus, 
  Calendar, 
  MapPin, 
  CheckCircle, 
  XCircle, 
  Upload, 
  AlertTriangle,
  FileCheck
} from 'lucide-react';

export const SocialModule: React.FC = () => {
  const { 
    state, 
    currentUser, 
    registerForCSRActivity, 
    submitCSRProof, 
    reviewCSRParticipation, 
    addCSRActivity 
  } = useEcoSphere();

  const [activeSubtab, setActiveSubtab] = useState<'activities' | 'verifications' | 'diversity' | 'training'>('activities');
  
  // Submit Proof Modal
  const [selectedActivityId, setSelectedActivityId] = useState<string | null>(null);
  const [proofFileName, setProofFileName] = useState('');
  const [proofNotes, setProofNotes] = useState('');
  
  // Create CSR Modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState(state.master.categories[0]?.id || 'cat-1');
  const [newDesc, setNewDesc] = useState('');
  const [newPoints, setNewPoints] = useState(150);
  const [newDate, setNewDate] = useState('2026-09-10');
  const [newLocation, setNewLocation] = useState('Metro Community Hub');
  const [newCapacity, setNewCapacity] = useState(30);

  // Review error feedback
  const [reviewError, setReviewError] = useState<string | null>(null);

  const handleOpenProofModal = (activityId: string) => {
    setSelectedActivityId(activityId);
    setProofFileName('csr-activity-verification.jpg');
    setProofNotes('');
  };

  const handleProofSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedActivityId) return;
    submitCSRProof(selectedActivityId, {
      fileName: proofFileName,
      notes: proofNotes
    });
    setSelectedActivityId(null);
  };

  const handleReview = (participationId: string, status: 'Approved' | 'Rejected') => {
    setReviewError(null);
    const res = reviewCSRParticipation(participationId, status);
    if (!res.success && res.error) {
      setReviewError(res.error);
    }
  };

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    addCSRActivity({
      title: newTitle,
      categoryId: newCategory,
      description: newDesc,
      pointsAwarded: newPoints,
      date: newDate,
      location: newLocation,
      maxParticipants: newCapacity,
      status: 'Upcoming'
    });
    setIsCreateModalOpen(false);
    setNewTitle('');
    setNewDesc('');
  };

  return (
    <div style={{ padding: '32px 0 60px' }}>
      <div className="cb-container">
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="cb-badge cb-badge-primary">MODULE 02</span>
              <span className="cb-caption" style={{ color: 'var(--cb-muted)' }}>HUMAN CAPITAL & COMMUNITY IMPACT</span>
            </div>
            <h1 className="cb-display-lg" style={{ color: 'var(--cb-ink)' }}>Social & CSR Engagement</h1>
            <p className="cb-body-md">Community volunteering, employee verification workflows, diversity metrics, and ESG training.</p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {currentUser.role === 'ADMIN' && (
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="cb-btn cb-btn-primary"
              >
                <Plus size={16} />
                <span>Create CSR Initiative</span>
              </button>
            )}
          </div>
        </div>

        {/* Subtabs */}
        <div style={{ marginBottom: '24px' }}>
          <div className="cb-tabs">
            <button
              onClick={() => setActiveSubtab('activities')}
              className={'cb-tab-item ' + (activeSubtab === 'activities' ? 'active' : '')}
            >
              CSR Initiatives ({state.transactions.csrActivities.length})
            </button>
            <button
              onClick={() => setActiveSubtab('verifications')}
              className={'cb-tab-item ' + (activeSubtab === 'verifications' ? 'active' : '')}
            >
              Verification Queue ({state.transactions.csrParticipations.length})
            </button>
            <button
              onClick={() => setActiveSubtab('diversity')}
              className={'cb-tab-item ' + (activeSubtab === 'diversity' ? 'active' : '')}
            >
              Diversity & Demographics
            </button>
            <button
              onClick={() => setActiveSubtab('training')}
              className={'cb-tab-item ' + (activeSubtab === 'training' ? 'active' : '')}
            >
              ESG Training ({state.trainingRecords.length})
            </button>
          </div>
        </div>

        {reviewError && (
          <div style={{
            padding: '16px 20px',
            borderRadius: 'var(--cb-radius-md)',
            backgroundColor: 'var(--cb-semantic-down-bg)',
            border: '1px solid var(--cb-semantic-down)',
            color: 'var(--cb-semantic-down)',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <AlertTriangle size={20} />
            <div style={{ flex: 1, fontSize: '14px', fontWeight: 600 }}>
              {reviewError}
            </div>
            <button
              onClick={() => setReviewError(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--cb-semantic-down)', fontWeight: 700 }}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* SUBTAB 1: CSR Initiatives */}
        {activeSubtab === 'activities' && (
          <div className="cb-grid-3">
            {state.transactions.csrActivities.map(activity => {
              const userParticipation = state.transactions.csrParticipations.find(
                cp => cp.activityId === activity.id && cp.employeeId === currentUser.id
              );

              return (
                <div key={activity.id} className="cb-card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <span className="cb-badge cb-badge-neutral">
                      {activity.status}
                    </span>
                    <span className="cb-badge cb-badge-primary cb-mono" style={{ fontWeight: 700 }}>
                      +{activity.pointsAwarded} PTS
                    </span>
                  </div>

                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--cb-ink)', marginBottom: '8px' }}>
                    {activity.title}
                  </h3>

                  <p style={{ fontSize: '14px', color: 'var(--cb-body)', lineHeight: 1.4, marginBottom: '16px', flex: 1 }}>
                    {activity.description}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', backgroundColor: 'var(--cb-surface-soft)', borderRadius: 'var(--cb-radius-md)', marginBottom: '18px', fontSize: '13px', color: 'var(--cb-body)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={14} color="var(--cb-muted)" />
                      <span>{activity.date}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <MapPin size={14} color="var(--cb-muted)" />
                      <span>{activity.location}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Users size={14} color="var(--cb-muted)" />
                      <span>{activity.registeredCount} / {activity.maxParticipants} Registered</span>
                    </div>
                  </div>

                  {userParticipation ? (
                    userParticipation.status === 'Approved' ? (
                      <div className="cb-badge cb-badge-up" style={{ padding: '8px', justifyContent: 'center' }}>
                        <CheckCircle size={15} />
                        <span>Completed & Verified (+{userParticipation.pointsEarned} PTS)</span>
                      </div>
                    ) : userParticipation.proofAttachmentName ? (
                      <div className="cb-badge cb-badge-warning" style={{ padding: '8px', justifyContent: 'center' }}>
                        <span>Evidence Under Review</span>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleOpenProofModal(activity.id)}
                        className="cb-btn cb-btn-secondary"
                      >
                        <Upload size={15} />
                        <span>Submit Proof Evidence</span>
                      </button>
                    )
                  ) : (
                    <button
                      onClick={() => registerForCSRActivity(activity.id)}
                      className="cb-btn cb-btn-primary"
                    >
                      <span>Join / Register</span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* SUBTAB 2: Verification Queue */}
        {activeSubtab === 'verifications' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
              padding: '12px 18px',
              borderRadius: 'var(--cb-radius-lg)',
              backgroundColor: 'var(--cb-surface-soft)',
              border: '1px solid var(--cb-hairline)'
            }}>
              <div style={{ fontSize: '13px', color: 'var(--cb-body)' }}>
                <strong>Evidence Enforcement Rule:</strong> {state.config.evidenceRequired ? (
                  <span style={{ color: 'var(--cb-semantic-up)', fontWeight: 600 }}>Active (Proof document mandatory before Admin approval)</span>
                ) : (
                  <span style={{ color: 'var(--cb-muted)' }}>Optional</span>
                )}
              </div>
              <span className="cb-badge cb-badge-neutral cb-mono">
                {state.transactions.csrParticipations.filter(p => p.status === 'Pending').length} Pending Review
              </span>
            </div>

            <div className="cb-table-container">
              <table className="cb-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>CSR Initiative</th>
                    <th>Submitted Proof File</th>
                    <th>Participant Notes</th>
                    <th>Status</th>
                    <th>Points</th>
                    <th>Admin Approval Action</th>
                  </tr>
                </thead>
                <tbody>
                  {state.transactions.csrParticipations.map(part => {
                    const employee = state.users.find(u => u.id === part.employeeId);
                    const activity = state.transactions.csrActivities.find(a => a.id === part.activityId);
                    const hasProof = !!part.proofAttachmentName || !!part.proofAttachmentUrl;

                    return (
                      <tr key={part.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <img
                              src={employee?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                              alt=""
                              style={{ width: '28px', height: '28px', borderRadius: '50%' }}
                            />
                            <div>
                              <div style={{ fontWeight: 600, color: 'var(--cb-ink)' }}>{employee?.name}</div>
                              <div style={{ fontSize: '11px', color: 'var(--cb-muted)' }}>{employee?.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{activity?.title}</div>
                          <div style={{ fontSize: '11px', color: 'var(--cb-muted)' }}>{activity?.date}</div>
                        </td>
                        <td>
                          {hasProof ? (
                            <a
                              href={part.proofAttachmentUrl || '#'}
                              target="_blank"
                              rel="noreferrer"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '13px',
                                color: 'var(--cb-primary)',
                                fontWeight: 600,
                                textDecoration: 'underline'
                              }}
                            >
                              <FileCheck size={14} />
                              <span>{part.proofAttachmentName || 'proof-photo.jpg'}</span>
                            </a>
                          ) : (
                            <span style={{ fontSize: '12px', color: 'var(--cb-semantic-down)', fontWeight: 600 }}>
                              ⚠️ No Proof Attached
                            </span>
                          )}
                        </td>
                        <td style={{ fontSize: '13px', color: 'var(--cb-body)', maxWidth: '240px' }}>
                          {part.proofNotes || 'No notes provided.'}
                        </td>
                        <td>
                          <span className={'cb-badge ' + (part.status === 'Approved' ? 'cb-badge-up' : part.status === 'Rejected' ? 'cb-badge-down' : 'cb-badge-warning')}>
                            {part.status}
                          </span>
                        </td>
                        <td className="cb-mono" style={{ fontWeight: 700, color: 'var(--cb-ink)' }}>
                          +{activity?.pointsAwarded} PTS
                        </td>
                        <td>
                          {part.status === 'Pending' ? (
                            <div style={{ display: 'flex', gap: '6px' }}>
                              <button
                                onClick={() => handleReview(part.id, 'Approved')}
                                className="cb-btn cb-btn-primary cb-btn-sm"
                                style={{ height: '30px', padding: '0 10px', fontSize: '12px' }}
                                title={!hasProof && state.config.evidenceRequired ? 'Cannot approve without proof when Evidence Requirement is enabled.' : 'Approve participation'}
                              >
                                <CheckCircle size={13} />
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={() => handleReview(part.id, 'Rejected')}
                                className="cb-btn cb-btn-outline cb-btn-sm"
                                style={{ height: '30px', padding: '0 10px', fontSize: '12px', color: 'var(--cb-semantic-down)' }}
                              >
                                <XCircle size={13} />
                                <span>Reject</span>
                              </button>
                            </div>
                          ) : (
                            <span style={{ fontSize: '12px', color: 'var(--cb-muted)' }}>
                              Reviewed by {part.reviewedBy || 'Admin'}
                            </span>
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

        {/* SUBTAB 3: Diversity & Demographics */}
        {activeSubtab === 'diversity' && (
          <div className="cb-grid-3">
            <div className="cb-card">
              <h3 className="cb-title-md" style={{ marginBottom: '16px' }}>Gender Parity</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                    <span>Female Representation</span>
                    <span className="cb-mono" style={{ fontWeight: 600 }}>46.5%</span>
                  </div>
                  <div className="cb-progress-track">
                    <div className="cb-progress-fill" style={{ width: '46.5%', backgroundColor: '#ec4899' }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                    <span>Male Representation</span>
                    <span className="cb-mono" style={{ fontWeight: 600 }}>51.2%</span>
                  </div>
                  <div className="cb-progress-track">
                    <div className="cb-progress-fill" style={{ width: '51.2%', backgroundColor: 'var(--cb-primary)' }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                    <span>Non-Binary / Undisclosed</span>
                    <span className="cb-mono" style={{ fontWeight: 600 }}>2.3%</span>
                  </div>
                  <div className="cb-progress-track">
                    <div className="cb-progress-fill" style={{ width: '2.3%', backgroundColor: '#a855f7' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="cb-card">
              <h3 className="cb-title-md" style={{ marginBottom: '16px' }}>Executive Leadership Diversity</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                    <span>Women in Director & VP Roles</span>
                    <span className="cb-mono" style={{ fontWeight: 600 }}>42.0%</span>
                  </div>
                  <div className="cb-progress-track">
                    <div className="cb-progress-fill" style={{ width: '42%', backgroundColor: 'var(--cb-semantic-up)' }} />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
                    <span>Underrepresented Minorities in Mgmt</span>
                    <span className="cb-mono" style={{ fontWeight: 600 }}>38.5%</span>
                  </div>
                  <div className="cb-progress-track">
                    <div className="cb-progress-fill" style={{ width: '38.5%', backgroundColor: '#f59e0b' }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="cb-card">
              <h3 className="cb-title-md" style={{ marginBottom: '16px' }}>Pay Equity Index</h3>
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div className="cb-mono" style={{ fontSize: '44px', fontWeight: 700, color: 'var(--cb-semantic-up)', lineHeight: 1 }}>
                  0.992
                </div>
                <div style={{ fontSize: '13px', color: 'var(--cb-muted)', marginTop: '8px' }}>
                  Adjusted gender & racial wage parity ratio (Benchmark: 1.000)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 4: ESG Training Tracking */}
        {activeSubtab === 'training' && (
          <div className="cb-table-container">
            <table className="cb-table">
              <thead>
                <tr>
                  <th>Course Title</th>
                  <th>Target Department</th>
                  <th>Compliance Requirement</th>
                  <th>Employees Completed</th>
                  <th>Completion Rate</th>
                </tr>
              </thead>
              <tbody>
                {state.trainingRecords.map(tr => {
                  const dept = state.master.departments.find(d => d.id === tr.departmentId);
                  return (
                    <tr key={tr.id}>
                      <td>
                        <div style={{ fontWeight: 600, color: 'var(--cb-ink)' }}>{tr.title}</div>
                      </td>
                      <td>{dept?.name || tr.departmentId}</td>
                      <td>
                        <span className={'cb-badge ' + (tr.mandatory ? 'cb-badge-warning' : 'cb-badge-neutral')}>
                          {tr.mandatory ? 'Mandatory Annual' : 'Elective'}
                        </span>
                      </td>
                      <td className="cb-mono">
                        {tr.completedEmployees} / {tr.totalEmployees}
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span className="cb-mono" style={{ fontWeight: 700 }}>{tr.completionPct}%</span>
                          <div style={{ width: '80px', height: '6px', backgroundColor: 'var(--cb-surface-strong)', borderRadius: 'var(--cb-radius-pill)' }}>
                            <div style={{ width: tr.completionPct + '%', height: '100%', backgroundColor: 'var(--cb-semantic-up)', borderRadius: 'var(--cb-radius-pill)' }} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>

      {/* Modal: Submit Proof */}
      {selectedActivityId && (
        <div className="cb-modal-overlay">
          <div className="cb-modal-content">
            <div style={{ padding: '24px', borderBottom: '1px solid var(--cb-hairline)' }}>
              <h3 className="cb-title-lg">Submit CSR Participation Proof</h3>
              <p className="cb-body-sm">Attach photo, sign-in sheet, or verification document</p>
            </div>
            <form onSubmit={handleProofSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Proof File Attachment</label>
                <div style={{
                  padding: '24px',
                  border: '2px dashed var(--cb-hairline)',
                  borderRadius: 'var(--cb-radius-lg)',
                  textAlign: 'center',
                  backgroundColor: 'var(--cb-surface-soft)'
                }}>
                  <Upload size={28} color="var(--cb-primary)" style={{ margin: '0 auto 8px' }} />
                  <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--cb-ink)' }}>{proofFileName}</p>
                  <p style={{ fontSize: '12px', color: 'var(--cb-muted)' }}>JPG, PNG, or PDF file up to 10MB</p>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Participation Notes</label>
                <textarea
                  placeholder="Describe your volunteer tasks and hours completed..."
                  value={proofNotes}
                  onChange={e => setProofNotes(e.target.value)}
                  className="cb-textarea"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setSelectedActivityId(null)} className="cb-btn cb-btn-outline">Cancel</button>
                <button type="submit" className="cb-btn cb-btn-primary">Submit for Verification</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create CSR */}
      {isCreateModalOpen && (
        <div className="cb-modal-overlay">
          <div className="cb-modal-content">
            <div style={{ padding: '24px', borderBottom: '1px solid var(--cb-hairline)' }}>
              <h3 className="cb-title-lg">Create CSR Initiative</h3>
              <p className="cb-body-sm">Launch a new corporate social responsibility event</p>
            </div>
            <form onSubmit={handleCreateActivity} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Initiative Title</label>
                <input
                  type="text"
                  placeholder="e.g. Wetland Habitat Restoration"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="cb-input"
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Description</label>
                <textarea
                  placeholder="Event purpose, tasks, and community benefits..."
                  value={newDesc}
                  onChange={e => setNewDesc(e.target.value)}
                  className="cb-textarea"
                  required
                />
              </div>

              <div className="cb-grid-2">
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Points Reward</label>
                  <input
                    type="number"
                    value={newPoints}
                    onChange={e => setNewPoints(Number(e.target.value))}
                    className="cb-input cb-mono"
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Date</label>
                  <input
                    type="date"
                    value={newDate}
                    onChange={e => setNewDate(e.target.value)}
                    className="cb-input"
                    required
                  />
                </div>
              </div>

              <div className="cb-grid-2">
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Location</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={e => setNewLocation(e.target.value)}
                    className="cb-input"
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Max Capacity</label>
                  <input
                    type="number"
                    value={newCapacity}
                    onChange={e => setNewCapacity(Number(e.target.value))}
                    className="cb-input cb-mono"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="cb-btn cb-btn-outline">Cancel</button>
                <button type="submit" className="cb-btn cb-btn-primary">Publish Initiative</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
