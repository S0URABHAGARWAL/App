
export interface ProspectData {
  // --- METADATA ---
  id?: string;
  timestamp?: string;
  language: string;
  
  // --- 1. FOUNDER/CONTACT ---
  founderName: string;
  title: string;
  email: string;
  phone: string;
  
  // --- 2. COMPANY SNAPSHOT ---
  companyName: string;
  website: string;
  location: string; // Combined City, Country
  industry: string;
  customIndustry?: string;
  inceptionYear: string;
  employeeCount: string; // 1-10, 11-50, etc.
  companyDescription: string; // NEW: "What does your company actually do?"
  customerSegments: string[]; // NEW: B2B SMB, Enterprise, etc.
  
  // --- 3. REVENUE & GROWTH ---
  revenueRange: string;
  revenueTrend: 'Flat' | 'Slow Growth (0-20%)' | 'Fast Growth (20%+)' | 'Decline' | 'Volatile'; // NEW
  revenuePredictability: number; // NEW: 1-5 Slider
  ambition12Month: string; // NEW: "What's your vision?"

  // --- 4. SALES & MARKETING ENGINE ---
  // Sliders 1-5
  leadGenScore: number; 
  inboundQualityScore: number;
  outboundScore: number;
  salesProcessScore: number;
  crmScore: number;
  
  mainSalesChallenge: string; // Free text
  pastEfforts: string; // "What have you tried?"
  bestChannels: string[]; // LinkedIn, Ads, etc.

  // --- 5. DECISION DYNAMICS ---
  isDecisionMaker: string; // "yes" | "no" | "shared"
  decisionMakerDetails?: {
    name: string;
    title: string;
    email: string;
    phone: string;
  };
  otherStakeholders: string; // NEW: "Who else is involved?"
  decisionStyle: 'Gut-driven' | 'ROI-model' | 'Board-driven' | 'Test-first'; // NEW
  riskPosture: 'Conservative' | 'Balanced' | 'Aggressive'; // NEW

  // --- 6. URGENCY ---
  triggerEvent: string; // NEW: "What changed recently?"
  desiredTimeline: 'ASAP' | '0-3 months' | '3-6 months' | '6-12 months';
  investmentReadiness: 'Exploring' | 'Ready if strong case' | 'Budget Allocated';

  // --- 7. ENGAGEMENT PREFERENCES ---
  helpType: string[]; // NEW: "Strategic clarity", "Done-for-you", etc.
  preferredStyle: 'Workshops' | 'Fast Experiments' | 'You Handle It'; // NEW

  // --- 8. DIGITAL ---
  socialLinks: {
    linkedin: string;
    instagram: string;
    facebook: string;
  };
}

export interface InternalIntel {
  leadScore: number; // 1-100
  leadTier: 'HOT' | 'WARM' | 'COOL' | 'COLD';
  dealSizeEstimate: string;
  riskFactors: string[];
  opportunityAnalysis: {
    quickWins: string;
    strategic: string;
  };
  salesTalkingPoints: string[];
}

export interface StrategicReport {
  clientView: {
    executiveSummary: string;
    healthScore: number;
    keyStrengths: string[];
    criticalGaps: string[]; // "Red Cards"
    roadmap: {
      phase1: string;
      phase2: string;
      phase3: string;
    }[];
    marketOpportunity: string;
    aiTools: { name: string; reason: string }[];
  };
  internalDossier: InternalIntel;
}

export enum WizardStep {
  LANGUAGE,
  BASICS, // Contact + Location
  SNAPSHOT, // Company size, desc
  GROWTH, // Revenue trends
  SALES_ENGINE, // Sliders
  DECISION_DYNAMICS, // Risk, DM
  URGENCY, // Triggers
  ENGAGEMENT, // Preferences
  DIGITAL, // Socials
  PROCESSING, // Loading
  REPORT, // View Client Report
  SUCCESS // Final "Email Sent" screen
}
