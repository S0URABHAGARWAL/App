
import { ProspectData, StrategicReport, InternalIntel } from "../types";

export const IntegrationService = {
  // --- 1. LEAD SCORING ALGORITHM ---
  calculateLeadScore: (data: ProspectData): number => {
      let score = 50; // Base Score

      // Revenue Tier
      if (data.revenueRange.includes("10 Cr") || data.revenueRange.includes("50 Cr")) score += 20;
      else if (data.revenueRange.includes("5 Cr")) score += 15;
      else if (data.revenueRange.includes("1 Cr")) score += 10;
      
      // Decision Maker
      if (data.isDecisionMaker === 'yes') score += 15;
      else if (data.isDecisionMaker === 'shared') score += 5;

      // Timeline
      if (data.desiredTimeline === 'ASAP') score += 20;
      else if (data.desiredTimeline === '0-3 months') score += 10;

      // Budget
      if (data.investmentReadiness.includes('Budget')) score += 20;
      else if (data.investmentReadiness.includes('Ready')) score += 10;

      // Trigger Event
      if (data.triggerEvent && data.triggerEvent.length > 20) score += 15; // Meaningful input

      // Sales Maturity (Low maturity = High need)
      const avgMaturity = (data.leadGenScore + data.salesProcessScore) / 2;
      if (avgMaturity < 3) score += 10; // They need help urgently

      return Math.min(score, 100);
  },

  // --- 2. BACKEND SUBMISSION SIMULATION ---
  submitLeadAndFinalize: async (data: ProspectData, report: StrategicReport) => {
      const leadScore = IntegrationService.calculateLeadScore(data);
      
      // This payload matches the 'scaleon_leads' SQL schema
      const backendPayload = {
          id: crypto.randomUUID(),
          created_at: new Date().toISOString(),
          
          // Contact
          founder_name: data.founderName,
          founder_role: data.title,
          founder_email: data.email,
          founder_phone: data.phone,
          
          // Company
          company_name: data.companyName,
          company_website: data.website,
          location: data.location,
          industry: data.industry,
          
          // Scale
          founded_year: data.inceptionYear,
          employee_count: data.employeeCount,
          revenue_range: data.revenueRange,
          
          // Metrics
          revenue_trend: data.revenueTrend,
          revenue_predictability: data.revenuePredictability,
          ambition_12m: data.ambition12Month,
          
          // Sales Engine
          lead_gen_score: data.leadGenScore,
          sales_challenge: data.mainSalesChallenge,
          
          // Scoring & Intel
          lead_score: leadScore,
          lead_tier: leadScore > 80 ? 'HOT' : leadScore > 60 ? 'WARM' : 'COOL',
          internal_intel: report.internalDossier, // Hidden from client
          
          // Tracking
          email_sent: true
      };

      console.log("🚀 SIMULATING BACKEND SUBMISSION...");
      console.log("➡️ Sending to Supabase DB:", backendPayload);
      console.log("➡️ Triggering Resend API (Internal Email to sales@scaleonconsulting.com)");
      console.log("➡️ Triggering Resend API (Client Email to " + data.email + ")");
      
      return true;
  },

  // --- 3. LOCAL BACKUP ---
  saveProspect: (data: ProspectData, report?: StrategicReport) => {
      const dbStr = localStorage.getItem('scaleon_db');
      const db = dbStr ? JSON.parse(dbStr) : [];
      db.push({ ...data, report: report ? 'Generated' : 'Pending', date: new Date().toISOString() });
      localStorage.setItem('scaleon_db', JSON.stringify(db));
  },
  
  exportDatabaseToCSV: () => {
      // ... existing csv logic ...
  }
};
