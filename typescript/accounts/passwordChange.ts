/// <reference path="../constantes.ts" />
/// <reference path="common.ts" />

document.addEventListener('DOMContentLoaded', () => {
  exigeLogin();

  const form = document.getElementById('form-change') as HTMLFormElement;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const old_password = (document.getElementById('old-password') as HTMLInputElement).value;
    const new_password = (document.getElementById('new-password') as HTMLInputElement).value;

    try {
      const r = await authFetch(backendAddress + 'accounts/change-password/', {
        method: 'PUT',
        body: JSON.stringify({ old_password, new_password }),
      });

      if (r.ok) {
        mostrarMensagem('msg', 'Senha alterada. Faça login novamente.', 'sucesso');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
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
