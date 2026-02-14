import { createRoot } from 'react-dom/client';
import React, { useState } from 'react';
import { 
  Camera, Settings, History, Home, Sparkles, 
  ChevronDown, Coins, Zap, Sun, Moon 
} from 'lucide-react';

export default function Mo5tasarAdaptive() {
  const [activeTab, setActiveTab] = useState('home');
  const [mode, setMode] = useState('text');
  const [isDarkMode, setIsDarkMode] = useState(true); // هنا التحكم في الوضع

  // تعريف الألوان حسب الوضع
  const theme = {
    bg: isDarkMode ? 'bg-[#0B0F17]' : 'bg-[#F8FAFC]',
    card: isDarkMode ? 'bg-[#161B26] border-slate-800' : 'bg-white border-slate-100',
    text: isDarkMode ? 'text-white' : 'text-slate-800',
    subtext: isDarkMode ? 'text-slate-400' : 'text-slate-500',
    nav: isDarkMode ? 'bg-[#161B26]/90 border-slate-800' : 'bg-white/90 border-slate-200',
    input: isDarkMode ? 'bg-white text-slate-800' : 'bg-slate-50 text-slate-800 border-slate-200'
  };

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} pb-32 transition-colors duration-500 font-['Cairo'] text-right`} style={{ direction: 'rtl' }}>
      <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap" rel="stylesheet" />

      {/* Header مع زر التبديل */}
      <header className={`p-6 flex justify-between items-center sticky top-0 z-50 ${isDarkMode ? 'bg-[#0B0F17]/80' : 'bg-white/80'} backdrop-blur-xl`}>
        <div className="flex items-center gap-3">
           <div className={`${isDarkMode ? 'bg-[#1A1F2B]' : 'bg-amber-50'} px-4 py-2 rounded-2xl flex items-center gap-2 border ${isDarkMode ? 'border-amber-500/30' : 'border-amber-200'}`}>
            <span className="font-bold text-amber-500">20</span>
            <Coins className="w-4 h-4 text-amber-500" />
          </div>
          {/* زر التبديل السحري */}
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-xl border ${isDarkMode ? 'border-slate-700 bg-slate-800 text-yellow-400' : 'border-slate-200 bg-white text-slate-600'} transition-all active:scale-90`}
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-black uppercase tracking-tighter">مختصر</h1>
          <div className="bg-emerald-500 p-2 rounded-xl shadow-lg">
            <Sparkles className="text-white w-5 h-5" />
          </div>
        </div>
      </header>

      <main className="px-6 max-w-md mx-auto space-y-6 mt-4">
        {/* Toggle Switch */}
        <div className={`${isDarkMode ? 'bg-[#1A1F2B]' : 'bg-slate-200/50'} p-1.5 rounded-[22px] flex gap-2 border ${isDarkMode ? 'border-slate-800' : 'border-transparent'}`}>
          <button 
            onClick={() => setMode('text')}
            className={`flex-1 py-3 rounded-[18px] font-black transition-all ${mode === 'text' ? 'bg-emerald-500 text-white' : theme.subtext}`}
          >
            نص حر
          </button>
          <button 
            onClick={() => setMode('curriculum')}
            className={`flex-1 py-3 rounded-[18px] font-black transition-all ${mode === 'curriculum' ? 'bg-emerald-500 text-white' : theme.subtext}`}
          >
            المنهاج
          </button>
        </div>

        {/* Card Content */}
        <div className={`${theme.card} rounded-[40px] p-8 border shadow-2xl transition-all duration-500`}>
          {mode === 'text' ? (
            <textarea 
              className={`w-full h-44 rounded-[28px] p-6 outline-none text-lg font-medium resize-none shadow-inner ${theme.input} border`}
              placeholder="اكتب هنا أو الصق النص..."
            />
          ) : (
            <div className="space-y-4">
              {['المستوى', 'السنة', 'المادة'].map(item => (
                <div key={item} className={`p-4 rounded-2xl border flex justify-between items-center ${isDarkMode ? 'bg-[#0B0F17] border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
                  <ChevronDown className="w-4 h-4 opacity-50" />
                  <span className="font-bold">اختر {item}</span>
                </div>
              ))}
            </div>
          )}
          <button className="w-full mt-6 bg-emerald-500 hover:bg-emerald-400 text-white py-4 rounded-[22px] font-black text-lg shadow-lg active:scale-95 transition-all">
            ابدأ التلخيص ✨
          </button>
        </div>
      </main>

      {/* Nav */}
      <nav className={`fixed bottom-6 left-6 right-6 ${theme.nav} h-20 rounded-[30px] shadow-2xl flex justify-around items-center px-4 border`}>
        {[{ id: 'settings', icon: <Settings />, label: 'الإعدادات' }, { id: 'home', icon: <Home />, label: 'الرئيسية' }, { id: 'history', icon: <History />, label: 'السجل' }].map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 ${activeTab === item.id ? 'text-emerald-500' : 'text-slate-400'}`}
          >
            {item.icon}
            <span className="text-[10px] font-bold">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Mo5tasarAdaptive />);
}
