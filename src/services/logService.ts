export interface TerminalLog {
  id: string;
  timestamp: string;
  userQuery: string;
  aiResponse: string;
  source: string;
  status?: 'active-ai' | 'fallback';
}

const STORAGE_KEY = 'akash_terminal_chat_logs';

type LogListener = (logs: TerminalLog[]) => void;
const listeners: Set<LogListener> = new Set();

export const subscribeToLogs = (listener: LogListener): (() => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const notifyListeners = (logs: TerminalLog[]) => {
  listeners.forEach((listener) => listener(logs));
};

export const getStoredLogs = (): TerminalLog[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to read logs from localStorage', e);
  }
  return [];
};

export const saveLog = (log: TerminalLog): void => {
  try {
    const current = getStoredLogs();
    const updated = [log, ...current.filter((l) => l.id !== log.id)].slice(0, 200);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    notifyListeners(updated);

    // End-to-end sync with backend server
    fetch('/api/terminal-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: log.id,
        userQuery: log.userQuery,
        aiResponse: log.aiResponse,
        source: log.source || 'cyberpunk-kali-terminal',
        status: log.status || 'active-ai',
        timestamp: log.timestamp,
      }),
    }).catch((err) => console.warn('Could not sync log to server:', err));
  } catch (e) {
    console.error('Failed to save log to localStorage', e);
  }
};

export const clearAllLogs = async (): Promise<void> => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    notifyListeners([]);
    await fetch('/api/terminal-logs', { method: 'DELETE' });
  } catch (e) {
    console.error('Error clearing logs', e);
  }
};

export const fetchRemoteLogs = async (): Promise<TerminalLog[]> => {
  try {
    const res = await fetch('/api/terminal-logs');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data.logs)) {
        // Merge with local logs
        const local = getStoredLogs();
        const mergedMap = new Map<string, TerminalLog>();
        data.logs.forEach((l: TerminalLog) => mergedMap.set(l.id, l));
        local.forEach((l: TerminalLog) => mergedMap.set(l.id, l));
        const merged = Array.from(mergedMap.values()).sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged.slice(0, 100)));
        notifyListeners(merged);
        return merged;
      }
    }
  } catch (e) {
    // offline or backend restarting
  }
  return getStoredLogs();
};
