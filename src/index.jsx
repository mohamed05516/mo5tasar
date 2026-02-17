import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Sparkles, Coins, Home, History, Settings, Download, Copy, 
  BookOpen, ChevronDown, CheckCircle2 
} from 'lucide-react';
// استيراد الخدمة الحقيقية
import { aiService } from './aiService'; 
import { exportToPDF } from './exportUtils';

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
  const [showResult, setShowResult] = useState(false);
  const [summary, setSummary] = useState(null);
  const [points, setPoints] = useState(100);

  const handleSummarize = async () => {
    // التأكد من المدخلات
    if (mode === 'curriculum' && (!level || !year || !subject)) {
      alert("يرجى اختيار الطور، السنة، والمادة.");
      return;
    }
    if (mode === 'ocr' && !inputText) {
      alert("يرجى كتابة نص أو لصق درس.");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // مناداة الذكاء الاصطناعي فعلياً
      const result = await aiService.generateSummary(inputText || `درس ${subject} لعام ${year}`, { 
        level: level ? curriculumData[level].label : 'عام', 
        subject: subject || 'عام',
        isDetailed: true 
      });
      
      setSummary(result);
      setShowResult(true);
      setPoints(prev => prev - 10);
    } catch (error) {
      console.error(error);
      alert("فشل التلخيص! تأكد من وضع API Key في Vercel.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-4 font-sans" dir="rtl">
      <header className="flex justify-between items-center mb-8 bg-[#1e293b] p-4 rounded-2xl border border-slate-700 shadow-lg">
        <div className="flex items-center gap-2">
          <Sparkles className="text-emerald-400 animate-pulse" />
          <h1 className="text-xl font-bold tracking-tight">مختصر <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-400">ذكاء اصطناعي</span></h1>
        </div>
        <div className="bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 border border-amber-500/20">
          <Coins size={14} /> {points}
        </div>
      </header>

      <main className="max-w-md mx-auto space-y-6">
        <div className="flex bg-[#1e293b] p-1.5 rounded-xl border border-slate-700">
          <button onClick={() => setMode('ocr')} className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${mode === 'ocr' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>نص حر</button>
          <button onClick={() => setMode('curriculum')} className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${mode === 'curriculum' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}>المنهاج</button>
        </div>

        {!showResult ? (
          <div className="bg-[#1e293b] p-5 rounded-3xl border border-slate-700 shadow-xl">
            {mode === 'curriculum' ? (
              <div className="space-y-4">
                <select className="w-full p-4 bg-[#0f172a] rounded-xl border border-slate-700 outline-none font-bold text-slate-300" value={level} onChange={(e) => { setLevel(e.target.value); setYear(''); setSubject(''); }}>
                  <option value="">اختر الطور...</option>
                  <option value="primary">الابتدائي</option>
                  <option value="middle">المتوسط</option>
                  <option value="high">الثانوي</option>
                </select>

                {level && (
                  <select className="w-full p-4 bg-[#0f172a] rounded-xl border border-slate-700 outline-none font-bold text-slate-300 animate-in fade-in" value={year} onChange={(e) => setYear(e.target.value)}>
                    <option value="">اختر السنة...</option>
                    {curriculumData[level].years.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                )}

                {year && (
                  <select className="w-full p-4 bg-[#0f172a] rounded-xl border border-slate-700 outline-none font-bold text-slate-300 animate-in fade-in" value={subject} onChange={(e) => setSubject(e.target.value)}>
                    <option value="">اختر المادة...</option>
                    {curriculumData[level].subjects.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                )}
              </div>
            ) : (
              <textarea className="w-full h-40 bg-[#0f172a] border border-slate-700 rounded-xl p-4 outline-none resize-none focus:border-emerald-500 transition-colors" placeholder="الصق نص الدرس هنا..." value={inputText} onChange={(e) => setInputText(e.target.value)} />
            )}

            <button onClick={handleSummarize} disabled={isProcessing} className="w-full mt-6 bg-emerald-500 hover:bg-emerald-400 text-white py-4 rounded-xl font-black text-lg shadow-lg shadow-emerald-500/20 transition-all active:scale-95 disabled:opacity-50">
              {isProcessing ? 'جاري التلخيص بالذكاء الاصطناعي...' : 'ابدأ التلخيص الآن ✨'}
            </button>
          </div>
        ) : (
          <div className="bg-[#1e293b] p-6 rounded-3xl border border-emerald-500/30 shadow-2xl animate-in zoom-in-95">
             <div className="space-y-6">
                <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20">
                  <h4 className="font-bold text-emerald-400 mb-2 underline text-sm">الفكرة الرئيسية:</h4>
                  <p className="text-white leading-relaxed">{summary?.mainIdea}</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-400 mb-2 text-sm">التفاصيل:</h4>
                  <p className="text-slate-200 leading-relaxed whitespace-pre-line text-sm">{summary?.details}</p>
                </div>
                {summary?.terms && (
                  <div className="bg-amber-500/10 p-4 rounded-2xl border border-amber-500/20">
                    <h4 className="font-bold text-amber-500 mb-2 text-sm text-right">مصطلحات:</h4>
                    <p className="text-slate-300 text-xs">{summary?.terms}</p>
                  </div>
                )}
                <div className="flex gap-2">
                   <button onClick={() => exportToPDF("ملخص مختصر", summary?.details)} className="flex-1 py-3 bg-slate-800 rounded-xl font-bold text-xs flex justify-center items-center gap-2"><Download size={14}/> PDF</button>
                   <button onClick={() => setShowResult(false)} className="flex-[2] py-3 bg-emerald-600 rounded-xl font-bold text-xs">تلخيص جديد</button>
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Mo5tasarApp />);
}
