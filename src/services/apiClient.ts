/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Storage key for custom backend URL configured in UI
const BACKEND_URL_STORAGE_KEY = 'cortexia_backend_url';

/**
 * Get configured backend URL.
 * Checks localStorage first, then VITE_API_BASE_URL / VITE_BACKEND_URL,
 * defaults to empty string (same-origin relative /api).
 */
export function getBackendUrl(): string {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = localStorage.getItem(BACKEND_URL_STORAGE_KEY);
      if (stored !== null && stored.trim() !== '') {
        return stored.trim().replace(/\/+$/, '');
      }
    }
  } catch {
    // Ignore localStorage errors
  }

  // Check Vite environment variables (useful when deployed on Vercel / Netlify)
  const envUrl =
    (typeof import.meta !== 'undefined' &&
      ((import.meta as any).env?.VITE_API_BASE_URL ||
        (import.meta as any).env?.VITE_BACKEND_URL)) ||
    '';

  return envUrl ? envUrl.trim().replace(/\/+$/, '') : '';
}

/**
 * Save custom backend URL to localStorage
 */
export function setBackendUrl(url: string): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const cleaned = url.trim().replace(/\/+$/, '');
      if (cleaned) {
        localStorage.setItem(BACKEND_URL_STORAGE_KEY, cleaned);
      } else {
        localStorage.removeItem(BACKEND_URL_STORAGE_KEY);
      }
    }
  } catch {
    // Ignore localStorage errors
  }
}

/**
 * Reset backend URL to default (same-origin)
 */
export function resetBackendUrl(): void {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem(BACKEND_URL_STORAGE_KEY);
    }
  } catch {
    // Ignore localStorage errors
  }
}

/**
 * Resolve full endpoint URL considering custom backend URL
 */
export function getApiEndpoint(endpointPath: string): string {
  const base = getBackendUrl();
  const path = endpointPath.startsWith('/') ? endpointPath : `/${endpointPath}`;
  if (!base) {
    return path;
  }
  return `${base}${path}`;
}

export interface HealthCheckResult {
  ok: boolean;
  status: 'connected' | 'offline';
  statusCode?: number;
  data?: any;
  error?: string;
  url: string;
  latencyMs: number;
}

/**
 * Ping backend health check
 */
export async function checkBackendHealth(targetUrl?: string): Promise<HealthCheckResult> {
  const base = targetUrl !== undefined ? targetUrl.trim().replace(/\/+$/, '') : getBackendUrl();
  const url = base ? `${base}/api/health` : '/api/health';
  const start = performance.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const res = await fetch(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    const latencyMs = Math.round(performance.now() - start);

    if (res.ok) {
      let data: any = null;
      try {
        data = await res.json();
      } catch {
        data = { status: 'ok' };
      }
      return {
        ok: true,
        status: 'connected',
        statusCode: res.status,
        data,
        url,
        latencyMs,
      };
    } else {
      let errorMsg = `Server responded with HTTP ${res.status}`;
      if (res.status === 404) {
        errorMsg = `Endpoint ${url} returned 404 Not Found. If frontend and backend are hosted separately, check your Backend URL.`;
      } else if (res.status >= 500) {
        errorMsg = `Backend server returned HTTP ${res.status} Internal Error.`;
      }
      return {
        ok: false,
        status: 'offline',
        statusCode: res.status,
        error: errorMsg,
        url,
        latencyMs,
      };
    }
  } catch (err: any) {
    const latencyMs = Math.round(performance.now() - start);
    let errorMsg = err.name === 'AbortError' ? 'Connection timed out (>6s)' : err.message || 'Network error (CORS blocked or backend offline)';
    return {
      ok: false,
      status: 'offline',
      statusCode: 0,
      error: errorMsg,
      url,
      latencyMs,
    };
  }
}

/**
 * Send Chat Message to Backend with safe error resilience
 */
export async function sendChatMessage(payload: {
  message: string;
  history?: any[];
  conversationSummary?: string;
  retrievedChunks?: any[];
  model?: string;
  temperature?: number;
  hitlApprovedAction?: any;
}): Promise<{
  ok: boolean;
  data: any | null;
  statusCode?: number;
  error?: string;
  url: string;
}> {
  const url = getApiEndpoint('/api/agent/chat');

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const contentType = res.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const text = await res.text();
        if (text && text.trim()) {
          try {
            const data = JSON.parse(text);
            return { ok: true, data, statusCode: res.status, url };
          } catch (jsonErr: any) {
            return {
              ok: false,
              data: null,
              statusCode: res.status,
              error: `Invalid JSON response: ${jsonErr.message}`,
              url,
            };
          }
        }
      }
      return { ok: true, data: null, statusCode: res.status, url };
    } else {
      let errText = '';
      try {
        const errJson = await res.json();
        errText = errJson.error || errJson.message || `HTTP ${res.status}`;
      } catch {
        errText = `HTTP ${res.status} ${res.statusText}`;
      }

      return {
        ok: false,
        data: null,
        statusCode: res.status,
        error: errText,
        url,
      };
    }
  } catch (netErr: any) {
    return {
      ok: false,
      data: null,
      statusCode: 0,
      error: netErr.message || 'Network connection failed (Server offline or CORS blocked)',
      url,
    };
  }
}

/**
 * Send Summarization Request to Backend
 */
export async function sendSummarizeRequest(
  messages: any[],
  previousSummary?: string
): Promise<{ summary: string; ok: boolean }> {
  const url = getApiEndpoint('/api/agent/summarize');

  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ messages, previousSummary }),
    });

    if (res.ok) {
      const data = await res.json();
      return { summary: data.summary || '', ok: true };
    }
  } catch (err) {
    console.warn('Summarization request failed, falling back:', err);
  }

  // Fallback summary computation
  const userTopics = messages
    .filter((m: any) => m.role === 'user')
    .map((m: any) => m.content.slice(0, 45))
    .join('; ');

  return {
    summary: `Prior context covered user queries regarding: ${userTopics || 'system interactions'}. Active RAG collections queried with checkpoint state preserved.`,
    ok: false,
  };
}
