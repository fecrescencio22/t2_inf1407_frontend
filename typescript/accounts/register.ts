/// <reference path="../constantes.ts" />
/// <reference path="common.ts" />

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-registro') as HTMLFormElement;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = (document.getElementById('username') as HTMLInputElement).value.trim();
    const email = (document.getElementById('email') as HTMLInputElement).value.trim();
    const password = (document.getElementById('password') as HTMLInputElement).value;

    try {
      const r = await fetch(backendAddress + 'accounts/registro/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      if (r.ok) {
        mostrarMensagem('msg', 'Conta criada! Redirecionando para o login…', 'sucesso');
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
