import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-card border-b border-border py-4 px-6 sticky top-0 z-50 shadow-sm print:hidden">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center cursor-pointer gap-3" onClick={() => window.location.reload()}>
          {/* Professional SVG Logo for ScaleOn using new Brand Colors */}
          <div className="relative w-10 h-10 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="45" stroke="#2563EB" strokeWidth="10" />
              <path d="M35 65L65 35" stroke="#F97316" strokeWidth="8" strokeLinecap="round" />
              <path d="M65 35V55" stroke="#F97316" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M65 35H45" stroke="#F97316" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <div className="flex flex-col">
            <span className="font-sans font-bold text-2xl leading-none tracking-tight text-primary">
              ScaleOn
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-bold">
              Consulting
            </span>
          </div>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <span className="px-4 py-1.5 rounded-full bg-muted text-primary text-xs font-bold tracking-wider uppercase border border-border">
            Strategic Discovery
          </span>
        </nav>
      </div>
    </header>
  );
};