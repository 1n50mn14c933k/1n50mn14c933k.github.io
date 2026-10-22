#!/usr/bin/env python3
"""Audit production KOLFAT website pages without modifying any content."""
from pathlib import Path
from html.parser import HTMLParser
from collections import Counter, defaultdict
from urllib.parse import urlparse, unquote
import re, json

ROOT=Path(".")
pages=sorted(ROOT.rglob("*.html"))
banned={"node_modules",".git"}
pages=[p for p in pages if not any(x in banned for x in p.parts)]
def pathfor(p):return str(p).replace("\\","/")
class Extract(HTMLParser):
 def __init__(self):super().__init__(convert_charrefs=True);self.parts=[];self.hidden=0;self.links=[];self.metatags=[]
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if tag in ("script","style","noscript"):self.hidden+=1
  if tag=="a" and a.get("href"):self.links.append(a["href"])
  if tag=="meta":self.metatags.append(a)
 def handle_endtag(self,tag):
  if tag in ("script","style","noscript"):self.hidden=max(0,self.hidden-1)
 def handle_data(self,data):
  if not self.hidden:self.parts.append(data)
patterns={
 "old-version":re.compile(r"(?<![0-9])(?:v)?1\.(?:0|2|4|6)\.0(?:\.0)?(?!\d)",re.I),
 "current-1.8":re.compile(r"(?<![0-9])(?:v)?1\.8\.0(?:\.0)?(?!\d)",re.I),
 "copy-only":re.compile(r"\b(?:copy.only|copy only|only copy|copy.mode only|exclusively cop(?:y|ies)|copy without move)\b",re.I),
 "coming-soon":re.compile(r"\b(?:coming soon|not yet available|not yet released|launching soon|currently in development|planned feature|future update)\b",re.I),
 "old-features":re.compile(r"\b(?:albums|tagging|tags|face recognition|face tagging)\b",re.I),
 "workflow":re.compile(r"\b(?:Guided Mode|Advanced Mode|COPY and MOVE|Pause, Resume|Activity History|Library Overview|Select All Visible|rotate|rotat(?:ion|e)|duplicate finder)\b",re.I),
 "policy":re.compile(r"\b(?:upload|cloud|subscription|free forever|paid|pro version)\b",re.I),
}
counts={k:0 for k in patterns};hits=defaultdict(list);broken=[];main_no_version=[]
for p in pages:
 c=p.read_text(encoding="utf-8",errors="replace");e=Extract();e.feed(c)
 s=re.sub(r"\s+"," "," ".join(e.parts))
 for kind,rx in patterns.items():
  m=list(rx.finditer(s)); counts[kind]+=len(m)
  for k in m[:4]:
   a=max(0,k.start()-85);b=min(len(s),k.end()+115)
   if len(hits[kind])<160:hits[kind].append((pathfor(p),s[a:b]))
 if "Media_Kolfat/index.html" in pathfor(p) and not patterns["current-1.8"].search(s):main_no_version.append(pathfor(p))
 for link in e.links:
  parsed=urlparse(link);path=unquote(parsed.path)
  if parsed.scheme and (parsed.scheme not in ("http","https") or parsed.netloc not in ("kolfat.app","www.kolfat.app")):continue
  if link.startswith(("#","mailto:","tel:","javascript:","data:")):continue
  if path.startswith("/"):dest=ROOT/path.lstrip("/")
  else:dest=p.parent/path
  if not path:continue
  if not dest.exists() and not (dest/"index.html").exists() and not (ROOT/(path.lstrip("/")+".html")).exists():
   broken.append((pathfor(p),link))
print("HTML_PAGES",len(pages))
print("COUNTS",json.dumps(counts))
print("PRODUCT_PAGES_WITHOUT_1.8",json.dumps(main_no_version))
for kind in ("old-version","copy-only","coming-soon","old-features","workflow","policy"):
 print("===",kind.upper(),"HITS",len(hits[kind]))
 for path,snip in hits[kind][:70 if kind!="workflow" else 12]:
  print(path,"|",snip[:280])
print("BROKEN_INTERNAL_LINKS",len(broken))
for path,link in broken[:90]:print("LINK",path,"->",link)
for p in [Path("README.md"),Path("docs/NAVIGATION.md")]:
 if p.exists():
  c=p.read_text()
  for ver in ("1.0.0","1.2.0","1.4.0","1.6.0","1.8.0"):
   if ver in c:print("DOC_VERSION",p,ver,c.count(ver))
