
document.querySelectorAll('.menu-btn').forEach(btn=>btn.addEventListener('click',()=>document.querySelector('.nav')?.classList.toggle('open')));

const finderGo=document.querySelector('#finder-go');
if(finderGo){
  finderGo.addEventListener('click',()=>{
    const p=new URLSearchParams();
    const s=document.querySelector('#finder-sector')?.value;
    const z=document.querySelector('#finder-size')?.value;
    const st=document.querySelector('#finder-status')?.value;
    if(s)p.set('sector',s);
    if(z)p.set('size',z);
    if(st)p.set('status',st);
    location.href='/dha-city-karachi-rates/'+(p.toString()?'?'+p.toString():'');
  });
}

function esc(s){
  return String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
}

async function initRates(){
  const root=document.querySelector('[data-rates-app]');
  if(!root) return;

  const res=await fetch('/data/rates.json');
  const rows=await res.json();

  const tbody=document.querySelector('#rates-body');
  const q=document.querySelector('#q');
  const sector=document.querySelector('#sector');
  const size=document.querySelector('#size');
  const status=document.querySelector('#status');

  const sectorValues=[...new Set(rows.map(r=>r.parent_sector))].sort((a,b)=>{
    const na=parseInt(a), nb=parseInt(b);
    return (isNaN(na)?999:na)-(isNaN(nb)?999:nb);
  });
  sectorValues.forEach(v=>sector.add(new Option(v==='16 Extension'?'Sector 16 Extension':'Sector '+v,v)));
  [...new Set(rows.map(r=>r.plot_size))].sort((a,b)=>a-b).forEach(v=>size.add(new Option(v+' Sq Yds',v)));

  function render(){
    const term=q.value.trim().toLowerCase();
    const x=rows.filter(r =>
      (!sector.value||r.parent_sector===sector.value) &&
      (!size.value||String(r.plot_size)===size.value) &&
      (!status.value||r.status===status.value) &&
      (!term||r.area_code.toLowerCase().includes(term)||r.area_name.toLowerCase().includes(term))
    );

    tbody.innerHTML=x.map(r=>`
      <tr>
        <td><a href="${esc(r.seo_url)}"><strong>${esc(r.area_code)}</strong></a></td>
        <td>${r.plot_size} Sq Yds</td>
        <td><span class="status ${r.status==='Possession'?'pos':r.status==='Non Possession'?'non':'dev'}">${esc(r.status)}</span></td>
        <td>${r.min_lac==null?'<span class="muted">Contact for verified rate</span>':`${r.min_lac}–${r.max_lac} Lac`}</td>
        <td><a href="https://wa.me/923312608959?text=${encodeURIComponent('Assalam o Alaikum, '+r.area_code+' '+r.plot_size+' yards ka latest verified rate bata dein.')}" target="_blank" rel="noopener"><strong>Get rate →</strong></a></td>
      </tr>`).join('') || '<tr><td colspan="5">No matching areas found.</td></tr>';

    document.querySelector('#result-count').textContent=x.length+' matching records';

    const p=new URLSearchParams();
    if(sector.value)p.set('sector',sector.value);
    if(size.value)p.set('size',size.value);
    if(status.value)p.set('status',status.value);
    if(q.value)p.set('q',q.value);
    history.replaceState(null,'',location.pathname+(p.toString()?'?'+p.toString():''));
  }

  const params=new URLSearchParams(location.search);
  if(params.get('sector')) sector.value=params.get('sector');
  if(params.get('size')) size.value=params.get('size');
  if(params.get('status')) status.value=params.get('status');
  if(params.get('q')) q.value=params.get('q');

  [q,sector,size,status].forEach(el=>el.addEventListener('input',render));
  document.querySelector('#clear-filters')?.addEventListener('click',()=>{
    q.value=''; sector.value=''; size.value=''; status.value=''; render();
  });

  render();
}
initRates();
