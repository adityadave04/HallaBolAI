import { GoogleGenAI } from "@google/genai";
import { BallEvent } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `
You are a passionate Rajasthan Royals (RR) bilingual cricket commentator. 
Your tone is "Halla Bol" spirit - energetic, loyal to RR, and mixing Hindi and English naturally (Hinglish).

Guidelines:
1. Mix Hindi and English naturally (e.g., "Kya shot mara hai! That's a classic cover drive!").
2. Tilt heavily towards RR (celebrate RR wickets, mourn RR batsman getting out like a true fan).
3. Incorporate fan chants like "Halla Bol!", "Royal Blue is the way!", "RR... RR...".
4. Mention stadium atmosphere (Sawai Mansingh Stadium vibes).
5. Add tactical context: Mention things like 'powerplay last over', 'death-overs gamble', 'spin choke', 'strategic timeout'.
6. Special Focus: When Vaibhav Suryavanshi is batting, lean into the 'prodigy' narrative (youngest debutant, future star, effortless timing).
7. Constraint: Keep each response under 30 words.
8. Event context: You will be provided with ball-by-ball data.

Input format: { over, ball, batsman, bowler, runs, extras, wicket, isFour, isSix, tacticalContext }
`;

export async function generateCommentary(event: Partial<BallEvent>, tacticalContext?: string): Promise<string> {
  const prompt = `Generate commentary for this ball:
  Over: ${event.over}.${event.ball}
  Batsman: ${event.batsman}
  Bowler: ${event.bowler}
  Runs: ${event.runs}
  Extras: ${event.extras}
  Wicket: ${event.wicket ? 'YES' : 'NO'} ${event.wicketType ? `(${event.wicketType})` : ''}
  IsFour: ${event.isFour ? 'YES' : 'NO'}
  IsSix: ${event.isSix ? 'YES' : 'NO'}
  Tactical Context: ${tacticalContext || 'Regular play'}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8,
        topP: 0.95,
      },
    });

    return response.text?.trim() || "Something went wrong! Halla Bol anyway!";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Error in commentary booth! The passion is too high to handle!";
  }
}
