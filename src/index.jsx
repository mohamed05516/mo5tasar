import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
  Sparkles, Coins, Home, History, Settings, Download, Copy, 
  Camera, Trash2, CheckCircle2, AlertTriangle, Lightbulb, 
  ChevronLeft, Moon, Sun, BookOpen, Search, X
} from 'lucide-react';
import Tesseract from 'tesseract.js';

// --- 1. قاعدة بيانات المناهج الجزائرية الكاملة (بدون اختصار) ---
const curriculumData = {
  primary: {
    label: 'الابتدائي',
    years: ['الأولى ابتدائي', 'الثانية ابتدائي', 'الثالثة ابتدائي', 'الرابعة ابتدائي', 'الخامسة ابتدائي'],
    subjects: ['اللغة العربية', 'الرياضيات', 'التربية الإسلامية', 'التربية المدنية', 'العلمية والتكنولوجية', 'اللغة الفرنسية', 'التاريخ والجغرافيا']
  },
  middle: {
    label: 'المتوسط',
    years: ['الأولى متوسط', 'الثانية متوسط', 'الثالثة متوسط', 'الرابعة متوسط'],
    subjects: ['اللغة العربية', 'الرياضيات', 'العلوم الطبيعية', 'العلوم الفيزيائية', 'التاريخ والجغرافيا', 'اللغة الفرنسية', 'اللغة الإنجليزية', 'التربية الإسلامية', 'التربية المدنية']
  },
  high: {
    label: 'الثانوي',
    years: ['الأولى ثانوي', 'الثانية ثانوي', 'الثالثة ثانوي'],
    subjects: ['الرياضيات', 'الفيزياء', 'العلوم الطبيعية', 'الفلسفة', 'الأدب العربي', 'اللغة الإنجليزية', 'اللغة الفرنسية', 'التاريخ والجغرافيا', 'العلوم الإسلامية', 'الاقتصاد', 'التكنولوجيا']
  }
};

// --- 2. دالة الذكاء الاصطناعي مع البرومبت المطور (ترميم + عنوان فقط + اللمسة الجزائرية) ---
const generateAISummary = async (text, level, subject, isDetailed) => {
  const apiKey = process.env.REACT_APP_GROQ_API_KEY;
  if (!apiKey) throw new Error("Missing API Key");

  const prompt = `
    أنت "مختصر"، خبير تعليمي متخصص في المنهج الدراسي الجزائري لمستوى (${level}) في مادة (${subject}).
    
    نوع التلخيص المطلوبة: ${isDetailed ? 'مفصل وشامل جداً' : 'موجز ومركز على رؤوس الأقلام'}.
    
    المهمات الخاصة:
    1. إذا كان المدخل "عنوان درس" فقط: قم بتوليد تلخيص كامل وشامل من معرفتك بالمنهج الجزائري لهذا المستوى.
    2. إذا كان النص مكسراً أو غير مترابط (نتيجة خط يد سيء في الصورة): استخدم ذكاءك لترميم المعنى وفهم السياق قبل التلخيص.
    3. المنهج: استخدم المصطلحات المعتمدة في المدرسة الجزائرية حصراً.

    يجب أن يكون الرد بتنسيق JSON حصراً:
    {
      "mainIdea": "تمهيد يربط الدرس بالوحدة الدراسية في سطر واحد",
      "details": "شرح العناصر (استخدم • للنقاط و \\n للسطر الجديد)",
      "terms": "أهم 3 مصطلحات بالعربية والفرنسية (خاصة للمواد العلمية) ومعانيها",
      "examTip": "نصيحة ذهبية لنقطة تتكرر كثيراً في الامتحانات لهذا الدرس"
    }

    المدخلات (نص أو عنوان):
    ${text}
  `;

  const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "system", content: "مساعد تربوي جزائري دقيق." }, { role: "user", content: prompt }],
      temperature: 0.6,
      response_format: { type: "json_object" }
    })
  });
  
  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
};

// --- 3. المكون الرئيسي للتطبيق ---
export default function Mo5tasarApp() {
  const [activeTab, setActiveTab] = useState('home'); // home, history, settings, result
  const [mode, setMode] = useState('ocr');
  const [level, setLevel] = useState('');
  const [year, setYear] = useState('');
  const [subject, setSubject] = useState('');
  const [inputText, setInputText] = useState('');
  const [isDetailed, setIsDetailed] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const [toast, setToast] = useState({ show: false, message: '' });
// دالة مساعدة لإظهار التنبيه وإخفائه تلقائياً
const showNotification = (msg) => {
  setToast({ show: true, message: msg });
  setTimeout(() => setToast({ show: false, message: '' }), 5000); // يختفي بعد 3 ثواني
};
  // --- إضافة نظام الجواهر (نضيفها هنا مع بقية الـ useState) ---
  const [gems, setGems] = useState(() => {
    const saved = localStorage.getItem('mo5tasar_gems');
    return saved !== null ? parseInt(saved) : 100; // يبدأ بـ 100 جوهرة
  });
  useEffect(() => {
    localStorage.setItem('mo5tasar_gems', gems.toString());
  }, [gems]);
  const [isWatchingAd, setIsWatchingAd] = useState(false);
  const handleWatchAd = () => {
    setIsWatchingAd(true);
    setTimeout(() => {
      setGems(prev => prev + 30); // مكافأة 30 جوهرة
      setIsWatchingAd(false);
      showNotification("suiiii! أضفنا 30 جوهرة لرصيدك.. واصل تألقك! 💎✨");
    }, 7000); // ينتظر 7 ثوانٍ
  };
  const fileInputRef = useRef(null);
  useEffect(() => {
    const saved = localStorage.getItem('mo5tasar_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);
  const handleCameraClick = () => fileInputRef.current.click();
  const processImage = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsProcessing(true);
    try {
      const { data: { text } } = await Tesseract.recognize(file, 'ara+fra');
      setInputText(text);
    } catch (err) {
      showNotification("تعذر قراءة الصورة، جرب صورة أوضح");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSummarize = async () => {
    if (mode === 'curriculum' && (!level || !year || !subject)) return showNotification("يرجى إكمال اختيار المنهاج");
    if (mode === 'ocr' && !inputText) return showNotification("يرجى كتابة نص أو التقاط صورة");
    if (gems < 10) return showNotification("رصيدك من الجواهر خلص! 💎 اشحن رصيدك من الإعدادات.");
    setIsProcessing(true);
    try {
      const result = await generateAISummary(
        inputText || `درس ${subject} للسنة ${year}`, 
        level ? curriculumData[level].label : 'عام', 
        subject || 'عام', 
        isDetailed
      );
      setSummary(result);
      setGems(prev => prev - 10);
      const newHistory = [{ ...result, subject: subject || 'نص حر', date: new Date().toLocaleString('ar-DZ') }, ...history];
      setHistory(newHistory.slice(0, 10)); // حفظ آخر 10 عمليات
      localStorage.setItem('mo5tasar_history', JSON.stringify(newHistory.slice(0, 10)));
      setActiveTab('result');
    } catch (e) {
      showNotification("خطأ! تأكد من مفتاح API في Vercel");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f1a] text-white font-sans pb-24 transition-all" dir="rtl">
      {/* Header */}
      <header className="p-4 flex justify-between items-center bg-[#161b2c] border-b border-slate-800 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500 p-1.5 rounded-lg shadow-lg shadow-emerald-500/20">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="font-black text-xl tracking-tight">مختصر</span>
        </div>
       <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full shadow-sm shadow-blue-900/10">
  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
  <span className="text-blue-400 font-black text-xs">{gems} جوهرة 💎</span>
</div>
      </header>

      <main className="p-4 max-w-md mx-auto">
        {/* الصفحة الرئيسية */}
        {activeTab === 'home' && (
          <div className="space-y-5 animate-in fade-in duration-500">
            <div className="flex bg-[#161b2c] p-1 rounded-2xl border border-slate-800">
              <button onClick={() => setMode('ocr')} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${mode === 'ocr' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500'}`}>نص / كاميرا</button>
              <button onClick={() => setMode('curriculum')} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${mode === 'curriculum' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500'}`}>المنهاج</button>
            </div>

            <div className="bg-[#161b2c] p-6 rounded-[2.5rem] border border-slate-800 shadow-2xl space-y-4">
              {mode === 'ocr' ? (
                <div className="relative">
                  <textarea 
                    className="w-full h-44 bg-[#0b0f1a] rounded-2xl p-4 border border-slate-800 outline-none focus:border-emerald-500 transition-all resize-none text-sm leading-relaxed"
                    placeholder="قم باختيار مستواك اولا ثم اكتب درسك هنا او صوره"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />
                  <button onClick={handleCameraClick} className="absolute bottom-4 left-4 p-3 bg-emerald-600 rounded-xl shadow-xl hover:bg-emerald-500 transition-all">
                    <Camera size={20} />
                  </button>
                  <input type="file" ref={fileInputRef} onChange={processImage} hidden accept="image/*" />
                </div>
              ) : (
                <div className="space-y-4 animate-in slide-in-from-bottom-2">
                  <select className="w-full p-4 bg-[#0b0f1a] rounded-2xl border border-slate-800 font-bold text-slate-300" value={level} onChange={(e)=>{setLevel(e.target.value); setYear(''); setSubject('');}}>
                    <option value="">اختر الطور التعليمي</option>
                    <option value="primary">الابتدائي</option>
                    <option value="middle">المتوسط</option>
                    <option value="high">الثانوي</option>
                  </select>
                  {level && (
                    <select className="w-full p-4 bg-[#0b0f1a] rounded-2xl border border-slate-800 font-bold text-slate-300 animate-in fade-in" value={year} onChange={(e)=>setYear(e.target.value)}>
                      <option value="">السنة الدراسية</option>
                      {curriculumData[level].years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  )}
                  {year && (
                    <select className="w-full p-4 bg-[#0b0f1a] rounded-2xl border border-slate-800 font-bold text-slate-300 animate-in fade-in" value={subject} onChange={(e)=>setSubject(e.target.value)}>
                      <option value="">اختر المادة</option>
                      {curriculumData[level].subjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  )}
                </div>
              )}

              <button onClick={handleSummarize} disabled={isProcessing} className="w-full bg-emerald-600 hover:bg-emerald-500 py-4 rounded-2xl font-black text-lg shadow-lg shadow-emerald-500/20 active:scale-95 transition-all">
                {isProcessing ? 'جاري التحليل الذكي...' : 'ابدأ التلخيص ✨'}
              </button>
            </div>
          </div>
        )}

        {/* السجل */}
        {activeTab === 'history' && (
          <div className="space-y-4 animate-in slide-in-from-left-4">
            <div className="flex justify-between items-center px-2">
              <h2 className="text-xl font-bold">آخر الملخصات</h2>
              <button onClick={() => {setHistory([]); localStorage.removeItem('mo5tasar_history');}} className="text-red-400 p-2 hover:bg-red-400/10 rounded-lg transition-all"><Trash2 size={20}/></button>
            </div>
            {history.length === 0 ? (
              <div className="text-center py-20 bg-[#161b2c] rounded-[2rem] border border-dashed border-slate-800 text-slate-500">لا توجد سجلات بعد</div>
            ) : (
              history.map((item, index) => (
                <div key={index} onClick={() => {setSummary(item); setActiveTab('result');}} className="bg-[#161b2c] p-4 rounded-2xl border border-slate-800 flex justify-between items-center cursor-pointer hover:border-emerald-500/50 transition-all group">
                  <div>
                    <h3 className="font-bold text-emerald-400 group-hover:translate-x-[-4px] transition-transform">{item.subject}</h3>
                    <p className="text-[10px] text-slate-500 mt-1">{item.date}</p>
                  </div>
                  <ChevronLeft className="text-slate-600" size={18} />
                </div>
              ))
            )}
          </div>
        )}

        {/* الإعدادات */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <h2 className="text-xl font-bold px-2">الإعدادات</h2>
            <div className="bg-[#161b2c] p-6 rounded-[2rem] border border-slate-800 space-y-6 shadow-xl">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-500"><BookOpen size={20}/></div>
                  <div>
                    <h3 className="font-bold text-sm">نوع التلخيص</h3>
                    <p className="text-[10px] text-slate-500">تحكم في كمية المعلومات المستخرجة</p>
                  </div>
                </div>
                <button onClick={() => setIsDetailed(!isDetailed)} className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${isDetailed ? 'bg-emerald-600' : 'bg-slate-700 text-slate-400'}`}>
                  {isDetailed ? 'مفصل' : 'موجز'}
                </button>
              </div>
              <div className="border-t border-slate-800 pt-5 flex justify-between items-center opacity-50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500"><Moon size={20}/></div>
                  <h3 className="font-bold text-sm">الوضع الداكن (تلقائي)</h3>
                </div>
              </div>
            </div>
            <div className="bg-blue-600/10 border border-blue-600/20 p-4 rounded-2xl text-center space-y-3 mb-4">
  <p className="text-xs text-blue-300 font-bold">💎 رصيدك الحالي: {gems} جوهرة</p>
  <button 
    onClick={handleWatchAd}
    disabled={isWatchingAd}
    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/30 active:scale-95 disabled:opacity-50"
  >
    {isWatchingAd ? "جاري تحضير الجواهر... ⏳" : "احصل على 30 جوهرة مجاناً ✨"}
  </button>
</div>
            <div className="p-4 text-center">
              <p className="text-[10px] text-slate-600">نسخة مختصر v1.0 - المنهج الجزائري 🇩🇿</p>
            </div>
          </div>
        )}

        {/* شاشة النتيجة */}
        {activeTab === 'result' && summary && (
          <div className="space-y-4 animate-in zoom-in-95 duration-300">
            <div className="bg-[#161b2c] p-6 rounded-[2.5rem] border border-emerald-500/20 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full"></div>
              
              <div className="flex justify-between items-center mb-6">
                <button onClick={() => setActiveTab('home')} className="p-2 bg-slate-800 rounded-xl text-slate-400 hover:text-white"><X size={18}/></button>
                <div className="flex gap-2">
                  <button onClick={() => navigator.clipboard.writeText(summary.details)} className="p-2 bg-slate-800 rounded-xl text-slate-400"><Copy size={18}/></button>
                  <button className="p-2 bg-slate-800 rounded-xl text-slate-400"><Download size={18}/></button>
                </div>
              </div>

              <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20 mb-6">
                <h4 className="text-emerald-400 font-bold text-xs mb-1 flex items-center gap-2"><Lightbulb size={16}/> الفكرة العامة:</h4>
                <p className="text-sm leading-relaxed text-slate-100">{summary.mainIdea}</p>
              </div>

              <div className="space-y-4 mb-6">
                <h4 className="font-bold text-slate-400 text-[10px] uppercase tracking-[0.2em] px-1">المحتوى التعليمي</h4>
                <div className="text-slate-200 whitespace-pre-line leading-relaxed text-sm bg-[#0b0f1a] p-4 rounded-2xl border border-slate-800 shadow-inner">
                  {summary.details}
                </div>
              </div>

              {summary.examTip && (
                <div className="bg-amber-500/10 p-4 rounded-2xl border border-amber-500/20 mb-6 flex gap-3 shadow-lg shadow-amber-500/5">
                  <AlertTriangle className="text-amber-500 shrink-0" size={20} />
                  <div>
                    <h5 className="text-amber-500 font-bold text-xs">نصيحة الامتحان:</h5>
                    <p className="text-[11px] text-amber-200/80 mt-1 italic leading-relaxed">{summary.examTip}</p>
                  </div>
                </div>
              )}

              <button onClick={() => setActiveTab('home')} className="w-full py-4 bg-emerald-600 rounded-2xl font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-500 transition-all">تلخيص درس جديد</button>
            </div>
          </div>
        )}
      </main>

      {/* Navigation Bar */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#161b2c]/90 backdrop-blur-xl border-t border-slate-800 p-4 flex justify-around items-center z-50">
        <button onClick={() => setActiveTab('history')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'history' ? 'text-emerald-500 scale-110' : 'text-slate-500'}`}>
          <History size={22} /><span className="text-[9px] font-bold">السجل</span>
        </button>
        <button onClick={() => setActiveTab('home')} className={`relative -top-4 bg-emerald-500 p-4 rounded-2xl shadow-2xl shadow-emerald-500/40 transition-all active:scale-90 ${activeTab === 'home' ? 'text-white' : 'bg-slate-700 text-slate-300'}`}>
          <Home size={24} />
        </button>
        <button onClick={() => setActiveTab('settings')} className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'settings' ? 'text-emerald-500 scale-110' : 'text-slate-500'}`}>
          <Settings size={22} /><span className="text-[9px] font-bold">الإعدادات</span>
        </button>
      </nav>
      {/* نظام التنبيهات الداخلي */}
{toast.show && (
  <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top duration-300">
    <div className="bg-blue-600 text-white px-6 py-3 rounded-2xl shadow-2xl shadow-blue-900/40 border border-white/20 flex items-center gap-3">
      <div className="bg-white/20 p-1 rounded-full">
        <Sparkles size={16} />
      </div>
      <p className="text-sm font-bold whitespace-nowrap">{toast.message}</p>
    </div>
  </div>
)}
    </div>
  );
}
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Mo5tasarApp />);
}
