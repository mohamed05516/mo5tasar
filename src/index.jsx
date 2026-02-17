import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Sparkles, Coins, Home, History, Settings, Download, Copy, 
  BookOpen, ChevronDown, CheckCircle2 
} from 'lucide-react';

// --- قاعدة بيانات المناهج (مدمجة هنا لمنع أخطاء الاستيراد) ---
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
  const [mode, setMode] = useState('ocr'); // ocr or curriculum
  const [level, setLevel] = useState('');
  const [year, setYear] = useState('');
  const [subject, setSubject] = useState('');
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resultText, setResultText] = useState('');
  const [points, setPoints] = useState(100);

  // دالة وهمية للمحاكاة (لضمان عمل التطبيق بدون API Key مؤقتاً)
  const handleSummarize = () => {
    // التحقق من المدخلات
    if (mode === 'curriculum' && (!level || !year || !subject)) {
      alert("يرجى اختيار الطور، السنة، والمادة.");
      return;
    }
    
    setIsProcessing(true);
    
    // محاكاة تأخير الذكاء الاصطناعي
    setTimeout(() => {
      setResultText(`هذا ملخص تجريبي لمادة ${subject || 'عام'} (${year || ''}). \n\nالفكرة الرئيسية: يعتمد هذا الدرس على فهم الأساسيات.\n\nالتفاصيل:\n1. النقطة الأولى مهمة جداً.\n2. النقطة الثانية تشرح المفهوم.\n3. الخاتمة توضح النتائج.`);
      setShowResult(true);
      setIsProcessing(false);
      setPoints(prev => prev - 10);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-4 font-sans" dir="rtl">
      {/* Header */}
      <header className="flex justify-between items-center mb-8 bg-[#1e293b] p-4 rounded-2xl border border-slate-700">
        <div className="flex items-center gap-2">
          <Sparkles className="text-emerald-400" />
          <h1 className="text-xl font-bold">مختصر</h1>
        </div>
        <div className="bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 border border-amber-500/20">
          <Coins size={14} /> {points}
        </div>
      </header>

      <main className="max-w-md mx-auto space-y-6">
        {/* Toggle Buttons */}
        <div className="flex bg-[#1e293b] p-1.5 rounded-xl border border-slate-700">
          <button 
            onClick={() => setMode('ocr')} 
            className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${mode === 'ocr' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            نص حر
          </button>
          <button 
            onClick={() => setMode('curriculum')} 
            className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${mode === 'curriculum' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
          >
            المنهاج
          </button>
        </div>

        {!showResult ? (
          <div className="bg-[#1e293b] p-5 rounded-3xl border border-slate-700 shadow-xl">
            {mode === 'curriculum' ? (
              <div className="space-y-4">
                {/* 1. Level Select */}
                <div className="space-y-2">
                  <label className="text-xs text-slate-400 font-bold mr-1">الطور الدراسي</label>
                  <div className="relative">
                    <select 
                      className="w-full p-4 bg-[#0f172a] rounded-xl border border-slate-700 outline-none appearance-none font-bold text-slate-300 focus:border-emerald-500 transition-colors"
                      value={level}
                      onChange={(e) => { setLevel(e.target.value); setYear(''); setSubject(''); }}
                    >
                      <option value="">اختر الطور...</option>
                      <option value="primary">الابتدائي</option>
                      <option value="middle">المتوسط</option>
                      <option value="high">الثانوي</option>
                    </select>
                    <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={20} />
                  </div>
                </div>

                {/* 2. Year Select (Dynamic) */}
                {level && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <label className="text-xs text-slate-400 font-bold mr-1">السنة الدراسية</label>
                    <div className="relative">
                      <select 
                        className="w-full p-4 bg-[#0f172a] rounded-xl border border-slate-700 outline-none appearance-none font-bold text-slate-300 focus:border-emerald-500 transition-colors"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                      >
                        <option value="">اختر السنة...</option>
                        {curriculumData[level].years.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                      <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={20} />
                    </div>
                  </div>
                )}

                {/* 3. Subject Select (Dynamic) */}
                {year && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
                    <label className="text-xs text-slate-400 font-bold mr-1">المادة</label>
                    <div className="relative">
                      <select 
                        className="w-full p-4 bg-[#0f172a] rounded-xl border border-slate-700 outline-none appearance-none font-bold text-slate-300 focus:border-emerald-500 transition-colors"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                      >
                        <option value="">اختر المادة...</option>
                        {curriculumData[level].subjects.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={20} />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <textarea 
                className="w-full h-40 bg-[#0f172a] border border-slate-700 rounded-xl p-4 outline-none resize-none focus:border-emerald-500 transition-colors"
                placeholder="الصق نص الدرس هنا..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
            )}

            <button 
              onClick={handleSummarize}
              disabled={isProcessing}
              className="w-full mt-6 bg-emerald-500 hover:bg-emerald-400 text-white py-4 rounded-xl font-black text-lg shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
            >
              {isProcessing ? 'جاري التحليل...' : 'ابدأ التلخيص ✨'}
            </button>
          </div>
        ) : (
          <div className="bg-[#1e293b] p-6 rounded-3xl border border-emerald-500/30 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-4">
              <h3 className="text-emerald-400 font-bold flex items-center gap-2"><CheckCircle2 size={18}/> النتيجة</h3>
              <div className="flex gap-2">
                 <button className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white"><Copy size={18}/></button>
                 <button className="p-2 bg-slate-800 rounded-lg text-slate-400 hover:text-white"><Download size={18}/></button>
              </div>
            </div>
            <p className="text-slate-300 leading-relaxed whitespace-pre-line mb-6">
              {resultText}
            </p>
            <button 
              onClick={() => setShowResult(false)}
              className="w-full py-3 bg-slate-800 rounded-xl font-bold text-slate-300 hover:bg-slate-700 transition-colors"
            >
              تلخيص جديد
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

// Render Logic
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Mo5tasarApp />);
}
