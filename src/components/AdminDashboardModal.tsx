import React, { useState, useEffect } from 'react';
import {
  X,
  Database,
  Trash2,
  RefreshCw,
  Download,
  Search,
  MessageSquare,
  ShieldAlert,
  Bot,
  Terminal,
  Clock,
  Check,
  Copy,
  Activity,
  Send,
} from 'lucide-react';
import { TerminalLog, getStoredLogs, clearAllLogs, fetchRemoteLogs, subscribeToLogs, saveLog } from '../services/logService';
import { PERSONAL_INFO, PROJECTS, BOOK_DETAILS } from '../data/portfolioData';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenTerminal?: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({
  isOpen,
  onClose,
  onOpenTerminal,
}) => {
  const [logs, setLogs] = useState<TerminalLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'logs' | 'changes'>('logs');
  const [testQuery, setTestQuery] = useState('');
  const [simulating, setSimulating] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    // Initial load
    setLogs(getStoredLogs());
    fetchRemoteLogs().then((remote) => {
      if (remote.length > 0) setLogs(remote);
    });

    // Subscribe to live log updates
    const unsubscribe = subscribeToLogs((updatedLogs) => {
      setLogs(updatedLogs);
    });

    // Auto-polling interval
    const interval = setInterval(() => {
      if (autoRefresh) {
        fetchRemoteLogs().then((remote) => {
          if (remote.length > 0) setLogs(remote);
        });
      }
    }, 3500);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, [isOpen, autoRefresh]);

  if (!isOpen) return null;

  const handleCopyLog = (log: TerminalLog) => {
    const text = `[${new Date(log.timestamp).toLocaleString()}]\nUser: ${log.userQuery}\nCypher Monk: ${log.aiResponse}`;
    navigator.clipboard.writeText(text);
    setCopiedId(log.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleClearLogs = async () => {
    await clearAllLogs();
    setLogs([]);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(logs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `cypher_monk_chat_logs_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleSimulateVisitorQuery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testQuery.trim() || simulating) return;

    setSimulating(true);
    const q = testQuery.trim();
    setTestQuery('');

    try {
      const res = await fetch('/api/ai-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: q }),
      });
      const data = await res.json();
      const newLog: TerminalLog = {
        id: `sim-${Date.now()}`,
        timestamp: new Date().toISOString(),
        userQuery: q,
        aiResponse: data.response || 'Active response generated.',
        source: 'cypher-monk-terminal',
        status: 'active-ai',
      };
      saveLog(newLog);
      setLogs(getStoredLogs());
    } catch (e) {
      const newLog: TerminalLog = {
        id: `sim-${Date.now()}`,
        timestamp: new Date().toISOString(),
        userQuery: q,
        aiResponse: 'Hello! Myself Akash Kumar, an ethical hacker and Computer Science student at IIT Patna. How can I assist you today?',
        source: 'cypher-monk-terminal',
        status: 'fallback',
      };
      saveLog(newLog);
      setLogs(getStoredLogs());
    } finally {
      setSimulating(false);
    }
  };

  const filteredLogs = logs.filter(
    (l) =>
      l.userQuery.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.aiResponse.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl bg-[#080d17] border border-cyan-500/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[650px] max-h-[92vh]">
        {/* Header Bar */}
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Bot className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white font-mono">
                  Cypher Monk AI &bull; Admin & Telemetry Dashboard
                </h3>
                <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950/60 border border-cyan-500/30 px-2 py-0.5 rounded-full">
                  [Cypher Monk Active]
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Live terminal conversation monitoring & portfolio registry
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab(activeTab === 'logs' ? 'changes' : 'logs')}
              className="px-3 py-1.5 rounded-lg text-xs font-mono bg-slate-900 border border-slate-800 text-slate-300 hover:text-cyan-300 hover:border-slate-700 transition-colors"
            >
              {activeTab === 'logs' ? 'Portfolio Overview' : 'Live Logs Feed'}
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-900 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Top Metrics Row */}
        <div className="px-5 py-3 bg-slate-950/60 border-b border-slate-850 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block font-mono">Total Cypher Monk Queries</span>
            <span className="text-base font-bold text-cyan-400 font-mono tabular-nums">{logs.length}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block font-mono">Assistant Status</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-300 font-mono">Active Online</span>
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80">
            <span className="text-[10px] text-slate-400 block font-mono">Latest Activity</span>
            <span className="text-xs font-mono text-slate-300 truncate block">
              {logs[0] ? new Date(logs[0].timestamp).toLocaleTimeString() : 'Awaiting prompt'}
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-400 block font-mono">Live Telemetry</span>
              <span className="text-xs font-semibold text-cyan-300 font-mono">{autoRefresh ? 'Connected (3.5s)' : 'Paused'}</span>
            </div>
            <button
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="p-1 rounded bg-slate-800 text-slate-300 hover:text-cyan-400"
              title="Toggle Live Auto-Sync"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${autoRefresh ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
            </button>
          </div>
        </div>

        {/* Main Dashboard Body */}
        {activeTab === 'logs' ? (
          <div className="flex-1 flex flex-col p-5 overflow-hidden">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search live Cypher Monk queries or responses..."
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExportJson}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-xs font-mono flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Export JSON</span>
                </button>
                <button
                  onClick={handleClearLogs}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-800 text-xs font-mono flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              </div>
            </div>

            {/* Live Cypher Monk Chat Logs Section */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1">
              <div className="flex items-center justify-between text-xs text-slate-400 font-mono pb-1 border-b border-slate-850">
                <div className="flex items-center gap-2">
                  <Bot className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-semibold text-slate-200">Live Cypher Monk Chat Logs</span>
                  <span className="text-slate-500">({filteredLogs.length})</span>
                </div>
                <span className="text-[11px] text-slate-500">Real-time visitor interactions</span>
              </div>

              {filteredLogs.length === 0 ? (
                <div className="text-center py-16 bg-slate-950/40 rounded-xl border border-slate-850">
                  <MessageSquare className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  <p className="text-xs text-slate-400">No logs match your filter.</p>
                  <p className="text-[11px] text-slate-500 mt-1">Chat in Cypher Monk AI or send a test query below.</p>
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition-colors space-y-2 group"
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3 text-cyan-400" />
                        <span>{new Date(log.timestamp).toLocaleTimeString()} &bull; {new Date(log.timestamp).toLocaleDateString()}</span>
                        <span className="text-slate-600">&bull;</span>
                        <span className="text-cyan-400/90 font-semibold">{log.source}</span>
                      </div>
                      <button
                        onClick={() => handleCopyLog(log)}
                        className="opacity-60 group-hover:opacity-100 text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-opacity"
                        title="Copy log entry"
                      >
                        {copiedId === log.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-[10px] text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span className="text-[10px]">Copy</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* User Query */}
                    <div className="flex items-start gap-2 text-xs font-mono">
                      <span className="text-cyan-400 font-bold shrink-0">$ visitor:</span>
                      <span className="text-slate-100 bg-slate-900/80 px-2 py-0.5 rounded border border-slate-800">
                        {log.userQuery}
                      </span>
                    </div>

                    {/* Cypher Monk Response */}
                    <div className="flex items-start gap-2 text-xs font-mono">
                      <span className="text-emerald-400 font-bold shrink-0 flex items-center gap-1">
                        <Bot className="w-3 h-3 text-cyan-400" />
                        <span>[Cypher Monk]:</span>
                      </span>
                      <p className="text-emerald-300 leading-relaxed bg-emerald-950/20 px-2.5 py-1.5 rounded border border-emerald-500/20 flex-1">
                        {log.aiResponse}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Test Simulation Input Bar */}
            <form onSubmit={handleSimulateVisitorQuery} className="mt-4 pt-3 border-t border-slate-800 flex items-center gap-2">
              <span className="text-xs font-mono text-cyan-400 shrink-0 hidden sm:inline">Simulate Prompt:</span>
              <input
                type="text"
                value={testQuery}
                onChange={(e) => setTestQuery(e.target.value)}
                placeholder="Send a test message to Cypher Monk (e.g., 'hello', 'tell me about your book')..."
                className="flex-1 px-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
              />
              <button
                type="submit"
                disabled={simulating}
                className="px-4 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all disabled:opacity-50 font-mono flex items-center gap-1.5"
              >
                {simulating ? 'Processing...' : (
                  <>
                    <Send className="w-3 h-3" />
                    <span>Send to Cypher Monk</span>
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Changes & Portfolio Overview Tab */
          <div className="flex-1 p-6 overflow-y-auto space-y-6 text-xs sm:text-sm text-slate-300">
            <div>
              <h4 className="text-base font-bold text-white font-mono mb-1">
                Portfolio Profile & Cypher Monk Node Registry
              </h4>
              <p className="text-xs text-slate-400">
                Live configuration states integrated across the portfolio SPA.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">Identity & Education</span>
                <p><strong className="text-white">Operator:</strong> {PERSONAL_INFO.name} (Akash Kumar)</p>
                <p><strong className="text-white">Institute:</strong> IIT Patna</p>
                <p><strong className="text-white">Program:</strong> CS, AI & Cybersecurity</p>
                <p><strong className="text-white">Contact:</strong> {PERSONAL_INFO.email}</p>
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block">Cypher Monk AI Engine</span>
                <p><strong className="text-white">Terminal CLI Name:</strong> Cypher Monk AI</p>
                <p><strong className="text-white">Header Handle:</strong> cypher-monk@iitp: ~/ai-terminal</p>
                <p><strong className="text-white">Badge Status:</strong> [Cypher Monk Active]</p>
                <p><strong className="text-white">Upcoming Book:</strong> {BOOK_DETAILS.title}</p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
              <div>
                <h5 className="font-bold text-white font-mono">Launch Cypher Monk AI Workstation</h5>
                <p className="text-xs text-slate-400">Full screen interactive cybersecurity CLI with real-time AI assistance.</p>
              </div>
              {onOpenTerminal && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenTerminal();
                  }}
                  className="px-3.5 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold font-mono transition-colors"
                >
                  Launch Cypher Monk
                </button>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-950 border-t border-slate-850 flex items-center justify-between text-xs font-mono text-slate-500">
          <span>Cypher Monk AI &bull; Central Telemetry Bus</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-slate-900 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Close Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
