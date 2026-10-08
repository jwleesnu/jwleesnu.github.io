/* Accordion behaviour for the homepage.
   - Every .toggle button controls the panel named in aria-controls: the About and
     Education section toggles, and the "Summary" chip on each paper.
   - News and Research & Publications are always open and have no toggle.
   - "Expand all" opens every toggle; once everything is open it reads
     "Collapse all" and closes them all again.
   - Arriving with a hash (index.html#about, #fly-by-code) opens that panel.
   No dependencies, no build step. */
(function () {
  'use strict';

  var toggles = Array.prototype.slice.call(document.querySelectorAll('.toggle'));
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
  function allOpen() {
    return toggles.every(isOpen);
  }
  function syncExpandAll() {
    if (!expandAll) { return; }
    var all = allOpen();
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
      var all = allOpen();
      toggles.forEach(function (b) { setOpen(b, !all); });
      syncExpandAll();
    });
  }

  // Deep links: #about, #education, #fly-by-code … open the panel that belongs to
  // the target (and to any section around it) so a shared link lands on visible
  // content. Only a block's own toggle counts: a paper's Summary chip belongs to
  // the paper, not to the Research & Publications section that contains it.
  function openTarget(id) {
    var target = id && document.getElementById(id);
    if (!target) { return; }
    var node = target;
    while (node && node !== document.body) {
      if (node.classList && (node.classList.contains('section') || node.classList.contains('item'))) {
        var b = node.querySelector('.toggle');
        if (b && b.closest('.section, .item') === node && !isOpen(b)) { setOpen(b, true); }
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
