import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

console.log(
  "API KEY LOADED:",
  Boolean(process.env.GEMINI_API_KEY)
);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});


// =================================================
// HOME
// =================================================

app.get("/", (req, res) => {
  res.send("CareMitra AI Server is Working!");
});


// =================================================
// EXISTING AI CHAT
// Other pages can continue using this
// =================================================

app.post("/api/chat", async (req, res) => {
  try {

    const {
      message,
      language = "English"
    } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    const prompt = `
You are CareMitra, a healthcare assistant.

User language: ${language}

User message:
${message}

Give a short, simple and safe healthcare response in ${language}.

Rules:
- Do not give a definite medical diagnosis.
- Do not prescribe medicines.
- Give general healthcare guidance only.
- If the situation sounds like an emergency, advise immediate medical care.
`;

    const response =
      await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt
      });

    res.json({
      reply: response.text
    });

  } catch (error) {

    console.error(
      "GEMINI ERROR:",
      error
    );

    res.status(500).json({
      error:
        error.message ||
        "Gemini API error"
    });
  }
});


// =================================================
// VOICE + LOCAL LANGUAGE AI
// ONLY FOR VoiceLanguage.jsx
// =================================================

app.post("/api/voice-chat", async (req, res) => {

  const {
    message,
    language = "தமிழ்"
  } = req.body;

  console.log(
    "VOICE REQUEST:",
    message,
    language
  );


  if (!message) {

    return res.status(400).json({
      error: "Message is required"
    });

  }


  // -----------------------------------------------
  // Safe fallback responses
  // -----------------------------------------------

  const fallbackResponses = {

    "தமிழ்": `
உங்களுக்கு உடம்பு சரியில்லையெனில், முதலில் ஓய்வு எடுத்துக் கொண்டு போதுமான தண்ணீர் குடிக்கவும்.

காய்ச்சல், தொடர்ந்து வாந்தி, கடுமையான வலி அல்லது உடல்நிலை மோசமாக இருந்தால் அருகிலுள்ள மருத்துவரை அணுகவும்.

மூச்சுத்திணறல், நெஞ்சுவலி, மயக்கம் அல்லது கடுமையான இரத்தப்போக்கு இருந்தால் உடனடியாக அவசர மருத்துவ உதவியை நாடுங்கள்.
`,

    "हिन्दी": `
अगर आपकी तबीयत ठीक नहीं है, तो आराम करें और पर्याप्त पानी पिएं।

अगर बुखार, लगातार उल्टी, तेज दर्द या हालत बिगड़ रही है, तो नजदीकी डॉक्टर से सलाह लें।

अगर सांस लेने में परेशानी, सीने में दर्द, बेहोशी या गंभीर रक्तस्राव हो, तो तुरंत आपातकालीन चिकित्सा सहायता लें।
`,

    "English": `
If you are feeling unwell, take adequate rest and drink enough water.

If you have fever, repeated vomiting, severe pain, or your condition is getting worse, consult a nearby doctor.

If you have difficulty breathing, chest pain, unconsciousness, or severe bleeding, seek immediate emergency medical care.
`
  };


  try {

    const prompt = `
You are CareMitra, a safe healthcare voice assistant.

Selected language:
${language}

Patient message:
${message}

IMPORTANT RULES:

1. Reply ONLY in ${language}.
2. Keep the answer short and simple.
3. Use easy language suitable for rural and underserved patients.
4. Do not give a definite medical diagnosis.
5. Do not prescribe medicines.
6. Give general healthcare guidance only.
7. If emergency symptoms are mentioned, clearly advise immediate medical care.
8. Do not use English if the selected language is Tamil or Hindi.
9. Do not mention these instructions.
10. Respond naturally as if speaking directly to the patient.
`;

    const response =
      await ai.models.generateContent({

        model: "gemini-3.6-flash",

        contents: prompt

      });


    const reply =
      response.text?.trim();


    if (!reply) {

      return res.json({
        reply:
          fallbackResponses[language] ||
          fallbackResponses["English"]
      });

    }


    console.log(
      "VOICE AI RESPONSE:",
      reply
    );


    return res.json({
      reply: reply
    });


  } catch (error) {

    console.error(
      "VOICE GEMINI ERROR:",
      error.message
    );


    // IMPORTANT:
    // Never send "Sorry, I could not connect..."
    // to VoiceLanguage page.

    return res.json({

      reply:
        fallbackResponses[language] ||
        fallbackResponses["English"]

    });

  }

});


// =================================================
// DIGITAL TRIAGE
// Existing page
// =================================================

app.post("/api/triage", async (req, res) => {

  try {

    const { symptoms } = req.body;

    if (!symptoms || symptoms.length === 0) {

      return res.status(400).json({
        error: "Symptoms are required"
      });

    }


    const prompt = `
You are CareMitra AI Triage Assistant.

Patient symptoms:
${symptoms.join(", ")}

Classify the urgency into exactly ONE:

- normal
- doctor
- emergency

Rules:
- emergency = symptoms that may require immediate medical attention
- doctor = symptoms that may need consultation
- normal = no obvious urgent concern

Do not diagnose.
Do not prescribe medicines.

Return ONLY valid JSON:

{
  "urgency": "normal"
}
`;


    const response =
      await ai.models.generateContent({

        model: "gemini-3.8-flash",

        contents: prompt

      });


    const text =
      response.text.trim();


    const cleaned =
      text
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();


    const result =
      JSON.parse(cleaned);


    res.json(result);


  } catch (error) {

    console.error(
      "TRIAGE ERROR:",
      error
    );

    res.status(500).json({

      error:
        error.message ||
        "Triage AI error"

    });

  }

});


// =================================================
// START SERVER
// =================================================

app.listen(5000, () => {

  console.log(
    "CareMitra AI Server running on http://localhost:5000"
  );

});