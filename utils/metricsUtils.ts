
import { ConfusionMatrix, PerformanceMetrics, SentimentLabel } from '../types';

export const calculateConfusionMatrix = (
    results: { groundTruth: SentimentLabel; predicted: SentimentLabel }[]
): ConfusionMatrix => {
    const matrix: ConfusionMatrix = {};
    const labels = Object.values(SentimentLabel).filter(l => l !== SentimentLabel.Error);

    labels.forEach(actual => {
        matrix[actual] = {};
        labels.forEach(predicted => {
            matrix[actual]![predicted] = 0;
        });
    });

    results.forEach(({ groundTruth, predicted }) => {
        if (groundTruth !== SentimentLabel.Error && predicted !== SentimentLabel.Error) {
             if (matrix[groundTruth] && matrix[groundTruth]![predicted] !== undefined) {
                 matrix[groundTruth]![predicted]! += 1;
             }
        }
    });

    return matrix;
};

export const calculatePerformanceMetrics = (matrix: ConfusionMatrix): PerformanceMetrics => {
    const labels = Object.values(SentimentLabel).filter(l => l !== SentimentLabel.Error);
    const metrics: PerformanceMetrics = {
        accuracy: 0,
        precision: {},
        recall: {},
        f1Score: {},
        macroAverage: { precision: 0, recall: 0, f1Score: 0 }
    };

    let totalCorrect = 0;
    let totalSamples = 0;

    labels.forEach(label => {
        const truePositives = matrix[label]?.[label] || 0;
        const predictedAsLabel = labels.reduce((sum, l) => sum + (matrix[l]?.[label] || 0), 0);
        const actualLabel = labels.reduce((sum, l) => sum + (matrix[label]?.[l] || 0), 0);
        
        totalCorrect += truePositives;
        totalSamples += actualLabel;

        metrics.precision[label] = predictedAsLabel > 0 ? truePositives / predictedAsLabel : 0;
        metrics.recall[label] = actualLabel > 0 ? truePositives / actualLabel : 0;
        const precision = metrics.precision[label]!;
        const recall = metrics.recall[label]!;
        metrics.f1Score[label] = (precision + recall) > 0 ? (2 * precision * recall) / (precision + recall) : 0;
    });

    metrics.accuracy = totalSamples > 0 ? totalCorrect / totalSamples : 0;
    
    labels.forEach(label => {
        metrics.macroAverage.precision += metrics.precision[label]!;
        metrics.macroAverage.recall += metrics.recall[label]!;
        metrics.macroAverage.f1Score += metrics.f1Score[label]!;
    });
    
    metrics.macroAverage.precision /= labels.length;
    metrics.macroAverage.recall /= labels.length;
    metrics.macroAverage.f1Score /= labels.length;

    return metrics;
};
