import {readFileSync,writeFileSync} from 'node:fs';
const folder='verification/live/0xf04875d5ff900c87afa08c84cb2d14c4dacb73ff';
const r=JSON.parse(readFileSync(`${folder}/studionet-suite.json`,'utf8'));
const b=r.final_ballot;
if(!b||b.state!=='FINALIZED')throw Error('No authoritative finalized ballot readback recorded yet');
const {options,voters,budget,max_selected}=b.config;
if(voters.length!==Object.keys(b.votes).length||!voters.every(v=>Object.hasOwn(b.votes,v)))throw Error('Missing or extra voter');
const totals=options.map((_,i)=>Object.values(b.votes).reduce((sum,v)=>sum+v[i],0));
for(const vector of Object.values(b.votes))if(vector.length!==options.length||vector.some(v=>!Number.isInteger(v)||v<0||v>100)||vector.reduce((s,v)=>s+v,0)>100)throw Error('Invalid recorded vote vector');
if(Object.keys(b.pairs).length!==options.length*(options.length-1)/2||Object.values(b.pairs).some(p=>!['COMPATIBLE','MUTUALLY_EXCLUSIVE'].includes(p.relation)))throw Error('Incomplete graph');
const combinations=[];
function visit(index,chosen){if(index===options.length){combinations.push([...chosen]);return}visit(index+1,chosen);chosen.push(index);visit(index+1,chosen);chosen.pop()}
visit(0,[]);
const evaluated=combinations.map(selected=>{
 const cost=selected.reduce((s,i)=>s+options[i].cost,0),score=selected.reduce((s,i)=>s+totals[i],0),mask=selected.reduce((s,i)=>s+2**i,0);
 const mutex=Object.entries(b.pairs).some(([key,p])=>p.relation==='MUTUALLY_EXCLUSIVE'&&key.split(':').map(Number).every(i=>selected.includes(i)));
 return{selected,cost,score,mask,feasible:!mutex&&cost<=budget&&selected.length<=max_selected};
});
const ranked=evaluated.filter(v=>v.feasible).sort((a,z)=>z.score-a.score||a.selected.length-z.selected.length||a.mask-z.mask);
const expected=ranked[0];
for(const field of ['selected','cost','score','mask'])if(JSON.stringify(expected[field])!==JSON.stringify(b.result[field]))throw Error(`Tally mismatch: ${field}`);
if(JSON.stringify(totals)!==JSON.stringify(b.result.totals))throw Error('Totals mismatch');
if(b.graph_digest!==b.result.graph_digest)throw Error('Result graph binding mismatch');
if(JSON.stringify(b.consents)!==JSON.stringify(b.participants))throw Error('Incomplete consent');
const report={verified_at:new Date().toISOString(),contract:r.address,ballot_id:b.ballot_id,method:'Independent recursive combinations enumeration, ranked by score then count then mask; no contract code imported',actual_votes:b.votes,totals,evaluated_subsets:evaluated,expected,actual_result:b.result,passed:true,scope:'Checks the recorded authoritative final ballot; raw live RPC/finality evidence is in studionet-suite.json'};
writeFileSync(`${folder}/independent-tally.json`,JSON.stringify(report,null,2)+'\n');
console.log('Independent tally verified',JSON.stringify(expected));
