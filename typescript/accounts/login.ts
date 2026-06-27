/// <reference path="../constantes.ts" />
/// <reference path="common.ts" />

document.addEventListener('DOMContentLoaded', () => {
  if (estaLogado()) {
    window.location.href = '/dashboard.html';
    return;
  }

  const form = document.getElementById('form-login') as HTMLFormElement;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = (document.getElementById('username') as HTMLInputElement).value.trim();
    const password = (document.getElementById('password') as HTMLInputElement).value;

    try {
      const r = await fetch(backendAddress + 'api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      if (!r.ok) {
        mostrarMensagem('msg', 'Usuário ou senha inválidos.', 'erro');
        return;
      }

      const tokens: JwtResposta = await r.json();
      localStorage.setItem('access_token', tokens.access);
      localStorage.setItem('refresh_token', tokens.refresh);
      window.location.href = '/dashboard.html';
    } catch {
      mostrarMensagem('msg', 'Erro de conexão com o servidor.', 'erro');
    }
  });
});
