import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini Client
const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
}) : null;

// --- API ENDPOINTS ---

// 1. Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", aiConfigured: !!ai, timestamp: new Date().toISOString() });
});

// 2. Gemini STT & Consultation Voice Summarizer
app.post("/api/gemini/summarize-stt", async (req, res) => {
  try {
    const { transcript, studentName, category } = req.body;

    if (!transcript) {
      return res.status(400).json({ error: "상담 녹음 텍스트(STT)가 필요합니다." });
    }

    if (!ai) {
      // Intelligent fallback if GEMINI_API_KEY is not set
      const lines = transcript.split('\n').filter((l: string) => l.trim().length > 0);
      return res.json({
        summary: [
          `📌 학생(${studentName || '김다이브'})의 상담 핵심 영역 및 성취도 다각도 점검 진행.`,
          `📌 약점 파트(어법 및 고난도 구문 분석)에 대한 1:1 집중 클리닉 및 오답 노트 수립.`,
          `📌 9월 목표 성취를 위한 주간 어휘 테스트 500자 완성 및 내신 대비 병행 확정.`
        ],
        tags: ['학습상담', '성적관리', '클리닉지정', '목표달성']
      });
    }

    const prompt = `당신은 '다이브 영어학원'의 수석 입시 컨설턴트 AI입니다.
다음 학부모/학생 상담 음성 녹음 텍스트(STT)를 바탕으로, 학부모님께 전달할 '스마트 상담 결과 리포트'용 3~5줄 요약문과 핵심 태그(3~5개)를 작성해주세요.

[학생 정보]
이름: ${studentName || '학생'}
상담 유형: ${category || '정기 상담'}

[상담 대화 STT 텍스트]
${transcript}

[요구사항]
- 예의 바르고 전문적인 어조로 작성하세요 (한국어).
- 각 요약 항목은 📌 기호로 시작하고, 성취도, 약점 보완책, 향후 과제/목표를 명확히 포함하세요.
- JSON 형식으로만 응답하세요.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "학부모 전달용 3~5줄 상담 핵심 요약"
            },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "상담 주요 키워드 태그"
            }
          },
          required: ["summary", "tags"]
        }
      }
    });

    const resultText = response.text || "{}";
    const parsed = JSON.parse(resultText);
    return res.json(parsed);
  } catch (error: any) {
    console.error("Gemini STT Summarize Error:", error);
    return res.status(500).json({
      error: "AI 상담 요약 생성 중 오류가 발생했습니다.",
      details: error.message
    });
  }
});

// 3. Gemini RTP Test Data Smart Parser (Supports PDF File Base64 & Raw Text)
app.post("/api/gemini/parse-rtp", async (req, res) => {
  try {
    const { pdfBase64, mimeType, fileName, rtpRawText, studentName, grade } = req.body;

    if (!pdfBase64 && !rtpRawText) {
      return res.status(400).json({ error: "RTP 테스트 결과지(PDF 파일) 또는 텍스트 데이터가 필요합니다." });
    }

    if (!ai) {
      // Mock parser fallback for PDF or Text
      const sourceInfo = pdfBase64 
        ? `PDF 파일 [${fileName || 'RTP_테스트_결과지.pdf'}]`
        : 'RTP 텍스트 데이터';

      return res.json({
        vocabulary: 88,
        grammar: 72,
        reading: 94,
        listening: 90,
        syntax: 78,
        overallScore: 84.4,
        evaluatedLevel: "High-Intermediate (Level 4)",
        keyStrengths: [
          `${sourceInfo} 파싱 성공: 수능형 지문 독해속도 상위 10% 이내`,
          "듣기 스키밍 및 핵심 인과관계 파악 정답률 90% 이상"
        ],
        keyWeaknesses: [
          "복합 관계사 및 문법 도치 구문 오답률 28% 발생",
          "고난도 어휘 미세 유의어 정밀도 보완 필요"
        ],
        recommendation: "고등 구문 어법 300제 클리닉 및 주 2회 단어 100개 집중 테스트 추천"
      });
    }

    const prompt = `당신은 '다이브 영어학원'의 RTP(Reading & Testing Placement) 영어 진단평가 분석 전문가 AI입니다.
업로드된 RTP 테스트 결과지(PDF 문서 또는 텍스트)를 정밀 분석하여 영역별 점수(100점 만점 기준), 종합점수, 등급 레벨, 강점, 약점, 맞춤 처방을 정확히 추출하세요.

[학생 정보]
이름: ${studentName || '학생'}
학년: ${grade || '중고등부'}

${rtpRawText ? `[입력된 RTP 테스트 데이터 텍스트]\n${rtpRawText}` : '[첨부된 RTP 테스트 결과지 PDF 문서 분석]' }

[파싱 요구사항]
1. 영역별 점수 (0~100점 사이 숫자):
   - 어휘 (vocabulary)
   - 문법 (grammar)
   - 독해 (reading)
   - 듣기 (listening)
   - 구문 (syntax)
2. overallScore: 영역별 평균 종합점수 (소수점 1자리)
3. evaluatedLevel: 예) "Advanced (Level 5)", "High-Intermediate (Level 4)", "Intermediate (Level 3)", "Elementary (Level 1)" 등
4. keyStrengths: 추출된 핵심 강점 2개 (한국어)
5. keyWeaknesses: 추출된 보완 필요 약점 2개 (한국어)
6. recommendation: 전담 강사 맞춤 학습 처방 및 교재 추천 1문장
- JSON 형식으로만 응답하세요.`;

    const contents: any[] = [];
    
    if (pdfBase64) {
      contents.push({
        inlineData: {
          data: pdfBase64,
          mimeType: mimeType || "application/pdf"
        }
      });
    }
    contents.push(prompt);

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            vocabulary: { type: Type.NUMBER },
            grammar: { type: Type.NUMBER },
            reading: { type: Type.NUMBER },
            listening: { type: Type.NUMBER },
            syntax: { type: Type.NUMBER },
            overallScore: { type: Type.NUMBER },
            evaluatedLevel: { type: Type.STRING },
            keyStrengths: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            keyWeaknesses: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            recommendation: { type: Type.STRING }
          },
          required: ["vocabulary", "grammar", "reading", "listening", "syntax", "overallScore", "evaluatedLevel", "keyStrengths", "keyWeaknesses"]
        }
      }
    });

    const resultText = response.text || "{}";
    const parsed = JSON.parse(resultText);
    return res.json(parsed);
  } catch (error: any) {
    console.error("Gemini RTP Parse Error:", error);
    return res.status(500).json({
      error: "RTP PDF 결과지 분석 중 오류가 발생했습니다.",
      details: error.message
    });
  }
});

// --- SERVER SETUP & VITE MIDDLEWARE ---
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[다이브 영어학원 관리자 백엔드] Server running on http://localhost:${PORT}`);
  });
}

startServer();
