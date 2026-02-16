// aiService.js - معالجة طلبات الذكاء الاصطناعي
const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY;

export const aiService = {
  generateSummary: async (text, options) => {
    const { level, subject, isDetailed = true } = options;

    // بناء الأوامر (Prompt) بناءً على المدخلات
    const systemPrompt = `أنت مساعد تعليمي خبير في المنهج الدراسي. 
    قم بتلخيص النص التالي لمادة "${subject}" للمستوى "${level}".
    ${isDetailed ? 
      'المطلوب: تلخيص مفصل، يشمل الفكرة الرئيسية، النقاط الفرعية، شرح المصطلحات، وخاتمة.' : 
      'المطلوب: تلخيص موجز جداً (الزبدة) في نقاط بسيطة.'}
    يجب أن يكون الرد بتنسيق JSON يحتوي على الحقول التالية فقط:
    { "mainIdea": "...", "details": "...", "terms": "..." }`;

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama3-70b-8192",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: text }
          ],
          response_format: { type: "json_object" }
        })
      });

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error("AI Error:", error);
      throw error;
    }
  }
};
