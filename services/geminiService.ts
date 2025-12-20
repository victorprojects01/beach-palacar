
import { GoogleGenAI, Type } from "@google/genai";
import { GeminiAction } from '../types';

// Helper to initialize the AI client following naming and key sourcing guidelines
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY not found in environment variables");
    return null;
  }
  // Initialization must use a named parameter: { apiKey: string }
  return new GoogleGenAI({ apiKey });
};

export const interpretCommand = async (userText: string, p1Name: string = "Jogador 1", p2Name: string = "Jogador 2"): Promise<GeminiAction> => {
  const ai = getAiClient();
  if (!ai) {
    return { action: 'UNKNOWN', message: 'Erro de configuração da API.' };
  }

  const systemInstruction = `
    Você é o cérebro do "Beach Placar", um app de Beach Tennis.
    Sua tarefa é interpretar comandos de texto do usuário e converter em ações JSON.
    
    Os jogadores atuais são:
    - P1: "${p1Name}" (ou Jogador 1)
    - P2: "${p2Name}" (ou Jogador 2)
    
    Regras de Interpretação:
    - "Ponto ${p1Name}", "Ponto do P1", "Ponto dele", "Foi dentro para o 1", "P1 marcou", "Ponto do [Nome P1]": action = "POINT_P1"
    - "Ponto ${p2Name}", "Ponto do P2", "Ponto dela", "Foi fora (se o 1 bateu)", "P2 marcou", "Ponto do [Nome P2]": action = "POINT_P2"
    - "Zerar", "Reiniciar", "Novo jogo", "Resetar": action = "RESET"
    - "Desfazer", "Voltar", "Corrigir": action = "UNDO"
    - Perguntas sobre regras ou placar: action = "EXPLAIN"
    
    Retorne apenas o JSON. Seja tolerante com erros de digitação.
  `;

  try {
    // Using gemini-3-flash-preview as it is the recommended model for basic text tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: userText,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            action: {
              type: Type.STRING,
              enum: ['POINT_P1', 'POINT_P2', 'RESET', 'UNDO', 'EXPLAIN', 'UNKNOWN'],
            },
            message: {
              type: Type.STRING,
              description: "Uma frase curta, divertida e praiana confirmando a ação ou explicando a regra usando o nome dos jogadores quando possível. Ex: 'Ponto sensacional da Alice!'"
            }
          },
          required: ['action', 'message']
        }
      }
    });

    // Accessing .text as a property (not a method) as per guidelines
    const text = response.text;
    if (!text) return { action: 'UNKNOWN', message: 'Não entendi.' };
    
    return JSON.parse(text) as GeminiAction;
  } catch (error) {
    console.error("Gemini Error:", error);
    return { action: 'UNKNOWN', message: 'Tive um problema ao processar o comando.' };
  }
};
