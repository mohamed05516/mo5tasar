import React, { useState, useEffect, useRef } from 'react';
import { Camera, Upload, Download, ExternalLink, BookOpen, Settings, History, Home, Sparkles, Zap, Brain, AlertCircle, CheckCircle2, Coffee, Timer, Droplet, Wind, Trophy, Play, FileText, Image as ImageIcon, Coins, ChevronDown } from 'lucide-react';
import Tesseract from 'tesseract.js';

// Simulated AI Service (will be replaced with actual Groq API)
const aiService = {
  async generateSummary(text, context = {}) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const { level, year, subject, isLessonTitle } = context;
    
    // Mock response - in real implementation, this calls Groq API
    return {
      mainIdea: "الخلايا هي الوحدات الأساسية للحياة في جميع الكائنات الحية. تتكون الكائنات من خلية واحدة أو أكثر، وكل خلية تحتوي على عضيات متخصصة تؤدي وظائف محددة حسب المنهاج الجزائري.",
      keyPoints: [
        'الخلية النباتية تحتوي على جدار خلوي وبلاستيدات خضراء للقيام بعملية التركيب الضوئي',
        'النواة تحتوي على المادة الوراثية DNA وتتحكم في جميع أنشطة الخلية',
        'الميتوكوندريا هي مركز إنتاج الطاقة في الخلية من خلال التنفس الخلوي',
        'الغشاء البلازمي ينظم دخول وخروج المواد بشكل انتقائي'
      ],
      expectedQuestion: {
        question: 'قارن بين الخلية النباتية والخلية الحيوانية من حيث التركيب والوظيفة؟',
        answer: 'الخلية النباتية تتميز بوجود الجدار الخلوي الذي يعطيها الصلابة والشكل المحدد، والبلاستيدات الخضراء التي تقوم بعملية التركيب الضوئي لإنتاج الغذاء. أما الخلية الحيوانية فلا تحتوي على جدار خلوي ولا بلاستيدات خضراء، وتحصل على غذائها جاهزاً من البيئة المحيطة.'
      },
      dzexamsInsights: [
        'السؤال الأكثر تكراراً: رسم مخطط الخلية مع البيانات (ظهر في 8 امتحانات سابقة)',
        'سؤال شائع: مقارنة بين الخلية النباتية والحيوانية (ظهر 6 مرات)',
        'سؤال متوقع: دور العضيات في الخلية (ظهر 5 مرات في السنوات الأخيرة)'
      ]
    };
  }
};

export default function Mo5tasarApp() {
  // State Management
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
  const [dragActive, setDragActive] = useState(false);
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
  const summaryRef = useRef(null);

  const studyTips = [
    { icon: <Droplet className="w-5 h-5" />, text: 'اشرب الماء كل ساعة', subtext: 'Your brain needs hydration' },
    { icon: <Timer className="w-5 h-5" />, text: 'تقنية بومودورو', subtext: '25 min study, 5 min break' },
    { icon: <Coffee className="w-5 h-5" />, text: 'خد راحة كل ساعتين', subtext: 'Rest = Better retention' },
    { icon: <Wind className="w-5 h-5" />, text: 'نفس عميق قبل الامتحان', subtext: 'Calm your nerves' },
    { icon: <Brain className="w-5 h-5" />, text: 'راجع قبل النوم', subtext: 'Memory consolidation works' },
    { icon: <Sparkles className="w-5 h-5" />, text: 'ثق بنفسك وقدراتك', subtext: 'Confidence is key' },
  ];

  const levels = [
    { value: 'primary', label: 'الابتدائي', en: 'primary' },
    { value: 'middle', label: 'المتوسط', en: 'middle' },
    { value: 'high', label: 'الثانوي', en: 'secondary' },
  ];

  const years = {
    middle: ['1AM', '2AM', '3AM', '4AM'],
    high: ['1AS', '2AS', '3AS'],
  };

  const subjects = [
    { ar: 'الرياضيات', en: 'mathematics' },
    { ar: 'الفيزياء', en: 'physics' },
    { ar: 'التاريخ', en: 'history' },
    { ar: 'الجغرافيا', en: 'geography' },
    { ar: 'العلوم الطبيعية', en: 'natural-sciences' },
    { ar: 'اللغة العربية', en: 'arabic' },
    { ar: 'اللغة الفرنسية', en: 'french' },
    { ar: 'اللغة الإنجليزية', en: 'english' }
  ];

  // Save points to localStorage
  useEffect(() => {
    localStorage.setItem('mo5tasar_points', points.toString());
  }, [points]);

  // Tip rotation during processing
  useEffect(() => {
    if (isProcessing) {
      const tipInterval = setInterval(() => {
        setCurrentTip(prev => (prev + 1) % studyTips.length);
      }, 3000);
      return () => clearInterval(tipInterval);
    }
  }, [isProcessing]);

  // Ad timer countdown
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

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processImage(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = async (e) => {
    if (e.target.files && e.target.files[0]) {
      await processImage(e.target.files[0]);
    }
  };

  const processImage = async (file) => {
    setOcrProgress(0);
    setIsProcessing(true);
    
    try {
      const result = await Tesseract.recognize(
        file,
        'ara+eng',
        {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              setOcrProgress(Math.round(m.progress * 100));
            }
          }
        }
      );
      
      setInputText(result.data.text);
      setIsProcessing(false);
      setOcrProgress(0);
      showToastMessage('تم استخراج النص بنجاح! ✨', 'success');
    } catch (error) {
      setIsProcessing(false);
      setOcrProgress(0);
      showToastMessage('حدث خطأ في قراءة الصورة. جرب صورة أوضح.', 'error');
    }
  };

  const isLessonTitleOnly = (text) => {
    // Check if text is short and looks like a lesson title
    const trimmed = text.trim();
    return trimmed.length < 50 && !trimmed.includes('.');
  };

  const handleSummarize = async () => {
    // Check points
    if (points < 5) {
      showToastMessage('نقاطك غير كافية! شاهد إعلان لربح نقاط 🎯', 'error');
      return;
    }

    // Validate input
    if (mode === 'ocr' && !inputText.trim()) {
      showToastMessage('اكتب أو ارفع صورة أولاً!', 'error');
      return;
    }

    if (mode === 'curriculum' && (!level || !subject)) {
      showToastMessage('اختر المستوى والمادة أولاً!', 'error');
      return;
    }

    // Deduct points
    setPoints(prev => prev - 5);
    setIsProcessing(true);
    setAiProgress(0);
    setShowResult(false);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setAiProgress(prev => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + 5;
      });
    }, 200);

    try {
      const context = {
        level,
        year,
        subject,
        isLessonTitle: mode === 'ocr' && isLessonTitleOnly(inputText)
      };

      const result = await aiService.generateSummary(
        mode === 'ocr' ? inputText : `${level} ${year} ${subject}`,
        context
      );

      clearInterval(progressInterval);
      setAiProgress(100);
      setSummary(result);
      
      setTimeout(() => {
        setIsProcessing(false);
        setShowResult(true);
      }, 500);

    } catch (error) {
      clearInterval(progressInterval);
      setIsProcessing(false);
      setPoints(prev => prev + 5); // Refund points on error
      
      if (error.status === 429) {
        showToastMessage('راهم غاشي بزاف، اصبر دقيقة 😅', 'error');
      } else {
        showToastMessage('حدث خطأ، حاول مرة أخرى', 'error');
      }
    }
  };

  const getDzexamsUrl = () => {
    if (!level || !subject) return '#';
    
    const levelMap = {
      'middle': 'bem',
      'high': 'bac'
    };
    
    const subjectObj = subjects.find(s => s.ar === subject);
    const levelEn = levelMap[level] || level;
    
    return `https://www.dzexams.com/ar/${levelEn}/${subjectObj?.en || 'mathematics'}`;
  };

  const exportToPDF = async () => {
    showToastMessage('جاري التحميل...', 'success');
    // In real implementation: use jsPDF or similar
    setTimeout(() => {
      showToastMessage('تم التحميل بنجاح! 📄', 'success');
    }, 1000);
  };

  const exportToWord = async () => {
    showToastMessage('جاري التحميل...', 'success');
    // In real implementation: use docx library
    setTimeout(() => {
      showToastMessage('تم التحميل بنجاح! 📝', 'success');
    }, 1000);
  };

  const exportToImage = async () => {
    showToastMessage('جاري التحميل...', 'success');
    // In real implementation: use html-to-image
    setTimeout(() => {
      showToastMessage('تم التحميل بنجاح! 🖼️', 'success');
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-slate-100 pb-24 relative overflow-hidden" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&family=Poppins:wght@900&display=swap" rel="stylesheet" />
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out; }
        .animate-slideDown { animation: slideDown 0.3s ease-out; }
        .pulse-ring { animation: pulse-ring 2s ease-out infinite; }
      `}</style>

      {/* Background */}
      <div className="fixed top-0 right-0 w-96 h-96 bg-emerald-400/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      
      {/* Toast */}
      {showToast && (
        <div className="fixed top-4 left-4 right-4 z-50 animate-slideDown">
          <div className={`${toastType === 'success' ? 'bg-gradient-to-r from-emerald-500 to-emerald-600' : 'bg-gradient-to-r from-rose-500 to-orange-500'} text-white px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-3`}>
            {toastType === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            <p className="text-sm font-medium">{toastMessage}</p>
          </div>
        </div>
      )}

      {/* Ad Timer Modal */}
      {showAdTimer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 max-w-sm w-full text-center animate-fadeIn">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full mx-auto flex items-center justify-center mb-4 relative">
              <Play className="w-10 h-10 text-white" />
              <div className="absolute inset-0 rounded-full border-4 border-amber-500/30 pulse-ring" />
            </div>
            <h3 className="text-xl font-black text-slate-800 mb-2">مشاهدة الإعلان</h3>
            <p className="text-slate-600 mb-6">سيتم إضافة 10 نقاط بعد {adTimer} ثواني</p>
            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-1000"
                style={{ width: `${((5 - adTimer) / 5) * 100}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-emerald-100/50 shadow-sm">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25 rotate-3">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-800 tracking-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  mo5tasar
                </h1>
                <p className="text-[10px] text-emerald-600 font-bold tracking-wider">
                  مختصر بالذكاء الاصطناعي
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 text-white px-3 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-amber-500/25">
                <Coins className="w-4 h-4" />
                <span className="font-black text-sm">{points}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="px-4 pt-6 pb-4 max-w-2xl mx-auto">
        {/* Mode Toggle */}
        <div className="mb-6">
          <div className="bg-white rounded-3xl p-1.5 shadow-lg shadow-emerald-500/5 border border-emerald-100/50">
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => setMode('ocr')}
                className={`px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 ${
                  mode === 'ocr'
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Camera className="w-4 h-4 inline-block mr-2 mb-0.5" />
                تصوير / رفع
              </button>
              <button
                onClick={() => setMode('curriculum')}
                className={`px-4 py-3.5 rounded-2xl font-bold text-sm transition-all duration-300 ${
                  mode === 'curriculum'
                    ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg shadow-emerald-500/30'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <BookOpen className="w-4 h-4 inline-block mr-2 mb-0.5" />
                بحث في المنهاج
              </button>
            </div>
          </div>
        </div>

        {/* OCR Mode */}
        {mode === 'ocr' && !showResult && (
          <div className="space-y-4 animate-fadeIn">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative bg-white rounded-3xl border-2 border-dashed p-8 transition-all duration-300 ${
                dragActive ? 'border-emerald-500 bg-emerald-50/50 scale-[1.02]' : 'border-slate-200 hover:border-emerald-300'
              }`}
            >
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-50 rounded-2xl mx-auto flex items-center justify-center">
                  <Upload className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                  <p className="text-slate-700 font-bold mb-1">اسحب وأفلت الصورة هنا</p>
                  <p className="text-slate-500 text-sm">أو اضغط لاختيار ملف</p>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={handleFileInput}
                />
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-lg shadow-slate-200/50 border border-slate-100">
              <label className="text-slate-700 font-bold mb-3 block">أو اكتب النص / عنوان الدرس:</label>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows="6"
                placeholder="مثال: الانزيمات
أو الصق النص الكامل هنا..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
              />
              <button
                onClick={handleSummarize}
                disabled={points < 5}
                className="mt-4 w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Sparkles className="w-5 h-5" />
                ابدأ التلخيص (-5 نقاط)
              </button>
            </div>
          </div>
        )}

        {/* Curriculum Mode */}
        {mode === 'curriculum' && !showResult && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-white rounded-3xl p-5 shadow-lg shadow-slate-200/50 border border-slate-100">
              <label className="text-slate-700 font-bold mb-3 block text-sm">المستوى التعليمي</label>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full bg-gradient-to-r from-emerald-50 to-emerald-100/50 border-2 border-emerald-200 rounded-2xl px-4 py-4 text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer"
              >
                <option value="">اختر المستوى</option>
                {levels.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
              </select>
            </div>

            {(level === 'middle' || level === 'high') && (
              <div className="bg-white rounded-3xl p-5 shadow-lg shadow-slate-200/50 border border-slate-100">
                <label className="text-slate-700 font-bold mb-3 block text-sm">السنة الدراسية</label>
                <select
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="w-full bg-gradient-to-r from-emerald-50 to-emerald-100/50 border-2 border-emerald-200 rounded-2xl px-4 py-4 text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer"
                >
                  <option value="">اختر السنة</option>
                  {years[level]?.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
            )}

            <div className="bg-white rounded-3xl p-5 shadow-lg shadow-slate-200/50 border border-slate-100">
              <label className="text-slate-700 font-bold mb-3 block text-sm">المادة</label>
              <select
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-gradient-to-r from-emerald-50 to-emerald-100/50 border-2 border-emerald-200 rounded-2xl px-4 py-4 text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none cursor-pointer"
              >
                <option value="">اختر المادة</option>
                {subjects.map(s => <option key={s.ar} value={s.ar}>{s.ar}</option>)}
              </select>
            </div>

            <button
              onClick={handleSummarize}
              disabled={!level || !subject || points < 5}
              className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold py-5 rounded-2xl shadow-lg shadow-emerald-500/30 hover:shadow-xl hover:shadow-emerald-500/40 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              ابحث واحصل على التلخيص (-5 نقاط)
            </button>
          </div>
        )}

        {/* Earn Points Section */}
        {!showResult && (
          <div className="mt-6 bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-6 text-white shadow-xl shadow-amber-500/25">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8" />
                <div>
                  <p className="font-black text-lg">اربح نقاط مجانية!</p>
                  <p className="text-sm text-amber-100">شاهد إعلان قصير</p>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowAdTimer(true)}
              className="w-full bg-white text-amber-600 font-bold py-3 rounded-xl hover:bg-amber-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5" />
              مشاهدة إعلان (+10 نقاط)
            </button>
          </div>
        )}

        {/* Processing State */}
        {isProcessing && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-emerald-500/10 border border-emerald-100">
              <div className="flex items-center justify-between mb-4">
                <span className="text-slate-700 font-bold">
                  {ocrProgress > 0 ? 'جاري قراءة الصورة...' : 'جاري التلخيص...'}
                </span>
                <span className="text-emerald-600 font-black text-lg">
                  {ocrProgress > 0 ? ocrProgress : aiProgress}%
                </span>
              </div>
              <div className="h-3 bg-gradient-to-r from-slate-100 to-slate-50 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${ocrProgress > 0 ? ocrProgress : aiProgress}%` }}
                />
              </div>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-6 shadow-xl shadow-emerald-500/25 text-white overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="flex items-start gap-4" key={currentTip}>
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0 backdrop-blur-sm">
                    {studyTips[currentTip].icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-bold text-lg mb-1">{studyTips[currentTip].text}</p>
                    <p className="text-emerald-100 text-sm opacity-90">{studyTips[currentTip].subtext}</p>
                  </div>
                </div>
                <div className="flex gap-1.5 mt-4 justify-center">
                  {studyTips.map((_, idx) => (
                    <div
                      key={idx}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === currentTip ? 'w-8 bg-white' : 'w-1.5 bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Result */}
        {showResult && summary && (
          <div className="space-y-4 animate-fadeIn" ref={summaryRef}>
            <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-3xl p-4 shadow-xl shadow-emerald-500/25 flex items-center gap-3 text-white">
              <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
              <span className="font-bold">تم التلخيص بنجاح! ✨</span>
            </div>

            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-6">
              {/* Main Idea */}
              <div>
                <h3 className="text-emerald-600 font-black text-sm mb-3 flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                  الفكرة الرئيسية
                </h3>
                <p className="text-slate-700 leading-relaxed">{summary.mainIdea}</p>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

              {/* Key Points */}
              <div>
                <h3 className="text-emerald-600 font-black text-sm mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                  النقاط الأساسية
                </h3>
                <div className="space-y-3">
                  {summary.keyPoints.map((point, idx) => (
                    <div key={idx} className="flex gap-3 items-start">
                      <div className="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full" />
                      </div>
                      <p className="text-slate-700 flex-1">{point}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

              {/* Expected Question */}
              <div>
                <h3 className="text-emerald-600 font-black text-sm mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                  سؤال متوقع في الامتحان
                </h3>
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
                  <p className="font-bold text-blue-900 mb-3">{summary.expectedQuestion.question}</p>
                  <div className="bg-white rounded-xl p-3 border border-blue-100">
                    <p className="text-slate-700 text-sm leading-relaxed">{summary.expectedQuestion.answer}</p>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

              {/* dzexams Insights */}
              <div>
                <h3 className="text-emerald-600 font-black text-sm mb-4 flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-emerald-500 rounded-full" />
                  ملاحظات من أرشيف dzexams
                </h3>
                <div className="space-y-2">
                  {summary.dzexamsInsights.map((insight, idx) => (
                    <div key={idx} className="bg-slate-50 rounded-xl p-3 flex items-start gap-2">
                      <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-white text-xs font-bold">{idx + 1}</span>
                      </div>
                      <p className="text-slate-700 text-sm flex-1">{insight}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <button 
                  onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                  className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-emerald-500/30 hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  <Download className="w-5 h-5" />
                  تحميل
                  <ChevronDown className={`w-4 h-4 transition-transform ${showDownloadMenu ? 'rotate-180' : ''}`} />
                </button>
                
                {showDownloadMenu && (
                  <div className="absolute bottom-full mb-2 left-0 right-0 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn">
                    <button onClick={exportToPDF} className="w-full px-4 py-3 hover:bg-slate-50 transition-colors flex items-center gap-3 text-slate-700 font-bold">
                      <FileText className="w-5 h-5 text-red-500" />
                      PDF
                    </button>
                    <button onClick={exportToWord} className="w-full px-4 py-3 hover:bg-slate-50 transition-colors flex items-center gap-3 text-slate-700 font-bold border-t border-slate-100">
                      <FileText className="w-5 h-5 text-blue-500" />
                      Word
                    </button>
                    <button onClick={exportToImage} className="w-full px-4 py-3 hover:bg-slate-50 transition-colors flex items-center gap-3 text-slate-700 font-bold border-t border-slate-100">
                      <ImageIcon className="w-5 h-5 text-purple-500" />
                      PNG
                    </button>
                  </div>
                )}
              </div>
              
              <a 
                href={getDzexamsUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-500/30 hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-5 h-5" />
                فروض واختبارات
              </a>
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <p className="text-amber-800 text-xs leading-relaxed text-center">
                <strong>mo5tasar:</strong> هذا التلخيص تم بواسطة الذكاء الاصطناعي للمساعدة؛ تأكد من كتابك المدرسي.
              </p>
            </div>

            {/* New Summary Button */}
            <button
              onClick={() => {
                setShowResult(false);
                setInputText('');
                setShowDownloadMenu(false);
              }}
              className="w-full bg-white text-emerald-600 border-2 border-emerald-500 font-bold py-4 rounded-2xl hover:bg-emerald-50 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              تلخيص جديد
            </button>
          </div>
        )}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-3 z-50 shadow-2xl shadow-slate-900/5">
        <div className="max-w-2xl mx-auto flex items-center justify-around">
          {[
            { icon: <History className="w-6 h-6" />, label: 'السجل', id: 'history' },
            { icon: <Home className="w-6 h-6" />, label: 'الرئيسية', id: 'home' },
            { icon: <Settings className="w-6 h-6" />, label: 'الإعدادات', id: 'settings' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 px-6 py-2 rounded-2xl transition-all min-h-[52px] ${
                activeTab === item.id ? 'text-emerald-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className={`transition-all ${activeTab === item.id ? 'scale-110' : ''}`}>
                {item.icon}
              </div>
              <span className="text-[10px] font-bold">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}