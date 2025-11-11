
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { AnalysisResult, SentimentLabel } from '../types';

interface SentimentChartProps {
    data: AnalysisResult[];
}

const COLORS = {
    [SentimentLabel.Positive]: '#22c55e', // green-500
    [SentimentLabel.Negative]: '#ef4444', // red-500
    [SentimentLabel.Neutral]: '#6b7280', // gray-500
    [SentimentLabel.Error]: '#eab308', // yellow-500
};

export const SentimentChart: React.FC<SentimentChartProps> = ({ data }) => {
    const sentimentCounts = data.reduce((acc, curr) => {
        acc[curr.sentiment] = (acc[curr.sentiment] || 0) + 1;
        return acc;
    }, {} as Record<SentimentLabel, number>);

    const chartData = Object.entries(sentimentCounts).map(([name, value]) => ({
        name: name as SentimentLabel,
        value,
    }));
    
    if (!chartData.length) return null;

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
                        stroke="#374151" // gray-700
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                        ))}
                    </Pie>
                    <Tooltip 
                        contentStyle={{ 
                            backgroundColor: '#1f2937', // gray-800
                            borderColor: '#4b5563', // gray-600
                            borderRadius: '0.5rem'
                        }}
                    />
                    <Legend
                        wrapperStyle={{ fontSize: '14px' }}
                        iconSize={10}
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                        formatter={(value, entry) => <span className="text-gray-300">{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};
