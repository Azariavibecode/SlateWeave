import{createHash}from"node:crypto";
import{readFileSync,writeFileSync,mkdirSync}from"node:fs";
const bytes=readFileSync("fixtures/agenda.md");
const report={verified_at:new Date().toISOString(),file:"fixtures/agenda.md",sha256:createHash("sha256").update(bytes).digest("hex"),git_blob_sha1:createHash("sha1").update(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`),bytes])).digest("hex"),bytes:bytes.length,synthetic:true,published_commit:null,authority_scope:"Exact proposed text only; no claim of real DAO approval or execution"};
mkdirSync("verification",{recursive:true});writeFileSync("verification/fixture-local.json",JSON.stringify(report,null,2)+"\n");console.log(JSON.stringify(report,null,2));
