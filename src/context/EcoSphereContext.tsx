import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  EcoSphereState,
  User,
  UserRole,
  Department,
  Category,
  EmissionFactor,
  ProductESGProfile,
  EnvironmentalGoal,
  ESGPolicy,
  Badge,
  Reward,
  CarbonTransaction,
  CSRActivity,
  EmployeeParticipation,
  Challenge,
  ChallengeParticipation,
  PolicyAcknowledgement,
  Audit,
  ComplianceIssue,
  DepartmentScore,
  AppNotification,
  EcoSphereConfig
} from '../types/esg';
import { initialSeedData } from '../services/seedData';

interface EcoSphereContextType {
  state: EcoSphereState;
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: UserRole) => void;
  
  // Scoring
  departmentScores: DepartmentScore[];
  overallESGScore: {
    total: number;
    environmental: number;
    social: number;
    governance: number;
  };

  // Config & Business Rules
  updateConfig: (updater: Partial<EcoSphereConfig>) => void;
  updateWeights: (weights: { env: number; soc: number; gov: number }) => void;

  // Environmental Actions
  addEmissionFactor: (factor: Omit<EmissionFactor, 'id'>) => void;
  updateEmissionFactor: (id: string, factor: Partial<EmissionFactor>) => void;
  deleteEmissionFactor: (id: string) => void;
  
  addProductProfile: (profile: Omit<ProductESGProfile, 'id'>) => void;
  updateProductProfile: (id: string, profile: Partial<ProductESGProfile>) => void;

  addCarbonTransaction: (tx: {
    departmentId: string;
    sourceType: 'Purchase' | 'Manufacturing' | 'Expenses' | 'Fleet';
    emissionFactorId: string;
    quantity: number;
    notes?: string;
    referenceId?: string;
    productProfileId?: string;
    manualCalculatedEmissions?: number;
  }) => { success: boolean; emissions: number };

  addEnvironmentalGoal: (goal: Omit<EnvironmentalGoal, 'id'>) => void;
  updateEnvironmentalGoal: (id: string, goal: Partial<EnvironmentalGoal>) => void;

  // Social Actions
  addCSRActivity: (activity: Omit<CSRActivity, 'id' | 'registeredCount'>) => void;
  registerForCSRActivity: (activityId: string) => boolean;
  submitCSRProof: (activityId: string, proof: { fileName: string; fileUrl?: string; notes: string }) => boolean;
  reviewCSRParticipation: (participationId: string, status: 'Approved' | 'Rejected', notes?: string) => { success: boolean; error?: string };

  // Governance Actions
  addPolicy: (policy: Omit<ESGPolicy, 'id'>) => void;
  updatePolicy: (id: string, policy: Partial<ESGPolicy>) => void;
  acknowledgePolicy: (policyId: string) => boolean;

  addAudit: (audit: Omit<Audit, 'id'>) => void;
  updateAudit: (id: string, audit: Partial<Audit>) => void;

  addComplianceIssue: (issue: Omit<ComplianceIssue, 'id' | 'createdAt' | 'status'>) => void;
  updateComplianceIssue: (id: string, updates: Partial<ComplianceIssue>) => void;

  // Gamification Actions
  addChallenge: (challenge: Omit<Challenge, 'id'>) => void;
  updateChallengeStatus: (id: string, status: Challenge['status']) => void;
  joinChallenge: (challengeId: string) => boolean;
  submitChallengeProgress: (challengeId: string, progressPct: number, proof?: { fileName: string; notes: string }) => boolean;
  reviewChallengeParticipation: (participationId: string, status: 'Approved' | 'Rejected') => void;

  addBadge: (badge: Omit<Badge, 'id'>) => void;
  addReward: (reward: Omit<Reward, 'id'>) => void;
  updateReward: (id: string, reward: Partial<Reward>) => void;
  redeemReward: (rewardId: string) => { success: boolean; error?: string };

  // Settings & Master Data
  addDepartment: (dept: Omit<Department, 'id'>) => void;
  updateDepartment: (id: string, dept: Partial<Department>) => void;
  deleteDepartment: (id: string) => void;

  addCategory: (cat: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, cat: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
  
  // Reset demo data
  resetToSeedData: () => void;
}

const STORAGE_KEY = 'ecosphere_esg_platform_state_v2';

const EcoSphereContext = createContext<EcoSphereContextType | undefined>(undefined);

export const EcoSphereProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<EcoSphereState>(() => {
    // Clear any old v1 cache with old names
  try { localStorage.removeItem('ecosphere_esg_platform_state_v1'); } catch(e) {}
  const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved state, using seed data:', e);
      }
    }
    return initialSeedData;
  });

  // Persist state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  // Push notifications helper
  const addNotification = (notif: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false
    };
    setState(prev => ({
      ...prev,
      notifications: [newNotif, ...prev.notifications]
    }));
  };

  // Automated overdue compliance checker
  useEffect(() => {
    const today = new Date().toISOString().substring(0, 10);
    let updated = false;
    const updatedIssues = state.transactions.complianceIssues.map(issue => {
      if (issue.status !== 'Resolved' && issue.dueDate < today && issue.status !== 'Overdue') {
        updated = true;
        addNotification({
          title: '🚨 Overdue Compliance Issue Alert',
          message: 'Issue "' + issue.title.substring(0, 35) + '..." is past due (' + issue.dueDate + '). Immediate action required.',
          type: 'ISSUE_OVERDUE'
        });
        return { ...issue, status: 'Overdue' as const };
      }
      return issue;
    });

    if (updated) {
      setState(prev => ({
        ...prev,
        transactions: {
          ...prev.transactions,
          complianceIssues: updatedIssues
        }
      }));
    }
  }, []);

  // Automated Badge Evaluation Engine
  const evaluateBadgesForUser = (userId: string, currentState: EcoSphereState): EcoSphereState => {
    if (!currentState.config.badgeAutoAward) return currentState;

    const user = currentState.users.find(u => u.id === userId);
    if (!user) return currentState;

    const existingBadgeIds = new Set(
      currentState.master.userBadges
        .filter(ub => ub.employeeId === userId)
        .map(ub => ub.badgeId)
    );

    const approvedChallengesCount = currentState.transactions.challengeParticipations.filter(
      cp => cp.employeeId === userId && cp.status === 'Approved'
    ).length;

    const approvedCsrCount = currentState.transactions.csrParticipations.filter(
      cp => cp.employeeId === userId && cp.status === 'Approved'
    ).length;

    const activePoliciesCount = currentState.master.policies.filter(p => p.status === 'Active').length;
    const signedPoliciesCount = currentState.transactions.policyAcknowledgements.filter(
      pa => pa.employeeId === userId
    ).length;

    const newUnlockedBadges: Badge[] = [];
    const newUserBadges = [...currentState.master.userBadges];

    currentState.master.badges.forEach(badge => {
      if (existingBadgeIds.has(badge.id)) return;

      let qualifies = false;
      switch (badge.unlockRuleType) {
        case 'XP_THRESHOLD':
          qualifies = user.xp >= badge.unlockRuleValue;
          break;
        case 'CHALLENGES_COMPLETED':
          qualifies = approvedChallengesCount >= badge.unlockRuleValue;
          break;
        case 'CSR_COUNT':
          qualifies = approvedCsrCount >= badge.unlockRuleValue;
          break;
        case 'POLICY_ALL_SIGNED':
          qualifies = activePoliciesCount > 0 && signedPoliciesCount >= activePoliciesCount;
          break;
      }

      if (qualifies) {
        newUnlockedBadges.push(badge);
        newUserBadges.push({
          id: 'ub-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
          badgeId: badge.id,
          employeeId: userId,
          unlockedAt: new Date().toISOString().substring(0, 10)
        });
      }
    });

    if (newUnlockedBadges.length === 0) return currentState;

    const newNotifications: AppNotification[] = newUnlockedBadges.map(b => ({
      id: 'notif-' + Date.now() + '-' + b.id,
      title: '🏆 Badge Unlocked: ' + b.name + '!',
      message: 'Congratulations ' + user.name + '! You unlocked the "' + b.name + '" badge (' + b.description + ').',
      type: 'BADGE_UNLOCKED',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false
    }));

    return {
      ...currentState,
      master: {
        ...currentState.master,
        userBadges: newUserBadges
      },
      notifications: [...newNotifications, ...currentState.notifications]
    };
  };

  // Role Switcher
  const setCurrentUser = (user: User) => {
    setState(prev => ({
      ...prev,
      currentUser: user
    }));
  };

  const switchRole = (role: UserRole) => {
    const userWithRole = state.users.find(u => u.role === role) || state.users[0];
    setCurrentUser(userWithRole);
  };

  // Config Update
  const updateConfig = (updater: Partial<EcoSphereConfig>) => {
    setState(prev => ({
      ...prev,
      config: { ...prev.config, ...updater }
    }));
  };

  const updateWeights = (weights: { env: number; soc: number; gov: number }) => {
    setState(prev => ({
      ...prev,
      config: {
        ...prev.config,
        weights
      }
    }));
  };

  // Dynamic Department & Overall ESG Scoring
  const departmentScores = useMemo<DepartmentScore[]>(() => {
    const { env: envW, soc: socW, gov: govW } = state.config.weights;

    return state.master.departments.map(dept => {
      // 1. Environmental Score (0-100)
      const deptTx = state.transactions.carbonTransactions.filter(t => t.departmentId === dept.id);
      const totalEmissions = deptTx.reduce((acc, t) => acc + t.calculatedEmissions, 0);
      const emissionPerEmployee = dept.employeeCount > 0 ? totalEmissions / dept.employeeCount : 50;
      const envScore = Math.max(30, Math.min(98, Math.round(100 - (emissionPerEmployee / 100))));

      // 2. Social Score (0-100)
      const deptTraining = state.trainingRecords.filter(tr => tr.departmentId === dept.id);
      const avgTrainingPct = deptTraining.length > 0
        ? deptTraining.reduce((acc, tr) => acc + tr.completionPct, 0) / deptTraining.length
        : 80;
      const socScore = Math.max(30, Math.min(99, Math.round(avgTrainingPct * 0.7 + 25)));

      // 3. Governance Score (0-100)
      const deptIssues = state.transactions.complianceIssues.filter(i => {
        const owner = state.users.find(u => u.id === i.ownerEmployeeId);
        return owner?.departmentId === dept.id;
      });
      const overdueCount = deptIssues.filter(i => i.status === 'Overdue').length;
      const openCount = deptIssues.filter(i => i.status === 'Open').length;
      const govPenalty = (overdueCount * 20) + (openCount * 8);
      const govScore = Math.max(25, Math.min(98, Math.round(95 - govPenalty)));

      // Weighted Total Score
      const totalScore = Math.round((envScore * envW + socScore * socW + govScore * govW) / 100);

      return {
        departmentId: dept.id,
        departmentName: dept.name,
        environmentalScore: envScore,
        socialScore: socScore,
        governanceScore: govScore,
        totalScore
      };
    }).sort((a, b) => b.totalScore - a.totalScore)
      .map((item, idx) => ({ ...item, rank: idx + 1 }));
  }, [state.master.departments, state.transactions, state.trainingRecords, state.config.weights, state.users]);

  const overallESGScore = useMemo(() => {
    if (departmentScores.length === 0) {
      return { total: 85, environmental: 84, social: 88, governance: 82 };
    }
    const envAvg = Math.round(departmentScores.reduce((acc, d) => acc + d.environmentalScore, 0) / departmentScores.length);
    const socAvg = Math.round(departmentScores.reduce((acc, d) => acc + d.socialScore, 0) / departmentScores.length);
    const govAvg = Math.round(departmentScores.reduce((acc, d) => acc + d.governanceScore, 0) / departmentScores.length);
    const totalAvg = Math.round((envAvg * state.config.weights.env + socAvg * state.config.weights.soc + govAvg * state.config.weights.gov) / 100);
    return {
      total: totalAvg,
      environmental: envAvg,
      social: socAvg,
      governance: govAvg
    };
  }, [departmentScores, state.config.weights]);

  // Carbon Accounting & Auto Emission Calculation
  const addCarbonTransaction = (tx: {
    departmentId: string;
    sourceType: 'Purchase' | 'Manufacturing' | 'Expenses' | 'Fleet';
    emissionFactorId: string;
    quantity: number;
    notes?: string;
    referenceId?: string;
    productProfileId?: string;
    manualCalculatedEmissions?: number;
  }) => {
    const factor = state.master.emissionFactors.find(f => f.id === tx.emissionFactorId);
    let calculatedEmissions = tx.manualCalculatedEmissions || 0;
    let scope: 1 | 2 | 3 = 1;

    if (factor) {
      scope = factor.scope;
      if (state.config.autoEmissionCalc) {
        calculatedEmissions = Math.round(tx.quantity * factor.factorValue * 100) / 100;
      }
    }

    const newTx: CarbonTransaction = {
      id: 'ctx-' + Date.now(),
      date: new Date().toISOString().substring(0, 10),
      departmentId: tx.departmentId,
      sourceType: tx.sourceType,
      emissionFactorId: tx.emissionFactorId,
      quantity: tx.quantity,
      calculatedEmissions,
      scope,
      notes: tx.notes,
      referenceId: tx.referenceId || 'ERP-' + Math.floor(1000 + Math.random() * 9000),
      productProfileId: tx.productProfileId
    };

    setState(prev => ({
      ...prev,
      transactions: {
        ...prev.transactions,
        carbonTransactions: [newTx, ...prev.transactions.carbonTransactions]
      }
    }));

    return { success: true, emissions: calculatedEmissions };
  };

  // CSR Submissions & Approvals (with Evidence Enforcement Guard)
  const registerForCSRActivity = (activityId: string) => {
    const existing = state.transactions.csrParticipations.find(
      cp => cp.activityId === activityId && cp.employeeId === state.currentUser.id
    );
    if (existing) return false;

    const newParticipation: EmployeeParticipation = {
      id: 'cp-' + Date.now(),
      activityId,
      employeeId: state.currentUser.id,
      status: 'Pending',
      pointsEarned: 0,
      submittedAt: new Date().toISOString().substring(0, 10)
    };

    setState(prev => ({
      ...prev,
      transactions: {
        ...prev.transactions,
        csrParticipations: [newParticipation, ...prev.transactions.csrParticipations],
        csrActivities: prev.transactions.csrActivities.map(act =>
          act.id === activityId ? { ...act, registeredCount: act.registeredCount + 1 } : act
        )
      }
    }));

    addNotification({
      title: '📋 CSR Activity Registration',
      message: 'You registered for the CSR initiative. Remember to submit your proof after completion!',
      type: 'SYSTEM'
    });

    return true;
  };

  const submitCSRProof = (activityId: string, proof: { fileName: string; fileUrl?: string; notes: string }) => {
    setState(prev => {
      const existing = prev.transactions.csrParticipations.find(
        cp => cp.activityId === activityId && cp.employeeId === prev.currentUser.id
      );

      let updatedParticipations = [...prev.transactions.csrParticipations];
      if (existing) {
        updatedParticipations = updatedParticipations.map(cp =>
          cp.id === existing.id
            ? {
                ...cp,
                proofAttachmentName: proof.fileName,
                proofAttachmentUrl: proof.fileUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400',
                proofNotes: proof.notes,
                status: 'Pending' as const
              }
            : cp
        );
      } else {
        const newPart: EmployeeParticipation = {
          id: 'cp-' + Date.now(),
          activityId,
          employeeId: prev.currentUser.id,
          proofAttachmentName: proof.fileName,
          proofAttachmentUrl: proof.fileUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400',
          proofNotes: proof.notes,
          status: 'Pending',
          pointsEarned: 0,
          submittedAt: new Date().toISOString().substring(0, 10)
        };
        updatedParticipations.unshift(newPart);
      }

      return {
        ...prev,
        transactions: {
          ...prev.transactions,
          csrParticipations: updatedParticipations
        }
      };
    });

    addNotification({
      title: '📤 CSR Proof Submitted',
      message: 'Evidence submitted for review. Points will be awarded upon Admin verification.',
      type: 'SYSTEM'
    });

    return true;
  };

  const reviewCSRParticipation = (participationId: string, status: 'Approved' | 'Rejected', notes?: string) => {
    const part = state.transactions.csrParticipations.find(p => p.id === participationId);
    if (!part) return { success: false, error: 'Participation record not found.' };

    // EVIDENCE ENFORCEMENT GUARD:
    // If evidenceRequired is active in settings, cannot approve without attached proof
    if (status === 'Approved' && state.config.evidenceRequired) {
      if (!part.proofAttachmentName && !part.proofAttachmentUrl) {
        return {
          success: false,
          error: 'Evidence Enforcement Guard Active: Cannot approve participation without an attached proof document or image.'
        };
      }
    }

    const activity = state.transactions.csrActivities.find(a => a.id === part.activityId);
    const pointsToAward = activity ? activity.pointsAwarded : 100;

    let updatedUsers = [...state.users];
    if (status === 'Approved') {
      updatedUsers = updatedUsers.map(u =>
        u.id === part.employeeId ? { ...u, points: u.points + pointsToAward } : u
      );
    }

    const updatedParticipations = state.transactions.csrParticipations.map(p =>
      p.id === participationId
        ? {
            ...p,
            status,
            pointsEarned: status === 'Approved' ? pointsToAward : 0,
            completionDate: status === 'Approved' ? new Date().toISOString().substring(0, 10) : undefined,
            reviewedBy: state.currentUser.name,
            reviewNotes: notes || (status === 'Approved' ? 'Verified & Approved by Sustainability Admin.' : 'Evidence rejected.')
          }
        : p
    );

    let nextState: EcoSphereState = {
      ...state,
      users: updatedUsers,
      currentUser: updatedUsers.find(u => u.id === state.currentUser.id) || state.currentUser,
      transactions: {
        ...state.transactions,
        csrParticipations: updatedParticipations
      }
    };

    // Add notification to employee
    const notifType = status === 'Approved' ? 'CSR_APPROVED' : 'CSR_REJECTED';
    const notifTitle = status === 'Approved' ? '🎉 CSR Activity Approved!' : '❌ CSR Submission Rejected';
    const notifMsg = status === 'Approved'
      ? 'Your participation in "' + (activity?.title || 'CSR Initiative') + '" was approved! +' + pointsToAward + ' Points credited to your account.'
      : 'Your submission was not approved: ' + (notes || 'Insufficient evidence.');

    const newNotif: AppNotification = {
      id: 'notif-' + Date.now(),
      title: notifTitle,
      message: notifMsg,
      type: notifType,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false
    };
    nextState.notifications = [newNotif, ...nextState.notifications];

    // Trigger auto-badge award if eligible
    nextState = evaluateBadgesForUser(part.employeeId, nextState);
    setState(nextState);

    return { success: true };
  };

  // Challenges & Gamification Engine
  const addChallenge = (challenge: Omit<Challenge, 'id'>) => {
    const newChallenge: Challenge = {
      ...challenge,
      id: 'chg-' + Date.now()
    };
    setState(prev => ({
      ...prev,
      transactions: {
        ...prev.transactions,
        challenges: [newChallenge, ...prev.transactions.challenges]
      }
    }));
  };

  const updateChallengeStatus = (id: string, status: Challenge['status']) => {
    setState(prev => ({
      ...prev,
      transactions: {
        ...prev.transactions,
        challenges: prev.transactions.challenges.map(c => c.id === id ? { ...c, status } : c)
      }
    }));
  };

  const joinChallenge = (challengeId: string) => {
    const existing = state.transactions.challengeParticipations.find(
      cp => cp.challengeId === challengeId && cp.employeeId === state.currentUser.id
    );
    if (existing) return false;

    const newPart: ChallengeParticipation = {
      id: 'chp-' + Date.now(),
      challengeId,
      employeeId: state.currentUser.id,
      progressPct: 0,
      status: 'Joined',
      xpAwarded: 0,
      joinedAt: new Date().toISOString().substring(0, 10)
    };

    setState(prev => ({
      ...prev,
      transactions: {
        ...prev.transactions,
        challengeParticipations: [newPart, ...prev.transactions.challengeParticipations]
      }
    }));

    addNotification({
      title: '🎯 Challenge Joined!',
      message: 'You have entered the sustainability challenge. Track your milestones and earn XP!',
      type: 'SYSTEM'
    });

    return true;
  };

  const submitChallengeProgress = (challengeId: string, progressPct: number, proof?: { fileName: string; notes: string }) => {
    const challenge = state.transactions.challenges.find(c => c.id === challengeId);
    if (!challenge) return false;

    setState(prev => {
      const existing = prev.transactions.challengeParticipations.find(
        cp => cp.challengeId === challengeId && cp.employeeId === prev.currentUser.id
      );

      let updated = [...prev.transactions.challengeParticipations];
      const isComplete = progressPct >= 100;
      const newStatus = isComplete ? 'Submitted' : 'Joined';

      if (existing) {
        updated = updated.map(cp =>
          cp.id === existing.id
            ? {
                ...cp,
                progressPct,
                proofAttachmentName: proof?.fileName || cp.proofAttachmentName,
                proofNotes: proof?.notes || cp.proofNotes,
                status: newStatus
              }
            : cp
        );
      } else {
        updated.unshift({
          id: 'chp-' + Date.now(),
          challengeId,
          employeeId: prev.currentUser.id,
          progressPct,
          proofAttachmentName: proof?.fileName,
          proofNotes: proof?.notes,
          status: newStatus,
          xpAwarded: 0,
          joinedAt: new Date().toISOString().substring(0, 10)
        });
      }

      return {
        ...prev,
        transactions: {
          ...prev.transactions,
          challengeParticipations: updated
        }
      };
    });

    if (progressPct >= 100) {
      addNotification({
        title: '🏁 Challenge Progress Submitted',
        message: '100% progress recorded for "' + challenge.title + '". Under review for ' + challenge.xp + ' XP reward.',
        type: 'SYSTEM'
      });
    }

    return true;
  };

  const reviewChallengeParticipation = (participationId: string, status: 'Approved' | 'Rejected') => {
    const part = state.transactions.challengeParticipations.find(p => p.id === participationId);
    if (!part) return;

    const challenge = state.transactions.challenges.find(c => c.id === part.challengeId);
    const xpToAward = challenge ? challenge.xp : 200;

    let updatedUsers = [...state.users];
    if (status === 'Approved') {
      updatedUsers = updatedUsers.map(u =>
        u.id === part.employeeId ? { ...u, xp: u.xp + xpToAward } : u
      );
    }

    const updatedParticipations = state.transactions.challengeParticipations.map(p =>
      p.id === participationId
        ? {
            ...p,
            status,
            xpAwarded: status === 'Approved' ? xpToAward : 0,
            completedAt: status === 'Approved' ? new Date().toISOString().substring(0, 10) : undefined
          }
        : p
    );

    let nextState: EcoSphereState = {
      ...state,
      users: updatedUsers,
      currentUser: updatedUsers.find(u => u.id === state.currentUser.id) || state.currentUser,
      transactions: {
        ...state.transactions,
        challengeParticipations: updatedParticipations
      }
    };

    if (status === 'Approved') {
      const newNotif: AppNotification = {
        id: 'notif-' + Date.now(),
        title: '🌟 Challenge Completed & XP Awarded!',
        message: 'Your challenge submission for "' + (challenge?.title || 'Challenge') + '" was approved! +' + xpToAward + ' XP added.',
        type: 'CHALLENGE_APPROVED',
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        read: false
      };
      nextState.notifications = [newNotif, ...nextState.notifications];
    }

    nextState = evaluateBadgesForUser(part.employeeId, nextState);
    setState(nextState);
  };

  // Reward Redemption with Atomic Stock & Balance Check
  const redeemReward = (rewardId: string) => {
    const reward = state.master.rewards.find(r => r.id === rewardId);
    if (!reward) return { success: false, error: 'Reward item does not exist.' };

    const user = state.currentUser;

    if (reward.stock <= 0) {
      return { success: false, error: 'Item is currently Out of Stock.' };
    }

    if (user.points < reward.pointsRequired) {
      return {
        success: false,
        error: 'Insufficient points balance. You have ' + user.points + ' points, but ' + reward.pointsRequired + ' are required.'
      };
    }

    // Atomic update: decrement stock, deduct points, add redemption log
    const updatedRewards = state.master.rewards.map(r =>
      r.id === rewardId
        ? {
            ...r,
            stock: r.stock - 1,
            status: r.stock - 1 === 0 ? ('Out of Stock' as const) : r.status
          }
        : r
    );

    const updatedUser = {
      ...user,
      points: user.points - reward.pointsRequired
    };

    const updatedUsers = state.users.map(u => u.id === user.id ? updatedUser : u);

    const newRedemption = {
      id: 'red-' + Date.now(),
      rewardId,
      employeeId: user.id,
      pointsSpent: reward.pointsRequired,
      redeemedAt: new Date().toISOString().substring(0, 10),
      status: 'Fulfilled' as const
    };

    const newNotif: AppNotification = {
      id: 'notif-' + Date.now(),
      title: '🎁 Reward Redeemed Successfully!',
      message: 'You redeemed "' + reward.name + '" for ' + reward.pointsRequired + ' Points. Remaining balance: ' + updatedUser.points + ' Points.',
      type: 'REWARD_REDEEMED',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false
    };

    setState(prev => ({
      ...prev,
      currentUser: updatedUser,
      users: updatedUsers,
      master: {
        ...prev.master,
        rewards: updatedRewards,
        rewardRedemptions: [newRedemption, ...prev.master.rewardRedemptions]
      },
      notifications: [newNotif, ...prev.notifications]
    }));

    return { success: true };
  };

  // Policy Acknowledgement & Signature
  const acknowledgePolicy = (policyId: string) => {
    const existing = state.transactions.policyAcknowledgements.find(
      pa => pa.policyId === policyId && pa.employeeId === state.currentUser.id
    );
    if (existing) return false;

    const newAck: PolicyAcknowledgement = {
      id: 'pa-' + Date.now(),
      policyId,
      employeeId: state.currentUser.id,
      acknowledgedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      digitalSignature: state.currentUser.name + ' [Verified Auth - Token #' + Math.floor(100000 + Math.random() * 900000) + ']'
    };

    let nextState: EcoSphereState = {
      ...state,
      transactions: {
        ...state.transactions,
        policyAcknowledgements: [...state.transactions.policyAcknowledgements, newAck]
      }
    };

    nextState.notifications = [
      {
        id: 'notif-' + Date.now(),
        title: '📜 Policy Formally Acknowledged',
        message: 'Your digital signature for policy #' + policyId + ' has been securely timestamped and recorded.',
        type: 'SYSTEM',
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        read: false
      },
      ...nextState.notifications
    ];

    nextState = evaluateBadgesForUser(state.currentUser.id, nextState);
    setState(nextState);

    return true;
  };

  // Compliance Issue Tracking
  const addComplianceIssue = (issue: Omit<ComplianceIssue, 'id' | 'createdAt' | 'status'>) => {
    const today = new Date().toISOString().substring(0, 10);
    const isOverdue = issue.dueDate < today;

    const newIssue: ComplianceIssue = {
      ...issue,
      id: 'iss-' + Date.now(),
      status: isOverdue ? 'Overdue' : 'Open',
      createdAt: today
    };

    const newNotif: AppNotification = {
      id: 'notif-' + Date.now(),
      title: '⚠️ New Compliance Issue Logged: ' + issue.severity + ' Severity',
      message: '"' + issue.title + '" assigned to employee #' + issue.ownerEmployeeId + '. Due: ' + issue.dueDate,
      type: 'ISSUE_RAISED',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false
    };

    setState(prev => ({
      ...prev,
      transactions: {
        ...prev.transactions,
        complianceIssues: [newIssue, ...prev.transactions.complianceIssues]
      },
      notifications: [newNotif, ...prev.notifications]
    }));
  };

  const updateComplianceIssue = (id: string, updates: Partial<ComplianceIssue>) => {
    setState(prev => ({
      ...prev,
      transactions: {
        ...prev.transactions,
        complianceIssues: prev.transactions.complianceIssues.map(i => i.id === id ? { ...i, ...updates } : i)
      }
    }));
  };

  // Master Data CRUD helpers
  const addEmissionFactor = (factor: Omit<EmissionFactor, 'id'>) => {
    setState(prev => ({
      ...prev,
      master: {
        ...prev.master,
        emissionFactors: [...prev.master.emissionFactors, { ...factor, id: 'ef-' + Date.now() }]
      }
    }));
  };

  const updateEmissionFactor = (id: string, factor: Partial<EmissionFactor>) => {
    setState(prev => ({
      ...prev,
      master: {
        ...prev.master,
        emissionFactors: prev.master.emissionFactors.map(f => f.id === id ? { ...f, ...factor } : f)
      }
    }));
  };

  const deleteEmissionFactor = (id: string) => {
    setState(prev => ({
      ...prev,
      master: {
        ...prev.master,
        emissionFactors: prev.master.emissionFactors.filter(f => f.id !== id)
      }
    }));
  };

  const addProductProfile = (profile: Omit<ProductESGProfile, 'id'>) => {
    setState(prev => ({
      ...prev,
      master: {
        ...prev.master,
        productProfiles: [...prev.master.productProfiles, { ...profile, id: 'prod-' + Date.now() }]
      }
    }));
  };

  const updateProductProfile = (id: string, profile: Partial<ProductESGProfile>) => {
    setState(prev => ({
      ...prev,
      master: {
        ...prev.master,
        productProfiles: prev.master.productProfiles.map(p => p.id === id ? { ...p, ...profile } : p)
      }
    }));
  };

  const addEnvironmentalGoal = (goal: Omit<EnvironmentalGoal, 'id'>) => {
    setState(prev => ({
      ...prev,
      master: {
        ...prev.master,
        goals: [...prev.master.goals, { ...goal, id: 'goal-' + Date.now() }]
      }
    }));
  };

  const updateEnvironmentalGoal = (id: string, goal: Partial<EnvironmentalGoal>) => {
    setState(prev => ({
      ...prev,
      master: {
        ...prev.master,
        goals: prev.master.goals.map(g => g.id === id ? { ...g, ...goal } : g)
      }
    }));
  };

  const addCSRActivity = (activity: Omit<CSRActivity, 'id' | 'registeredCount'>) => {
    setState(prev => ({
      ...prev,
      transactions: {
        ...prev.transactions,
        csrActivities: [...prev.transactions.csrActivities, { ...activity, id: 'csr-' + Date.now(), registeredCount: 0 }]
      }
    }));
  };

  const addPolicy = (policy: Omit<ESGPolicy, 'id'>) => {
    setState(prev => ({
      ...prev,
      master: {
        ...prev.master,
        policies: [...prev.master.policies, { ...policy, id: 'pol-' + Date.now() }]
      }
    }));
  };

  const updatePolicy = (id: string, policy: Partial<ESGPolicy>) => {
    setState(prev => ({
      ...prev,
      master: {
        ...prev.master,
        policies: prev.master.policies.map(p => p.id === id ? { ...p, ...policy } : p)
      }
    }));
  };

  const addAudit = (audit: Omit<Audit, 'id'>) => {
    setState(prev => ({
      ...prev,
      transactions: {
        ...prev.transactions,
        audits: [...prev.transactions.audits, { ...audit, id: 'aud-' + Date.now() }]
      }
    }));
  };

  const updateAudit = (id: string, audit: Partial<Audit>) => {
    setState(prev => ({
      ...prev,
      transactions: {
        ...prev.transactions,
        audits: prev.transactions.audits.map(a => a.id === id ? { ...a, ...audit } : a)
      }
    }));
  };

  const addBadge = (badge: Omit<Badge, 'id'>) => {
    setState(prev => ({
      ...prev,
      master: {
        ...prev.master,
        badges: [...prev.master.badges, { ...badge, id: 'bdg-' + Date.now() }]
      }
    }));
  };

  const addReward = (reward: Omit<Reward, 'id'>) => {
    setState(prev => ({
      ...prev,
      master: {
        ...prev.master,
        rewards: [...prev.master.rewards, { ...reward, id: 'rew-' + Date.now() }]
      }
    }));
  };

  const updateReward = (id: string, reward: Partial<Reward>) => {
    setState(prev => ({
      ...prev,
      master: {
        ...prev.master,
        rewards: prev.master.rewards.map(r => r.id === id ? { ...r, ...reward } : r)
      }
    }));
  };

  const addDepartment = (dept: Omit<Department, 'id'>) => {
    setState(prev => ({
      ...prev,
      master: {
        ...prev.master,
        departments: [...prev.master.departments, { ...dept, id: 'dept-' + Date.now() }]
      }
    }));
  };

  const updateDepartment = (id: string, dept: Partial<Department>) => {
    setState(prev => ({
      ...prev,
      master: {
        ...prev.master,
        departments: prev.master.departments.map(d => d.id === id ? { ...d, ...dept } : d)
      }
    }));
  };

  const deleteDepartment = (id: string) => {
    setState(prev => ({
      ...prev,
      master: {
        ...prev.master,
        departments: prev.master.departments.filter(d => d.id !== id)
      }
    }));
  };

  const addCategory = (cat: Omit<Category, 'id'>) => {
    setState(prev => ({
      ...prev,
      master: {
        ...prev.master,
        categories: [...prev.master.categories, { ...cat, id: 'cat-' + Date.now() }]
      }
    }));
  };

  const updateCategory = (id: string, cat: Partial<Category>) => {
    setState(prev => ({
      ...prev,
      master: {
        ...prev.master,
        categories: prev.master.categories.map(c => c.id === id ? { ...c, ...cat } : c)
      }
    }));
  };

  const deleteCategory = (id: string) => {
    setState(prev => ({
      ...prev,
      master: {
        ...prev.master,
        categories: prev.master.categories.filter(c => c.id !== id)
      }
    }));
  };

  // Notification actions
  const markNotificationAsRead = (id: string) => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => n.id === id ? { ...n, read: true } : n)
    }));
  };

  const markAllNotificationsAsRead = () => {
    setState(prev => ({
      ...prev,
      notifications: prev.notifications.map(n => ({ ...n, read: true }))
    }));
  };

  const clearNotifications = () => {
    setState(prev => ({
      ...prev,
      notifications: []
    }));
  };

  const resetToSeedData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setState(initialSeedData);
  };

  return (
    <EcoSphereContext.Provider
      value={{
        state,
        currentUser: state.currentUser,
        setCurrentUser,
        switchRole,
        departmentScores,
        overallESGScore,
        updateConfig,
        updateWeights,
        addEmissionFactor,
        updateEmissionFactor,
        deleteEmissionFactor,
        addProductProfile,
        updateProductProfile,
        addCarbonTransaction,
        addEnvironmentalGoal,
        updateEnvironmentalGoal,
        addCSRActivity,
        registerForCSRActivity,
        submitCSRProof,
        reviewCSRParticipation,
        addPolicy,
        updatePolicy,
        acknowledgePolicy,
        addAudit,
        updateAudit,
        addComplianceIssue,
        updateComplianceIssue,
        addChallenge,
        updateChallengeStatus,
        joinChallenge,
        submitChallengeProgress,
        reviewChallengeParticipation,
        addBadge,
        addReward,
        updateReward,
        redeemReward,
        addDepartment,
        updateDepartment,
        deleteDepartment,
        addCategory,
        updateCategory,
        deleteCategory,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotifications,
        resetToSeedData
      }}
    >
      {children}
    </EcoSphereContext.Provider>
  );
};

export const useEcoSphere = () => {
  const context = useContext(EcoSphereContext);
  if (!context) {
    throw new Error('useEcoSphere must be used within an EcoSphereProvider');
  }
  return context;
};
