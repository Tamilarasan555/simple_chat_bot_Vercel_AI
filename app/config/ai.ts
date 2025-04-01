import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Google AI configuration with API version
export const googleAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || '');

// Model configuration
export const AI_MODEL_CONFIG = {
  model: 'gemini-1.5-pro', // Switched back to stable model due to 503 error on experimental
  temperature: 0.7,
  maxOutputTokens: 1000,
};