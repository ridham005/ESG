import { EcoSphereState } from '../types/esg';

export const initialSeedData: EcoSphereState = {
  currentUser: {
    id: 'usr-1',
    name: 'Elena Vance',
    email: 'elena.vance@ecosphere.corp',
    role: 'ADMIN',
    departmentId: 'dept-1',
    points: 420,
    xp: 850,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  },
  users: [
    {
      id: 'usr-1',
      name: 'Elena Vance',
      email: 'elena.vance@ecosphere.corp',
      role: 'ADMIN',
      departmentId: 'dept-1',
      points: 420,
      xp: 850,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'usr-2',
      name: 'Marcus Sterling',
      email: 'marcus.sterling@ecosphere.corp',
      role: 'AUDITOR',
      departmentId: 'dept-5',
      points: 210,
      xp: 480,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'usr-3',
      name: 'Samantha Hayes',
      email: 'maya.patel@ecosphere.corp',
      role: 'EMPLOYEE',
      departmentId: 'dept-2',
      points: 650,
      xp: 1240,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'usr-4',
      name: 'Carlos Mendoza',
      email: 'carlos.mendoza@ecosphere.corp',
      role: 'EMPLOYEE',
      departmentId: 'dept-1',
      points: 310,
      xp: 590,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'usr-5',
      name: 'Sarah Chen',
      email: 'sarah.chen@ecosphere.corp',
      role: 'EMPLOYEE',
      departmentId: 'dept-3',
      points: 480,
      xp: 920,
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'
    }
  ],
  config: {
    autoEmissionCalc: true,
    evidenceRequired: true,
    badgeAutoAward: true,
    weights: {
      env: 40,
      soc: 30,
      gov: 30
    },
    notifications: {
      emailAlerts: true,
      inAppPopups: true,
      overdueReminders: true
    }
  },
  master: {
    departments: [
      { id: 'dept-1', name: 'Operations & Logistics', code: 'OPS', head: 'Carlos Mendoza', employeeCount: 142, status: 'Active' },
      { id: 'dept-2', name: 'Technology & Engineering', code: 'ENG', head: 'Samantha Hayes', employeeCount: 215, status: 'Active' },
      { id: 'dept-3', name: 'Facilities & Real Estate', code: 'FAC', head: 'Sarah Chen', employeeCount: 68, status: 'Active' },
      { id: 'dept-4', name: 'Human Resources & Culture', code: 'HRC', head: 'Amara Okafor', employeeCount: 45, status: 'Active' },
      { id: 'dept-5', name: 'Legal, Risk & Compliance', code: 'LRC', head: 'Marcus Sterling', employeeCount: 38, status: 'Active' }
    ],
    categories: [
      { id: 'cat-1', name: 'Climate & Reforestation', type: 'CSR Activity', status: 'Active' },
      { id: 'cat-2', name: 'Community Empowerment', type: 'CSR Activity', status: 'Active' },
      { id: 'cat-3', name: 'Circular Economy', type: 'CSR Activity', status: 'Active' },
      { id: 'cat-4', name: 'Energy Conservation', type: 'Challenge', status: 'Active' },
      { id: 'cat-5', name: 'Zero Waste Challenge', type: 'Challenge', status: 'Active' },
      { id: 'cat-6', name: 'Green Commuting', type: 'Challenge', status: 'Active' },
      { id: 'cat-7', name: 'Direct Combustion (Scope 1)', type: 'Emission Factor', status: 'Active' },
      { id: 'cat-8', name: 'Purchased Energy (Scope 2)', type: 'Emission Factor', status: 'Active' },
      { id: 'cat-9', name: 'Supply & Travel (Scope 3)', type: 'Emission Factor', status: 'Active' }
    ],
    emissionFactors: [
      { id: 'ef-1', name: 'Electricity Grid (US Average)', category: 'Electricity', scope: 2, sourceType: 'Expenses', factorValue: 0.385, unit: 'kWh', description: '0.385 kg CO2e per kWh consumed' },
      { id: 'ef-2', name: 'Commercial Fleet Diesel Fuel', category: 'Mobile Combustion', scope: 1, sourceType: 'Fleet', factorValue: 2.68, unit: 'liters', description: '2.68 kg CO2e per liter diesel' },
      { id: 'ef-3', name: 'Natural Gas Heating', category: 'Stationary Combustion', scope: 1, sourceType: 'Expenses', factorValue: 2.03, unit: 'm3', description: '2.03 kg CO2e per m3 gas' },
      { id: 'ef-4', name: 'Commercial Air Travel (Short Haul)', category: 'Business Travel', scope: 3, sourceType: 'Expenses', factorValue: 0.158, unit: 'passenger-km', description: '0.158 kg CO2e per km' },
      { id: 'ef-5', name: 'Raw Aluminum Ingot', category: 'Raw Materials', scope: 3, sourceType: 'Purchase', factorValue: 8.24, unit: 'kg', description: '8.24 kg CO2e per kg purchased' },
      { id: 'ef-6', name: 'Assembly Line Machine Operation', category: 'Industrial Process', scope: 1, sourceType: 'Manufacturing', factorValue: 1.45, unit: 'hours', description: '1.45 kg CO2e per machine operating hr' }
    ],
    productProfiles: [
      { id: 'prod-1', productCode: 'PRD-SRV-01', productName: 'EcoServer Blade X1', carbonFootprintPerUnit: 142.5, recycledMaterialPct: 68, energyEfficiencyRating: 'A+', departmentId: 'dept-2', status: 'Active' },
      { id: 'prod-2', productCode: 'PRD-PKG-02', productName: 'BioPackaging Box Large', carbonFootprintPerUnit: 0.85, recycledMaterialPct: 95, energyEfficiencyRating: 'A', departmentId: 'dept-1', status: 'Active' },
      { id: 'prod-3', productCode: 'PRD-MOD-03', productName: 'Smart Thermostat Hub V3', carbonFootprintPerUnit: 18.2, recycledMaterialPct: 52, energyEfficiencyRating: 'A+', departmentId: 'dept-3', status: 'Active' }
    ],
    goals: [
      { id: 'goal-1', title: 'Scope 1 & 2 Emissions Reduction', targetYear: 2028, baselineValue: 4800, targetValue: 2400, currentValue: 3120, unit: 'tCO2e', scope: 'Scope 1 & 2', status: 'On Track' },
      { id: 'goal-2', title: '100% Renewable Facility Power', targetYear: 2027, baselineValue: 35, targetValue: 100, currentValue: 78, unit: '% Renewable', scope: 'Scope 2', status: 'On Track' },
      { id: 'goal-3', title: 'Zero Waste to Landfill Certification', targetYear: 2026, baselineValue: 42, targetValue: 90, currentValue: 68, unit: '% Diverted', scope: 'Scope 3', status: 'At Risk' }
    ],
    policies: [
      {
        id: 'pol-1',
        title: 'Global Environmental Sustainability Policy',
        code: 'POL-ENV-01',
        category: 'Environmental',
        version: 'v3.2',
        effectiveDate: '2026-01-15',
        summary: 'Standardizes emission reduction protocols, waste diversion targets, and energy usage metrics.',
        content: 'This policy governs the operations of all corporate facilities and logistics chains. All business units must report monthly emission metrics and implement energy-saving measures.',
        status: 'Active'
      },
      {
        id: 'pol-2',
        title: 'Workplace Diversity, Equity & Inclusion Standard',
        code: 'POL-SOC-02',
        category: 'Social',
        version: 'v2.1',
        effectiveDate: '2025-11-01',
        summary: 'Ensures equitable hiring, anti-discrimination guidelines, and transparent promotion pathways.',
        content: 'EcoSphere mandates fair treatment, equitable compensation, and anti-harassment protections across all global teams and contractors.',
        status: 'Active'
      },
      {
        id: 'pol-3',
        title: 'Corporate Ethics, Anti-Corruption & Whistleblower Protection',
        code: 'POL-GOV-03',
        category: 'Governance',
        version: 'v4.0',
        effectiveDate: '2026-02-01',
        summary: 'Establishes zero-tolerance compliance standards for bribery, fraud, and conflicts of interest.',
        content: 'Employees and officers must adhere strictly to international anti-bribery regulations. Confidential whistleblower hotlines are maintained 24/7.',
        status: 'Active'
      }
    ],
    badges: [
      { id: 'bdg-1', name: 'Eco Pioneer', description: 'Accumulated over 250 XP in sustainability initiatives.', unlockRuleType: 'XP_THRESHOLD', unlockRuleValue: 250, icon: '🌱', category: 'Environmental' },
      { id: 'bdg-2', name: 'Carbon Buster', description: 'Reached 750 XP through active environmental action.', unlockRuleType: 'XP_THRESHOLD', unlockRuleValue: 750, icon: '⚡', category: 'Environmental' },
      { id: 'bdg-3', name: 'Challenge Master', description: 'Successfully completed 3 or more sustainability challenges.', unlockRuleType: 'CHALLENGES_COMPLETED', unlockRuleValue: 3, icon: '🏆', category: 'Mastery' },
      { id: 'bdg-4', name: 'Community Hero', description: 'Participated in 2 or more verified CSR community initiatives.', unlockRuleType: 'CSR_COUNT', unlockRuleValue: 2, icon: '🤝', category: 'Social' },
      { id: 'bdg-5', name: 'Governance Ace', description: 'Signed and acknowledged all active corporate ESG policies.', unlockRuleType: 'POLICY_ALL_SIGNED', unlockRuleValue: 3, icon: '🛡️', category: 'Governance' }
    ],
    rewards: [
      { id: 'rew-1', name: 'Eco-Insulated Stainless Bottle', description: 'Double-walled thermo bottle with laser-engraved EcoSphere badge.', pointsRequired: 150, stock: 24, category: 'Merch', icon: '🍶', status: 'Available' },
      { id: 'rew-2', name: '$50 Sustainable Brand Gift Card', description: 'Redeemable at certified B-Corp organic and sustainable merchants.', pointsRequired: 300, stock: 12, category: 'Voucher', icon: '💳', status: 'Available' },
      { id: 'rew-3', name: 'Solar Foldable Device Charger', description: 'Compact 20W high-efficiency solar panel for mobile devices.', pointsRequired: 450, stock: 5, category: 'Eco-Perk', icon: '☀️', status: 'Available' },
      { id: 'rew-4', name: '1 Paid Sustainability Day Off', description: 'Dedicated paid volunteer day to engage in local ecological projects.', pointsRequired: 600, stock: 8, category: 'Wellness', icon: '🌿', status: 'Available' },
      { id: 'rew-5', name: '1-Ton Verified Carbon Offset Certificate', description: 'Directly fund verified reforestation projects in your name.', pointsRequired: 200, stock: 50, category: 'Eco-Perk', icon: '📜', status: 'Available' }
    ],
    userBadges: [
      { id: 'ub-1', badgeId: 'bdg-1', employeeId: 'usr-1', unlockedAt: '2026-06-10' },
      { id: 'ub-2', badgeId: 'bdg-2', employeeId: 'usr-1', unlockedAt: '2026-07-22' },
      { id: 'ub-3', badgeId: 'bdg-1', employeeId: 'usr-3', unlockedAt: '2026-05-14' },
      { id: 'ub-4', badgeId: 'bdg-2', employeeId: 'usr-3', unlockedAt: '2026-06-28' },
      { id: 'ub-5', badgeId: 'bdg-3', employeeId: 'usr-3', unlockedAt: '2026-07-30' },
      { id: 'ub-6', badgeId: 'bdg-4', employeeId: 'usr-3', unlockedAt: '2026-08-02' }
    ],
    rewardRedemptions: [
      { id: 'red-1', rewardId: 'rew-1', employeeId: 'usr-3', pointsSpent: 150, redeemedAt: '2026-07-15', status: 'Fulfilled' }
    ]
  },
  transactions: {
    carbonTransactions: [
      { id: 'ctx-101', date: '2026-08-01', departmentId: 'dept-3', sourceType: 'Expenses', emissionFactorId: 'ef-1', quantity: 24500, calculatedEmissions: 9432.5, scope: 2, notes: 'Facility main building power bill July 2026', referenceId: 'EXP-8891' },
      { id: 'ctx-102', date: '2026-08-03', departmentId: 'dept-1', sourceType: 'Fleet', emissionFactorId: 'ef-2', quantity: 1850, calculatedEmissions: 4958.0, scope: 1, notes: 'Regional distribution diesel refill batch #12', referenceId: 'FLT-4029' },
      { id: 'ctx-103', date: '2026-08-05', departmentId: 'dept-1', sourceType: 'Purchase', emissionFactorId: 'ef-5', quantity: 3200, calculatedEmissions: 26368.0, scope: 3, notes: 'Chassis material procurement for Blade X1', referenceId: 'PO-9104', productProfileId: 'prod-1' },
      { id: 'ctx-104', date: '2026-08-08', departmentId: 'dept-2', sourceType: 'Expenses', emissionFactorId: 'ef-4', quantity: 12000, calculatedEmissions: 1896.0, scope: 3, notes: 'Tech conference travel flight tickets (4 staff)', referenceId: 'EXP-9031' },
      { id: 'ctx-105', date: '2026-08-11', departmentId: 'dept-1', sourceType: 'Manufacturing', emissionFactorId: 'ef-6', quantity: 480, calculatedEmissions: 696.0, scope: 1, notes: 'Server assembly line operating run hours', referenceId: 'MFG-2281', productProfileId: 'prod-1' },
      { id: 'ctx-106', date: '2026-08-14', departmentId: 'dept-3', sourceType: 'Expenses', emissionFactorId: 'ef-3', quantity: 1250, calculatedEmissions: 2537.5, scope: 1, notes: 'Facility water heating boilers natural gas', referenceId: 'EXP-9150' }
    ],
    csrActivities: [
      { id: 'csr-1', title: 'Urban Canopy Reforestation 2026', categoryId: 'cat-1', description: 'Plant 1,000 native tree saplings across urban parks to mitigate heat island effects.', pointsAwarded: 150, date: '2026-08-22', location: 'Metro Green Belt', maxParticipants: 35, status: 'Upcoming', registeredCount: 22 },
      { id: 'csr-2', title: 'Coastal River Basin Clean-Up', categoryId: 'cat-2', description: 'Volunteer waste removal and plastic sorting along the tributary river banks.', pointsAwarded: 120, date: '2026-07-28', location: 'Riverside Park Pier 4', maxParticipants: 40, status: 'Completed', registeredCount: 38 },
      { id: 'csr-3', title: 'Youth STEM & Solar Engineering Workshop', categoryId: 'cat-2', description: 'Mentoring high school students on clean technology fundamentals and solar circuit kits.', pointsAwarded: 180, date: '2026-08-05', location: 'City Tech Center', maxParticipants: 20, status: 'Completed', registeredCount: 19 }
    ],
    csrParticipations: [
      { id: 'cp-1', activityId: 'csr-2', employeeId: 'usr-3', proofAttachmentName: 'river-cleanup-badge-photo.jpg', proofAttachmentUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=400', proofNotes: 'Collected 4 bags of plastic recyclables at Pier 4 site.', status: 'Approved', pointsEarned: 120, completionDate: '2026-07-28', reviewedBy: 'Elena Vance', reviewNotes: 'Verified photo evidence and sign-in sheet.', submittedAt: '2026-07-28' },
      { id: 'cp-2', activityId: 'csr-3', employeeId: 'usr-3', proofAttachmentName: 'mentor-session-cert.pdf', proofAttachmentUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=400', proofNotes: 'Conducted 3-hour solar kit hands-on lab with 12 students.', status: 'Approved', pointsEarned: 180, completionDate: '2026-08-05', reviewedBy: 'Elena Vance', reviewNotes: 'Outstanding mentor feedback from event organizer.', submittedAt: '2026-08-05' },
      { id: 'cp-3', activityId: 'csr-2', employeeId: 'usr-4', proofAttachmentName: 'carlos-cleanup-selfie.jpg', proofAttachmentUrl: 'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?w=400', proofNotes: 'Assisted with hazardous waste sorting tent.', status: 'Pending', pointsEarned: 120, submittedAt: '2026-08-14' },
      { id: 'cp-4', activityId: 'csr-1', employeeId: 'usr-5', proofAttachmentName: '', proofNotes: 'Registered and attending this weekend.', status: 'Pending', pointsEarned: 150, submittedAt: '2026-08-15' }
    ],
    challenges: [
      { id: 'chg-1', title: 'Zero-Emission Commuter Sprint', categoryId: 'cat-6', description: 'Log 5 days of bicycle, walking, public transit, or EV carpooling commute to work.', xp: 250, difficulty: 'Medium', evidenceRequired: true, deadline: '2026-08-31', status: 'Active' },
      { id: 'chg-2', title: 'Office Standby Power Blackout', categoryId: 'cat-4', description: 'Audit workstation equipment, turn off all unused displays and power strips before leaving.', xp: 150, difficulty: 'Easy', evidenceRequired: false, deadline: '2026-08-25', status: 'Active' },
      { id: 'chg-3', title: 'Zero Single-Use Plastic Month', categoryId: 'cat-5', description: 'Replace all single-use cutlery, cups, and containers with reusable alternatives for 30 days.', xp: 350, difficulty: 'Hard', evidenceRequired: true, deadline: '2026-09-15', status: 'Active' },
      { id: 'chg-4', title: 'Server Room Thermal Optimization', categoryId: 'cat-4', description: 'Configure dynamic fan curve profiles and raise ambient setpoint by 1.5°C safely.', xp: 400, difficulty: 'Hard', evidenceRequired: true, deadline: '2026-07-20', status: 'Completed' },
      { id: 'chg-5', title: 'Electronic Waste Buy-Back Drive', categoryId: 'cat-5', description: 'Collect and safely recycle 20+ obsolete corporate devices and peripherals.', xp: 200, difficulty: 'Medium', evidenceRequired: true, deadline: '2026-09-30', status: 'Draft' }
    ],
    challengeParticipations: [
      { id: 'chp-1', challengeId: 'chg-4', employeeId: 'usr-3', progressPct: 100, proofAttachmentName: 'datacenter-cooling-pue-report.pdf', proofNotes: 'Lowered PUE by 0.08 across row B racks.', status: 'Approved', xpAwarded: 400, joinedAt: '2026-07-02', completedAt: '2026-07-18' },
      { id: 'chp-2', challengeId: 'chg-1', employeeId: 'usr-3', progressPct: 80, proofAttachmentName: 'transit-pass-log.png', proofNotes: 'Logged 4/5 days on light rail commuter transit.', status: 'Submitted', xpAwarded: 250, joinedAt: '2026-08-01' },
      { id: 'chp-3', challengeId: 'chg-2', employeeId: 'usr-1', progressPct: 100, proofNotes: 'Completed floor 3 evening audit.', status: 'Approved', xpAwarded: 150, joinedAt: '2026-08-05', completedAt: '2026-08-08' },
      { id: 'chp-4', challengeId: 'chg-1', employeeId: 'usr-4', progressPct: 40, proofNotes: 'Carpooling with logistics team.', status: 'Joined', xpAwarded: 250, joinedAt: '2026-08-08' }
    ],
    policyAcknowledgements: [
      { id: 'pa-1', policyId: 'pol-1', employeeId: 'usr-1', acknowledgedAt: '2026-01-16 09:30', digitalSignature: 'Elena Vance [Verified Auth]' },
      { id: 'pa-2', policyId: 'pol-2', employeeId: 'usr-1', acknowledgedAt: '2026-01-16 09:32', digitalSignature: 'Elena Vance [Verified Auth]' },
      { id: 'pa-3', policyId: 'pol-3', employeeId: 'usr-1', acknowledgedAt: '2026-02-02 11:15', digitalSignature: 'Elena Vance [Verified Auth]' },
      { id: 'pa-4', policyId: 'pol-1', employeeId: 'usr-3', acknowledgedAt: '2026-01-20 14:00', digitalSignature: 'Samantha Hayes [Verified Auth]' },
      { id: 'pa-5', policyId: 'pol-2', employeeId: 'usr-3', acknowledgedAt: '2026-01-20 14:05', digitalSignature: 'Samantha Hayes [Verified Auth]' },
      { id: 'pa-6', policyId: 'pol-3', employeeId: 'usr-3', acknowledgedAt: '2026-02-05 10:20', digitalSignature: 'Samantha Hayes [Verified Auth]' }
    ],
    audits: [
      { id: 'aud-1', title: 'Q2 ISO 14001 Environmental Management Audit', auditType: 'Internal', leadAuditor: 'Marcus Sterling', departmentId: 'dept-1', scheduledDate: '2026-06-15', completedDate: '2026-06-20', findingsCount: 3, status: 'Completed' },
      { id: 'aud-2', title: 'Annual Supplier ESG Code of Conduct Review', auditType: 'External', leadAuditor: 'PwC Global Assurance', departmentId: 'dept-1', scheduledDate: '2026-08-10', completedDate: '2026-08-14', findingsCount: 2, status: 'Completed' },
      { id: 'aud-3', title: 'Workplace Safety & Ergonomics Health Audit', auditType: 'Regulatory', leadAuditor: 'OSHA Certified Inspector', departmentId: 'dept-3', scheduledDate: '2026-09-05', findingsCount: 0, status: 'Scheduled' }
    ],
    complianceIssues: [
      {
        id: 'iss-1',
        auditId: 'aud-1',
        title: 'Diesel Fuel Secondary Containment Basin Missing Inspection Log',
        severity: 'High',
        description: 'Facility fuel storage facility backup tank lacks updated bi-weekly runoff valve logs.',
        ownerEmployeeId: 'usr-4',
        dueDate: '2026-08-01', // Overdue to demonstrate alert & notification logic
        status: 'Overdue',
        createdAt: '2026-06-22'
      },
      {
        id: 'iss-2',
        auditId: 'aud-2',
        title: 'Tier-2 Capacitor Supplier Missing Modern Slavery Declaration',
        severity: 'Critical',
        description: 'Supplier ABC Microelectronics has not submitted the 2026 annual ethics certification.',
        ownerEmployeeId: 'usr-1',
        dueDate: '2026-08-28',
        status: 'Open',
        createdAt: '2026-08-14'
      },
      {
        id: 'iss-3',
        auditId: 'aud-1',
        title: 'Hazardous E-Waste Bin Labeling Faded in Assembly Room B',
        severity: 'Medium',
        description: 'Labels on lithium scrap containers need replacement with high-durability vinyl.',
        ownerEmployeeId: 'usr-3',
        dueDate: '2026-07-15',
        status: 'Resolved',
        resolutionNotes: 'Replaced with UV-resistant vinyl placards and signed off by supervisor.',
        createdAt: '2026-06-21'
      }
    ]
  },
  trainingRecords: [
    { id: 'trn-1', title: 'Corporate ESG Fundamentals & Net-Zero Roadmap', departmentId: 'dept-1', mandatory: true, completionPct: 92, totalEmployees: 142, completedEmployees: 131 },
    { id: 'trn-2', title: 'Workplace Safety, Anti-Harassment & Ethics 2026', departmentId: 'dept-2', mandatory: true, completionPct: 98, totalEmployees: 215, completedEmployees: 211 },
    { id: 'trn-3', title: 'Carbon Accounting & Scope 3 Data Collection', departmentId: 'dept-1', mandatory: false, completionPct: 76, totalEmployees: 142, completedEmployees: 108 },
    { id: 'trn-4', title: 'Energy Efficiency & Facility Optimization Protocols', departmentId: 'dept-3', mandatory: true, completionPct: 88, totalEmployees: 68, completedEmployees: 60 }
  ],
  notifications: [
    {
      id: 'notif-1',
      title: '🚨 Overdue Compliance Issue Alert',
      message: 'Issue #iss-1 "Diesel Fuel Secondary Containment Basin" is past due (Due: 2026-08-01). Immediate action required.',
      type: 'ISSUE_OVERDUE',
      createdAt: '2026-08-02 08:00',
      read: false
    },
    {
      id: 'notif-2',
      title: '🎉 Badge Unlocked: Community Hero',
      message: 'Samantha Hayes unlocked the "Community Hero" badge for participating in 2 verified CSR initiatives.',
      type: 'BADGE_UNLOCKED',
      createdAt: '2026-08-05 16:30',
      read: false
    },
    {
      id: 'notif-3',
      title: '✅ CSR Proof Approved',
      message: 'Your evidence for "Coastal River Basin Clean-Up" was approved! +120 Points credited.',
      type: 'CSR_APPROVED',
      createdAt: '2026-07-28 17:15',
      read: true
    }
  ]
};
