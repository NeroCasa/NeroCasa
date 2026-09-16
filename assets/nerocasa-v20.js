document.addEventListener('DOMContentLoaded', function () {
  var reveals = document.querySelectorAll('[data-nc-reveal]');
  if (!reveals.length) return;

  var reduceMotion =
    !('IntersectionObserver' in window) ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (reduceMotion) {
    reveals.forEach(function (el) {
      el.classList.add('is-visible');
    });
    return;
  }

  reveals.forEach(function (el) {
    el.style.transitionDelay = 'calc(' + (el.dataset.ncRevealDelay || 0) + ' * 80ms)';
  });

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -40px 0px' }
  );

  reveals.forEach(function (el) {
    observer.observe(el);
  });
});
