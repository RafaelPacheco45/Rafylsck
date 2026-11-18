(() => {
  'use strict';
  const group = document.querySelector('.startup-filters');
  if (!group) return;
  const buttons = [...group.querySelectorAll('button')];
  const cards = [...document.querySelectorAll('[data-startup-category]')];
  const result = document.querySelector('.startup-result');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  group.hidden = false;
  result.hidden = false;
  buttons.forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.startupFilter;
    let count = 0;
    buttons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    cards.forEach(card => {
      const show = filter === 'Todas' || card.dataset.startupCategory === filter;
      card.hidden = !show;
      card.classList.remove('reveal-startup');
      if (show) {
        count++;
        if (!reduced.matches) {
          void card.offsetWidth;
          card.classList.add('reveal-startup');
        }
      }
    });
    result.textContent = `${count} ${count === 1 ? 'projeto' : 'projetos'}`;
  }));
})();
