import test from "node:test";
import assert from "node:assert/strict";
import{transactionReturn,validateReturn,nextAction,assertReadback}from"./protocol.mjs";
const actor="0x"+"1".repeat(40);
const base={ballot_id:7,state:"CONSENT",participants:[actor],consents:[],config:{voters:[actor]},votes:{}};
function tx(value,overrides={}){return{result_name:"MAJORITY_AGREE",consensus_data:{leader_receipt:[{mode:"leader",execution_result:"SUCCESS",result:{status:"return",payload:{readable:JSON.stringify(value)}}}]},...overrides}}
test("consensus failure cannot become UI success",()=>assert.throws(()=>transactionReturn(tx("FINALIZED",{result_name:"MAJORITY_DISAGREE"}))));
test("leader execution error fails closed",()=>assert.throws(()=>transactionReturn({result_name:"MAJORITY_AGREE",consensus_data:{leader_receipt:[{mode:"leader",execution_result:"ERROR"}]}})));
test("contract rejection and predicted IDs cannot be treated as success",()=>{assert.throws(()=>validateReturn("cast_vote","ALREADY_VOTED"));assert.throws(()=>validateReturn("create_ballot","INVALID_CONFIG"));assert.throws(()=>assertReadback("create_ballot",8,base,actor,[]))});
test("readback mismatch cannot be overwritten with success",()=>assert.throws(()=>assertReadback("finalize","FINALIZED",base,actor,[])));
test("exact returned ballot ID accepted",()=>assert.doesNotThrow(()=>assertReadback("create_ballot",7,base,actor,[])));
test("consent action bound to participant",()=>{assert.equal(nextAction(base,actor),"accept_ballot");assert.equal(nextAction(base,"0x"+"2".repeat(40)),"waiting_consent")});
test("already voted or terminal ballot cannot vote again",()=>{assert.equal(nextAction({...base,state:"VOTING",votes:{[actor]:[0,0]}},actor),"waiting_votes");assert.equal(nextAction({...base,state:"FINALIZED"},actor),"terminal")});
test("wrong pair readback rejected",()=>assert.throws(()=>assertReadback("resolve_pair","COMPATIBLE",{...base,pairs:{"0:1":{relation:"MUTUALLY_EXCLUSIVE"}}},actor,[7n,0n,1n])));
