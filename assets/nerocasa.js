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
      });
      swatch.addEventListener('mouseleave', restoreDefault);
      swatch.addEventListener('focus', function () {
        showPreview(swatch);
      });
      swatch.addEventListener('blur', restoreDefault);
    });
  });
});
