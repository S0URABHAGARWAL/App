
import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Button } from './Button';
import { StrategicReport, ProspectData } from '../types';
import { IntegrationService } from '../services/integrationService';

interface ReportViewProps {
  report: StrategicReport;
  prospectData: ProspectData;
  onSubmit: () => void;
}

const MarkdownRenderer = ({ content }: { content: string }) => {
  if (!content) return null;
  return (
    <div className="markdown-prose">
      <ReactMarkdown
        components={{
          h1: ({node, ...props}) => <h1 className="text-2xl font-serif font-bold text-primary mt-6 mb-4" {...props} />,
          h2: ({node, ...props}) => <h2 className="text-xl font-serif font-bold text-foreground mt-5 mb-3" {...props} />,
          h3: ({node, ...props}) => <h3 className="text-lg font-bold text-accent mt-4 mb-2 uppercase tracking-wide" {...props} />,
          ul: ({node, ...props}) => <ul className="list-none space-y-2 mb-4" {...props} />,
          li: ({node, ...props}) => (
            <li className="relative pl-6 text-foreground/90 leading-relaxed">
              <span className="absolute left-0 top-2 w-1.5 h-1.5 bg-secondary rounded-full"></span>
              <span {...props} />
            </li>
          ),
          p: ({node, ...props}) => <p className="mb-4 text-foreground/80 leading-relaxed" {...props} />,
          strong: ({node, ...props}) => <span className="font-bold text-foreground" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export const ReportView: React.FC<ReportViewProps> = ({ report, prospectData, onSubmit }) => {
  const [isSuccess, setIsSuccess] = useState(false);
  const client = report.clientView;

  const handleBookCall = () => {
      // 1. Trigger Backend Simulation (Logs payload, calculates score, "sends" email)
      IntegrationService.submitLeadAndFinalize(prospectData, report);
      // 2. Show Success Screen
      setIsSuccess(true);
  };

  if (isSuccess) {
      return (
          <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-12 text-center mt-10 border border-gray-100">
              <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
              </div>
              <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Thank You, {prospectData.founderName}!</h2>
              <p className="text-lg text-gray-500 mb-8">Your Strategic Discovery Report has been generated.</p>
              
              <div className="bg-gray-50 rounded-xl p-6 text-left mb-8 border border-gray-200">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">What Happens Next</h3>
                  <div className="space-y-4">
                      <div className="flex items-center gap-3">
                          <span className="text-xl">📧</span>
                          <div>
                              <span className="block font-bold text-gray-900">Email Sent</span>
                              <span className="text-sm text-gray-500">Check {prospectData.email} for your PDF copy.</span>
                          </div>
                      </div>
                      <div className="flex items-center gap-3">
                          <span className="text-xl">📞</span>
                          <div>
                              <span className="block font-bold text-gray-900">Consultant Review</span>
                              <span className="text-sm text-gray-500">A senior partner will review your data and call within 48 hours.</span>
                          </div>
                      </div>
                  </div>
              </div>

              <div className="flex justify-center gap-4">
                  <Button onClick={() => window.print()} variant="outline">Download Report Now</Button>
                  <Button onClick={() => window.location.reload()} variant="secondary">Return Home</Button>
              </div>
          </div>
      );
  }

  return (
    <div className="flex-grow bg-background py-8 px-4 sm:px-6 lg:px-8 print:bg-white print:p-0 font-sans">
      
      <div className="max-w-5xl mx-auto bg-card shadow-2xl rounded-none md:rounded-2xl overflow-hidden print:shadow-none border border-border print:border-0">
        
        {/* Report Header */}
        <div className="bg-white p-12 md:p-20 text-center relative overflow-hidden border-b border-border">
            <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
            <div className="relative z-10">
                <div className="flex justify-center mb-8">
                     <div className="w-16 h-16 text-primary">
                        <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="8" />
                          <path d="M35 65L65 35" stroke="#F97316" strokeWidth="6" strokeLinecap="round" />
                          <path d="M65 35V55" stroke="#F97316" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M65 35H45" stroke="#F97316" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                     </div>
                </div>
                <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-gray-900 tracking-tight">
                    Strategic Roadmap
                </h1>
                <p className="text-gray-500 text-lg font-medium tracking-wide uppercase mb-12 font-sans">
                    Prepared for {prospectData.companyName}
                </p>
                
                <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto">
                    <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="text-3xl font-bold text-primary mb-1">{client.businessHealthCheck.score}</div>
                        <div className="text-[10px] uppercase tracking-widest text-gray-500 font-sans font-bold">Health Score</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="text-3xl font-bold text-secondary mb-1">{client.keyStrengths.length}</div>
                        <div className="text-[10px] uppercase tracking-widest text-gray-500 font-sans font-bold">Core Strengths</div>
                    </div>
                    <div className="text-center p-4 bg-gray-50 rounded-lg border border-gray-100">
                        <div className="text-3xl font-bold text-accent mb-1">{client.criticalGaps.length}</div>
                        <div className="text-[10px] uppercase tracking-widest text-gray-500 font-sans font-bold">Critical Gaps</div>
                    </div>
                </div>
            </div>
        </div>

        <div className="p-8 md:p-16 space-y-16 bg-white print:p-10 print:space-y-10">
            
            {/* Executive Brief */}
            <section>
                <h3 className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-6 font-sans border-b border-gray-100 pb-2 inline-block">Executive Brief</h3>
                <div className="prose prose-lg max-w-none text-gray-700">
                     <MarkdownRenderer content={client.executiveSummary} />
                </div>
            </section>

            {/* Strengths & Gaps Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-12 print:gap-8">
                <div className="bg-blue-50/50 p-8 rounded-xl border border-blue-100">
                    <h3 className="text-xl font-bold text-gray-900 font-serif mb-6 flex items-center gap-2">
                        <span className="text-blue-600">✅</span> Competitive Advantages
                    </h3>
                    <div className="space-y-4">
                        {client.keyStrengths.map((item, i) => (
                            <div key={i} className="flex gap-3 text-gray-700 text-sm font-sans leading-relaxed">
                                <span className="text-blue-400 font-bold font-mono text-xs mt-1">0{i+1}</span>
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-red-50/50 p-8 rounded-xl border border-red-100">
                    <h3 className="text-xl font-bold text-gray-900 font-serif mb-6 flex items-center gap-2">
                        <span className="text-red-600">⚠️</span> Critical Gaps
                    </h3>
                    <div className="space-y-4">
                        {client.criticalGaps.map((item, i) => (
                            <div key={i} className="flex gap-3 text-gray-700 text-sm font-sans leading-relaxed">
                                <span className="text-red-400 font-bold font-mono text-xs mt-1">0{i+1}</span>
                                <span>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
            
            {/* Roadmap */}
            <section className="rounded-2xl border border-gray-200 overflow-hidden bg-white">
                <div className="bg-gray-50 p-8 border-b border-gray-200">
                     <h3 className="text-center text-gray-400 font-bold uppercase tracking-widest text-xs mb-2 font-sans">Execution Plan</h3>
                     <h2 className="text-center text-3xl font-serif font-bold text-gray-900">90-Day Implementation</h2>
                </div>
                
                <div className="divide-y divide-gray-100">
                    {client.roadmap.map((phase, i) => (
                        <div key={i} className="p-8 flex flex-col md:flex-row gap-8 group hover:bg-gray-50/50 transition-colors">
                            <div className="md:w-1/4 flex-shrink-0">
                                <div className="font-bold text-gray-900 text-lg font-serif mb-1">
                                  {i === 0 ? "Phase 1: Foundation" : i === 1 ? "Phase 2: Growth Engine" : "Phase 3: Scale"}
                                </div>
                                <div className="text-xs text-primary font-bold uppercase tracking-wide bg-primary/5 border border-primary/10 px-2 py-1 inline-block rounded">
                                  {i === 0 ? "Days 1-30" : i === 1 ? "Days 31-60" : "Days 61-90"}
                                </div>
                            </div>
                            <div className="md:w-3/4">
                                <div className="text-gray-800 font-medium leading-relaxed">
                                    <MarkdownRenderer content={i === 0 ? phase.phase1 : i === 1 ? phase.phase2 : phase.phase3} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Call to Action */}
             <div className="bg-gray-900 rounded-2xl p-12 text-center text-white print:hidden shadow-2xl border border-gray-800 relative overflow-hidden">
                <div className="relative z-10">
                    <h2 className="text-3xl font-serif font-bold mb-4 text-white">Ready to Execute?</h2>
                    <p className="text-gray-400 mb-8 max-w-2xl mx-auto font-sans text-lg">
                        This roadmap is just the beginning. ScaleOn Consulting specializes in turning these strategies into revenue. 
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button onClick={() => window.print()} variant="outline" className="border-white/20 text-white bg-white/5 hover:bg-white/10 font-sans">
                            Save as PDF
                        </Button>
                        <Button onClick={handleBookCall} className="bg-primary text-white hover:bg-primary/90 border-none shadow-lg shadow-primary/20 font-sans font-bold px-8">
                            Book Strategy Call
                        </Button>
                    </div>
                </div>
             </div>
        </div>
        
        <div className="hidden print:flex justify-between items-center p-8 border-t border-gray-200 mt-8 text-xs text-gray-400 font-sans bg-white">
            <span>© {new Date().getFullYear()} ScaleOn Consulting</span>
            <span>Confidential Strategy Document</span>
            <span>www.scaleonconsulting.com</span>
        </div>
      </div>
    </div>
  );
};
