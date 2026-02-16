import { createRoot } from 'react-dom/client';
import React, { useState, useEffect } from 'react';
import { 
  Sparkles, Coins, History, Home, Settings, Download, Copy, Share2, Sparkle
} from 'lucide-react';
// استيراد الخدمات - تأكد أن هذه الملفات موجودة في مجلد src
import { aiService } from './aiService';
import { exportToPDF } from './exportUtils';

// --- قاعدة بيانات المناهج (تم التأكد من سلامة الأقواس) ---
const curriculumData = {
  primary: {
    label: 'الابتدائي',
    years: ['الأولى ابتدائي', 'الثانية ابتدائي', 'الثالثة ابتدائي', 'الرابعة ابتدائي', 'الخامسة ابتدائي'],
    subjects: ['اللغة العربية', 'الرياضيات', 'التربية الإسلامية', 'اللغة الفرنسية']
  },
  middle: {
    label: 'المتوسط',
    years: ['الأولى متوسط', 'الثانية متوسط', 'الثالثة متوسط', 'الرابعة متوسط'],
    subjects: ['الرياضيات', 'الفيزياء', 'العلوم الطبيعية', 'اللغة العربية', 'التاريخ والجغرافيا']
  },
  high: {
    label: 'الثانوي',
    years: ['الأولى ثانوي', 'الثانية ثانوي', 'الثالثة ثانوي'],
    subjects: ['الرياضيات', 'الفيزياء', 'العلوم الطبيعية', 'الفلسفة', 'اللغة الإنجليزية', 'الأدب العربي']
  }
};

export default function Mo5tasarApp() {
  const [mode, setMode] = useState('ocr');
  const [level, setLevel] = useState('');
  const [year, setYear] = useState('');
  const [subject, setSubject] = useState('');
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDetailed, setIsDetailed] = useState(true);
  const [showResult, setShowResult] = useState(false);
  const [summary, setSummary] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [points, setPoints] = useState(100);

  const handleSummarize = async () => {
    if (mode === 'curriculum' && (!level || !year || !subject)) {
      alert('يرجى إكمال اختيارات المنهاج أولاً');
      return;
    }
    if (!inputText && mode === 'ocr') {
      alert('يرجى كتابة النص المراد تلخيصه');
      return;
    }

    setIsProcessing(true);
    try {
      // إرسال البيانات للخدمة
      const result = await aiService.generateSummary(inputText || `تلخيص لدرس ${subject} - ${year}`, { 
        level: level ? curriculumData[level].label : 'عام', 
        subject: subject || 'عام',
        isDetailed 
      });
      setSummary(result);
      setShowResult(true);
      setPoints(prev => prev - 10);
    } catch (error) {
      console.error(error);
      alert('خطأ في الاتصال بالذكاء الاصطناعي. تأكد من إعداد API Key');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-white p-4 pb-24" dir="rtl" style={{ fontFamily: 'Cairo, sans-serif' }}>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet" />
      
      {/* Header */}
      <header className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <Sparkles className="text-emerald-500" />
          <h1 className="text-2xl font-black">مختصر</h1>
        </div>
        <div className="bg-amber-500/20 text-amber-500 px-4 py-1 rounded-full border border-amber-500/30 flex items-center gap-2">
          <Coins size={16} /> {points}
        </div>
      </header>

      <main className="max-w-xl mx-auto space-y-6">
        {/* Toggle Mode */}
        <div className="bg-slate-900 p-1 rounded-2xl flex border border-slate-800">
          <button onClick={() => setMode('ocr')} className={`flex-1 py-3 rounded-xl font-bold transition-all ${mode === 'ocr' ? 'bg-emerald-500 text-white' : 'text-slate-500'}`}>نص حر</button>
          <button onClick={() => setMode('curriculum')} className={`flex-1 py-3 rounded-xl font-bold transition-all ${mode === 'curriculum' ? 'bg-emerald-500 text-white' : 'text-slate-500'}`}>المنهاج</button>
        </div>

        {!showResult ? (
          <div className="bg-slate-900 p-6 rounded-[32px] border border-slate-800 shadow-2xl">
            {mode === 'ocr' ? (
              <textarea 
                className="w-full h-48 bg-transparent border-none outline-none text-lg resize-none"
                placeholder="الصق درسك هنا..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            ) : (
              <div className="space-y-4 py-4">
                <select className="w-full p-4 bg-slate-800 rounded-2xl border border-slate-700 outline-none" value={level} onChange={(e) => { setLevel(e.target.value); setYear(''); setSubject(''); }}>
                  <option value="">اختر الطور</option>
                  <option value="primary">الابتدائي</option>
                  <option value="middle">المتوسط</option>
                  <option value="high">الثانوي</option>
                </select>

                {level && (
                  <select className="w-full p-4 bg-slate-800 rounded-2xl border border-slate-700 outline-none" value={year} onChange={(e) => setYear(e.target.value)}>
                    <option value="">اختر السنة</option>
                    {curriculumData[level].years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                )}

                {year && (
                  <select className="w-full p-4 bg-slate-800 rounded-2xl border border-slate-700 outline-none" value={subject} onChange={(e) => setSubject(e.target.value)}>
                    <option value="">اختر المادة</option>
                    {curriculumData[level].subjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                )}
              </div>
            )}

            <button onClick={() => setIsDetailed(!isDetailed)} className="w-full mb-4 text-xs font-bold text-slate-500 text-center">
              نوع التلخيص: <span className="text-emerald-500">{isDetailed ? 'مفصل' : 'موجز'}</span> (اضغط للتغيير)
            </button>

            <button 
              onClick={handleSummarize} 
              disabled={isProcessing}
              className="w-full bg-emerald-500 hover:bg-emerald-400 py-5 rounded-2xl font-black text-xl shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
            >
              {isProcessing ? 'جاري العمل...' : 'ابدأ التلخيص ✨'}
            </button>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4">
            <div className="bg-slate-900 p-6 rounded-[32px] border border-emerald-500/30">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-emerald-500 font-bold">ملخص {subject || 'الدرس'}</h3>
                  <button onClick={() => exportToPDF("ملخص", summary?.details)} className="p-2 bg-slate-800 rounded-xl"><Download size={20}/></button>
               </div>
               <div className="space-y-4">
                  <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20">
                    <p className="font-bold text-emerald-400 underline mb-2">الفكرة الرئيسية:</p>
                    <p>{summary?.mainIdea}</p>
                  </div>
                  <div className="text-slate-300 leading-relaxed whitespace-pre-line">
                    <p className="font-bold text-white mb-2">التفاصيل:</p>
                    {summary?.details}
                  </div>
               </div>
               <button onClick={() => setShowResult(false)} className="w-full mt-8 py-4 border border-slate-700 rounded-2xl font-bold">تلخيص جديد</button>
            </div>
          </div>
        )}
      </main>

      {/* Footer Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-900/80 backdrop-blur-lg border-t border-slate-800 px-8 py-4 flex justify-around">
        <Home className={activeTab === 'home' ? 'text-emerald-500' : 'text-slate-500'} onClick={() => setActiveTab('home')} />
        <History className={activeTab === 'history' ? 'text-emerald-500' : 'text-slate-500'} onClick={() => setActiveTab('history')} />
        <Settings className={activeTab === 'settings' ? 'text-emerald-500' : 'text-slate-500'} onClick={() => setActiveTab('settings')} />
      </nav>
    </div>
  );
}
// استبدل الجزء الأخير في الملف بهذا الكود
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <Mo5tasarApp />
    </React.StrictMode>
  );
} else {
  console.error("Failed to find the root element");
}
