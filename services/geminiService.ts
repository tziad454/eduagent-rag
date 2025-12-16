import { GoogleGenAI } from "@google/genai";
import { DocumentChunk, RetrievedChunk } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Simulates a Vector DB Retrieval step using keyword scoring and Jaccard similarity.
 * In a real production app, this would call a backend with Pinecone/ChromaDB.
 */
export const retrieveContext = (query: string, knowledgeBase: DocumentChunk[]): RetrievedChunk[] => {
  const queryTerms = query.toLowerCase().split(/\s+/).filter(w => w.length > 3);
  
  const scoredChunks = knowledgeBase.map(chunk => {
    const text = (chunk.title + " " + chunk.content).toLowerCase();
    let matchCount = 0;
    
    queryTerms.forEach(term => {
      if (text.includes(term)) matchCount++;
    });

    // Simple heuristic score
    const score = queryTerms.length > 0 ? matchCount / queryTerms.length : 0;
    
    return {
      ...chunk,
      score: Math.min(score, 1) // Cap at 1
    };
  });

  // Return top 3 matches that have at least some relevance
  return scoredChunks
    .filter(c => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
};

/**
 * Generates a response using Gemini 2.5 Flash with the retrieved context.
 */
export const generateRAGResponse = async (query: string, context: RetrievedChunk[]): Promise<string> => {
  const contextText = context.map(c => `Source (${c.title}): ${c.content}`).join("\n\n");
  
  const systemPrompt = `
    You are EduAgent, an intelligent tutoring assistant.
    
    Strictly follow these rules:
    1. Answer the user's question using ONLY the provided Context Information below.
    2. If the answer is not in the context, politely state that you don't have that information in your current knowledge base.
    3. Be concise and educational in tone.
    4. Reference the source title when stating facts.
  `;

  const userPrompt = `
    Context Information:
    ${contextText}

    User Question: ${query}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        { role: 'user', parts: [{ text: systemPrompt + "\n" + userPrompt }] }
      ]
    });

    return response.text || "I processed the context but could not generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "I encountered an error while communicating with the LLM.";
  }
};