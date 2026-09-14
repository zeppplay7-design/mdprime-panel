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
    nav.innerHTML = Object.keys(views).map(name =>
      `<a href="#app-${name}" data-route="${name}"><span class="navIcon">${icons[name]}</span><span>${labels[name]}</span></a>`
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
      '<div class="headerActions"><span class="livePill"><i></i> En línea</span><a class="logoutButton" href="?logout=1">Salir</a></div>';
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
    bindNavigation();
    improveContent();
    bridgeLegacySearch();
    const params = new URLSearchParams(location.search);
    let requested = location.hash.startsWith('#app-') ? location.hash.slice(5) : 'dashboard';
    if (!location.hash.startsWith('#app-')) {
      if (params.has('pagina_clientes') || params.has('open')) requested = 'clientes';
      else if (params.has('pagina_normales') || params.has('open_normal')) requested = 'normales';
      else if (params.has('pagina_inactivos')) requested = 'inactivos';
    }
    setView(requested, false);
    document.documentElement.classList.add('appleAppReady');
  });
})();
