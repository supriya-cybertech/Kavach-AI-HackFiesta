import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResponse, LanguageCode } from "../types";

const getMasterSystemInstruction = (language: LanguageCode, country: string = "India") => {
  return `You are Kavach AI, an AI-powered global digital guardian.
Your job is to analyze suspicious text and/or images and return a structured, human-friendly safety assessment.

CORE PRINCIPLES:
• Be calm, caring, and protective.
• Speak like a trusted family member or personal guardian (e.g., "Grandchild" tone for India).
• Avoid all technical jargon (e.g., do NOT use phishing, malware, HTTPS, encryption, exploit, social engineering).
• Be culturally and emotionally aware.
• Prioritize user reassurance and clarity.

GLOBAL LOCALIZATION RULES:
• Country Context: ${country}.
• Output Language: ${language}. Respond ONLY in this language.
• Adapt explanations based on the local culture and reference local scam behaviors.

RISK CLASSIFICATION:
• SAFE: Clearly safe message.
• SUSPICIOUS: Might be a trick, exercise caution.
• DANGEROUS: Definitely a scam, take immediate action.

You must return EXACTLY 3 action steps.`;
};

// Fast analysis using Gemini Flash
export const analyzeScam = async (
  input: { text?: string; imageData?: string },
  language: LanguageCode,
  country: string = "India"
): Promise<AnalysisResponse> => {
  // FIXED: Use environment variable instead of hardcoded API key
  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || process.env.API_KEY });
  
  const contents: any[] = [];
  if (input.text) contents.push({ text: `Analyze this message: ${input.text}` });
  if (input.imageData) {
    contents.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: input.imageData.split(',')[1],
      },
    });
    contents.push({ text: "Also check this screenshot for any hidden tricks or fake branding." });
  }

  try {
    const response = await ai.models.generateContent({
      // FIXED: Use correct model name
      model: "gemini-2.0-flash-exp",
      contents: { parts: contents },
      config: {
        systemInstruction: getMasterSystemInstruction(language, country),
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            risk_level: { type: Type.STRING },
            risk_color: { type: Type.STRING },
            summary: { type: Type.STRING },
            explanation: { type: Type.STRING },
            action_steps: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            voice_ready_text: { type: Type.STRING },
            confidence_score: { type: Type.NUMBER },
          },
          required: ["risk_level", "risk_color", "summary", "explanation", "action_steps", "voice_ready_text", "confidence_score"],
        },
      },
    });

    // FIXED: Parse response correctly
    const result = await response.response;
    return JSON.parse(result.text()) as AnalysisResponse;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw new Error("I couldn't look into this right now. Please try sharing it with me again in a moment.");
  }
};

// Deep Thinking Mode for complex scam logic
export const getThinkingAnalysis = async (
  input: { text?: string; imageData?: string },
  language: LanguageCode
): Promise<string> => {
  // FIXED: Use environment variable
  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || process.env.API_KEY });
  
  const parts: any[] = [{ text: `Provide a deep, protective explanation of why this is or isn't a scam. Think through the psychological tricks being used. Language: ${language}. Input: ${input.text || "See image"}` }];
  if (input.imageData) {
    parts.push({
      inlineData: {
        mimeType: "image/jpeg",
        data: input.imageData.split(',')[1],
      },
    });
  }

  // FIXED: Use correct model name and API structure
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash-thinking-exp",
    contents: { parts },
    config: {
      systemInstruction: "You are Kavach AI's core intelligence. Analyze scams with deep reasoning. Speak simply to the user but think through all hidden motives.",
    },
  });

  // FIXED: Parse response correctly
  const result = await response.response;
  return result.text();
};

// Chatbot service
export const getChatResponse = async (
  message: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[],
  language: LanguageCode
): Promise<string> => {
  // FIXED: Use environment variable
  const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_API_KEY || process.env.API_KEY });
  
  // FIXED: Use correct model name and chat API
  const chat = ai.models.startChat({
    model: 'gemini-2.0-flash-exp',
    systemInstruction: `You are Kavach AI, a protective digital guardian. Answer questions about cybersecurity and scams in a soft, grandchild-like tone. Language: ${language}. Stay helpful and alert.`,
    history: history as any,
  });

  const result = await chat.sendMessage(message);
  // FIXED: Parse response correctly
  const response = await result.response;
  return response.text();
};
