import React, { useState, useCallback } from 'react';
import { SAMPLE_TEXTS, API_LIMITATIONS_DISCUSSION } from '../constants';
import { analyzeSentiment } from '../services/geminiService';
import { AnalysisResult, ConfusionMatrix, PerformanceMetrics, SentimentLabel } from '../types';
import { calculateConfusionMatrix, calculatePerformanceMetrics } from '../utils/metricsUtils';
import { AnalyzeIcon, ReportIcon, CsvIcon, JsonIcon, PdfIcon, KeywordIcon, ExplanationIcon, ScoreIcon } from './Icons';

const ConfusionMatrixDisplay = ({ matrix }: { matrix: ConfusionMatrix }) => {
    const labels = [SentimentLabel.Positive, SentimentLabel.Negative, SentimentLabel.Neutral];
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg">
                <thead className="bg-gray-700/50">
                    <tr>
                        <th className="p-3 text-left text-sm font-semibold tracking-wider text-gray-300" colSpan={2}></th>
                        <th className="p-3 text-center text-sm font-semibold tracking-wider text-gray-300" colSpan={3}>Predicted Class</th>
                    </tr>
                    <tr>
                        <th className="p-3 text-left text-sm font-semibold text-gray-300" colSpan={2}>Actual Class</th>
                        {labels.map(label => <th key={label} className="p-3 text-sm font-medium text-gray-300">{label}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {labels.map(actual => (
                        <tr key={actual} className="border-t border-gray-700">
                            {actual === SentimentLabel.Positive ? <td rowSpan={3} className="p-3 text-center transform -rotate-90 text-sm font-semibold tracking-wider text-gray-300">Actual Class</td> : null}
                            <td className="p-3 font-medium text-gray-300">{actual}</td>
                            {labels.map(predicted => (
                                <td key={predicted} className="p-3 text-center text-lg font-bold text-indigo-300">
                                    {matrix[actual]?.[predicted] || 0}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const PerformanceMetricsDisplay = ({ metrics }: { metrics: PerformanceMetrics }) => {
    const labels = [SentimentLabel.Positive, SentimentLabel.Negative, SentimentLabel.Neutral];
    const formatPercent = (n: number) => (n * 100).toFixed(2) + '%';
    
    return (
        <div className="space-y-4">
             <div className="bg-gray-800 p-4 rounded-lg text-center">
                <p className="text-gray-400 text-sm font-medium">Overall Accuracy</p>
                <p className="text-3xl font-bold text-indigo-400">{formatPercent(metrics.accuracy)}</p>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full bg-gray-800 border border-gray-700 rounded-lg">
                    <thead className="bg-gray-700/50">
                        <tr>
                            <th className="p-3 text-left text-sm font-semibold text-gray-300">Class</th>
                            <th className="p-3 text-left text-sm font-semibold text-gray-300">Precision</th>
                            <th className="p-3 text-left text-sm font-semibold text-gray-300">Recall</th>
                            <th className="p-3 text-left text-sm font-semibold text-gray-300">F1-Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {labels.map(label => (
                            <tr key={label} className="border-t border-gray-700">
                                <td className="p-3 font-medium text-gray-300">{label}</td>
                                <td className="p-3 font-mono text-indigo-300">{formatPercent(metrics.precision[label] || 0)}</td>
                                <td className="p-3 font-mono text-indigo-300">{formatPercent(metrics.recall[label] || 0)}</td>
                                <td className="p-3 font-mono text-indigo-300">{formatPercent(metrics.f1Score[label] || 0)}</td>
                            </tr>
                        ))}
                        <tr className="border-t-2 border-gray-600 bg-gray-700/30">
                            <td className="p-3 font-semibold text-gray-300">Macro Avg.</td>
                            <td className="p-3 font-semibold font-mono text-indigo-300">{formatPercent(metrics.macroAverage.precision)}</td>
                            <td className="p-3 font-semibold font-mono text-indigo-300">{formatPercent(metrics.macroAverage.recall)}</td>
                            <td className="p-3 font-semibold font-mono text-indigo-300">{formatPercent(metrics.macroAverage.f1Score)}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const AccuracyReport: React.FC = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<({ groundTruth: SentimentLabel, predicted: SentimentLabel })[]>([]);
    const [matrix, setMatrix] = useState<ConfusionMatrix | null>(null);
    const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
    const [error, setError] = useState<string | null>(null);

    const runAnalysis = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setResults([]);
        setMatrix(null);
        setMetrics(null);

        try {
            const promises = SAMPLE_TEXTS.map(async (sample) => {
                const analysis = await analyzeSentiment(sample.text);
                return { groundTruth: sample.groundTruth, predicted: analysis.sentiment };
            });
            const analysisResults = await Promise.all(promises);
            setResults(analysisResults);
            
            const newMatrix = calculateConfusionMatrix(analysisResults);
            setMatrix(newMatrix);
            
            const newMetrics = calculatePerformanceMetrics(newMatrix);
            setMetrics(newMetrics);

        } catch (err) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred during analysis.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    return (
        <div className="space-y-6">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                <h2 className="text-2xl font-bold mb-2 text-white">API Accuracy & Performance Report</h2>
                <p className="text-gray-400 mb-4">
                    This report evaluates the Gemini API's sentiment analysis performance against a pre-labeled dataset of {SAMPLE_TEXTS.length} sample texts. It provides a confusion matrix, key performance metrics, and a discussion on the model's limitations.
                </p>
                <button
                    onClick={runAnalysis}
                    disabled={isLoading}
                    className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-indigo-900/50 disabled:cursor-not-allowed transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-indigo-500"
                >
                    {isLoading ? (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : <ReportIcon/>}
                    <span className="ml-2">{isLoading ? 'Running Analysis...' : 'Run Performance Analysis'}</span>
                </button>
                {error && <p className="mt-4 text-red-400">{error}</p>}
            </div>

            {isLoading && (
                 <div className="text-center text-gray-400 py-8">
                    <p>Analyzing {SAMPLE_TEXTS.length} texts... this may take a moment.</p>
                </div>
            )}
            
            {matrix && metrics && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
                        <h3 className="text-xl font-semibold mb-4 text-white">Confusion Matrix</h3>
                        <ConfusionMatrixDisplay matrix={matrix} />
                    </div>
                    <div className="bg-gray-800 p-4 rounded-lg shadow-lg border border-gray-700">
                        <h3 className="text-xl font-semibold mb-4 text-white">Performance Metrics</h3>
                        <PerformanceMetricsDisplay metrics={metrics} />
                    </div>
                </div>
            )}

            <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
                <h3 className="text-xl font-semibold mb-4 text-white">Discussion of API Limitations</h3>
                <div className="prose prose-invert prose-p:text-gray-300 prose-strong:text-white max-w-none">
                   <p className="whitespace-pre-wrap">{API_LIMITATIONS_DISCUSSION}</p>
                </div>
            </div>
        </div>
    );
};

export default AccuracyReport;