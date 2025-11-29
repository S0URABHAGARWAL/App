
import React, { useState, useEffect } from 'react';
import { Button } from './Button';
import { ProspectData, WizardStep } from '../types';
import { IntegrationService } from '../services/integrationService';

interface DiscoveryWizardProps {
  onComplete: (data: ProspectData) => void;
}

// --- CONSTANTS & OPTIONS ---
const LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸', greeting: "Straight answers only. This is designed to give you a blunt, useful view of your growth engine." },
  { code: 'hi', name: 'हिन्दी (Hindi)', flag: '🇮🇳', greeting: "सीधे उत्तर दें। यह आपके विकास इंजन का एक स्पष्ट और उपयोगी दृश्य देने के लिए डिज़ाइन किया गया है।" },
];

const REVENUE_TRENDS = ['Flat', 'Slow Growth (0-20%)', 'Fast Growth (20%+)', 'Decline', 'Volatile'];
const RISK_POSTURES = ['Conservative', 'Balanced', 'Aggressive'];
const DECISION_STYLES = ['Gut-driven', 'ROI-model', 'Board-driven', 'Test-first'];
const TIMELINES = ['ASAP', '0-3 months', '3-6 months', '6-12 months'];
const INVESTMENT_STATES = ['Exploring', 'Ready if strong case', 'Budget Allocated'];
const WORKING_STYLES = ['Workshops', 'Fast Experiments', 'You Handle It'];

const AssistantMessage: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex gap-4 mb-8 items-start animate-fadeIn">
    <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-serif font-bold text-xl shadow-md border-2 border-accent">
      S
    </div>
    <div className="bg-card p-6 rounded-2xl rounded-tl-none shadow-DEFAULT border border-border max-w-2xl relative">
       <div className="text-foreground text-lg leading-relaxed font-sans">{children}</div>
    </div>
  </div>
);

const SliderInput = ({ label, value, onChange }: { label: string, value: number, onChange: (val: number) => void }) => (
  <div className="mb-6">
    <div className="flex justify-between mb-2">
      <label className="text-sm font-bold text-foreground">{label}</label>
      <span className="text-sm font-mono text-primary font-bold">{value}/5</span>
    </div>
    <input 
      type="range" 
      min="1" 
      max="5" 
      value={value} 
      onChange={(e) => onChange(parseInt(e.target.value))}
      className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
    />
    <div className="flex justify-between text-xs text-muted-foreground mt-1">
      <span>Chaos</span>
      <span>Machine</span>
    </div>
  </div>
);

export const DiscoveryWizard: React.FC<DiscoveryWizardProps> = ({ onComplete }) => {
  const [step, setStep] = useState<WizardStep>(WizardStep.LANGUAGE);
  
  const [formData, setFormData] = useState<ProspectData>({
    language: 'en',
    founderName: '', title: '', email: '', phone: '',
    companyName: '', website: '', location: '', industry: '', customIndustry: '',
    inceptionYear: '', employeeCount: '', companyDescription: '', customerSegments: [],
    revenueRange: '', revenueTrend: 'Flat', revenuePredictability: 3, ambition12Month: '',
    leadGenScore: 3, inboundQualityScore: 3, outboundScore: 3, salesProcessScore: 3, crmScore: 3,
    mainSalesChallenge: '', pastEfforts: '', bestChannels: [],
    isDecisionMaker: 'yes', otherStakeholders: '', decisionStyle: 'ROI-model', riskPosture: 'Balanced', decisionMakerDetails: { name: '', title: '', email: '', phone: '' },
    triggerEvent: '', desiredTimeline: '0-3 months', investmentReadiness: 'Ready if strong case',
    helpType: [], preferredStyle: 'Fast Experiments',
    socialLinks: { linkedin: '', instagram: '', facebook: '' }
  });

  // Validation Logic
  const isStepValid = (): boolean => {
    switch(step) {
      case WizardStep.BASICS: return !!formData.founderName && !!formData.email && !!formData.companyName;
      case WizardStep.SNAPSHOT: return !!formData.companyDescription && formData.customerSegments.length > 0;
      case WizardStep.GROWTH: return !!formData.revenueRange && !!formData.ambition12Month;
      case WizardStep.SALES_ENGINE: return !!formData.mainSalesChallenge;
      case WizardStep.DECISION_DYNAMICS: 
        if (formData.isDecisionMaker === 'no') return !!formData.decisionMakerDetails?.name;
        return true;
      case WizardStep.URGENCY: return !!formData.triggerEvent;
      case WizardStep.ENGAGEMENT: return formData.helpType.length > 0;
      case WizardStep.DIGITAL: return !!formData.website; 
      default: return true;
    }
  };

  const nextStep = () => {
    if (isStepValid()) {
        if (step === WizardStep.DIGITAL) {
             onComplete(formData); // Trigger AI processing
        } else {
            setStep(step + 1);
        }
    }
  };

  const handleSelection = (name: keyof ProspectData, value: any) => {
     setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSocialLink = (network: keyof ProspectData['socialLinks'], value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [network]: value
      }
    }));
  };

  const handleMultiSelect = (field: keyof ProspectData, value: string) => {
      const current = (formData[field] as string[]) || [];
      const updated = current.includes(value) ? current.filter(i => i !== value) : [...current, value];
      setFormData(prev => ({ ...prev, [field]: updated }));
  };

  const renderInput = (name: keyof ProspectData, placeholder: string) => (
    <input
        type="text"
        name={name}
        value={formData[name] as string}
        onChange={(e) => handleSelection(name, e.target.value)}
        className="w-full border-b-2 border-border p-3 text-lg focus:border-primary focus:outline-none bg-input text-foreground font-sans mb-4"
        placeholder={placeholder}
    />
  );

  const renderSocialInput = (network: keyof ProspectData['socialLinks'], placeholder: string) => (
    <input
        type="text"
        name={network}
        value={formData.socialLinks[network]}
        onChange={(e) => handleSocialLink(network, e.target.value)}
        className="w-full border-b-2 border-border p-3 text-lg focus:border-primary focus:outline-none bg-input text-foreground font-sans mb-4"
        placeholder={placeholder}
    />
  );

  const renderTextarea = (name: keyof ProspectData, placeholder: string) => (
    <textarea
        name={name}
        value={formData[name] as string}
        onChange={(e) => handleSelection(name, e.target.value)}
        rows={3}
        className="w-full border-2 border-border rounded-xl p-4 text-lg focus:border-primary focus:outline-none resize-none bg-input text-foreground font-sans mb-4"
        placeholder={placeholder}
    />
  );

  // --- RENDER STEPS ---
  
  if (step === WizardStep.LANGUAGE) {
     return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center">
            <h2 className="text-3xl font-serif font-bold mb-8">ScaleOn Strategic Discovery</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-xl">
              {LANGUAGES.map(lang => (
                <button key={lang.code} onClick={() => { setFormData({...formData, language: lang.code}); setStep(WizardStep.BASICS); }}
                  className="p-6 bg-card hover:bg-muted border border-border rounded-xl transition-all flex items-center gap-4">
                  <span className="text-3xl">{lang.flag}</span>
                  <div className="text-left">
                    <span className="block font-bold">{lang.name}</span>
                    <span className="text-xs text-muted-foreground">{lang.greeting}</span>
                  </div>
                </button>
              ))}
            </div>
        </div>
     );
  }

  const renderContent = () => {
    switch(step) {
        case WizardStep.BASICS:
            return (
                <>
                    <AssistantMessage>Straight answers only. This is designed to give you a blunt, useful view of your growth engine, not a feel-good quiz.</AssistantMessage>
                    <div className="space-y-4 max-w-xl ml-16">
                        <div className="grid grid-cols-2 gap-4">
                            {renderInput("founderName", "Your Name")}
                            {renderInput("title", "Your Role")}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {renderInput("email", "Work Email")}
                            {renderInput("phone", "Phone")}
                        </div>
                        {renderInput("companyName", "Company Name")}
                        {renderInput("location", "Location (City, Country)")}
                    </div>
                </>
            );
        case WizardStep.SNAPSHOT:
            return (
                <>
                    <AssistantMessage>If it feels messy to describe, that's a signal. Just write it the way you would explain to a peer over coffee.</AssistantMessage>
                    <div className="space-y-4 max-w-xl ml-16">
                        {renderTextarea("companyDescription", "What does your company actually do? (1-2 sentences)")}
                        <div className="grid grid-cols-2 gap-4">
                             {renderInput("inceptionYear", "Founded Year")}
                             <select className="w-full border-b-2 border-border p-3 bg-input" value={formData.employeeCount} onChange={(e) => handleSelection('employeeCount', e.target.value)}>
                                <option value="">Team Size...</option>
                                {['1-10', '11-50', '51-200', '200-500', '500+'].map(s => <option key={s} value={s}>{s}</option>)}
                             </select>
                        </div>
                        <div className="bg-muted/30 p-4 rounded-lg">
                            <label className="block text-xs font-bold uppercase mb-2">Main Customer Segments</label>
                            <div className="flex flex-wrap gap-2">
                                {['B2B SMB', 'B2B Mid-Market', 'B2B Enterprise', 'B2C', 'D2C', 'Agency'].map(seg => (
                                    <button key={seg} onClick={() => handleMultiSelect('customerSegments', seg)}
                                    className={`px-3 py-1 rounded-full text-xs font-bold border ${formData.customerSegments.includes(seg) ? 'bg-primary text-white border-primary' : 'bg-white border-border'}`}>
                                        {seg}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            );
        case WizardStep.GROWTH:
            return (
                <>
                    <AssistantMessage>Ballpark ranges are enough. Precision belongs in your books, not in this form.</AssistantMessage>
                    <div className="space-y-6 max-w-xl ml-16">
                        {renderInput("revenueRange", "Annual Revenue (e.g. ₹5 Cr - ₹10 Cr)")}
                        
                        <div>
                            <label className="block text-xs font-bold uppercase mb-2">Revenue Trend (Last 12 Months)</label>
                            <div className="flex flex-wrap gap-2">
                                {REVENUE_TRENDS.map(t => (
                                    <button key={t} onClick={() => handleSelection('revenueTrend', t)}
                                    className={`px-3 py-2 rounded-lg text-sm font-bold border ${formData.revenueTrend === t ? 'bg-accent text-white border-accent' : 'bg-white border-border'}`}>
                                        {t}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <SliderInput label="Revenue Predictability" value={formData.revenuePredictability} onChange={(v) => handleSelection('revenuePredictability', v)} />
                        
                        {renderTextarea("ambition12Month", "What's your vision for the next 12-24 months? (e.g. 10x revenue)")}
                    </div>
                </>
            );
        case WizardStep.SALES_ENGINE:
            return (
                <>
                    <AssistantMessage>If you feel you're winging it, mark it low. False 5s don't help anyone.</AssistantMessage>
                    <div className="space-y-4 max-w-xl ml-16">
                         <SliderInput label="Lead Gen Consistency" value={formData.leadGenScore} onChange={(v) => handleSelection('leadGenScore', v)} />
                         <SliderInput label="Outbound Discipline" value={formData.outboundScore} onChange={(v) => handleSelection('outboundScore', v)} />
                         <SliderInput label="CRM & Pipeline Visibility" value={formData.crmScore} onChange={(v) => handleSelection('crmScore', v)} />
                         
                         {renderTextarea("mainSalesChallenge", "What's your biggest friction in sales right now?")}
                         
                         <div className="bg-muted/30 p-4 rounded-lg">
                            <label className="block text-xs font-bold uppercase mb-2">Best Channels</label>
                            <div className="flex flex-wrap gap-2">
                                {['LinkedIn', 'Cold Email', 'Ads', 'Referrals', 'Partners', 'Events'].map(c => (
                                    <button key={c} onClick={() => handleMultiSelect('bestChannels', c)}
                                    className={`px-3 py-1 rounded-full text-xs font-bold border ${formData.bestChannels.includes(c) ? 'bg-secondary text-secondary-foreground border-secondary' : 'bg-white border-border'}`}>
                                        {c}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            );
        case WizardStep.DECISION_DYNAMICS:
            return (
                <>
                     <AssistantMessage>This only helps us avoid wasting everyone's time with the wrong kind of plan.</AssistantMessage>
                     <div className="space-y-6 max-w-xl ml-16">
                        <div>
                            <label className="block text-xs font-bold uppercase mb-2">Are you the Primary Decision Maker?</label>
                            <div className="flex gap-4">
                                <button onClick={() => handleSelection('isDecisionMaker', 'yes')} className={`flex-1 p-3 rounded-lg border ${formData.isDecisionMaker === 'yes' ? 'bg-primary text-white' : 'bg-white'}`}>Yes</button>
                                <button onClick={() => handleSelection('isDecisionMaker', 'no')} className={`flex-1 p-3 rounded-lg border ${formData.isDecisionMaker === 'no' ? 'bg-primary text-white' : 'bg-white'}`}>No</button>
                                <button onClick={() => handleSelection('isDecisionMaker', 'shared')} className={`flex-1 p-3 rounded-lg border ${formData.isDecisionMaker === 'shared' ? 'bg-primary text-white' : 'bg-white'}`}>Shared</button>
                            </div>
                        </div>

                        {formData.isDecisionMaker !== 'yes' && (
                             <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                                 <p className="text-xs font-bold text-orange-800 mb-2">Who else is involved?</p>
                                 {renderInput("otherStakeholders", "Name / Role of other stakeholder")}
                             </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold uppercase mb-2">Risk Posture</label>
                            <div className="flex gap-2">
                                {RISK_POSTURES.map(r => (
                                    <button key={r} onClick={() => handleSelection('riskPosture', r)}
                                    className={`flex-1 py-2 rounded-lg text-xs font-bold border ${formData.riskPosture === r ? 'bg-accent text-white border-accent' : 'bg-white border-border'}`}>
                                        {r}
                                    </button>
                                ))}
                            </div>
                        </div>
                     </div>
                </>
            );
        case WizardStep.URGENCY:
            return (
                <>
                    <AssistantMessage>This shapes how sharply we design your plan – sprint vs. marathon.</AssistantMessage>
                    <div className="space-y-6 max-w-xl ml-16">
                        {renderTextarea("triggerEvent", "What changed in the last 3-6 months that made this a priority?")}
                        
                        <div>
                             <label className="block text-xs font-bold uppercase mb-2">Desired Impact Timeline</label>
                             <div className="grid grid-cols-2 gap-2">
                                {TIMELINES.map(t => (
                                    <button key={t} onClick={() => handleSelection('desiredTimeline', t)}
                                    className={`py-2 rounded-lg text-sm border ${formData.desiredTimeline === t ? 'bg-primary text-white' : 'bg-white'}`}>{t}</button>
                                ))}
                             </div>
                        </div>

                        <div>
                             <label className="block text-xs font-bold uppercase mb-2">Investment Readiness</label>
                             <div className="flex flex-col gap-2">
                                {INVESTMENT_STATES.map(s => (
                                    <button key={s} onClick={() => handleSelection('investmentReadiness', s)}
                                    className={`py-3 px-4 text-left rounded-lg text-sm border ${formData.investmentReadiness === s ? 'bg-green-50 border-green-500 text-green-700 font-bold' : 'bg-white'}`}>{s}</button>
                                ))}
                             </div>
                        </div>
                    </div>
                </>
            );
        case WizardStep.ENGAGEMENT:
             return (
                <>
                    <AssistantMessage>This helps us match you with the right approach, not force-fit a package.</AssistantMessage>
                    <div className="space-y-6 max-w-xl ml-16">
                        <div>
                            <label className="block text-xs font-bold uppercase mb-2">What kind of help?</label>
                            <div className="grid grid-cols-1 gap-2">
                                {['Strategic Clarity (Roadmap)', 'Done-with-you (Playbooks)', 'Done-for-you (Pipeline)', 'Fractional Leadership'].map(h => (
                                    <button key={h} onClick={() => handleMultiSelect('helpType', h)}
                                    className={`p-3 text-left rounded-lg border text-sm font-medium ${formData.helpType.includes(h) ? 'bg-primary text-white' : 'bg-white'}`}>
                                        {h}
                                    </button>
                                ))}
                            </div>
                        </div>
                         <div>
                            <label className="block text-xs font-bold uppercase mb-2">Preferred Style</label>
                            <div className="flex gap-2">
                                {WORKING_STYLES.map(s => (
                                    <button key={s} onClick={() => handleSelection('preferredStyle', s)}
                                    className={`flex-1 py-2 rounded-lg text-[10px] font-bold border ${formData.preferredStyle === s ? 'bg-accent text-white' : 'bg-white'}`}>{s}</button>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
             );
        case WizardStep.DIGITAL:
            return (
                <>
                     <AssistantMessage>Final Step. We need to see where you live online to run the <strong>Forensic Audit.</strong></AssistantMessage>
                     <div className="space-y-4 max-w-xl ml-16">
                        {renderInput("website", "Company Website")}
                        {renderSocialInput("linkedin", "LinkedIn Company URL")}
                        <p className="text-xs text-muted-foreground">This helps us verify your team size and market positioning.</p>
                     </div>
                </>
            );
        default: return null;
    }
  };

  const progress = ((step + 1) / 9) * 100;

  return (
    <div className="bg-card rounded-2xl shadow-lg overflow-hidden border border-border min-h-[600px] flex flex-col">
      <div className="w-full bg-muted h-2">
         <div className="h-full bg-primary transition-all duration-500" style={{width: `${progress}%`}}></div>
      </div>
      
      <div className="flex-grow p-8 md:p-12 overflow-y-auto">
        {renderContent()}
      </div>

      <div className="p-6 border-t border-border flex justify-between bg-muted/10">
         <button onClick={() => setStep(Math.max(0, step - 1))} className="text-muted-foreground hover:text-foreground font-medium px-4">Back</button>
         <Button onClick={nextStep} disabled={!isStepValid()} className="shadow-xl">
            {step === WizardStep.DIGITAL ? "Complete Discovery & Generate Report" : "Next Step →"}
         </Button>
      </div>
    </div>
  );
};
