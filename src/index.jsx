import { createRoot } from 'react-dom/client';
import React, { useState } from 'react';
import { 
  Camera, Settings, History, Home, Sparkles, 
  ChevronDown, Coins, Zap, Sun, Moon, Trash2, SlidersHorizontal, X, RotateCcw
} from 'lucide-react';

export default function Mo5tasarUltimate() {
  const [activeTab, setActiveTab] = useState('home'); 
  const [mode, setMode] = useState('text'); 
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [points, setPoints] = useState(20);
  
  // حالات المنهاج
  const [level, setLevel] = useState('');
  const [year, setYear] = useState('');

  // حالات الإعدادات
  const [detail, setDetail] = useState('مختصر');
  const [style, setStyle] = useState('بسيط وواضح');

  const theme = {
    bg: isDarkMode ? 'bg-[#0B0F17]' : 'bg-[#F8FAFC]',
    card: isDarkMode ? 'bg-[#161B26] border-slate-800' : 'bg-white border-slate-200',
    text: isDarkMode ? 'text-white' : 'text-slate-900',
    input: isDarkMode ? 'bg-[#0B0F17] border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
  };

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} pb-32 transition-all duration-300 font-sans text-right`} style={{ direction: 'rtl' }}>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet" />
      
      {/* 1. Header (النقاط + التبديل) */}
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
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black" style={{ fontFamily: 'Cairo' }}>مختصر</h1>
          <div className="bg-emerald-500 p-2 rounded-xl shadow-lg shadow-emerald-500/30">
            <Sparkles size={20} className="text-white fill-current" />
          </div>
        </div>
      </header>

      <main className="px-6 max-w-md mx-auto mt-2 space-y-6">
        
        {/* شاشة الرئيسية */}
        {activeTab === 'home' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* أزرار التبديل */}
            <div className={`p-1.5 rounded-2xl flex gap-2 border ${isDarkMode ? 'bg-slate-800/30 border-slate-800' : 'bg-slate-200 border-transparent'}`}>
              <button onClick={() => setMode('text')} className={`flex-1 py-3 rounded-xl font-bold transition-all ${mode === 'text' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500'}`}>نص حر</button>
              <button onClick={() => setMode('curriculum')} className={`flex-1 py-3 rounded-xl font-bold transition-all ${mode === 'curriculum' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500'}`}>المنهاج</button>
            </div>

            {/* البطاقة الرئيسية */}
            <div className={`${theme.card} rounded-[35px] p-7 border shadow-2xl relative overflow-hidden`}>
              {mode === 'text' ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center opacity-50 text-xs font-bold">
                    <button className="hover:text-red-500"><X size={16} /></button>
                    <span>ألحق الدرس أو اكتب النص</span>
                  </div>
                  <textarea className={`w-full h-44 rounded-2xl p-5 outline-none resize-none border text-lg ${theme.input}`} placeholder="اكتب هنا أو الصق النص..." />
                </div>
              ) : (
                <div className="space-y-5">
                  <p className="text-center text-sm font-bold opacity-60">اختر تفاصيل الدرس ليتم تلخيصه حسب المنهاج</p>
                  
                  <div className="space-y-4">
                    <select value={level} onChange={(e)=>setLevel(e.target.value)} className={`w-full p-4 rounded-xl border font-bold outline-none ${theme.input}`}>
                      <option value="">اختر المستوى</option>
                      <option value="ثانوي">ثانوي</option>
                      <option value="متوسط">متوسط</option>
                    </select>

                    {level === 'ثانوي' && (
                      <select value={year} onChange={(e)=>setYear(e.target.value)} className={`w-full p-4 rounded-xl border font-bold outline-none animate-in slide-in-from-top-2 ${theme.input}`}>
                        <option value="">اختر السنة</option>
                        <option>1 ثانوي</option><option>2 ثانوي</option><option>3 ثانوي (بكالوريا)</option>
                      </select>
                    )}

                    {year && (
                      <select className={`w-full p-4 rounded-xl border font-bold outline-none animate-in slide-in-from-top-2 ${theme.input}`}>
                        <option value="">اختر المادة</option>
                        <option>علوم طبيعية</option><option>فيزياء</option><option>فلسفة</option><option>تاريخ وجغرافيا</option>
                      </select>
                    )}
                  </div>
                  
                  <button onClick={()=>{setLevel(''); setYear('')}} className="flex items-center gap-1 text-xs font-bold opacity-40 hover:opacity-100 transition-opacity">
                    <RotateCcw size={12} /> إعادة التعيين
                  </button>
                </div>
              )}

              <button className="w-full mt-8 bg-emerald-500 text-white py-5 rounded-[22px] font-black text-xl shadow-xl shadow-emerald-500/20 active:scale-95 transition-all flex items-center justify-center gap-3">
                ابدأ التلخيص <Sparkles size={24} />
              </button>
            </div>

            {/* --- الكاميرا (الطلب الأساسي) --- */}
            <button className="w-full bg-[#E67E22] hover:bg-[#D35400] text-white py-5 rounded-[22px] font-black text-xl shadow-lg transition-all flex items-center justify-center gap-3 active:scale-95">
              <Camera size={26} /> مسح النص بالكاميرا
            </button>

            {/* زيادة النقاط */}
            <button onClick={() => {setPoints(points + 10); alert('تمت إضافة 10 نقاط! 🎁')}} className={`${theme.card} p-5 rounded-[24px] border flex items-center justify-between active:scale-[0.98] transition-all`}>
              <div className="bg-amber-500 text-white text-[10px] font-black px-2 py-1 rounded-lg">+10 نقاط</div>
              <div className="flex items-center gap-3">
                <p className="font-bold text-sm">شاهد إعلان لزيادة النقاط</p>
                <Zap size={18} className="text-amber-500 fill-amber-500" />
              </div>
            </button>
          </div>
        )}

        {/* شاشة السجل */}
        {activeTab === 'history' && (
          <div className="space-y-4 animate-in slide-in-from-left-5">
            <h2 className="text-xl font-black mb-4">سجل التلخيصات</h2>
            {[1, 2, 3].map(i => (
              <div key={i} className={`${theme.card} p-5 rounded-2xl border flex justify-between items-center shadow-md`}>
                <Trash2 size={18} className="text-red-500 opacity-40 hover:opacity-100 cursor-pointer" />
                <div className="text-right">
                  <p className="font-bold">ملخص درس التاريخ #{i}</p>
                  <p className="text-xs opacity-50">منذ {i} يوم</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* شاشة الإعدادات */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-in slide-in-from-right-5">
            <div className={`${theme.card} p-7 rounded-[30px] border shadow-2xl space-y-8`}>
              <div className="flex items-center gap-2 text-emerald-500 font-black border-b border-slate-700/20 pb-4">
                <SlidersHorizontal size={22} /> <h2 className="text-lg">إعدادات وتفضيلات التلخيص</h2>
              </div>
              
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <select value={detail} onChange={(e)=>setDetail(e.target.value)} className={`p-2 rounded-lg border font-bold outline-none ${theme.input}`}>
                    <option>مختصر جداً</option><option>مختصر</option><option>تفصيلي</option>
                  </select>
                  <span className="font-bold text-sm">درجة الاختصار</span>
                </div>

                <div className="flex justify-between items-center">
                  <select value={style} onChange={(e)=>setStyle(e.target.value)} className={`p-2 rounded-lg border font-bold outline-none ${theme.input}`}>
                    <option>بسيط وواضح</option><option>أكاديمي</option><option>على شكل نقاط</option>
                  </select>
                  <span className="font-bold text-sm">أسلوب اللغة</span>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-700/20">
                  <div className="w-12 h-6 bg-emerald-500 rounded-full relative">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md" />
                  </div>
                  <span className="font-bold text-sm">الحفظ التلقائي للسجل</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Navigation Bar */}
      <nav className={`fixed bottom-6 left-6 right-6 ${theme.card} h-22 rounded-[30px] shadow-2xl flex justify-around items-center px-4 border z-50`}>
        {[
          { id: 'settings', icon: <Settings />, label: 'الإعدادات' },
          { id: 'home', icon: <Home />, label: 'الرئيسية' },
          { id: 'history', icon: <History />, label: 'السجل' }
        ].map((item) => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex-1 flex flex-col items-center gap-1.5 transition-all ${activeTab === item.id ? 'text-emerald-500 scale-110' : 'text-slate-500'}`}>
            <div className={`p-2.5 rounded-2xl transition-all ${activeTab === item.id ? 'bg-emerald-500/10' : ''}`}>{item.icon}</div>
            <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Mo5tasarUltimate />);
}
