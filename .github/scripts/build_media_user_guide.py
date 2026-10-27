"""Render the verified multilingual MEDIA KOLFAT guide using existing site chrome."""
from pathlib import Path
import argparse,html,json,re

ROOT=Path(__file__).resolve().parents[2]
LANGUAGES=('en','fa','de','fr','es','pt','it','ja','zh','hi','ru','ar')
SLUG='media-kolfat-2-user-guide'
DOMAIN='https://kolfat.app'
SOURCE=ROOT/'content'/'media-kolfat-2-guide'
ASSETS='/assets/media-kolfat-2-guide/'

def route(lang):return ('/' if lang=='en' else f'/{lang}/')+'guides/'+SLUG+'/'
def language_tag(lang):return 'zh-CN' if lang=='zh' else lang
def esc(value):return html.escape(str(value),quote=True)
def localized_text(text,lang):
 value=esc(text)
 if lang in ('fa','ar'):
  labels=('Choose Photos & Videos Manually','Scan Computer Automatically','Organize Photos & Videos','Privacy & Local Processing','Open-Source & Third-Party Licenses','MEDIA KOLFAT Organized Media','Reset Settings to Defaults','Photos Health Check','Select all visible photos','Copy Selected Files','Move Selected Files','Add Destination to Folders','Remove from MEDIA KOLFAT','Filesystem last modified','Advanced date policy','Default organize pattern','Destination behavior','Show All Photos','Select This Folder','Exact Duplicate Group','Selected destination','Selected Folder','Current folder','Duplicate Finder','Browse Library','Performance Check','Add Photos & Videos','Open Move Report','Open Copy Report','Open Destination','Open destination','Choose File Types','Copy Timing Results','File name A–Z','Unavailable only','Advanced MOVE','MEDIA KOLFAT','COPY','MOVE','Guided','Advanced','Settings','Activity','About','Continue','Cancel','Resume','Pause','Stop Scan','Start Scan','Find Duplicates','Refresh','Select All','Deselect All','Undo','Rotate Right','Rotate Left','Rotate 180','Clear Selection','Search media','Photos only','Not checked','Move Samples','Move Results','Copy Results','Media Samples','COPIED_SOURCE_RETAINED','Windows CreationTime')
  pattern='|'.join(re.escape(esc(x)) for x in sorted(labels,key=len,reverse=True))
  pattern=re.escape(esc(r'{YYYY}\{YYYY-MM}'))+'|'+pattern
  value=re.sub(pattern,lambda match:'<bdi dir="ltr">'+match.group(0)+'</bdi>',value)
 return value

def render(lang):
 data=json.loads((SOURCE/f'{lang}.json').read_text(encoding='utf-8-sig'))
 if data['language']!=lang:raise ValueError('Language mismatch')
 template=ROOT/('guides' if lang=='en' else f'{lang}/guides')/'organize-photos-by-date'/'index.html'
 old=template.read_text(encoding='utf-8-sig')
 header=re.search(r'<header\b.*?</header>',old,re.S).group(0).replace('organize-photos-by-date',SLUG)
 footer=re.search(r'<footer\b.*?</footer>',old,re.S).group(0)
 styles=re.findall(r'<link\b[^>]*rel="stylesheet"[^>]*>',old)
 scripts=re.findall(r'<script\b[^>]*src="[^>]*></script>',old)
 canonical=DOMAIN+route(lang)
 head=['<!doctype html>',f'<html lang="{language_tag(lang)}"'+(' dir="rtl"' if lang in ('fa','ar') else '')+'>','<head>','<meta charset="utf-8">','<meta name="viewport" content="width=device-width,initial-scale=1">',f'<title>{esc(data["title"])} | KOLFAT</title>',f'<meta name="description" content="{esc(data["description"])}">','<meta name="robots" content="index,follow">','<meta name="theme-color" content="#050505">',f'<link rel="canonical" href="{canonical}">']
 for locale in LANGUAGES:head.append(f'<link rel="alternate" hreflang="{language_tag(locale)}" href="{DOMAIN+route(locale)}">')
 head+=['<link rel="alternate" hreflang="x-default" href="'+DOMAIN+route('en')+'">','<link rel="icon" href="/favicon.png" type="image/png">','<meta property="og:type" content="article">','<meta property="og:site_name" content="KOLFAT">']
 for name,value in (('title',data['title']),('description',data['description']),('url',canonical),('image',DOMAIN+ASSETS+'screenshots/01-01-first-launch-guided.png')):head.append(f'<meta property="og:{name}" content="{esc(value)}">')
 head+=['<meta name="twitter:card" content="summary_large_image">',f'<meta name="twitter:title" content="{esc(data["title"])}">',f'<meta name="twitter:description" content="{esc(data["description"])}">',f'<meta name="twitter:image" content="{DOMAIN+ASSETS}screenshots/01-01-first-launch-guided.png">']
 schema={'@context':'https://schema.org','@graph':[{'@type':'Article','@id':canonical+'#article','headline':data['title'],'description':data['description'],'inLanguage':language_tag(lang),'datePublished':'2026-10-27','dateModified':'2026-10-27','mainEntityOfPage':canonical,'image':DOMAIN+ASSETS+'screenshots/01-01-first-launch-guided.png','publisher':{'@type':'Brand','name':'KOLFAT','url':DOMAIN+'/'}},{'@type':'BreadcrumbList','itemListElement':[{'@type':'ListItem','position':1,'name':'KOLFAT','item':DOMAIN+f'/{lang}/'},{'@type':'ListItem','position':2,'name':data['contentsLabel'],'item':DOMAIN+('/guides/' if lang=='en' else f'/{lang}/guides/')},{'@type':'ListItem','position':3,'name':data['title'],'item':canonical}]}]}
 head+=['<script type="application/ld+json">'+json.dumps(schema,ensure_ascii=False).replace('</',r'<\/')+'</script>',*styles,'<link rel="stylesheet" href="/assets/media-kolfat-2-guide/guide.css?v=20261027-1">','</head>','<body class="media-user-guide">',header,'<main id="main-content">',f'<div class="breadcrumb"><a href="/{lang}/">KOLFAT</a> / {esc(data["title"])}</div>','<article class="hero">','<p class="eyebrow">MEDIA KOLFAT 2.0</p>',f'<h1>{esc(data["title"])}</h1>',f'<p class="lead">{localized_text(data["lead"],lang)}</p>',f'<p>{localized_text(data["versionNote"],lang)}</p>',f'<aside class="notice">{localized_text(data["safety"],lang)}</aside>','</article>',f'<nav id="contents" class="guide-contents section" aria-label="{esc(data["contentsLabel"])}">',f'<h2>{esc(data["contentsLabel"])}</h2>','<ol>']
 for chapter in data['chapters']:head.append(f'<li><a href="#{chapter["id"]}">{esc(chapter["title"])}</a></li>')
 head+=['</ol></nav>']
 dimensions={item['file']:(item['width'],item['height']) for item in json.loads((ROOT/'assets'/'media-kolfat-2-guide'/'manifest.json').read_text(encoding='utf-8'))['screenshots']}
 for chapter in data['chapters']:
  head += [f'<section id="{chapter["id"]}" class="section guide-chapter">',f'<h2>{esc(chapter["title"])}</h2>',f'<p>{localized_text(chapter["intro"],lang)}</p>','<ol class="guide-steps">']
  for number,step in enumerate(chapter['steps'],1):
   image=ASSETS+'screenshots/'+step['image'];width,height=dimensions[step['image']]
   head += [f'<li id="{step["id"]}"><p><strong>{esc(data["stepLabel"])} {number}.</strong> {localized_text(step["text"],lang)}</p>','<figure>',f'<a class="guide-image-link" href="{image}" target="_blank" rel="noopener" aria-label="{esc(data["imageLinkLabel"]+": "+step["caption"])}">',f'<img src="{image}" width="{width}" height="{height}" alt="{esc(step["caption"])}" loading="lazy" decoding="async">','</a>',f'<figcaption>{localized_text(step["caption"],lang)} <a href="{image}" target="_blank" rel="noopener">{esc(data["imageLinkLabel"])}</a></figcaption>','</figure></li>']
  head+=['</ol>','<ul class="guide-notes">']+[f'<li>{localized_text(tip,lang)}</li>' for tip in chapter['tips']]+['</ul>',f'<p class="guide-outcome">{localized_text(chapter["outcome"],lang)}</p>',f'<a class="guide-back" href="#contents">{esc(data["backLabel"])}</a>','</section>']
 head+=['</main>',footer,*scripts,'</body></html>']
 target=ROOT/route(lang).strip('/')/'index.html';target.parent.mkdir(parents=True,exist_ok=True);target.write_text('\n'.join(head)+'\n',encoding='utf-8')
 return {'language':lang,'route':route(lang),'chapters':len(data['chapters']),'steps':sum(len(c['steps']) for c in data['chapters'])}

if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--languages',nargs='+',choices=LANGUAGES,default=list(LANGUAGES));args=parser.parse_args()
 print(json.dumps([render(lang) for lang in args.languages],ensure_ascii=False))
