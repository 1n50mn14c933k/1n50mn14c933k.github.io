/* KOLFAT Networking & Automation: local-only scheduling and reference utilities. */
const ports=[[20,"FTP data","TCP"],[21,"FTP control","TCP"],[22,"SSH","TCP"],[23,"Telnet (insecure)","TCP"],[25,"SMTP","TCP"],[53,"DNS","TCP/UDP"],[67,"DHCP server","UDP"],[68,"DHCP client","UDP"],[69,"TFTP","UDP"],[80,"HTTP","TCP"],[110,"POP3","TCP"],[123,"NTP","UDP"],[135,"RPC endpoint mapper","TCP"],[137,"NetBIOS name","UDP"],[138,"NetBIOS datagram","UDP"],[139,"NetBIOS session","TCP"],[143,"IMAP","TCP"],[161,"SNMP","UDP"],[162,"SNMP traps","UDP"],[389,"LDAP","TCP/UDP"],[443,"HTTPS","TCP/UDP"],[445,"SMB","TCP"],[465,"SMTPS","TCP"],[500,"IKE","UDP"],[514,"Syslog","UDP"],[587,"SMTP submission","TCP"],[636,"LDAPS","TCP"],[853,"DNS over TLS","TCP"],[993,"IMAPS","TCP"],[995,"POP3S","TCP"],[1194,"OpenVPN default","UDP"],[1433,"Microsoft SQL Server","TCP"],[1521,"Oracle DB","TCP"],[1883,"MQTT","TCP"],[2049,"NFS","TCP"],[2375,"Docker API unencrypted","TCP"],[2376,"Docker API TLS","TCP"],[3000,"Common application port","TCP"],[3306,"MySQL / MariaDB","TCP"],[3389,"RDP","TCP/UDP"],[3478,"STUN/TURN","TCP/UDP"],[4180,"Common OIDC proxy","TCP"],[5000,"Common registry/app port","TCP"],[5432,"PostgreSQL","TCP"],[5672,"AMQP","TCP"],[5900,"VNC","TCP"],[6379,"Redis","TCP"],[6443,"Kubernetes API","TCP"],[8080,"Alternative HTTP","TCP"],[8443,"Alternative HTTPS","TCP"],[9090,"Prometheus","TCP"],[9093,"Alertmanager","TCP"],[9100,"Node exporter","TCP"],[9418,"Git protocol","TCP"],[10250,"Kubelet API","TCP"],[11211,"Memcached","TCP/UDP"],[27017,"MongoDB","TCP"],[51820,"WireGuard common","UDP"]];
export function portReport(query){
 const q=String(query).trim().toLowerCase();if(q.length>80)throw Error("Search term too long.");
 const found=ports.filter(x=>!q||x.join(" ").toLowerCase().includes(q));
 return ["Common port reference (not a network scan)","Port | Service | Transport",...found.map(x=>x.join(" | ")),found.length?"":"No matching entries in this curated offline list."].join("\n")+"\n";
}
const field=(x,min,max,name)=>{if(!/^\d+$/.test(String(x))||Number(x)<min||Number(x)>max)throw Error("Invalid "+name+": "+x);return Number(x);};
function cronValues(f,min,max,name){
 if(f==="*")return Array.from({length:max-min+1},(_,i)=>i+min);
 const set=new Set();
 for(const part of f.split(",")){
  const m=part.match(/^(\*|\d+)(?:-(\d+))?(?:\/(\d+))?$/);if(!m)throw Error("Unsupported "+name+" cron expression");
  let low=m[1]==="*"?min:field(m[1],min,max,name),high=m[2]?field(m[2],min,max,name):m[1]==="*"?max:low,step=m[3]?field(m[3],1,max-min+1,name+" step"):1;
  if(high<low)throw Error("Reversed "+name+" range");
  for(let v=low;v<=high;v+=step)set.add(v);
 }
 return [...set].sort((a,b)=>a-b);
}
export function cronNext(expression,limit=5,now=new Date()){
 const parts=String(expression).trim().split(/\s+/);if(parts.length!==5)throw Error("Use five fields: minute hour day-of-month month day-of-week.");
 const [mins,hours,days,months,weekdays]=parts.map((v,i)=>cronValues(v,...[[0,59,"minute"],[0,23,"hour"],[1,31,"day-of-month"],[1,12,"month"],[0,7,"weekday"]][i]));
 const weekdaysNorm=weekdays.map(x=>x===7?0:x),dAny=parts[2]==="*",wAny=parts[4]==="*";
 const results=[],cursor=new Date(Math.floor(now.getTime()/60000)*60000+60000);
 for(let i=0;i<527040&&results.length<limit;i++){
  const day=cursor.getUTCDate(),weekday=cursor.getUTCDay();
  if(months.includes(cursor.getUTCMonth()+1)&&hours.includes(cursor.getUTCHours())&&mins.includes(cursor.getUTCMinutes())){
   const dm=days.includes(day),dw=weekdaysNorm.includes(weekday);
   if(dAny&&wAny||dAny&&dw||wAny&&dm||!dAny&&!wAny&&(dm||dw))results.push(new Date(cursor));
  }
  cursor.setUTCMinutes(cursor.getUTCMinutes()+1);
 }
 if(!results.length)throw Error("No execution found within one year (UTC).");
 return results;
}
export function cronReport(expr){
 const dates=cronNext(expr);return ["5-field cron (UTC): "+expr,"Next five occurrences (UTC):",...dates.map(d=>d.toISOString()),"Note: day-of-month and weekday fields follow common crontab OR semantics when both are restricted."].join("\n")+"\n";
}
export function systemdTimer(onCalendar,description){
 const allowed=new Set(["hourly","daily","weekly","monthly","yearly"]);
 if(!allowed.has(onCalendar))throw Error("Choose a supported systemd calendar preset.");
 const d=String(description).trim().slice(0,60).replace(/[\r\n\[\]]/g," ")||"KOLFAT scheduled task";
 return ["# kolfat-task.service","[Unit]","Description="+d,"","[Service]","Type=oneshot","ExecStart=/usr/local/bin/replace-with-your-script","","# kolfat-task.timer","[Unit]","Description=Run "+d,"","[Timer]","OnCalendar="+onCalendar,"Persistent=true","Unit=kolfat-task.service","","[Install]","WantedBy=timers.target","","Replace the ExecStart placeholder before installation.","Review permissions and working directories. Check with: systemd-analyze calendar '"+onCalendar+"'"].join("\n")+"\n";
}
export function timestampReport(text){
 const s=String(text).trim();let date;
 if(/^[-]?\d{1,16}$/.test(s)){const x=Number(s);date=new Date(s.length>=13?x:x*1000);}
 else date=new Date(s);
 if(!Number.isFinite(date.getTime()))throw Error("Enter ISO 8601, Unix seconds or milliseconds.");
 return ["UTC ISO 8601: "+date.toISOString(),"Unix seconds: "+Math.floor(date.getTime()/1000),"Unix milliseconds: "+date.getTime(),"Browser local: "+date.toString()].join("\n")+"\n";
}
export function timezoneReport(text,zones){
 const d=new Date(String(text).trim());if(!Number.isFinite(d.getTime()))throw Error("Provide an ISO 8601 date/time with a timezone (Z or ±HH:MM).");
 if(!/(?:Z|[+-]\d{2}:\d{2})$/i.test(text.trim()))throw Error("Include an explicit input timezone, e.g. 2026-10-24T18:00:00Z.");
 const allowed=["UTC","Europe/Amsterdam","Europe/Vienna","Europe/London","America/New_York","America/Los_Angeles","Asia/Tokyo","Asia/Dubai","Asia/Tehran","Asia/Kolkata","Australia/Sydney"];
 const selected=[...new Set(zones.filter(z=>allowed.includes(z)))];if(!selected.length)throw Error("Select one or more supported time zones.");
 return ["Instant: "+d.toISOString(),...selected.map(zone=>zone+": "+new Intl.DateTimeFormat("en-GB",{timeZone:zone,dateStyle:"full",timeStyle:"long",hour12:false}).format(d))].join("\n")+"\n";
}
export function chmodReport(input){
 const raw=String(input).trim();let mode;
 if(/^[0-7]{3}$/.test(raw))mode=raw;
 else if(/^[rwx-]{9}$/.test(raw)){
  mode=[0,3,6].map(start=>(raw[start]==="r"?4:0)+(raw[start+1]==="w"?2:0)+(raw[start+2]==="x"?1:0)).join("");
 }else throw Error("Enter exactly three octal digits (e.g. 750) or nine rwx characters (e.g. rwxr-x---).");
 const perm=mode.split("").map(s=>{const n=Number(s);return(n&4?"r":"-")+(n&2?"w":"-")+(n&1?"x":"-");}).join("");
 return ["Octal: "+mode,"Symbolic: "+perm,"chmod "+mode+" file-or-directory","Owner: "+perm.slice(0,3),"Group: "+perm.slice(3,6),"Others: "+perm.slice(6,9),"Does not cover special setuid/setgid/sticky bits or ACLs."].join("\n")+"\n";
}
export function composeCheck(text,parseYaml){
 if(text.length>300000)throw Error("Compose file exceeds 300 KB.");
 const data=parseYaml(text);
 if(!data||typeof data!=="object"||Array.isArray(data))throw Error("Compose document must be a mapping.");
 const allowed=["name","services","networks","volumes","configs","secrets","version","include","x-extensions"];
 for(const key of Object.keys(data))if(!allowed.includes(key)&&!key.startsWith("x-"))throw Error("Unexpected top-level key: "+key);
 if(!data.services||typeof data.services!=="object"||Array.isArray(data.services)||!Object.keys(data.services).length)throw Error("Compose services map is required.");
 const serviceNames=Object.keys(data.services);
 if(serviceNames.length>100)throw Error("Too many services.");
 for(const [name,service] of Object.entries(data.services)){
  if(!service||typeof service!=="object"||Array.isArray(service))throw Error("Service "+name+" must be a map.");
  if(!service.image&&!service.build)throw Error("Service "+name+" requires image or build.");
 }
 return ["Compose subset check passed","Services: "+serviceNames.join(", "),"Top-level keys: "+Object.keys(data).join(", "),"Note: This is an offline structural pre-check, NOT the official Compose Specification validator.","This restricted YAML parser does not support anchors, tags, folded blocks, merge keys, or other advanced YAML syntax.","Use 'docker compose config -q' for authoritative validation."].join("\n")+"\n";
}
