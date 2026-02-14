import { createRoot } from 'react-dom/client';
import React, { useState, useEffect } from 'react';
import { 
  Camera, Settings, History, Home, Sparkles, 
  ChevronDown, Coins, Zap, Sun, Moon, Trash2, 
  SlidersHorizontal, X, RotateCcw, Copy, Share2, ArrowRight
} from 'lucide-react';

export default function Mo5tasarCompleteApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [mode, setMode] = useState('text');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [points, setPoints] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);

  // إعدادات المنهاج والملخص
  const [level, setLevel] = useState('');
  const [year, setYear] = useState('');
  const [detail, setDetail] = useState('مختصر');
  const [style, setStyle] = useState('بسيط وواضح');

  const theme = {
    bg: isDarkMode ? 'bg-[#0B0F17]' : 'bg-[#F8FAFC]',
    card: isDarkMode ? 'bg-[#161B26] border-slate-800' : 'bg-white border-slate-200',
    text: isDarkMode ? 'text-white' : 'text-slate-900',
    input: isDarkMode ? 'bg-[#0B0F17] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
  };

  // دالة محاكاة التلخيص
  const handleStartSummary = () => {
    if (points < 5) {
      alert("نقاطك لا تكفي! شاهد إعلاناً للحصول على المزيد.");
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowResult(true);
      setPoints(prev => prev - 5);
    }, 2000);
  };

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} pb-32 transition-all duration-300 font-sans text-right`} style={{ direction: 'rtl' }}>
      
      {/* 1. Header */}
      <header className="p-5 flex justify-between items-center sticky top-0 z-50 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500/10 px-4 py-2 rounded-2xl border border-amber-500/20 flex items-center gap-2">
            <span className="font-bold text-amber-500">{points}</span>
            <Coins size={18} className="text-amber-500" />
          </div>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2.5 rounded-xl bg-slate-800/20 border border-slate-700/50 text-yellow-500">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} className="text-slate-400" />}
          </button>
        </div>
        <div className="flex items-center gap-2 font-black text-2xl">
          <h1>مختصر</h1>
          <div className="bg-emerald-500 p-2 rounded-xl shadow-lg shadow-emerald-500/30">
            <Sparkles size={20} className="text-white fill-current" />
          </div>
        </div>
      </header>

      <main className="px-6 max-w-md mx-auto mt-2">
        
        {/* --- حالة التحميل --- */}
        {isLoading && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center gap-4">
            <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-white font-black text-xl animate-pulse">جاري الذكاء الاصطناعي...</p>
          </div>
        )}

        {/* --- شاشة النتيجة --- */}
        {showResult && (
          <div className="space-y-6 animate-in zoom-in-95 duration-300">
            <button onClick={() => setShowResult(false)} className="flex items-center gap-2 text-emerald-500 font-bold mb-2">
              <ArrowRight size={20} /> العودة للتعديل
            </button>
            <div className={`${theme.card} rounded-[35px] p-8 border shadow-2xl space-y-6`}>
              <h2 className="text-xl font-black border-b border-slate-800/20 pb-4">نتائج التلخيص ✨</h2>
              <div className={`p-5 rounded-2xl text-lg leading-relaxed ${isDarkMode ? 'bg-black/20' : 'bg-slate-50'}`}>
                {style === 'على شكل نقاط' ? (
                  <ul className="list-disc list-inside space-y-2">
                    <li>الفكرة الرئيسية الأولى للدرس.</li>
                    <li>أهم القوانين المستخلصة.</li>
                    <li>الخلاصة النهائية والنتائج.</li>
                  </ul>
                ) : (
                  <p>هذا نص تجريبي يوضح كيف سيظهر التلخيص الـ {detail} بأسلوب {style}. يتم الآن معالجة البيانات بناءً على منهاج الـ {level} لتوفير أفضل تجربة تعليمية.</p>
                )}
              </div>
              <div className="flex gap-3">
                <button onClick={() => alert('تم النسخ')} className="flex-1 bg-emerald-500 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 active:scale-95 transition-all">
                  <Copy size={18} /> نسخ
                </button>
                <button className={`flex-1 py-4 rounded-2xl font-bold border flex items-center justify-center gap-2 active:scale-95 transition-all ${theme.card}`}>
                  <Share2 size={18} /> مشاركة
                </button>
              </div>
            </div>
          </div>
        )}

        {/* --- الواجهة الرئيسية (تظهر فقط إذا لم تكن هناك نتيجة) --- */}
        {!showResult && activeTab === 'home' && (
          <div className="space-y-6 animate-in fade-in">
            <div className={`p-1.5 rounded-2xl flex gap-2 border ${isDarkMode ? 'bg-slate-800/30 border-slate-800' : 'bg-slate-200 border-transparent'}`}>
              <button onClick={() => setMode('text')} className={`flex-1 py-3 rounded-xl font-bold transition-all ${mode === 'text' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500'}`}>نص حر</button>
              <button onClick={() => setMode('curriculum')} className={`flex-1 py-3 rounded-xl font-bold transition-all ${mode === 'curriculum' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500'}`}>المنهاج</button>
            </div>

            <div className={`${theme.card} rounded-[35px] p-7 border shadow-2xl`}>
              {mode === 'text' ? (
                <textarea className={`w-full h-44 rounded-2xl p-5 outline-none resize-none border text-lg ${theme.input}`} placeholder="الصق درسك هنا..." />
              ) : (
                <div className="space-y-4">
                  <select value={level} onChange={(e)=>setLevel(e.target.value)} className={`w-full p-4 rounded-xl border font-bold outline-none ${theme.input}`}>
                    <option value="">اختر الطور</option>
                    <option value="ثانوي">ثانوي</option><option value="متوسط">متوسط</option>
                  </select>
                  {level && (
                    <select value={year} onChange={(e)=>setYear(e.target.value)} className={`w-full p-4 rounded-xl border font-bold outline-none animate-in slide-in-from-top-2 ${theme.input}`}>
                      <option value="">اختر السنة</option>
                      <option>1 ثانوي</option><option>2 ثانوي</option><option>3 ثانوي (بكالوريا)</option>
                    </select>
                  )}
                </div>
              )}
              <button onClick={handleStartSummary} className="w-full mt-8 bg-emerald-500 text-white py-5 rounded-[22px] font-black text-xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-3">
                ابدأ التلخيص <Sparkles size={24} />
              </button>
            </div>

            <button className="w-full bg-[#E67E22] text-white py-5 rounded-[24px] font-black text-xl shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95">
              <Camera size={26} /> مسح النص بالكاميرا
            </button>

            <button onClick={() => setPoints(p => p + 10)} className={`${theme.card} p-5 rounded-[24px] border flex items-center justify-between`}>
              <div className="bg-amber-500 text-white text-[10px] font-black px-2 py-1 rounded-lg">+10 نقاط</div>
              <p className="font-bold text-sm">شاهد إعلان لزيادة النقاط</p>
              <Zap size={18} className="text-amber-500 fill-amber-500" />
            </button>
          </div>
        )}

        {/* شاشة السجل */}
        {activeTab === 'history' && !showResult && (
          <div className="space-y-4 animate-in slide-in-from-left-4">
            <h2 className="text-xl font-black mb-4 pr-2">آخر التلخيصات</h2>
            {[1, 2].map(i => (
              <div key={i} className={`${theme.card} p-5 rounded-2xl border flex justify-between items-center shadow-sm`}>
                <Trash2 size={18} className="text-red-500 opacity-30" />
                <div className="text-right">
                  <p className="font-bold">ملخص درس العلوم #{i}</p>
                  <p className="text-xs opacity-50">14 فيفري 2026</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* شاشة الإعدادات */}
        {activeTab === 'settings' && !showResult && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <div className={`${theme.card} p-7 rounded-[30px] border shadow-2xl space-y-8`}>
              <h2 className="text-xl font-black text-emerald-500 flex items-center gap-2 border-b pb-4"><Settings /> الإعدادات</h2>
              <div className="flex justify-between items-center">
                <select value={detail} onChange={(e)=>setDetail(e.target.value)} className={`p-2 rounded-lg border font-bold ${theme.input}`}>
                  <option>مختصر</option><option>تفصيلي</option>
                </select>
                <span className="font-bold">درجة الاختصار</span>
              </div>
              <div className="flex justify-between items-center">
                <select value={style} onChange={(e)=>setStyle(e.target.value)} className={`p-2 rounded-lg border font-bold ${theme.input}`}>
                  <option>بسيط وواضح</option><option>على شكل نقاط</option>
                </select>
                <span className="font-bold">أسلوب اللغة</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Navigation */}
      <nav className={`fixed bottom-6 left-6 right-6 ${theme.card} h-22 rounded-[30px] shadow-2xl flex justify-around items-center px-4 border z-50`}>
        {[
          { id: 'settings', icon: <Settings />, label: 'الإعدادات' },
          { id: 'home', icon: <Home />, label: 'الرئيسية' },
          { id: 'history', icon: <History />, label: 'السجل' }
        ].map((item) => (
          <button key={item.id} onClick={() => {setActiveTab(item.id); setShowResult(false)}} className={`flex-1 flex flex-col items-center gap-1.5 transition-all ${activeTab === item.id ? 'text-emerald-500 scale-110' : 'text-slate-500'}`}>
            <div className={`p-2.5 rounded-2xl ${activeTab === item.id ? 'bg-emerald-500/10' : ''}`}>{item.icon}</div>
            <span className="text-[10px] font-black">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Mo5tasarCompleteApp />);
}
