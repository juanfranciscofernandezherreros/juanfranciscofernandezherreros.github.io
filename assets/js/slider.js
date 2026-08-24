(function () {
  var slides = Array.prototype.slice.call(document.querySelectorAll('#slides .slide'));
  var dots = Array.prototype.slice.call(document.querySelectorAll('#slide-dots .dot'));
  var slider = document.querySelector('.slider');
  if (!slider || slides.length < 2) return;

  var INTERVAL_MS = 5000;
  var current = slides.findIndex(function (s) { return s.classList.contains('active'); });
  if (current < 0) current = 0;
  var timer = null;

  function show(index) {
    var next = (index + slides.length) % slides.length;
    if (next === current) return;
    slides[current].classList.remove('active');
    if (dots[current]) {
      dots[current].classList.remove('active');
      dots[current].setAttribute('aria-selected', 'false');
    }
    current = next;
    slides[current].classList.add('active');
    if (dots[current]) {
      dots[current].classList.add('active');
      dots[current].setAttribute('aria-selected', 'true');
    }
  }

  function advance() { show(current + 1); }

  function start() {
    stop();
    timer = window.setInterval(advance, INTERVAL_MS);
  }

  function stop() {
    if (timer) window.clearInterval(timer);
    timer = null;
  }

  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      show(i);
      start();
    });
  });

  slider.addEventListener('mouseenter', stop);
  slider.addEventListener('mouseleave', start);
  slider.addEventListener('focusin', stop);
  slider.addEventListener('focusout', start);

  document.addEventListener('visibilitychange', function () {
    if (document.hidden) stop();
    else start();
  });

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion) start();
})();
