import {createClient} from 'genlayer-js';
import {studionet} from 'genlayer-js/chains';
import {readFileSync,writeFileSync} from 'node:fs';
const folder='verification/live/0xf04875d5ff900c87afa08c84cb2d14c4dacb73ff';
const reports=['studionet-suite','semantic-suite'].map(name=>({name,data:JSON.parse(readFileSync(`${folder}/${name}.json`,'utf8'))}));
if(reports.some(r=>!r.data.completed_at))throw Error('Both suites must be complete before the independent finality audit');
const client=createClient({chain:studionet}),checks=[];
const tasks=reports.flatMap(({name,data:r})=>r.transactions.map(t=>({name,r,t})));
const hashSet=new Set(tasks.map(({t})=>t.hash));if(hashSet.size!==tasks.length)throw Error('Duplicate transaction hash');
async function fetchTx(hash){for(let n=0;;n++){try{return await client.getTransaction({hash})}catch(e){if(n===3)throw e;await new Promise(resolve=>setTimeout(resolve,5000))}}}
let next=0;
async function worker(){while(next<tasks.length){const {name,r,t}=tasks[next++];const tx=await fetchTx(t.hash);const leader=tx.consensus_data?.leader_receipt?.find(v=>v.mode==='leader');let returned;try{returned=JSON.parse(leader?.result?.payload?.readable)}catch{returned=leader?.result?.payload?.readable}
 const verified=(tx.status===7||tx.statusName==='FINALIZED')&&tx.result_name==='MAJORITY_AGREE'&&leader?.execution_result==='SUCCESS'&&leader?.result?.status==='return'&&String(tx.from_address).toLowerCase()===t.actor.toLowerCase()&&String(tx.to_address).toLowerCase()===r.address.toLowerCase()&&JSON.stringify(returned)===JSON.stringify(t.returned);
 checks.push({suite:name,label:t.label,hash:t.hash,checked_at:new Date().toISOString(),status:tx.status,status_name:tx.statusName,consensus:tx.result_name,execution:leader?.execution_result,return_status:leader?.result?.status,returned,sender:tx.from_address,recipient:tx.to_address,nonce:tx.nonce,rotation_count:tx.rotation_count,verified});
 writeFileSync(`${folder}/finality-audit.json`,JSON.stringify({complete:false,checks},null,2)+'\n');if(!verified)throw Error(`Finality/result/identity mismatch: ${t.label}`);
}}
await Promise.all(Array.from({length:3},worker));
const report={complete:true,checked_at:new Date().toISOString(),network:'StudioNet',chain_id:61999,transactions_checked:checks.length,all_verified:checks.every(c=>c.verified),checks};
writeFileSync(`${folder}/finality-audit.json`,JSON.stringify(report,null,2)+'\n');console.log('Independent finality audit verified',checks.length,'transactions');
