
import React, { useState, useCallback, useRef } from 'react';
import { analyzeSentimentBatch } from '../services/geminiService';
import { AnalysisResult, SentimentLabel } from '../types';
import { readTextFile } from '../utils/fileUtils';
import { exportToCsv, exportToJson, exportToPdf } from '../utils/exportUtils';
import { SentimentChart } from './SentimentChart';
import SentimentBadge from './SentimentBadge';
import { UploadIcon, AnalyzeIcon, CsvIcon, JsonIcon, PdfIcon, KeywordIcon, ExplanationIcon, ScoreIcon } from './Icons';

interface ResultCardProps {
    result: AnalysisResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => (
    <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg shadow-md border border-slate-200 dark:border-slate-700 transition-all duration-300 hover:border-blue-300 dark:hover:border-blue-700">
        <p className="text-slate-700 dark:text-slate-300 mb-3 break-words font-mono text-sm">"{result.text}"</p>
        <div className="flex flex-wrap gap-4 items-center mb-3">
            <SentimentBadge sentiment={result.sentiment} />
            <div className="flex items-center text-sm text-slate-600 dark:text-slate-400" title="Confidence Score">
                <ScoreIcon />
                <span className="ml-1.5 font-semibold">{(result.confidenceScore * 100).toFixed(1)}%</span>
            </div>
        </div>
        <div className="space-y-3 text-sm">
             <div className="flex items-start">
                <KeywordIcon className="mt-0.5" />
                <div className="ml-2">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200">Keywords</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                        {result.keywords.map((kw, i) => (
                            <span key={i} className="bg-blue-100 dark:bg-slate-700 text-blue-800 dark:text-blue-300 text-xs font-medium px-2.5 py-1 rounded-full">{kw}</span>
                        ))}
                    </div>
                </div>
            </div>
             <div className="flex items-start">
                <ExplanationIcon className="mt-0.5" />
                <div className="ml-2">
                    <h4 className="font-semibold text-slate-800 dark:text-slate-200">Explanation</h4>
                    <p className="text-slate-600 dark:text-slate-400 mt-1">{result.explanation}</p>
                </div>
            </div>
        </div>
    </div>
);

interface SentimentAnalyzerProps {
    theme: 'light' | 'dark';
}

const SentimentAnalyzer: React.FC<SentimentAnalyzerProps> = ({ theme }) => {
    const [textInput, setTextInput] = useState<string>('');
    const [results, setResults] = useState<AnalysisResult[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            if (!file.name.toLowerCase().endsWith('.txt')) {
                setError('Invalid file type. Please upload a .txt file.');
            } else {
                try {
                    const content = await readTextFile(file);
                    setTextInput(content);
                    setError(null);
                } catch (err) {
                    setError(err instanceof Error ? err.message : 'Failed to read file');
                }
            }
        }
        event.target.value = '';
    };
    
    const handleAnalyze = useCallback(async () => {
        if (!textInput.trim()) {
            setError('Please enter text or upload a file to analyze.');
            return;
        }
        setIsLoading(true);
        setError(null);
        setResults([]);
        
        const texts = textInput.split('\n').map(t => t.trim()).filter(t => t.length > 0);
        if (texts.length === 0) {
            setError('No valid text entries found.');
            setIsLoading(false);
            return;
        }

        try {
            const analysisResults = await analyzeSentimentBatch(texts);
            setResults(analysisResults);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    }, [textInput]);
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="flex flex-col space-y-4">
                 <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
                    <h2 className="text-lg font-semibold mb-3 text-slate-900 dark:text-white">Input Text</h2>
                    <textarea
                        value={textInput}
                        onChange={(e) => setTextInput(e.target.value)}
                        placeholder="Enter text here, one entry per line for batch analysis..."
                        className="w-full h-60 p-3 bg-slate-50 dark:bg-slate-900/50 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-slate-800 dark:text-slate-200 resize-y"
                        disabled={isLoading}
                    />
                    <div className="mt-4 flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={handleAnalyze}
                            disabled={isLoading || !textInput.trim()}
                            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-blue-400 dark:disabled:bg-blue-900/50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-blue-500"
                        >
                           <AnalyzeIcon/>
                            <span className="ml-2">{isLoading ? 'Analyzing...' : 'Analyze Text'}</span>
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isLoading}
                            className="flex-1 inline-flex items-center justify-center px-4 py-2 bg-slate-500 text-white font-semibold rounded-md hover:bg-slate-600 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-slate-500"
                        >
                            <UploadIcon />
                            <span className="ml-2">Upload .txt File</span>
                        </button>
                    </div>
                    {error && <p className="mt-3 text-rose-600 dark:text-rose-400 text-sm">{error}</p>}
                </div>
            </div>

            <div className="flex flex-col space-y-4">
                 <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 min-h-[400px]">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">Analysis Results</h2>
                     {isLoading && (
                        <div className="flex flex-col items-center justify-center h-full text-slate-600 dark:text-slate-400">
                            <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-500 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="mt-3">Processing your request...</p>
                        </div>
                    )}
                    {!isLoading && results.length > 0 && (
                        <div className="flex flex-col h-full">
                            <div className="mb-4">
                                <SentimentChart data={results} theme={theme} />
                            </div>
                            <div className="mb-4 flex flex-wrap gap-2">
                                <button onClick={() => exportToJson(results)} className="inline-flex items-center px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"><JsonIcon/> <span className="ml-2">Export JSON</span></button>
                                <button onClick={() => exportToCsv(results)} className="inline-flex items-center px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"><CsvIcon/> <span className="ml-2">Export CSV</span></button>
                                <button onClick={() => exportToPdf(results)} className="inline-flex items-center px-3 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"><PdfIcon/> <span className="ml-2">Export PDF</span></button>
                            </div>
                            <div className="overflow-y-auto space-y-4 pr-2 -mr-2 flex-grow max-h-[40vh]">
                                {results.map((result) => (
                                    <ResultCard key={result.id} result={result} />
                                ))}
                            </div>
                        </div>
                    )}
                     {!isLoading && results.length === 0 && (
                         <div className="flex items-center justify-center h-full text-slate-500">
                            <p>Your analysis results will appear here.</p>
                        </div>
                     )}
                </div>
            </div>
        </div>
    );
};

export default SentimentAnalyzer;
