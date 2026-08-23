(function () {
  var cards = Array.prototype.slice.call(document.querySelectorAll('#cards .card'));
  var seriesButtons = Array.prototype.slice.call(document.querySelectorAll('#series-filters .pill'));
  var categoryButtons = Array.prototype.slice.call(document.querySelectorAll('#category-filters .pill'));
  var tagButtons = Array.prototype.slice.call(document.querySelectorAll('#tag-filters .pill'));
  var searchInput = document.getElementById('search-input');
  var emptyState = document.getElementById('empty-state');
  var resultCount = document.getElementById('result-count');
  var clearButton = document.getElementById('clear-filters');

  var activeSeries = 'all';
  var activeCategory = 'all';
  var activeTags = new Set();
  var query = '';

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

  function apply() {
    var visible = 0;
    cards.forEach(function (card) {
      var matchesSeries = activeSeries === 'all' || card.dataset.series === activeSeries;
      var matchesCategory = activeCategory === 'all' || card.dataset.category === activeCategory;
      var cardTags = (card.dataset.tags || '').split(',').filter(Boolean);
      var matchesTags = activeTags.size === 0 || cardTags.some(function (t) { return activeTags.has(t); });
      var matchesQuery = !query || (card.dataset.search || '').indexOf(query) !== -1;
      var show = matchesSeries && matchesCategory && matchesTags && matchesQuery;
      card.classList.toggle('hidden', !show);
      if (show) visible++;
    });
    if (emptyState) emptyState.classList.toggle('hidden', visible !== 0);
    if (resultCount) resultCount.textContent = visible + (visible === 1 ? ' article' : ' articles');
  }

  seriesButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      activeSeries = btn.dataset.filterSeries;
      setActiveSingle(seriesButtons, activeSeries, 'filterSeries');
      apply();
    });
  });

  categoryButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      activeCategory = btn.dataset.filterCategory;
      setActiveSingle(categoryButtons, activeCategory, 'filterCategory');
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
      apply();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', function () {
      query = searchInput.value.trim().toLowerCase();
      apply();
    });
  }

  if (clearButton) {
    clearButton.addEventListener('click', function () {
      activeSeries = 'all';
      activeCategory = 'all';
      activeTags.clear();
      query = '';
      if (searchInput) searchInput.value = '';
      setActiveSingle(seriesButtons, 'all', 'filterSeries');
      setActiveSingle(categoryButtons, 'all', 'filterCategory');
      tagButtons.forEach(function (btn) { btn.classList.remove('active'); });
      apply();
    });
  }

  // Pre-select from ?category=slug or ?tag=slug, e.g. links from an article's badge bar.
  var params = new URLSearchParams(window.location.search);
  var wantedCategory = params.get('category');
  var wantedTag = params.get('tag');

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

  apply();
})();
