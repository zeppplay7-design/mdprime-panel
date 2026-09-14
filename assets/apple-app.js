(() => {
  'use strict';

  const views = {
    dashboard: {
      title: 'Resumen',
      subtitle: 'Una visión clara del estado de tu servicio.',
      nodes: ['mdGlobalProPanel', 'dashboard']
    },
    clientes: {
      title: 'Referentes',
      subtitle: 'Gestiona perfiles, planes y grupos de referidos.',
      nodes: ['clientes', 'clientesPaginacion'],
      include: ['.clients']
    },
    normales: {
      title: 'Clientes normales',
      subtitle: 'Usuarios independientes, renovaciones y caducidades.',
      nodes: ['clientesNormales', 'normalesPaginacion']
    },
    referidos: {
      title: 'Buscar referidos',
      subtitle: 'Localiza rápidamente cualquier usuario y su referente.',
      nodes: ['buscadorReferidosRapido']
    },
    duplicados: {
      title: 'Duplicados',
      subtitle: 'Revisa usuarios repetidos entre distintos referentes.',
      nodes: ['duplicados']
    },
    inactivos: {
      title: 'Inactivos',
      subtitle: 'Renueva, corrige o elimina usuarios caducados.',
      nodes: ['inactivos']
    },
    nuevo: {
      title: 'Nuevo referente',
      subtitle: 'Crea un perfil y empieza a añadir sus referidos.',
      nodes: ['addCliente']
    },
    niveles: {
      title: 'Niveles y precios',
      subtitle: 'Consulta las condiciones de cada categoría.',
      nodes: ['niveles']
    },
    sigma: {
      title: 'Conexión Sigma',
      subtitle: 'Comprueba el token y sincroniza usuarios de forma segura.',
      nodes: ['configSigma']
    }
  };

  const icons = {
    dashboard: '<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></svg>',
    clientes: '<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="4"/><path d="M3 21v-2a6 6 0 0 1 12 0v2"/><path d="M16 4a4 4 0 0 1 0 8M17 15a6 6 0 0 1 4 6"/></svg>',
    normales: '<svg viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M5 21v-2a7 7 0 0 1 14 0v2"/></svg>',
    referidos: '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg>',
    duplicados: '<svg viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="12" rx="3"/><path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2"/></svg>',
    inactivos: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="m8 8 8 8M16 8l-8 8"/></svg>',
    nuevo: '<svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14"/></svg>',
    niveles: '<svg viewBox="0 0 24 24"><path d="M12 3 4 7v5c0 5 3.4 8.7 8 10 4.6-1.3 8-5 8-10V7l-8-4Z"/><path d="m9 12 2 2 4-4"/></svg>',
    sigma: '<svg viewBox="0 0 24 24"><path d="M7 7h10v10H7z"/><path d="M3 12h4M17 12h4M12 3v4M12 17v4"/></svg>'
  };

  const labels = {
    dashboard: 'Resumen', clientes: 'Referentes', normales: 'Clientes normales',
    referidos: 'Buscar usuarios', duplicados: 'Duplicados', inactivos: 'Inactivos',
    nuevo: 'Añadir referente', niveles: 'Niveles', sigma: 'Sigma'
  };

  function collectViewNodes() {
    Object.entries(views).forEach(([name, view]) => {
      view.elements = [];
      view.nodes.forEach(id => {
        const el = document.getElementById(id);
        if (el) view.elements.push(el);
      });
      (view.include || []).forEach(selector => {
        document.querySelectorAll(selector).forEach(el => view.elements.push(el));
      });
      view.elements.forEach(el => el.dataset.appView = name);
    });
  }

  function buildNavigation() {
    const nav = document.querySelector('.sidebar .nav');
    if (!nav) return;
    const metrics = window.MDPRIME_METRICS || {};
    const counters = {clientes: metrics.referentes, normales: metrics.normales, referidos: metrics.referidos, duplicados: metrics.duplicados, inactivos: metrics.inactivos};
    nav.innerHTML = Object.keys(views).map(name =>
      `<a href="#app-${name}" data-route="${name}"><span class="navIcon">${icons[name]}</span><span>${labels[name]}</span>${counters[name] !== undefined ? `<b class="navCount">${counters[name]}</b>` : ''}</a>`
    ).join('');

    const quick = document.querySelector('.quick');
    if (quick) {
      const exportForm = quick.querySelector('form');
      quick.innerHTML = '<h4>Acciones</h4><a href="#app-nuevo" data-route="nuevo"><span class="navIcon">' + icons.nuevo + '</span><span>Nuevo referente</span></a><a href="#app-sigma" data-route="sigma"><span class="navIcon">' + icons.sigma + '</span><span>Sincronizar Sigma</span></a>';
      if (exportForm) {
        const button = exportForm.querySelector('button');
        if (button) button.textContent = 'Descargar copia';
        quick.appendChild(exportForm);
      }
    }
  }

  function buildTopbar() {
    const main = document.querySelector('.main');
    const header = document.querySelector('.header');
    if (!main || !header) return;
    header.innerHTML = '<button class="mobileMenuButton" type="button" aria-label="Abrir menú">' +
      '<svg viewBox="0 0 24 24"><path d="M4 7h16M4 12h16M4 17h16"/></svg></button>' +
      '<div class="pageHeading"><span class="pageEyebrow">MDPRIME</span><h1 id="appPageTitle">Resumen</h1><p id="appPageSubtitle">Una visión clara del estado de tu servicio.</p></div>' +
      '<div class="headerActions"><button class="commandButton" type="button" aria-label="Abrir centro de comandos"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><span>Buscar</span><kbd>Ctrl K</kbd></button><span class="livePill"><i></i> En línea</span><a class="logoutButton" href="?logout=1">Salir</a></div>';
  }

  function buildCommandCenter() {
    const shell = document.createElement('div');
    shell.className = 'commandOverlay';
    shell.setAttribute('aria-hidden', 'true');
    shell.innerHTML = `<div class="commandCenter" role="dialog" aria-modal="true" aria-label="Centro de comandos">
      <div class="commandInputWrap"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><input type="search" placeholder="Ir a una sección…" autocomplete="off"><kbd>Esc</kbd></div>
      <div class="commandList">${Object.keys(views).map(name => `<button type="button" data-command-route="${name}"><span class="navIcon">${icons[name]}</span><span><b>${labels[name]}</b><small>${views[name].subtitle}</small></span></button>`).join('')}</div>
      <div class="commandFoot">Usa ↑ ↓ para moverte y Enter para abrir</div>
    </div>`;
    document.body.appendChild(shell);
    return shell;
  }

  function openCommands() {
    const overlay = document.querySelector('.commandOverlay');
    if (!overlay) return;
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    const input = overlay.querySelector('input');
    input.value = '';
    overlay.querySelectorAll('[data-command-route]').forEach(button => button.hidden = false);
    setTimeout(() => input.focus(), 30);
  }

  function closeCommands() {
    const overlay = document.querySelector('.commandOverlay');
    if (!overlay) return;
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
  }

  function bindCommandCenter() {
    const overlay = document.querySelector('.commandOverlay');
    if (!overlay) return;
    const input = overlay.querySelector('input');
    input.addEventListener('input', () => {
      const query = input.value.trim().toLowerCase();
      overlay.querySelectorAll('[data-command-route]').forEach(button => {
        button.hidden = !button.textContent.toLowerCase().includes(query);
      });
    });
    overlay.addEventListener('click', event => {
      if (event.target === overlay) closeCommands();
      const button = event.target.closest('[data-command-route]');
      if (button) {
        setView(button.dataset.commandRoute);
        closeCommands();
      }
    });
  }

  function allViewElements() {
    return [...new Set(Object.values(views).flatMap(view => view.elements || []))];
  }

  function setView(name, updateHash = true) {
    if (!views[name]) name = 'dashboard';
    allViewElements().forEach(el => {
      el.hidden = el.dataset.appView !== name;
      el.classList.toggle('appViewActive', el.dataset.appView === name);
    });

    document.querySelectorAll('[data-route]').forEach(link => {
      link.classList.toggle('active', link.dataset.route === name);
    });
    const title = document.getElementById('appPageTitle');
    const subtitle = document.getElementById('appPageSubtitle');
    if (title) title.textContent = views[name].title;
    if (subtitle) subtitle.textContent = views[name].subtitle;
    document.body.dataset.currentView = name;
    document.body.classList.remove('menuOpen');
    if (updateHash) history.replaceState(null, '', '#app-' + name);
    try { localStorage.setItem('mdprime-last-view', name); } catch (_) {}
    window.scrollTo({top: 0, behavior: 'smooth'});
  }

  function bindNavigation() {
    document.addEventListener('click', event => {
      const route = event.target.closest('[data-route]');
      if (route) {
        event.preventDefault();
        setView(route.dataset.route);
      }
      if (event.target.closest('.mobileMenuButton')) document.body.classList.toggle('menuOpen');
      if (event.target.closest('.commandButton')) openCommands();
    });
    document.addEventListener('keydown', event => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        openCommands();
      }
      if (event.key === 'Escape') closeCommands();
      if (event.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName || '')) {
        const input = document.querySelector(`.collectionTools[data-tools-view="${document.body.dataset.currentView}"] input`);
        if (input) {
          event.preventDefault();
          input.focus();
        }
      }
    });
  }

  function improveContent() {
    document.querySelectorAll('.btn').forEach(btn => {
      btn.addEventListener('click', () => btn.classList.add('isWorking'), {once: true});
    });
    document.querySelectorAll('.miniTable').forEach(table => {
      const wrapper = document.createElement('div');
      wrapper.className = 'tableScroller';
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });
    document.querySelectorAll('.panel > h2, .panel > h3').forEach(title => title.classList.add('sectionTitle'));
    const notice = document.querySelector('.notice');
    if (notice) {
      notice.setAttribute('role', 'status');
      const close = document.createElement('button');
      close.type = 'button';
      close.className = 'noticeClose';
      close.textContent = 'Cerrar';
      close.addEventListener('click', () => notice.remove());
      notice.appendChild(close);
    }
    const top = document.createElement('button');
    top.type = 'button';
    top.className = 'backToTop';
    top.setAttribute('aria-label', 'Volver arriba');
    top.textContent = '↑';
    top.addEventListener('click', () => window.scrollTo({top: 0, behavior: 'smooth'}));
    document.body.appendChild(top);
    window.addEventListener('scroll', () => top.classList.toggle('visible', window.scrollY > 500), {passive: true});
  }

  function cardConfigFor(view) {
    if (view === 'clientes') return {selector: '.clients .client', container: '.clients', label: 'referentes'};
    if (view === 'normales') return {selector: '#clientesNormales .normalCard', container: '#clientesNormales .normalesGrid', label: 'clientes'};
    if (view === 'inactivos') return {selector: '#inactivos .inactivoCard', container: '#inactivos .inactivosGrid', label: 'inactivos'};
    if (view === 'duplicados') return {selector: '#duplicados article, #duplicados .duplicadoCard', container: '#duplicados', label: 'resultados'};
    return null;
  }

  function buildCollectionTools() {
    ['clientes', 'normales', 'inactivos', 'duplicados'].forEach(view => {
      const config = cardConfigFor(view);
      const host = views[view]?.elements?.[0];
      if (!config || !host || host.querySelector('.collectionTools')) return;
      const cards = [...document.querySelectorAll(config.selector)];
      if (!cards.length) return;

      const tools = document.createElement('div');
      tools.className = 'collectionTools';
      tools.dataset.toolsView = view;
      tools.innerHTML = `<div class="collectionSearch"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></svg><input type="search" placeholder="Filtrar ${config.label}…" aria-label="Filtrar ${config.label}"></div>
        <div class="collectionMeta"><b>${cards.length}</b><span>${config.label}</span></div>
        <div class="segmented" aria-label="Tipo de vista"><button type="button" data-layout="grid" class="active" title="Cuadrícula">▦</button><button type="button" data-layout="list" title="Lista">☰</button></div>
        <button type="button" class="compactToggle" title="Alternar densidad">Compacto</button>
        <button type="button" class="copyVisible" title="Copiar resultados visibles">Copiar</button>`;
      host.parentNode.insertBefore(tools, host);

      const input = tools.querySelector('input');
      const meta = tools.querySelector('.collectionMeta b');
      const applyFilter = () => {
        const q = input.value.trim().toLowerCase();
        let visible = 0;
        cards.forEach(card => {
          const text = (card.dataset.search || card.dataset.mdSearch || card.textContent || '').toLowerCase();
          const show = !q || text.includes(q);
          card.hidden = !show;
          if (show) visible++;
        });
        meta.textContent = visible;
        tools.classList.toggle('hasFilter', Boolean(q));
      };
      input.addEventListener('input', applyFilter);
      tools.querySelectorAll('[data-layout]').forEach(button => button.addEventListener('click', () => {
        tools.querySelectorAll('[data-layout]').forEach(item => item.classList.toggle('active', item === button));
        const container = document.querySelector(config.container);
        if (container) container.classList.toggle('listLayout', button.dataset.layout === 'list');
      }));
      tools.querySelector('.compactToggle').addEventListener('click', () => {
        document.body.classList.toggle('compactMode');
        try { localStorage.setItem('mdprime-compact', document.body.classList.contains('compactMode') ? '1' : '0'); } catch (_) {}
      });
      tools.querySelector('.copyVisible').addEventListener('click', async event => {
        const values = cards.filter(card => !card.hidden).map(card => {
          const title = card.querySelector('h3,.normalNombre,.inactivoNombre,b,strong');
          return title ? title.textContent.trim() : card.textContent.trim().split('\n')[0];
        }).filter(Boolean);
        const text = values.join('\n');
        try {
          await navigator.clipboard.writeText(text);
          event.currentTarget.textContent = 'Copiado';
          setTimeout(() => event.currentTarget.textContent = 'Copiar', 1300);
        } catch (_) {
          if (typeof window.mdFallbackCopy === 'function') window.mdFallbackCopy(text);
        }
      });
    });
    try { if (localStorage.getItem('mdprime-compact') === '1') document.body.classList.add('compactMode'); } catch (_) {}
  }

  function buildMinimalDashboard() {
    const dashboard = document.getElementById('dashboard');
    const center = dashboard?.querySelector('.center');
    const right = dashboard?.querySelector('.right');
    if (!dashboard || !center || dashboard.querySelector('.minimalSummary')) return;
    const m = window.MDPRIME_METRICS || {};

    const summary = document.createElement('section');
    summary.className = 'minimalSummary';
    summary.innerHTML = `
      <article><span>Total gestionado</span><strong>${m.total ?? 0}</strong><small>${m.referentes ?? 0} referentes · ${m.normales ?? 0} clientes directos</small></article>
      <article><span>Usuarios activos</span><strong>${m.activos ?? 0}</strong><small>${m.porcentaje_activos ?? 0}% de la cartera</small></article>
      <article><span>Usuarios inactivos</span><strong>${m.inactivos ?? 0}</strong><small>Requieren seguimiento</small></article>
      <article class="attention"><span>Próximos 3 días</span><strong>${m.caducan ?? 0}</strong><small>Caducidades previstas</small></article>`;
    center.prepend(summary);

    const oldAlerts = center.querySelector('.alerts');
    const oldStats = center.querySelector('.stats');
    if (oldAlerts) oldAlerts.hidden = true;
    if (oldStats) oldStats.hidden = true;

    const expiry = document.getElementById('caducidades');
    const bottom = center.querySelector('.bottomGrid');
    if (expiry && bottom) {
      expiry.classList.add('compactExpiry');
      bottom.appendChild(expiry);
    }
    if (right) right.hidden = true;

    const level = center.querySelector('.level');
    const medal = level?.querySelector('.medal');
    if (medal) medal.hidden = true;
    const levelTitle = level?.querySelector('h3');
    if (levelTitle) levelTitle.textContent = 'Mejor rendimiento';
    const chartTitle = center.querySelector('.donutBox h3');
    if (chartTitle) chartTitle.textContent = 'Estado de los referidos';
    const latestTitle = center.querySelector('#referidos h3');
    if (latestTitle) latestTitle.textContent = 'Actividad reciente';
    const rankingTitle = center.querySelector('#ranking h3');
    if (rankingTitle) rankingTitle.textContent = 'Mejores referentes';
  }

  function bridgeLegacySearch() {
    if (typeof window.mdProOpenTarget !== 'function') return;
    const original = window.mdProOpenTarget;
    window.mdProOpenTarget = function(id, modalId, nombre, tipo, page) {
      if (tipo === 'normal') setView('normales');
      else if (modalId) setView('clientes');
      setTimeout(() => original(id, modalId, nombre, tipo, page), 80);
    };
  }

  document.addEventListener('DOMContentLoaded', () => {
    collectViewNodes();
    buildNavigation();
    buildTopbar();
    buildCommandCenter();
    bindNavigation();
    bindCommandCenter();
    improveContent();
    buildMinimalDashboard();
    buildCollectionTools();
    bridgeLegacySearch();
    const params = new URLSearchParams(location.search);
    let remembered = 'dashboard';
    try { remembered = localStorage.getItem('mdprime-last-view') || 'dashboard'; } catch (_) {}
    let requested = location.hash.startsWith('#app-') ? location.hash.slice(5) : remembered;
    if (!location.hash.startsWith('#app-')) {
      if (params.has('pagina_clientes') || params.has('open')) requested = 'clientes';
      else if (params.has('pagina_normales') || params.has('open_normal')) requested = 'normales';
      else if (params.has('pagina_inactivos')) requested = 'inactivos';
    }
    setView(requested, false);
    document.documentElement.classList.add('appleAppReady');
  });
})();
