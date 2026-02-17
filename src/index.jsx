import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Sparkles, Coins, Home, History, Settings, Download, Copy, 
  BookOpen, ChevronDown, CheckCircle2 
} from 'lucide-react';
// استعادة الربط بملفات الخدمة
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
    if (mode === 'curriculum' && (!level || !year || !subject)) {
      alert("يرجى اختيار الطور، السنة، والمادة.");
      return;
    }
    if (mode === 'ocr' && !inputText) {
      alert("يرجى كتابة نص أو لصق درس أولاً.");
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // الربط الفعلي مع خدمة الذكاء الاصطناعي
      const response = await aiService.generateSummary(inputText || `درس ${subject} لعام ${year}`, {
        level: level ? curriculumData[level].label : 'عام',
        subject: subject || 'عام',
        isDetailed: true
      });
      
      setSummary(response);
      setShowResult(true);
      setPoints(prev => prev - 10);
    } catch (error) {
      console.error(error);
      alert("عذراً، حدث خطأ أثناء التلخيص. تأكد من إعداد مفتاح API في Vercel.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white p-4 font-sans" dir="rtl">
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
        <div className="flex bg-[#1e293b] p-1.5 rounded-xl border border-slate-700">
          <button onClick={() => setMode('ocr')} className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${mode === 'ocr' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}>نص حر</button>
          <button onClick={() => setMode('curriculum')} className={`flex-1 py-2.5 rounded-lg font-bold text-sm transition-all ${mode === 'curriculum' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}>المنهاج</button>
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
              <textarea className="w-full h-40 bg-[#0f172a] border border-slate-700 rounded-xl p-4 outline-none resize-none" placeholder="الصق نص الدرس هنا..." value={inputText} onChange={(e) => setInputText(e.target.value)} />
            )}

            <button onClick={handleSummarize} disabled={isProcessing} className="w-full mt-6 bg-emerald-500 hover:bg-emerald-400 py-4 rounded-xl font-black text-lg shadow-lg disabled:opacity-50">
              {isProcessing ? 'جاري التحليل الحقيقي...' : 'ابدأ التلخيص بذكاء ✨'}
            </button>
          </div>
        ) : (
          <div className="bg-[#1e293b] p-6 rounded-3xl border border-emerald-500/30 shadow-2xl animate-in zoom-in-95">
             <div className="flex justify-between items-center mb-4 border-b border-slate-700 pb-4">
                <h3 className="text-emerald-400 font-bold">النتيجة الذكية</h3>
                <div className="flex gap-2">
                   <button onClick={() => navigator.clipboard.writeText(summary?.details)} className="p-2 bg-slate-800 rounded-lg text-slate-400"><Copy size={18}/></button>
                   <button onClick={() => exportToPDF("ملخص", summary?.details)} className="p-2 bg-slate-800 rounded-lg text-slate-400"><Download size={18}/></button>
                </div>
             </div>
             <div className="space-y-4 text-slate-200">
                <div className="bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
                  <p className="font-bold text-emerald-400 mb-1">الفكرة الرئيسية:</p>
                  <p>{summary?.mainIdea}</p>
                </div>
                <div className="whitespace-pre-line">
                  <p className="font-bold text-white mb-1">التفاصيل:</p>
                  {summary?.details}
                </div>
             </div>
             <button onClick={() => setShowResult(false)} className="w-full mt-8 py-3 bg-slate-800 rounded-xl font-bold">تلخيص جديد</button>
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
