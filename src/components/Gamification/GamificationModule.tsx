import React, { useState } from 'react';
import { useEcoSphere } from '../../context/EcoSphereContext';
import { 
  Award, 
  Plus, 
  Trophy, 
  Gift, 
  CheckCircle, 
  Lock, 
  Unlock, 
  Upload, 
  AlertCircle,
  Sparkles
} from 'lucide-react';

export const GamificationModule: React.FC = () => {
  const { 
    state, 
    currentUser, 
    joinChallenge, 
    submitChallengeProgress, 
    addChallenge, 
    updateChallengeStatus,
    redeemReward, 
    addReward 
  } = useEcoSphere();

  const [activeSubtab, setActiveSubtab] = useState<'challenges' | 'badges' | 'rewards' | 'leaderboard'>('challenges');
  const [challengeFilter, setChallengeFilter] = useState<'ALL' | 'Active' | 'Under Review' | 'Completed' | 'Draft'>('ALL');

  // Challenge Progress Modal
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);
  const [progressPct, setProgressPct] = useState(100);
  const [progressNotes, setProgressNotes] = useState('');
  const [progressFileName, setProgressFileName] = useState('');

  // Create Challenge Modal
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);
  const [chgTitle, setChgTitle] = useState('');
  const [chgCategory, setChgCategory] = useState(state.master.categories[3]?.id || 'cat-4');
  const [chgDesc, setChgDesc] = useState('');
  const [chgXp, setChgXp] = useState(250);
  const [chgDifficulty, setChgDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [chgEvidence, setChgEvidence] = useState(true);
  const [chgDeadline, setChgDeadline] = useState('2026-09-30');

  // Create Reward Modal
  const [isRewardModalOpen, setIsRewardModalOpen] = useState(false);
  const [rewName, setRewName] = useState('');
  const [rewDesc, setRewDesc] = useState('');
  const [rewPoints, setRewPoints] = useState(200);
  const [rewStock, setRewStock] = useState(15);
  const [rewCategory, setRewCategory] = useState<'Eco-Perk' | 'Merch' | 'Voucher' | 'Wellness'>('Eco-Perk');
  const [rewIcon, setRewIcon] = useState('🌱');

  // Redemption feedback message
  const [redeemFeedback, setRedeemFeedback] = useState<{ success: boolean; msg: string } | null>(null);

  const handleOpenProgressModal = (challengeId: string) => {
    setSelectedChallengeId(challengeId);
    setProgressPct(100);
    setProgressNotes('');
    setProgressFileName('challenge-completion-log.png');
  };

  const handleProgressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChallengeId) return;
    submitChallengeProgress(selectedChallengeId, progressPct, {
      fileName: progressFileName,
      notes: progressNotes
    });
    setSelectedChallengeId(null);
  };

  const handleCreateChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    addChallenge({
      title: chgTitle,
      categoryId: chgCategory,
      description: chgDesc,
      xp: chgXp,
      difficulty: chgDifficulty,
      evidenceRequired: chgEvidence,
      deadline: chgDeadline,
      status: 'Active'
    });
    setIsChallengeModalOpen(false);
    setChgTitle('');
    setChgDesc('');
  };

  const handleCreateReward = (e: React.FormEvent) => {
    e.preventDefault();
    addReward({
      name: rewName,
      description: rewDesc,
      pointsRequired: rewPoints,
      stock: rewStock,
      category: rewCategory,
      icon: rewIcon,
      status: rewStock > 0 ? 'Available' : 'Out of Stock'
    });
    setIsRewardModalOpen(false);
    setRewName('');
    setRewDesc('');
  };

  const handleRedeem = (rewardId: string) => {
    setRedeemFeedback(null);
    const res = redeemReward(rewardId);
    if (res.success) {
      setRedeemFeedback({ success: true, msg: 'Reward successfully claimed! Points deducted from your balance.' });
    } else {
      setRedeemFeedback({ success: false, msg: res.error || 'Failed to redeem reward.' });
    }
  };

  const filteredChallenges = state.transactions.challenges.filter(c => {
    if (challengeFilter === 'ALL') return true;
    return c.status === challengeFilter;
  });

  return (
    <div style={{ padding: '32px 0 60px' }}>
      <div className="cb-container">
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="cb-badge cb-badge-primary">MODULE 04</span>
              <span className="cb-caption" style={{ color: 'var(--cb-muted)' }}>SUSTAINABILITY GAMIFICATION & REWARDS</span>
            </div>
            <h1 className="cb-display-lg" style={{ color: 'var(--cb-ink)' }}>Gamification & Incentives</h1>
            <p className="cb-body-md">Earn XP through sustainability sprints, unlock auto-awarded badges, and redeem points for eco-rewards.</p>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            {currentUser.role === 'ADMIN' && (
              <button
                onClick={() => setIsChallengeModalOpen(true)}
                className="cb-btn cb-btn-primary"
              >
                <Plus size={16} />
                <span>Create Challenge</span>
              </button>
            )}
          </div>
        </div>

        {/* Subtabs */}
        <div style={{ marginBottom: '24px' }}>
          <div className="cb-tabs">
            <button
              onClick={() => setActiveSubtab('challenges')}
              className={'cb-tab-item ' + (activeSubtab === 'challenges' ? 'active' : '')}
            >
              Challenges Lifecycle ({state.transactions.challenges.length})
            </button>
            <button
              onClick={() => setActiveSubtab('badges')}
              className={'cb-tab-item ' + (activeSubtab === 'badges' ? 'active' : '')}
            >
              Badges & Achievements ({state.master.badges.length})
            </button>
            <button
              onClick={() => setActiveSubtab('rewards')}
              className={'cb-tab-item ' + (activeSubtab === 'rewards' ? 'active' : '')}
            >
              Reward Store ({state.master.rewards.length})
            </button>
            <button
              onClick={() => setActiveSubtab('leaderboard')}
              className={'cb-tab-item ' + (activeSubtab === 'leaderboard' ? 'active' : '')}
            >
              Leaderboards & Rankings
            </button>
          </div>
        </div>

        {/* Redemption Alert Banner */}
        {redeemFeedback && (
          <div style={{
            padding: '16px 20px',
            borderRadius: 'var(--cb-radius-md)',
            backgroundColor: redeemFeedback.success ? 'var(--cb-semantic-up-bg)' : 'var(--cb-semantic-down-bg)',
            border: '1px solid ' + (redeemFeedback.success ? 'var(--cb-semantic-up)' : 'var(--cb-semantic-down)'),
            color: redeemFeedback.success ? 'var(--cb-semantic-up)' : 'var(--cb-semantic-down)',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            {redeemFeedback.success ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <div style={{ flex: 1, fontSize: '14px', fontWeight: 600 }}>
              {redeemFeedback.msg}
            </div>
            <button
              onClick={() => setRedeemFeedback(null)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'inherit', fontWeight: 700 }}
            >
              Dismiss
            </button>
          </div>
        )}

        {/* SUBTAB 1: Challenges Lifecycle */}
        {activeSubtab === 'challenges' && (
          <div>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', alignItems: 'center' }}>
              <span style={{ fontSize: '13px', color: 'var(--cb-muted)', fontWeight: 600 }}>LIFECYCLE:</span>
              {(['ALL', 'Active', 'Under Review', 'Completed', 'Draft'] as const).map(flt => (
                <button
                  key={flt}
                  onClick={() => setChallengeFilter(flt)}
                  className={'cb-btn cb-btn-sm ' + (challengeFilter === flt ? 'cb-btn-secondary' : 'cb-btn-outline')}
                  style={{ fontSize: '12px' }}
                >
                  {flt}
                </button>
              ))}
            </div>

            <div className="cb-grid-3">
              {filteredChallenges.map(challenge => {
                const userPart = state.transactions.challengeParticipations.find(
                  cp => cp.challengeId === challenge.id && cp.employeeId === currentUser.id
                );

                const getStatusBadge = (st: string) => {
                  switch (st) {
                    case 'Active': return 'cb-badge-up';
                    case 'Under Review': return 'cb-badge-warning';
                    case 'Completed': return 'cb-badge-primary';
                    default: return 'cb-badge-neutral';
                  }
                };

                return (
                  <div key={challenge.id} className="cb-card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span className={'cb-badge ' + getStatusBadge(challenge.status)}>
                        {challenge.status}
                      </span>
                      <span className="cb-badge cb-badge-primary cb-mono" style={{ fontWeight: 700 }}>
                        +{challenge.xp} XP
                      </span>
                    </div>

                    <h3 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--cb-ink)', marginBottom: '8px' }}>
                      {challenge.title}
                    </h3>

                    <p style={{ fontSize: '13px', color: 'var(--cb-body)', lineHeight: 1.4, marginBottom: '16px', flex: 1 }}>
                      {challenge.description}
                    </p>

                    <div style={{ padding: '12px', backgroundColor: 'var(--cb-surface-soft)', borderRadius: 'var(--cb-radius-md)', marginBottom: '16px', fontSize: '12px', color: 'var(--cb-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div>Difficulty: <strong style={{ color: 'var(--cb-ink)' }}>{challenge.difficulty}</strong></div>
                      <div>Deadline: <span className="cb-mono">{challenge.deadline}</span></div>
                      <div>Evidence Required: {challenge.evidenceRequired ? '📸 Proof Attachment' : 'Self-Log'}</div>
                    </div>

                    {userPart ? (
                      userPart.status === 'Approved' ? (
                        <div className="cb-badge cb-badge-up" style={{ padding: '8px', justifyContent: 'center' }}>
                          <CheckCircle size={15} />
                          <span>Challenge Completed (+{userPart.xpAwarded} XP)</span>
                        </div>
                      ) : userPart.status === 'Submitted' ? (
                        <div className="cb-badge cb-badge-warning" style={{ padding: '8px', justifyContent: 'center' }}>
                          <span>Under Review for Approval</span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleOpenProgressModal(challenge.id)}
                          className="cb-btn cb-btn-secondary"
                        >
                          <Upload size={15} />
                          <span>Submit Milestone & Proof</span>
                        </button>
                      )
                    ) : (
                      challenge.status === 'Active' ? (
                        <button
                          onClick={() => joinChallenge(challenge.id)}
                          className="cb-btn cb-btn-primary"
                        >
                          <span>Accept & Join Challenge</span>
                        </button>
                      ) : (
                        <button disabled className="cb-btn cb-btn-outline" style={{ cursor: 'not-allowed' }}>
                          <span>Not Currently Active</span>
                        </button>
                      )
                    )}

                    {currentUser.role === 'ADMIN' && (
                      <div style={{ marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--cb-hairline-soft)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '11px', color: 'var(--cb-muted)' }}>Admin Lifecycle:</span>
                        <select
                          value={challenge.status}
                          onChange={e => updateChallengeStatus(challenge.id, e.target.value as any)}
                          style={{ fontSize: '11px', padding: '2px 6px', borderRadius: 'var(--cb-radius-pill)', border: '1px solid var(--cb-hairline)', backgroundColor: '#fff', cursor: 'pointer' }}
                        >
                          <option value="Draft">Draft</option>
                          <option value="Active">Active</option>
                          <option value="Under Review">Under Review</option>
                          <option value="Completed">Completed</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SUBTAB 2: Badges & Achievements */}
        {activeSubtab === 'badges' && (
          <div>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              padding: '14px 20px',
              borderRadius: 'var(--cb-radius-lg)',
              backgroundColor: 'var(--cb-surface-soft)',
              border: '1px solid var(--cb-hairline)'
            }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--cb-ink)' }}>
                  Automatic Badge Unlock Engine
                </div>
                <div style={{ fontSize: '12px', color: 'var(--cb-muted)' }}>
                  {state.config.badgeAutoAward ? '⚡ Live Engine Active (Badges are auto-awarded upon meeting milestone thresholds)' : '⚠️ Manual Mode'}
                </div>
              </div>
              <span className="cb-badge cb-badge-neutral cb-mono">
                {state.master.userBadges.filter(ub => ub.employeeId === currentUser.id).length} / {state.master.badges.length} Badges Unlocked
              </span>
            </div>

            <div className="cb-grid-3">
              {state.master.badges.map(badge => {
                const isUnlocked = state.master.userBadges.some(
                  ub => ub.badgeId === badge.id && ub.employeeId === currentUser.id
                );
                const unlockRecord = state.master.userBadges.find(
                  ub => ub.badgeId === badge.id && ub.employeeId === currentUser.id
                );

                return (
                  <div
                    key={badge.id}
                    className="cb-card"
                    style={{
                      border: isUnlocked ? '1px solid var(--cb-primary)' : '1px solid var(--cb-hairline)',
                      backgroundColor: isUnlocked ? 'rgba(0, 82, 255, 0.02)' : 'var(--cb-canvas)',
                      display: 'flex',
                      gap: '16px',
                      alignItems: 'flex-start'
                    }}
                  >
                    <div style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: 'var(--cb-radius-xl)',
                      backgroundColor: isUnlocked ? 'var(--cb-primary-subtle)' : 'var(--cb-surface-strong)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '24px',
                      flexShrink: 0
                    }}>
                      {badge.icon}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <h4 style={{ fontSize: '16px', fontWeight: 600, color: 'var(--cb-ink)' }}>
                          {badge.name}
                        </h4>
                        {isUnlocked ? (
                          <span className="cb-badge cb-badge-up" style={{ fontSize: '11px' }}>
                            <Unlock size={11} />
                            <span>Unlocked</span>
                          </span>
                        ) : (
                          <span className="cb-badge cb-badge-neutral" style={{ fontSize: '11px' }}>
                            <Lock size={11} />
                            <span>Locked</span>
                          </span>
                        )}
                      </div>

                      <p style={{ fontSize: '13px', color: 'var(--cb-body)', lineHeight: 1.4, marginBottom: '10px' }}>
                        {badge.description}
                      </p>

                      <div style={{ fontSize: '11px', color: 'var(--cb-muted)', padding: '6px 8px', backgroundColor: 'var(--cb-surface-soft)', borderRadius: 'var(--cb-radius-sm)' }}>
                        Rule: <strong style={{ color: 'var(--cb-ink)' }}>{badge.unlockRuleType} ({badge.unlockRuleValue})</strong>
                        {isUnlocked && unlockRecord && (
                          <div style={{ color: 'var(--cb-primary)', marginTop: '2px' }}>
                            Earned on: {unlockRecord.unlockedAt}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SUBTAB 3: Rewards Store */}
        {activeSubtab === 'rewards' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 className="cb-title-md">Sustainability Rewards Catalog</h3>
                <p className="cb-body-sm">Redeem your accumulated CSR Points for tangible sustainable perks</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  padding: '8px 16px',
                  borderRadius: 'var(--cb-radius-pill)',
                  backgroundColor: 'var(--cb-surface-strong)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '13px', color: 'var(--cb-muted)' }}>Available Balance:</span>
                  <span className="cb-mono" style={{ fontSize: '18px', fontWeight: 700, color: '#b45309' }}>
                    {currentUser.points} PTS
                  </span>
                </div>

                {currentUser.role === 'ADMIN' && (
                  <button
                    onClick={() => setIsRewardModalOpen(true)}
                    className="cb-btn cb-btn-secondary cb-btn-sm"
                  >
                    <Plus size={15} />
                    <span>Add Item</span>
                  </button>
                )}
              </div>
            </div>

            <div className="cb-grid-3">
              {state.master.rewards.map(reward => {
                const canAfford = currentUser.points >= reward.pointsRequired;
                const inStock = reward.stock > 0;

                return (
                  <div key={reward.id} className="cb-card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <span className="cb-badge cb-badge-neutral">{reward.category}</span>
                      <span className={'cb-badge ' + (inStock ? 'cb-badge-up' : 'cb-badge-down')}>
                        {inStock ? reward.stock + ' in stock' : 'Out of Stock'}
                      </span>
                    </div>

                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: 'var(--cb-radius-xl)',
                      backgroundColor: 'var(--cb-surface-soft)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '28px',
                      marginBottom: '14px'
                    }}>
                      {reward.icon}
                    </div>

                    <h4 style={{ fontSize: '17px', fontWeight: 600, color: 'var(--cb-ink)', marginBottom: '6px' }}>
                      {reward.name}
                    </h4>

                    <p style={{ fontSize: '13px', color: 'var(--cb-body)', lineHeight: 1.4, marginBottom: '16px', flex: 1 }}>
                      {reward.description}
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '14px', borderTop: '1px solid var(--cb-hairline)' }}>
                      <div>
                        <div style={{ fontSize: '11px', color: 'var(--cb-muted)', textTransform: 'uppercase' }}>Points Price</div>
                        <div className="cb-mono" style={{ fontSize: '20px', fontWeight: 700, color: '#b45309' }}>
                          {reward.pointsRequired} <span style={{ fontSize: '12px' }}>PTS</span>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRedeem(reward.id)}
                        disabled={!canAfford || !inStock}
                        className="cb-btn cb-btn-primary"
                        style={{ height: '38px', padding: '0 16px', fontSize: '13px' }}
                      >
                        <Gift size={14} />
                        <span>{!inStock ? 'Sold Out' : !canAfford ? 'Need ' + (reward.pointsRequired - currentUser.points) + ' pts' : 'Redeem Perk'}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SUBTAB 4: Leaderboards */}
        {activeSubtab === 'leaderboard' && (
          <div className="cb-grid-2">
            <div className="cb-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 className="cb-title-md">Employee Champions Leaderboard</h3>
                <Trophy size={18} color="var(--cb-primary)" />
              </div>

              <div className="cb-table-container">
                <table className="cb-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Employee</th>
                      <th>Department</th>
                      <th>XP Level</th>
                      <th>Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...state.users]
                      .sort((a, b) => b.xp - a.xp)
                      .map((user, idx) => {
                        const dept = state.master.departments.find(d => d.id === user.departmentId);
                        return (
                          <tr key={user.id}>
                            <td>
                              <span className="cb-badge cb-badge-neutral cb-mono" style={{ fontWeight: 700 }}>
                                #{idx + 1}
                              </span>
                            </td>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <img
                                  src={user.avatar}
                                  alt=""
                                  style={{ width: '26px', height: '26px', borderRadius: '50%' }}
                                />
                                <div style={{ fontWeight: 600, color: 'var(--cb-ink)' }}>{user.name}</div>
                              </div>
                            </td>
                            <td style={{ fontSize: '13px', color: 'var(--cb-muted)' }}>{dept?.name || user.departmentId}</td>
                            <td>
                              <span className="cb-mono" style={{ fontWeight: 700, color: 'var(--cb-primary)' }}>
                                {user.xp} XP
                              </span>
                            </td>
                            <td>
                              <span className="cb-mono" style={{ fontWeight: 600, color: '#b45309' }}>
                                {user.points} PTS
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="cb-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 className="cb-title-md">Department ESG Score Leaderboard</h3>
                <Sparkles size={18} color="var(--cb-semantic-up)" />
              </div>

              <div className="cb-table-container">
                <table className="cb-table">
                  <thead>
                    <tr>
                      <th>Rank</th>
                      <th>Department</th>
                      <th>Staff</th>
                      <th>Total Composite Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.master.departments.map((dept, idx) => (
                      <tr key={dept.id}>
                        <td>
                          <span className="cb-badge cb-badge-neutral cb-mono" style={{ fontWeight: 700 }}>
                            #{idx + 1}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{dept.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--cb-muted)' }}>Head: {dept.head}</div>
                        </td>
                        <td className="cb-mono">{dept.employeeCount}</td>
                        <td>
                          <span className="cb-badge cb-badge-up cb-mono" style={{ fontSize: '14px', fontWeight: 700 }}>
                            {88 - idx * 3} / 100
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Modal: Submit Challenge Progress */}
      {selectedChallengeId && (
        <div className="cb-modal-overlay">
          <div className="cb-modal-content">
            <div style={{ padding: '24px', borderBottom: '1px solid var(--cb-hairline)' }}>
              <h3 className="cb-title-lg">Submit Challenge Milestones</h3>
              <p className="cb-body-sm">Log your progress and upload evidence to earn XP</p>
            </div>
            <form onSubmit={handleProgressSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Completion Progress ({progressPct}%)</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progressPct}
                  onChange={e => setProgressPct(Number(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Proof File Attachment</label>
                <div style={{
                  padding: '20px',
                  border: '2px dashed var(--cb-hairline)',
                  borderRadius: 'var(--cb-radius-lg)',
                  textAlign: 'center',
                  backgroundColor: 'var(--cb-surface-soft)'
                }}>
                  <Upload size={24} color="var(--cb-primary)" style={{ margin: '0 auto 6px' }} />
                  <p style={{ fontSize: '13px', fontWeight: 600 }}>{progressFileName}</p>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Progress Notes</label>
                <textarea
                  placeholder="Describe your actions taken..."
                  value={progressNotes}
                  onChange={e => setProgressNotes(e.target.value)}
                  className="cb-textarea"
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setSelectedChallengeId(null)} className="cb-btn cb-btn-outline">Cancel</button>
                <button type="submit" className="cb-btn cb-btn-primary">Submit Progress</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Challenge */}
      {isChallengeModalOpen && (
        <div className="cb-modal-overlay">
          <div className="cb-modal-content">
            <div style={{ padding: '24px', borderBottom: '1px solid var(--cb-hairline)' }}>
              <h3 className="cb-title-lg">Launch Sustainability Challenge</h3>
            </div>
            <form onSubmit={handleCreateChallenge} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Challenge Title</label>
                <input
                  type="text"
                  placeholder="e.g. 100% Plant-Based Cafeteria Week"
                  value={chgTitle}
                  onChange={e => setChgTitle(e.target.value)}
                  className="cb-input"
                  required
                />
              </div>
              <div className="cb-grid-2">
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>XP Reward</label>
                  <input
                    type="number"
                    value={chgXp}
                    onChange={e => setChgXp(Number(e.target.value))}
                    className="cb-input cb-mono"
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Difficulty</label>
                  <select
                    value={chgDifficulty}
                    onChange={e => setChgDifficulty(e.target.value as any)}
                    className="cb-select"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Deadline</label>
                <input
                  type="date"
                  value={chgDeadline}
                  onChange={e => setChgDeadline(e.target.value)}
                  className="cb-input"
                  required
                />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Description</label>
                <textarea
                  placeholder="Rules, goals, and submission guidelines..."
                  value={chgDesc}
                  onChange={e => setChgDesc(e.target.value)}
                  className="cb-textarea"
                  required
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsChallengeModalOpen(false)} className="cb-btn cb-btn-outline">Cancel</button>
                <button type="submit" className="cb-btn cb-btn-primary">Publish Challenge</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Reward */}
      {isRewardModalOpen && (
        <div className="cb-modal-overlay">
          <div className="cb-modal-content">
            <div style={{ padding: '24px', borderBottom: '1px solid var(--cb-hairline)' }}>
              <h3 className="cb-title-lg">Add Catalog Reward</h3>
            </div>
            <form onSubmit={handleCreateReward} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Reward Name</label>
                <input
                  type="text"
                  placeholder="e.g. Solar Backpack"
                  value={rewName}
                  onChange={e => setRewName(e.target.value)}
                  className="cb-input"
                  required
                />
              </div>
              <div className="cb-grid-3">
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Points Price</label>
                  <input
                    type="number"
                    value={rewPoints}
                    onChange={e => setRewPoints(Number(e.target.value))}
                    className="cb-input cb-mono"
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Stock</label>
                  <input
                    type="number"
                    value={rewStock}
                    onChange={e => setRewStock(Number(e.target.value))}
                    className="cb-input cb-mono"
                    required
                  />
                </div>
                <div>
                  <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Emoji Icon</label>
                  <input
                    type="text"
                    value={rewIcon}
                    onChange={e => setRewIcon(e.target.value)}
                    className="cb-input"
                    required
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '6px' }}>Description</label>
                <textarea
                  placeholder="Perk details..."
                  value={rewDesc}
                  onChange={e => setRewDesc(e.target.value)}
                  className="cb-textarea"
                  required
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button type="button" onClick={() => setIsRewardModalOpen(false)} className="cb-btn cb-btn-outline">Cancel</button>
                <button type="submit" className="cb-btn cb-btn-primary">Add to Catalog</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
