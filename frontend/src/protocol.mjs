export const NETWORK_ID="0xf22f";
export const EXPLORER="https://explorer-studio.genlayer.com";
export const isAddress=value=>/^0x[0-9a-fA-F]{40}$/.test(value||"");
export const isBallotId=value=>typeof value==="string"&&/^(0|[1-9][0-9]*)$/.test(value)&&Number.isSafeInteger(Number(value));
export const parse=value=>typeof value==="string"?JSON.parse(value):value;
export const short=value=>value?`${value.slice(0,7)}…${value.slice(-5)}`:"—";
export function normalizeHash(value){if(typeof value==="string")return value;if(typeof value?.txId==="string")return value.txId;throw Error("Invalid transaction hash")}
export function transactionReturn(transaction){
 if(transaction?.result_name!=="MAJORITY_AGREE")throw Error(`Consensus did not agree: ${transaction?.result_name||"unknown"}`);
 const leader=transaction.consensus_data?.leader_receipt?.find(item=>item.mode==="leader");
 if(leader?.execution_result!=="SUCCESS"||leader?.result?.status!=="return")throw Error("Leader execution failed");
 return parse(leader.result.payload.readable);
}
export function validateReturn(method,value){
 if(method==="create_ballot"){if(!Number.isSafeInteger(value)||value<0)throw Error(`Creation rejected: ${value}`);return value}
 const allowed={accept_ballot:["CONSENT_RECORDED","READY_TO_GROUND"],ground_ballot:["PAIRING"],resolve_pair:["COMPATIBLE","MUTUALLY_EXCLUSIVE","INSUFFICIENT"],open_voting:["VOTING"],cast_vote:["VOTE_RECORDED","TALLY_READY"],finalize:["FINALIZED"],cancel_ballot:["CANCELLED"]};
 if(!allowed[method]?.includes(value))throw Error(`Contract returned ${value}`);
 return value;
}
export function nextAction(ballot,account){
 if(!ballot)return"none";
 const actor=account?.toLowerCase();
 if(ballot.state==="CONSENT")return ballot.participants.includes(actor)&&!ballot.consents.includes(actor)?"accept_ballot":"waiting_consent";
 if(ballot.state==="READY_TO_GROUND")return"ground_ballot";
 if(ballot.state==="PAIRING")return"resolve_pair";
 if(ballot.state==="GRAPH_READY")return"open_voting";
 if(ballot.state==="VOTING")return ballot.config.voters.includes(actor)&&!Object.hasOwn(ballot.votes,actor)?"cast_vote":"waiting_votes";
 if(ballot.state==="TALLY_READY")return"finalize";
 return"terminal";
}
export function assertReadback(method,value,ballot,actor,args){
 if(!ballot||ballot.error)throw Error("Exact ballot readback unavailable");
 if(method==="create_ballot"&&ballot.ballot_id!==value)throw Error("Returned ballot ID mismatch");
 if(method==="accept_ballot"&&!ballot.consents.includes(actor.toLowerCase()))throw Error("Consent readback mismatch");
 if(method==="ground_ballot"&&(!ballot.ground||ballot.state!=="PAIRING"))throw Error("Grounding readback mismatch");
 if(method==="resolve_pair"&&ballot.pairs[`${args[1]}:${args[2]}`]?.relation!==value)throw Error("Pair readback mismatch");
 if(method==="open_voting"&&ballot.state!=="VOTING")throw Error("Voting readback mismatch");
 if(method==="cast_vote"&&!Object.hasOwn(ballot.votes,actor.toLowerCase()))throw Error("Vote readback mismatch");
 if(method==="finalize"&&(ballot.state!=="FINALIZED"||!ballot.result))throw Error("Finalization readback mismatch");
 if(method==="cancel_ballot"&&ballot.state!=="CANCELLED")throw Error("Cancellation readback mismatch");
}
