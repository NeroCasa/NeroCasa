document.addEventListener('DOMContentLoaded', function () {
  var header = document.querySelector('[data-header]');
  function updateHeader() {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 40);
  }
  window.addEventListener('scroll', updateHeader, { passive: true });
  updateHeader();

  function updateCartCount(count) {
    var link = document.querySelector('a.nc-icon-link[href*="cart"]');
    if (!link) return;
    var badge = link.querySelector('[data-cart-count]');
    if (count > 0) {
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'nc-cart-count';
        badge.setAttribute('data-cart-count', '');
        link.appendChild(badge);
      }
      badge.textContent = count;
    } else if (badge) {
      badge.remove();
    }
  }

  document.addEventListener('submit', function (e) {
    var form = e.target.closest('form[action*="/cart/add"]');
    if (!form || form.dataset.ncAjaxCart === 'false') return;
    e.preventDefault();

    var btn = form.querySelector('[type="submit"][name="add"]');
    var addedNote = form.querySelector('[data-nc-cart-added]');
    if (btn) {
      btn.disabled = true;
      btn.setAttribute('aria-busy', 'true');
    }

    fetch('/cart/add.js', {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    })
      .then(function (res) {
        return res.json().then(function (data) {
          if (!res.ok) throw data;
          return data;
        });
      })
      .then(function () {
        return fetch('/cart.js', { headers: { Accept: 'application/json' } }).then(function (res) {
          return res.json();
        });
      })
      .then(function (cart) {
        updateCartCount(cart.item_count);
        if (addedNote) {
          addedNote.hidden = false;
          window.clearTimeout(addedNote._ncHideTimer);
          addedNote._ncHideTimer = window.setTimeout(function () {
            addedNote.hidden = true;
          }, 5000);
        }
      })
      .catch(function (err) {
        window.alert((err && err.description) || 'Could not add to cart. Please try again.');
      })
      .finally(function () {
        if (btn) {
          btn.disabled = false;
          btn.removeAttribute('aria-busy');
        }
      });
  });

  document.querySelectorAll('[data-nc-marble-card]').forEach(function (card) {
    var img = card.querySelector('[data-nc-card-img]');
    if (!img) return;
    var defaultSrc = img.dataset.defaultSrc || img.getAttribute('src');
    // srcset wins over src, so it has to come off before a preview can show
    // and go back on when the pointer leaves.
    var defaultSrcset = img.getAttribute('srcset') || '';
    var defaultSizes = img.getAttribute('sizes') || '';

    function showPreview(swatch) {
      var next = swatch.dataset.img;
      if (!next || !next.length) return;
      img.removeAttribute('srcset');
      img.removeAttribute('sizes');
      img.src = next;
    }

    function restoreDefault() {
      if (!defaultSrc) return;
      img.src = defaultSrc;
      if (defaultSrcset) img.setAttribute('srcset', defaultSrcset);
      if (defaultSizes) img.setAttribute('sizes', defaultSizes);
    }

    card.querySelectorAll('[data-nc-marble-preview]').forEach(function (swatch) {
      swatch.addEventListener('mouseenter', function () {
        showPreview(swatch);
        card.querySelectorAll('[data-nc-marble-preview]').forEach(function (el) {
          el.classList.remove('is-active');
        });
        swatch.classList.add('is-active');
      });
      swatch.addEventListener('mouseleave', function () {
        restoreDefault();
        swatch.classList.remove('is-active');
      });
      swatch.addEventListener('focus', function () {
        showPreview(swatch);
      });
      swatch.addEventListener('blur', restoreDefault);
      swatch.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        showPreview(swatch);
        card.querySelectorAll('[data-nc-marble-preview]').forEach(function (el) {
          el.classList.remove('is-active');
        });
        swatch.classList.add('is-active');
      });
    });
  });

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(pointer: fine)').matches;

  var loader = document.querySelector('[data-nc-loader]');
  function dismissLoader() {
    if (loader) loader.classList.add('is-done');
  }
  if (reduceMotion) {
    dismissLoader();
  } else {
    window.addEventListener('load', dismissLoader);
    window.setTimeout(dismissLoader, 1400);
  }

  var cursor = document.querySelector('[data-nc-cursor]');
  if (cursor) {
    cursor.innerHTML = '<span class="nc-cursor-dot"></span><span class="nc-cursor-ring"></span>';
    var ring = cursor.querySelector('.nc-cursor-ring');
    var classic = window.matchMedia('(pointer: fine)').matches;
    if (classic && !reduceMotion) {
      cursor.hidden = false;
      document.documentElement.classList.add('nc-has-cursor');
    }
    document.addEventListener('mousemove', function (e) {
      if (!classic) return;
      var x = e.clientX, y = e.clientY;
      cursor.style.transform = 'translate(' + (x - 4) + 'px, ' + (y - 4) + 'px)';
    });
    var hoverTargets = document.querySelectorAll('a, button, [role="button"], input, select, textarea, .ncs-marble-choice, .ncs-marble-swatch');
    hoverTargets.forEach(function (el) {
      el.addEventListener('mouseenter', function () { ring.classList.add('hovering'); });
      el.addEventListener('mouseleave', function () { ring.classList.remove('hovering'); });
    });
  }

  if (finePointer && !reduceMotion) {
    var heroMedia = document.querySelector('.ncs-home-hero .ncs-hero-media');
    if (heroMedia) {
      window.addEventListener(
        'scroll',
        function () {
          heroMedia.style.transform = 'translate3d(0,' + window.scrollY * 0.12 + 'px,0)';
        },
        { passive: true }
      );
    }
  }

  document.querySelectorAll('.ncs-legal-page .ncs-legal-body h2, .ncs-legal-page .ncs-legal-body h3').forEach(function (heading) {
    if (heading.querySelector('.nc-gold')) return;
    if (heading.children.length) return;
    var text = (heading.textContent || '').trim();
    var parts = text.split(/\s+/);
    if (parts.length < 2) return;
    var last = parts.pop();
    heading.textContent = '';
    heading.appendChild(document.createTextNode(parts.join(' ') + ' '));
    var gold = document.createElement('span');
    gold.className = 'nc-gold';
    gold.textContent = last;
    heading.appendChild(gold);
  });

  var indexEl = document.querySelector('[data-nc-catalog-search]');
  var emptyEl = document.querySelector('[data-nc-search-empty]');
  var resultsEl = document.querySelector('[data-nc-catalog-results]');
  if (indexEl && emptyEl && resultsEl) {
    var catalog = [];
    try {
      catalog = JSON.parse(indexEl.textContent);
    } catch (e) {
      catalog = [];
    }
    var params = new URLSearchParams(window.location.search);
    var query = (params.get('q') || '').trim().toLowerCase();
    if (query && catalog.length) {
      var matches = catalog.filter(function (item) {
        var hay = (item.name + ' ' + item.category + ' ' + item.handle + ' ' + item.keywords).toLowerCase();
        return hay.indexOf(query) > -1;
      });
      if (!matches.length) {
        emptyEl.textContent = 'Nothing under that name.';
      } else {
        emptyEl.hidden = true;
        resultsEl.hidden = false;
        resultsEl.innerHTML = matches
          .map(function (item) {
            var isCollection = item.category === 'Collection';
            var safeName = String(item.name || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
            var media =
              '<div class="ncs-card-media ncs-fit-img ncs-fit-img--tile' +
              (isCollection ? ' ncs-fit-img--compact' : '') +
              '"><img src="' +
              String(item.image || '').replace(/"/g, '') +
              '" alt="' +
              safeName +
              '" loading="lazy" width="700" height="' +
              (isCollection ? '525' : '875') +
              '"></div>';
            return (
              '<a class="ncs-card" href="' +
              String(item.url || '').replace(/"/g, '') +
              '">' +
              media +
              '<div class="ncs-card-info"><span class="ncs-card-name">' +
              safeName +
              '</span><span class="ncs-card-category">' +
              String(item.category || '').replace(/</g, '&lt;') +
              '</span></div></a>'
            );
          })
          .join('');
      }
    }
  }
});
