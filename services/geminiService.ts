import { GoogleGenAI, Type } from '@google/genai';
import { AnalysisResult, SentimentLabel } from '../types';

const sentimentAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    sentiment: {
      type: Type.STRING,
      description: 'The sentiment of the text. Must be one of: "Positive", "Negative", "Neutral".',
      enum: ["Positive", "Negative", "Neutral"],
    },
    confidenceScore: {
      type: Type.NUMBER,
      description: 'A score from 0.0 to 1.0 indicating the confidence in the sentiment classification.',
    },
    keywords: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'A list of 3-5 keywords or short phrases from the text that most strongly drive the sentiment.',
    },
    explanation: {
      type: Type.STRING,
      description: 'A brief, one-sentence explanation of why the text was assigned this sentiment, referencing the keywords.',
    },
  },
  required: ['sentiment', 'confidenceScore', 'keywords', 'explanation'],
};

const batchSentimentAnalysisSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            originalText: {
                type: Type.STRING,
                description: "The original text snippet that was analyzed."
            },
            analysis: sentimentAnalysisSchema
        },
        required: ['originalText', 'analysis']
    }
}

let ai: GoogleGenAI | null = null;

const getAI = () => {
    if (!ai) {
        if (!process.env.API_KEY) {
            throw new Error("API_KEY environment variable not set");
        }
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
}

export const analyzeSentiment = async (text: string): Promise<Omit<AnalysisResult, 'id' | 'text'>> => {
    try {
        const genAI = getAI();
        const response = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze the sentiment of the following text and provide a detailed breakdown. Text: "${text}"`,
            config: {
                responseMimeType: 'application/json',
                responseSchema: sentimentAnalysisSchema,
                temperature: 0.1,
            },
        });

        const resultText = response.text.trim();
        const resultJson = JSON.parse(resultText);
        
        // Validate the sentiment label
        const sentiment = Object.values(SentimentLabel).includes(resultJson.sentiment) 
            ? resultJson.sentiment 
            : SentimentLabel.Neutral;

        return {
            sentiment: sentiment,
            confidenceScore: resultJson.confidenceScore || 0,
            keywords: resultJson.keywords || [],
            explanation: resultJson.explanation || 'No explanation provided.',
        };
    } catch (error) {
        console.error('Error analyzing sentiment:', error);
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to analyze sentiment: ${message}`);
    }
};

export const analyzeSentimentBatch = async (texts: string[]): Promise<AnalysisResult[]> => {
    try {
        const genAI = getAI();
        
        const formattedTexts = texts.map((t, i) => `${i + 1}. "${t}"`).join('\n');
        
        const response = await genAI.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze the sentiment for each of the following text snippets and provide a detailed breakdown for each one. Respond with a JSON array where each object contains the original text and its analysis.\n\n${formattedTexts}`,
            config: {
                responseMimeType: 'application/json',
                responseSchema: batchSentimentAnalysisSchema,
                temperature: 0.1,
            },
        });

        const resultText = response.text.trim();
        const resultsJson: {originalText: string, analysis: any}[] = JSON.parse(resultText);
        
        return resultsJson.map((item, index) => {
            const sentiment = Object.values(SentimentLabel).includes(item.analysis.sentiment) 
                ? item.analysis.sentiment 
                : SentimentLabel.Neutral;
            
            return {
                id: `${Date.now()}-${index}`,
                text: item.originalText,
                sentiment: sentiment,
                confidenceScore: item.analysis.confidenceScore || 0,
                keywords: item.analysis.keywords || [],
                explanation: item.analysis.explanation || 'No explanation provided.',
            };
        });

    } catch (error) {
        console.error('Error analyzing sentiment batch:', error);
        const message = error instanceof Error ? error.message : String(error);
        throw new Error(`Failed to analyze batch sentiment: ${message}`);
    }
};