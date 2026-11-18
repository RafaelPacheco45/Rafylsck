const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const projects = JSON.parse(fs.readFileSync('startups/projects.json'));
const categories = ['Todas', ...new Set(projects.map(p => p.category))];
const buttons = categories.map(c => ({dataset:{startupFilter:c},attrs:{},setAttribute(k,v){this.attrs[k]=v},addEventListener(_,fn){this.click=fn}}));
const cards = projects.map(p => ({dataset:{startupCategory:p.category},hidden:false,classList:{remove(){},add(){}},offsetWidth:1}));
const group={hidden:true,querySelectorAll:()=>buttons},result={hidden:true};
const document={querySelector:s=>s==='.startup-filters'?group:result,querySelectorAll:()=>cards};
vm.runInNewContext(fs.readFileSync('js/startups.js','utf8'),{document,window:{matchMedia:()=>({matches:true})}});
assert.equal(group.hidden,false);assert.equal(result.hidden,false);
for(let n=0;n<3;n++)for(const b of buttons){b.click();const count=projects.filter(p=>b.dataset.startupFilter==='Todas'||p.category===b.dataset.startupFilter).length;assert.equal(cards.filter(c=>!c.hidden).length,count);assert.equal(buttons.filter(x=>x.attrs['aria-pressed']==='true').length,1);assert.equal(result.textContent,`${count} ${count===1?'projeto':'projetos'}`)}
buttons[0].click();assert.equal(cards.filter(c=>!c.hidden).length,7);
console.log('Filter behavior: all categories, 3 repetitions, count, selection and reset passed.');
