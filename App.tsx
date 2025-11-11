
import React, { useState } from 'react';
import SentimentAnalyzer from './components/SentimentAnalyzer';
import AccuracyReport from './components/AccuracyReport';
import { AnalysisIcon, ReportIcon } from './components/Icons';

type View = 'analyzer' | 'report';

// Fix: Define a props interface for NavButton to help TypeScript correctly interpret the component signature.
interface NavButtonProps {
  view: View;
  label: string;
  children: React.ReactNode;
}

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<View>('analyzer');

  const renderView = () => {
    switch (activeView) {
      case 'analyzer':
        return <SentimentAnalyzer />;
      case 'report':
        return <AccuracyReport />;
      default:
        return <SentimentAnalyzer />;
    }
  };
  
  // Fix: Explicitly type NavButton as a React.FC to ensure TypeScript correctly recognizes its props, including 'children'.
  const NavButton: React.FC<NavButtonProps> = ({ view, label, children }) => (
    <button
      onClick={() => setActiveView(view)}
      className={`flex items-center justify-center w-full sm:w-auto px-4 py-3 sm:py-2 rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-indigo-500 ${
        activeView === view
          ? 'bg-indigo-600 text-white shadow-lg'
          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
      }`}
    >
      {children}
      <span className="ml-2 hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <div className="bg-gray-900 text-gray-100 min-h-screen font-sans">
      <header className="bg-gray-800/50 backdrop-blur-sm shadow-lg sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-white tracking-wider">
            SentraMind
          </h1>
          <nav className="flex space-x-2">
            <NavButton view="analyzer" label="Analyzer">
              <AnalysisIcon />
            </NavButton>
            <NavButton view="report" label="Accuracy Report">
              <ReportIcon />
            </NavButton>
          </nav>
        </div>
      </header>
      
      <main className="container mx-auto p-4 md:p-6">
        {renderView()}
      </main>

      <footer className="text-center py-4 text-gray-500 text-sm">
        <p>Powered by Google Gemini API</p>
      </footer>
    </div>
  );
};

export default App;