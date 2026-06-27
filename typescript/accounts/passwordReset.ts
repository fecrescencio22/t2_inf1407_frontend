/// <reference path="../constantes.ts" />
/// <reference path="common.ts" />

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-reset') as HTMLFormElement;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = (document.getElementById('email') as HTMLInputElement).value.trim();

    try {
      const r = await fetch(backendAddress + 'accounts/password-reset/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (r.ok) {
        mostrarMensagem('msg', 'Se o e-mail existir, um código foi enviado. Verifique o console do servidor em desenvolvimento.', 'sucesso');
        setTimeout(() => { window.location.href = '/accounts/passwordResetDone.html'; }, 2000);
      } else {
        mostrarMensagem('msg', 'Erro ao solicitar redefinição.', 'erro');
      }
    } catch {
      mostrarMensagem('msg', 'Erro de conexão com o servidor.', 'erro');
    }
  });
});
