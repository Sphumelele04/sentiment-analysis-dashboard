
import { AnalysisResult } from '../types';

declare const jspdf: any;

const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export const exportToJson = (data: AnalysisResult[]) => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    downloadBlob(blob, 'sentiment_analysis_results.json');
};

export const exportToCsv = (data: AnalysisResult[]) => {
    const headers = ['Text', 'Sentiment', 'Confidence Score', 'Keywords', 'Explanation'];
    const rows = data.map(item => [
        `"${item.text.replace(/"/g, '""')}"`,
        item.sentiment,
        item.confidenceScore,
        `"${item.keywords.join(', ')}"`,
        `"${item.explanation.replace(/"/g, '""')}"`
    ]);

    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    downloadBlob(blob, 'sentiment_analysis_results.csv');
};

export const exportToPdf = (data: AnalysisResult[]) => {
    const { jsPDF } = jspdf;
    const doc = new jsPDF();
    
    doc.text("Sentiment Analysis Results", 14, 16);
    doc.setFontSize(10);
    
    const tableColumn = ["Text", "Sentiment", "Score", "Keywords"];
    const tableRows: (string | number)[][] = [];

    data.forEach(item => {
        const rowData = [
            item.text,
            item.sentiment,
            (item.confidenceScore * 100).toFixed(1) + '%',
            item.keywords.join(', ')
        ];
        tableRows.push(rowData);
    });

    doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 20,
        styles: {
            fontSize: 8,
            cellPadding: 2
        },
        headStyles: {
            fillColor: [41, 128, 185],
            textColor: 255,
            fontStyle: 'bold'
        },
        columnStyles: {
            0: { cellWidth: 80 },
        }
    });

    doc.save('sentiment_analysis_results.pdf');
};
