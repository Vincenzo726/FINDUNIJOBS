import React, { useState } from 'react';
import {
  Sparkles,
  Send,
  FileText,
  UserCheck,
  HelpCircle,
  PenTool,
  RefreshCw,
  Copy,
  Check,
  Bot,
  GraduationCap,
  Briefcase,
  Compass,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const CareerAdvisorPage: React.FC = () => {
  const { candidateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<'chat' | 'cv_review' | 'summary' | 'interview' | 'cover_letter'>('chat');

  // Chat State
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([
    {
      role: 'assistant',
      content: `Hello! I am **FJ Career AI**, your intelligent career companion for university students, NYSC members, and early-career professionals. 

I can help you prepare for interviews, optimize your CV, formulate high-impact application strategies, and discover the best career opportunities in Nigeria and remote markets. 

How can I help advance your career today?`,
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  // Tool States
  const [cvText, setCvText] = useState(
    `Education: BSc Computer Science, University of Lagos (2024)\nSkills: Python, JavaScript, SQL, React\nExperience: Intern at Tech Startup (6 months)\nProjects: Student Portal Web App, Inventory System`
  );
  const [cvTargetRole, setCvTargetRole] = useState('Junior Backend Developer');
  const [toolResult, setToolResult] = useState<string | null>(null);
  const [isToolLoading, setIsToolLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  // Summary State
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [university, setUniversity] = useState(candidateProfile?.university || 'University of Lagos');
  const [skills, setSkills] = useState((candidateProfile?.skills || ['Python', 'SQL', 'FastAPI']).join(', '));

  // Interview Prep State
  const [interviewRole, setInterviewRole] = useState('Entry-Level Data Analyst');
  const [industry, setIndustry] = useState('Fintech & Banking');

  // Cover Letter State
  const [clJobTitle, setClJobTitle] = useState('Graduate Trainee - Technology');
  const [clCompany, setClCompany] = useState('Leading Financial Institution');
  const [clBackground, setClBackground] = useState('Graduated with strong analytical and programming foundation');

  const samplePrompts = [
    'How can an NYSC member land a remote junior role before service year ends?',
    'What key technical projects should I build for Nigerian fintech engineering roles?',
    'How do I structure my resume with no corporate experience?',
    'What are the most common questions in graduate trainee interviews in Nigeria?',
  ];

  const handleSendChat = async (promptToSend?: string) => {
    const text = promptToSend || chatInput;
    if (!text.trim() || isChatLoading) return;

    const updated = [...messages, { role: 'user' as const, content: text.trim() }];
    setMessages(updated);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const res = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim() }),
      });
      const data = await res.json();
      setMessages([...updated, { role: 'assistant', content: data.reply }]);
    } catch {
      setMessages([
        ...updated,
        {
          role: 'assistant',
          content: 'Focus on highlighting measurable project results, quantifiable impact, and clear alignment with the employer’s tech stack.',
        },
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const handleRunTool = async (type: string, payload: any) => {
    setIsToolLoading(true);
    setToolResult(null);
    try {
      const res = await fetch('/api/ai/career-tools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolType: type, payload }),
      });
      const data = await res.json();
      setToolResult(data.result);
    } catch {
      setToolResult('Unable to complete request at this time. Please retry.');
    } finally {
      setIsToolLoading(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Brand Header */}
      <div className="text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 mb-3 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>FJ CAREER AI</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
          Your Intelligent Career Companion
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Built for Nigerian university students, graduates, and early-career professionals.
          Access intelligent mentorship, ATS resume optimization, interview coaching, and career guidance.
        </p>
      </div>

      {/* Tool Navigation Tabs */}
      <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2 border-b border-slate-200">
        <button
          onClick={() => {
            setActiveTab('chat');
            setToolResult(null);
          }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'chat'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>Career Advisor Chat</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('cv_review');
            setToolResult(null);
          }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'cv_review'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>CV &amp; Resume Review</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('summary');
            setToolResult(null);
          }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'summary'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          <span>Professional Summary</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('interview');
            setToolResult(null);
          }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'interview'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <HelpCircle className="w-4 h-4" />
          <span>Interview Prep Coach</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('cover_letter');
            setToolResult(null);
          }}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'cover_letter'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <PenTool className="w-4 h-4" />
          <span>Cover Letter Drafter</span>
        </button>
      </div>

      {/* TAB 1: Chat Mode */}
      {activeTab === 'chat' && (
        <div className="space-y-4">
          {/* Quick Prompts */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider mr-1">
              Suggested Topics:
            </span>
            {samplePrompts.map((p) => (
              <button
                key={p}
                onClick={() => handleSendChat(p)}
                className="text-[11px] font-medium bg-white border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/50 text-slate-700 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                "{p}"
              </button>
            ))}
          </div>

          {/* Chat Container */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-[520px] overflow-hidden">
            <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex items-start gap-3 ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {m.role === 'assistant' && (
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs flex items-center justify-center shrink-0 border border-emerald-200">
                      FJ
                    </div>
                  )}

                  <div
                    className={`max-w-2xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                      m.role === 'user'
                        ? 'bg-emerald-600 text-white font-medium rounded-tr-none'
                        : 'bg-slate-50 text-slate-800 border border-slate-200/80 rounded-tl-none'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {isChatLoading && (
                <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
                  <RefreshCw className="w-4 h-4 text-emerald-600 animate-spin" />
                  <span>FJ Career AI is preparing your guidance...</span>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-3 border-t border-slate-200 bg-slate-50/60">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendChat();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask FJ Career AI anything about applications, interviews, skills or career transitions..."
                  className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || isChatLoading}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CV Review */}
      {activeTab === 'cv_review' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>ATS CV &amp; Resume Review</span>
            </h3>
            <p className="text-xs text-slate-500">
              Paste your qualifications, skills, and project summaries to receive comprehensive ATS feedback, keyword gap analysis, and tailored bullet improvements.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Role</label>
              <input
                type="text"
                value={cvTargetRole}
                onChange={(e) => setCvTargetRole(e.target.value)}
                placeholder="e.g. Junior Backend Developer / Graduate Trainee"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">CV Content / Experience</label>
              <textarea
                rows={9}
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>

            <button
              onClick={() => handleRunTool('cv_review', { targetRole: cvTargetRole, cvText })}
              disabled={isToolLoading || !cvText.trim()}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {isToolLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Resume...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze CV for {cvTargetRole}</span>
                </>
              )}
            </button>
          </div>

          <div className="md:col-span-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 min-h-[350px] flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                AI Evaluation Feedback
              </span>
              {toolResult && (
                <button
                  onClick={() => handleCopy(toolResult)}
                  className="inline-flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>

            {toolResult ? (
              <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex-1 overflow-y-auto">
                {toolResult}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
                <FileText className="w-10 h-10 mb-2 text-slate-300" />
                <p className="text-xs font-medium">
                  Click "Analyze CV" to receive ATS insights, keyword checks, and suggested bullet points.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: Professional Summary Generator */}
      {activeTab === 'summary' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-emerald-600" />
              <span>Professional Summary Generator</span>
            </h3>
            <p className="text-xs text-slate-500">
              Generate 3 modern, polished bio summaries for your CV header, LinkedIn headline, or application cover note.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Role</label>
              <input
                type="text"
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                placeholder="e.g. Software Engineer / Data Analyst"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">University / Academic Institution</label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="e.g. University of Lagos (UNILAG)"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Key Skills &amp; Tools</label>
              <input
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. Python, SQL, Tableau, Agile"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              onClick={() => handleRunTool('summary_generator', { targetRole, university, skills })}
              disabled={isToolLoading || !targetRole.trim()}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {isToolLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Drafting Summaries...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Professional Summaries</span>
                </>
              )}
            </button>
          </div>

          <div className="md:col-span-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 min-h-[350px] flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Generated Bio Options
              </span>
              {toolResult && (
                <button
                  onClick={() => handleCopy(toolResult)}
                  className="inline-flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>

            {toolResult ? (
              <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex-1 overflow-y-auto">
                {toolResult}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
                <UserCheck className="w-10 h-10 mb-2 text-slate-300" />
                <p className="text-xs font-medium">
                  Fill in your details and click Generate to produce 3 tailored professional summaries.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: Interview Prep Coach */}
      {activeTab === 'interview' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-emerald-600" />
              <span>Interview Prep Coach (STAR Method)</span>
            </h3>
            <p className="text-xs text-slate-500">
              Practice situational, competency, and technical questions commonly asked in Nigerian corporate graduate recruitment and remote international interviews.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Position</label>
              <input
                type="text"
                value={interviewRole}
                onChange={(e) => setInterviewRole(e.target.value)}
                placeholder="e.g. Entry-Level Data Analyst / Graduate Trainee"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Target Industry / Domain</label>
              <input
                type="text"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                placeholder="e.g. FinTech, Banking, Consulting, FMCG"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              onClick={() => handleRunTool('interview_prep', { targetRole: interviewRole, industry })}
              disabled={isToolLoading || !interviewRole.trim()}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {isToolLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Generating Interview Scenario Guide...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Interview Questions &amp; Frameworks</span>
                </>
              )}
            </button>
          </div>

          <div className="md:col-span-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 min-h-[350px] flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Interview Prep Guide
              </span>
              {toolResult && (
                <button
                  onClick={() => handleCopy(toolResult)}
                  className="inline-flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>

            {toolResult ? (
              <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex-1 overflow-y-auto">
                {toolResult}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
                <HelpCircle className="w-10 h-10 mb-2 text-slate-300" />
                <p className="text-xs font-medium">
                  Select your target role and generate realistic interview questions with STAR method answer strategies.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5: Cover Letter Drafter */}
      {activeTab === 'cover_letter' && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-6 bg-white p-6 rounded-2xl border border-slate-200 space-y-4 shadow-xs">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <PenTool className="w-4 h-4 text-emerald-600" />
              <span>Tailored Cover Letter Drafter</span>
            </h3>
            <p className="text-xs text-slate-500">
              Generate a tailored, articulate application letter for any vacancy in seconds.
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Job Title</label>
              <input
                type="text"
                value={clJobTitle}
                onChange={(e) => setClJobTitle(e.target.value)}
                placeholder="e.g. Graduate Trainee / Junior Product Associate"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Company / Organization</label>
              <input
                type="text"
                value={clCompany}
                onChange={(e) => setClCompany(e.target.value)}
                placeholder="e.g. Flutterwave, Paystack, Stanbic IBTC"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Your Key Qualifications</label>
              <textarea
                rows={3}
                value={clBackground}
                onChange={(e) => setClBackground(e.target.value)}
                placeholder="Key strengths, degree, experience or projects you want highlighted"
                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500"
              />
            </div>

            <button
              onClick={() =>
                handleRunTool('cover_letter', {
                  jobTitle: clJobTitle,
                  company: clCompany,
                  candidateName: candidateProfile?.fullName || 'Candidate',
                  background: clBackground,
                })
              }
              disabled={isToolLoading || !clJobTitle.trim()}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              {isToolLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Drafting Cover Letter...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Draft Professional Cover Letter</span>
                </>
              )}
            </button>
          </div>

          <div className="md:col-span-6 bg-slate-50 p-6 rounded-2xl border border-slate-200 min-h-[350px] flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Generated Cover Letter
              </span>
              {toolResult && (
                <button
                  onClick={() => handleCopy(toolResult)}
                  className="inline-flex items-center gap-1 text-xs text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              )}
            </div>

            {toolResult ? (
              <div className="text-xs sm:text-sm text-slate-800 leading-relaxed whitespace-pre-line bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs flex-1 overflow-y-auto font-sans">
                {toolResult}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
                <PenTool className="w-10 h-10 mb-2 text-slate-300" />
                <p className="text-xs font-medium">
                  Provide position details and generate an articulate, personalized application letter.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
