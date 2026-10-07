/* Accordion behaviour for the homepage.
   - Every .toggle button controls the panel named in aria-controls.
   - Section toggles (About, News, …) and nested item toggles (Research highlights)
     share the same mechanism; "Expand all" only drives the section toggles.
   - Arriving with a hash (index.html#publications) opens that section.
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
  function openFromHash() {
    var id = window.location.hash.replace(/^#/, '');
    if (!id) { return; }
    var target = document.getElementById(id);
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

  window.addEventListener('hashchange', openFromHash);
  openFromHash();
  syncExpandAll();
})();
