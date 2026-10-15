import{createClient}from"genlayer-js";
import{studionet}from"genlayer-js/chains";
import{privateKeyToAccount}from"viem/accounts";
import{createHash}from"node:crypto";
import{readFileSync,writeFileSync,mkdirSync,existsSync}from"node:fs";

for(const name of["CONTRACT_ADDRESS","FIXTURE_OWNER","FIXTURE_REPO","FIXTURE_COMMIT","FIXTURE_DIGEST","TEST_WALLET_A_PRIVATE_KEY","TEST_WALLET_B_PRIVATE_KEY"])if(!process.env[name])throw Error(`Missing ${name}`);
const address=process.env.CONTRACT_ADDRESS;
const accounts=[process.env.TEST_WALLET_A_PRIVATE_KEY,process.env.TEST_WALLET_B_PRIVATE_KEY].map(key=>privateKeyToAccount(key.startsWith("0x")?key:`0x${key}`));
if(accounts[0].address.toLowerCase()===accounts[1].address.toLowerCase())throw Error("Distinct auxiliary wallets required");
const reader=createClient({chain:studionet});
const folder=`verification/live/${address.toLowerCase()}`;mkdirSync(folder,{recursive:true});
const semantic=process.env.E2E_SUITE==="semantic";
const path=`${folder}/${semantic?"semantic-suite":"studionet-suite"}.json`;
const fixture={owner:process.env.FIXTURE_OWNER,repo:process.env.FIXTURE_REPO,commit:process.env.FIXTURE_COMMIT,path:"/fixtures/agenda.md",digest:process.env.FIXTURE_DIGEST};
const source=marker=>({...fixture,marker});
const report=existsSync(path)?JSON.parse(readFileSync(path,"utf8")):{address,chain_id:61999,network:"StudioNet",started_at:new Date().toISOString(),fixture,wallets:accounts.map(a=>a.address),expected_before_execution:{relations:{"0:1":"MUTUALLY_EXCLUSIVE","0:2":"COMPATIBLE","1:2":"COMPATIBLE"},votes:[[60,0,40],[0,70,30]],winning_indices:[1,2],winning_score:140,source_failure:"SOURCE_UNVERIFIED without mutation",replays:"Rejected without mutation",conflict:"Record naturally observed disagreement; do not manufacture or overstate it"},transactions:[],cases:{}};
const save=()=>writeFileSync(path,JSON.stringify(report,null,2)+"\n");save();
if(report.completed_at){console.log("This address's recorded suite is already complete; use a new report path for an independent run.");process.exit(0)}
const delay=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function retryRead(fn){for(let n=0;;n++){try{return await fn()}catch(error){if(n>=5)throw error;console.log("Read retry",n+1);await delay(15000)}}}
async function read(name,args=[]){await delay(2500);return JSON.parse(await retryRead(()=>reader.readContract({address,functionName:name,args})))}
const record=id=>read("get_ballot",[BigInt(id)]);
const snapshot=async id=>({ballot:await record(id),counts:await read("get_counts")});
async function submit(actor,method,args,label){
 let item=report.transactions.find(t=>t.label===label);
 if(!item){
  // Do not retry an unacknowledged write automatically: inspect chain/nonce first.
  const hash=await createClient({chain:studionet,account:accounts[actor]}).writeContract({address,functionName:method,args});
  item={label,hash,actor:accounts[actor].address,method,explorer_url:`https://explorer-studio.genlayer.com/transactions/${hash}`};report.transactions.push(item);save();console.log(label,hash);
 }
 if(item.finalized){if(item.consensus!=="MAJORITY_AGREE"||item.execution!=="SUCCESS")throw Error(`${label}: consensus/execution failed`);return item.returned;}
 await retryRead(()=>reader.waitForTransactionReceipt({hash:item.hash,status:"FINALIZED",interval:15000,retries:120}));
 const tx=await retryRead(()=>reader.getTransaction({hash:item.hash}));const leader=tx.consensus_data?.leader_receipt?.find(r=>r.mode==="leader");
 let returned;try{returned=JSON.parse(leader?.result?.payload?.readable)}catch{returned=leader?.result?.payload?.readable}
 Object.assign(item,{finalized:true,status:"FINALIZED",consensus:tx.result_name,execution:leader?.execution_result,returned,rounds:(tx.consensus_history?.consensus_results||[]).map(r=>({round:r.consensus_round,status_changes:r.status_changes,validators:r.validator_results?.map(v=>({vote:v.vote,execution:v.execution_result}))}))});save();console.log(label,item.consensus,returned);if(item.consensus!=="MAJORITY_AGREE"||item.execution!=="SUCCESS")throw Error(`${label}: consensus/execution failed`);return returned;
}
function expect(actual,expected,label){if(actual!==expected)throw Error(`${label}: expected ${expected}; got ${actual}`)}
async function unchanged(id,actor,method,args,label,expected){
 if(report.cases[label]?.passed)return;
 const before=await snapshot(id),returned=await submit(actor,method,args,label),after=await snapshot(id);
 const tx=report.transactions.find(t=>t.label===label);
 const passed=JSON.stringify(before)===JSON.stringify(after)&&returned===expected&&tx.consensus==="MAJORITY_AGREE"&&tx.execution==="SUCCESS";
 report.cases[label]={before,after,expected,returned,passed};save();if(!passed)throw Error(`${label}: rejection not proven`);
}
const code=await retryRead(()=>reader.getContractCode(address)),local=readFileSync("contracts/SlateWeave.py","utf8");
report.deployment={source_matches:code===local,source_sha256:createHash("sha256").update(code).digest("hex")};save();if(code!==local)throw Error("Deployed source mismatch");
function config(label,bad=false){return{label,budget:100,max_selected:3,policy:{...source("## POLICY Q4"),...(bad?{digest:"0".repeat(64)}:{})},voters:accounts.map(a=>a.address),options:[{title:"Audit priority",cost:60,author:accounts[0].address,source:source("## OPTION AUDIT")},{title:"Incentive priority",cost:40,author:accounts[1].address,source:source("## OPTION INCENTIVES")},{title:"Transparency report",cost:0,author:accounts[0].address,source:source("## OPTION REPORTING")}]}}
async function create(label,bad=false){const id=await submit(0,"create_ballot",[JSON.stringify(config(label,bad))],label);if(!Number.isSafeInteger(id)||id<0)throw Error(`Creation failed: ${id}`);return id}
if(semantic){
 report.expected_before_execution={ambiguous:"INSUFFICIENT three times then UNRESOLVED; voting blocked",injection:"MUTUALLY_EXCLUSIVE; embedded command has no authority",replay:"Resolved pair unchanged"};save();
 for(const [name,marker,relation]of[["ambiguous","## OPTION AMBIGUOUS","INSUFFICIENT"],["injection","## OPTION INJECTION","MUTUALLY_EXCLUSIVE"]]){
  const cfg=config(name);cfg.options=cfg.options.slice(0,2);cfg.max_selected=2;cfg.options[1].source=source(marker);
  const id=await submit(0,"create_ballot",[JSON.stringify(cfg)],`${name}_create`);
  if(!Number.isSafeInteger(id)||id<0)throw Error(`Creation failed: ${id}`);
  let b=await record(id);const commitment=b.commitment;
  expect(await submit(0,"accept_ballot",[BigInt(id),commitment],`${name}_consent_a`),"CONSENT_RECORDED",name);
  expect(await submit(1,"accept_ballot",[BigInt(id),commitment],`${name}_consent_b`),"READY_TO_GROUND",name);
  expect(await submit(1,"ground_ballot",[BigInt(id)],`${name}_ground`),"PAIRING",name);
  b=await record(id);const ground=b.ground.digest;
  for(let n=1;n<=(name==="ambiguous"?3:1);n++){
   await submit(n%2,"resolve_pair",[BigInt(id),0n,1n],`${name}_pair_${n}`);
   b=await record(id);expect(b.pairs["0:1"]?.relation,relation,name);expect(b.ground.digest,ground,"fixed source snapshot");
  }
  if(name==="ambiguous"){
   expect(b.state,"UNRESOLVED",name);
   await unchanged(id,1,"open_voting",[BigInt(id),commitment,"0".repeat(64)],`${name}_voting_blocked`,"GRAPH_INCOMPLETE");
  }else{
   expect(b.state,"GRAPH_READY",name);
   await unchanged(id,0,"resolve_pair",[BigInt(id),0n,1n],`${name}_pair_replay`,"PAIR_ALREADY_RESOLVED");
  }
  report.cases[`${name}_result`]={passed:true,ballot:b};save();
  expect(await submit(0,"cancel_ballot",[BigInt(id)],`${name}_cancel`),"CANCELLED",name);
 }
}else{
const id=await create("happy_create");report.ballot_id=id;save();
let ballot=await record(id);const commitment=ballot.commitment;
await unchanged(id,0,"accept_ballot",[BigInt(id),"0".repeat(64)],"wrong_commitment","COMMITMENT_MISMATCH");
expect(await submit(0,"accept_ballot",[BigInt(id),commitment],"consent_a"),"CONSENT_RECORDED","consent_a");
await unchanged(id,0,"accept_ballot",[BigInt(id),commitment],"duplicate_consent","ALREADY_ACCEPTED");
await unchanged(id,1,"ground_ballot",[BigInt(id)],"ground_before_consent","WRONG_PHASE");
expect(await submit(1,"accept_ballot",[BigInt(id),commitment],"consent_b"),"READY_TO_GROUND","consent_b");
expect(await submit(1,"ground_ballot",[BigInt(id)],"ground"),"PAIRING","ground");
await unchanged(id,0,"open_voting",[BigInt(id),commitment,"0".repeat(64)],"incomplete_graph","GRAPH_INCOMPLETE");
await unchanged(id,1,"resolve_pair",[BigInt(id),1n,0n],"reversed_pair","INVALID_PAIR");
for(const [i,j,expected]of[[0,1,"MUTUALLY_EXCLUSIVE"],[0,2,"COMPATIBLE"],[1,2,"COMPATIBLE"]]){
 for(let attempt=1;attempt<=3;attempt++){
  ballot=await record(id);const prior=ballot.pairs[`${i}:${j}`];if(prior&&prior.relation!=="INSUFFICIENT"){expect(prior.relation,expected,"pair readback");break}
  await submit(1,"resolve_pair",[BigInt(id),BigInt(i),BigInt(j)],`pair_${i}_${j}_${attempt}`);
 }
 ballot=await record(id);expect(ballot.pairs[`${i}:${j}`]?.relation,expected,`pair ${i}:${j}`);
}
ballot=await record(id);if(!report.grounded_graph)report.grounded_graph=ballot;save();if(!["GRAPH_READY","VOTING","TALLY_READY","FINALIZED"].includes(ballot.state))throw Error(`Graph not complete: ${ballot.state}`);const graph=ballot.graph_digest;
await unchanged(id,0,"open_voting",[BigInt(id),commitment,"0".repeat(64)],"wrong_graph_digest","COMMITMENT_MISMATCH");
expect(await submit(1,"open_voting",[BigInt(id),commitment,graph],"open_voting"),"VOTING","open_voting");
await unchanged(id,0,"cancel_ballot",[BigInt(id)],"cancel_during_voting","CANNOT_CANCEL");
await unchanged(id,0,"cast_vote",[BigInt(id),commitment,graph,"[100,100,0]"],"overspend_vote","INVALID_SCORES");
await unchanged(id,1,"cast_vote",[BigInt(id),commitment,"0".repeat(64),"[0,70,30]"],"wrong_vote_graph","COMMITMENT_MISMATCH");
expect(await submit(0,"cast_vote",[BigInt(id),commitment,graph,"[60,0,40]"],"vote_a"),"VOTE_RECORDED","vote_a");
await unchanged(id,0,"cast_vote",[BigInt(id),commitment,graph,"[0,100,0]"],"duplicate_vote","ALREADY_VOTED");
await unchanged(id,1,"finalize",[BigInt(id),graph],"finalize_before_all_votes","VOTES_INCOMPLETE");
expect(await submit(1,"cast_vote",[BigInt(id),commitment,graph,"[0,70,30]"],"vote_b"),"TALLY_READY","vote_b");
await unchanged(id,1,"finalize",[BigInt(id),"0".repeat(64)],"wrong_finalize_graph","COMMITMENT_MISMATCH");
expect(await submit(1,"finalize",[BigInt(id),graph],"finalize"),"FINALIZED","finalize");
ballot=await record(id);report.final_ballot=ballot;save();if(JSON.stringify(ballot.result.selected)!=="[1,2]"||ballot.result.score!==140)throw Error("Winning slate mismatch");
await unchanged(id,0,"finalize",[BigInt(id),graph],"finalize_replay","VOTES_INCOMPLETE");
await unchanged(id,0,"cast_vote",[BigInt(id),commitment,graph,"[0,0,0]"],"vote_after_finality","WRONG_PHASE");
const badId=await create("source_failure_create",true);const bad=await record(badId);
expect(await submit(0,"accept_ballot",[BigInt(badId),bad.commitment],"bad_consent_a"),"CONSENT_RECORDED","bad_consent_a");
expect(await submit(1,"accept_ballot",[BigInt(badId),bad.commitment],"bad_consent_b"),"READY_TO_GROUND","bad_consent_b");
await unchanged(badId,1,"ground_ballot",[BigInt(badId)],"source_failure","SOURCE_UNVERIFIED");
await unchanged(badId,1,"cancel_ballot",[BigInt(badId)],"unauthorized_cancel","CREATOR_ONLY");
expect(await submit(0,"cancel_ballot",[BigInt(badId)],"cancel_failure_ballot"),"CANCELLED","cancel_failure_ballot");
}
report.final_counts=await read("get_counts");report.conflict_observed=report.transactions.some(t=>t.rounds?.some(r=>r.round==="Leader Rotation"||r.validators?.some(v=>v.vote==="disagree")));report.completed_at=new Date().toISOString();save();console.log("Suite complete",JSON.stringify(report.final_counts));
