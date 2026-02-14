import { createRoot } from 'react-dom/client';
import React, { useState } from 'react';
import { 
  Camera, Settings, History, Home, Sparkles, 
  ChevronDown, Coins, Zap, Sun, Moon, Trash2, SlidersHorizontal 
} from 'lucide-react';

export default function Mo5tasarFinal() {
  const [activeTab, setActiveTab] = useState('home'); // التنقل بين الصفحات
  const [mode, setMode] = useState('text'); // نص حر أو منهاج
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [points, setPoints] = useState(20);
  
  // المنهاج (الجزائر 🇩🇿)
  const [level, setLevel] = useState('');
  const [year, setYear] = useState('');

  // إعدادات شات جيبيتي (الدقة)
  const [detail, setDetail] = useState('مختصر');
  const [style, setStyle] = useState('بسيط');

  const theme = {
    bg: isDarkMode ? 'bg-[#0B0F17]' : 'bg-[#F1F5F9]',
    card: isDarkMode ? 'bg-[#161B26] border-slate-800' : 'bg-white border-slate-200',
    text: isDarkMode ? 'text-white' : 'text-slate-900',
    input: isDarkMode ? 'bg-[#0B0F17] border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
  };

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} pb-32 transition-all duration-300 font-sans text-right`} style={{ direction: 'rtl' }}>
      
      {/* 1. Header (النقاط + التبديل) */}
      <header className="p-5 flex justify-between items-center sticky top-0 z-50 backdrop-blur-lg">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500/10 px-4 py-2 rounded-2xl border border-amber-500/20 flex items-center gap-2">
            <span className="font-bold text-amber-500">{points}</span>
            <Coins size={18} className="text-amber-500" />
          </div>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2.5 rounded-xl bg-slate-800/50 text-yellow-400 border border-slate-700">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} className="text-slate-400" />}
          </button>
        </div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black tracking-tighter">مختصر</h1>
          <div className="bg-emerald-500 p-2 rounded-xl shadow-lg shadow-emerald-500/20">
            <Sparkles size={20} className="text-white fill-current" />
          </div>
        </div>
      </header>

      <main className="px-6 max-w-md mx-auto mt-2">
        
        {/* صفحة الرئيسية */}
        {activeTab === 'home' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* التبديل بين النص والمنهاج */}
            <div className="bg-slate-800/30 p-1.5 rounded-2xl flex gap-2 border border-slate-800">
              <button onClick={() => setMode('text')} className={`flex-1 py-3 rounded-xl font-bold transition-all ${mode === 'text' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500'}`}>نص حر</button>
              <button onClick={() => setMode('curriculum')} className={`flex-1 py-3 rounded-xl font-bold transition-all ${mode === 'curriculum' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500'}`}>المنهاج</button>
            </div>

            {/* البطاقة المركزية */}
            <div className={`${theme.card} rounded-[32px] p-6 border shadow-2xl`}>
              {mode === 'text' ? (
                <textarea className={`w-full h-40 rounded-2xl p-4 outline-none resize-none border ${theme.input}`} placeholder="أدخل النص هنا..." />
              ) : (
                <div className="space-y-4">
                  <select onChange={(e)=>setLevel(e.target.value)} className={`w-full p-4 rounded-xl border font-bold outline-none ${theme.input}`}>
                    <option value="">اختر الطور</option>
                    <option value="ثانوي">ثانوي</option>
                    <option value="متوسط">متوسط</option>
                  </select>
                  
                  {level === 'ثانوي' && (
                    <select onChange={(e)=>setYear(e.target.value)} className={`w-full p-4 rounded-xl border font-bold outline-none animate-in slide-in-from-top-2 ${theme.input}`}>
                      <option value="">اختر السنة</option>
                      <option value="1">1 ثانوي</option><option value="2">2 ثانوي</option><option value="3">3 ثانوي (بكالوريا)</option>
                    </select>
                  )}

                  {year && (
                    <select className={`w-full p-4 rounded-xl border font-bold outline-none animate-in slide-in-from-top-2 ${theme.input}`}>
                      <option>اختر المادة</option>
                      <option>علوم طبيعية</option><option>فيزياء</option><option>فلسفة</option>
                    </select>
                  )}
                </div>
              )}
              <button className="w-full mt-6 bg-emerald-500 text-white py-4 rounded-2xl font-black text-lg active:scale-95 transition-all shadow-xl shadow-emerald-500/20">ابدأ التلخيص ✨</button>
            </div>

            {/* زيادة النقاط بالإعلانات */}
            <button onClick={() => {setPoints(points + 10); alert('تمت إضافة 10 نقاط! 🎁')}} className="w-full bg-slate-800/40 border border-amber-500/20 p-5 rounded-3xl flex items-center justify-between group active:scale-95 transition-all">
              <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-1 rounded-lg">+10 نقاط</span>
              <div className="flex items-center gap-3">
                <p className="font-bold text-sm">شاهد إعلان لزيادة النقاط</p>
                <Zap size={18} className="text-amber-500 fill-amber-500" />
              </div>
            </button>
          </div>
        )}

        {/* صفحة السجل */}
        {activeTab === 'history' && (
          <div className="space-y-4 animate-in slide-in-from-left-4">
            <h2 className="text-xl font-black mb-4">سجل العمليات</h2>
            {[1, 2].map(i => (
              <div key={i} className={`${theme.card} p-4 rounded-2xl border flex justify-between items-center`}>
                <Trash2 size={18} className="text-red-500 opacity-50 hover:opacity-100 cursor-pointer" />
                <div className="text-right">
                  <p className="font-bold">ملخص درس التاريخ #{i}</p>
                  <p className="text-xs opacity-50">14 فيفري 2026</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* صفحة الإعدادات (دقة شات جيبيتي) */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <div className={`${theme.card} p-6 rounded-[30px] border space-y-6`}>
              <div className="flex items-center gap-2 text-emerald-500 font-black border-b border-slate-700/50 pb-3">
                <SlidersHorizontal size={20} /> <span>إعدادات التلخيص</span>
              </div>
              <div className="flex justify-between items-center">
                <select value={detail} onChange={(e)=>setDetail(e.target.value)} className={`p-2 rounded-lg border font-bold ${theme.input}`}>
                  <option>مختصر</option><option>متوسط</option><option>تفصيلي</option>
                </select>
                <span className="font-bold">حجم التلخيص</span>
              </div>
              <div className="flex justify-between items-center">
                <select value={style} onChange={(e)=>setStyle(e.target.value)} className={`p-2 rounded-lg border font-bold ${theme.input}`}>
                  <option>بسيط</option><option>أكاديمي</option><option>بالنقاط</option>
                </select>
                <span className="font-bold">نوع الأسلوب</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Navigation Bar */}
      <nav className={`fixed bottom-6 left-6 right-6 ${theme.card} h-20 rounded-[28px] shadow-2xl flex justify-around items-center px-4 border`}>
        {[
          { id: 'settings', icon: <Settings />, label: 'الإعدادات' },
          { id: 'home', icon: <Home />, label: 'الرئيسية' },
          { id: 'history', icon: <History />, label: 'السجل' }
        ].map((item) => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex-1 flex flex-col items-center gap-1 transition-all ${activeTab === item.id ? 'text-emerald-500 scale-110' : 'text-slate-500'}`}>
            <div className={`p-2 rounded-xl ${activeTab === item.id ? 'bg-emerald-500/10 shadow-glow' : ''}`}>{item.icon}</div>
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
  root.render(<Mo5tasarFinal />);
}
