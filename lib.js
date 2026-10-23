export const METHODS={S_EMP:'Employment-based',S_GVA:'GVA-adjusted',S_PUR:'Expenditure-adjusted'};
export const MAP_MEASURES={CURRENT:'Without expansion',TOTAL:'With expansion'};
export function policyValue(row,scenario,measure='ADDITIONAL'){
 if(!['C_ALL','BE_ALL'].includes(scenario)||!['CURRENT','ADDITIONAL','TOTAL'].includes(measure))throw Error('Unknown policy view');
 const current=row.CURRENT_gbp_per_year,additional=row[`${scenario}_gbp_per_year`];
 if(!Number.isFinite(current)||!Number.isFinite(additional))throw Error('Missing policy values');
 return measure==='CURRENT'?current:measure==='TOTAL'?current+additional:additional;
}
export function policyRange(rows,scenario,measure){
 return allocationRange(rows.map(r=>({...r,POLICY_gbp_per_year:policyValue(r,scenario,measure)})),'POLICY');
}
export const SECTIONS={B:'Mining and quarrying',C:'Manufacturing',D:'Electricity and gas',E:'Water and waste'};
export const DIVISIONS={'05':'Coal and lignite','06':'Crude petroleum and natural gas','07':'Metal ores','08':'Other mining and quarrying','09':'Mining support services','10':'Food products','11':'Beverages','12':'Tobacco products','13':'Textiles','14':'Wearing apparel','15':'Leather products','16':'Wood and cork products','17':'Paper products','18':'Printing and recorded media','19':'Coke and refined petroleum','20':'Chemicals','21':'Pharmaceuticals','22':'Rubber and plastics','23':'Other non-metallic minerals','24':'Basic metals','25':'Fabricated metals','26':'Electronics and optical products','27':'Electrical equipment','28':'Machinery and equipment','29':'Motor vehicles','30':'Other transport equipment','31':'Furniture','32':'Other manufacturing','33':'Repair and installation','35':'Electricity, gas and steam','36':'Water supply','37':'Sewerage','38':'Waste and material recovery','39':'Environmental remediation'};
export function money(value,{precise=false}={}){
 if(!Number.isFinite(value))return 'Unavailable';
 if(precise)return new Intl.NumberFormat('en-GB',{style:'currency',currency:'GBP',maximumFractionDigits:0}).format(value);
 if(value>=1e9)return `£${(value/1e9).toFixed(2)}bn`;
 if(value>=1e6)return `£${(value/1e6).toFixed(2)}m`;
 if(value>=1e3)return `£${(value/1e3).toFixed(0)}k`;
 return `£${Math.round(value)}`;
}
export function normalise(s){return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/&/g,' and ').replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();}
export function distance(a,b){const d=Array.from({length:b.length+1},(_,i)=>i);for(let i=1;i<=a.length;i++){let prev=d[0];d[0]=i;for(let j=1;j<=b.length;j++){const save=d[j];d[j]=Math.min(d[j]+1,d[j-1]+1,prev+(a[i-1]===b[j-1]?0:1));prev=save;}}return d[b.length];}
export function searchSeats(seats,query,limit=8){
 const q=normalise(query);if(!q)return [...seats].sort((a,b)=>a.pcon24_name.localeCompare(b.pcon24_name)).slice(0,limit);
 const tokens=q.split(' ');
 return seats.map(seat=>{
  const name=normalise(seat.pcon24_name),words=name.split(' ');
  let score=name===q?0:name.startsWith(q)?1:name.includes(q)?2:100;
  if(score===100&&tokens.every(t=>words.some(w=>w.startsWith(t))))score=3;
  if(score===100&&q.length>=4){const distances=tokens.map(t=>Math.min(...words.map(w=>distance(t,w))));if(distances.every((d,i)=>d<=(tokens[i].length<5?1:2)))score=5+distances.reduce((a,b)=>a+b,0);}
  return {seat,score};
 }).filter(r=>r.score<100).sort((a,b)=>a.score-b.score||a.seat.pcon24_name.localeCompare(b.seat.pcon24_name)).slice(0,limit).map(r=>r.seat);
}
export function readState(hash,validCodes){
 const p=new URLSearchParams(hash.replace(/^#/,''));
 return {seat:validCodes.has(p.get('seat'))?p.get('seat'):null,scenario:p.get('scenario')==='C_ALL'?'C_ALL':'BE_ALL',method:METHODS[p.get('method')]?p.get('method'):'S_EMP',measure:MAP_MEASURES[p.get('measure')]?p.get('measure'):'TOTAL'};
}
export function stateHash(state){const p=new URLSearchParams();if(state.seat)p.set('seat',state.seat);p.set('scenario',state.scenario);p.set('method',state.method);p.set('measure',MAP_MEASURES[state.measure]?state.measure:'TOTAL');return '#'+p;}
export function csv(rows){const cell=v=>'"'+String(v??'').replaceAll('"','""')+'"';return '\uFEFF'+rows.map(r=>r.map(cell).join(',')).join('\r\n')+'\r\n';}
export function industryRows(raw,registry){return raw.map(r=>({...registry[r[0]],CURRENT:r[1],C_ALL:r[2],BE_ALL:r[3],BE_EXTRA:r[3]-r[2],grid_mwh:r[4],supercharger_mwh:r[5]}));}
export function divisionBreakdown(rows,scenario){const m=new Map();for(const r of rows){if(r[scenario]<=0)continue;const k=r.sic2;const old=m.get(k)||{code:k,name:DIVISIONS[k]||r.industry_name,section:r.section,value:0,classes:[]};old.value+=r[scenario];old.classes.push(r);m.set(k,old);}return [...m.values()].sort((a,b)=>b.value-a.value);}
export function colourBin(value){return value<5e5?0:value<1e6?1:value<2e6?2:value<5e6?3:4;}

export function allocationRange(rows,scenario){
 const values=rows.map(r=>r[`${scenario}_gbp_per_year`]);
 if(rows.length!==3||new Set(rows.map(r=>r.spatial_method)).size!==3||values.some(v=>!Number.isFinite(v)))throw Error('Complete three-method allocation data required');
 return {low:Math.min(...values),high:Math.max(...values)};
}
export function rangeMoney(range){return `${money(range.low)}–${money(range.high)}`;}
