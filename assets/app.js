
document.querySelectorAll('.menu-btn').forEach(btn=>btn.addEventListener('click',()=>document.querySelector('.nav')?.classList.toggle('open')));
function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));}
async function initRates(){
 const root=document.querySelector('[data-rates-app]'); if(!root) return;
 const res=await fetch('/data/rates.json'); const rows=await res.json();
 const tbody=document.querySelector('#rates-body'), q=document.querySelector('#q'), sector=document.querySelector('#sector'), size=document.querySelector('#size'), status=document.querySelector('#status');
 [...new Set(rows.map(r=>r.parent_sector))].sort((a,b)=>Number(a)-Number(b)).forEach(v=>sector.add(new Option('Sector '+v,v)));
 [...new Set(rows.map(r=>r.plot_size))].sort((a,b)=>a-b).forEach(v=>size.add(new Option(v+' Sq Yds',v)));
 function render(){let x=rows.filter(r=>(!sector.value||r.parent_sector===sector.value)&&(!size.value||String(r.plot_size)===size.value)&&(!status.value||r.status===status.value)&&(!q.value||r.area_code.toLowerCase().includes(q.value.toLowerCase())));
 tbody.innerHTML=x.map(r=>`<tr><td><a href="${esc(r.seo_url)}"><strong>${esc(r.area_code)}</strong></a></td><td>${r.plot_size} Sq Yds</td><td><span class="status ${r.status==='Possession'?'pos':'dev'}">${esc(r.status)}</span></td><td>${r.min_lac==null?'Contact for verified rate':`${r.min_lac}–${r.max_lac} Lac`}</td><td><a href="https://wa.me/923312608959?text=${encodeURIComponent('Assalam o Alaikum, '+r.area_code+' '+r.plot_size+' yards ka latest verified rate bata dein.')}" target="_blank" rel="noopener">Get rate →</a></td></tr>`).join('') || '<tr><td colspan="5">No matching areas found.</td></tr>';
 document.querySelector('#result-count').textContent=x.length+' records';}
 const params=new URLSearchParams(location.search); if(params.get('sector')) sector.value=params.get('sector'); if(params.get('size')) size.value=params.get('size'); if(params.get('status')) status.value=params.get('status'); [q,sector,size,status].forEach(el=>el.addEventListener('input',render));render();
}
initRates();
