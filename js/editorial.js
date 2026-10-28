const menu = document.querySelector('.menu');
const navigation = document.querySelector('.navigation');
function closeMenu(){navigation?.classList.remove('open');menu?.setAttribute('aria-expanded','false');}
menu?.addEventListener('click',()=>{const open=navigation.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});
navigation?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&navigation?.classList.contains('open')){closeMenu();menu.focus();}});
const search=document.querySelector('#project-search');
const cards=[...document.querySelectorAll('.catalogue article')];
const filters=[...document.querySelectorAll('.filter')];
const normalize=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
let category='Todos';
function filterProjects(){const query=normalize(search.value.trim());let count=0;cards.forEach(card=>{const visible=(category==='Todos'||card.dataset.category===category)&&normalize(card.textContent).includes(query);card.hidden=!visible;if(visible)count++;});document.querySelector('#result-count').textContent=`${count} ${count===1?'projeto ou frente encontrada':'projetos e frentes encontrados'}`;document.querySelector('#empty').hidden=count>0;}
filters.forEach(button=>button.addEventListener('click',()=>{category=button.dataset.category;filters.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));filterProjects();}));
search?.addEventListener('input',filterProjects);
