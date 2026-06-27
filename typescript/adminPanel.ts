/// <reference path="constantes.ts" />
/// <reference path="accounts/common.ts" />

async function verificaAdmin(): Promise<void> {
  if (!estaLogado()) { window.location.href = '/accounts/login.html'; return; }
  const r = await authFetch(backendAddress + 'accounts/whoami/');
  if (!r.ok) { window.location.href = '/accounts/login.html'; return; }
  const user: WhoAmI = await r.json();
  if (!user.is_staff) { window.location.href = '/dashboard.html'; }
}

async function carregarTodosLinks(): Promise<void> {
  const tbody = document.getElementById('tbody') as HTMLTableSectionElement;
  const totalEl = document.getElementById('total') as HTMLSpanElement;

  try {
    const r = await authFetch(backendAddress + 'admin-panel/links/');
    if (!r.ok) throw new Error('Falha: ' + r.status);
    const links: Link[] = await r.json();

    if (totalEl) totalEl.textContent = String(links.length);
    tbody.innerHTML = '';

    if (links.length === 0) {
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = 5;
      td.textContent = 'Nenhum link cadastrado.';
      td.style.textAlign = 'center';
      tr.appendChild(td);
      tbody.appendChild(tr);
      return;
    }

    links.forEach((l) => {
      const tr = document.createElement('tr');
      const curto = backendAddress + l.short_code + '/';

      const tdDono = document.createElement('td');
      tdDono.textContent = l.owner;

      const tdOrig = document.createElement('td');
      const aOrig = document.createElement('a');
      aOrig.href = l.original_url;
      aOrig.textContent = l.original_url.length > 45
        ? l.original_url.slice(0, 42) + '…'
        : l.original_url;
      aOrig.target = '_blank';
      aOrig.rel = 'noopener';
      tdOrig.appendChild(aOrig);

      const tdCurto = document.createElement('td');
      const aCurto = document.createElement('a');
      aCurto.href = curto;
      aCurto.textContent = l.short_code;
      aCurto.target = '_blank';
      aCurto.rel = 'noopener';
      tdCurto.appendChild(aCurto);

      const tdCount = document.createElement('td');
      tdCount.textContent = String(l.access_count);

      const tdAcoes = document.createElement('td');
      const btnDel = document.createElement('button');
      btnDel.textContent = 'Remover';
      btnDel.className = 'btn-acao btn-perigo';
      btnDel.addEventListener('click', () => confirmarRemocaoAdmin(l.id, tr));
      tdAcoes.appendChild(btnDel);

      tr.appendChild(tdDono);
      tr.appendChild(tdOrig);
      tr.appendChild(tdCurto);
      tr.appendChild(tdCount);
      tr.appendChild(tdAcoes);
      tbody.appendChild(tr);
    });
  } catch (err) {
    console.error(err);
    mostrarMensagem('msg', 'Erro ao carregar links.', 'erro');
  }
}

async function confirmarRemocaoAdmin(id: number, tr: HTMLTableRowElement): Promise<void> {
  if (!confirm('Remover este link permanentemente?')) return;
  try {
    const r = await authFetch(backendAddress + `admin-panel/links/${id}/`, { method: 'DELETE' });
    if (r.status === 204) {
      tr.remove();
      const totalEl = document.getElementById('total') as HTMLSpanElement;
      if (totalEl) totalEl.textContent = String(Number(totalEl.textContent) - 1);
      mostrarMensagem('msg', 'Link removido.', 'sucesso');
    } else {
      mostrarMensagem('msg', 'Erro ao remover.', 'erro');
    }
  } catch {
    mostrarMensagem('msg', 'Erro de conexão.', 'erro');
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await verificaAdmin();
  carregarTodosLinks();
});
