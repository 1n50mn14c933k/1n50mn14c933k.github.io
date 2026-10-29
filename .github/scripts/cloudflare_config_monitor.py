#!/usr/bin/env python3
"""Read-only Cloudflare zone configuration audit. Never prints credentials."""
import json
import os
import re
import sys
from pathlib import Path
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

API="https://api.cloudflare.com/client/v4"
def get(path, token):
    req=Request(API+path,headers={"Authorization":"Bearer "+token,"Accept":"application/json"},method="GET")
    try:
        with urlopen(req,timeout=12) as r:
            data=json.load(r)
    except HTTPError as e:
        raise RuntimeError("Cloudflare API returned HTTP "+str(e.code)) from None
    except (URLError,TimeoutError,ValueError) as e:
        raise RuntimeError("Cloudflare API request failed ("+type(e).__name__+")") from None
    if not data.get("success"):
        raise RuntimeError("Cloudflare API did not confirm success")
    return data.get("result")

def evaluate(settings, rulesets):
    results=[]
    def check(name,ok,detail):
        results.append((name,"PASS" if ok else "FAIL",detail))
    ssl=settings["ssl"]
    tls=settings["min_tls_version"]
    https=settings["always_use_https"]
    h=settings["security_header"]
    st=(h.get("strict_transport_security") or {})
    check("Full (strict)",ssl=="strict","Cloudflare SSL mode: "+str(ssl))
    check("Minimum TLS 1.2",tls in ("1.2","1.3"),"Minimum TLS: "+str(tls))
    check("Always HTTPS",https=="on","Always Use HTTPS: "+str(https))
    check("HSTS",st.get("enabled") is True and int(st.get("max_age") or 0)>=604800,
          "HSTS enabled="+str(st.get("enabled"))+" max_age="+str(st.get("max_age")))
    check("No-Sniff",st.get("nosniff") is True,"HSTS nosniff="+str(st.get("nosniff")))
    # Only exact, unambiguous domain-specific rule expressions qualify for PASS.
    csp=False
    for rule in rulesets:
        if not rule.get("enabled",True) or rule.get("action")!="rewrite":
            continue
        expr=rule.get("expression","")
        domain_match=("http.host eq \"kolfat.app\"" in expr and
                      "http.host eq \"www.kolfat.app\"" in expr)
        hdr=(rule.get("action_parameters") or {}).get("headers") or {}
        policy=next((v.get("value","") for k,v in hdr.items()
                     if k.lower()=="content-security-policy" and v.get("operation")=="set"),"")
        if domain_match and re.search(r"(?:^|;)\s*object-src\s+'none'\s*(?:;|$)",policy,re.I) and re.search(r"(?:^|;)\s*base-uri\s+'(?:self|none)'\s*(?:;|$)",policy,re.I):
            csp=True
            break
    check("CSP transform rule",csp,"Enabled rewrite rule for both KOLFAT hostnames with protected object-src/base-uri" if csp else "Expected enabled CSP rule not confirmed")
    return results

def main():
    out=Path("cloudflare-config-report.md")
    token=os.environ.get("CLOUDFLARE_READ_TOKEN","")
    zone=os.environ.get("CLOUDFLARE_ZONE_ID","")
    if not token or not re.fullmatch(r"[a-fA-F0-9]{32}",zone):
        msg="INCONCLUSIVE: Cloudflare read token or 32-character zone ID not configured. No API checks were performed."
        out.write_text("# KOLFAT Cloudflare configuration audit\n\n"+msg+"\n",encoding="utf-8")
        print("::warning::"+msg)
        return 0
    try:
        zone_info=get("/zones/"+zone,token)
        if zone_info.get("name")!="kolfat.app":
            raise RuntimeError("Configured zone ID does not belong to kolfat.app")
        settings={}
        for key in ("ssl","min_tls_version","always_use_https","security_header"):
            settings[key]=get("/zones/"+zone+"/settings/"+key,token)["value"]
        ruleset=get("/zones/"+zone+"/rulesets/phases/http_response_headers_transform/entrypoint",token)
        rules=ruleset.get("rules",[])
        results=evaluate(settings,rules)
    except RuntimeError as ex:
        msg="INCONCLUSIVE: "+str(ex)
        out.write_text("# KOLFAT Cloudflare configuration audit\n\n"+msg+"\n",encoding="utf-8")
        print("::warning::"+msg)
        return 0
    table=["# KOLFAT Cloudflare configuration audit","","Read-only GET requests; checks configured settings, not headers delivered to browsers.","",
           "| Check | Result | Evidence |","|---|---|---|"]
    table.extend("| "+name+" | "+status+" | "+detail+" |" for name,status,detail in results)
    out.write_text("\n".join(table)+"\n",encoding="utf-8")
    print("\n".join(table))
    if any(status=="FAIL" for _,status,_ in results):
        print("::error::A configured Cloudflare security setting was not verified")
        return 1
    return 0
if __name__=="__main__":
    sys.exit(main())
