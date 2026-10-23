import test from "node:test";
import assert from "node:assert/strict";
import {jsonFormat,csvToJson,jsonToCsv,base64Encode,base64Decode,urlCodec,uuids,sqlFormat,markdownHtml} from "../assets/code-data-core.mjs";
import {yamlParse,yamlWrite,schemaCheck} from "../assets/code-data-advanced.mjs";
test("JSON pretty/minify",()=>{assert.equal(jsonFormat('{"a":1}',true),'{"a":1}');assert.deepEqual(JSON.parse(jsonFormat('{"a":1}')),{a:1});assert.throws(()=>jsonFormat("{broken"));});
test("CSV quoting, newlines and injection mitigation",()=>{
 const rows=csvToJson('name,note\r\nKOLFAT,"hello,world"\r\nJane,"two\nlines"\r\n');
 assert.equal(rows[1].note,"two\nlines");
 assert.ok(jsonToCsv('[{"cell":"=1+1"}]').includes("'=1+1"));
 assert.equal(csvToJson("name\nAlice")[0].name,"Alice");
});
test("Base64 Unicode round-trip and invalid input",()=>{assert.equal(base64Decode(base64Encode("KOLFAT 🧡")),"KOLFAT 🧡");assert.throws(()=>base64Decode("%%%"));});
test("URI component round-trip",()=>{assert.equal(urlCodec(urlCodec("a/b? x","encode"),"decode"),"a/b? x");});
test("SQL preserves literals and Markdown escapes HTML",()=>{assert.ok(sqlFormat("select 'from' from things").includes("'from'"));assert.ok(markdownHtml("# Hello <img src=x onerror=alert(1)>").includes("&lt;img"));assert.ok(!markdownHtml("[bad](javascript:alert(1))").includes('href="javascript'));});
test("YAML subset converts mappings and sequences",()=>{
 const parsed=yamlParse("name: KOLFAT\nitems:\n  - one\n  - two\nactive: true");
 assert.deepEqual(JSON.parse(JSON.stringify(parsed)),{name:"KOLFAT",items:["one","two"],active:true});
 assert.equal(yamlParse(yamlWrite({id:5,active:true})).id,5);
 assert.throws(()=>yamlParse("name: a\nname: b"));
});
test("JSON Schema supported subset",()=>{
 const schema={type:"object",required:["name"],properties:{name:{type:"string",minLength:2}},additionalProperties:false};
 assert.deepEqual(schemaCheck({name:"KOLFAT"},schema),[]);
 assert.ok(schemaCheck({name:"x"},schema).length>0);
 assert.throws(()=>schemaCheck({x:1},{$ref:"http://example.com"}));
});
test("UUID v4 format",()=>{if(!globalThis.crypto?.getRandomValues)return;assert.match(uuids(1),/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);});
