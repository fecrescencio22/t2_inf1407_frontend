/// <reference path="constantes.ts" />
/// <reference path="accounts/common.ts" />

async function carregarCabecalho(): Promise<void> {
  const nav = document.getElementById('nav-links');
  if (!nav) return;

  if (!estaLogado()) {
    nav.innerHTML = '';
    const li1 = document.createElement('li');
    const a1 = document.createElement('a');
    a1.href = '/accounts/login.html';
    a1.textContent = 'Login';
    li1.appendChild(a1);

    const li2 = document.createElement('li');
    const a2 = document.createElement('a');
    a2.href = '/accounts/register.html';
    a2.textContent = 'Registrar';
    li2.appendChild(a2);

    nav.appendChild(li1);
    nav.appendChild(li2);
    return;
  }

  try {
    const r = await authFetch(backendAddress + 'accounts/whoami/');
    if (!r.ok) throw new Error();
    const user: WhoAmI = await r.json();

    nav.innerHTML = '';

    const liUser = document.createElement('li');
    liUser.className = 'username';
    liUser.textContent = user.username;
    nav.appendChild(liUser);

    const liDash = document.createElement('li');
    const aDash = document.createElement('a');
    aDash.href = '/dashboard.html';
    aDash.textContent = 'Meus Links';
    liDash.appendChild(aDash);
    nav.appendChild(liDash);

    const liCreate = document.createElement('li');
    const aCreate = document.createElement('a');
    aCreate.href = '/urlCreate.html';
    aCreate.textContent = 'Encurtar URL';
    liCreate.appendChild(aCreate);
    nav.appendChild(liCreate);

    const liPwd = document.createElement('li');
    const aPwd = document.createElement('a');
    aPwd.href = '/accounts/passwordChange.html';
    aPwd.textContent = 'Trocar Senha';
    liPwd.appendChild(aPwd);
    nav.appendChild(liPwd);

    if (user.is_staff) {
      const liAdmin = document.createElement('li');
      const aAdmin = document.createElement('a');
      aAdmin.href = '/adminPanel.html';
      aAdmin.className = 'link-admin';
      aAdmin.textContent = 'Admin Panel';
      liAdmin.appendChild(aAdmin);
      nav.appendChild(liAdmin);
    }

    const liLogout = document.createElement('li');
    const btnLogout = document.createElement('button');
    btnLogout.textContent = 'Sair';
    btnLogout.className = 'btn-logout';
    btnLogout.addEventListener('click', () => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      window.location.href = '/index.html';
    });
    liLogout.appendChild(btnLogout);
    nav.appendChild(liLogout);
  } catch {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/accounts/login.html';
  }
}

document.addEventListener('DOMContentLoaded', carregarCabecalho);
