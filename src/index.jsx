import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Sparkles, Coins, Home, History, Settings, Download, Copy } from 'lucide-react';
// تأكد أن هذه الملفات موجودة، وإلا سيعطيك خطأ
import { aiService } from './aiService'; 
import { exportToPDF } from './exportUtils'; 

const curriculumData = {
  primary: {
    label: 'الابتدائي',
    years: ['الأولى', 'الثانية', 'الثالثة', 'الرابعة', 'الخامسة'],
    subjects: ['لغة عربية', 'رياضيات', 'تربية إسلامية']
  },
  middle: {
    label: 'المتوسط',
    years: ['الأولى', 'الثانية', 'الثالثة', 'الرابعة'],
    subjects: ['رياضيات', 'فيزياء', 'علوم', 'عربية', 'تاريخ']
  },
  high: {
    label: 'الثانوي',
    years: ['الأولى', 'الثانية', 'الثالثة'],
    subjects: ['رياضيات', 'فيزياء', 'علوم', 'فلسفة']
  }
};

export default function Mo5tasarApp() {
  const [mode, setMode] = useState('ocr');
  const [level, setLevel] = useState('');
  const [year, setYear] = useState('');
  const [subject, setSubject] = useState('');
  const [inputText, setInputText] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resultText, setResultText] = useState('');

  const handleStart = async () => {
    setLoading(true);
    // محاكاة للذكاء الاصطناعي لتجربة الواجهة
    setTimeout(() => {
        setResultText("هذا نص تجريبي للتلخيص. قم بربط الـ API ليعمل بشكل حقيقي.");
        setShowResult(true);
        setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 font-sans" dir="rtl">
      {/* Header */}
      <header className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-emerald-500 flex items-center gap-2">
          <Sparkles /> مختصر
        </h1>
        <div className="bg-amber-500/20 text-amber-500 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1">
          <Coins size={14} /> 100
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto space-y-4">
        {!showResult ? (
          <>
            <div className="flex bg-slate-900 p-1 rounded-xl">
              <button onClick={() => setMode('ocr')} className={`flex-1 py-2 rounded-lg ${mode === 'ocr' ? 'bg-emerald-600' : 'text-slate-400'}`}>نص حر</button>
              <button onClick={() => setMode('curriculum')} className={`flex-1 py-2 rounded-lg ${mode === 'curriculum' ? 'bg-emerald-600' : 'text-slate-400'}`}>منهاج</button>
            </div>

            <div className="bg-slate-900 p-4 rounded-2xl border border-slate-800">
              {mode === 'curriculum' ? (
                <div className="space-y-3">
                  <select className="w-full p-3 bg-slate-800 rounded-xl" onChange={(e) => {setLevel(e.target.value); setYear('');}}>
                    <option value="">اختر الطور</option>
                    <option value="primary">الابتدائي</option>
                    <option value="middle">المتوسط</option>
                    <option value="high">الثانوي</option>
                  </select>
                  
                  {level && (
                    <select className="w-full p-3 bg-slate-800 rounded-xl" onChange={(e) => setYear(e.target.value)}>
                      <option value="">اختر السنة</option>
                      {curriculumData[level].years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  )}

                  {year && (
                    <select className="w-full p-3 bg-slate-800 rounded-xl" onChange={(e) => setSubject(e.target.value)}>
                      <option value="">اختر المادة</option>
                      {curriculumData[level].subjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  )}
                </div>
              ) : (
                <textarea 
                  className="w-full h-32 bg-transparent resize-none outline-none" 
                  placeholder="ضع النص هنا..."
                  onChange={(e) => setInputText(e.target.value)}
                />
              )}
              
              <button 
                onClick={handleStart}
                disabled={loading}
                className="w-full mt-4 bg-emerald-500 py-3 rounded-xl font-bold hover:bg-emerald-400 transition-all"
              >
                {loading ? 'جاري التلخيص...' : 'بدء التلخيص'}
              </button>
            </div>
          </>
        ) : (
          <div className="bg-slate-900 p-5 rounded-2xl border border-emerald-500/30">
            <h3 className="text-emerald-400 font-bold mb-2">النتيجة:</h3>
            <p className="text-slate-300 mb-4">{resultText}</p>
            <button onClick={() => setShowResult(false)} className="w-full py-2 bg-slate-800 rounded-xl">عودة</button>
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
