
import { GoogleGenAI } from "@google/genai";
import { ProspectData, StrategicReport } from "../types";

// ... setup code ...
const getAiClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });
const cleanJsonString = (str: string) => str.replace(/```json\n?|\n?```/g, "").trim();

export const generateConsultingReport = async (data: ProspectData): Promise<StrategicReport> => {
  const model = "gemini-3-pro-preview";
  const ai = getAiClient();
  
  const prompt = `
    You are a Senior Strategy Consultant at ScaleOn.
    A prospect has just completed the "Strategic Discovery" assessment.
    
    **PROSPECT PROFILE**:
    - Company: ${data.companyName} (${data.industry})
    - Revenue: ${data.revenueRange} (${data.revenueTrend})
    - Team: ${data.employeeCount} employees
    - Main Challenge: "${data.mainSalesChallenge}"
    - Ambition: "${data.ambition12Month}"
    - Urgency: ${data.triggerEvent} (Timeline: ${data.desiredTimeline})
    - Sales Maturity: Lead Gen ${data.leadGenScore}/5, CRM ${data.crmScore}/5
    
    **YOUR TASK**:
    Generate 2 distinct outputs in JSON format:
    
    1. **CLIENT REPORT (Public)**: Professional, encouraging, "McKinsey-style". Focus on growth.
       - Executive Summary: 3-4 sentences acknowledging their specific situation.
       - Health Score: 0-100 (Estimate based on their maturity scores).
       - 3 Core Strengths: What they are doing right.
       - 3 Critical Gaps: What is holding them back.
       - 90-Day Roadmap: Phase 1 (Fix), Phase 2 (Build), Phase 3 (Scale).
       
    2. **INTERNAL DOSSIER (Private)**: Blunt, "Private Investigator" style for the Sales Team.
       - Lead Quality Score: 0-100.
       - Estimated Deal Value: Guess based on revenue tier.
       - "Kill Sheet": Opening hook for cold call, specific red flags.
       - Competitor Intel: Guess 3 likely competitors.
       - Blue Ocean Strategy: One radical idea for them.

    **RETURN JSON ONLY**:
    {
      "clientView": { ... },
      "internalDossier": { ... }
    }
  `;
  
  // ... generate content call ...
  const response = await ai.models.generateContent({
      model, contents: { parts: [{ text: prompt }] },
      config: { responseMimeType: "application/json" }
  });
  
  return JSON.parse(cleanJsonString(response.text || "{}"));
};
