/* Isolated RegExp evaluation. Main thread terminates this worker on timeout. */
self.onmessage=e=>{
 const {pattern,flags,text}=e.data||{};
 try{
  if(pattern.length>500||text.length>100000)throw Error("Pattern or text exceeds safety limits");
  if(!/^[dgimsuvy]*$/.test(flags)||new Set(flags).size!==flags.length)throw Error("Invalid or duplicate regex flags");
  const rx=new RegExp(pattern,flags.includes("g")?flags:flags+"g");
  let matches=[],match;
  while((match=rx.exec(text))!==null&&matches.length<100){
   matches.push({index:match.index,match:match[0],groups:match.slice(1)});
   if(match[0].length===0)rx.lastIndex++;
  }
  self.postMessage({matches,limited:matches.length===100});
 }catch(err){self.postMessage({error:err.message||"Invalid regex"});}
};
