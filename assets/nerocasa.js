document.addEventListener('DOMContentLoaded', function () {
  var header = document.querySelector('[data-header]');
  function updateHeader() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  document.querySelectorAll('[data-nc-carousel-wrap]').forEach(function (wrap) {
    var rail = wrap.querySelector('[data-nc-carousel]');
    var prev = wrap.querySelector('[data-nc-prev]');
    var next = wrap.querySelector('[data-nc-next]');
    var progress = wrap.querySelector('.ncs-rail-progress i');
    if (!rail) return;

    function step() {
      var item = rail.querySelector('.ncs-best-card, .ncs-related-rail > a');
      return item ? item.getBoundingClientRect().width + 18 : rail.clientWidth;
    }

    function updateRail() {
      var max = Math.max(1, rail.scrollWidth - rail.clientWidth);
      if (progress) progress.style.width = Math.max(8, Math.min(100, 25 + (rail.scrollLeft / max) * 75)) + '%';
      if (prev) prev.disabled = rail.scrollLeft <= 2;
      if (next) next.disabled = rail.scrollLeft >= max - 2;
    }

    if (prev) prev.addEventListener('click', function () { rail.scrollBy({ left: -step(), behavior: 'smooth' }); });
    if (next) next.addEventListener('click', function () { rail.scrollBy({ left: step(), behavior: 'smooth' }); });
    rail.addEventListener('scroll', updateRail, { passive: true });
    updateRail();
  });

  document.querySelectorAll('[data-nc-auto-carousel]').forEach(function (root) {
    var track = root.querySelector('.ncs-auto-carousel-track');
    if (!track) return;
    var slides = track.children;
    if (slides.length <= 1) return;

    var index = 0;
    var interval = parseInt(root.dataset.interval || '6000', 10);
    var timer;

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = 'translate3d(-' + (index * 100) + '%, 0, 0)';
    }

    function start() {
      clearInterval(timer);
      timer = setInterval(function () { goTo(index + 1); }, interval);
    }

    root.addEventListener('mouseenter', function () { clearInterval(timer); });
    root.addEventListener('mouseleave', start);
    goTo(0);
    start();
  });
});
