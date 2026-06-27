/// <reference path="../constantes.ts" />
/// <reference path="common.ts" />

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-reset-done') as HTMLFormElement;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const code = (document.getElementById('code') as HTMLInputElement).value.trim();
    const new_password = (document.getElementById('new-password') as HTMLInputElement).value;

    try {
      const r = await fetch(backendAddress + 'accounts/password-reset/', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, new_password }),
      });

      if (r.ok) {
        mostrarMensagem('msg', 'Senha redefinida com sucesso! Faça login.', 'sucesso');
        setTimeout(() => { window.location.href = '/accounts/login.html'; }, 1500);
      } else {
        const erros = await r.json();
        const texto = Object.values(erros).flat().join(' ');
        mostrarMensagem('msg', texto, 'erro');
      }
    } catch {
      mostrarMensagem('msg', 'Erro de conexão com o servidor.', 'erro');
    }
  });
});
