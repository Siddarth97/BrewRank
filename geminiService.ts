
import { GoogleGenAI } from "@google/genai";
import { CoffeeShop, AnalysisResult } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function analyzeCoffeeShops(
  location: { lat: number; lng: number } | string,
  query: string = "Best coffee shops"
): Promise<AnalysisResult> {
  const model = "gemini-2.5-flash"; 
  
  const toolConfig = typeof location !== 'string' ? {
    retrievalConfig: {
      latLng: {
        latitude: location.lat,
        longitude: location.lng
      }
    }
  } : undefined;

  // We ask for a very specific, easy-to-parse text format since JSON mode isn't available with tools.
  const prompt = `
    Find top-rated coffee shops for the query: "${query}".
    Use the googleMaps tool to get accurate details.
    
    For each shop, output EXACTLY this block format:
    ---SHOP---
    Name: [Shop Name]
    Address: [Full Address]
    Taste: [Score 0-10]
    Variety: [Score 0-10]
    Ambience: [Score 0-10]
    Summary: [1-sentence review summary]
    ---END---

    Rules:
    - Scores must be numbers only.
    - Summary should be concise.
    - Provide at least 5 results if possible.
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        tools: [{ googleMaps: {} }],
        toolConfig: toolConfig,
      },
    });

    const text = response.text || "";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const groundingUrls = chunks
      .filter(chunk => chunk.maps)
      .map(chunk => ({
        uri: chunk.maps?.uri || '',
        title: chunk.maps?.title || 'Map Link'
      }));

    const shops: CoffeeShop[] = [];
    
    // Improved robust parsing using the custom delimiters
    const shopBlocks = text.split(/---SHOP---/i).filter(b => b.trim().length > 10);

    shopBlocks.forEach((block, index) => {
      // Extract values using flexible regexes
      const name = block.match(/Name:\s*(.*)/i)?.[1]?.trim();
      const address = block.match(/Address:\s*(.*)/i)?.[1]?.trim() || "Location shared via map";
      const taste = parseFloat(block.match(/Taste:\s*(\d+(\.\d+)?)/i)?.[1] || "7.5");
      const variety = parseFloat(block.match(/Variety:\s*(\d+(\.\d+)?)/i)?.[1] || "7.0");
      const ambience = parseFloat(block.match(/Ambience:\s*(\d+(\.\d+)?)/i)?.[1] || "8.0");
      const summary = block.match(/Summary:\s*(.*)/i)?.[1]?.trim() || "A great local coffee destination.";

      if (name) {
        // Try to match with grounding data for rating if possible, otherwise default
        const mapsUrl = groundingUrls.find(u => u.title.toLowerCase().includes(name.toLowerCase()))?.uri || groundingUrls[index]?.uri || "#";
        
        shops.push({
          id: `shop-${index}-${Date.now()}`,
          name,
          address,
          rating: 4.5, 
          reviewCount: 0,
          tasteScore: taste,
          varietyScore: variety,
          ambienceScore: ambience,
          summary,
          mapsUrl,
          imageUrl: `https://picsum.photos/seed/${encodeURIComponent(name)}/500/350`
        });
      }
    });

    return {
      shops,
      groundingUrls
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
