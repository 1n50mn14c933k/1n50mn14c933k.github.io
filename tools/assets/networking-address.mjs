/* KOLFAT Networking & Automation: deterministic IPv4/IPv6 calculations; no network calls. */
const V4MAX=(1n<<32n)-1n, V6MAX=(1n<<128n)-1n;
export function parseIPv4(text){
 const a=String(text).trim().split(".");
 if(a.length!==4||a.some(x=>!/^(?:0|[1-9]\d{0,2})$/.test(x)||Number(x)>255))throw Error("Enter a valid IPv4 address (four decimal octets).");
 return a.reduce((n,x)=>(n<<8n)|BigInt(Number(x)),0n);
}
export function ipv4Text(n){
 const x=BigInt(n);if(x<0n||x>V4MAX)throw Error("IPv4 address out of range.");
 return [24n,16n,8n,0n].map(k=>String(Number((x>>k)&255n))).join(".");
}
export function ipv4Cidr(input){
 const m=String(input).trim().match(/^([^/]+)\/(\d{1,2})$/);
 if(!m)throw Error("Enter an IPv4 CIDR such as 192.168.10.34/24.");
 const address=parseIPv4(m[1]),prefix=Number(m[2]);
 if(prefix>32)throw Error("IPv4 prefix must be between 0 and 32.");
 const mask=prefix===0?0n:(V4MAX<<(32n-BigInt(prefix)))&V4MAX;
 const network=address&mask,broadcast=network|(~mask&V4MAX),total=1n<<BigInt(32-prefix);
 const usable=prefix<=30?total-2n:total;
 const first=prefix<=30?network+1n:network,last=prefix<=30?broadcast-1n:broadcast;
 return {address:ipv4Text(address),prefix,network:ipv4Text(network),broadcast:ipv4Text(broadcast),
  netmask:ipv4Text(mask),wildcard:ipv4Text(V4MAX^mask),first:ipv4Text(first),last:ipv4Text(last),
  addresses:total.toString(),usable:usable.toString(),start:network,end:broadcast,firstNumber:first,lastNumber:last,
  cidr:ipv4Text(network)+"/"+prefix};
}
export function ipv4Report(input){
 const v=ipv4Cidr(input);
 return ["IPv4 subnet: "+v.cidr,"Input address: "+v.address,"Subnet mask: "+v.netmask,
 "Wildcard mask: "+v.wildcard,"Network: "+v.network,"Broadcast: "+(v.prefix===31?"N/A for /31 point-to-point":v.prefix===32?"N/A for /32 host":v.broadcast),
 "First usable: "+v.first,"Last usable: "+v.last,"Total addresses: "+v.addresses,"Usable addresses: "+v.usable,
 v.prefix===31?"Note: /31 assigns both addresses on point-to-point links (RFC 3021).":v.prefix===32?"Note: /32 is a single host route.":""].filter(Boolean).join("\n")+"\n";
}
export function parseIPv6(input){
 let s=String(input).trim().toLowerCase();
 if(!s||s.includes("%")||s.includes(".")||!/^[0-9a-f:]+$/.test(s))throw Error("Enter an IPv6 address without a zone ID or embedded IPv4 notation.");
 if((s.match(/::/g)||[]).length>1)throw Error("Invalid IPv6 compression.");
 let chunks;
 if(s.includes("::")){
  const [l,r]=s.split("::"),left=l?l.split(":"):[],right=r?r.split(":"):[];
  if(left.length+right.length>=8)throw Error("Invalid IPv6 compressed groups.");
  chunks=[...left,...Array(8-left.length-right.length).fill("0"),...right];
 }else{chunks=s.split(":");if(chunks.length!==8)throw Error("IPv6 requires eight groups without :: compression.");}
 if(chunks.length!==8||chunks.some(x=>!x||x.length>4||!/^[0-9a-f]{1,4}$/.test(x)))throw Error("Invalid IPv6 groups.");
 return chunks.reduce((acc,x)=>(acc<<16n)|BigInt(parseInt(x,16)),0n);
}
export function ipv6Text(value){
 let n=BigInt(value);if(n<0n||n>V6MAX)throw Error("IPv6 address out of range.");
 const parts=Array.from({length:8},(_,i)=>Number((n>>(BigInt((7-i)*16)))&65535n).toString(16));
 let bestStart=-1,bestLen=0;
 for(let i=0;i<8;){if(parts[i]!=="0"){i++;continue;}let j=i;while(j<8&&parts[j]==="0")j++;
 if(j-i>bestLen&&j-i>=2){bestStart=i;bestLen=j-i;}i=j;}
 if(bestStart<0)return parts.join(":");
 const head=parts.slice(0,bestStart).join(":"),tail=parts.slice(bestStart+bestLen).join(":");
 return head+"::"+tail;
}
export function ipv6Cidr(input){
 const m=String(input).trim().match(/^([^/]+)\/(\d{1,3})$/);
 if(!m)throw Error("Enter an IPv6 prefix such as 2001:db8:1234::1/64.");
 const a=parseIPv6(m[1]),p=Number(m[2]);if(p>128)throw Error("IPv6 prefix must be 0–128.");
 const mask=p===0?0n:(V6MAX<<(128n-BigInt(p)))&V6MAX;
 const first=a&mask,last=first|(V6MAX^mask);
 return {prefix:p,network:ipv6Text(first),first:ipv6Text(first),last:ipv6Text(last),addresses:(1n<<BigInt(128-p)).toString(),cidr:ipv6Text(first)+"/"+p};
}
export function ipv6Report(input){
 const a=ipv6Cidr(input);return ["IPv6 network: "+a.cidr,"First address: "+a.first,
 "Last address: "+a.last,"Addresses in prefix: "+a.addresses,
 "Note: IPv6 does not use IPv4-style directed broadcast addresses."].join("\n")+"\n";
}
export function vlsmPlan(parentInput,requestText){
 const parent=ipv4Cidr(parentInput);
 const rows=String(requestText).trim().split(/\r?\n/).filter(x=>x.trim());
 if(!rows.length||rows.length>100)throw Error("Provide 1–100 lines using NAME,HOSTS.");
 const req=rows.map((line,i)=>{
  const m=line.trim().match(/^([^,\r\n]{1,55}),\s*(\d{1,9})\s*$/);
  if(!m)throw Error("Line "+(i+1)+": use NAME,HOSTS.");
  const count=Number(m[2]);if(count<1||count>100000000)throw Error("Invalid host count on line "+(i+1));
  let bits=2;while((2**bits-2)<count)bits++;if(bits>32)throw Error("Requested subnet too large.");
  return {name:m[1].trim(),hosts:count,bits,index:i};
 }).sort((a,b)=>b.bits-a.bits||a.index-b.index);
 let current=parent.start;
 const out=[];
 for(const reqItem of req){
  const size=1n<<BigInt(reqItem.bits);
  if(current%size)current+=size-(current%size);
  if(current+size-1n>parent.end)throw Error("Not enough room in "+parent.cidr+" for "+reqItem.name+".");
  const cidr=ipv4Text(current)+"/"+(32-reqItem.bits),net=ipv4Cidr(cidr);
  out.push({...reqItem,cidr,first:net.first,last:net.last,capacity:net.usable});current+=size;
 }
 return {parent:parent.cidr,allocations:out,unused:(parent.end-current+1n>0n?parent.end-current+1n:0n).toString()};
}
export function vlsmReport(parent,requests){
 const result=vlsmPlan(parent,requests);
 return ["VLSM parent: "+result.parent,"Allocated largest subnets first.",
 "Name | Hosts requested | CIDR | First usable | Last usable | Capacity",
 ...result.allocations.map(x=>[x.name,x.hosts,x.cidr,x.first,x.last,x.capacity].join(" | ")),
 "Unallocated addresses remaining after allocations: "+result.unused].join("\n")+"\n";
}
export function rangeToCidr(text){
 const match=String(text).trim().match(/^(.+?)\s*-\s*(.+)$/);
 if(!match)throw Error("Enter IPv4 range as 192.168.1.10 - 192.168.1.40.");
 let start=parseIPv4(match[1]),end=parseIPv4(match[2]);
 if(start>end)throw Error("Start address must not exceed end address.");
 const ranges=[];
 while(start<=end){
  if(ranges.length>5000)throw Error("Range needs over 5,000 CIDR blocks. Narrow it.");
  const remain=end-start+1n;
  let bits=0;
  while(bits<32&&start%(1n<<BigInt(bits+1))===0n&&(1n<<BigInt(bits+1))<=remain)bits++;
  const step=1n<<BigInt(bits);ranges.push(ipv4Text(start)+"/"+(32-bits));start+=step;
 }
 return ranges;
}
export function rangeReport(text,mode="range"){
 if(mode==="cidr"){const x=ipv4Cidr(text);return ["Range for "+x.cidr, x.network+" - "+x.broadcast,"Total: "+x.addresses+" addresses"].join("\n")+"\n";}
 const a=rangeToCidr(text);return ["Minimal CIDR cover ("+a.length+" blocks):",...a].join("\n")+"\n";
}
export function vlanPlan(text){
 const rows=String(text).split(/\r?\n/).map(s=>s.trim()).filter(Boolean);
 if(!rows.length||rows.length>100)throw Error("Enter 1–100 lines using VLAN_ID,NAME,CIDR.");
 const ids=new Set(),nets=[];
 for(let i=0;i<rows.length;i++){
  const cols=rows[i].split(",").map(v=>v.trim());
  if(cols.length!==3)throw Error("Line "+(i+1)+": use VLAN_ID,NAME,CIDR.");
  const [s,name,cidr]=cols,id=Number(s);
  if(!/^\d{1,4}$/.test(s)||id<1||id>4094)throw Error("VLAN ID must be 1–4094 on line "+(i+1));
  if(ids.has(id))throw Error("Repeated VLAN ID: "+id);
  if(!name||name.length>50)throw Error("Invalid VLAN name on line "+(i+1));
  const n=ipv4Cidr(cidr);for(const prev of nets)if(n.start<=prev.end&&prev.start<=n.end)throw Error("Overlapping subnets: "+prev.name+" and "+name);
  ids.add(id);nets.push({id,name,...n});
 }
 return nets;
}
export function vlanReport(text){
 const nets=vlanPlan(text);return ["VLAN | Name | Network | Mask | Usable hosts",
 ...nets.map(n=>[n.id,n.name,n.cidr,n.netmask,n.usable].join(" | "))].join("\n")+"\n";
}
