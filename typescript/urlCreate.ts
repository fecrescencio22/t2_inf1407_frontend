/// <reference path="constantes.ts" />
/// <reference path="accounts/common.ts" />

document.addEventListener('DOMContentLoaded', () => {
  exigeLogin();

  const form = document.getElementById('form-create') as HTMLFormElement;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const original_url = (document.getElementById('original-url') as HTMLInputElement).value.trim();
    const short_code = (document.getElementById('short-code') as HTMLInputElement).value.trim();

    const body: Record<string, string> = { original_url };
    if (short_code) body['short_code'] = short_code;

    try {
      const r = await authFetch(backendAddress + 'links/', {
        method: 'POST',
        body: JSON.stringify(body),
      });

      if (r.status === 201) {
        const link: Link = await r.json();
        mostrarMensagem('msg', `Link criado: ${backendAddress}${link.short_code}/`, 'sucesso');
        form.reset();
        setTimeout(() => { window.location.href = '/dashboard.html'; }, 1500);
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
