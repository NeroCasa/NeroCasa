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

  document.querySelectorAll('[data-nc-marble-card]').forEach(function (card) {
    var img = card.querySelector('[data-nc-card-img]');
    if (!img) return;
    var defaultSrc = img.dataset.defaultSrc || img.getAttribute('src');
    card.querySelectorAll('[data-nc-marble-preview]').forEach(function (swatch) {
      swatch.addEventListener('mouseenter', function () {
        var next = swatch.dataset.img;
        if (next) img.src = next;
      });
      swatch.addEventListener('mouseleave', function () {
        img.src = defaultSrc;
      });
      swatch.addEventListener('focus', function () {
        var next = swatch.dataset.img;
        if (next) img.src = next;
      });
      swatch.addEventListener('blur', function () {
        img.src = defaultSrc;
      });
    });
  });
});
