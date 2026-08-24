(function () {
  var STORAGE_KEY = 'argo-course-progress';
  var list = document.getElementById('syllabus-list');
  if (!list) return;

  var rows = Array.prototype.slice.call(list.querySelectorAll('.module-row'));
  var countEl = document.getElementById('progress-count');
  var barEl = document.getElementById('progress-bar-fill');
  var resetBtn = document.getElementById('reset-progress');
  var total = rows.length;

  function load() {
    try {
      return JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || {};
    } catch (e) {
      return {};
    }
  }

  function save(state) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      /* localStorage unavailable (private mode, blocked) — progress just won't persist */
    }
  }

  function render(state) {
    var done = 0;
    rows.forEach(function (row) {
      var id = row.getAttribute('data-module-id');
      var checked = !!state[id];
      var box = row.querySelector('.module-check');
      box.checked = checked;
      row.classList.toggle('is-done', checked);
      if (checked) done++;
    });
    if (countEl) countEl.textContent = done + ' / ' + total + ' completed';
    if (barEl) barEl.style.width = (total ? (done / total) * 100 : 0) + '%';
  }

  var state = load();
  render(state);

  rows.forEach(function (row) {
    var id = row.getAttribute('data-module-id');
    var box = row.querySelector('.module-check');
    box.addEventListener('change', function () {
      state[id] = box.checked;
      save(state);
      render(state);
    });
  });

  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      state = {};
      save(state);
      render(state);
    });
  }
})();
