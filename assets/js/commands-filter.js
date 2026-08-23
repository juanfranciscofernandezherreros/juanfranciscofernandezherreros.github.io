(function () {
  var searchInput = document.getElementById('cmd-search');
  var sections = Array.prototype.slice.call(document.querySelectorAll('.tool-section'));
  var noResults = document.getElementById('no-results');
  if (!searchInput || sections.length === 0) return;

  var entries = sections.map(function (section) {
    return {
      section: section,
      items: Array.prototype.slice.call(section.querySelectorAll('.cmd-entry')).map(function (entry) {
        return { entry: entry, text: entry.textContent.toLowerCase() };
      })
    };
  });

  function apply() {
    var query = searchInput.value.trim().toLowerCase();
    var visibleTotal = 0;

    entries.forEach(function (group) {
      var visibleInSection = 0;
      group.items.forEach(function (item) {
        var show = !query || item.text.indexOf(query) !== -1;
        item.entry.classList.toggle('hidden', !show);
        if (show) visibleInSection++;
      });
      group.section.classList.toggle('hidden', visibleInSection === 0);
      visibleTotal += visibleInSection;
    });

    if (noResults) noResults.classList.toggle('hidden', visibleTotal !== 0);
  }

  searchInput.addEventListener('input', apply);
})();
