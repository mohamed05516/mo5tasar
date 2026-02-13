# mo5tasar (مختصر) 📚✨

AI-powered study assistant for Algerian students - تطبيق ذكي لتلخيص الدروس للطلاب الجزائريين

## 🌟 Features | المميزات

### 1. **Smart Summary Modes**
- **📸 OCR Mode**: Upload/capture images and extract text using Tesseract.js
- **📖 Curriculum Search Mode**: Search by Level, Year, and Subject
- **🧠 Smart Recognition**: Automatically detects lesson titles vs full text

### 2. **AI-Powered Summaries**
- Powered by **Groq Llama 3.3 70B**
- Acts as an expert Algerian teacher
- Follows official Algerian Ministry of Education curriculum
- Provides:
  - Main Idea (الفكرة الرئيسية)
  - Key Points (النقاط الأساسية)
  - Expected Exam Question (سؤال متوقع في الامتحان)
  - dzexams Archive Insights (ملاحظات من أرشيف dzexams)

### 3. **Gamification System** 🎮
- Start with **20 free points**
- Each summary costs **5 points**
- Watch ads to earn **+10 points**
- Points stored in localStorage

### 4. **Multi-Format Export** 📥
- **PDF** Export
- **Word (.docx)** Export
- **Image (PNG)** Export

### 5. **Smart Resource Linking** 🔗
- Direct links to dzexams.com based on selection
- Format: `https://www.dzexams.com/ar/[level]/[subject]`

### 6. **Algerian UX** 🇩🇿
- Mobile-first design with Tailwind CSS
- Arabic font (Cairo)
- Algerian-style error messages: "راهم غاشي بزاف، اصبر دقيقة"
- Study tips rotation during processing
- Clear disclaimer about AI-generated content

---

## 🚀 Installation | التثبيت

### Prerequisites
```bash
Node.js >= 16.x
npm or yarn
```

### Step 1: Clone & Install
```bash
# Clone the repository
git clone <your-repo-url>
cd mo5tasar

# Install dependencies
npm install
```

### Step 2: Environment Setup
Create a `.env` file in the root directory:

```env
REACT_APP_GROQ_API_KEY=your_groq_api_key_here
```

**Get your Groq API Key:**
1. Visit: https://console.groq.com/
2. Sign up / Log in
3. Go to API Keys section
4. Create a new API key
5. Copy and paste it in `.env`

### Step 3: Tailwind CSS Setup
Create `tailwind.config.js`:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'cairo': ['Cairo', 'sans-serif'],
        'poppins': ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
```

Create `src/index.css`:

```css
@import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&family=Poppins:wght@900&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

body {
  margin: 0;
  font-family: 'Cairo', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### Step 4: Project Structure
```
mo5tasar/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   └── Mo5tasarApp.jsx    # Main component
│   ├── services/
│   │   ├── aiService.js       # Groq API integration
│   │   └── exportUtils.js     # Export utilities
│   ├── index.css
│   └── index.js
├── .env
├── package.json
├── tailwind.config.js
└── README.md
```

### Step 5: Update `src/index.js`
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Mo5tasarApp from './components/Mo5tasarApp';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Mo5tasarApp />
  </React.StrictMode>
);
```

---

## 🏃 Running the App | تشغيل التطبيق

```bash
# Development mode
npm start

# Build for production
npm run build

# The app will open at http://localhost:3000
```

---

## 📖 Usage Guide | دليل الاستخدام

### For Students | للطلاب

1. **Start with 20 Points** 🎯
   - You begin with 20 free points
   - Each summary costs 5 points

2. **Choose Your Mode** 📱
   - **OCR Mode**: Take a photo or upload an image of your lesson
   - **Curriculum Mode**: Select Level → Year → Subject

3. **Get Your Summary** ✨
   - Wait for AI processing (study tips will appear)
   - Review the summary with exam insights

4. **Export & Study** 📥
   - Download as PDF, Word, or Image
   - Access related exams on dzexams.com

5. **Earn More Points** 🎬
   - Click "مشاهدة إعلان" to watch a 5-second ad
   - Earn +10 points instantly

---

## 🔧 Technical Details | التفاصيل التقنية

### Technologies Used
- **Frontend**: React 18 + Tailwind CSS
- **AI Engine**: Groq (Llama 3.3 70B)
- **OCR**: Tesseract.js (Arabic + English)
- **Export**: jsPDF, docx, html-to-image
- **Icons**: Lucide React
- **Storage**: localStorage

### API Integration

#### Groq API (Llama 3.3)
```javascript
import aiService from './services/aiService';

const summary = await aiService.generateSummary(
  "الانزيمات", // Lesson title or full text
  {
    level: 'high',
    year: '3AS',
    subject: 'العلوم الطبيعية',
    isLessonTitle: true
  }
);
```

#### Response Format
```javascript
{
  "mainIdea": "الفكرة الرئيسية...",
  "keyPoints": ["نقطة 1", "نقطة 2", "نقطة 3", "نقطة 4"],
  "expectedQuestion": {
    "question": "السؤال؟",
    "answer": "الإجابة..."
  },
  "dzexamsInsights": [
    "ملاحظة 1",
    "ملاحظة 2",
    "ملاحظة 3"
  ]
}
```

### Export Functions

```javascript
import { exportToPDF, exportToWord, exportToImage } from './services/exportUtils';

// Export to PDF
await exportToPDF(summaryObject);

// Export to Word
await exportToWord(summaryObject);

// Export to Image
const element = document.getElementById('summary');
await exportToImage(element);
```

---

## 🎨 Customization | التخصيص

### Colors
Edit in your component or Tailwind config:
```javascript
// Primary: Emerald Green (Success/Growth)
className="bg-emerald-500"

// Secondary: Amber/Orange (Points/Rewards)
className="bg-amber-500"

// Accent: Blue (dzexams links)
className="bg-blue-500"
```

### Study Tips
Edit the `studyTips` array in `Mo5tasarApp.jsx`:
```javascript
const studyTips = [
  { icon: <Droplet />, text: 'اشرب الماء', subtext: 'Hydration' },
  // Add more tips...
];
```

---

## 🐛 Troubleshooting | حل المشاكل

### API Rate Limit (429 Error)
**Error**: "راهم غاشي بزاف، اصبر دقيقة"
- **Solution**: Wait 1 minute before trying again
- Groq free tier has rate limits

### OCR Not Working
- Ensure image is clear and well-lit
- Tesseract works best with high-contrast images
- Supports Arabic and English text

### Export Functions Failing
- Check browser console for errors
- Ensure all export libraries are installed:
  ```bash
  npm install jspdf docx html-to-image file-saver
  ```

### Points Not Saving
- Check localStorage in browser DevTools
- Clear cache and reload if needed
- Points are stored as: `mo5tasar_points`

---

## 🚀 Deployment | النشر

### Vercel (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify
```bash
# Build
npm run build

# Upload the 'build' folder to Netlify
```

### Environment Variables
Don't forget to add `REACT_APP_GROQ_API_KEY` in your deployment platform's environment settings!

---

## 📄 License | الترخيص

MIT License - Free to use for educational purposes

---

## 🤝 Contributing | المساهمة

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Submit a pull request

---

## 📞 Support | الدعم

For issues or questions:
- Open a GitHub issue
- Email: support@mo5tasar.com (example)

---

## 🙏 Credits | الشكر

- **Groq**: For providing Llama 3.3 API
- **dzexams.com**: For exam archives inspiration
- **Algerian Students**: The inspiration behind this project

---

Made with ❤️ for Algerian students | صنع بحب للطلاب الجزائريين

**mo5tasar** - مختصر: Your AI study companion 🎓✨
