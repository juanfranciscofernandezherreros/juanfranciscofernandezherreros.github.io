(function () {
  var PAGE_SIZE = 5;
  var cardsContainer = document.getElementById('cards');
  if (!cardsContainer) return;

  // Standalone Jekyll pages are not part of site.posts.
  if (!cardsContainer.querySelector('[href$="/state-machines/es/"]')) {
    var stateMachineCard = document.createElement('a');
    stateMachineCard.className = 'card';
    stateMachineCard.href = '/state-machines/es/';
    stateMachineCard.dataset.series = '';
    stateMachineCard.dataset.categories = 'Concepts & Theory';
    stateMachineCard.dataset.search = 'máquinas de estados — fundamentos teóricos introducción teórica a las máquinas de estados finitos: estados, eventos, transiciones, guardas, acciones, determinismo, modelos de mealy y moore, composición y diseño.';
    stateMachineCard.dataset.date = '2026-09-10';
    stateMachineCard.dataset.title = 'Máquinas de estados — Fundamentos teóricos';
    stateMachineCard.innerHTML =
      '<p class="eyebrow">Concepts &amp; Theory</p>' +
      '<h2>Máquinas de estados — Fundamentos teóricos</h2>' +
      '<p class="desc">Introducción teórica a las máquinas de estados finitos: estados, eventos, transiciones, guardas, acciones, determinismo, modelos de Mealy y Moore, composición y diseño.</p>' +
      '<p class="card-tags">' +
        '<span class="badge badge-cat">Concepts &amp; Theory</span>' +
        '<span class="badge badge-subcat">Software Architecture</span>' +
        '<span class="badge badge-subcat">Foundations</span>' +
        '<span class="badge badge-tag">#state-machine</span>' +
        '<span class="badge badge-tag">#fsm</span>' +
      '</p>' +
      '<span class="go">Leer el artículo →</span>';
    cardsContainer.appendChild(stateMachineCard);
  }

  var cards = Array.prototype.slice.call(cardsContainer.querySelectorAll('.card'));
  var seriesButtons = Array.prototype.slice.call(document.querySelectorAll('#series-filters .pill'));
  var categoryContainer = document.getElementById('category-filters');
  var categoryButtons = Array.prototype.slice.call(document.querySelectorAll('#category-filters .pill'));
  var searchInput = document.getElementById('search-input');
  var emptyState = document.getElementById('empty-state');
  var resultCount = document.getElementById('result-count');
  var clearButton = document.getElementById('clear-filters');
  var pagination = document.getElementById('pagination');

  function taxonomyValues(card, key) {
    return (card.dataset[key] || '').split(',').map(function (value) {
      return value.trim();
    }).filter(Boolean);
  }

  function taxonomyCount(value) {
    return cards.reduce(function (total, card) {
      return total + (taxonomyValues(card, 'categories').indexOf(value) !== -1 ? 1 : 0);
    }, 0);
  }

  function setCategoryButtonContent(btn, label, count) {
    btn.classList.add('taxonomy-pill');
    btn.innerHTML = '';
    var name = document.createElement('span');
    name.className = 'filter-name';
    name.textContent = label;
    var badge = document.createElement('span');
    badge.className = 'filter-count';
    badge.textContent = String(count);
    badge.setAttribute('aria-label', count + (count === 1 ? ' artículo' : ' artículos'));
    btn.appendChild(name);
    btn.appendChild(badge);
  }

  // Add the category represented only by the standalone theory page.
  if (categoryContainer && !categoryContainer.querySelector('[data-filter-category="Concepts & Theory"]')) {
    var conceptButton = document.createElement('button');
    conceptButton.type = 'button';
    conceptButton.className = 'pill taxonomy-pill';
    conceptButton.dataset.filterCategory = 'Concepts & Theory';
    conceptButton.textContent = 'Concepts & Theory';
    categoryContainer.appendChild(conceptButton);
    categoryButtons.push(conceptButton);
  }

  categoryButtons.forEach(function (btn) {
    var category = btn.dataset.filterCategory;
    setCategoryButtonContent(
      btn,
      category === 'all' ? 'Todas' : category,
      category === 'all' ? cards.length : taxonomyCount(category)
    );
  });

  var activeSeries = 'all';
  var activeCategory = 'all';
  var query = '';
  var currentPage = 1;

  function slugify(value) {
    return String(value)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  function setActiveSingle(buttons, value, datasetKey) {
    buttons.forEach(function (btn) {
      btn.classList.toggle('active', btn.dataset[datasetKey] === value);
    });
  }

  // Blog order is intentionally fixed to newest first.
  cards.slice().sort(function (a, b) {
    return (b.dataset.date || '').localeCompare(a.dataset.date || '');
  }).forEach(function (card) {
    cardsContainer.appendChild(card);
  });

  function matches(card) {
    var matchesSeries = activeSeries === 'all' || card.dataset.series === activeSeries;
    var matchesCategory = activeCategory === 'all' || taxonomyValues(card, 'categories').indexOf(activeCategory) !== -1;
    var matchesQuery = !query || (card.dataset.search || '').indexOf(query) !== -1;
    return matchesSeries && matchesCategory && matchesQuery;
  }

  function renderPagination(totalPages) {
    if (!pagination) return;
    pagination.innerHTML = '';
    if (totalPages <= 1) {
      pagination.classList.add('hidden');
      return;
    }
    pagination.classList.remove('hidden');

    function addButton(label, page, opts) {
      opts = opts || {};
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'pill page-btn' + (opts.active ? ' active' : '');
      btn.textContent = label;
      btn.disabled = !!opts.disabled;
      btn.setAttribute('aria-label', opts.ariaLabel || ('Página ' + label));
      if (opts.active) btn.setAttribute('aria-current', 'page');
      btn.addEventListener('click', function () {
        currentPage = page;
        apply();
        cardsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      pagination.appendChild(btn);
    }

    addButton('‹ Anterior', currentPage - 1, { disabled: currentPage === 1, ariaLabel: 'Página anterior' });
    for (var i = 1; i <= totalPages; i++) {
      addButton(String(i), i, { active: i === currentPage });
    }
    addButton('Siguiente ›', currentPage + 1, { disabled: currentPage === totalPages, ariaLabel: 'Página siguiente' });
  }

  function apply() {
    var matched = cards.filter(matches);
    var totalPages = Math.max(1, Math.ceil(matched.length / PAGE_SIZE));
    currentPage = Math.min(Math.max(currentPage, 1), totalPages);

    var pageStart = (currentPage - 1) * PAGE_SIZE;
    var visibleSet = matched.slice(pageStart, pageStart + PAGE_SIZE);
    cards.forEach(function (card) {
      card.classList.toggle('hidden', visibleSet.indexOf(card) === -1);
    });

    if (emptyState) emptyState.classList.toggle('hidden', matched.length !== 0);
    if (resultCount) {
      resultCount.textContent = matched.length + (matched.length === 1 ? ' artículo' : ' artículos');
    }
    renderPagination(totalPages);
  }

  seriesButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      activeSeries = btn.dataset.filterSeries;
      setActiveSingle(seriesButtons, activeSeries, 'filterSeries');
      currentPage = 1;
      apply();
    });
  });

  categoryButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      activeCategory = btn.dataset.filterCategory;
      setActiveSingle(categoryButtons, activeCategory, 'filterCategory');
      currentPage = 1;
      apply();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      query = searchInput.value.trim().toLowerCase();
      currentPage = 1;
      apply();
    });
  }

  if (clearButton) {
    clearButton.addEventListener('click', function () {
      activeSeries = 'all';
      activeCategory = 'all';
      query = '';
      searchInput.value = '';
      setActiveSingle(seriesButtons, 'all', 'filterSeries');
      setActiveSingle(categoryButtons, 'all', 'filterCategory');
      currentPage = 1;
      apply();
    });
  }

  // Keep category links from article taxonomy working.
  var wantedCategory = new URLSearchParams(window.location.search).get('category');
  if (wantedCategory) {
    var categoryMatch = categoryButtons.find(function (btn) {
      return btn.dataset.filterCategory !== 'all' && slugify(btn.dataset.filterCategory) === wantedCategory;
    });
    if (categoryMatch) {
      activeCategory = categoryMatch.dataset.filterCategory;
      setActiveSingle(categoryButtons, activeCategory, 'filterCategory');
    }
  }

  apply();
})();