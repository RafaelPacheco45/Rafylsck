(() => {
'use strict';
/* Rafylsck: small, dependency-free interactions. */
const root = document.documentElement;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

const menu = document.querySelector('.menu');
const navigation = document.querySelector('.navigation');
function closeMenu() { navigation?.classList.remove('open'); menu?.setAttribute('aria-expanded', 'false'); }
menu?.addEventListener('click', () => {
  const open = navigation.classList.toggle('open');
  menu.setAttribute('aria-expanded', String(open));
});
navigation?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && navigation?.classList.contains('open')) { closeMenu(); menu.focus(); }
});
document.addEventListener('click', e => { if (!e.target.closest('.masthead')) closeMenu(); });

const search = document.querySelector('#project-search');
const cards = [...document.querySelectorAll('.catalogue article')];
const filters = [...document.querySelectorAll('.filter')];
const normalize = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
let category = 'Todos';
function animateIn(element, delay = 0) {
  if (element.animate) element.animate(
    [{ opacity: .25, transform: 'translateY(12px)' }, { opacity: 1, transform: 'translateY(0)' }],
    { duration: 380, delay, easing: 'cubic-bezier(.2,.7,.2,1)' }
  );
}
function filterProjects(animate = true) {
  if (!search) return;
  const query = normalize(search.value.trim());
  let count = 0;
  cards.forEach(card => {
    const visible = (category === 'Todos' || card.dataset.category === category) && normalize(card.textContent).includes(query);
    card.hidden = !visible;
    if (visible) {
      card.classList.remove('is-waiting');
      if (animate && count < 9) animateIn(card, count * 25);
      count++;
    }
  });
  document.querySelector('#result-count').textContent = `${count} ${count === 1 ? 'projeto ou frente encontrada' : 'projetos e frentes encontrados'}`;
  document.querySelector('#empty').hidden = count > 0;
}
filters.forEach(button => {
  const total = cards.filter(c => button.dataset.category === 'Todos' || c.dataset.category === button.dataset.category).length;
  const count = document.createElement('span');
  count.className = 'filter-count'; count.textContent = total; count.setAttribute('aria-hidden', 'true');
  button.append(count);
  button.addEventListener('click', () => {
    category = button.dataset.category;
    filters.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
    filterProjects();
  });
});
search?.addEventListener('input', () => filterProjects(false));
document.querySelector('.reset-search')?.addEventListener('click', () => {
  search.value = ''; category = 'Todos';
  filters.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.category === category)));
  filterProjects(); search.focus();
});
const viewButtons = [...document.querySelectorAll('[data-view]')];
viewButtons.forEach(button => button.addEventListener('click', () => {
  document.querySelector('.catalogue').classList.toggle('is-list', button.dataset.view === 'list');
  viewButtons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  cards.filter(c => !c.hidden).slice(0, 6).forEach((c, i) => animateIn(c, i * 25));
}));
// Direct research links remain usable after a visitor has applied filters.
function showLinkedProject() {
  const id = window.location.hash.slice(1);
  const card = cards.find(c => c.id === id);
  if (card) {
    category = 'Todos'; search.value = '';
    filters.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.category === 'Todos')));
    filterProjects(false);
    card.scrollIntoView({ block: 'center', behavior: 'smooth' });
  }
}
window.addEventListener('hashchange', showLinkedProject);
if (cards.length) showLinkedProject();

const orbitData = {
  autozap: ['AutoZap', 'Gestão, atendimento e inteligência artificial para o setor de telefonia.', '/products/autozap/'],
  autobook: ['AutoBook', 'Uma comunidade que aproxima técnicos, lojas e fornecedores.', '/autozap/autobook/'],
  oraculum: ['Oraculum', 'Inteligência artificial e reconhecimento de textos como apoio ao estudo.', '/products/oraculum/'],
  pesquisa: ['Pesquisa independente', 'Água, alimentos e dinâmica dos fluidos: perguntas que abrem novas frentes.', '/rafael/#active-hydraulic'],
  literatura: ['Theory of Shadows', 'Ciência, personagens e imaginação em um universo de ficção autoral.', '/rafael/#theory-of-shadows']
};
const orbitButtons = [...document.querySelectorAll('[data-orbit]')];
orbitButtons.forEach(button => button.addEventListener('click', () => {
  const [name, description, href] = orbitData[button.dataset.orbit];
  orbitButtons.forEach(b => b.setAttribute('aria-pressed', String(b === button)));
  const detail = document.querySelector('.universe-detail');
  detail.querySelector('strong').textContent = name;
  detail.querySelector('p').textContent = description;
  const link = detail.querySelector('a');
  link.href = href; link.setAttribute('aria-label', `Explorar ${name}`);
  animateIn(detail);
}));

// Observe once. Content stays visible if JavaScript or animation support is unavailable.
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.remove('is-waiting');
      observer.unobserve(entry.target);
    }
  }), { threshold: .07, rootMargin: '0px 0px 35px 0px' });
  document.querySelectorAll('.section-head,.feature,.research-list a,.bio,.timeline article,.catalogue article,.method article,.education div,.quote,.contact-row').forEach(element => {
    element.classList.add('reveal-item');
    if (element.getBoundingClientRect().top > window.innerHeight) element.classList.add('is-waiting');
    observer.observe(element);
  });
  root.classList.add('motion-ready');
}
document.querySelectorAll('.hero-top,.hero-copy,.personal-hero h1,.personal-subtitle,.personal-aside,.universe').forEach((element, i) => animateIn(element, i * 80));
const progress = document.querySelector('.reading-progress');
const header = document.querySelector('.masthead');
let scheduled = false;
function updateScroll() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
  header?.classList.toggle('scrolled', window.scrollY > 20);
  scheduled = false;
}
window.addEventListener('scroll', () => { if (!scheduled) { scheduled = true; requestAnimationFrame(updateScroll); } }, { passive: true });
window.addEventListener('resize', updateScroll);
updateScroll();

// Pointer effects are limited to precise pointing devices.
document.querySelectorAll('.feature,.catalogue article').forEach(card => {
  card.addEventListener('pointermove', event => {
    if (!finePointer.matches) return;
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left, y = event.clientY - rect.top;
    card.style.setProperty('--pointer-x', `${x}px`); card.style.setProperty('--pointer-y', `${y}px`);
    card.style.setProperty('--tilt-x', `${(y / rect.height - .5) * -4}deg`);
    card.style.setProperty('--tilt-y', `${(x / rect.width - .5) * 4}deg`);
  }, { passive: true });
  card.addEventListener('pointerleave', () => {
    card.style.setProperty('--tilt-x', '0deg'); card.style.setProperty('--tilt-y', '0deg');
  });
});
document.querySelector('.copy-email')?.addEventListener('click', async () => {
  const status = document.querySelector('.copy-status');
  try { await navigator.clipboard.writeText('rp777045@gmail.com'); status.textContent = 'E-mail copiado.'; }
  catch { status.textContent = 'rp777045@gmail.com'; }
});

})();
