/// <reference path="constantes.ts" />
/// <reference path="accounts/common.ts" />

document.addEventListener('DOMContentLoaded', async () => {
  exigeLogin();

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) {
    window.location.href = '/dashboard.html';
    return;
  }

  // Carrega dados atuais do link
  try {
    const r = await authFetch(backendAddress + `links/${id}/`);
    if (!r.ok) { window.location.href = '/dashboard.html'; return; }
    const link: Link = await r.json();

    (document.getElementById('short-code') as HTMLInputElement).value = link.short_code;
    (document.getElementById('original-url') as HTMLInputElement).value = link.original_url;
  } catch {
    window.location.href = '/dashboard.html';
    return;
  }

  const form = document.getElementById('form-edit') as HTMLFormElement;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const original_url = (document.getElementById('original-url') as HTMLInputElement).value.trim();

    try {
      const r = await authFetch(backendAddress + `links/${id}/`, {
        method: 'PUT',
        body: JSON.stringify({ original_url }),
      });

      if (r.ok) {
        mostrarMensagem('msg', 'Link atualizado com sucesso!', 'sucesso');
        setTimeout(() => { window.location.href = '/dashboard.html'; }, 1200);
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
