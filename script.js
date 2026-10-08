/* Accordion behaviour for the homepage.
   - Every .toggle button controls the panel named in aria-controls.
   - Section toggles (About, News, Education) and any nested .toggle--item toggles
     share the same mechanism; "Expand all" only drives the section toggles.
     Research & Publications is always open and has no toggle.
   - Arriving with a hash (index.html#news) opens that section.
   No dependencies, no build step. */
(function () {
  'use strict';

  var toggles = Array.prototype.slice.call(document.querySelectorAll('.toggle'));
  var sectionToggles = toggles.filter(function (b) { return !b.classList.contains('toggle--item'); });
  var itemToggles = toggles.filter(function (b) { return b.classList.contains('toggle--item'); });
  var expandAll = document.getElementById('expand-all');

  function panelOf(button) {
    return document.getElementById(button.getAttribute('aria-controls'));
  }
  function isOpen(button) {
    return button.getAttribute('aria-expanded') === 'true';
  }
  function setOpen(button, open) {
    button.setAttribute('aria-expanded', open ? 'true' : 'false');
    var panel = panelOf(button);
    if (panel) { panel.classList.toggle('is-open', open); }
  }
  function allSectionsOpen() {
    return sectionToggles.every(isOpen);
  }
  function syncExpandAll() {
    if (!expandAll) { return; }
    var all = allSectionsOpen();
    expandAll.textContent = all ? 'Collapse all' : 'Expand all';
    expandAll.setAttribute('aria-pressed', all ? 'true' : 'false');
  }

  toggles.forEach(function (button) {
    button.addEventListener('click', function () {
      setOpen(button, !isOpen(button));
      syncExpandAll();
    });
  });

  if (expandAll) {
    expandAll.addEventListener('click', function () {
      var all = allSectionsOpen();
      sectionToggles.forEach(function (b) { setOpen(b, !all); });
      if (all) { itemToggles.forEach(function (b) { setOpen(b, false); }); }
      syncExpandAll();
    });
  }

  // Deep links: #about, #publications, #fly-by-code … open the matching panel
  // (and its parent section) so a shared link lands on visible content.
  function openTarget(id) {
    var target = id && document.getElementById(id);
    if (!target) { return; }
    var node = target;
    while (node && node !== document.body) {
      if (node.classList && (node.classList.contains('section') || node.classList.contains('item'))) {
        var b = node.querySelector('.toggle');
        if (b && !isOpen(b)) { setOpen(b, true); }
      }
      node = node.parentNode;
    }
    syncExpandAll();
  }
  function openFromHash() {
    openTarget(window.location.hash.replace(/^#/, ''));
  }

  // In-page links (the top bar) open their section even when the hash is
  // already the same and no hashchange fires.
  Array.prototype.forEach.call(document.querySelectorAll('a[href^="#"]'), function (a) {
    a.addEventListener('click', function () {
      openTarget(a.getAttribute('href').slice(1));
    });
  });

  window.addEventListener('hashchange', openFromHash);
  openFromHash();
  syncExpandAll();
})();
