import React, { useState, useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import { 
 Sparkles, Home, History, Settings, Copy, Camera, 
 Trash2, Moon, Sun, Plus, Send, Menu, X, MessageSquare,
 BookOpen, ChevronLeft, Layout, Zap, Lightbulb
} from 'lucide-react';

// --- 1. قاعدة بيانات المناهج الجزائرية ---
const curriculumData = {
  primary: { label: 'الابتدائي', years: ['1 ابتدائي', '2 ابتدائي', '3 ابتدائي', '4 ابتدائي', '5 ابتدائي'], subjects: ['اللغة العربية', 'الرياضيات', 'التربية الإسلامية', 'الفرنسية'] },
  middle: { label: 'المتوسط', years: ['1 متوسط', '2 متوسط', '3 متوسط', '4 متوسط'], subjects: ['اللغة العربية', 'الرياضيات', 'العلوم الطبيعية', 'الفيزياء', 'الإنجليزية'] },
  high: { label: 'الثانوي', years: ['1 ثانوي', '2 ثانوي', '3 ثانوي'], subjects: ['الرياضيات', 'الفيزياء', 'العلوم الطبيعية', 'الفلسفة', 'الأدب العربي'] }
};

export default function Mo5tasarApp() {
  // --- States ---
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDetailed, setIsDetailed] = useState(false); 
  const [toast, setToast] = useState({ show: false, msg: '' }); 
  const [selectedYear, setSelectedYear] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [chatMessages, setChatMessages] = useState([]); 
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [gems, setGems] = useState(() => Number(localStorage.getItem('mo5tasar_gems')) || 100);
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem('mo5tasar_history')) || []);
  const [view, setView] = useState('welcome'); // welcome, chat, settings
  const [curriculumStep, setCurriculumStep] = useState({ level: '', year: '', subject: '' });

  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);
  const apiKey = process.env.REACT_APP_GROQ_API_KEY;

  // --- Effects ---
  useEffect(() => { localStorage.setItem('mo5tasar_gems', gems); }, [gems]);
  useEffect(() => { localStorage.setItem('mo5tasar_history', JSON.stringify(history)); }, [history]);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMessages]);

  // --- Functions ---
const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => {
      setToast({ show: false, msg: '' });
    }, 3000);
  };
  const handleNewChat = () => {
    setChatMessages([]);
    setView('welcome');
    setCurriculumStep({ level: '', year: '', subject: '' });
  };

  // 1. معالجة الصور (Vision)
  const processImage = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      try {
        const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
          method: "POST",
          headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "llama-3.2-11b-vision-preview",
            messages: [{ role: "user", content: [{ type: "text", text: "استخرج النص التعليمي من الصورة بدقة." }, { type: "image_url", image_url: { url: reader.result } }] }]
          })
        });
        const data = await response.json();
        const text = data.choices[0].message.content;
        setInputText(text);
        showToast("تم استخراج النص! اضغط إرسال للتلخيص.");
      } catch (e) { showToast("خطأ في قراءة الصورة"); }
      finally { setIsProcessing(false); }
    };
    reader.readAsDataURL(file);
  };

  // 2. دالة الشات والتلخيص الأساسية
  const handleSendMessage = async (text) => {
    const messageToSend = text || inputText;
    if (!messageToSend.trim() || isProcessing) return;
    if (gems < 5) return showToast("رصيدك غير كافٍ 💎");

    const isFirstMessage = chatMessages.length === 0;
    const newMsg = { role: 'user', content: messageToSend };
    setChatMessages(prev => [...prev, newMsg]);
    setInputText('');
    setView('chat');
    setIsProcessing(true);

    try {
      const prompt = isFirstMessage 
        ? `أنت "مختصر" خبير المناهج الجزائرية. لخص النص التالي بأسلوب احترافي مع نقاط واضحة ونصيحة للامتحان: ${messageToSend}`
        : messageToSend;

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${apiKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "system", content: "مساعد تعليمي جزائri ذكي." }, ...chatMessages, { role: "user", content: prompt }]
        })
      });
      const data = await response.json();
      const aiRes = data.choices[0].message.content;

      setChatMessages(prev => [...prev, { role: 'assistant', content: aiRes }]);
      setGems(prev => prev - 5);
      if (isFirstMessage) setHistory(prev => [{ id: Date.now(), title: messageToSend.substring(0, 30), messages: [...chatMessages, newMsg, { role: 'assistant', content: aiRes }] }, ...prev]);
    } catch (e) { showToast("عفواً، حدث خطأ في الاتصال"); }
    finally { setIsProcessing(false); }
  };

  return (
    <div className={`flex h-screen ${isDarkMode ? 'bg-[#131314] text-[#e3e3e3]' : 'bg-[#f0f2f5] text-[#1f1f1f]'} transition-all duration-300 font-sans`} dir="rtl">
      
      {/* --- Sidebar (Gemini Style) --- */}
      <aside className={`fixed lg:static inset-y-0 right-0 z-50 w-72 transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 transition-transform duration-300 ${isDarkMode ? 'bg-[#1e1f20]' : 'bg-[#ffffff]'} border-l border-white/5 flex flex-col p-4`}>
        <button onClick={handleNewChat} className={`flex items-center gap-3 ${isDarkMode ? 'bg-[#1a1c1e] hover:bg-[#282a2d]' : 'bg-[#f0f4f9] hover:bg-[#e1e5e9]'} p-3 rounded-full text-sm font-medium mb-8 transition-all shadow-sm`}>
          <Plus size={20} /> محادثة جديدة
        </button>
        
        <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
          <p className="text-[11px] font-bold px-4 opacity-50 uppercase tracking-widest mb-4">السجل الأخير</p>
          {history.map(item => (
            <div key={item.id} onClick={() => { setChatMessages(item.messages); setView('chat'); }} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer text-sm transition-all ${isDarkMode ? 'hover:bg-[#282a2d]' : 'hover:bg-[#e9eef6]'}`}>
              <MessageSquare size={16} className="opacity-60" />
              <span className="truncate">{item.title}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto pt-4 border-t border-white/10 space-y-2">
          <button onClick={() => setView('settings')} className="flex items-center gap-3 w-full p-3 hover:bg-white/5 rounded-xl text-sm transition-all">
            <Settings size={18} /> الإعدادات
          </button>
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="flex items-center gap-3 w-full p-3 hover:bg-white/5 rounded-xl text-sm transition-all">
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />} الوضع {isDarkMode ? 'النهاري' : 'الليلي'}
          </button>
          <div className="p-3 bg-blue-500/10 rounded-2xl flex justify-between items-center border border-blue-500/20">
            <span className="text-xs font-black text-blue-400">💎 {gems} جوهرة</span>
            <button onClick={() => { setGems(g => g + 30); showToast("تمت إضافة 30 جوهرة! ✨"); }} className="text-[10px] bg-blue-600 text-white px-2 py-1 rounded-lg">شحن</button>
          </div>
        </div>
      </aside>

      {/* --- Main Area --- */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Header mobile */}
        <header className="lg:hidden p-4 flex justify-between items-center border-b border-white/5">
          <div className="flex items-center gap-2"><Sparkles className="text-blue-400" size={20}/> <span className="font-bold">مختصر AI</span></div>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2"><Menu /></button>
        </header>

        {/* Content Section */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-8">
          {view === 'welcome' && (
            <div className="h-full flex flex-col items-center justify-center max-w-3xl mx-auto text-center space-y-8 animate-in fade-in zoom-in-95 duration-500">
              <h1 className="text-4xl lg:text-6xl font-black bg-gradient-to-r from-[#4285f4] via-[#9b72f3] to-[#ea4335] bg-clip-text text-transparent pb-2">
                وي العزيز، واش نحضروا اليوم؟
              </h1>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                <div onClick={() => fileInputRef.current.click()} className={`p-6 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${isDarkMode ? 'bg-[#1e1f20] border-white/5 hover:border-blue-500/50' : 'bg-white border-gray-200 hover:shadow-md'}`}>
                  <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500"><Camera size={24}/></div>
                  <div className="text-right">
                    <p className="font-bold text-sm">صور درسك</p>
                    <p className="text-xs opacity-50">حول صورة الكتاب لملخص ذكي</p>
                  </div>
                </div>
                <div onClick={() => setView('settings')} className={`p-6 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${isDarkMode ? 'bg-[#1e1f20] border-white/5 hover:border-blue-500/50' : 'bg-white border-gray-200 hover:shadow-md'}`}>
                  <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500"><BookOpen size={24}/></div>
                  <div className="text-right">
                    <p className="font-bold text-sm">المنهاج الجزائري</p>
                    <p className="text-xs opacity-50">اختر الطور والمادة مباشرة</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {view === 'chat' && (
            <div className="max-w-4xl mx-auto space-y-8 pb-12 animate-in slide-in-from-bottom-4">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0 shadow-lg"><Sparkles size={14} className="text-white"/></div>}
                  <div className={`max-w-[85%] p-4 rounded-3xl leading-relaxed shadow-sm ${msg.role === 'user' ? (isDarkMode ? 'bg-[#2e2f30]' : 'bg-[#e9eef6]') : ''}`}>
                    <p className="text-sm md:text-base whitespace-pre-line">{msg.content}</p>
                    {msg.role === 'assistant' && <div className="flex gap-2 mt-4"><button onClick={() => navigator.clipboard.writeText(msg.content)} className="p-2 hover:bg-white/10 rounded-lg transition-all opacity-40 hover:opacity-100"><Copy size={14}/></button></div>}
                  </div>
                </div>
              ))}
              {isProcessing && <div className="flex gap-4 animate-pulse"><div className="w-8 h-8 rounded-full bg-gray-700"></div><div className="h-12 w-48 bg-gray-800 rounded-2xl"></div></div>}
              <div ref={chatEndRef} />
            </div>
          )}

          {view === 'settings' && (
  <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in duration-500">
    <button onClick={() => setView('welcome')} className="flex items-center gap-2 text-sm opacity-50 hover:opacity-100 transition-all">
      <ChevronLeft size={16}/> العودة للرئيسية
    </button>
    
    <h2 className="text-2xl font-black italic flex items-center gap-3">
      <Settings className="text-blue-500" /> ضبط المنهاج الجزائري
    </h2>

    <div className={`p-8 rounded-[2.5rem] ${isDarkMode ? 'bg-[#1e1f20] border border-white/5' : 'bg-white shadow-2xl'} space-y-8`}>
      
      {/* 1. اختيار الطور */}
      <div className="space-y-4">
        <label className="text-[10px] font-black uppercase tracking-widest opacity-40 flex items-center gap-2">
          <div className="w-1 h-1 bg-blue-500 rounded-full"></div> 1. الطور التعليمي
        </label>
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(curriculumData).map(([key, val]) => (
            <button 
              key={key} 
              onClick={() => setCurriculumStep({ level: key, year: '', subject: '' })} 
              className={`p-4 rounded-2xl text-xs font-bold border transition-all duration-300 ${curriculumStep.level === key ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20 scale-95' : 'bg-white/5 border-white/10 hover:border-white/30'}`}
            >
              {val.label}
            </button>
          ))}
        </div>
      </div>

      {/* 2. اختيار السنة (تظهر فقط بعد اختيار الطور) */}
      {curriculumStep.level && (
        <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-40 flex items-center gap-2">
            <div className="w-1 h-1 bg-emerald-500 rounded-full"></div> 2. السنة الدراسية
          </label>
          <div className="flex flex-wrap gap-2">
            {curriculumData[curriculumStep.level].years.map(year => (
              <button 
                key={year} 
                onClick={() => setCurriculumStep({ ...curriculumStep, year })}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold border transition-all ${curriculumStep.year === year ? 'bg-emerald-600 border-emerald-500 text-white shadow-emerald-500/20' : 'bg-white/5 border-white/10 hover:border-white/20'}`}
              >
                {year}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 3. اختيار المادة (تظهر فقط بعد اختيار السنة) */}
      {curriculumStep.year && (
        <div className="space-y-4 animate-in slide-in-from-right-4 duration-500">
          <label className="text-[10px] font-black uppercase tracking-widest opacity-40 flex items-center gap-2">
            <div className="w-1 h-1 bg-purple-500 rounded-full"></div> 3. المادة المراد تلخيصها
          </label>
          <div className="flex flex-wrap gap-2">
            {curriculumData[curriculumStep.level].subjects.map(sub => (
              <button 
                key={sub} 
                onClick={() => {
                  setCurriculumStep({ ...curriculumStep, subject: sub });
                  showToast(`تم ضبط المنهاج: ${curriculumStep.year} - ${sub}`);
                  // توجيه المستخدم للشات تلقائياً لبدء العمل
                  setTimeout(() => setView('welcome'), 1000);
                }} 
                className="px-5 py-2.5 bg-purple-600/10 hover:bg-purple-600 text-purple-400 hover:text-white rounded-xl text-xs font-bold transition-all border border-purple-500/20"
              >
                {sub}
              </button>
            ))}
          </div>
        </div>
      )}

    </div>
  </div>
)}

        {/* --- Floating Input (Gemini Input) --- */}
        <div className={`p-4 lg:p-8 w-full max-w-4xl mx-auto transition-all ${view === 'welcome' ? 'opacity-100' : 'bg-gradient-to-t from-[#131314] via-[#131314] to-transparent'}`}>
          <div className={`relative flex items-center gap-2 p-2 rounded-[32px] border transition-all duration-500 shadow-2xl ${isDarkMode ? 'bg-[#1e1f20] border-white/10' : 'bg-white border-gray-200'} ${isProcessing ? 'ring-2 ring-blue-500/50' : ''}`}>
            <button onClick={() => fileInputRef.current.click()} className="p-3 hover:bg-white/5 rounded-full text-gray-400 transition-all"><Camera size={22}/></button>
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="اكتب اسم الدرس أو اسأل مختصر..."
              className="flex-1 bg-transparent border-none outline-none py-3 px-2 text-sm md:text-base placeholder:text-gray-500"
            />
            <button 
              onClick={() => handleSendMessage()}
              disabled={!inputText.trim() || isProcessing}
              className={`p-3 rounded-full transition-all ${inputText.trim() && !isProcessing ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-600'}`}
            >
              {isProcessing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Send size={20} />}
            </button>
            <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={processImage} />
          </div>
         <p className="text-[10px] text-center mt-3 opacity-30">.قد يخطئ أحياناً، يرجى التحقق من المعلومات المهمة Mo5tasar</p>
        </div>
        {toast.show && (
          <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-5 duration-300">
            <div className={`
              flex items-center gap-3 px-6 py-3 rounded-2xl shadow-2xl border
              ${isDarkMode 
                ? 'bg-[#1e1f20] border-blue-500/30 text-blue-400' 
                : 'bg-white border-blue-100 text-blue-600'}
            `}>
              <div className="bg-blue-500/10 p-1.5 rounded-lg">
                <Zap size={16} className="animate-pulse" />
              </div>
              <span className="text-sm font-bold tracking-wide">{toast.msg}</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// --- Render ---
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<Mo5tasarApp />);
}
