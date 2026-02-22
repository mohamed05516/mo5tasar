import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
 Sparkles, Home, History, Settings, Download, Copy, 
 Camera, Trash2, AlertTriangle, Lightbulb, 
 ChevronLeft, Moon, BookOpen, X 
} from 'lucide-react';

// --- 1. قاعدة بيانات المناهج الجزائرية ---
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

// --- 2. المكون الرئيسي للتطبيق ---
export default function Mo5tasarApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [mode, setMode] = useState('ocr');
  const [level, setLevel] = useState('');
  const [year, setYear] = useState('');
  const [subject, setSubject] = useState('');
  const [inputText, setInputText] = useState('');
  const [isDetailed, setIsDetailed] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [summary, setSummary] = useState(null);
  const [history, setHistory] = useState([]);
  const fileInputRef = useRef(null);
  const [gems, setGems] = useState(() => Number(localStorage.getItem('mo5tasar_gems')) || 100);
  const [toast, setToast] = useState({ show: false, message: '' });

  const apiKey = process.env.REACT_APP_GROQ_API_KEY;

  useEffect(() => {
    localStorage.setItem('mo5tasar_gems', gems.toString());
  }, [gems]);

  useEffect(() => {
    const saved = localStorage.getItem('mo5tasar_history');
    if (saved) setHistory(JSON.parse(saved));
  }, []);

  const showNotification = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  // --- دالة قراءة الصور الذكية (Vision) ---
  const processImage = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsProcessing(true);
    showNotification("جاري معالجة الصورة بذكاء... 👀");

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Image = reader.result;
      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "llama-3.2-11b-vision-preview",
            messages: [{
              role: "user",
              content: [
                { type: "text", text: "استخرج النص من هذه الصورة باللغة العربية والفرنسية بدقة عالية." },
                { type: "image_url", image_url: { url: base64Image } }
              ]
            }]
          })
        });
        const data = await response.json();
        const extractedText = data.choices[0].message.content;
        setInputText(extractedText);
        showNotification("تمت القراءة بنجاح! ✨");
      } catch (error) {
        showNotification("فشلت قراءة الصورة.");
      } finally {
        setIsProcessing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // --- دالة التلخيص الرئيسية مع بروتوكول التحقق ---
  const handleSummarize = async () => {
    if (gems < 10) return showNotification("رصيدك غير كافٍ! 💎");
    if (mode === 'ocr' && !inputText) return showNotification("يرجى إدخال نص أو صورة");

    setIsProcessing(true);
    const prompt = `
      أنت "مختصر"، خبير تعليمي جزائري. المستوى: (${level}) | المادة: (${subject}).
      المهمة: فحص النص التالي: "${inputText || 'درس ' + subject}".
      1. إذا كان تافهاً أو غير تعليمي رد بـ: {"error": "INVALID_INPUT"}.
      2. إذا كان صالحاً، لخصه بتنسيق JSON: { "title": "", "mainIdea": "", "details": "", "terms": "", "examTip": "" }.
      استخدم المنهج الجزائري والمصطلحات الفرنسية للمواد العلمية.
    `;

    try {
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
      const result = JSON.parse(data.choices[0].message.content);

      if (result.error === "INVALID_INPUT") {
        showNotification("هذا ليس درساً تعليمياً! ❌");
      } else {
        setSummary(result);
        setGems(prev => prev - 10);
        const newHistory = [{ ...result, subject: subject || 'نص حر', date: new Date().toLocaleString('ar-DZ') }, ...history];
        setHistory(newHistory.slice(0, 10));
        localStorage.setItem('mo5tasar_history', JSON.stringify(newHistory.slice(0, 10)));
        setActiveTab('result');
      }
    } catch (e) {
      showNotification("خطأ في الاتصال بالذكاء الاصطناعي");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans pb-24" dir="rtl">
      {/* Header */}
      <header className="p-4 flex justify-between items-center bg-[#0f172a]/60 backdrop-blur-xl border-b border-white/5 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500 p-1.5 rounded-lg">
            <Sparkles size={18} className="text-white" />
          </div>
          <span className="font-black text-xl">مختصر</span>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 px-3 py-1.5 rounded-full">
          <span className="text-blue-400 font-black text-xs">{gems} جوهرة 💎</span>
        </div>
      </header>

      <main className="p-4 max-w-md mx-auto">
        {activeTab === 'home' && (
          <div className="space-y-5 animate-in fade-in">
            <div className="flex bg-[#161b2c] p-1 rounded-2xl border border-slate-800">
              <button onClick={() => setMode('ocr')} className={`flex-1 py-3 rounded-xl font-bold text-sm ${mode === 'ocr' ? 'bg-emerald-600 text-white' : 'text-slate-500'}`}>كاميرا</button>
              <button onClick={() => setMode('curriculum')} className={`flex-1 py-3 rounded-xl font-bold text-sm ${mode === 'curriculum' ? 'bg-emerald-600 text-white' : 'text-slate-500'}`}>المنهاج</button>
            </div>

            <div className="bg-[#161b2c] p-6 rounded-[2.5rem] border border-slate-800 shadow-2xl space-y-4">
              {mode === 'ocr' ? (
                <div className="relative">
                  <textarea 
                    className="w-full h-44 bg-[#020617]/40 rounded-2xl p-4 border border-white/5 outline-none focus:border-blue-500/50 text-sm text-blue-50 placeholder:text-slate-600"
                    placeholder="حط درسك هنا أو استعمل الكاميرا..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />
                  <button onClick={() => fileInputRef.current.click()} className="absolute bottom-4 left-4 p-3 bg-emerald-600 rounded-xl">
                    <Camera size={20} />
                  </button>
                  <input type="file" ref={fileInputRef} onChange={processImage} hidden accept="image/*" />
                </div>
              ) : (
                <div className="space-y-4">
                  <select className="w-full p-4 bg-[#0b0f1a] rounded-2xl border border-slate-800 text-slate-300" value={level} onChange={(e)=>setLevel(e.target.value)}>
                    <option value="">اختر الطور</option>
                    <option value="primary">الابتدائي</option>
                    <option value="middle">المتوسط</option>
                    <option value="high">الثانوي</option>
                  </select>
                  {level && (
                    <select className="w-full p-4 bg-[#0b0f1a] rounded-2xl border border-slate-800 text-slate-300" value={year} onChange={(e)=>setYear(e.target.value)}>
                      <option value="">السنة</option>
                      {curriculumData[level].years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  )}
                  {year && (
                    <select className="w-full p-4 bg-[#0b0f1a] rounded-2xl border border-slate-800 text-slate-300" value={subject} onChange={(e)=>setSubject(e.target.value)}>
                      <option value="">المادة</option>
                      {curriculumData[level].subjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  )}
                </div>
              )}

              <button 
                onClick={handleSummarize} 
                disabled={isProcessing}
                className="w-full bg-blue-600 py-4 rounded-2xl font-black text-lg shadow-xl"
              >
                {isProcessing ? "جاري التحليل..." : "ابدأ التلخيص"}
              </button>
            </div>
          </div>
        )}
{/* الإعدادات وشحن الجواهر */}
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
        <button 
          onClick={() => setIsDetailed(!isDetailed)} 
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${isDetailed ? 'bg-emerald-600' : 'bg-slate-700 text-slate-400'}`}
        >
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

    {/* صندوق شحن الجواهر */}
    <div className="bg-blue-600/10 border border-blue-600/20 p-4 rounded-2xl text-center space-y-3 mb-4">
      <p className="text-xs text-blue-300 font-bold">💎 رصيدك الحالي: {gems} جوهرة</p>
      <button 
        onClick={() => {
            showNotification("جاري تحضير الجواهر... ⏳");
            setTimeout(() => {
                setGems(prev => prev + 30);
                showNotification("مبروك! أضفنا 30 جوهرة لحيّك! 💎✨");
            }, 3000);
        }}
        className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
      >
        احصل على 30 جوهرة مجاناً ✨
      </button>
    </div>

    <div className="p-4 text-center">
      <p className="text-[10px] text-slate-600">نسخة مختصر v1.0 - المنهج الجزائري 🇩🇿</p>
    </div>
  </div>
)}
        {/* شاشة النتيجة */}
        {activeTab === 'result' && summary && (
          <div className="space-y-4 animate-in zoom-in-95">
            <div className="bg-[#161b2c] p-6 rounded-[2.5rem] border border-emerald-500/20 relative">
              <div className="flex justify-between mb-6">
                <button onClick={() => setActiveTab('home')} className="p-2 bg-slate-800 rounded-xl text-slate-400"><X size={18}/></button>
                <div className="flex gap-2">
                  <button onClick={() => navigator.clipboard.writeText(summary.details)} className="p-2 bg-slate-800 rounded-xl text-slate-400"><Copy size={18}/></button>
                </div>
              </div>
              <h2 className="text-xl font-bold text-emerald-400 mb-4">{summary.title}</h2>
              <div className="bg-emerald-500/10 p-4 rounded-2xl border border-emerald-500/20 mb-4">
                <p className="text-sm leading-relaxed">{summary.mainIdea}</p>
              </div>
              <div className="bg-[#0b0f1a] p-4 rounded-2xl border border-slate-800 text-sm whitespace-pre-line mb-4">
                {summary.details}
              </div>
              {summary.examTip && (
                <div className="bg-amber-500/10 p-4 rounded-2xl border border-amber-500/20 flex gap-3">
                  <AlertTriangle className="text-amber-500 shrink-0" size={20} />
                  <p className="text-[11px] text-amber-200/80 italic">{summary.examTip}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">السجل</h2>
            {history.map((item, i) => (
              <div key={i} onClick={() => {setSummary(item); setActiveTab('result');}} className="bg-[#161b2c] p-4 rounded-2xl border border-slate-800 flex justify-between cursor-pointer">
                <span className="font-bold text-emerald-400">{item.title || item.subject}</span>
                <ChevronLeft size={18} />
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Nav Bar */}
      <nav className="fixed bottom-6 left-4 right-4 bg-[#0f172a]/80 backdrop-blur-2xl border border-white/10 p-2 rounded-[2rem] flex justify-around items-center z-50">
        <button onClick={() => setActiveTab('history')} className={`p-4 ${activeTab === 'history' ? 'text-blue-400' : 'text-slate-500'}`}><History /></button>
        <button onClick={() => setActiveTab('home')} className={`p-4 rounded-2xl ${activeTab === 'home' ? 'bg-blue-600 text-white' : 'text-slate-300'}`}><Home /></button>
        <button onClick={() => setActiveTab('settings')} className={`p-4 ${activeTab === 'settings' ? 'text-blue-400' : 'text-slate-500'}`}><Settings /></button>
      </nav>

      {toast.show && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] bg-blue-600 text-white px-6 py-3 rounded-2xl shadow-2xl">
          <p className="text-sm font-bold">{toast.message}</p>
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
