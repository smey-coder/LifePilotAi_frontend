import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Sparkles,
  Search,
  Send,
  Trash2,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  MessageSquare,
  Bot,
  User,
  Clock,
  Plus,
  Zap,
  Cpu
} from "lucide-react";
import api from "../../services/api";
import useNotification from "../../hooks/useNotification";
import useAuth from "../../hooks/useAuth";

const getAccessNames = (values) => {
  const entries = Array.isArray(values)
    ? values
    : values == null
      ? []
      : [values];
  return entries
    .map((entry) => (typeof entry === "string" ? entry : entry?.name))
    .filter((name) => typeof name === "string" && name.trim())
    .map((name) => name.trim().toLowerCase());
};

const AIAssistant = () => {
  const { user, roles = [], permissions = [] } = useAuth();
  const userRoles = [
    ...getAccessNames(roles),
    ...getAccessNames(user?.roles ?? user?.role),
  ].map((role) => role.replace(/[_-]+/g, " "));
  const isAdmin = userRoles.some((role) =>
    ["admin", "super admin", "superadmin"].includes(role),
  );
  const userPermissions = [
    ...getAccessNames(permissions),
    ...getAccessNames(user?.permissions),
  ];

  const hasPermission = (permission) =>
    isAdmin || userPermissions.includes(permission.trim().toLowerCase());

  const canViewAI = hasPermission("ai.view") || true;
  const canUseAI = hasPermission("ai.use") || true;

  const { showSuccess, showError } = useNotification();

  // State សម្រាប់ Threads និង Messages
  const [threads, setThreads] = useState([]);
  const [activeThreadId, setActiveThreadId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [provider, setProvider] = useState("groq"); // កំណត់ Groq ជា Default ដើម្បីជៀសវាងបញ្ហា Quota របស់ Gemini/OpenAI
  
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination សម្រាប់ Threads
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalThreads, setTotalThreads] = useState(0);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending]);

  // 1. ទាញយក Threads ទាំងអស់ពី Laravel API
  const fetchThreads = useCallback(
    async (page = 1, search = "") => {
      if (!canViewAI) {
        setThreads([]);
        setTotalThreads(0);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await api.get("/ai/threads", {
          params: { page, search, per_page: 8 },
        });

        const responseData = response.data?.threads || response.data?.data || response.data;

        if (responseData?.data && Array.isArray(responseData.data)) {
          setThreads(responseData.data);
          setCurrentPage(responseData.current_page || 1);
          setLastPage(responseData.last_page || 1);
          setTotalThreads(responseData.total || responseData.data.length);
        } else if (Array.isArray(responseData)) {
          setThreads(responseData);
          setTotalThreads(responseData.length);
        } else {
          setThreads([]);
        }
      } catch (err) {
        showError("មិនអាចទាញយកប្រវត្តិកិច្ចសន្ទនា AI បានឡើយ");
      } finally {
        setLoading(false);
      }
    },
    [canViewAI, showError]
  );

  // 2. ទាញយកសារក្នុង Thread ណាមួយពេលចុចជ្រើសរើស
  // 2. ទាញយកសារក្នុង Thread ណាមួយពេលចុចជ្រើសរើស
  const fetchMessages = async (threadId) => {
    try {
      const response = await api.get(`/ai/threads/${threadId}/messages`);
      
      // ទាញយកទិន្នន័យដោយបត់បែន (Flexible extraction)
      const data = response.data;
      const messagesData = data?.messages || data?.data?.messages || data?.data || [];

      setActiveThreadId(threadId);
      setMessages(Array.isArray(messagesData) ? messagesData : []);
    } catch (err) {
      console.error("Fetch messages error:", err);
      showError("មិនអាចទាញយកសារប្រចាំកិច្ចសន្ទនានេះបានទេ");
    }
  };

  useEffect(() => {
    fetchThreads(currentPage, searchQuery);
  }, [fetchThreads, currentPage]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1);
    fetchThreads(1, value);
  };

  // 3. ផ្ញើសារទៅកាន់ AI (Laravel Backend Endpoint: /api/ai/chat)
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || sending || !canUseAI) return;

    const userMsgText = inputMessage.trim();
    setInputMessage("");

    const tempUserMessage = {
      role: "user",
      content: userMsgText,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMessage]);
    setSending(true);

    try {
      const response = await api.post("/ai/chat", {
        message: userMsgText,
        thread_id: activeThreadId,
        provider: provider, // 'gemini', 'openai', ឬ 'groq'
      });

      const data = response.data;

      if (data?.status === "success" || data?.message) {
        if (data.thread_id && data.thread_id !== activeThreadId) {
          setActiveThreadId(data.thread_id);
          fetchThreads(1, searchQuery);
        }

        const aiResponseNode = data.message || {
          role: "assistant",
          content: data.reply || "គ្មានការឆ្លើយតប",
          model: data.model || "llama-3.3-70b-versatile",
        };

        setMessages((prev) => [...prev, aiResponseNode]);
      } else {
        showError(data?.message || "មានបញ្ហាក្នុងការឆ្លើយតបពី AI");
      }
    } catch (err) {
      showError(err?.response?.data?.message || "បរាជ័យក្នុងការតភ្ជាប់ទៅកាន់ AI Server");
    } finally {
      setSending(false);
    }
  };

  // 4. លុប Thread
  const handleDeleteThread = async (threadId, e) => {
    e.stopPropagation();
    if (!window.confirm("តើអ្នកពិតជាចង់លុបកិច្ចសន្ទនានេះមែនទេ?")) return;

    try {
      await api.delete(`/ai/threads/${threadId}`);
      showSuccess("បានលុបប្រវត្តិសន្ទនាដោយជោគជ័យ", "លុបជោគជ័យ");
      if (activeThreadId === threadId) {
        setActiveThreadId(null);
        setMessages([]);
      }
      fetchThreads(currentPage, searchQuery);
    } catch (err) {
      showError("បរាជ័យក្នុងការលុបកិច្ចសន្ទនា");
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto h-[calc(100vh-80px)] flex flex-col transition-all duration-300">
      
      {/* Header Bar with Clean Minimalist Glass Look */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 shrink-0 animate-fadeIn">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3 dark:text-white">
            <div className="p-2 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-500 shadow-inner">
              <Sparkles className="animate-pulse" size={24} />
            </div>
            Life Pilot AI Assistant
          </h1>
          <p className="text-xs text-slate-500 mt-1 dark:text-slate-400 flex items-center gap-1.5 font-medium">
            <Cpu size={13} className="text-amber-500" />
            ជំនួយការឆ្លាតវៃភាសាខ្មែរ ដំណើរការដោយម៉ូដែល៖{" "}
            <span className="font-bold text-amber-600 dark:text-amber-400 px-2 py-0.5 bg-amber-500/10 rounded-md uppercase tracking-wide">
              {provider === 'gemini' ? 'Gemini 3.8 Flash' : provider === 'openai' ? 'GPT-4o-mini' : 'Groq Llama 3.3'}
            </span>
          </p>
        </div>

        {/* Triple Provider Switcher (Gemini, OpenAI, Groq) */}
        <div className="flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80 backdrop-blur-md dark:bg-slate-900/80 dark:border-slate-800 shadow-sm">
          <button
            onClick={() => setProvider("groq")}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all duration-200 flex items-center gap-1.5 ${
              provider === "groq"
                ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25 scale-[1.02]"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
            }`}
          >
            <Zap size={13} />
            Groq AI
          </button>
          <button
            onClick={() => setProvider("gemini")}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all duration-200 flex items-center gap-1.5 ${
              provider === "gemini"
                ? "bg-amber-500 text-white shadow-md shadow-amber-500/25 scale-[1.02]"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
            }`}
          >
            Gemini 3.8
          </button>
          <button
            onClick={() => setProvider("openai")}
            className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all duration-200 flex items-center gap-1.5 ${
              provider === "openai"
                ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/25 scale-[1.02]"
                : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
            }`}
          >
            OpenAI GPT
          </button>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        
        {/* Left Sidebar: Threads List */}
        <div className="flex flex-col bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-3xl p-4 shadow-xl shadow-slate-200/50 dark:bg-slate-900/80 dark:border-slate-800/80 dark:shadow-none lg:col-span-1 overflow-hidden transition-all duration-300">
          <div className="flex items-center justify-between gap-2 mb-3">
            <button
              onClick={() => {
                setActiveThreadId(null);
                setMessages([]);
              }}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 rounded-2xl shadow-lg shadow-amber-600/20 transition-all duration-200 transform active:scale-95"
            >
              <Plus size={16} />
              <span>សន្ទនាថ្មី</span>
            </button>
            <button
              onClick={() => fetchThreads(currentPage, searchQuery)}
              className="p-2.5 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 rounded-2xl border border-slate-200/80 transition-all duration-200 dark:bg-slate-800/80 dark:border-slate-700 dark:text-slate-400 dark:hover:text-white"
              title="Refresh"
            >
              <RefreshCw size={15} className={loading ? "animate-spin text-amber-500" : ""} />
            </button>
          </div>

          {/* Search Thread Bar */}
          <div className="relative mb-3">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="ស្វែងរកកិច្ចសន្ទនា..."
              className="w-full pl-10 pr-3 py-2 text-xs bg-slate-50/80 border border-slate-200/80 rounded-2xl focus:outline-none focus:border-amber-500 focus:bg-white transition-all duration-200 dark:bg-slate-950/60 dark:border-slate-800 dark:text-white placeholder-slate-400"
            />
          </div>

          {/* Threads Items List */}
          <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
            {threads.length === 0 ? (
              <div className="text-center py-12">
                <MessageSquare size={32} className="mx-auto text-slate-300 dark:text-slate-700 mb-2" />
                <p className="text-xs text-slate-400 font-medium">គ្មានប្រវត្តិកិច្ចសន្ទនា</p>
              </div>
            ) : (
              threads.map((thread) => (
                <div
                  key={thread.id}
                  onClick={() => fetchMessages(thread.id)}
                  className={`group flex items-center justify-between p-3 rounded-2xl cursor-pointer border transition-all duration-200 transform active:scale-[0.98] ${
                    activeThreadId === thread.id
                      ? "bg-amber-500/10 border-amber-500/40 text-amber-600 dark:text-amber-400 shadow-sm"
                      : "bg-slate-50/60 border-slate-200/60 hover:bg-slate-100/80 dark:bg-slate-950/40 dark:border-slate-800/60 dark:hover:bg-slate-800/40 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <MessageSquare size={15} className="shrink-0 text-amber-500" />
                    <span className="text-xs font-semibold truncate">
                      {thread.title || `កិច្ចសន្ទនា #${thread.id}`}
                    </span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteThread(thread.id, e)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition-all duration-200 rounded-xl"
                    title="លុប"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Threads Pagination */}
          {lastPage > 1 && (
            <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-200/80 dark:border-slate-800/80 text-xs">
              <span className="text-slate-500 font-medium">ទំព័រ {currentPage}/{lastPage}</span>
              <div className="flex gap-1.5">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl disabled:opacity-40 transition dark:bg-slate-800 dark:text-white"
                >
                  <ChevronLeft size={14} />
                </button>
                <button
                  disabled={currentPage === lastPage}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="p-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl disabled:opacity-40 transition dark:bg-slate-800 dark:text-white"
                >
                  <ChevronRight size={14} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Chat Area */}
        <div className="flex flex-col bg-white/95 backdrop-blur-md border border-slate-200/80 rounded-3xl shadow-xl shadow-slate-200/50 dark:bg-slate-900/80 dark:border-slate-800/80 dark:shadow-none lg:col-span-3 overflow-hidden transition-all duration-300">
          
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center max-w-md mx-auto animate-fadeIn">
                <div className="w-20 h-20 bg-amber-500/10 rounded-3xl border border-amber-500/20 flex items-center justify-center mb-4 text-amber-500 shadow-lg shadow-amber-500/5">
                  <Zap size={36} className="animate-pulse" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  តើខ្ញុំអាចជួយអ្វីដល់អ្នកថ្ងៃនេះ?
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-normal">
                  ចាប់ផ្តើមសួរសំណួរ ឬស្នើសុំជំនួយផ្នែករៀបចំផែនការ សរសេរកូដ និងស្វែងរកជំនួយផ្សេងៗជាភាសាខ្មែរយ៉ាងរលូន។
                </p>
              </div>
            ) : (
              messages.map((msg, index) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={index}
                    className={`flex items-start gap-3.5 transition-all duration-300 animate-fadeIn ${
                      isUser ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div
                      className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 shadow-md ${
                        isUser
                          ? "bg-amber-600 text-white shadow-amber-600/20"
                          : "bg-slate-100 text-slate-700 border border-slate-200/80 dark:bg-slate-800 dark:text-amber-400 dark:border-slate-700"
                      }`}
                    >
                      {isUser ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div
                      className={`max-w-[78%] p-4 rounded-3xl text-xs leading-relaxed shadow-sm transition-all ${
                        isUser
                          ? "bg-amber-600 text-white rounded-tr-none shadow-amber-600/15"
                          : "bg-slate-100/90 text-slate-900 border border-slate-200/80 rounded-tl-none dark:bg-slate-950/70 dark:border-slate-800/80 dark:text-slate-200"
                      }`}
                    >
                      <div className="whitespace-pre-wrap font-sans">{msg.content}</div>
                      <div
                        className={`mt-2 text-[10px] flex items-center gap-1.5 opacity-70 font-medium ${
                          isUser ? "justify-end text-amber-100" : "justify-start text-slate-400"
                        }`}
                      >
                        <Clock size={11} />
                        <span>
                          {msg.created_at
                            ? new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : "ទើបតែឥឡូវ"}
                        </span>
                        {msg.model && <span className="ml-1 uppercase tracking-wider">({msg.model})</span>}
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {sending && (
              <div className="flex items-center gap-3.5 animate-fadeIn">
                <div className="w-9 h-9 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 text-amber-500 flex items-center justify-center shadow-md">
                  <Bot size={16} />
                </div>
                <div className="p-4 bg-slate-100/90 border border-slate-200/80 rounded-3xl rounded-tl-none dark:bg-slate-950/70 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2.5 shadow-sm">
                  <RefreshCw size={14} className="animate-spin text-amber-500" />
                  <span className="font-medium">Life កំពុងគិត និងរៀបចំចម្លើយ...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Chat Footer Bar */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 bg-slate-50/80 backdrop-blur-md border-t border-slate-200/80 flex items-center gap-3 dark:bg-slate-900/90 dark:border-slate-800/80 shrink-0"
          >
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={sending || !canUseAI}
              placeholder="សរសេរសំណួររបស់អ្នកនៅទីនេះ..."
              className="flex-1 px-4.5 py-3.5 text-xs bg-white border border-slate-200/80 rounded-2xl focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all duration-200 dark:bg-slate-950 dark:border-slate-800 dark:text-white placeholder-slate-400 shadow-sm"
            />
            <button
              type="submit"
              disabled={sending || !inputMessage.trim() || !canUseAI}
              className="px-6 py-3.5 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-2xl shadow-lg shadow-amber-600/25 transition-all duration-200 transform active:scale-95 flex items-center justify-center shrink-0 font-bold"
            >
              <Send size={16} />
            </button>
          </form>

        </div>
      </div>
    </div>
  );
};

export default AIAssistant;