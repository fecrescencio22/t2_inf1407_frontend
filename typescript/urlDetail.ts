/// <reference path="constantes.ts" />
/// <reference path="accounts/common.ts" />

function setTexto(id: string, texto: string): void {
  const el = document.getElementById(id);
  if (el) el.textContent = texto;
}

document.addEventListener('DOMContentLoaded', async () => {
  exigeLogin();

  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) { window.location.href = '/dashboard.html'; return; }

  try {
    const r = await authFetch(backendAddress + `links/${id}/`);
    if (!r.ok) { window.location.href = '/dashboard.html'; return; }
    const link: Link = await r.json();

    const curto = backendAddress + link.short_code + '/';

    setTexto('detalhe-original', link.original_url);
    setTexto('detalhe-codigo', link.short_code);
    setTexto('detalhe-acessos', String(link.access_count));
    setTexto('detalhe-criado', new Date(link.created_at).toLocaleString('pt-BR'));
    setTexto('detalhe-atualizado', new Date(link.updated_at).toLocaleString('pt-BR'));

    const aCurto = document.getElementById('detalhe-link') as HTMLAnchorElement;
    if (aCurto) {
      aCurto.href = curto;
      aCurto.textContent = curto;
    }

    const aEditar = document.getElementById('btn-editar') as HTMLAnchorElement;
    if (aEditar) aEditar.href = `/urlEdit.html?id=${link.id}`;

    const btnRemover = document.getElementById('btn-remover') as HTMLButtonElement;
    if (btnRemover) {
      btnRemover.addEventListener('click', async () => {
        if (!confirm('Remover este link?')) return;
        const rd = await authFetch(backendAddress + `links/${link.id}/`, { method: 'DELETE' });
        if (rd.status === 204) {
          window.location.href = '/dashboard.html';
        } else {
          mostrarMensagem('msg', 'Erro ao remover.', 'erro');
        }
      });
    }
  } catch {
    mostrarMensagem('msg', 'Erro ao carregar detalhes.', 'erro');
  }
});
