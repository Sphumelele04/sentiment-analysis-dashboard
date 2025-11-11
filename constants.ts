
import { SampleText, SentimentLabel } from './types';

export const API_LIMITATIONS_DISCUSSION = `
The Gemini API, while powerful, has inherent limitations in sentiment analysis. As a large language model (LLM), its understanding of sentiment is derived from patterns in its vast training data, not from genuine emotional comprehension. This can lead to challenges with nuanced language such as sarcasm, irony, or culturally specific expressions, which may be misinterpreted. For example, a phrase like "Oh, great, another meeting" could be classified as positive due to the word 'great', while the intended sentiment is negative.

The model's performance can also be influenced by the domain of the text. It might perform exceptionally well on generic product reviews but struggle with specialized jargon in legal or medical texts. Bias present in the training data is another significant concern. The model may inadvertently reflect societal biases, potentially leading to skewed sentiment scores for texts related to certain demographics or topics. The 'confidence score' provided is not a statistical probability but rather the model's own estimation of its certainty, which can sometimes be overconfident in incorrect classifications.

Furthermore, the model's analysis is limited to the text provided and lacks broader context. A review saying "The battery life is amazing, but the screen is terrible" contains both positive and negative elements. The model must aggregate these into a single classification (Positive, Negative, or Neutral), which can oversimplify the user's true sentiment. In our tests, while the API demonstrates high overall accuracy, these limitations are most apparent in borderline cases or texts requiring deep contextual understanding. Therefore, while this tool is excellent for identifying broad sentiment trends, critical decisions should always involve human oversight to account for these nuances and potential inaccuracies.
`;

export const SAMPLE_TEXTS: SampleText[] = [
    { text: "This is the best purchase I've ever made! Absolutely love it.", groundTruth: SentimentLabel.Positive },
    { text: "The product arrived broken and the customer service was terrible.", groundTruth: SentimentLabel.Negative },
    { text: "It's an okay product, does the job but nothing special.", groundTruth: SentimentLabel.Neutral },
    { text: "I am overjoyed with the quality and performance. Exceeded my expectations!", groundTruth: SentimentLabel.Positive },
    { text: "Complete waste of money. I regret buying this.", groundTruth: SentimentLabel.Negative },
    { text: "The manual is a bit confusing, but I figured it out eventually.", groundTruth: SentimentLabel.Neutral },
    { text: "Wow, what a fantastic experience from start to finish.", groundTruth: SentimentLabel.Positive },
    { text: "I've had this for a week and it's already falling apart.", groundTruth: SentimentLabel.Negative },
    { text: "The delivery was on time.", groundTruth: SentimentLabel.Neutral },
    { text: "A revolutionary product that changed my daily routine for the better.", groundTruth: SentimentLabel.Positive },
    { text: "I'm so disappointed. It doesn't work as advertised.", groundTruth: SentimentLabel.Negative },
    { text: "The color is slightly different from the picture, but it's fine.", groundTruth: SentimentLabel.Neutral },
    { text: "Highly recommended! You won't be disappointed.", groundTruth: SentimentLabel.Positive },
    { text: "This was a huge letdown. I expected much more.", groundTruth: SentimentLabel.Negative },
    { text: "The packaging was adequate.", groundTruth: SentimentLabel.Neutral },
    { text: "Five stars! An amazing gadget that everyone should own.", groundTruth: SentimentLabel.Positive },
    { text: "The app constantly crashes, making the device unusable.", groundTruth: SentimentLabel.Negative },
    { text: "It functions as expected.", groundTruth: SentimentLabel.Neutral },
    { text: "Incredible value for the price. I'm very impressed.", groundTruth: SentimentLabel.Positive },
    { text: "This is the worst thing I have ever bought online. Avoid at all costs.", groundTruth: SentimentLabel.Negative },
    { text: "The item was delivered to the correct address.", groundTruth: SentimentLabel.Neutral },
    { text: "My life is so much easier now. Thank you for this creation!", groundTruth: SentimentLabel.Positive },
    { text: "I had a very frustrating experience with this company.", groundTruth: SentimentLabel.Negative },
    { text: "The movie was neither good nor bad.", groundTruth: SentimentLabel.Neutral },
    { text: "I'm telling all my friends about this. It's that good!", groundTruth: SentimentLabel.Positive },
    { text: "The quality is cheap and it feels flimsy.", groundTruth: SentimentLabel.Negative },
    { text: "The event proceeded without any major incidents.", groundTruth: SentimentLabel.Neutral },
    { text: "Absolutely phenomenal service and product.", groundTruth: SentimentLabel.Positive },
    { text: "I would not recommend this to anyone. A complete failure.", groundTruth: SentimentLabel.Negative },
    { text: "The meeting was scheduled for 3 PM.", groundTruth: SentimentLabel.Neutral },
    { text: "I am ecstatic about the results. Truly remarkable.", groundTruth: SentimentLabel.Positive },
    { text: "The software is buggy and unintuitive.", groundTruth: SentimentLabel.Negative },
    { text: "This report contains the data you requested.", groundTruth: SentimentLabel.Neutral },
    { text: "An outstanding achievement in technology. Bravo!", groundTruth: SentimentLabel.Positive },
    { text: "I am thoroughly dissatisfied with my experience.", groundTruth: SentimentLabel.Negative },
    { text: "The sky is blue today.", groundTruth: SentimentLabel.Neutral },
    { text: "Could not be happier with this. A true game-changer.", groundTruth: SentimentLabel.Positive },
    { text: "The support team was unresponsive and unhelpful.", groundTruth: SentimentLabel.Negative },
    { text: "The chair has four legs.", groundTruth: SentimentLabel.Neutral },
    { text: "A truly delightful and refreshing movie. I loved every minute.", groundTruth: SentimentLabel.Positive },
    { text: "The food was bland and overpriced. A dreadful dinner.", groundTruth: SentimentLabel.Negative },
    { text: "The cat is sleeping on the mat.", groundTruth: SentimentLabel.Neutral },
    { text: "I was skeptical at first, but this product is genuinely amazing.", groundTruth: SentimentLabel.Positive },
    { text: "This update ruined the app. It's slower and harder to use.", groundTruth: SentimentLabel.Negative },
    { text: "The system is currently online.", groundTruth: SentimentLabel.Neutral },
    { text: "The concert was an unforgettable night of pure joy.", groundTruth: SentimentLabel.Positive },
    { text: "My order was canceled without any explanation. Awful service.", groundTruth: SentimentLabel.Negative },
    { text: "The specifications are listed on the website.", groundTruth: SentimentLabel.Neutral },
    { text: "This book is a masterpiece. I couldn't put it down.", groundTruth: SentimentLabel.Positive },
    { text: "The hotel room was dirty and noisy. A terrible stay.", groundTruth: SentimentLabel.Negative },
];
