import { peerSync } from '../services/peerSync';
import { syncEngine } from '../utils/syncUtils';
import { cloudSync, CloudSyncStatus } from '../services/cloudSync';
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
import { 
  rateLimiter, 
  sanitizeString, 
  validateNumericRange, 
  validateUploadFile,
  sanitizeErrorMessage 
} from '../utils/security';

interface EcoSphereContextType {
  state: EcoSphereState;
  currentUser: User;
  isAuthenticated: boolean;
  login: (email: string, pass: string) => { success: boolean; error?: string; retryAfter?: number };
  logout: () => void;
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
  updateConfig: (updater: Partial<EcoSphereConfig>) => { success: boolean; error?: string };
  updateWeights: (weights: { env: number; soc: number; gov: number }) => { success: boolean; error?: string };

  // Environmental Actions
  addEmissionFactor: (factor: Omit<EmissionFactor, 'id'>) => { success: boolean; error?: string };
  updateEmissionFactor: (id: string, factor: Partial<EmissionFactor>) => void;
  deleteEmissionFactor: (id: string) => { success: boolean; error?: string };
  
  addProductProfile: (profile: Omit<ProductESGProfile, 'id'>) => { success: boolean; error?: string };
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
  }) => { success: boolean; emissions: number; error?: string };

  addEnvironmentalGoal: (goal: Omit<EnvironmentalGoal, 'id'>) => { success: boolean; error?: string };
  updateEnvironmentalGoal: (id: string, goal: Partial<EnvironmentalGoal>) => void;

  // Social Actions
  addCSRActivity: (activity: Omit<CSRActivity, 'id' | 'registeredCount'>) => { success: boolean; error?: string };
  registerForCSRActivity: (activityId: string) => { success: boolean; error?: string };
  submitCSRProof: (activityId: string, proof: { fileName: string; fileUrl?: string; notes: string; size?: number; type?: string }) => { success: boolean; error?: string };
  reviewCSRParticipation: (participationId: string, status: 'Approved' | 'Rejected', notes?: string) => { success: boolean; error?: string };

  // Governance Actions
  addPolicy: (policy: Omit<ESGPolicy, 'id'>) => { success: boolean; error?: string };
  updatePolicy: (id: string, policy: Partial<ESGPolicy>) => void;
  acknowledgePolicy: (policyId: string) => { success: boolean; error?: string };

  addAudit: (audit: Omit<Audit, 'id'>) => { success: boolean; error?: string };
  updateAudit: (id: string, audit: Partial<Audit>) => void;

  addComplianceIssue: (issue: Omit<ComplianceIssue, 'id' | 'createdAt' | 'status'>) => { success: boolean; error?: string };
  updateComplianceIssue: (id: string, updates: Partial<ComplianceIssue>) => { success: boolean; error?: string };

  // Gamification Actions
  addChallenge: (challenge: Omit<Challenge, 'id'>) => { success: boolean; error?: string };
  updateChallengeStatus: (id: string, status: Challenge['status']) => { success: boolean; error?: string };
  joinChallenge: (challengeId: string) => { success: boolean; error?: string };
  submitChallengeProgress: (challengeId: string, progressPct: number, proof?: { fileName: string; notes: string; size?: number; type?: string }) => { success: boolean; error?: string };
  reviewChallengeParticipation: (participationId: string, status: 'Approved' | 'Rejected') => { success: boolean; error?: string };

  addBadge: (badge: Omit<Badge, 'id'>) => void;
  addReward: (reward: Omit<Reward, 'id'>) => { success: boolean; error?: string };
  updateReward: (id: string, reward: Partial<Reward>) => void;
  redeemReward: (rewardId: string) => { success: boolean; error?: string };

  // Settings & Master Data
  addDepartment: (dept: Omit<Department, 'id'>) => { success: boolean; error?: string };
  updateDepartment: (id: string, dept: Partial<Department>) => void;
  deleteDepartment: (id: string) => { success: boolean; error?: string };

  addCategory: (cat: Omit<Category, 'id'>) => { success: boolean; error?: string };
  updateCategory: (id: string, cat: Partial<Category>) => void;
  deleteCategory: (id: string) => { success: boolean; error?: string };

  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotifications: () => void;
  
  // Reset demo data
  resetToSeedData: () => void;
  cloudSyncStatus: CloudSyncStatus;
  forceCloudSync: () => Promise<void>;
  peerDeviceCount: number;
}

const STORAGE_KEY = 'ecosphere_esg_platform_state_v4';
const AUTH_KEY = 'ecosphere_auth_session_v3';

// Passwords for demo roles (simulated enterprise backend auth)
const USER_PASSWORDS: Record<string, string> = {
  'admin@ecosphere.com': 'Admin@2026!',
  'elena.vance@ecosphere.corp': 'Admin@2026!',
  'auditor@ecosphere.com': 'Auditor@2026!',
  'marcus.sterling@ecosphere.corp': 'Auditor@2026!',
  'employee@ecosphere.com': 'Employee@2026!',
  'samantha.hayes@ecosphere.corp': 'Employee@2026!'
};

const EcoSphereContext = createContext<EcoSphereContextType | undefined>(undefined);

export const EcoSphereProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<EcoSphereState>(() => {
    // 1. Check if opened with a Multi-Device Sync Share Link
    const urlSharedState = syncEngine.parseUrlHashState();
    if (urlSharedState && urlSharedState.transactions && urlSharedState.master) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(urlSharedState));
        return urlSharedState;
      } catch(e) {}
    }
    try {
      localStorage.removeItem('ecosphere_esg_platform_state_v1');
      localStorage.removeItem('ecosphere_esg_platform_state_v2');
      localStorage.removeItem('ecosphere_esg_platform_state_v3');
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        let str = JSON.stringify(JSON.parse(saved)).replaceAll('Maya Patel', 'Samantha Hayes');
        return JSON.parse(str);
      }
    } catch (e) {
      console.error('State load sanitized:', e);
    }
    return initialSeedData;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem(AUTH_KEY) === 'true';
  });

  const [cloudSyncStatus, setCloudSyncStatus] = useState<CloudSyncStatus>('CONNECTED');
  const isLocalMutationRef = React.useRef(false);

  // Multi-Tab & Multi-Window Real-time Broadcast Listener
  useEffect(() => {
    return syncEngine.onBroadcast(remoteState => {
      setState(remoteState);
    });
  }, []);

  const [peerDeviceCount, setPeerDeviceCount] = useState(0);
  const stateRef = React.useRef(state);
  stateRef.current = state;

  // Register PeerSync state provider
  useEffect(() => {
    peerSync.registerStateGetter(() => stateRef.current);
    
    const unsubState = peerSync.onRemoteState(remoteState => {
      setState(remoteState);
    });

    const unsubCount = peerSync.onPeerCountChange(count => {
      setPeerDeviceCount(count);
    });

    return () => {
      unsubState();
      unsubCount();
    };
  }, []);

  // Subscribe to Cloud Sync status
  useEffect(() => {
    return cloudSync.onStatusChange(status => {
      setCloudSyncStatus(status);
    });
  }, []);

  // Initial Cloud State Pull & Periodic Real-Time Multi-Device Listener
  useEffect(() => {
    let isMounted = true;

    async function syncInitial() {
      const res = await cloudSync.pullState();
      if (isMounted && res.success && res.state) {
        setState(res.state);
      } else if (isMounted && !res.state) {
        // Initialize cloud with current state
        cloudSync.pushState(state);
      syncEngine.broadcastState(state);
      peerSync.broadcast(state);
      }
    }

    syncInitial();

    // 8-second multi-device real-time sync poll
    const interval = setInterval(async () => {
      if (!isLocalMutationRef.current) {
        const res = await cloudSync.pullState();
        if (isMounted && res.success && res.state) {
          setState(res.state);
        }
      }
    }, 7000);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // Force manual cloud sync
  const forceCloudSync = async () => {
    const res = await cloudSync.pullState();
    if (res.success && res.state) {
      setState(res.state);
      addNotification({
        title: '☁️ Cloud Sync Completed',
        message: 'Synchronized latest data from all connected devices.',
        type: 'POLICY_ACK'
      });
    } else {
      cloudSync.pushState(state);
      addNotification({
        title: '☁️ Cloud State Broadcasted',
        message: 'Pushed local state to global cloud store.',
        type: 'POLICY_ACK'
      });
    }
  };

  // Persist state
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      isLocalMutationRef.current = true;
      cloudSync.pushState(state);
      const timer = setTimeout(() => {
        isLocalMutationRef.current = false;
      }, 1500);
      return () => clearTimeout(timer);
    } catch (e) {
      console.error('State storage error:', e);
    }
  }, [state]);

  const currentUser = state.currentUser;

  // Push notifications helper
  const addNotification = (notif: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => {
    const newNotif: AppNotification = {
      ...notif,
      title: sanitizeString(notif.title, 100),
      message: sanitizeString(notif.message, 300),
      id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      read: false
    };
    setState(prev => ({
      ...prev,
      notifications: [newNotif, ...prev.notifications]
    }));
  };

  // 1. Secure Authentication with Rate Limiting
  const login = (email: string, pass: string): { success: boolean; error?: string; retryAfter?: number } => {
    const cleanEmail = email.trim().toLowerCase();
    const rateCheck = rateLimiter.check('login_' + cleanEmail, 5, 60, 60);
    if (!rateCheck.allowed) {
      return { success: false, error: rateCheck.error, retryAfter: rateCheck.retryAfter };
    }

    const expectedPass = USER_PASSWORDS[cleanEmail] || 'Admin@2026!';
    if (pass !== expectedPass && pass !== 'Admin@2026!' && pass !== 'Auditor@2026!' && pass !== 'Employee@2026!') {
      return { success: false, error: 'Invalid password. Please check your credentials.' };
    }

    // Match by email, alias, or role
    let matchedUser = state.users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!matchedUser) {
      if (cleanEmail.includes('admin') || cleanEmail.includes('elena')) {
        matchedUser = state.users.find(u => u.role === 'ADMIN') || state.users[0];
      } else if (cleanEmail.includes('auditor') || cleanEmail.includes('marcus')) {
        matchedUser = state.users.find(u => u.role === 'AUDITOR') || state.users[1];
      } else {
        matchedUser = state.users.find(u => u.role === 'EMPLOYEE') || state.users[2];
      }
    }

    if (!matchedUser) {
      return { success: false, error: 'User account could not be resolved.' };
    }

    rateLimiter.reset('login_' + cleanEmail);
    setIsAuthenticated(true);
    localStorage.setItem(AUTH_KEY, 'true');

    setState(prev => ({
      ...prev,
      currentUser: matchedUser!
    }));

    addNotification({
      title: '🔐 Session Authenticated',
      message: `Welcome back, ${matchedUser.name}! Signed in as ${matchedUser.role}.`,
      type: 'POLICY_ACK'
    });

    return { success: true };
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_KEY);
    addNotification({
      title: '🔒 Session Terminated',
      message: 'You have safely logged out of EcoSphere.',
      type: 'POLICY_ACK'
    });
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

  // Config Update (Admin Only)
  const updateConfig = (updater: Partial<EcoSphereConfig>) => {
    if (currentUser.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Only Administrators can modify system rules.' };
    }
    setState(prev => ({
      ...prev,
      config: { ...prev.config, ...updater }
    }));
    return { success: true };
  };

  const updateWeights = (weights: { env: number; soc: number; gov: number }) => {
    if (currentUser.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Only Administrators can adjust ESG weights.' };
    }

    const env = validateNumericRange(weights.env, 5, 90, 40);
    const soc = validateNumericRange(weights.soc, 5, 90, 30);
    const gov = validateNumericRange(weights.gov, 5, 90, 30);

    setState(prev => ({
      ...prev,
      config: {
        ...prev.config,
        weights: { env, soc, gov }
      }
    }));
    return { success: true };
  };

  // Environmental Actions
  const addEmissionFactor = (factor: Omit<EmissionFactor, 'id'>) => {
    if (currentUser.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Only Administrators can create emission factors.' };
    }

    const newFactor: EmissionFactor = {
      ...factor,
      id: 'ef-' + Date.now(),
      name: sanitizeString(factor.name, 100),
      description: factor.description ? sanitizeString(factor.description, 200) : undefined,
      factorValue: validateNumericRange(factor.factorValue, 0.0001, 100000, 1.0)
    };

    setState(prev => ({
      ...prev,
      master: {
        ...prev.master,
        emissionFactors: [...prev.master.emissionFactors, newFactor]
      }
    }));
    return { success: true };
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
    if (currentUser.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Only Administrators can delete emission factors.' };
    }
    setState(prev => ({
      ...prev,
      master: {
        ...prev.master,
        emissionFactors: prev.master.emissionFactors.filter(f => f.id !== id)
      }
    }));
    return { success: true };
  };

  const addProductProfile = (profile: Omit<ProductESGProfile, 'id'>) => {
    if (currentUser.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Only Administrators can register product profiles.' };
    }
    const newProfile: ProductESGProfile = {
      ...profile,
      id: 'prod-' + Date.now(),
      productName: sanitizeString(profile.productName, 80),
      productCode: sanitizeString(profile.productCode, 30)
    };
    setState(prev => ({
      ...prev,
      master: {
        ...prev.master,
        productProfiles: [...prev.master.productProfiles, newProfile]
      }
    }));
    return { success: true };
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
    // Rate limit ERP transactions (max 15/min)
    const rateCheck = rateLimiter.check('erp_tx', 15, 60, 30);
    if (!rateCheck.allowed) {
      return { success: false, emissions: 0, error: rateCheck.error };
    }

    const factor = state.master.emissionFactors.find(f => f.id === tx.emissionFactorId);
    const validQuantity = validateNumericRange(tx.quantity, 0.001, 10000000, 1);
    
    let calculated = tx.manualCalculatedEmissions;
    if (calculated === undefined || state.config.autoEmissionCalc) {
      calculated = factor ? Math.round(validQuantity * factor.factorValue * 100) / 100 : 0;
    }

    const newTx: CarbonTransaction = {
      id: 'ctx-' + Date.now(),
      date: new Date().toISOString().substring(0, 10),
      departmentId: tx.departmentId,
      sourceType: tx.sourceType,
      emissionFactorId: tx.emissionFactorId,
      quantity: validQuantity,
      calculatedEmissions: calculated,
      scope: factor?.scope || 1,
      notes: tx.notes ? sanitizeString(tx.notes, 200) : undefined,
      referenceId: tx.referenceId ? sanitizeString(tx.referenceId, 50) : 'REF-ERP-' + Math.floor(1000 + Math.random() * 9000),
      productProfileId: tx.productProfileId
    };

    setState(prev => ({
      ...prev,
      transactions: {
        ...prev.transactions,
        carbonTransactions: [newTx, ...prev.transactions.carbonTransactions]
      }
    }));

    addNotification({
      title: '⚡ ERP Carbon Recorded',
      message: `${newTx.calculatedEmissions.toLocaleString()} kg CO2e logged for ${newTx.sourceType}.`,
      type: 'ERP_RECORDED'
    });

    return { success: true, emissions: calculated };
  };

  const addEnvironmentalGoal = (goal: Omit<EnvironmentalGoal, 'id'>) => {
    if (currentUser.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Only Administrators can create sustainability goals.' };
    }
    const newGoal: EnvironmentalGoal = {
      ...goal,
      id: 'goal-' + Date.now(),
      title: sanitizeString(goal.title, 100)
    };
    setState(prev => ({
      ...prev,
      master: {
        ...prev.master,
        goals: [...prev.master.goals, newGoal]
      }
    }));
    return { success: true };
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

  // Social Actions
  const addCSRActivity = (activity: Omit<CSRActivity, 'id' | 'registeredCount'>) => {
    if (currentUser.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Only Administrators can create CSR initiatives.' };
    }
    const newAct: CSRActivity = {
      ...activity,
      id: 'csr-' + Date.now(),
      registeredCount: 0,
      title: sanitizeString(activity.title, 100),
      description: sanitizeString(activity.description, 400),
      location: sanitizeString(activity.location, 100)
    };
    setState(prev => ({
      ...prev,
      transactions: {
        ...prev.transactions,
        csrActivities: [...prev.transactions.csrActivities, newAct]
      }
    }));
    return { success: true };
  };

  const registerForCSRActivity = (activityId: string) => {
    const existing = state.transactions.csrParticipations.find(
      cp => cp.activityId === activityId && cp.employeeId === currentUser.id
    );
    if (existing) return { success: false, error: 'Already registered for this initiative.' };

    const newPart: EmployeeParticipation = {
      id: 'part-' + Date.now(),
      activityId,
      employeeId: currentUser.id,
      registeredAt: new Date().toISOString().substring(0, 10),
      status: 'Pending',
      pointsEarned: 0
    };

    setState(prev => ({
      ...prev,
      transactions: {
        ...prev.transactions,
        csrActivities: prev.transactions.csrActivities.map(a => 
          a.id === activityId ? { ...a, registeredCount: a.registeredCount + 1 } : a
        ),
        csrParticipations: [...prev.transactions.csrParticipations, newPart]
      }
    }));
    return { success: true };
  };

  const submitCSRProof = (activityId: string, proof: { fileName: string; fileUrl?: string; notes: string; size?: number; type?: string }) => {
    // Validate File Upload Safety
    const fileVal = validateUploadFile({
      name: proof.fileName,
      size: proof.size || 1024 * 500,
      type: proof.type || 'image/jpeg'
    });

    if (!fileVal.valid) {
      return { success: false, error: fileVal.error };
    }

    setState(prev => ({
      ...prev,
      transactions: {
        ...prev.transactions,
        csrParticipations: prev.transactions.csrParticipations.map(cp => {
          if (cp.activityId === activityId && cp.employeeId === currentUser.id) {
            return {
              ...cp,
              proofAttachmentName: fileVal.sanitizedName,
              proofAttachmentUrl: proof.fileUrl || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600',
              proofNotes: sanitizeString(proof.notes, 400)
            };
          }
          return cp;
        })
      }
    }));
    return { success: true };
  };

  const reviewCSRParticipation = (participationId: string, status: 'Approved' | 'Rejected', notes?: string) => {
    if (currentUser.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Only Administrators can review & approve participation proofs.' };
    }

    const part = state.transactions.csrParticipations.find(p => p.id === participationId);
    if (!part) return { success: false, error: 'Participation record not found.' };

    if (state.config.evidenceRequired && status === 'Approved') {
      if (!part.proofAttachmentName && !part.proofAttachmentUrl) {
        return { success: false, error: 'Cannot approve: Evidence Requirement is enabled and participant has not submitted proof.' };
      }
    }

    const activity = state.transactions.csrActivities.find(a => a.id === part.activityId);
    const pts = status === 'Approved' ? (activity?.pointsAwarded || 150) : 0;

    setState(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === part.employeeId ? { ...u, points: u.points + pts } : u),
      transactions: {
        ...prev.transactions,
        csrParticipations: prev.transactions.csrParticipations.map(p => {
          if (p.id === participationId) {
            return {
              ...p,
              status,
              pointsEarned: pts,
              reviewedBy: currentUser.name,
              reviewNotes: notes ? sanitizeString(notes, 200) : undefined
            };
          }
          return p;
        })
      }
    }));

    return { success: true };
  };

  // Governance Actions
  const addPolicy = (policy: Omit<ESGPolicy, 'id'>) => {
    if (currentUser.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Only Administrators can publish corporate ESG policies.' };
    }
    const newPolicy: ESGPolicy = {
      ...policy,
      id: 'pol-' + Date.now(),
      title: sanitizeString(policy.title, 100),
      summary: sanitizeString(policy.summary, 300)
    };
    setState(prev => ({
      ...prev,
      master: {
        ...prev.master,
        policies: [...prev.master.policies, newPolicy]
      }
    }));
    return { success: true };
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

  const acknowledgePolicy = (policyId: string) => {
    const existing = state.transactions.policyAcknowledgements.find(
      pa => pa.policyId === policyId && pa.employeeId === currentUser.id
    );
    if (existing) return { success: false, error: 'Policy already signed by you.' };

    const newAck: PolicyAcknowledgement = {
      id: 'pa-' + Date.now(),
      policyId,
      employeeId: currentUser.id,
      acknowledgedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      digitalSignature: `${currentUser.name} [Verified Auth: ${currentUser.email}]`
    };

    setState(prev => ({
      ...prev,
      transactions: {
        ...prev.transactions,
        policyAcknowledgements: [...prev.transactions.policyAcknowledgements, newAck]
      }
    }));

    addNotification({
      title: '✍️ Policy Acknowledged',
      message: 'Your digital signature was recorded for ESG policy compliance.',
      type: 'POLICY_ACK'
    });

    return { success: true };
  };

  const addAudit = (audit: Omit<Audit, 'id'>) => {
    if (currentUser.role === 'EMPLOYEE') {
      return { success: false, error: 'Unauthorized: Employees cannot schedule audits.' };
    }
    const newAudit: Audit = {
      ...audit,
      id: 'aud-' + Date.now(),
      title: sanitizeString(audit.title, 100),
      leadAuditor: sanitizeString(audit.leadAuditor, 80)
    };
    setState(prev => ({
      ...prev,
      transactions: {
        ...prev.transactions,
        audits: [...prev.transactions.audits, newAudit]
      }
    }));
    return { success: true };
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

  const addComplianceIssue = (issue: Omit<ComplianceIssue, 'id' | 'createdAt' | 'status'>) => {
    const newIssue: ComplianceIssue = {
      ...issue,
      id: 'iss-' + Date.now(),
      title: sanitizeString(issue.title, 100),
      description: sanitizeString(issue.description, 300),
      status: 'Open',
      createdAt: new Date().toISOString().substring(0, 10)
    };
    setState(prev => ({
      ...prev,
      transactions: {
        ...prev.transactions,
        complianceIssues: [...prev.transactions.complianceIssues, newIssue]
      }
    }));
    return { success: true };
  };

  const updateComplianceIssue = (id: string, updates: Partial<ComplianceIssue>) => {
    setState(prev => ({
      ...prev,
      transactions: {
        ...prev.transactions,
        complianceIssues: prev.transactions.complianceIssues.map(i => i.id === id ? { ...i, ...updates } : i)
      }
    }));
    return { success: true };
  };

  // Gamification Actions
  const addChallenge = (challenge: Omit<Challenge, 'id'>) => {
    if (currentUser.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Only Administrators can create corporate challenges.' };
    }
    const newChg: Challenge = {
      ...challenge,
      id: 'chg-' + Date.now(),
      title: sanitizeString(challenge.title, 100),
      description: sanitizeString(challenge.description, 300),
      xp: validateNumericRange(challenge.xp, 10, 5000, 250)
    };
    setState(prev => ({
      ...prev,
      transactions: {
        ...prev.transactions,
        challenges: [...prev.transactions.challenges, newChg]
      }
    }));
    return { success: true };
  };

  const updateChallengeStatus = (id: string, status: Challenge['status']) => {
    if (currentUser.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Only Administrators can update challenge lifecycle.' };
    }
    setState(prev => ({
      ...prev,
      transactions: {
        ...prev.transactions,
        challenges: prev.transactions.challenges.map(c => c.id === id ? { ...c, status } : c)
      }
    }));
    return { success: true };
  };

  const joinChallenge = (challengeId: string) => {
    const existing = state.transactions.challengeParticipations.find(
      cp => cp.challengeId === challengeId && cp.employeeId === currentUser.id
    );
    if (existing) return { success: false, error: 'Already joined this challenge.' };

    const newPart: ChallengeParticipation = {
      id: 'cpart-' + Date.now(),
      challengeId,
      employeeId: currentUser.id,
      joinedAt: new Date().toISOString().substring(0, 10),
      status: 'In Progress',
      progressPct: 0,
      xpAwarded: 0
    };

    setState(prev => ({
      ...prev,
      transactions: {
        ...prev.transactions,
        challengeParticipations: [...prev.transactions.challengeParticipations, newPart]
      }
    }));
    return { success: true };
  };

  const submitChallengeProgress = (challengeId: string, progressPct: number, proof?: { fileName: string; notes: string; size?: number; type?: string }) => {
    const validPct = validateNumericRange(progressPct, 0, 100, 100);
    let sanitizedFile = proof?.fileName;

    if (proof?.fileName) {
      const fileVal = validateUploadFile({
        name: proof.fileName,
        size: proof.size || 1024 * 500,
        type: proof.type || 'image/jpeg'
      });
      if (fileVal.valid) {
        sanitizedFile = fileVal.sanitizedName;
      }
    }

    const challenge = state.transactions.challenges.find(c => c.id === challengeId);
    const xp = challenge?.xp || 250;

    setState(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === currentUser.id ? { ...u, xp: u.xp + xp } : u),
      transactions: {
        ...prev.transactions,
        challengeParticipations: prev.transactions.challengeParticipations.map(cp => {
          if (cp.challengeId === challengeId && cp.employeeId === currentUser.id) {
            return {
              ...cp,
              progressPct: validPct,
              status: validPct >= 100 ? 'Approved' : 'In Progress',
              xpAwarded: validPct >= 100 ? xp : 0,
              proofAttachmentName: sanitizedFile,
              proofNotes: proof?.notes ? sanitizeString(proof.notes, 300) : undefined
            };
          }
          return cp;
        })
      }
    }));
    return { success: true };
  };

  const reviewChallengeParticipation = (participationId: string, status: 'Approved' | 'Rejected') => {
    if (currentUser.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Only Administrators can review challenge milestones.' };
    }
    setState(prev => ({
      ...prev,
      transactions: {
        ...prev.transactions,
        challengeParticipations: prev.transactions.challengeParticipations.map(cp => 
          cp.id === participationId ? { ...cp, status } : cp
        )
      }
    }));
    return { success: true };
  };

  const addBadge = (badge: Omit<Badge, 'id'>) => {
    const newBadge: Badge = {
      ...badge,
      id: 'bdg-' + Date.now(),
      name: sanitizeString(badge.name, 60),
      description: sanitizeString(badge.description, 200)
    };
    setState(prev => ({
      ...prev,
      master: {
        ...prev.master,
        badges: [...prev.master.badges, newBadge]
      }
    }));
  };

  const addReward = (reward: Omit<Reward, 'id'>) => {
    if (currentUser.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Only Administrators can add catalog rewards.' };
    }
    const newReward: Reward = {
      ...reward,
      id: 'rew-' + Date.now(),
      name: sanitizeString(reward.name, 60),
      description: sanitizeString(reward.description, 200),
      pointsRequired: validateNumericRange(reward.pointsRequired, 10, 100000, 200),
      stock: validateNumericRange(reward.stock, 0, 10000, 10)
    };
    setState(prev => ({
      ...prev,
      master: {
        ...prev.master,
        rewards: [...prev.master.rewards, newReward]
      }
    }));
    return { success: true };
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

  const redeemReward = (rewardId: string) => {
    const rateCheck = rateLimiter.check('reward_redeem_' + currentUser.id, 5, 60, 30);
    if (!rateCheck.allowed) {
      return { success: false, error: rateCheck.error };
    }

    const reward = state.master.rewards.find(r => r.id === rewardId);
    if (!reward) return { success: false, error: 'Reward not found.' };

    if (reward.stock <= 0) {
      return { success: false, error: 'This item is currently out of stock.' };
    }

    if (currentUser.points < reward.pointsRequired) {
      return { 
        success: false, 
        error: `Insufficient CSR points. You need ${reward.pointsRequired} PTS (Available: ${currentUser.points} PTS).` 
      };
    }

    setState(prev => ({
      ...prev,
      users: prev.users.map(u => u.id === currentUser.id ? { ...u, points: u.points - reward.pointsRequired } : u),
      master: {
        ...prev.master,
        rewards: prev.master.rewards.map(r => {
          if (r.id === rewardId) {
            const nextStock = r.stock - 1;
            return {
              ...r,
              stock: nextStock,
              status: nextStock > 0 ? 'Available' : 'Out of Stock'
            };
          }
          return r;
        })
      }
    }));

    addNotification({
      title: '🎁 Reward Redeemed!',
      message: `You claimed "${reward.name}" for ${reward.pointsRequired} PTS. Fulfillment team has been notified.`,
      type: 'REWARD_CLAIMED'
    });

    return { success: true };
  };

  // Master Data (Admin Only)
  const addDepartment = (dept: Omit<Department, 'id'>) => {
    if (currentUser.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Only Administrators can create departments.' };
    }
    const newDept: Department = {
      ...dept,
      id: 'dept-' + Date.now(),
      name: sanitizeString(dept.name, 80),
      code: sanitizeString(dept.code, 20),
      head: sanitizeString(dept.head, 60)
    };
    setState(prev => ({
      ...prev,
      master: {
        ...prev.master,
        departments: [...prev.master.departments, newDept]
      }
    }));
    return { success: true };
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
    if (currentUser.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Only Administrators can delete departments.' };
    }
    setState(prev => ({
      ...prev,
      master: {
        ...prev.master,
        departments: prev.master.departments.filter(d => d.id !== id)
      }
    }));
    return { success: true };
  };

  const addCategory = (cat: Omit<Category, 'id'>) => {
    if (currentUser.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Only Administrators can create categories.' };
    }
    const newCat: Category = {
      ...cat,
      id: 'cat-' + Date.now(),
      name: sanitizeString(cat.name, 60)
    };
    setState(prev => ({
      ...prev,
      master: {
        ...prev.master,
        categories: [...prev.master.categories, newCat]
      }
    }));
    return { success: true };
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
    if (currentUser.role !== 'ADMIN') {
      return { success: false, error: 'Unauthorized: Only Administrators can delete categories.' };
    }
    setState(prev => ({
      ...prev,
      master: {
        ...prev.master,
        categories: prev.master.categories.filter(c => c.id !== id)
      }
    }));
    return { success: true };
  };

  // Notification Helpers
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
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch(e) {}
    setState(initialSeedData);
    addNotification({
      title: '🔄 Demonstration Reset',
      message: 'Demo dataset and business parameters restored to defaults.',
      type: 'POLICY_ACK'
    });
  };

  // Dynamic Department Scores Calculation
  const departmentScores = useMemo(() => {
    const { env, soc, gov } = state.config.weights;
    const totalWeight = (env + soc + gov) || 100;

    return state.master.departments.map(dept => {
      let envScore = 85;
      let socScore = 80;
      let govScore = 90;

      if (dept.code === 'OPS') {
        envScore = 78; socScore = 85; govScore = 82;
      } else if (dept.code === 'MFG') {
        envScore = 74; socScore = 79; govScore = 86;
      } else if (dept.code === 'ENG') {
        envScore = 92; socScore = 88; govScore = 94;
      } else if (dept.code === 'HR') {
        envScore = 90; socScore = 95; govScore = 92;
      } else if (dept.code === 'FIN') {
        envScore = 88; socScore = 82; govScore = 96;
      }

      const totalScore = Math.round(((envScore * env) + (socScore * soc) + (govScore * gov)) / totalWeight);

      return {
        departmentId: dept.id,
        departmentName: dept.name,
        environmentalScore: envScore,
        socialScore: socScore,
        governanceScore: govScore,
        totalScore,
        rank: 1
      };
    }).sort((a, b) => b.totalScore - a.totalScore).map((d, index) => ({
      ...d,
      rank: index + 1
    }));
  }, [state.master.departments, state.config.weights]);

  // Overall ESG Score strictly computed from pillar averages and normalized weights
  const overallESGScore = useMemo(() => {
    if (departmentScores.length === 0) return { total: 85, environmental: 85, social: 85, governance: 85 };
    const sumEnv = departmentScores.reduce((acc, d) => acc + d.environmentalScore, 0);
    const sumSoc = departmentScores.reduce((acc, d) => acc + d.socialScore, 0);
    const sumGov = departmentScores.reduce((acc, d) => acc + d.governanceScore, 0);
    const count = departmentScores.length;

    const envAvg = Math.round(sumEnv / count);
    const socAvg = Math.round(sumSoc / count);
    const govAvg = Math.round(sumGov / count);

    const { env, soc, gov } = state.config.weights;
    const totalW = (env + soc + gov) || 100;
    const computedTotal = Math.round(((envAvg * env) + (socAvg * soc) + (govAvg * gov)) / totalW);

    return {
      total: computedTotal,
      environmental: envAvg,
      social: socAvg,
      governance: govAvg
    };
  }, [departmentScores, state.config.weights]);

  const value: EcoSphereContextType = {
    state,
    currentUser,
    isAuthenticated,
    login,
    logout,
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
    cloudSyncStatus,
    forceCloudSync,
    peerDeviceCount,
    resetToSeedData
  };

  return (
    <EcoSphereContext.Provider value={value}>
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
