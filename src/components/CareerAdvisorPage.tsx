import React, { useState } from 'react';
import { Send, GraduationCap, Sparkles, User, RefreshCw, MessageSquare } from 'lucide-react';

export const CareerAdvisorPage: React.FC = () => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: `Hello! I'm your FJ FindUniJob Career Advisor. I help university students and recent graduates navigate the job market, prepare for technical & competency interviews, and tailor CVs for early-career schemes. What's on your mind today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const sampleQuestions = [
    'How can I stand out for a Tech Graduate Scheme without prior internship experience?',
    'What key technical skills should a 2026 Computer Science student focus on for backend roles?',
    'How should I format my university projects on my resume to impress hiring managers?',
    'What questions should I ask during a junior job interview?',
  ];

  const handleSend = async (textToSend?: string) => {
    const query = textToSend || input;
    if (!query.trim() || isLoading) return;

    const newMessages = [...messages, { role: 'user' as const, content: query.trim() }];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query.trim() }),
      });

      const data = await res.json();
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: data.reply || 'Focus on consistent practice, project building, and structured communication.',
        },
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: 'I experienced a brief connection interruption. As a general rule for university applications, always highlight 2-3 tangible projects with measurable outcomes on your CV.',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 mb-2">
          <GraduationCap className="w-4 h-4 text-indigo-600" />
          <span>GEMINI AI CAREER MENTOR</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
          University & Early Career Advisor
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto mt-1">
          Ask questions about interview strategies, CV feedback, portfolio building, and landing your first graduate offer.
        </p>
      </div>

      {/* Suggested Prompts */}
      <div className="mb-6">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-yellow-500" />
          <span>Suggested Questions for Students</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {sampleQuestions.map((q) => (
            <button
              key={q}
              onClick={() => handleSend(q)}
              className="text-left p-3 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 text-xs text-slate-700 transition-colors shadow-2xs font-medium cursor-pointer"
            >
              "{q}"
            </button>
          ))}
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[520px] overflow-hidden">
        {/* Messages Scroll Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
          {messages.map((m, idx) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={idx}
                className={`flex gap-3 max-w-[85%] ${
                  isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                    isUser
                      ? 'bg-slate-900 text-white'
                      : 'bg-indigo-600 text-white shadow-xs'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                </div>

                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-indigo-600 text-white rounded-tr-none'
                      : 'bg-slate-50 border border-slate-200/80 text-slate-800 rounded-tl-none whitespace-pre-wrap'
                  }`}
                >
                  {m.content}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 max-w-[80%]">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center shrink-0">
                <RefreshCw className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 rounded-tl-none flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce delay-100" />
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce delay-200" />
                <span>Advisor is crafting tailored recommendations...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-slate-100 bg-slate-50/50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask anything about student applications, interviews, or skills..."
              disabled={isLoading}
              className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
