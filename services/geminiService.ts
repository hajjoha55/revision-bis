
import { GoogleGenAI, Type } from "@google/genai";
import type { Flashcard, Source } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const flashcardSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      question: {
        type: Type.STRING,
        description: "La question claire et concise de la fiche.",
      },
      answer: {
        type: Type.STRING,
        description: "La réponse correspondante, précise et informative.",
      },
    },
    required: ["question", "answer"],
  },
};

const cleanJsonString = (str: string): string => {
  // Remove markdown code block fences and handle potential extra text
  const match = str.match(/\[[\s\S]*\]/);
  if (match) {
    return match[0];
  }
  return str.trim().replace(/^```json\s*/, '').replace(/```$/, '');
};

export const generateFlashcardsFromText = async (
  text: string,
  count: number
): Promise<{ flashcards: Flashcard[] }> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        Analyse le texte suivant et génère exactement ${count} fiches de révision (flashcards).
        Chaque fiche doit contenir une question et une réponse.
        Texte à analyser :
        ---
        ${text}
        ---
      `,
      config: {
        responseMimeType: "application/json",
        responseSchema: flashcardSchema,
      },
    });

    const jsonText = response.text.trim();
    if (!jsonText) {
      throw new Error("La réponse de l'API était vide. Le contenu est peut-être inapproprié ou non pertinent.");
    }
    const flashcards = JSON.parse(jsonText);
    return { flashcards };
  } catch (error) {
    console.error("Erreur lors de la génération à partir du texte:", error);
    throw new Error("Impossible de générer les fiches à partir du texte. Veuillez vérifier le contenu et réessayer.");
  }
};


export const generateFlashcardsFromSearch = async (
  query: string,
  count: number
): Promise<{ flashcards: Flashcard[]; sources: Source[] }> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        Recherche des informations sur le sujet suivant : "${query}".
        À partir des résultats de recherche, crée exactement ${count} fiches de révision (flashcards) claires et concises.
        Chaque fiche doit avoir une question et une réponse.
        Réponds UNIQUEMENT avec un tableau JSON contenant les objets de fiches. Chaque objet doit avoir une clé "question" et une clé "answer". Ne fournis aucun texte ou formatage en dehors de ce tableau JSON.
      `,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    if (!response.text) {
        throw new Error("L'API n'a retourné aucune donnée. Le sujet est peut-être trop obscur ou la requête a échoué.");
    }

    const cleanedJson = cleanJsonString(response.text);
    const flashcards: Flashcard[] = JSON.parse(cleanedJson);

    const rawSources = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources: Source[] = rawSources.map((s: any) => ({
        uri: s.web?.uri || '',
        title: s.web?.title || '',
    })).filter(s => s.uri);

    return { flashcards, sources };

  } catch (error) {
    console.error("Erreur lors de la génération à partir de la recherche web:", error);
    if (error instanceof SyntaxError) {
        throw new Error("L'IA a retourné un format invalide. Veuillez essayer une autre recherche.");
    }
    throw new Error("Impossible de générer les fiches à partir de la recherche. Veuillez réessayer.");
  }
};
