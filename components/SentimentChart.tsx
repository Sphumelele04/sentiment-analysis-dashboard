
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AnalysisResult, SentimentLabel } from '../types';

interface SentimentChartProps {
    data: AnalysisResult[];
    theme: 'light' | 'dark';
}

const COLORS = {
    [SentimentLabel.Positive]: '#10b981', // emerald-500
    [SentimentLabel.Negative]: '#f43f5e', // rose-500
    [SentimentLabel.Neutral]: '#0ea5e9', // sky-500
    [SentimentLabel.Error]: '#f59e0b',   // amber-500
};

export const SentimentChart: React.FC<SentimentChartProps> = ({ data, theme }) => {
    const sentimentCounts = data.reduce((acc, curr) => {
        acc[curr.sentiment] = (acc[curr.sentiment] || 0) + 1;
        return acc;
    }, {} as Record<SentimentLabel, number>);

    const chartData = Object.entries(sentimentCounts).map(([name, value]) => ({
        name: name as SentimentLabel,
        value,
    }));
    
    if (!chartData.length) return null;

    const isDarkMode = theme === 'dark';

    return (
        <div style={{ width: '100%', height: 180 }}>
            <ResponsiveContainer>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        stroke={isDarkMode ? "#1e293b" : "#ffffff"} // slate-800 / white
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                        ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: isDarkMode ? '#1e293b' : '#ffffff', // slate-800 / white
                            borderColor: isDarkMode ? '#334155' : '#e2e8f0', // slate-700 / slate-200
                            borderRadius: '0.5rem'
                        }}
                    />
                    <Legend
                        wrapperStyle={{ fontSize: '14px' }}
                        iconSize={10}
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                        formatter={(value) => <span className={isDarkMode ? "text-slate-300" : "text-slate-700"}>{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};
