import { CreateMLCEngine } from "@mlc-ai/web-llm";

const MODEL_ID = "Phi-3-mini-4k-instruct-q4f16_1-MLC";

let engine: any = null;

export async function initAI(onProgress: (p: number) => void) {
  if (engine) return engine;
  engine = await CreateMLCEngine(MODEL_ID, {
    initProgressCallback: (info: any) => {
      onProgress(Math.round(info.progress * 100));
    },
  });
  return engine;
}

export async function askAI(
  question: string,
  lang: string,
  subject: string
): Promise<string> {
  if (!engine) throw new Error("AI not initialized");
  
  const systemPrompt = buildSystemPrompt(lang, subject);
  
  const reply = await engine.chat.completions.create({
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: question }
    ],
    temperature: 0.7,
    max_tokens: 200,
  });
  
  return reply.choices[0].message.content ?? "";
}

function buildSystemPrompt(lang: string, subject: string): string {
  const langMap: Record<string, string> = {
    ind: "Bahasa Indonesia",
    jav: "bahasa Jawa",
    sun: "bahasa Sunda", 
    bug: "bahasa Bugis",
  };
  return `Kamu adalah Pak AI, guru SD yang ramah dan sabar untuk 
anak-anak Indonesia di daerah terpencil. Jawab HANYA dalam 
${langMap[lang] || "Bahasa Indonesia"}. Mata pelajaran: ${subject}. 
Gunakan contoh dari kehidupan sehari-hari seperti sawah, kebun sawit, 
nelayan, pasar tradisional. Jawab singkat, maksimal 3 kalimat, 
gunakan bahasa yang mudah dipahami anak SD. Selalu semangati murid.`;
}
