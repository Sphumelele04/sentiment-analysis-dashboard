
export enum SentimentLabel {
    Positive = 'Positive',
    Negative = 'Negative',
    Neutral = 'Neutral',
    Error = 'Error'
}

export interface AnalysisResult {
    id: string;
    text: string;
    sentiment: SentimentLabel;
    confidenceScore: number;
    keywords: string[];
    explanation: string;
}

export interface SampleText {
    text: string;
    groundTruth: SentimentLabel;
}

export type ConfusionMatrix = {
    [key in SentimentLabel]?: {
        [key in SentimentLabel]?: number;
    };
};

export interface PerformanceMetrics {
    accuracy: number;
    precision: { [key in SentimentLabel]?: number };
    recall: { [key in SentimentLabel]?: number };
    f1Score: { [key in SentimentLabel]?: number };
    macroAverage: {
        precision: number;
        recall: number;
        f1Score: number;
    };
}
