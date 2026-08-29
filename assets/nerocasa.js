document.addEventListener('DOMContentLoaded', function () {
  var header = document.querySelector('[data-header]');
  function updateHeader() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

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
