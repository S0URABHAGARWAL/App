
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { DiscoveryWizard } from './components/DiscoveryWizard';
import { ResearchLoader } from './components/ResearchLoader';
import { ReportView } from './components/ReportView';
import { ProspectData, StrategicReport } from './types';
import { generateConsultingReport } from './services/geminiService';

enum AppState {
  LANDING,
  DISCOVERY,
  RESEARCHING,
  REPORT,
  SUBMITTED
}

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.LANDING);
  const [prospectData, setProspectData] = useState<ProspectData | null>(null);
  const [report, setReport] = useState<StrategicReport | null>(null);

  const startDiscovery = () => setAppState(AppState.DISCOVERY);

  const handleDiscoveryComplete = async (data: ProspectData) => {
    setProspectData(data);
    setAppState(AppState.RESEARCHING);
    
    try {
      const generatedReport = await generateConsultingReport(data);
      setReport(generatedReport);
      setAppState(AppState.REPORT);
    } catch (error) {
      console.error("Analysis failed:", error);
      // In a real app, handle error state better
      alert("Analysis failed. Please try again.");
      setAppState(AppState.DISCOVERY);
    }
  };

  const submitToTeam = () => {
    // In a real app, this would POST to a backend/CRM
    setAppState(AppState.SUBMITTED);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans text-foreground bg-background">
      <Header />
      
      <main className="flex-grow flex flex-col">
        {appState === AppState.LANDING && (
          <Hero onStart={startDiscovery} />
        )}

        {appState === AppState.DISCOVERY && (
          <div className="flex-grow bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
              <DiscoveryWizard onComplete={handleDiscoveryComplete} />
            </div>
          </div>
        )}

        {appState === AppState.RESEARCHING && (
          <ResearchLoader prospectName={prospectData?.companyName || "Your Company"} />
        )}

        {appState === AppState.REPORT && report && (
          <ReportView 
            report={report} 
            prospectData={prospectData!} 
            onSubmit={submitToTeam} 
          />
        )}

        {appState === AppState.SUBMITTED && (
          <div className="flex-grow flex items-center justify-center bg-background">
            <div className="text-center p-8 max-w-lg">
              <div className="w-16 h-16 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-3xl font-serif font-bold text-foreground mb-4">Discovery Submitted</h2>
              <p className="text-muted-foreground mb-8 text-lg font-sans">
                Thank you. Our senior partners at ScaleOn Consulting have received your strategic profile and the AI-generated preliminary research. We will review the data and reach out within 24 hours to schedule your Deep Dive Strategy Session.
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="text-accent font-semibold hover:text-accent/80 underline font-sans"
              >
                Return to Home
              </button>
            </div>
          </div>
        )}
      </main>

      <footer className="bg-popover text-popover-foreground py-6 text-center text-sm font-sans">
        <p>© {new Date().getFullYear()} ScaleOn Consulting. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;
