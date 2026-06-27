/// <reference path="../constantes.ts" />

function decodeJWT(token: string): Record<string, unknown> {
  const payload = token.split('.')[1];
  return JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
}

function isAccessTokenExpired(): boolean {
  const token = localStorage.getItem('access_token');
  if (!token) return true;
  const payload = decodeJWT(token);
  const exp = payload['exp'] as number;
  return Date.now() >= exp * 1000;
}

async function refreshAccessToken(): Promise<boolean> {
  const refresh = localStorage.getItem('refresh_token');
  if (!refresh) return false;
  try {
    const r = await fetch(backendAddress + 'api/token/refresh/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });
    if (!r.ok) return false;
    const data: JwtResposta = await r.json();
    localStorage.setItem('access_token', data.access);
    return true;
  } catch {
    return false;
  }
}

async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  if (isAccessTokenExpired()) {
    const ok = await refreshAccessToken();
    if (!ok) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/accounts/login.html';
      return new Response(null, { status: 401 });
    }
  }
  const token = localStorage.getItem('access_token') as string;
  const headers = new Headers(options.headers ?? {});
  headers.set('Authorization', `Bearer ${token}`);
  if (!headers.has('Content-Type') && options.body) {
    headers.set('Content-Type', 'application/json');
  }
  return fetch(url, { ...options, headers });
}

function estaLogado(): boolean {
  return !!localStorage.getItem('access_token');
}

function exigeLogin(): void {
  if (!estaLogado()) {
    window.location.href = '/accounts/login.html';
  }
}

function mostrarMensagem(id: string, texto: string, tipo: 'sucesso' | 'erro'): void {
  const el = document.getElementById(id);
  if (!el) return;
  el.textContent = texto;
  el.className = tipo === 'sucesso' ? 'msg-sucesso' : 'msg-erro';
  el.style.display = 'block';
}
