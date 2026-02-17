import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Sparkles, Coins, Home, History, Settings, Download, Copy, 
  BookOpen, ChevronDown, CheckCircle2, AlertTriangle, Lightbulb
} from 'lucide-react';

// --- منطق الذكاء الاصطناعي (البرومبت المطور مدمج هنا) ---
const generateAISummary = async (text, level, subject) => {
  const apiKey = process.env.REACT_APP_GROQ_API_KEY;
  if (!apiKey) throw new Error("Missing API Key");

  const prompt = `
    أنت "مختصر"، خبير تعليمي متخصص في المنهج الدراسي الجزائري لمستوى (${level}) في مادة (${subject}).
    
    المهام:
    1. إذا كان المدخل "عنوان درس" فقط: ولد تلخيصاً شاملاً من معرفتك بالمنهج الجزائري.
    2. إذا كان النص مكسراً (خط سيئ): قم بترميم المعنى قبل التلخيص.

    الرد JSON حصراً:
    {
      "mainIdea": "تمهيد يربط الدرس بالوحدة الدراسية",
      "details": "شرح العناصر (استخدم • للنقاط و \\n للسطر الجديد)",
      "terms": "المصطلحات بالعربية والفرنسية ومعانيها",
      "examTip": "نصيحة ذهبية لنقطة تتكرر في الامتحانات"
    }

    المدخل: ${text}
  `;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" }
    })
  });
  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
};

// --- المكون الرئيسي للتطبيق ---
export default function Mo5tasarApp() {
  const [mode, setMode] = useState('ocr');
  const [level, setLevel] = useState('');
  const [year, setYear] = useState('');
  const [subject, setSubject] = useState('');
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [summary, setSummary] = useState(null);

  const handleSummarize = async () => {
    if (mode === 'curriculum' && (!level || !year || !subject)) return alert("أكمل الاختيارات أولاً");
    setIsProcessing(true);
    try {
      const result = await generateAISummary(inputText || `درس ${subject}`, level, subject);
      setSummary(result);
      setShowResult(true);
    } catch (e) {
      alert("خطأ! تأكد من وضع الـ API Key في Vercel");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white p-4 font-sans" dir="rtl">
      <header className="flex justify-between items-center mb-6 bg-[#161b2c] p-4 rounded-2xl border border-slate-800 shadow-xl">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500 p-1.5 rounded-lg shadow-lg shadow-emerald-500/20">
            <Sparkles size={20} className="text-white" />
          </div>
          <h1 className="text-xl font-black tracking-tight">مختصر</h1>
        </div>
        <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-500 px-3 py-1 rounded-full border border-amber-500/20 font-bold">
          <Coins size={14} /> 20
        </div>
      </header>

      <main className="max-w-md mx-auto space-y-6">
        {!showResult ? (
          <div className="bg-[#161b2c] p-6 rounded-[2.5rem] border border-slate-800 shadow-2xl space-y-5">
            <div className="flex bg-[#0b0f1a] p-1 rounded-2xl border border-slate-800">
              <button onClick={() => setMode('ocr')} className={`flex-1 py-3 rounded-xl font-bold transition-all ${mode === 'ocr' ? 'bg-emerald-600 shadow-lg' : 'text-slate-500'}`}>نص / صورة</button>
              <button onClick={() => setMode('curriculum')} className={`flex-1 py-3 rounded-xl font-bold transition-all ${mode === 'curriculum' ? 'bg-emerald-600 shadow-lg' : 'text-slate-500'}`}>المنهاج</button>
            </div>

            {mode === 'curriculum' ? (
               <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                  <select className="w-full p-4 bg-[#0b0f1a] rounded-2xl border border-slate-800 outline-none focus:border-emerald-500 transition-all font-bold" onChange={(e) => setLevel(e.target.value)}>
                    <option value="">اختر الطور</option>
                    <option value="ابتدائي">الابتدائي</option>
                    <option value="متوسط">المتوسط</option>
                    <option value="ثانوي">الثانوي</option>
                  </select>
                  {level && (
                    <select className="w-full p-4 bg-[#0b0f1a] rounded-2xl border border-slate-800 outline-none focus:border-emerald-500 transition-all font-bold" onChange={(e) => setYear(e.target.value)}>
                      <option value="">اختر السنة</option>
                      <option value="1">السنة الأولى</option>
                      <option value="2">السنة الثانية</option>
                      <option value="3">السنة الثالثة</option>
                      <option value="4">السنة الرابعة</option>
                    </select>
                  )}
                  {year && (
                    <input className="w-full p-4 bg-[#0b0f1a] rounded-2xl border border-slate-800 outline-none focus:border-emerald-500" placeholder="اسم المادة أو عنوان الدرس" onChange={(e) => setSubject(e.target.value)} />
                  )}
               </div>
            ) : (
              <textarea className="w-full h-44 bg-[#0b0f1a] rounded-2xl p-4 border border-slate-800 outline-none focus:border-emerald-500 resize-none" placeholder="ضع نص الدرس هنا (حتى لو كان مكسراً)..." value={inputText} onChange={(e) => setInputText(e.target.value)} />
            )}

            <button onClick={handleSummarize} disabled={isProcessing} className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-2xl font-black text-lg shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
              {isProcessing ? 'جاري التحليل الذكي...' : 'ابدأ التلخيص الآن ✨'}
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-in zoom-in-95 duration-300">
            <div className="bg-[#161b2c] p-6 rounded-[2.5rem] border border-emerald-500/20 shadow-2xl">
              <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20 mb-6">
                <h4 className="text-emerald-400 font-bold mb-1 flex items-center gap-2"><Lightbulb size={18}/> الفكرة العامة:</h4>
                <p className="text-sm leading-relaxed">{summary?.mainIdea}</p>
              </div>

              <div className="space-y-4 mb-6">
                <h4 className="font-bold text-slate-400 text-xs uppercase tracking-widest">محتوى الدرس</h4>
                <div className="text-slate-200 whitespace-pre-line leading-loose text-sm">{summary?.details}</div>
              </div>

              {summary?.examTip && (
                <div className="bg-amber-500/10 p-4 rounded-2xl border border-amber-500/20 mb-6 flex gap-3">
                  <AlertTriangle className="text-amber-500 shrink-0" size={24} />
                  <div>
                    <h5 className="text-amber-500 font-bold text-sm">نصيحة الامتحان:</h5>
                    <p className="text-xs text-amber-200/80 mt-1 italic">{summary?.examTip}</p>
                  </div>
                </div>
              )}

              <button onClick={() => setShowResult(false)} className="w-full py-4 bg-slate-800 rounded-2xl font-bold hover:bg-slate-700 transition-all text-slate-300">تلخيص درس آخر</button>
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
