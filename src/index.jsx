import { createRoot } from 'react-dom/client';
import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, Upload, Download, ExternalLink, BookOpen, Settings, 
  History, Home, Sparkles, Zap, Brain, AlertCircle, CheckCircle2, 
  Coffee, Timer, Droplet, Wind, Trophy, Play, FileText, 
  Image as ImageIcon, Coins, ChevronDown 
} from 'lucide-react';

// --- (Simulated AI Service) وضعنا الخدمة هنا مباشرة لتجنب أخطاء الاستيراد ---
const aiService = {
  async generateSummary(text, context = {}) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      mainIdea: "هذا ملخص تجريبي لمحتوى الدرس: " + text.substring(0, 50) + "...",
      keyPoints: ["نقطة مهمة 1", "نقطة مهمة 2"],
      examQuestions: ["سؤال متوقع 1؟"]
    };
  }
};

export default function Mo5tasarApp() {
  const [mode, setMode] = useState('ocr');
  const [level, setLevel] = useState('');
  const [subject, setSubject] = useState('');
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [summary, setSummary] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [points, setPoints] = useState(20);

  const handleSummarize = async () => {
    if (!inputText && mode === 'ocr') return;
    setIsProcessing(true);
    try {
      const result = await aiService.generateSummary(inputText, { level, subject });
      setSummary(result);
      setShowResult(true);
      setPoints(prev => prev - 5);
    } catch (error) {
      alert("حدث خطأ في الاتصال");
    }
    setIsProcessing(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24" style={{ fontFamily: 'Cairo, sans-serif', direction: 'rtl' }}>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet" />
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500 p-2 rounded-xl"><Sparkles className="text-white w-5 h-5" /></div>
          <h1 className="text-xl font-black text-slate-800">mo5tasar</h1>
        </div>
        <div className="bg-amber-500 text-white px-3 py-1.5 rounded-xl flex items-center gap-2 font-bold">
          <Coins className="w-4 h-4" /> {points}
        </div>
      </header>

      <main className="px-4 pt-6 max-w-2xl mx-auto text-right">
        {!showResult ? (
          <div className="space-y-6">
            <div className="bg-white p-1 rounded-2xl shadow-sm border flex gap-1">
              <button onClick={() => setMode('ocr')} className={`flex-1 py-3 rounded-xl font-bold ${mode === 'ocr' ? 'bg-emerald-500 text-white' : 'text-slate-500'}`}>نص حر</button>
              <button onClick={() => setMode('curriculum')} className={`flex-1 py-3 rounded-xl font-bold ${mode === 'curriculum' ? 'bg-emerald-500 text-white' : 'text-slate-500'}`}>المنهاج</button>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
              <textarea 
                className="w-full h-40 p-4 bg-slate-50 rounded-2xl border-none outline-none resize-none text-right"
                placeholder="اكتب هنا أو الصق النص..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <button 
                onClick={handleSummarize}
                disabled={isProcessing}
                className="w-full mt-4 bg-emerald-500 text-white py-4 rounded-2xl font-black shadow-lg"
              >
                {isProcessing ? 'جاري التلخيص...' : 'ابدأ التلخيص ✨'}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-emerald-100 animate-fadeIn">
            <h3 className="text-emerald-600 font-black mb-4 flex items-center gap-2">💡 الملخص</h3>
            <p className="text-slate-700 leading-relaxed mb-6">{summary?.mainIdea}</p>
            <button onClick={() => setShowResult(false)} className="w-full bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl">تلخيص آخر</button>
          </div>
        )}
      </main>

      {/* Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t p-3 flex justify-around shadow-2xl">
        <button onClick={() => setActiveTab('history')} className={`flex flex-col items-center ${activeTab === 'history' ? 'text-emerald-600' : 'text-slate-400'}`}><History /><span className="text-[10px]">السجل</span></button>
        <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center ${activeTab === 'home' ? 'text-emerald-600' : 'text-slate-400'}`}><Home /><span className="text-[10px]">الرئيسية</span></button>
        <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center ${activeTab === 'settings' ? 'text-emerald-600' : 'text-slate-400'}`}><Settings /><span className="text-[10px]">الإعدادات</span></button>
      </nav>
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Mo5tasarApp />);
}
