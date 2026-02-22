import React, { useState, useEffect, useRef } from 'react';
import { 
 Sparkles, Home, History, Settings, Copy, 
 Camera, Trash2, Moon, Sun, Plus, Send, Menu, X, MessageSquare
} from 'lucide-react';

export default function Mo5tasarApp() {
  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [chatMessages, setChatMessages] = useState([]); // الذاكرة التفاعلية
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [gems, setGems] = useState(() => Number(localStorage.getItem('mo5tasar_gems')) || 100);
  
  const fileInputRef = useRef(null);
  const chatEndRef = useRef(null);

  // التمرير التلقائي لآخر رسالة
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // --- دالة المحادثة (التي تجعل الواجهة مثل جيميناي) ---
  const handleChat = async (userMessage) => {
    if (!userMessage.trim()) return;
    if (gems < 2) return alert("رصيدك منخفض! اشحن الجواهر 💎");

    const newMessage = { role: 'user', content: userMessage };
    setChatMessages(prev => [...prev, newMessage]);
    setInputText('');
    setIsProcessing(true);

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { 
          "Authorization": `Bearer ${process.env.REACT_APP_GROQ_API_KEY}`, 
          "Content-Type": "application/json" 
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: "أنت مساعد تعليمي جزائري خبير. تجيب بذكاء بناءً على المنهج الجزائري." },
            ...chatMessages,
            newMessage
          ]
        })
      });
      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      
      setChatMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
      setGems(prev => prev - 2);
    } catch (error) {
      alert("حدث خطأ في الشبكة");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={`min-h-screen flex ${isDarkMode ? 'bg-[#131314] text-white' : 'bg-white text-gray-800'} transition-colors duration-300 font-sans`}>
      
      {/* 1. Sidebar (مثل جيميناي) */}
      <aside className={`fixed lg:static inset-y-0 right-0 z-50 w-72 transform ${isSidebarOpen ? 'translate-x-0' : 'translate-x-full'} lg:translate-x-0 transition-transform duration-300 bg-[#1e1f20] border-l border-white/5 flex flex-col p-4`}>
        <button onClick={() => {setChatMessages([]); setActiveTab('home');}} className="flex items-center gap-3 bg-[#1a1c1e] hover:bg-[#282a2d] p-3 rounded-full text-sm font-medium mb-8 transition-all">
          <Plus size={20} /> محادثة جديدة
        </button>
        
        <div className="flex-1 overflow-y-auto space-y-2">
          <p className="text-[10px] text-gray-500 font-bold px-4 uppercase tracking-wider">السجل الأخير</p>
          {/* هنا تعرض عناوين الدروس السابقة */}
          <div className="flex items-center gap-3 p-3 hover:bg-[#282a2d] rounded-xl cursor-pointer text-sm">
            <MessageSquare size={16} /> تلخيص العلوم الطبيعية...
          </div>
        </div>

        <div className="mt-auto space-y-2 border-t border-white/5 pt-4">
          <button onClick={() => setIsDarkMode(!isDarkMode)} className="flex items-center gap-3 w-full p-3 hover:bg-[#282a2d] rounded-xl text-sm">
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />} الوضع {isDarkMode ? 'النهاري' : 'الليلي'}
          </button>
          <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-xl">
            <span className="text-xs font-bold text-blue-400">💎 رصيدك: {gems}</span>
            <button className="text-[10px] bg-blue-600 px-2 py-1 rounded-md text-white">شحن</button>
          </div>
        </div>
      </aside>

      {/* 2. Main Content */}
      <main className="flex-1 flex flex-col relative">
        {/* Header للجوال */}
        <header className="lg:hidden p-4 flex justify-between items-center border-b border-white/5">
          <span className="font-bold">مختصر AI</span>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}><Menu /></button>
        </header>

        {/* منطقة الدردشة */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-12 space-y-8">
          {chatMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-red-400 bg-clip-text text-transparent">
                مرحباً طه، كيف نلخص اليوم؟
              </h1>
              <div className="flex gap-4 mt-8 flex-wrap justify-center">
                <button onClick={() => fileInputRef.current.click()} className="p-6 bg-[#1e1f20] border border-white/5 rounded-2xl hover:border-emerald-500/50 transition-all flex flex-col items-center gap-2">
                  <Camera className="text-emerald-400" />
                  <span className="text-xs">تصوير درس</span>
                </button>
                <div className="p-6 bg-[#1e1f20] border border-white/5 rounded-2xl flex flex-col items-center gap-2 grayscale">
                  <History className="text-blue-400" />
                  <span className="text-xs">المنهاج الجزائري</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-6">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-3xl ${
                    msg.role === 'user' ? 'bg-[#2e2f30] text-white' : 'bg-transparent text-gray-200'
                  }`}>
                    {msg.role === 'assistant' && <Sparkles size={16} className="mb-2 text-blue-400" />}
                    <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
          )}
        </div>

        {/* 3. Floating Input Box (مثل Gemini تماماً) */}
        <div className="p-4 lg:p-8 max-w-3xl mx-auto w-full">
          <div className={`relative bg-[#1e1f20] rounded-[32px] border ${isProcessing ? 'border-blue-500/50' : 'border-white/10'} shadow-2xl p-2 flex items-center transition-all`}>
            <button onClick={() => fileInputRef.current.click()} className="p-3 text-gray-400 hover:text-white transition-colors">
              <Camera size={22} />
            </button>
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleChat(inputText)}
              placeholder="اكتب اسم الدرس أو اسألني عن أي شيء..."
              className="flex-1 bg-transparent border-none outline-none p-3 text-sm placeholder:text-gray-500"
            />
            <button 
              onClick={() => handleChat(inputText)}
              disabled={isProcessing}
              className={`p-3 rounded-full ${inputText ? 'bg-blue-600 text-white' : 'text-gray-600'} transition-all`}
            >
              {isProcessing ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Send size={20} />}
            </button>
            <input type="file" ref={fileInputRef} hidden accept="image/*" onChange={(e) => {/* دالة الـ Vision هنا */}} />
          </div>
          <p className="text-[10px] text-center mt-3 text-gray-600">قد يخطئ مختصر أحياناً، يرجى مراجعة الكتاب المدرسي.</p>
        </div>
      </main>
    </div>
  );
}
