(() => {
  const stage = document.querySelector('.prototype-stage');
  const version = stage?.dataset.version;
  const bell = document.querySelector('.notification-bell');
  const panel = document.querySelector('.notification-panel');
  const badge = document.querySelector('.notification-badge');
  const list = document.querySelector('.notification-list');
  const markAll = document.querySelector('.mark-all');
  const settings = document.querySelector('.settings-link');
  const moreMenuTrigger = document.querySelector('.more-menu-trigger');
  const moreMenu = document.querySelector('.more-menu');
  const toast = document.querySelector('.prototype-toast');

  if (!stage || !bell || !panel || !badge || !list) return;

  const data = JSON.parse(document.querySelector('#notifications-data').textContent);
  let notifications = data.map(item => ({ ...item }));
  let toastTimer;

  const icons = {
    unread: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle class="read-dot" cx="12" cy="12" r="4"></circle>
        <circle cx="12" cy="12" r="8"></circle>
      </svg>`,
    read: `
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <circle cx="12" cy="12" r="8"></circle>
        <path d="M8.5 12.2l2.2 2.2 4.9-5.1"></path>
      </svg>`
  };

  function unreadCount() {
    return notifications.filter(n => !n.read).length;
  }

  function syncBadge() {
    const count = unreadCount();

    if (version === 'A') {
      badge.classList.toggle('is-hidden', count === 0);
      return;
    }

    badge.textContent = count > 99 ? '99+' : String(count);
    badge.classList.toggle('is-hidden', count === 0);
    badge.setAttribute('aria-label', `${count} notificações não lidas`);
    if (markAll) markAll.disabled = count === 0;
  }

  function render() {
    list.innerHTML = notifications.map((n, index) => {
      const stateClass = n.read ? 'read' : 'unread';
      const toggle = (version === 'B' || version === 'C')
        ? `<button class="read-toggle" type="button" data-index="${index}" aria-label="${n.read ? 'Marcar como não lida' : 'Marcar como lida'}" title="${n.read ? 'Marcar como não lida' : 'Marcar como lida'}">${n.read ? icons.read : icons.unread}</button>`
        : '';

      return `
        <article class="notification-item ${stateClass}" data-index="${index}">
          <p class="notification-copy">${n.text}</p>
          <time class="notification-time" datetime="${n.datetime}">${n.time}</time>
          ${toggle}
        </article>`;
    }).join('');

    syncBadge();
  }

  function openPanel() {
    panel.hidden = false;
    bell.setAttribute('aria-expanded', 'true');

    if (version === 'A' && unreadCount() > 0) {
      notifications = notifications.map(n => ({ ...n, read: true }));
      syncBadge();
    }
  }

  function closeMoreMenu() {
    if (!moreMenu || !moreMenuTrigger) return;
    moreMenu.hidden = true;
    moreMenuTrigger.setAttribute('aria-expanded', 'false');
  }

  function closePanel() {
    closeMoreMenu();
    panel.hidden = true;
    bell.setAttribute('aria-expanded', 'false');
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('visible');
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove('visible'), 2600);
  }

  bell.addEventListener('click', () => {
    if (panel.hidden) openPanel();
    else closePanel();
  });

  moreMenuTrigger?.addEventListener('click', event => {
    event.stopPropagation();
    const willOpen = moreMenu.hidden;
    closeMoreMenu();
    if (willOpen) {
      moreMenu.hidden = false;
      moreMenuTrigger.setAttribute('aria-expanded', 'true');
    }
  });

  document.addEventListener('click', event => {
    if (panel.hidden) return;

    // Use the original event path instead of DOM containment alone. Some
    // controls re-render the notification list during the click; after that
    // re-render the clicked node is detached, which would otherwise make an
    // inside click look like an outside click and close the panel.
    const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
    const clickedInsidePanel = path.includes(panel) || panel.contains(event.target);
    const clickedBell = path.includes(bell) || bell.contains(event.target);
    const clickedMoreMenu = moreMenu && (path.includes(moreMenu) || moreMenu.contains(event.target));
    const clickedMoreTrigger = moreMenuTrigger && (path.includes(moreMenuTrigger) || moreMenuTrigger.contains(event.target));

    if (clickedInsidePanel || clickedBell) {
      if (version === 'C' && !clickedMoreMenu && !clickedMoreTrigger) closeMoreMenu();
      return;
    }
    closePanel();
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !panel.hidden) {
      closePanel();
      bell.focus();
    }
  });

  if (version === 'B' || version === 'C') {
    list.addEventListener('click', event => {
      const button = event.target.closest('.read-toggle');
      if (!button) return;
      const index = Number(button.dataset.index);
      notifications[index].read = !notifications[index].read;
      render();
    });

    markAll?.addEventListener('click', () => {
      notifications = notifications.map(n => ({ ...n, read: true }));
      render();
    });
  }

  settings?.addEventListener('click', () => {
    closeMoreMenu();
    showToast('A tela de configurações não faz parte deste protótipo.');
  });

  render();
})();
