import {allocationRange,rangeMoney,METHODS,MAP_MEASURES,policyValue,policyRange,SECTIONS,money,searchSeats,readState,stateHash,csv,industryRows,divisionBreakdown,colourBin} from './lib.js';

const $=id=>document.getElementById(id);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const colours=['#d5e2cd','#a4c4aa','#659b85','#327963','#124f46'];
const labels=['Under £500k','£500k–£1m','£1m–£2m','£2m–£5m','£5m+'];
const explanations={S_EMP:'Distributes industry electricity according to workplace employment.',S_GVA:'Adjusts employment for regional differences in economic output per worker.',S_PUR:'Adjusts employment for regional differences in business spending per worker.'};
let data,seats,byKey,consumption,comparisonByKey,state,suggestions=[],active=-1,showAll=false,requestId=0,mapData,mapPaths=[],baseView,view,drag;
const detailCache=new Map();

async function json(url){const r=await fetch(url);if(!r.ok)throw Error(`Could not load ${url} (${r.status})`);return r.json();}
function selectedRow(method=state.method){return byKey.get(`${state.seat}/${method}`);}
function selectedValue(row,scenario=state.scenario){return row?.[`${scenario}_gbp_per_year`];}
function seatRange(code,scenario=state.scenario){return allocationRange(Object.keys(METHODS).map(m=>byKey.get(`${code}/${m}`)),scenario);}
function mapValue(row){return policyValue(row,state.scenario,state.measure);}
function mapRange(code){return policyRange(Object.keys(METHODS).map(m=>byKey.get(`${code}/${m}`)),state.scenario,state.measure);}
function mapLabel(){return state.measure==='CURRENT'?'Without expansion · current BICS forecast':`${MAP_MEASURES[state.measure]} · ${scenarioName()}`;}
function scenarioName(){return state.scenario==='C_ALL'?'Manufacturing expansion · quantified scope':'Production expansion · quantified scope';}
function announce(message){$('announcer').textContent=message;}
function update(next,{focus=false,push=true}={}){
 state={...state,...next};
 if(push)history.pushState(null,'',stateHash(state));
 render();
 if(focus&&state.seat){$('seat-title').focus({preventScroll:true});$('seat-results').scrollIntoView({behavior:'instant',block:'start'});}
}
function chooseSeat(code){closeSuggestions();$('seat-search').value=byKey.get(`${code}/${state.method}`).pcon24_name;$('clear-search').hidden=false;showAll=false;update({seat:code},{focus:true});}

function closeSuggestions(){$('suggestions').hidden=true;$('seat-search').setAttribute('aria-expanded','false');$('seat-search').removeAttribute('aria-activedescendant');active=-1;}
function suggest(){
 const input=$('seat-search');suggestions=searchSeats(seats,input.value);active=-1;
 $('clear-search').hidden=!input.value;
 $('suggestions').innerHTML=suggestions.length?suggestions.map((s,i)=>`<li id="suggestion-${i}" role="option" aria-selected="false" data-code="${s.pcon24_code}"><span>${esc(s.pcon24_name)}</span><small>${esc(s.nation)}</small></li>`).join(''):'<li class="no-results" role="option" aria-disabled="true">No matches. Try a shorter name or a different spelling.</li>';
 $('suggestions').hidden=false;input.setAttribute('aria-expanded','true');input.removeAttribute('aria-activedescendant');
 $('search-hint').textContent=suggestions.length?`${suggestions.length} suggestion${suggestions.length===1?'':'s'}. Use the arrow keys and Enter to select.`:'No matching constituency. Search covers Great Britain, excluding Northern Ireland.';
}
function moveSuggestion(direction){if($('suggestions').hidden)suggest();if(!suggestions.length)return;active=(active+direction+suggestions.length)%suggestions.length;for(const [i,li] of [...$('suggestions').children].entries())li.setAttribute('aria-selected',String(i===active));$('seat-search').setAttribute('aria-activedescendant',`suggestion-${active}`);$(`suggestion-${active}`).scrollIntoView({block:'nearest'});}
function bindSearch(){
 $('seat-search').disabled=false;
 $('seat-search').addEventListener('input',suggest);
 $('seat-search').addEventListener('focus',suggest);
 $('seat-search').addEventListener('keydown',e=>{
  if(e.key==='ArrowDown'){e.preventDefault();moveSuggestion(1);}
  else if(e.key==='ArrowUp'){e.preventDefault();moveSuggestion(-1);}
  else if(e.key==='Enter'&&!$('suggestions').hidden&&suggestions.length){e.preventDefault();chooseSeat(suggestions[active<0?0:active].pcon24_code);}
  else if(e.key==='Escape')closeSuggestions();
  else if(e.key==='Tab')closeSuggestions();
 });
 $('suggestions').addEventListener('mousedown',e=>e.preventDefault());
 $('suggestions').addEventListener('click',e=>{const li=e.target.closest('[data-code]');if(li)chooseSeat(li.dataset.code);});
 $('clear-search').addEventListener('click',()=>{$('seat-search').value='';update({seat:null});$('seat-search').focus();suggest();});
 document.addEventListener('click',e=>{if(!e.target.closest('.search-box'))closeSuggestions();});
 const featured=['Bury South','Aberdeen South','Birmingham Ladywood'].map(name=>seats.find(s=>s.pcon24_name===name)).filter(Boolean);
 $('examples').innerHTML='<span>Examples:</span>'+featured.map(s=>`<button data-code="${s.pcon24_code}">${esc(s.pcon24_name)}</button>`).join('');
 $('examples').addEventListener('click',e=>{if(e.target.dataset.code)chooseSeat(e.target.dataset.code);});
}

function render(){
 $('method').value=state.method;
 $('reference-note').textContent=state.method==='S_EMP'?'Employment is the initial reference, not a preferred estimator.':`${METHODS[state.method]} selected. No preferred estimator.`;
 document.querySelectorAll('[data-scenario]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.scenario===state.scenario)));
 $('download-method').href=`./downloads/constituency_savings_${state.method}.csv`;
 document.querySelectorAll('[data-measure]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.measure===state.measure)));
 $('map-method').textContent=`${METHODS[state.method]} · ${mapLabel().toLowerCase()}`;
 $('map-scenario-label').textContent=mapLabel();
 const current=data.metadata.national.CURRENT,additional=data.metadata.national[state.scenario];
 $('national-current').textContent=money(current);
 $('national-expanded').textContent=money(current+additional);
 $('national-expanded-scope').textContent=state.scenario==='C_ALL'?'Manufacturing expansion · quantified subtotal, per year':'Production expansion · quantified subtotal, per year';
 $('map-total').textContent=money(state.measure==='CURRENT'?current:current+additional);
 $('map-total-note').textContent=`Annual BICS relief across Great Britain · ${state.measure==='CURRENT'?'current eligibility forecast':'quantified scope'}`;
 renderRanking();renderMapColours();
 $('seat-results').hidden=!state.seat;
 if(!state.seat){document.title='BICS Expansion Explorer';return;}
 const r=selectedRow();
 document.title=`${r.pcon24_name} | BICS Expansion Explorer`;
 $('seat-place').textContent=`${r.nation}${r.region===r.nation?'':` · ${r.region}`} · PCON24`;
 $('seat-title').textContent=r.pcon24_name;
 $('seat-extra').textContent=rangeMoney(seatRange(state.seat,'BE_EXTRA'));
 renderPolicyComparison(r);
 $('baseline-detail').innerHTML=`<p>Allocated current-policy BICS baseline (published 2027/28 forecast): <strong>${money(r.CURRENT_gbp_per_year,{precise:true})}/year</strong>. Equivalent Supercharger support is accounted for separately: ${new Intl.NumberFormat('en-GB',{maximumFractionDigits:0}).format(r.equivalent_supercharger_mwh)} MWh of modelled qualifying electricity.</p><p>Gross relief under manufacturing expansion, including retained non-manufacturing baseline: <strong>${money(r.C_ALL_gross_gbp_per_year,{precise:true})}</strong>; under all production: <strong>${money(r.BE_ALL_gross_gbp_per_year,{precise:true})}</strong>. The main figures include additional savings within already listed industries. Across GB, CURRENT matches 15.7 TWh, or £628m at the exercise rate of £40/MWh. Nuclear/gas increments remain unestimated.</p>`;
 $('sensitivity-detail').innerHTML=`<div class="section-heading"><div><p class="eyebrow">How the local range is constructed</p><h3>Manufacturing expansion: allocation method comparison</h3></div></div><div class="scenario-table-scroll"><table><caption>Manufacturing expansion is used here to illustrate how the range is calculated, regardless of the map selection. Each range takes the lowest and highest of the three estimates in its column.</caption><thead><tr><th scope="col">Allocation method</th><th scope="col">Without expansion</th><th scope="col">With expansion</th></tr></thead><tbody>${Object.entries(METHODS).map(([method,label])=>`<tr${state.method===method?' class="selected-scenario-row"':''}><th scope="row">${label}${state.method===method?' (selected)':''}</th><td>${money(policyValue(selectedRow(method),'C_ALL','CURRENT'))}</td><td>${money(policyValue(selectedRow(method),'C_ALL','TOTAL'))}</td></tr>`).join('')}</tbody></table></div><p>Only the geographical allocation changes. National electricity inputs, industry eligibility, £40/MWh, full take-up and the published Supercharger reference remain fixed. There is no national lower/upper consumption or support scenario in this range.</p><p>With-expansion totals are calculated as the without-expansion amount plus the increase from expansion within each method before taking the range. The endpoints of separate ranges should not be added together. This measures sensitivity to three allocation approaches. It is not a confidence interval or a complete uncertainty range. All methods share national input and coverage limitations; actual savings could fall outside the local range. The map uses the selected map measure. The industry breakdown below shows the increase from expansion under the selected allocation method.</p><p>Coverage limitations remain: activities requiring unverified sector shares are not estimated. This does not mean those activities are ineligible or receive no benefit. <a href="./methodology.html#coverage">See coverage and the source audit</a>.</p>`;
 renderConsumptionComparison();
 $('breakdown-scenario').textContent=`${scenarioName()} · ${METHODS[state.method]}`;
 renderSections(r);renderComparison();renderIndustries();
}
function renderPolicyComparison(r){
 const rows=Object.keys(METHODS).map(m=>selectedRow(m));
 $('seat-policy-title').textContent=scenarioName();
 for(const [id,measure] of [['seat-current','CURRENT'],['seat-total','TOTAL']]){
  $(id).textContent=rangeMoney(policyRange(rows,state.scenario,measure));
  $(id).title='Minimum and maximum across the three allocation methods; combined totals are calculated within each method.';
 }

}
function renderConsumptionComparison(){
 const rows=Object.keys(METHODS).map(m=>comparisonByKey.get(`${state.seat}/${m}`));
 const value=(r,b)=>r[`${b}_C_ALL_gbp_per_year`];
 const signed=n=>`${n<0?'−':n>0?'+':''}${money(Math.abs(n))}`;
 const range=b=>rangeMoney({low:Math.min(...rows.map(r=>value(r,b))),high:Math.max(...rows.map(r=>value(r,b)))});
 $('sensitivity-detail').insertAdjacentHTML('beforeend',`<div class="seat-consumption-comparison"><h3>Separate comparison: three-year average consumption</h3><p>Manufacturing expansion. The latest-year reference and the 2023–2025 average use the same geographical weights and the same national support totals. The map and industry breakdown continue to show the latest-year reference.</p><div class="scenario-table-scroll"><table class="consumption-table"><caption>Additional annual savings by consumption base. Change compares the same allocation method.</caption><thead><tr><th scope="col">Allocation method</th><th scope="col">2025 base</th><th scope="col">2023–2025 average base</th><th scope="col">Change</th></tr></thead><tbody>${rows.map(r=>`<tr${state.method===r.spatial_method?' class="selected-scenario-row"':''}><th scope="row">${METHODS[r.spatial_method]}</th><td>${money(value(r,'latest'))}</td><td>${money(value(r,'mean'))}</td><td>${signed(value(r,'change'))}</td></tr>`).join('')}</tbody><tfoot><tr><th scope="row">Range across three methods</th><td>${range('latest')}</td><td>${range('mean')}</td><td>Paired changes shown above</td></tr></tfoot></table></div><p>Each range compares allocation methods within its own consumption base. Neither is a confidence interval or a forecast of demand recovering as prices fall. <a href="./methodology.html#consumption-comparison">Calculation and limitations</a> · <a href="./downloads/consumption_comparison_constituencies.csv" download>Download all seat comparisons</a>.</p></div>`);
}
function renderSections(r){
 $('section-breakdown').hidden=state.scenario!=='BE_ALL';
 const max=Math.max(...'BCDE'.split('').map(s=>r[`section_${s}_gbp_per_year`]),1);
 $('section-breakdown').innerHTML='<div class="section-bars">'+'BCDE'.split('').map(s=>{const v=r[`section_${s}_gbp_per_year`];return `<div class="section-bar"><span>${SECTIONS[s]}</span><strong title="${money(v,{precise:true})}">${s==='D'?'Not estimated':money(v)}</strong><i style="width:${Math.max(v/max*100,0)}%"></i><small>Section ${s}</small></div>`;}).join('')+'</div>';
}
function renderComparison(){
 $('method-comparison').innerHTML=Object.entries(METHODS).map(([method,label])=>`<button class="method-card" data-method="${method}" aria-pressed="${state.method===method}"><span class="method-label">${label}${state.method===method?'<i>Selected</i>':''}</span><strong title="${money(policyValue(selectedRow(method),state.scenario,state.measure),{precise:true})}">${money(policyValue(selectedRow(method),state.scenario,state.measure))}</strong><small>${explanations[method]}</small></button>`).join('');
}
async function getIndustry(code,method){
 const key=`${code}/${method}`;
 if(!detailCache.has(key))detailCache.set(key,json(`./data/industry/${method}/${code}.json`).then(rows=>industryRows(rows,data.industries)).catch(e=>{detailCache.delete(key);throw e;}));
 return detailCache.get(key);
}
async function renderIndustries(){
 const id=++requestId,scenario=state.scenario,code=state.seat,method=state.method;
 $('industry-status').textContent='Loading industry breakdown…';$('industries').innerHTML='';$('show-industries').hidden=true;
 try{
  const rows=await getIndustry(code,method);if(id!==requestId)return;
  const groups=divisionBreakdown(rows,scenario);const visible=showAll?groups:groups.slice(0,8),max=groups[0]?.value||1;
  $('industry-status').textContent=groups.length?'':'No additional savings are estimated in this scenario.';
  $('industries').innerHTML=visible.map(g=>`<details class="industry-row"><summary><span>${esc(g.name)}</span><strong title="${money(g.value,{precise:true})}">${money(g.value)}</strong><div class="bar-track" aria-hidden="true"><div class="bar-fill" style="width:${g.value/max*100}%"></div></div></summary><div class="sic-classes">${g.classes.sort((a,b)=>b[scenario]-a[scenario]).map(c=>`<div class="sic-class"><div>${esc(c.industry_name)}<small>SIC ${c.sic4} · Section ${c.section}</small></div><strong title="${money(c[scenario],{precise:true})}">${money(c[scenario])}</strong></div>`).join('')}</div></details>`).join('');
  $('show-industries').hidden=groups.length<=8;$('show-industries').textContent=showAll?'Show fewer industries':`Show all ${groups.length} industries`;
 }catch{
  if(id!==requestId)return;
  $('industry-status').textContent='The detailed data could not be loaded. Your constituency totals are still available. ';const b=document.createElement('button');b.className='text-link';b.textContent='Try again';b.addEventListener('click',renderIndustries);$('industry-status').append(b);
 }
}
function renderRanking(){
 const sorted=seats.map(s=>byKey.get(`${s.pcon24_code}/${state.method}`)).sort((a,b)=>mapValue(b)-mapValue(a)).slice(0,6);
 $('ranking').innerHTML=sorted.map(r=>`<li><button data-code="${r.pcon24_code}"><span>${esc(r.pcon24_name)}</span><strong>${money(mapValue(r))}</strong></button></li>`).join('');
}
function downloadText(contents,name,type='text/csv;charset=utf-8'){
 const url=URL.createObjectURL(new Blob([contents],{type}));const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);
}
async function downloadIndustry(){
 const code=state.seat,method=state.method,scenario=state.scenario;if(!code)return;
 const button=$('download-industry');button.disabled=true;
 try{
  const rows=await getIndustry(code,method),name=byKey.get(`${code}/${method}`).pcon24_name;
  const head=['pcon24_code','constituency','spatial_method','selected_scenario','sic4','industry','section','currently_eligible_sic','CURRENT_gbp_per_year','C_ALL_additional_gbp_per_year','BE_ALL_additional_gbp_per_year','BE_EXTRA_additional_gbp_per_year','selected_additional_gbp_per_year','grid_mwh','equivalent_supercharger_mwh','quantified_scope_flag','estimate_status','quality_flag','source_ids','model_version'];
  downloadText(csv([head,...rows.map(r=>[code,name,method,scenario,r.sic4,r.industry_name,r.section,r.current_eligible_sic_flag,r.CURRENT,r.C_ALL,r.BE_ALL,r.BE_EXTRA,r[scenario],r.grid_mwh,r.supercharger_mwh,r.quantified_scope_flag,r.estimate_status,r.quality_flag,r.source_ids,data.metadata.model_version])]),`${code}_${method}_${scenario}_industries.csv`);
  announce('Industry CSV download started.');
 }catch{announce('The industry download could not be loaded. Please try again.');$('industry-status').textContent='Download failed. Please try again.';}
 finally{button.disabled=false;}
}

async function setupMap(){
 try{
  mapData=await json('./data/boundaries.json');
  baseView=mapData.viewBox.split(' ').map(Number);view=[...baseView];
  $('map').setAttribute('viewBox',mapData.viewBox);
  const ns='http://www.w3.org/2000/svg',frag=document.createDocumentFragment();
  mapData.paths.sort((a,b)=>a.name.localeCompare(b.name)).forEach((r,i)=>{
   const p=document.createElementNS(ns,'path');p.setAttribute('d',r.path);p.setAttribute('class','seat-shape');p.dataset.code=r.code;p.setAttribute('role','button');p.setAttribute('tabindex',i===0?'0':'-1');
   p.addEventListener('click',()=>{if(!drag?.moved)chooseSeat(r.code);});
   p.addEventListener('pointerenter',e=>showMapTooltip(e,r.code));p.addEventListener('pointermove',e=>moveMapTooltip(e));p.addEventListener('pointerleave',()=>{$('map-tooltip').hidden=true;});
   p.addEventListener('focus',()=>{$('map-caption').textContent=`${r.name}: ${money(mapValue(byKey.get(`${r.code}/${state.method}`)))} per year · ${mapLabel()}. Press Enter to open; arrow keys move between seats.`;});
   p.addEventListener('keydown',e=>{
    if(['Enter',' '].includes(e.key)){e.preventDefault();chooseSeat(r.code);}
    else if(['ArrowRight','ArrowDown','ArrowLeft','ArrowUp','Home','End'].includes(e.key)){
     e.preventDefault();const step=['ArrowRight','ArrowDown'].includes(e.key)?1:-1;
     const target=e.key==='Home'?0:e.key==='End'?mapPaths.length-1:(i+step+mapPaths.length)%mapPaths.length;
     mapPaths.forEach(x=>x.setAttribute('tabindex','-1'));mapPaths[target].setAttribute('tabindex','0');mapPaths[target].focus();
    }
   });
   frag.append(p);mapPaths.push(p);
  });
  $('map').append(frag);$('map').removeAttribute('hidden');$('map-status').hidden=true;
  renderMapColours();
  $('map-legend').innerHTML=labels.map((label,i)=>`<span><i style="background:${colours[i]}"></i>${label}</span>`).join('');
  $('zoom-in').addEventListener('click',()=>zoom(.7));$('zoom-out').addEventListener('click',()=>zoom(1/.7));$('zoom-reset').addEventListener('click',()=>{view=[...baseView];setView();});
  const svg=$('map');
  svg.addEventListener('pointerdown',e=>{if(e.pointerType==='touch')return;drag={x:e.clientX,y:e.clientY,start:[...view],moved:false};});
  svg.addEventListener('pointermove',e=>{if(!drag||!(e.buttons&1))return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>5)drag.moved=true;if(!drag.moved)return;svg.classList.add('dragging');const rect=svg.getBoundingClientRect(),scale=Math.max(view[2]/rect.width,view[3]/rect.height);view=[drag.start[0]-dx*scale,drag.start[1]-dy*scale,drag.start[2],drag.start[3]];setView();});
  window.addEventListener('pointerup',()=>{svg.classList.remove('dragging');setTimeout(()=>{drag=null;},0);});
  svg.addEventListener('pointerleave',()=>{if(drag){svg.classList.remove('dragging');setTimeout(()=>{drag=null;},0);}});
 }catch{
  $('map-status').textContent='The boundary map could not be loaded. Search, constituency results and downloads remain available.';
 }
}
function setView(){$('map').setAttribute('viewBox',view.join(' '));}
function zoom(factor){const width=Math.min(baseView[2]*1.2,Math.max(baseView[2]/10,view[2]*factor));const f=width/view[2];view=[view[0]+view[2]*(1-f)/2,view[1]+view[3]*(1-f)/2,width,view[3]*f];setView();}
function renderMapColours(){
 if(!mapData)return;
 $('map-tooltip').hidden=true;
 $('map-caption').textContent=`${mapLabel()}. Hover or select a constituency to compare current and expanded BICS relief.`;
 for(const p of mapPaths){const r=byKey.get(`${p.dataset.code}/${state.method}`),v=mapValue(r);p.setAttribute('fill',colours[colourBin(v)]);p.classList.toggle('selected',state.seat===p.dataset.code);p.setAttribute('aria-label',`${r.pcon24_name}, ${money(v)} · ${mapLabel()}; tested range ${rangeMoney(mapRange(r.pcon24_code))}. Open constituency results.`);if(state.seat)p.setAttribute('tabindex',p.dataset.code===state.seat?'0':'-1');}
}
function showMapTooltip(e,code){const r=byKey.get(`${code}/${state.method}`);$('map-tooltip').innerHTML=`${esc(r.pcon24_name)}<strong>${rangeMoney(mapRange(code))}/year</strong><span>${esc(MAP_MEASURES[state.measure])} · range across three allocation methods</span>`;$('map-tooltip').hidden=false;moveMapTooltip(e);$('map-caption').textContent=`${r.pcon24_name} · ${mapLabel()} · tested range ${rangeMoney(mapRange(code))} per year`;}
function moveMapTooltip(e){const rect=$('map-canvas').getBoundingClientRect(),tip=$('map-tooltip');tip.style.left=`${Math.max(5,Math.min(e.clientX-rect.left+12,rect.width-tip.offsetWidth-5))}px`;tip.style.top=`${Math.max(5,Math.min(e.clientY-rect.top-55,rect.height-tip.offsetHeight-5))}px`;}

async function init(){
 try{
  data=await json('./data/results.json');
  if(data.metadata.relief_gbp_mwh!==40||data.metadata.uptake!==1||data.metadata.minimum_consumption_mwh!==0||data.metadata.site_consumption_distribution!=='NOT_USED'||data.metadata.local_range_basis!=='MIN_MAX_OF_THREE_SPATIAL_METHODS'||data.metadata.national_bounds!=='NOT_USED'||data.seats.length!==1896)throw Error('Unexpected model version');
  consumption=await json('./data/consumption_comparison.json');
  if(consumption.metadata.model_version!==data.metadata.model_version||consumption.metadata.comparison_basis!=='MEAN_2023_2025'||consumption.seats.length!==1896)throw Error('Unexpected consumption comparison');
  comparisonByKey=new Map(consumption.seats.map(r=>[`${r.pcon24_code}/${r.spatial_method}`,r]));
  byKey=new Map(data.seats.map(r=>[`${r.pcon24_code}/${r.spatial_method}`,r]));seats=data.seats.filter(r=>r.spatial_method==='S_EMP');
  state=readState(location.hash,new Set(seats.map(s=>s.pcon24_code)));
  $('version').textContent=`${data.metadata.model_version} · Evidence: 22 October 2026 · Electricity: 2025`;
  $('app-content').hidden=false;
  bindSearch();
  document.querySelectorAll('[data-scenario]').forEach(b=>b.addEventListener('click',()=>{showAll=false;update({scenario:b.dataset.scenario});announce(`${scenarioName()} selected.`);}));
  $('method').addEventListener('change',e=>{update({method:e.target.value});announce(`${METHODS[state.method]} selected.`);});
  document.querySelectorAll('[data-measure]').forEach(b=>b.addEventListener('click',()=>{update({measure:b.dataset.measure});announce(`${MAP_MEASURES[state.measure]} shown on the map.`);}));
  $('method-comparison').addEventListener('click',e=>{const b=e.target.closest('[data-method]');if(b){update({method:b.dataset.method});announce(`${METHODS[state.method]} selected.`);$('method').focus({preventScroll:true});}});
  $('show-industries').addEventListener('click',()=>{showAll=!showAll;renderIndustries();});
  $('ranking').addEventListener('click',e=>{const b=e.target.closest('[data-code]');if(b)chooseSeat(b.dataset.code);});
  $('download-industry').addEventListener('click',downloadIndustry);
  $('share').addEventListener('click',async()=>{
   const url=location.origin+location.pathname+stateHash(state);history.replaceState(null,'',stateHash(state));
   try{await navigator.clipboard.writeText(url);$('share').textContent='Link copied';announce('Constituency link copied to clipboard.');}
   catch{$('share').textContent='Use the address-bar link';announce('Copy the address-bar URL to share this selection.');}
   setTimeout(()=>{$('share').innerHTML='<span aria-hidden="true">↗</span> Copy link';},2500);
  });
  window.addEventListener('hashchange',()=>{if(location.hash.includes('=')||!location.hash){state=readState(location.hash,new Set(seats.map(s=>s.pcon24_code)));render();}});
  window.addEventListener('popstate',()=>{if(location.hash.includes('=')||!location.hash){state=readState(location.hash,new Set(seats.map(s=>s.pcon24_code)));render();}});
  if(state.seat){$('seat-search').value=selectedRow().pcon24_name;$('clear-search').hidden=false;}
  render();
  if(state.seat)$('seat-results').scrollIntoView({behavior:'instant',block:'start'});
  else if(['#search','#map-section','#downloads'].includes(location.hash))$(location.hash.slice(1)).scrollIntoView({behavior:'instant',block:'start'});
  setupMap();
 }catch(e){$('load-error').textContent='The calculated results could not be loaded. Refresh the page or download the results directly below.';$('load-error').hidden=false;const a=document.createElement('a');a.href='./downloads/constituency_savings_all_methods.csv';a.textContent='Download the full CSV';$('load-error').append(document.createElement('br'),a);$('national-current').textContent='Unavailable';$('national-expanded').textContent='Unavailable';$('version').textContent='Data unavailable';console.error(e);}
}
init();
