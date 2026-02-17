export const aiService = {
  async generateSummary(text, options = {}) {
    const apiKey = process.env.REACT_APP_GROQ_API_KEY;

    if (!apiKey) {
      throw new Error("API Key is missing. Please add it to Vercel environment variables.");
    }

    const { level = 'عام', subject = 'عام', isDetailed = true } = options;

    // البرومبت المطور بناءً على نقاشنا
    const prompt = `
      أنت "مختصر"، خبير تعليمي متخصص في المنهج الدراسي الجزائري لمستوى (${level}) في مادة (${subject}).
      
      لديك مهمتان أساسيتان بناءً على نوع المدخلات:
      1. إذا كان المدخل "عنوان درس" فقط: قم بتوليد تلخيص شامل ودقيق من قاعدتك المعرفية يغطي هذا الدرس وفق البرنامج الوزاري الجزائري.
      2. إذا كان المدخل "نص مكسر" أو به أخطاء إملائية: فاعتبره نصاً مستخرجاً من صورة بخط يد سيئ؛ قم بترميم المعنى منطقياً وفهم السياق قبل التلخيص.

      هيكلة الرد المطلوب (JSON حصراً):
      {
        "mainIdea": "تمهيد يربط الدرس بالوحدة الدراسية في سطر واحد",
        "details": "شرح العناصر الكبرى للنقاط بأسلوب تعليمي منظم (استخدم • للنقاط و \\n للسطر الجديد)",
        "terms": "أهم 3 مصطلحات باللغة العربية مع مرادفها بالفرنسية (خاصة في المواد العلمية) وتفسيرها",
        "examTip": "نصيحة ذهبية للطالب حول نقطة تتكرر في الامتحانات لهذا الدرس"
      }

      القواعد الذهبية:
      - إذا لخصت من "عنوان فقط"، ابدأ الفقرة بعبارة (ملخص تم توليده آلياً بناءً على العنوان).
      - في المواد العلمية (علوم، فيزياء، رياضيات)، يجب إدراج المصطلحات بالفرنسية بجانب العربية.
      - اجعل الأسلوب مبسطاً جداً إذا كان الطور ابتدائي، وأكثر عمقاً إذا كان ثانوي.

      المدخلات (نص أو عنوان):
      ${text}
    `;

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { 
              role: "system", 
              content: "أنت مساعد تربوي محترف ترد دائماً بصيغة JSON منظمة وفق المنهج الدراسي الجزائري." 
            },
            { role: "user", content: prompt }
          ],
          temperature: 0.6, // توازن بين الإبداع والدقة
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) throw new Error("فشل الاتصال بالخادم");

      const data = await response.json();
      return JSON.parse(data.choices[0].message.content);
    } catch (error) {
      console.error("AI Error:", error);
      throw error;
    }
  }
};
