/// <reference path="constantes.ts" />
/// <reference path="accounts/common.ts" />

async function exibeLinks(): Promise<void> {
  const tbody = document.getElementById('tbody') as HTMLTableSectionElement;
  const semLinks = document.getElementById('sem-links') as HTMLParagraphElement;

  try {
    const r = await authFetch(backendAddress + 'links/');
    if (!r.ok) throw new Error('Falha: ' + r.status);

    const links: Link[] = await r.json();

    tbody.innerHTML = '';

    if (links.length === 0) {
      semLinks.style.display = 'block';
      return;
    }
    semLinks.style.display = 'none';

    links.forEach((l) => {
      const tr = document.createElement('tr');
      const curto = backendAddress + l.short_code + '/';

      const tdOrig = document.createElement('td');
      const aOrig = document.createElement('a');
      aOrig.href = l.original_url;
      aOrig.textContent = l.original_url.length > 50 ? l.original_url.slice(0, 47) + '…' : l.original_url;
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

      const aDetail = document.createElement('a');
      aDetail.href = `/urlDetail.html?id=${l.id}`;
      aDetail.textContent = 'Ver';
      aDetail.className = 'btn-acao';

      const aEdit = document.createElement('a');
      aEdit.href = `/urlEdit.html?id=${l.id}`;
      aEdit.textContent = 'Editar';
      aEdit.className = 'btn-acao';

      const btnDel = document.createElement('button');
      btnDel.textContent = 'Remover';
      btnDel.className = 'btn-acao btn-perigo';
      btnDel.addEventListener('click', () => confirmarRemocao(l.id, tr));

      tdAcoes.appendChild(aDetail);
      tdAcoes.appendChild(aEdit);
      tdAcoes.appendChild(btnDel);

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

async function confirmarRemocao(id: number, tr: HTMLTableRowElement): Promise<void> {
  if (!confirm('Remover este link? Esta ação não pode ser desfeita.')) return;
  try {
    const r = await authFetch(backendAddress + `links/${id}/`, { method: 'DELETE' });
    if (r.status === 204) {
      tr.remove();
      mostrarMensagem('msg', 'Link removido.', 'sucesso');
    } else {
      mostrarMensagem('msg', 'Erro ao remover link.', 'erro');
    }
  } catch {
    mostrarMensagem('msg', 'Erro de conexão.', 'erro');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  exigeLogin();
  exibeLinks();
});
