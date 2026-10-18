#!/usr/bin/env python3
"""Generate fully localized KOLFAT About, Download, Guides hub + 5 articles.
The pre-existing English pages remain authoritative; every new locale has its own
canonical, reciprocal hreflang cluster, language selector, localized content and menu.
"""
from pathlib import Path
from html import escape as e
from html.parser import HTMLParser
import json, re, xml.etree.ElementTree as ET

LANGS = ("en","fa","de","fr","es","pt","it","ja","zh","hi","ru","ar")
FLAGS = ("🇬🇧","🇮🇷","🇩🇪","🇫🇷","🇪🇸","🇵🇹","🇮🇹","🇯🇵","🇨🇳","🇮🇳","🇷🇺","🇸🇦")
NAMES = ("English","فارسی","Deutsch","Français","Español","Português","Italiano","日本語","中文","हिन्दी","Русский","العربية")
SLUGS = ("organize-photos-by-date","organize-large-photo-library","find-duplicate-photos-safely","organize-photos-from-phone-and-usb","photo-organizer-for-windows")
PAGES = ["about","download","guides",*[f"guides/{s}" for s in SLUGS]]
ORIGIN = "https://kolfat.app"
STORE = "https://apps.microsoft.com/detail/9p0x091t7mv4?ocid=webpdpshare"

def path(l, p): return f"/{p}/" if l=="en" else f"/{l}/{p}/"
def url(l,p): return ORIGIN+path(l,p)
def attrs(text): return e(text,quote=True)

def alternate(p):
    lines=[f'<link rel="alternate" hreflang="{"zh-CN" if l=="zh" else l}" href="{url(l,p)}">' for l in LANGS]
    lines.append(f'<link rel="alternate" hreflang="x-default" href="{url("en",p)}">')
    return "\n".join(lines)

def selector(l,p):
    options=[]
    for ix,target in enumerate(LANGS):
        current = ' aria-current="page"' if l==target else ""
        options.append(f'<a href="{path(target,p)}"{current}>{FLAGS[ix]} {e(NAMES[ix])}</a>')
    return ('<details class="lang-menu"><summary aria-label="Change language" title="Change language">'
            + FLAGS[LANGS.index(l)] + '</summary><div class="lang-list">'
            + "".join(options)+'</div></details>')

def menu(l,p,d):
    a=d["labels"]
    internal=[
       (f"/{l}/",a["home"]),
       (f"/{l}/Media_Kolfat/","MEDIA KOLFAT"),
       (path(l,"download"),a["download"]),
       (path(l,"about"),a["about"]),
       (path(l,"guides"),a["guides"]),
       ("/support/" if l=="en" else f"/{l}/support/",a["support"]),
       ("mailto:contact@kolfat.app",a["contact"])
    ]
    links="".join(f'<a href="{attrs(href)}" dir="auto">{e(label)}</a>' for href,label in internal)
    social=[("https://x.com/KOLFAT_APP","X"),("https://www.youtube.com/@KOLFAT_APP","YOUTUBE"),("https://www.tiktok.com/@kolfat.app","TIKTOK"),("https://github.com/1n50mn14c933k/Media_Kolfat","GITHUB")]
    links+='<span class="menu-section-label">FOLLOW KOLFAT</span>'
    links+="".join(f'<a href="{attrs(u)}" target="_blank" rel="noopener noreferrer" dir="auto">{v}</a>' for u,v in social)
    return (f'<div class="top-nav"><details class="kolfat-menu"><summary aria-label="{e(a["menu"])}">'
        '<svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">'
        '<path d="M4 7h16M4 12h16M4 17h16"/></svg>'
        f'<span>{e(a["menu"])}</span><span class="menu-chevron" aria-hidden="true">⌄</span></summary>'
        '<nav class="kolfat-menu-panel" aria-label="KOLFAT navigation"><span class="menu-section-label">KOLFAT</span>'
        +links+'</nav></details>'+selector(l,p)+'</div>')

def head(l,p,title,desc,typ="WebPage",h1=None):
    canonical=url(l,p)
    crumbs=[{"@type":"ListItem","position":1,"name":"KOLFAT","item":ORIGIN+f"/{l}/"}]
    if p.startswith("guides/"):
        crumbs.append({"@type":"ListItem","position":2,"name":"Guides","item":url(l,"guides")})
        crumbs.append({"@type":"ListItem","position":3,"name":h1 or title,"item":canonical})
    else:
        crumbs.append({"@type":"ListItem","position":2,"name":h1 or title,"item":canonical})
    graph=[{"@type":typ,"@id":canonical+"#page","url":canonical,"name":h1 or title,"description":desc,"inLanguage":"zh-CN" if l=="zh" else l},
           {"@type":"BreadcrumbList","itemListElement":crumbs}]
    return ('<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">'
        f'<title>{e(title)} | KOLFAT</title><meta name="description" content="{attrs(desc[:175])}">'
        '<meta name="robots" content="index,follow"><meta name="theme-color" content="#050505">'
        f'<link rel="canonical" href="{canonical}">{alternate(p)}'
        '<link rel="icon" href="/favicon.png" type="image/png">'
        '<meta property="og:type" content="website"><meta property="og:site_name" content="KOLFAT">'
        f'<meta property="og:title" content="{attrs(title)} | KOLFAT"><meta property="og:description" content="{attrs(desc[:175])}">'
        f'<meta property="og:url" content="{canonical}">'
        '<meta name="twitter:card" content="summary">'
        f'<meta name="twitter:title" content="{attrs(title)} | KOLFAT">'
        f'<meta name="twitter:description" content="{attrs(desc[:175])}">'
        '<script type="application/ld+json">'+json.dumps({"@context":"https://schema.org","@graph":graph},ensure_ascii=False,separators=(",",":"))+'</script>'
        '<link rel="stylesheet" href="/assets/seo-content.css?v=20261018-seo1">'
        '<link rel="stylesheet" href="/assets/nav-dropdown.css?v=20261018-3">'
        '<link rel="stylesheet" href="/assets/localized-content.css?v=20261018-1">')

def breadcrumb(l,p,d,title):
    lab=d["labels"]
    parts=[f'<a href="/{l}/">KOLFAT</a>']
    if p.startswith("guides/"): parts.append(f'<a href="{path(l,"guides")}">{e(lab["guides"])}</a>')
    parts.append(e(title))
    return '<div class="breadcrumb"> / '.join(parts)+'</div>'

def shell(l,p,d,title,description,body,typ="WebPage"):
    direction="rtl" if l in ("fa","ar") else "ltr"
    return (f'<!doctype html><html lang="{l}" dir="{direction}"><head>{head(l,p,title,description,typ,title)}</head>'
        f'<body><header class="header"><div class="header-inner"><a class="brand" href="/{l}/" aria-label="KOLFAT home">'
        '<img src="/assets/kolfat-logo.webp?v=d2c25ec0" alt="KOLFAT"></a>'
        +menu(l,p,d)+'</div></header><main>'+breadcrumb(l,p,d,title)+body
        +'</main><footer><div class="foot"><span>© 2026 KOLFAT</span><nav>'
        f'<a href="/{l}/">{e(d["labels"]["home"])}</a>'
        f'<a href="/{l}/privacy/">{e(d["labels"]["privacy"])}</a>'
        f'<a href="/{l}/terms/">{e(d["labels"]["terms"])}</a>'
        f'<a href="/{l}/licenses/">{e(d["labels"]["licenses"])}</a>'
        '</nav></div></footer><script defer src="/assets/nav-dropdown.js?v=20261018-2"></script></body></html>')

def content(l,d,p):
    a=d["labels"]
    if p=="about":
        v=d["about"]
        body=(f'<section class="hero"><p class="eyebrow">KOLFAT</p><h1>{e(v["title"])}</h1>'
              f'<p class="lead">{e(v["intro"])}</p><div class="cta-row"><a class="cta primary" href="/{l}/Media_Kolfat/">MEDIA KOLFAT</a>'
              f'<a class="cta" href="{path(l,"download")}">{e(a["download"])}</a></div></section>'
              f'<section class="section"><h2>{e(v["story_h"])}</h2><p>{e(v["story"])}</p></section>'
              f'<section class="section"><h2>MEDIA KOLFAT</h2><p>{e(v["product"])}</p></section>'
              f'<section class="section"><h2>{e(v["privacy_h"])}</h2><p>{e(v["privacy"])}</p></section>'
              f'<section class="section"><h2>{e(v["social_h"])}</h2><p>{e(v["social"])}</p>'
              '<p><a href="https://github.com/1n50mn14c933k/Media_Kolfat">GitHub</a> · '
              '<a href="https://x.com/KOLFAT_APP">X</a> · '
              '<a href="https://www.youtube.com/@KOLFAT_APP">YouTube</a> · '
              '<a href="https://www.tiktok.com/@kolfat.app">TikTok</a></p></section>')
        return shell(l,p,d,v["title"],v["desc"],body,"AboutPage")
    if p=="download":
        v=d["download"]
        ico='<svg viewBox="0 0 44 44" aria-hidden="true"><rect x="2" y="2" width="18" height="18" fill="#f25022"/><rect x="24" y="2" width="18" height="18" fill="#7fba00"/><rect x="2" y="24" width="18" height="18" fill="#00a4ef"/><rect x="24" y="24" width="18" height="18" fill="#ffb900"/></svg>'
        cards="".join(f'<article class="card"><h3>{e(h)}</h3><p>{e(x)}</p></article>' for h,x in v["features"])
        steps="".join(f'<li>{e(x)}</li>' for x in v["steps"])
        body=(f'<section class="hero"><p class="eyebrow">MEDIA KOLFAT</p><h1>{e(v["title"])}</h1>'
              f'<p class="lead">{e(v["intro"])}</p><a class="store" href="{STORE}" target="_blank" rel="noopener noreferrer">'
              +ico+'<span><small>MEDIA KOLFAT</small><strong>Microsoft Store</strong></span></a></section>'
              f'<section class="section"><h2>{e(v["why_h"])}</h2><p>{e(v["why"])}</p></section>'
              f'<section class="section"><h2>{e(v["features_h"])}</h2><div class="grid">{cards}</div></section>'
              f'<section class="section"><h2>{e(v["steps_h"])}</h2><ol>{steps}</ol>'
              f'<div class="cta-row"><a class="cta" href="{path(l,"guides")}">{e(a["guides"])}</a>'
              f'<a class="cta" href="/{l}/support/">{e(a["support"])}</a></div></section>')
        return shell(l,p,d,v["title"],v["desc"],body)
    if p=="guides":
        v=d["hub"]
        cards="".join(
          f'<article class="card"><h2>{e(g["title"])}</h2><p>{e(g["intro"])}</p><a href="{path(l,"guides/"+slug)}">{e(a["read"])} →</a></article>'
          for slug,g in zip(SLUGS,d["guides"]))
        body=f'<section class="hero"><p class="eyebrow">MEDIA KOLFAT</p><h1>{e(v["title"])}</h1><p class="lead">{e(v["intro"])}</p></section><section class="section"><div class="grid">{cards}</div></section>'
        return shell(l,p,d,v["title"],v["desc"],body,"CollectionPage")
    slug=p.split("/")[-1]
    g=d["guides"][SLUGS.index(slug)]
    sections="".join(f'<section class="section"><h2>{i}. {e(h)}</h2><p>{e(b)}</p></section>' for i,(h,b) in enumerate(g["steps"],1))
    body=(f'<article class="hero"><p class="eyebrow">MEDIA KOLFAT</p><h1>{e(g["title"])}</h1>'
          f'<p class="lead">{e(g["intro"])}</p></article>'+sections
          f'<section class="section"><h2>MEDIA KOLFAT</h2><p>{e(d["hub"]["product_cta"])}</p>'
          f'<div class="cta-row"><a class="cta primary" href="{path(l,"download")}">{e(a["download"])}</a>'
          f'<a class="cta" href="/{l}/Media_Kolfat/">MEDIA KOLFAT</a>'
          f'<a class="cta" href="{path(l,"guides")}">{e(a["guides"])}</a></div></section>')
    return shell(l,p,d,g["title"],g["intro"],body,"Article")

data={}
for lang in LANGS[1:]:
    file=Path(".github/i18n")/(lang+".json")
    if not file.exists():raise RuntimeError("Missing translation: "+str(file))
    d=json.loads(file.read_text(encoding="utf-8"))
    assert all(k in d for k in ("labels","about","download","hub","guides")),lang
    assert len(d["guides"])==5,lang
    assert len(d["download"]["features"])==4 and len(d["download"]["steps"])==4,lang
    assert all(len(g["steps"])==6 and all(len(pair)==2 for pair in g["steps"]) for g in d["guides"]),lang
    data[lang]=d

# Generate 88 localized pages; English content files remain unchanged.
for lang,d in data.items():
    for p in PAGES:
        target=Path(lang)/p/"index.html"
        target.parent.mkdir(parents=True,exist_ok=True)
        target.write_text(content(lang,d,p),encoding="utf-8")

# Upgrade navigation menus of all original home, product, legal and English content pages.
# Page body, translated legal text, and SEO tags remain untouched.
links_re=re.compile(r'(<nav class="kolfat-menu-panel"[^>]*>)(.*?)(</nav>)', re.S)
lang_re=re.compile(r'<details class="lang-menu">.*?</details>',re.S)
for lang in LANGS:
    d=data.get(lang)
    for p in ["", "Media_Kolfat", "support", "privacy", "terms", "disclaimer", "licenses"]:
        if p=="":
            source=Path(lang)/"index.html"
            suffix="/"
        elif p=="Media_Kolfat":
            source=Path(lang)/"Media_Kolfat/index.html"
            suffix="Media_Kolfat/"
        elif lang=="en":
            source=Path(p)/"index.html";suffix=p+"/"
        else:
            source=Path(lang)/p/"index.html";suffix=p+"/"
        text=source.read_text(encoding="utf-8")
        def fix(m):
            inner=m.group(2)
            # Only rewrite internal About/Download/Guides targets.
            for kind in ("about","download","guides"):
                inner=inner.replace(f'href="/{kind}/"',f'href="{path(lang,kind)}"')
            return m.group(1)+inner+m.group(3)
        new,n=links_re.subn(fix,text,count=1)
        if n!=1: raise RuntimeError("Missing menu in "+str(source))
        if new!=text: source.write_text(new,encoding="utf-8")

# Upgrade eight English content pages: add language selector with exact corresponding paths.
for p in PAGES:
    source=Path(p)/"index.html"
    text=source.read_text(encoding="utf-8")
    if 'class="lang-menu"' not in text:
        nav=re.search(r'<div class="top-nav">.*?</details></div>',text,re.S)
        if not nav:raise RuntimeError("English content menu missing: "+str(source))
        updated=nav.group(0).replace('</details></div>','</details>'+selector("en",p)+'</div>',1)
        text=text[:nav.start()]+updated+text[nav.end():]
        source.write_text(text,encoding="utf-8")

# Give the existing eight English pages their complete reciprocal hreflang clusters.
# Existing canonicals, body copy, and structured data stay unchanged.
for p in PAGES:
    source=Path(p)/"index.html"
    text=source.read_text(encoding="utf-8")
    if 'hreflang="x-default"' not in text:
        canonical=f'<link rel="canonical" href="{url("en",p)}">'
        assert text.count(canonical)==1,source
        text=text.replace(canonical,canonical+"\n"+alternate(p),1)
        source.write_text(text,encoding="utf-8")

# Sitemap: keep all preexisting URLs and append 88 exact new localized URLs.
sitemap=Path("sitemap.xml")
text=sitemap.read_text(encoding="utf-8")
existing=set(re.findall(r'<loc>(.*?)</loc>',text))
new=[url(l,p) for l in LANGS[1:] for p in PAGES]
assert len(new)==88
for u in new:
    if u not in existing:
        text=text.replace('</urlset>',f'  <url><loc>{u}</loc></url>\n</urlset>',1)
sitemap.write_text(text,encoding="utf-8")
root=ET.fromstring(text)
ns="{http://www.sitemaps.org/schemas/sitemap/0.9}"
listed=[elem.text for elem in root.findall(".//"+ns+"loc")]
assert len(listed)==len(set(listed))==181, (len(listed),len(set(listed)))
assert all(u in listed for u in new)

# Validate all 12 localized pages for all 8 page families, with reciprocal hreflang.
for p in PAGES:
    for lang in LANGS:
        page=Path(p)/"index.html" if lang=="en" else Path(lang)/p/"index.html"
        t=page.read_text(encoding="utf-8")
        if lang!="en":
            assert f'<link rel="canonical" href="{url(lang,p)}">' in t,page
            assert f'<html lang="{lang}"' in t,page
            assert ('dir="rtl"' in t)==(lang in ("fa","ar")),page
            assert t.count('class="lang-menu"')==1,page
            assert t.count('class="kolfat-menu"')==1,page
            assert all(f'href="{path(lang,k)}"' in t for k in ("about","download","guides")),page
            scripts=re.findall(r'<script type="application/ld\+json">(.*?)</script>',t,re.S)
            assert len(scripts)==1,page
            for script in scripts:json.loads(script)
        for alt in LANGS:
            attr="zh-CN" if alt=="zh" else alt
            if lang!="en":
                assert f'hreflang="{attr}" href="{url(alt,p)}"' in t,(page,attr)
        if lang=="en":
            assert t.count('class="lang-menu"')==1,page
            assert all(f'href="{path(k,p)}"' in t for k in LANGS),page

assert all(url(l,p) in listed for l in LANGS for p in PAGES)
print(f"OK: {len(new)} translated pages, {len(listed)} sitemap URLs; hreflang, canonical, navigation and RTL validated")
