document.addEventListener('DOMContentLoaded', function () {
  var reveals = document.querySelectorAll('[data-nc-reveal]');
  if (!reveals.length || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    reveals.forEach(function (el) { el.style.opacity = '1'; el.style.transform = 'none'; });
    return;
  }
  reveals.forEach(function (el) {
    el.style.transform = 'translateY(28px)';
    el.style.opacity = '0';
    el.style.transition =
      'opacity 0.85s cubic-bezier(0.22,1,0.36,1), transform 0.85s cubic-bezier(0.22,1,0.36,1)';
    el.style.transitionDelay = 'calc(' + (el.dataset.ncRevealDelay || 0) + ' * 80ms)';
  });
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'none';
      } else {
        entry.target.style.opacity = '0';
        entry.target.style.transform = 'translateY(20px)';
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach(function (el) { observer.observe(el); });
});
