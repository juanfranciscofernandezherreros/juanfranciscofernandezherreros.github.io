(function () {
  var PAGE_SIZE = 5;
  var cardsContainer = document.getElementById('cards');
  var cards = Array.prototype.slice.call(document.querySelectorAll('#cards .card'));
  var seriesButtons = Array.prototype.slice.call(document.querySelectorAll('#series-filters .pill'));
  var categoryButtons = Array.prototype.slice.call(document.querySelectorAll('#category-filters .pill'));
  var subcategoryButtons = Array.prototype.slice.call(document.querySelectorAll('#subcategory-filters .pill'));
  var tagButtons = Array.prototype.slice.call(document.querySelectorAll('#tag-filters .pill'));
  var searchInput = document.getElementById('search-input');
  var sortSelect = document.getElementById('sort-select');
  var emptyState = document.getElementById('empty-state');
  var resultCount = document.getElementById('result-count');
  var clearButton = document.getElementById('clear-filters');
  var pagination = document.getElementById('pagination');

  var activeSeries = 'all';
  var activeCategory = 'all';
  var activeSubcategory = 'all';
  var activeTags = new Set();
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

  var SORT_COMPARATORS = {
    'part': function (a, b) { return Number(a.dataset.part) - Number(b.dataset.part); },
    'date-desc': function (a, b) { return b.dataset.date.localeCompare(a.dataset.date); },
    'date-asc': function (a, b) { return a.dataset.date.localeCompare(b.dataset.date); },
    'title-asc': function (a, b) { return a.dataset.title.localeCompare(b.dataset.title); },
    'title-desc': function (a, b) { return b.dataset.title.localeCompare(a.dataset.title); }
  };

  function sortCards(criterion) {
    var comparator = SORT_COMPARATORS[criterion] || SORT_COMPARATORS.part;
    cards.slice().sort(comparator).forEach(function (card) {
      cardsContainer.appendChild(card);
    });
  }

  function matches(card) {
    var matchesSeries = activeSeries === 'all' || card.dataset.series === activeSeries;
    var cardCategories = (card.dataset.categories || '').split(',').filter(Boolean);
    var cardSubcategories = (card.dataset.subcategories || '').split(',').filter(Boolean);
    var matchesCategory = activeCategory === 'all' || cardCategories.indexOf(activeCategory) !== -1;
    var matchesSubcategory = activeSubcategory === 'all' || cardSubcategories.indexOf(activeSubcategory) !== -1;
    var cardTags = (card.dataset.tags || '').split(',').filter(Boolean);
    var matchesTags = activeTags.size === 0 || cardTags.some(function (t) { return activeTags.has(t); });
    var matchesQuery = !query || (card.dataset.search || '').indexOf(query) !== -1;
    return matchesSeries && matchesCategory && matchesSubcategory && matchesTags && matchesQuery;
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
      btn.setAttribute('aria-label', opts.ariaLabel || ('Page ' + label));
      if (opts.active) btn.setAttribute('aria-current', 'page');
      btn.addEventListener('click', function () {
        currentPage = page;
        apply();
        cardsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
      pagination.appendChild(btn);
    }

    addButton('‹ Prev', currentPage - 1, { disabled: currentPage === 1, ariaLabel: 'Previous page' });
    for (var i = 1; i <= totalPages; i++) {
      addButton(String(i), i, { active: i === currentPage });
    }
    addButton('Next ›', currentPage + 1, { disabled: currentPage === totalPages, ariaLabel: 'Next page' });
  }

  function apply() {
    var matched = Array.prototype.filter.call(cardsContainer.querySelectorAll('.card'), matches);
    var totalPages = Math.max(1, Math.ceil(matched.length / PAGE_SIZE));
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    var pageStart = (currentPage - 1) * PAGE_SIZE;
    var visibleSet = matched.slice(pageStart, pageStart + PAGE_SIZE);
    cards.forEach(function (card) {
      card.classList.toggle('hidden', visibleSet.indexOf(card) === -1);
    });

    if (emptyState) emptyState.classList.toggle('hidden', matched.length !== 0);
    if (resultCount) {
      var label = matched.length + (matched.length === 1 ? ' article' : ' articles');
      if (totalPages > 1) label += ' — page ' + currentPage + ' of ' + totalPages;
      resultCount.textContent = label;
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

  subcategoryButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      activeSubcategory = btn.dataset.filterSubcategory;
      setActiveSingle(subcategoryButtons, activeSubcategory, 'filterSubcategory');
      currentPage = 1;
      apply();
    });
  });

  tagButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var tag = btn.dataset.filterTag;
      if (activeTags.has(tag)) {
        activeTags.delete(tag);
        btn.classList.remove('active');
      } else {
        activeTags.add(tag);
        btn.classList.add('active');
      }
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

  if (sortSelect) {
    sortSelect.addEventListener('change', function () {
      sortCards(sortSelect.value);
      currentPage = 1;
      apply();
    });
  }

  if (clearButton) {
    clearButton.addEventListener('click', function () {
      activeSeries = 'all';
      activeCategory = 'all';
      activeSubcategory = 'all';
      activeTags.clear();
      query = '';
      if (searchInput) searchInput.value = '';
      if (sortSelect) sortSelect.value = 'part';
      setActiveSingle(seriesButtons, 'all', 'filterSeries');
      setActiveSingle(categoryButtons, 'all', 'filterCategory');
      setActiveSingle(subcategoryButtons, 'all', 'filterSubcategory');
      tagButtons.forEach(function (btn) { btn.classList.remove('active'); });
      sortCards('part');
      currentPage = 1;
      apply();
    });
  }

  // Pre-select from taxonomy or sort query params, e.g. links from an article's badge bar.
  var params = new URLSearchParams(window.location.search);
  var wantedCategory = params.get('category');
  var wantedSubcategory = params.get('subcategory');
  var wantedTag = params.get('tag');
  var wantedSort = params.get('sort');

  if (wantedCategory) {
    var catMatch = categoryButtons.find(function (btn) {
      return btn.dataset.filterCategory !== 'all' && slugify(btn.dataset.filterCategory) === wantedCategory;
    });
    if (catMatch) {
      activeCategory = catMatch.dataset.filterCategory;
      setActiveSingle(categoryButtons, activeCategory, 'filterCategory');
    }
  }
  if (wantedTag) {
    var tagMatch = tagButtons.find(function (btn) { return slugify(btn.dataset.filterTag) === wantedTag; });
    if (tagMatch) {
      activeTags.add(tagMatch.dataset.filterTag);
      tagMatch.classList.add('active');
    }
  }
  if (wantedSubcategory) {
    var subcatMatch = subcategoryButtons.find(function (btn) {
      return btn.dataset.filterSubcategory !== 'all' && slugify(btn.dataset.filterSubcategory) === wantedSubcategory;
    });
    if (subcatMatch) {
      activeSubcategory = subcatMatch.dataset.filterSubcategory;
      setActiveSingle(subcategoryButtons, activeSubcategory, 'filterSubcategory');
    }
  }
  if (wantedSort && SORT_COMPARATORS[wantedSort]) {
    if (sortSelect) sortSelect.value = wantedSort;
    sortCards(wantedSort);
  }

  apply();
})();
