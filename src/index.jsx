import { createRoot } from 'react-dom/client';
import React, { useState } from 'react';
import { 
  Camera, Settings, History, Home, Sparkles, 
  ChevronDown, Coins, Zap, Sun, Moon, Trash2, SlidersHorizontal, X
} from 'lucide-react';

export default function Mo5tasarFinalv2() {
  const [activeTab, setActiveTab] = useState('home'); 
  const [mode, setMode] = useState('text'); 
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [points, setPoints] = useState(20);
  
  // نظام المنهاج (الخيارات تظهر بناءً على ما قبله)
  const [level, setLevel] = useState('');
  const [year, setYear] = useState('');

  // الإعدادات (دقة GPT)
  const [summaryDetail, setSummaryDetail] = useState('مختصر');
  const [summaryStyle, setSummaryStyle] = useState('بسيط وواضح');

  const theme = {
    bg: isDarkMode ? 'bg-[#0B0F17]' : 'bg-[#F1F5F9]',
    card: isDarkMode ? 'bg-[#161B26] border-slate-800' : 'bg-white border-slate-200',
    text: isDarkMode ? 'text-white' : 'text-slate-900',
    subtext: isDarkMode ? 'text-slate-400' : 'text-slate-500',
    input: isDarkMode ? 'bg-[#0B0F17] border-slate-700 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
  };

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} pb-32 transition-all duration-300 font-sans text-right`} style={{ direction: 'rtl' }}>
      
      {/* 1. Header (دقة كلاود وفخامة جيبيتي) */}
      <header className="p-5 flex justify-between items-center sticky top-0 z-50 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="bg-amber-500/10 px-4 py-2 rounded-2xl border border-amber-500/20 flex items-center gap-2">
            <span className="font-bold text-amber-500">{points}</span>
            <Coins size={18} className="text-amber-500 shadow-glow" />
          </div>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className={`p-2.5 rounded-xl border ${isDarkMode ? 'bg-slate-800/50 border-slate-700 text-yellow-400' : 'bg-white border-slate-200 text-slate-500'}`}>
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
        <div className="flex items-center gap-2 font-black text-2xl">
          <h1 className="tracking-tighter">مختصر</h1>
          <div className="bg-emerald-500 p-2 rounded-xl">
            <Sparkles size={20} className="text-white fill-current" />
          </div>
        </div>
      </header>

      <main className="px-6 max-w-md mx-auto mt-2">
        
        {/* --- الشاشة الرئيسية --- */}
        {activeTab === 'home' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* أزرار التبديل (كلاود) */}
            <div className={`p-1.5 rounded-2xl flex gap-2 border ${isDarkMode ? 'bg-slate-800/30 border-slate-800' : 'bg-slate-200/50 border-slate-200'}`}>
              <button onClick={() => setMode('text')} className={`flex-1 py-3 rounded-xl font-bold transition-all ${mode === 'text' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500'}`}>نص حر</button>
              <button onClick={() => setMode('curriculum')} className={`flex-1 py-3 rounded-xl font-bold transition-all ${mode === 'curriculum' ? 'bg-emerald-500 text-white shadow-lg' : 'text-slate-500'}`}>المنهاج</button>
            </div>

            {/* البطاقة الذكية */}
            <div className={`${theme.card} rounded-[32px] p-6 border shadow-2xl transition-all`}>
              {mode === 'text' ? (
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs font-bold opacity-50 px-2 uppercase">
                    <button onClick={() => {}}><X size={14} /></button>
                    <span>أدخل النص المراد تلخيصه</span>
                  </div>
                  <textarea className={`w-full h-44 rounded-2xl p-4 outline-none resize-none border text-lg ${theme.input}`} placeholder="اكتب هنا أو الصق النص..." />
                </div>
              ) : (
                <div className="space-y-4 py-2">
                  <div className="text-sm font-bold opacity-70 mb-2 px-1 text-center">اختر تفاصيل الدرس ليتم تلخيصه حسب المنهاج</div>
                  
                  {/* القوائم التفاعلية (حل مشكلة عدم الظهور) */}
                  <div className="relative">
                    <select value={level} onChange={(e)=>setLevel(e.target.value)} className={`w-full p-4 pr-10 rounded-xl border font-bold outline-none appearance-none ${theme.input}`}>
                      <option value="">اختر الطور</option>
                      <option value="ثانوي">ثانوي</option>
                      <option value="متوسط">متوسط</option>
                    </select>
                    <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                  </div>

                  {level === 'ثانوي' && (
                    <div className="relative animate-in slide-in-from-top-2">
                      <select value={year} onChange={(e)=>setYear(e.target.value)} className={`w-full p-4 pr-10 rounded-xl border font-bold outline-none appearance-none ${theme.input}`}>
                        <option value="">اختر السنة</option>
                        <option value="1">السنة 1 ثانوي</option>
                        <option value="2">السنة 2 ثانوي</option>
                        <option value="3">السنة 3 ثانوي (بكالوريا)</option>
                      </select>
                      <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                    </div>
                  )}

                  {year && (
                    <div className="relative animate-in slide-in-from-top-2">
                      <select className={`w-full p-4 pr-10 rounded-xl border font-bold outline-none appearance-none ${theme.input}`}>
                        <option value="">اختر المادة</option>
                        <option>علوم طبيعية</option><option>فيزياء</option><option>فلسفة</option><option>تاريخ وجغرافيا</option>
                      </select>
                      <ChevronDown className="absolute left-4 top-1/2 -translate-y-1/2 opacity-30" size={18} />
                    </div>
                  )}
                </div>
              )}
              <button className="w-full mt-6 bg-emerald-500 text-white py-4 rounded-2xl font-black text-lg active:scale-95 transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2">
                ابدأ التلخيص <Sparkles size={20} />
              </button>
            </div>

            {/* زيادة النقاط (تعمل فعلياً) */}
            <button onClick={() => {setPoints(points + 10); alert('تمت مشاهدة الإعلان! مبروك +10 نقاط 🎁')}} className={`${theme.card} p-5 rounded-[24px] border flex items-center justify-between group active:scale-[0.98] transition-all`}>
              <div className="bg-amber-500 text-white text-[10px] font-black px-2 py-1 rounded-lg animate-pulse">+10 نقاط</div>
              <div className="flex items-center gap-3">
                <p className="font-bold text-sm italic">شاهد إعلان واربح نقاط</p>
                <Zap size={18} className="text-amber-500 fill-amber-500 shadow-glow" />
              </div>
            </button>
          </div>
        )}

        {/* --- شاشة السجل (تفاعل حقيقي) --- */}
        {activeTab === 'history' && (
          <div className="space-y-4 animate-in slide-in-from-left-4">
            <h2 className="text-xl font-black mb-4 px-2">سجل التلخيصات</h2>
            {[
              { id: 1, name: 'تلخيص درس العلوم الطبيعية', time: 'منذ ساعتين' },
              { id: 2, name: 'تلخيص درس التاريخ - الثورة', time: 'أمس' }
            ].map(item => (
              <div key={item.id} className={`${theme.card} p-5 rounded-2xl border flex justify-between items-center shadow-md`}>
                <Trash2 size={18} className="text-red-500 opacity-40 hover:opacity-100 cursor-pointer transition-opacity" />
                <div className="text-right">
                  <p className="font-bold">{item.name}</p>
                  <p className={`text-xs ${theme.subtext}`}>{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* --- شاشة الإعدادات (دقة GPT) --- */}
        {activeTab === 'settings' && (
          <div className="space-y-6 animate-in slide-in-from-right-4">
            <div className={`${theme.card} p-6 rounded-[30px] border shadow-2xl space-y-8`}>
              <div className="flex items-center gap-2 text-emerald-500 font-black border-b border-slate-700/30 pb-4">
                <SlidersHorizontal size={22} /> <h2 className="text-lg">إعدادات وتفضيلات التلخيص</h2>
              </div>
              
              <div className="space-y-6 px-2">
                <div className="flex justify-between items-center">
                  <select value={summaryDetail} onChange={(e)=>setSummaryDetail(e.target.value)} className={`p-2 rounded-lg border font-bold ${theme.input} outline-none`}>
                    <option>مختصر جداً</option><option>مختصر</option><option>تفصيلي</option>
                  </select>
                  <span className="font-black text-sm">درجة الاختصار</span>
                </div>

                <div className="flex justify-between items-center">
                  <select value={summaryStyle} onChange={(e)=>setSummaryStyle(e.target.value)} className={`p-2 rounded-lg border font-bold ${theme.input} outline-none`}>
                    <option>بسيط وواضح</option><option>أكاديمي</option><option>على شكل نقاط</option>
                  </select>
                  <span className="font-black text-sm">أسلوب اللغة</span>
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-700/30">
                  <div className="w-12 h-6 bg-emerald-500 rounded-full relative shadow-inner">
                    <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-md" />
                  </div>
                  <span className="font-black text-sm">الحفظ التلقائي للسجل</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Navigation (التحكم في الشاشات) */}
      <nav className={`fixed bottom-6 left-6 right-6 ${theme.card} h-20 rounded-[28px] shadow-2xl flex justify-around items-center px-4 border z-50`}>
        {[
          { id: 'settings', icon: <Settings />, label: 'الإعدادات' },
          { id: 'home', icon: <Home />, label: 'الرئيسية' },
          { id: 'history', icon: <History />, label: 'السجل' }
        ].map((item) => (
          <button key={item.id} onClick={() => setActiveTab(item.id)} className={`flex-1 flex flex-col items-center gap-1.5 transition-all ${activeTab === item.id ? 'text-emerald-500 scale-110' : 'text-slate-500 hover:text-slate-400'}`}>
            <div className={`p-2 rounded-xl ${activeTab === item.id ? 'bg-emerald-500/10' : ''}`}>{item.icon}</div>
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
  root.render(<Mo5tasarFinalv2 />);
}
