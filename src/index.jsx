import { createRoot } from 'react-dom/client';
import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, Upload, Download, ExternalLink, BookOpen, Settings, 
  History, Home, Sparkles, Zap, Brain, AlertCircle, CheckCircle2, 
  Coffee, Timer, Droplet, Wind, Trophy, Play, FileText, 
  Image as ImageIcon, Coins, ChevronDown, Copy, Share2
} from 'lucide-react';
import Tesseract from 'tesseract.js';
import { aiService } from './aiService';
import { exportToPDF, exportToWord, exportToImage } from './exportUtils';

// --- قاعدة بيانات المناهج ---
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
  
  const [points, setPoints] = useState(() => {
    const saved = localStorage.getItem('mo5tasar_points');
    return saved ? parseInt(saved) : 100;
  });

  useEffect(() => {
    localStorage.setItem('mo5tasar_points', points.toString());
  }, [points]);

  const handleSummarize = async () => {
    if (points < 10) {
      alert('نقاطك غير كافية! شاهد إعلان لشحن النقاط 🎯');
      return;
    }
    
    // التحقق من المدخلات في وضع المنهاج
    if (mode === 'curriculum' && (!level || !year || !subject)) {
      alert('يرجى اختيار الطور، السنة، والمادة أولاً');
      return;
    }

    setIsProcessing(true);
    try {
      const result = await aiService.generateSummary(inputText, { 
        level: level ? curriculumData[level].label : 'عام', 
        subject: subject || 'عام',
        isDetailed 
      });
      setSummary(result);
      setShowResult(true);
      setPoints(prev => prev - 10);
    } catch (error) {
      alert('حدث خطأ في الاتصال بالذكاء الاصطناعي');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24 relative overflow-hidden" style={{ fontFamily: "'Cairo', sans-serif", direction: 'rtl' }}>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet" />
      
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-emerald-100 p-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
          <div className="bg-emerald-500 p-2 rounded-xl shadow-lg shadow-emerald-200">
            <Sparkles className="text-white w-5 h-5" />
          </div>
          <h1 className="text-xl font-black text-slate-800">مختصر</h1>
        </div>
        <div className="bg-amber-500 text-white px-3 py-1.5 rounded-xl flex items-center gap-2 font-bold shadow-md shadow-amber-200">
          <Coins className="w-4 h-4" /> {points}
        </div>
      </header>

      <main className="px-4 pt-6 max-w-2xl mx-auto">
        {!showResult ? (
          <div className="space-y-6">
            {/* Mode Switcher */}
            <div className="bg-white p-1 rounded-2xl shadow-sm border flex gap-1">
              <button 
                onClick={() => setMode('ocr')} 
                className={`flex-1 py-3 rounded-xl font-bold transition-all ${mode === 'ocr' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'text-slate-500'}`}
              >
                نص حر / تصوير
              </button>
              <button 
                onClick={() => setMode('curriculum')} 
                className={`flex-1 py-3 rounded-xl font-bold transition-all ${mode === 'curriculum' ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' : 'text-slate-500'}`}
              >
                المنهاج الدراسي
              </button>
            </div>

            <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-100">
              {mode === 'ocr' ? (
                <textarea 
                  className="w-full h-40 p-4 bg-slate-50 rounded-2xl border-none focus:ring-2 focus:ring-emerald-500 outline-none text-right"
                  placeholder="اكتب أو الصق الدرس هنا..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              ) : (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                  <select 
                    className="w-full p-4 rounded-2xl border bg-slate-50 font-bold outline-none" 
                    value={level}
                    onChange={(e) => { setLevel(e.target.value); setYear(''); setSubject(''); }}
                  >
                    <option value="">اختر الطور التعليمي</option>
                    <option value="primary">الابتدائي</option>
                    <option value="middle">المتوسط</option>
                    <option value="high">الثانوي</option>
                  </select>

                  {level && (
                    <select 
                      className="w-full p-4 rounded-2xl border bg-slate-50 font-bold outline-none animate-in slide-in-from-top-2"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                    >
                      <option value="">اختر السنة الدراسية</option>
                      {curriculumData[level].years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  )}

                  {year && (
                    <select 
                      className="w-full p-4 rounded-2xl border bg-slate-50 font-bold outline-none animate-in slide-in-from-top-2"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    >
                      <option value="">اختر المادة</option>
                      {curriculumData[level].subjects.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  )}
                </div>
              )}

              {/* Detail Level Toggle */}
              <div className="flex items-center justify-between mt-6 bg-slate-50 p-3 rounded-2xl">
                <span className="font-bold text-slate-600 text-sm">نوع التلخيص:</span>
                <button 
                  onClick={() => setIsDetailed(!isDetailed)}
                  className={`px-4 py-1.5 rounded-xl font-bold text-xs transition-all ${isDetailed ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' : 'bg-amber-100 text-amber-600 border border-amber-200'}`}
                >
                  {isDetailed ? 'مفصل شامل' : 'موجز سريع'}
                </button>
              </div>

              <button 
                onClick={handleSummarize}
                disabled={isProcessing || !inputText && mode === 'ocr'}
                className="w-full mt-4 bg-emerald-500 text-white py-4 rounded-2xl font-black shadow-lg shadow-emerald-200 active:scale-95 transition-all disabled:opacity-50"
              >
                {isProcessing ? 'جاري التحليل والتلخيص...' : 'ابدأ التلخيص الآن ✨'}
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in text-right pb-10">
            <div className="bg-white p-6 rounded-3xl shadow-xl border border-emerald-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-emerald-600 font-black flex items-center gap-2">
                  <div className="w-1.5 h-6 bg-emerald-500 rounded-full" /> ملخص {subject || 'الدرس'}
                </h3>
                <div className="flex gap-2">
                  <button onClick={() => exportToPDF("ملخص مختصر", summary?.details)} className="p-2 bg-slate-50 rounded-lg text-slate-500"><Download size={20}/></button>
                  <button onClick={() => navigator.clipboard.writeText(summary?.details)} className="p-2 bg-slate-50 rounded-lg text-slate-500"><Copy size={20}/></button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-emerald-50/50 p-4 rounded-2xl border border-emerald-100">
                  <h4 className="font-bold text-emerald-700 mb-2 underline">الفكرة الرئيسية:</h4>
                  <p className="text-slate-700 leading-relaxed font-bold">{summary?.mainIdea}</p>
                </div>

                <div>
                  <h4 className="font-bold text-slate-800 mb-2">التفاصيل:</h4>
                  <p className="text-slate-600 leading-relaxed whitespace-pre-line">{summary?.details}</p>
                </div>

                {summary?.terms && (
                  <div className="bg-amber-50/50 p-4 rounded-2xl border border-amber-100">
                    <h4 className="font-bold text-amber-700 mb-2">مصطلحات هامة:</h4>
                    <p className="text-slate-600 text-sm italic">{summary?.terms}</p>
                  </div>
                )}
              </div>
              
              <button
                onClick={() => { setShowResult(false); setSummary(null); }}
                className="w-full mt-8 bg-slate-800 text-white font-bold py-4 rounded-2xl hover:bg-slate-700 transition-all flex items-center justify-center gap-2"
              >
                تلخيص درس آخر
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Nav */}
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
                activeTab === item.id ? 'text-emerald-600' : 'text-slate-400'
              }`}
            >
              {item.icon}
              <span className="text-[10px] font-bold">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Mo5tasarApp />);
}
