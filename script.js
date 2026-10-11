(() => {
  const summaries = [...document.querySelectorAll('.paper-summary')];
  const expandButton = document.querySelector('#expand-all');
  function syncButton() {
    const allOpen = summaries.every(detail => detail.open);
    expandButton.setAttribute('aria-expanded', String(allOpen));
    expandButton.innerHTML = `${allOpen ? 'Collapse' : 'Expand'} all summaries<span aria-hidden="true">${allOpen ? '−' : '+'}</span>`;
  }
  expandButton.addEventListener('click', () => {
    const shouldOpen = !summaries.every(detail => detail.open);
    summaries.forEach(detail => { detail.open = shouldOpen; });
    syncButton();
  });
  summaries.forEach(detail => detail.addEventListener('toggle', syncButton));
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
