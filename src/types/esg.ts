export type UserRole = 'ADMIN' | 'AUDITOR' | 'EMPLOYEE';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  departmentId: string;
  points: number; // For CSR & Reward Redemptions
  xp: number;     // For Challenges & Badge Unlocks
  avatar: string;
}

export interface Department {
  id: string;
  name: string;
  code: string;
  head: string;
  parentDepartmentId?: string;
  employeeCount: number;
  status: 'Active' | 'Inactive';
}

export interface Category {
  id: string;
  name: string;
  type: 'CSR Activity' | 'Challenge' | 'Emission Factor';
  status: 'Active' | 'Inactive';
}

export interface EmissionFactor {
  id: string;
  name: string;
  category: string;
  scope: 1 | 2 | 3;
  sourceType: 'Purchase' | 'Manufacturing' | 'Expenses' | 'Fleet';
  factorValue: number; // in kg CO2e per unit
  unit: string;
  description?: string;
}

export interface ProductESGProfile {
  id: string;
  productCode: string;
  productName: string;
  carbonFootprintPerUnit: number; // kg CO2e
  recycledMaterialPct: number; // 0 - 100
  energyEfficiencyRating: 'A+' | 'A' | 'B' | 'C' | 'D';
  departmentId: string;
  status: 'Active' | 'Archived';
}

export interface EnvironmentalGoal {
  id: string;
  title: string;
  targetYear: number;
  baselineValue: number;
  targetValue: number;
  currentValue: number;
  unit: string;
  scope: string;
  status: 'On Track' | 'At Risk' | 'Achieved';
}

export interface ESGPolicy {
  id: string;
  title: string;
  code: string;
  category: string;
  version: string;
  effectiveDate: string;
  departmentId?: string;
  summary: string;
  content: string;
  status: 'Active' | 'Draft' | 'Deprecated';
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  unlockRuleType: 'XP_THRESHOLD' | 'CHALLENGES_COMPLETED' | 'CSR_COUNT' | 'POLICY_ALL_SIGNED';
  unlockRuleValue: number;
  icon: string;
  category: 'Environmental' | 'Social' | 'Governance' | 'Mastery';
}

export interface UserBadge {
  id: string;
  badgeId: string;
  employeeId: string;
  unlockedAt: string;
}

export interface Reward {
  id: string;
  name: string;
  description: string;
  pointsRequired: number;
  stock: number;
  category: 'Eco-Perk' | 'Merch' | 'Voucher' | 'Wellness';
  icon: string;
  status: 'Available' | 'Out of Stock';
}

export interface RewardRedemption {
  id: string;
  rewardId: string;
  employeeId: string;
  pointsSpent: number;
  redeemedAt: string;
  status: 'Fulfilled' | 'Processing';
}

export interface CarbonTransaction {
  id: string;
  date: string;
  departmentId: string;
  sourceType: 'Purchase' | 'Manufacturing' | 'Expenses' | 'Fleet';
  emissionFactorId: string;
  quantity: number;
  calculatedEmissions: number; // in kg CO2e
  scope: 1 | 2 | 3;
  notes?: string;
  referenceId?: string;
  productProfileId?: string;
}

export interface CSRActivity {
  id: string;
  title: string;
  categoryId: string;
  description: string;
  pointsAwarded: number;
  date: string;
  location: string;
  maxParticipants: number;
  status: 'Upcoming' | 'Ongoing' | 'Completed';
  registeredCount: number;
}

export interface EmployeeParticipation {
  id: string;
  activityId: string;
  employeeId: string;
  proofAttachmentName?: string;
  proofAttachmentUrl?: string;
  proofNotes?: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  pointsEarned: number;
  completionDate?: string;
  reviewedBy?: string;
  reviewNotes?: string;
  submittedAt: string;
}

export interface Challenge {
  id: string;
  title: string;
  categoryId: string;
  description: string;
  xp: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  evidenceRequired: boolean;
  deadline: string;
  status: 'Draft' | 'Active' | 'Under Review' | 'Completed' | 'Archived';
}

export interface ChallengeParticipation {
  id: string;
  challengeId: string;
  employeeId: string;
  progressPct: number;
  proofAttachmentName?: string;
  proofNotes?: string;
  status: 'Joined' | 'Submitted' | 'Approved' | 'Rejected';
  xpAwarded: number;
  joinedAt: string;
  completedAt?: string;
}

export interface PolicyAcknowledgement {
  id: string;
  policyId: string;
  employeeId: string;
  acknowledgedAt: string;
  digitalSignature: string;
}

export interface Audit {
  id: string;
  title: string;
  auditType: 'Internal' | 'External' | 'Regulatory';
  leadAuditor: string;
  departmentId: string;
  scheduledDate: string;
  completedDate?: string;
  findingsCount: number;
  status: 'Scheduled' | 'In Progress' | 'Completed';
}

export interface ComplianceIssue {
  id: string;
  auditId?: string;
  title: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
  ownerEmployeeId: string;
  dueDate: string;
  status: 'Open' | 'In Review' | 'Resolved' | 'Overdue';
  resolutionNotes?: string;
  createdAt: string;
}

export interface DepartmentScore {
  departmentId: string;
  departmentName: string;
  environmentalScore: number;
  socialScore: number;
  governanceScore: number;
  totalScore: number;
  rank?: number;
}

export interface DiversityMetric {
  category: string;
  breakdown: { label: string; percentage: number; count: number }[];
}

export interface TrainingRecord {
  id: string;
  title: string;
  departmentId: string;
  mandatory: boolean;
  completionPct: number;
  totalEmployees: number;
  completedEmployees: number;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'ISSUE_OVERDUE' | 'ISSUE_RAISED' | 'CSR_APPROVED' | 'CSR_REJECTED' | 'CHALLENGE_APPROVED' | 'BADGE_UNLOCKED' | 'POLICY_REMINDER' | 'SYSTEM' | 'REWARD_REDEEMED';
  createdAt: string;
  read: boolean;
  link?: string;
}

export interface EcoSphereConfig {
  autoEmissionCalc: boolean;
  evidenceRequired: boolean;
  badgeAutoAward: boolean;
  weights: {
    env: number; // default 40
    soc: number; // default 30
    gov: number; // default 30
  };
  notifications: {
    emailAlerts: boolean;
    inAppPopups: boolean;
    overdueReminders: boolean;
  };
}

export interface EcoSphereState {
  currentUser: User;
  users: User[];
  config: EcoSphereConfig;
  master: {
    departments: Department[];
    categories: Category[];
    emissionFactors: EmissionFactor[];
    productProfiles: ProductESGProfile[];
    goals: EnvironmentalGoal[];
    policies: ESGPolicy[];
    badges: Badge[];
    rewards: Reward[];
    userBadges: UserBadge[];
    rewardRedemptions: RewardRedemption[];
  };
  transactions: {
    carbonTransactions: CarbonTransaction[];
    csrParticipations: EmployeeParticipation[];
    challengeParticipations: ChallengeParticipation[];
    csrActivities: CSRActivity[];
    challenges: Challenge[];
    policyAcknowledgements: PolicyAcknowledgement[];
    audits: Audit[];
    complianceIssues: ComplianceIssue[];
  };
  trainingRecords: TrainingRecord[];
  notifications: AppNotification[];
}
