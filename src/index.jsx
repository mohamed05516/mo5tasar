import { createRoot } from 'react-dom/client';
import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, Upload, Download, ExternalLink, BookOpen, Settings, 
  History, Home, Sparkles, Zap, Brain, AlertCircle, CheckCircle2, 
  Coffee, Timer, Droplet, Wind, Trophy, Play, FileText, 
  Image as ImageIcon, Coins, ChevronDown 
} from 'lucide-react';
import Tesseract from 'tesseract.js';

// استيراد الخدمات من الملفات التي أنشأناها سابقاً
import { aiService } from './aiService';
import { exportToPDF, exportToWord, exportToImage } from './exportUtils';

export default function Mo5tasarApp() {
  // --- إدارة الحالة (States) ---
  const [mode, setMode] = useState('ocr');
  const [level, setLevel] = useState('');
  const [year, setYear] = useState('');
  const [subject, setSubject] = useState('');
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [aiProgress, setAiProgress] = useState(0);
  const [currentTip, setCurrentTip] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [summary, setSummary] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('error');
  const [points, setPoints] = useState(() => {
    const saved = localStorage.getItem('mo5tasar_points');
    return saved ? parseInt(saved) : 20;
  });
  const [showAdTimer, setShowAdTimer] = useState(false);
  const [adTimer, setAdTimer] = useState(5);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  const studyTips = [
    { icon: <Droplet className="w-5 h-5" />, text: 'اشرب الماء كل ساعة', subtext: 'عقلك يحتاج للترطيب' },
    { icon: <Timer className="w-5 h-5" />, text: 'تقنية بومودورو', subtext: '25 دقيقة دراسة، 5 دقائق راحة' },
    { icon: <Brain className="w-5 h-5" />, text: 'راجع قبل النوم', subtext: 'تثبيت الذاكرة يعمل الآن' },
    { icon: <Sparkles className="w-5 h-5" />, text: 'ثق بنفسك وقدراتك', subtext: 'أنت تستطيع!' },
  ];

  const levels = [
    { value: 'primary', label: 'الابتدائي' },
    { value: 'middle', label: 'المتوسط' },
    { value: 'high', label: 'الثانوي' },
  ];

  const subjects = [
    { ar: 'الرياضيات', en: 'mathematics' },
    { ar: 'الفيزياء', en: 'physics' },
    { ar: 'التاريخ', en: 'history' },
    { ar: 'العلوم الطبيعية', en: 'natural-sciences' },
    { ar: 'اللغة العربية', en: 'arabic' }
  ];

  useEffect(() => {
    localStorage.setItem('mo5tasar_points', points.toString());
  }, [points]);

  useEffect(() => {
    if (isProcessing) {
      const tipInterval = setInterval(() => {
        setCurrentTip(prev => (prev + 1) % studyTips.length);
      }, 3000);
      return () => clearInterval(tipInterval);
    }
  }, [isProcessing]);

  useEffect(() => {
    if (showAdTimer && adTimer > 0) {
      const timer = setTimeout(() => setAdTimer(adTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (showAdTimer && adTimer === 0) {
      setPoints(prev => prev + 10);
      setShowAdTimer(false);
      setAdTimer(5);
      showToastMessage('تم إضافة 10 نقاط! 🎉', 'success');
    }
  }, [showAdTimer, adTimer]);

  const showToastMessage = (message, type = 'error') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSummarize = async () => {
    if (points < 5) {
      showToastMessage('نقاطك غير كافية! شاهد إعلان 🎯', 'error');
      return;
    }
    setPoints(prev => prev - 5);
    setIsProcessing(true);
    try {
      const result = await aiService.generateSummary(inputText, { level, subject });
      setSummary(result);
      setShowResult(true);
      setIsProcessing(false);
    } catch (error) {
      setIsProcessing(false);
      setPoints(prev => prev + 5);
      showToastMessage('حدث خطأ، حاول مرة أخرى', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 relative overflow-hidden" style={{ fontFamily: "'Cairo', sans-serif", direction: 'rtl' }}>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet" />
      
      {/* التنبيهات (Toast) */}
      {showToast && (
        <div className="fixed top-4 left-4 right-4 z-[100] animate-bounce text-center">
          <div className={`${toastType === 'success' ? 'bg-emerald-500' : 'bg-rose-500'} text-white px-4 py-3 rounded-2xl shadow-xl flex items-center justify-center gap-3`}>
            {toastType === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <p className="font-bold">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* الهيدر (Header) */}
      <header className="sticky top-0 z-40 bg-white border-b border-emerald-100 p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500 p-2 rounded-xl shadow-lg shadow-emerald-200">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-black text-slate-800">mo5tasar</h1>
        </div>
        <div className="bg-amber-500 text-white px-3 py-1.5 rounded-xl flex items-center gap-2 font-bold shadow-md shadow-amber-200">
          <Coins className="w-4 h-4" /> {points}
        </div>
      </header>

      <main className="px-4 pt-6 max-w-2xl mx-auto">
        {!showResult ? (
          <div className="space-y-6 animate-fadeIn">
            {/* أزرار اختيار الوضع */}
            <div className="bg-white p-1 rounded-2xl shadow-sm border flex gap-1">
              <button onClick={() => setMode('ocr')} className={`flex-1 py-3 rounded-xl font-bold transition-all ${mode === 'ocr' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'text-slate-500'}`}>تصوير / نص</button>
              <button onClick={() => setMode('curriculum')} className={`flex-1 py-3 rounded-xl font-bold transition-all ${mode === 'curriculum' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'text-slate-500'}`}>المنهاج</button>
            </div>

            {/* منطقة الإدخال */}
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
              {mode === 'ocr' ? (
                <textarea 
                  className="w-full h-40 p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                  placeholder="الصق النص هنا أو اكتب عنوان الدرس..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              ) : (
                <div className="space-y-4">
                  <select className="w-full p-4 rounded-2xl border bg-slate-50 font-bold outline-none" onChange={(e) => setLevel(e.target.value)}>
                    <option value="">اختر المستوى</option>
                    {levels.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                  </select>
                  <select className="w-full p-4 rounded-2xl border bg-slate-50 font-bold outline-none" onChange={(e) => setSubject(e.target.value)}>
                    <option value="">اختر المادة</option>
                    {subjects.map(s => <option key={s.ar} value={s.ar}>{s.ar}</option>)}
                  </select>
                </div>
              )}
              <button 
                onClick={handleSummarize}
                disabled={isProcessing}
                className="w-full mt-4 bg-emerald-500 text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-200 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? 'جاري التلخيص...' : 'ابدأ التلخيص ✨'}
              </button>
            </div>

            {/* زر ربح النقاط */}
            <button onClick={() => setShowAdTimer(true)} className="w-full bg-amber-50 border-2 border-dashed border-amber-300 p-4 rounded-2xl flex items-center justify-center gap-3 text-amber-700 font-bold">
              <Play className="w-5 h-5" /> شاهد إعلان واربح +10 نقاط
            </button>
          </div>
        ) : (
          <div className="space-y-4 animate-fadeIn text-right">
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-emerald-100">
              <h3 className="text-emerald-600 font-black mb-4 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-emerald-500 rounded-full" /> ملخص الذكاء الاصطناعي
              </h3>
              <p className="text-slate-700 leading-relaxed mb-6">{summary?.mainIdea}</p>
              
              <button
                onClick={() => {
                  setShowResult(false);
                  setInputText('');
                }}
                className="w-full bg-white text-emerald-600 border-2 border-emerald-500 font-bold py-4 rounded-2xl hover:bg-emerald-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                تلخيص جديد
              </button>
            </div>
          </div>
        )}
      </main>

      {/* القائمة السفلية (Bottom Nav) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-3 z-50 shadow-2xl">
        <div className="max-w-2xl mx-auto flex items-center justify-around">
          {[
            { icon: <History className="w-6 h-6" />, label: 'السجل', id: 'history' },
            { icon: <Home className="w-6 h-6" />, label: 'الرئيسية', id: 'home' },
            { icon: <Settings className="w-6 h-6" />, label: 'الإعدادات', id: 'settings' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 px-6 py-1 rounded-2xl transition-all ${
                activeTab === item.id ? 'text-emerald-600 bg-emerald-50' : 'text-slate-400'
              }`}
            >
              {item.icon}
              <span className="text-[10px] font-bold">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* مودال الإعلان */}
      {showAdTimer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center">
            <h3 className="text-xl font-black mb-2">جاري تجهيز المكافأة</h3>
            <p className="text-slate-500 mb-4">انتظر {adTimer} ثوانٍ للحصول على النقاط</p>
            <div className="text-4xl font-black text-emerald-500">{adTimer}</div>
          </div>
        </div>
      )}
    </div>
  );
}

// أمر التشغيل النهائي (Root Render)
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Mo5tasarApp />);
}
