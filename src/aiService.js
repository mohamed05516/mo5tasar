// aiService.js - Groq API Integration for mo5tasar
// This service acts as an expert Algerian teacher using Llama 3.3

const GROQ_API_KEY = process.env.REACT_APP_GROQ_API_KEY || 'YOUR_GROQ_API_KEY';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

/**
 * Main AI Service for generating educational summaries
 * Optimized for Algerian curriculum with dzexams insights
 */
class AIService {
  constructor() {
    this.model = 'llama-3.3-70b-versatile'; // Groq's Llama 3.3
    this.temperature = 0.7;
    this.maxTokens = 2000;
  }

  /**
   * Generate a comprehensive summary with exam insights
   * @param {string} text - The input text or lesson title
   * @param {Object} context - Additional context (level, year, subject, etc.)
   * @returns {Promise<Object>} Summary object with all sections
   */
  async generateSummary(text, context = {}) {
    const { level, year, subject, isLessonTitle } = context;

    // Build the expert teacher prompt
    const systemPrompt = this._buildSystemPrompt();
    const userPrompt = this._buildUserPrompt(text, context);

    try {
      const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GROQ_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: this.temperature,
          max_tokens: this.maxTokens,
          top_p: 1,
          stream: false
        })
      });

      if (response.status === 429) {
        const error = new Error('Rate limit exceeded');
        error.status = 429;
        throw error;
      }

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content;

      if (!aiResponse) {
        throw new Error('Empty response from AI');
      }

      // Parse the structured response
      return this._parseAIResponse(aiResponse);

    } catch (error) {
      console.error('AI Service Error:', error);
      
      // Re-throw rate limit errors with status
      if (error.status === 429) {
        throw error;
      }

      // For other errors, throw a generic error
      throw new Error('فشل في توليد التلخيص. حاول مرة أخرى.');
    }
  }

  /**
   * Build the system prompt that defines the AI's role
   * @private
   */
  _buildSystemPrompt() {
    return `أنت مدرس جزائري خبير ومتخصص في المناهج التعليمية الجزائرية.

مهمتك:
1. تقديم تلخيصات دقيقة ومركزة بناءً على المنهاج الجزائري الرسمي من وزارة التربية الوطنية
2. استخدام لغة عربية فصيحة وواضحة مناسبة لمستوى الطلاب
3. التركيز على النقاط الأساسية التي تظهر في الامتحانات
4. تقديم أسئلة متوقعة مع إجابات نموذجية
5. الاستفادة من أرشيف dzexams.com لتحديد الأسئلة الأكثر تكراراً

معايير الجودة:
- الدقة العلمية حسب المنهاج الجزائري
- الوضوح والتنظيم
- التركيز على ما هو مهم للامتحانات
- إضافة رؤى من تجربة الامتحانات السابقة

يجب أن يكون الرد بصيغة JSON كالتالي:
{
  "mainIdea": "الفكرة الرئيسية للدرس بشكل مختصر",
  "keyPoints": [
    "النقطة الأولى",
    "النقطة الثانية",
    "النقطة الثالثة",
    "النقطة الرابعة"
  ],
  "expectedQuestion": {
    "question": "سؤال متوقع في الامتحان",
    "answer": "إجابة نموذجية مفصلة"
  },
  "dzexamsInsights": [
    "ملاحظة من dzexams - السؤال الأكثر تكراراً",
    "ملاحظة من dzexams - سؤال شائع آخر",
    "ملاحظة من dzexams - نقطة مهمة للامتحان"
  ]
}`;
  }

  /**
   * Build the user prompt with context
   * @private
   */
  _buildUserPrompt(text, context) {
    const { level, year, subject, isLessonTitle } = context;

    let prompt = '';

    // Add context information
    if (level || year || subject) {
      prompt += `المعلومات:\n`;
      if (level) prompt += `- المستوى: ${this._translateLevel(level)}\n`;
      if (year) prompt += `- السنة: ${year}\n`;
      if (subject) prompt += `- المادة: ${subject}\n`;
      prompt += '\n';
    }

    // Handle lesson title vs full text
    if (isLessonTitle) {
      prompt += `عنوان الدرس: "${text}"\n\n`;
      prompt += `قدم تلخيصاً كاملاً لهذا الدرس بناءً على المنهاج الجزائري الرسمي.`;
    } else {
      prompt += `النص المطلوب تلخيصه:\n\n${text}\n\n`;
      prompt += `قدم تلخيصاً مركزاً لهذا النص مع التركيز على النقاط الأساسية.`;
    }

    prompt += `\n\nاحرص على تضمين سؤال متوقع في الامتحان مع إجابة نموذجية، و3 ملاحظات من أرشيف dzexams.`;

    return prompt;
  }

  /**
   * Parse the AI's JSON response
   * @private
   */
  _parseAIResponse(responseText) {
    try {
      // Try to extract JSON from the response
      // Sometimes the AI adds markdown formatting
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      // Validate required fields
      if (!parsed.mainIdea || !parsed.keyPoints || !parsed.expectedQuestion || !parsed.dzexamsInsights) {
        throw new Error('Missing required fields in response');
      }

      // Ensure keyPoints is an array with at least 3 items
      if (!Array.isArray(parsed.keyPoints) || parsed.keyPoints.length < 3) {
        throw new Error('Invalid keyPoints format');
      }

      // Ensure dzexamsInsights is an array with 3 items
      if (!Array.isArray(parsed.dzexamsInsights) || parsed.dzexamsInsights.length !== 3) {
        throw new Error('Invalid dzexamsInsights format');
      }

      // Ensure expectedQuestion has both question and answer
      if (!parsed.expectedQuestion.question || !parsed.expectedQuestion.answer) {
        throw new Error('Invalid expectedQuestion format');
      }

      return parsed;

    } catch (error) {
      console.error('Parse Error:', error);
      
      // Return a fallback response
      return this._getFallbackResponse();
    }
  }

  /**
   * Translate level codes to Arabic
   * @private
   */
  _translateLevel(level) {
    const translations = {
      'primary': 'الابتدائي',
      'middle': 'المتوسط',
      'high': 'الثانوي',
      'university': 'الجامعة'
    };
    return translations[level] || level;
  }

  /**
   * Fallback response in case of parsing errors
   * @private
   */
  _getFallbackResponse() {
    return {
      mainIdea: "تم تلخيص المحتوى بنجاح. يرجى مراجعة كتابك المدرسي للحصول على تفاصيل أكثر دقة.",
      keyPoints: [
        "النقطة الأولى من الدرس",
        "النقطة الثانية المهمة",
        "النقطة الثالثة الأساسية",
        "ملخص النقاط الإضافية"
      ],
      expectedQuestion: {
        question: "ما هي النقاط الأساسية في هذا الدرس؟",
        answer: "النقاط الأساسية تشمل المفاهيم الرئيسية والتطبيقات العملية حسب المنهاج الجزائري."
      },
      dzexamsInsights: [
        "راجع الأسئلة السابقة في dzexams.com",
        "ركز على الأمثلة والتمارين التطبيقية",
        "هذا الموضوع يظهر بشكل متكرر في الامتحانات"
      ]
    };
  }

  /**
   * Validate API configuration
   */
  validateConfig() {
    if (!GROQ_API_KEY || GROQ_API_KEY === 'YOUR_GROQ_API_KEY') {
      console.warn('⚠️ Groq API key not configured. Using fallback responses.');
      return false;
    }
    return true;
  }
}

// Export singleton instance
const aiService = new AIService();

export default aiService;

// Example usage:
/*
import aiService from './aiService';

// For OCR text
const summary1 = await aiService.generateSummary(
  "النص المستخرج من الصورة...",
  {
    level: 'middle',
    year: '4AM',
    subject: 'العلوم الطبيعية',
    isLessonTitle: false
  }
);

// For lesson title
const summary2 = await aiService.generateSummary(
  "الانزيمات",
  {
    level: 'high',
    year: '3AS',
    subject: 'العلوم الطبيعية',
    isLessonTitle: true
  }
);
*/
