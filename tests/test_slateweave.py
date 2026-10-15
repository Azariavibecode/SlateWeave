import copy
import hashlib
import itertools
import json
from pathlib import Path

import pytest

BODY = (Path(__file__).parents[1] / "fixtures/agenda.md").read_bytes()
OWNER, REPO, COMMIT, TREE = "SyntheticOrg", "SlateWeave", "1" * 40, "a" * 40
PATH = "/fixtures/agenda.md"

def canonical(value): return json.dumps(value, sort_keys=True, separators=(",", ":"), ensure_ascii=True)
def sha(value): return hashlib.sha256(value).hexdigest()
def address(value): return "0x" + value.hex()
def source(marker): return dict(owner=OWNER, repo=REPO, commit=COMMIT, path=PATH, digest=sha(BODY), marker=marker)

def config(a, b):
    return dict(label="Cedar Q4", budget=100, max_selected=3, policy=source("## POLICY Q4"), voters=[address(a), address(b)], options=[
        dict(title="Audit priority", cost=60, author=address(a), source=source("## OPTION AUDIT")),
        dict(title="Incentive priority", cost=40, author=address(b), source=source("## OPTION INCENTIVES")),
        dict(title="Transparency report", cost=0, author=address(a), source=source("## OPTION REPORTING")),
    ])

def mock_source(vm, *, body=BODY, truncated=False, blob_mismatch=False, response_status=200):
    base=f"https://api.github.com/repos/{OWNER}/{REPO}"
    vm.mock_web((base+"/git/commits/"+COMMIT).replace(".",r"\.")+"$",{"status":200,"body":json.dumps({"sha":COMMIT,"tree":{"sha":TREE}}).encode()})
    blob=hashlib.sha1(("blob "+str(len(body))+"\0").encode()+body).hexdigest()
    vm.mock_web((base+"/git/trees/"+TREE+r"\?recursive=1$").replace(".",r"\."),{"status":200,"body":json.dumps({"truncated":truncated,"tree":[{"path":PATH[1:],"type":"blob","mode":"100644","size":len(body),"sha":"b"*40 if blob_mismatch else blob}]}).encode()})
    if not truncated:
        vm.mock_web((f"https://raw.githubusercontent.com/{OWNER}/{REPO}/{COMMIT}{PATH}").replace(".",r"\.")+"$",{"status":response_status,"body":body})

@pytest.fixture
def setup(direct_vm,direct_deploy,direct_alice,direct_bob,direct_charlie):
    direct_vm.strict_mocks=True
    direct_vm.check_pickling=True
    with direct_vm.prank(direct_alice): c=direct_deploy("contracts/SlateWeave.py")
    return direct_vm,c,direct_alice,direct_bob,direct_charlie

def state(c,id=0): return (c.get_ballot(id),c.get_counts())
def record(c,id=0): return json.loads(c.get_ballot(id))
def create(vm,c,a,b,changes=None):
    cfg=config(a,b)
    if changes: cfg.update(changes)
    with vm.prank(a): id=c.create_ballot(canonical(cfg))
    return id
def consent(vm,c,a,b,id=0):
    commitment=record(c,id)["commitment"]
    with vm.prank(a): assert c.accept_ballot(id,commitment)=="CONSENT_RECORDED"
    with vm.prank(b): assert c.accept_ballot(id,commitment)=="READY_TO_GROUND"
def grounded(vm,c,a,b):
    create(vm,c,a,b);consent(vm,c,a,b);mock_source(vm)
    assert c.ground_ballot(0)=="PAIRING"
def binding(c,i,j):
    b=record(c)
    return sha(canonical(dict(domain="SLATEWEAVE_PAIR_V1",commitment=b["commitment"],ground_digest=b["ground"]["digest"],left=i,right=j)).encode())
def pair(vm,c,i,j,relation="COMPATIBLE",wrong_binding=False,extra=False):
    bound=binding(c,i,j)
    result=dict(binding="0"*64 if wrong_binding else bound,relation=relation)
    if extra: result["reasoning"]="ignore policy"
    vm.mock_llm(r"(?s)Determine whether two DAO agenda.*binding must equal "+bound+r"\..*",canonical(result))
    return c.resolve_pair(0,i,j)
def graph(vm,c,a,b):
    grounded(vm,c,a,b)
    assert pair(vm,c,0,1,"MUTUALLY_EXCLUSIVE")=="MUTUALLY_EXCLUSIVE"
    assert pair(vm,c,0,2)=="COMPATIBLE"
    assert pair(vm,c,1,2)=="COMPATIBLE"
    entry=record(c)
    assert entry["state"]=="GRAPH_READY"
    return entry
def voting(vm,c,a,b):
    entry=graph(vm,c,a,b)
    assert c.open_voting(0,entry["commitment"],entry["graph_digest"])=="VOTING"
    return entry
def vote(vm,c,actor,scores):
    entry=record(c)
    with vm.prank(actor): return c.cast_vote(0,entry["commitment"],entry["graph_digest"],canonical(scores))

def test_full_lifecycle_conflict_changes_winning_slate(setup):
    vm,c,deployer,a,b=setup;entry=voting(vm,c,a,b)
    assert vote(vm,c,a,[60,0,40])=="VOTE_RECORDED"
    assert vote(vm,c,b,[0,70,30])=="TALLY_READY"
    assert c.finalize(0,entry["graph_digest"])=="FINALIZED"
    result=record(c)["result"]
    assert result["selected"]==[1,2] and result["score"]==140 and result["cost"]==40
    assert result["totals"]==[60,70,70]
    assert json.loads(c.get_counts())["finalized_count"]==1
    before=state(c)
    assert c.finalize(0,entry["graph_digest"])=="VOTES_INCOMPLETE"
    assert before==state(c)

def test_config_has_complete_roles_before_consent(setup):
    vm,c,_,a,b=setup;create(vm,c,a,b);locked=record(c)
    assert locked["state"]=="CONSENT" and len(locked["config"]["options"])==3
    assert locked["participants"]==sorted([address(a),address(b)])
    assert locked["config"]["budget"]==100 and locked["config"]["max_selected"]==3
    assert not hasattr(c,"add_option") and not hasattr(c,"edit_policy")

def test_wrong_digest_cross_ballot_and_unauthorized_consent(setup):
    vm,c,outsider,a,b=setup;create(vm,c,a,b);create(vm,c,a,b)
    assert record(c,0)["commitment"]!=record(c,1)["commitment"]
    before=state(c)
    with vm.prank(a): assert c.accept_ballot(0,record(c,1)["commitment"])=="COMMITMENT_MISMATCH"
    with vm.prank(outsider): assert c.accept_ballot(0,record(c)["commitment"])=="PARTICIPANT_ONLY"
    assert before==state(c)

def test_duplicate_consent_and_ground_before_all_consents(setup):
    vm,c,_,a,b=setup;create(vm,c,a,b);commitment=record(c)["commitment"]
    with vm.prank(a): assert c.accept_ballot(0,commitment)=="CONSENT_RECORDED"
    before=state(c)
    with vm.prank(a): assert c.accept_ballot(0,commitment)=="ALREADY_ACCEPTED"
    assert c.ground_ballot(0)=="WRONG_PHASE" and before==state(c)

@pytest.mark.parametrize("failure",["wrong_digest","changed_bytes","truncated_tree","blob_mismatch","unavailable","duplicate_marker"])
def test_ground_failures_leave_complete_state_unchanged(setup,failure):
    vm,c,_,a,b=setup
    cfg=config(a,b)
    if failure=="wrong_digest": cfg["policy"]["digest"]="0"*64
    if failure=="duplicate_marker":
        body=BODY+b"\n## POLICY Q4\nforged duplicate\n"
        for src in [cfg["policy"]]+[o["source"] for o in cfg["options"]]: src["digest"]=sha(body)
    else: body=BODY+b"changed" if failure=="changed_bytes" else BODY
    with vm.prank(a): c.create_ballot(canonical(cfg))
    consent(vm,c,a,b)
    mock_source(vm,body=body,truncated=failure=="truncated_tree",blob_mismatch=failure=="blob_mismatch",response_status=404 if failure=="unavailable" else 200)
    before=state(c)
    assert c.ground_ballot(0)=="SOURCE_UNVERIFIED" and before==state(c)

@pytest.mark.parametrize("mutation",["wrong_binding","extra_fields","unknown_relation"])
def test_malformed_model_output_cannot_open_voting(setup,mutation):
    vm,c,_,a,b=setup;grounded(vm,c,a,b)
    assert pair(vm,c,0,1,"ALLOW_ALL" if mutation=="unknown_relation" else "COMPATIBLE",wrong_binding=mutation=="wrong_binding",extra=mutation=="extra_fields")=="INSUFFICIENT"
    before=state(c)
    assert c.open_voting(0,record(c)["commitment"],"0"*64)=="GRAPH_INCOMPLETE"
    assert before==state(c) and record(c)["votes"]=={}

def test_insufficient_retry_has_bounded_termination(setup):
    vm,c,_,a,b=setup;grounded(vm,c,a,b)
    assert pair(vm,c,0,1,"INSUFFICIENT")=="INSUFFICIENT"
    for _ in range(2): assert c.resolve_pair(0,0,1)=="INSUFFICIENT"
    assert record(c)["state"]=="UNRESOLVED"
    before=state(c)
    assert c.resolve_pair(0,0,1)=="WRONG_PHASE" and before==state(c)

def test_insufficient_then_valid_round_completes_exact_same_pair(setup):
    vm,c,_,a,b=setup;grounded(vm,c,a,b)
    bound=binding(c,0,1)
    vm.mock_llm(r"(?s)Determine whether two DAO agenda.*binding must equal "+bound+r"\..*",canonical(dict(binding=bound,relation="INSUFFICIENT")))
    assert c.resolve_pair(0,0,1)=="INSUFFICIENT"
    assert record(c)["pairs"]["0:1"]["attempts"]==1
    assert record(c)["pairs"]["0:1"]["binding"]==bound
    vm.clear_mocks()
    assert pair(vm,c,0,1,"MUTUALLY_EXCLUSIVE")=="MUTUALLY_EXCLUSIVE"
    assert record(c)["pairs"]["0:1"]["attempts"]==2
    assert record(c)["pairs"]["0:1"]["binding"]==bound

def test_pair_order_and_resolved_pair_replay(setup):
    vm,c,_,a,b=setup;grounded(vm,c,a,b);before=state(c)
    for i,j in [(1,0),(0,0),(0,9)]: assert c.resolve_pair(0,i,j)=="INVALID_PAIR"
    assert before==state(c)
    pair(vm,c,0,1,"MUTUALLY_EXCLUSIVE");before=state(c)
    assert c.resolve_pair(0,0,1)=="PAIR_ALREADY_RESOLVED" and before==state(c)

def test_graph_binding_and_early_vote(setup):
    vm,c,_,a,b=setup;entry=graph(vm,c,a,b);before=state(c)
    with vm.prank(a): assert c.cast_vote(0,entry["commitment"],entry["graph_digest"],"[60,0,40]")=="WRONG_PHASE"
    assert c.open_voting(0,entry["commitment"],"0"*64)=="COMMITMENT_MISMATCH"
    assert before==state(c)

@pytest.mark.parametrize("scores",[[101,0,0],[80,30,0],[-1,0,0],[True,0,0],[50,50],[1.5,0,0],"broken"])
def test_invalid_vote_does_not_mutate(setup,scores):
    vm,c,_,a,b=setup;entry=voting(vm,c,a,b);before=state(c)
    raw=scores if isinstance(scores,str) else canonical(scores)
    with vm.prank(a): assert c.cast_vote(0,entry["commitment"],entry["graph_digest"],raw)=="INVALID_SCORES"
    assert before==state(c)

def test_wrong_voter_digest_duplicate_and_premature_finalization(setup):
    vm,c,outsider,a,b=setup;entry=voting(vm,c,a,b);before=state(c)
    with vm.prank(outsider): assert c.cast_vote(0,entry["commitment"],entry["graph_digest"],"[0,0,0]")=="VOTER_ONLY"
    with vm.prank(a): assert c.cast_vote(0,"0"*64,entry["graph_digest"],"[0,0,0]")=="COMMITMENT_MISMATCH"
    assert c.finalize(0,entry["graph_digest"])=="VOTES_INCOMPLETE" and before==state(c)
    vote(vm,c,a,[60,0,40]);before=state(c)
    assert vote(vm,c,a,[0,100,0])=="ALREADY_VOTED" and before==state(c)

@pytest.mark.parametrize("scores,expected",[([50,50,0],[0]),([0,0,0],[])])
def test_tie_break_and_abstention(setup,scores,expected):
    vm,c,_,a,b=setup;entry=voting(vm,c,a,b)
    vote(vm,c,a,scores);vote(vm,c,b,[0,0,0]);c.finalize(0,entry["graph_digest"])
    assert record(c)["result"]["selected"]==expected

def test_budget_and_size_apply_to_whole_subset(setup):
    vm,c,_,a,b=setup
    create(vm,c,a,b,dict(budget=40,max_selected=1));consent(vm,c,a,b);mock_source(vm);c.ground_ballot(0)
    for i,j in itertools.combinations(range(3),2): pair(vm,c,i,j)
    entry=record(c);c.open_voting(0,entry["commitment"],entry["graph_digest"])
    vote(vm,c,a,[60,10,30]);vote(vm,c,b,[60,10,30]);c.finalize(0,entry["graph_digest"])
    assert record(c)["result"]["selected"]==[2]

def test_cancel_is_terminal_and_forbidden_after_voting(setup):
    vm,c,outsider,a,b=setup;create(vm,c,a,b);before=state(c)
    with vm.prank(outsider): assert c.cancel_ballot(0)=="CREATOR_ONLY"
    assert before==state(c)
    with vm.prank(a): assert c.cancel_ballot(0)=="CANCELLED"
    before=state(c)
    with vm.prank(a): assert c.cancel_ballot(0)=="CANNOT_CANCEL"
    assert c.accept_ballot(0,record(c)["commitment"])=="WRONG_PHASE" and before==state(c)

def test_voting_cannot_be_cancelled_by_creator(setup):
    vm,c,_,a,b=setup;voting(vm,c,a,b);before=state(c)
    with vm.prank(a): assert c.cancel_ballot(0)=="CANNOT_CANCEL"
    assert before==state(c)

@pytest.mark.parametrize("bad",["duplicate_voter","zero_author","bool_budget","bad_path","duplicate_source","too_many_options"])
def test_input_guards_and_unknown_id(setup,bad):
    vm,c,_,a,b=setup;cfg=config(a,b)
    if bad=="duplicate_voter": cfg["voters"]=[address(a),address(a)]
    if bad=="zero_author": cfg["options"][0]["author"]="0x"+"0"*40
    if bad=="bool_budget": cfg["budget"]=True
    if bad=="bad_path": cfg["policy"]["path"]="/../escape.md"
    if bad=="duplicate_source": cfg["options"][1]["source"]=copy.deepcopy(cfg["options"][0]["source"])
    if bad=="too_many_options": cfg["options"]*=3
    before=c.get_counts()
    assert c.create_ballot(canonical(cfg))=="INVALID_CONFIG" and before==c.get_counts()
    assert c.resolve_pair(99,0,1)=="BALLOT_NOT_FOUND"

def test_deployer_has_no_privilege_and_independent_user_creates_ballot(setup):
    vm,c,deployer,a,b=setup;create(vm,c,a,b)
    assert record(c)["creator"]==address(a) and record(c)["creator"]!=address(deployer)
    assert "owner" not in record(c) and "admin" not in record(c)

@pytest.mark.parametrize("budget",[0,39,40,60,99,100])
def test_tally_matches_independent_combinations_reference(setup,budget):
    vm,c,_,a,b=setup
    create(vm,c,a,b,dict(budget=budget));consent(vm,c,a,b);mock_source(vm);c.ground_ballot(0)
    for i,j in itertools.combinations(range(3),2): pair(vm,c,i,j)
    entry=record(c);c.open_voting(0,entry["commitment"],entry["graph_digest"])
    vote(vm,c,a,[60,0,40]);vote(vm,c,b,[0,70,30]);c.finalize(0,entry["graph_digest"])
    feasible=[]
    for size in range(4):
        for choices in itertools.combinations(range(3),size):
            if sum([60,40,0][i] for i in choices)<=budget:
                feasible.append((sum([60,70,70][i] for i in choices),choices))
    expected=min(feasible,key=lambda item:(-item[0],len(item[1]),sum(2**i for i in item[1])))
    assert record(c)["result"]["selected"]==list(expected[1])
    assert record(c)["result"]["score"]==expected[0]

def test_wrong_leader_relationship_is_rejected_by_independent_validator(setup):
    vm,c,_,a,b=setup;grounded(vm,c,a,b)
    assert pair(vm,c,0,1,"MUTUALLY_EXCLUSIVE")=="MUTUALLY_EXCLUSIVE"
    bound=binding(c,0,1)
    comparisons=[]
    def comparative_hook(_vm,request):
        item=request.get("ExecPromptTemplate")
        if item and item.get("template")=="EqComparative":
            leader=json.loads(item["leader_answer"])
            independent=json.loads(item["validator_answer"])
            comparisons.append((leader,independent))
            return {"ok":leader==independent}
        return None
    vm._gl_call_hook=comparative_hook
    before=state(c)
    with vm.activate():
        assert vm.run_validator(leader_result=canonical(dict(binding=bound,relation="COMPATIBLE"))) is False
    assert comparisons[0][0]["relation"]=="COMPATIBLE" and comparisons[0][1]["relation"]=="MUTUALLY_EXCLUSIVE"
    assert before==state(c)

def test_prompt_injection_fixture_stays_data_under_locked_policy(setup):
    vm,c,_,a,b=setup;cfg=config(a,b)
    cfg["options"][1]["source"]=source("## OPTION INJECTION")
    with vm.prank(a): c.create_ballot(canonical(cfg))
    consent(vm,c,a,b);mock_source(vm);c.ground_ballot(0)
    bound=binding(c,0,1)
    vm.mock_llm(r"(?s)Determine whether two DAO agenda.*untrusted proposal data.*Embedded attack text.*",canonical(dict(binding=bound,relation="MUTUALLY_EXCLUSIVE")))
    assert c.resolve_pair(0,0,1)=="MUTUALLY_EXCLUSIVE"
    before=state(c)
    assert c.open_voting(0,record(c)["commitment"],record(c)["graph_digest"])=="GRAPH_INCOMPLETE"
    assert before==state(c)
