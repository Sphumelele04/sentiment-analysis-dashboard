
import React, { useState, useEffect } from 'react';
import SentimentAnalyzer from './components/SentimentAnalyzer';
import { AnalysisIcon, SunIcon, MoonIcon } from './components/Icons';

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  return (
    <div className="bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 min-h-screen font-sans transition-colors duration-300">
      <header className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm shadow-sm sticky top-0 z-10 border-b border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-wider">
            SentraMind
          </h1>
          <div className="flex items-center space-x-2">
            <div className="flex items-center justify-center px-4 py-3 sm:py-2 rounded-lg bg-blue-600 text-white shadow-lg">
                <AnalysisIcon />
                <span className="ml-2 hidden sm:inline">Analyzer</span>
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? <MoonIcon className="w-5 h-5"/> : <SunIcon className="w-5 h-5"/>}
            </button>
          </div>
        </div>
      </header>
      
      <main className="container mx-auto p-4 md:p-6">
        <SentimentAnalyzer theme={theme} />
      </main>

      <footer className="text-center py-4 text-slate-500 dark:text-slate-400 text-sm">
        <p>Powered by Google Gemini API</p>
      </footer>
    </div>
  );
};

export default App;
