(() => {
  const toggles = [...document.querySelectorAll('.summary-toggle')];
  const expandButton = document.querySelector('#expand-all');
  function setSummary(toggle, open) {
    toggle.setAttribute('aria-expanded', String(open));
    document.getElementById(toggle.getAttribute('aria-controls')).hidden = !open;
  }
  function syncButton() {
    const allOpen = toggles.every(toggle => toggle.getAttribute('aria-expanded') === 'true');
    expandButton.setAttribute('aria-expanded', String(allOpen));
    expandButton.innerHTML = `${allOpen ? 'Collapse' : 'Expand'} all summaries<span aria-hidden="true">${allOpen ? '−' : '+'}</span>`;
  }
  toggles.forEach(toggle => {
    setSummary(toggle, false);
    toggle.hidden = false;
    toggle.addEventListener('click', () => {
      setSummary(toggle, toggle.getAttribute('aria-expanded') !== 'true');
      syncButton();
    });
  });
  expandButton.addEventListener('click', () => {
    const shouldOpen = !toggles.every(toggle => toggle.getAttribute('aria-expanded') === 'true');
    toggles.forEach(toggle => setSummary(toggle, shouldOpen));
    syncButton();
  });
  syncButton();
  const links = [...document.querySelectorAll('nav a')];
  const sections = links.map(link => document.querySelector(link.getAttribute('href')));
  let scheduled = false;
  function updateNavigation() {
    const reached = sections.map(section => ({ section, top: section.getBoundingClientRect().top })).filter(item => item.top <= 180);
    const lastTop = reached.length ? Math.max(...reached.map(item => item.top)) : null;
    const row = reached.filter(item => Math.abs(item.top - lastTop) < 5);
    const selected = row.find(item => `#${item.section.id}` === location.hash) || row[0];
    const current = selected ? selected.section.id : null;
    links.forEach(link => {
      const active = link.getAttribute('href') === `#${current}`;
      link.classList.toggle('active', active);
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    scheduled = false;
  }
  window.addEventListener('scroll', () => {
    if (!scheduled) { scheduled = true; requestAnimationFrame(updateNavigation); }
  }, { passive: true });
  window.addEventListener('resize', updateNavigation);
  updateNavigation();
})();
