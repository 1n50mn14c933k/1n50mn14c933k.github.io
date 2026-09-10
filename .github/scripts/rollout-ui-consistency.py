from pathlib import Path
import re

LANGS={"en","fa","de","es","it","fr","pt","ja","zh","hi","ru","ar"}
STORE_URL="https://apps.microsoft.com/detail/9p0x091t7mv4?ocid=webpdpshare"
GITHUB_URL="https://github.com/1n50mn14c933k"

STORE='''<a class="store-btn" href="%s" target="_blank" rel="noopener noreferrer" aria-label="Get MEDIA KOLFAT from the Microsoft Store">
  <svg class="store-icon" viewBox="0 0 44 44" aria-hidden="true">
    <rect x="2" y="2" width="18" height="18" fill="#f25022"/>
    <rect x="24" y="2" width="18" height="18" fill="#7fba00"/>
    <rect x="2" y="24" width="18" height="18" fill="#00a4ef"/>
    <rect x="24" y="24" width="18" height="18" fill="#ffb900"/>
  </svg>
  <span class="store-copy"><small>Get MEDIA KOLFAT from</small><strong>Microsoft Store</strong></span>
</a>''' % STORE_URL

CSS='''
/* KOLFAT UI CONSISTENCY V4 */
.top-nav{position:fixed!important;top:18px!important;right:28px!important;z-index:100000!important;display:flex!important;align-items:center!important;gap:10px!important;direction:ltr!important}
.top-nav .support-top,.top-nav .github-top,.top-nav .lang-menu{position:static!important;top:auto!important;right:auto!important}
.support-top,.github-top,.lang-menu summary{height:44px!important;border:1px solid rgba(255,255,255,.48)!important;background:rgba(6,6,6,.68)!important;backdrop-filter:blur(12px)!important;-webkit-backdrop-filter:blur(12px)!important;color:#fff!important;border-radius:14px!important}
.support-top,.github-top{display:flex!important;align-items:center!important;justify-content:center!important;padding:0 16px!important;text-decoration:none!important;text-transform:uppercase!important;letter-spacing:.10em!important;font-size:.70rem!important;font-weight:700!important;white-space:nowrap!important}
.support-top:hover,.github-top:hover{background:#fff!important;color:#050505!important;border-color:#fff!important}
.lang-menu{position:relative!important;direction:ltr!important}
.lang-menu summary{list-style:none!important;min-width:68px!important;padding:0 12px!important;display:flex!important;align-items:center!important;justify-content:center!important;gap:8px!important;cursor:pointer!important}
.lang-menu summary::-webkit-details-marker{display:none!important}
.lang-menu summary::after{content:"⌄";font-size:.72rem;color:#cfcfcf;line-height:1;transform:translateY(-1px)}
.lang-list{top:52px!important;right:0!important}
.store-btn{display:flex!important;align-items:center!important;justify-content:flex-start!important;gap:16px!important;width:350px!important;max-width:100%!important;min-height:68px!important;margin-top:18px!important;padding:10px 18px!important;border:1px solid #fff!important;border-radius:10px!important;background:#fff!important;color:#050505!important;text-decoration:none!important;box-shadow:0 10px 30px rgba(0,0,0,.40)!important;transition:.22s!important;direction:ltr!important}
.store-btn:hover{background:#f4f4f4!important;color:#050505!important;transform:translateY(-1px)!important;box-shadow:0 14px 34px rgba(0,0,0,.48)!important}
.store-icon{width:40px!important;height:40px!important;flex:0 0 40px!important;display:block!important}
.store-copy{display:flex!important;flex-direction:column!important;justify-content:center!important;line-height:1.05!important;text-align:left!important;min-width:0!important}
.store-copy small{font-size:.56rem!important;letter-spacing:.13em!important;text-transform:uppercase!important;font-weight:700!important;margin-bottom:5px!important;white-space:nowrap!important;color:#111!important}
.store-copy strong{font-size:1.12rem!important;letter-spacing:.01em!important;font-weight:700!important;white-space:nowrap!important;color:#050505!important}
.store-section{width:100%;max-width:540px;margin-top:18px;padding-top:18px;border-top:1px solid rgba(255,255,255,.34)}
.store-section .store-btn{margin-top:0!important}
html[dir="rtl"] .store-section{margin-left:auto;margin-right:0}
.sources{position:relative!important;z-index:4!important;margin-bottom:0!important}
.source{color:#f2f2ee!important;opacity:1!important;visibility:visible!important;background:rgba(5,5,5,.90)!important}
.hero-copy>.sources+.store-btn{margin-top:18px!important}
@media(max-height:850px) and (min-width:981px){.store-section{margin-top:10px;padding-top:10px}.store-section .store-btn{min-height:60px!important}}
@media(max-width:640px){.top-nav{top:14px!important;right:12px!important;gap:6px!important}.support-top,.github-top{height:38px!important;padding:0 10px!important;font-size:.58rem!important}.lang-menu summary{height:38px!important;min-width:58px!important;padding:0 9px!important}.lang-list{top:44px!important}.store-btn{width:min(350px,100%)!important;min-height:64px!important;padding:9px 16px!important}.store-icon{width:36px!important;height:36px!important;flex-basis:36px!important}.store-copy small{font-size:.52rem!important}.store-copy strong{font-size:1rem!important}.store-section{max-width:100%;margin-top:14px;padding-top:14px}}
/* END KOLFAT UI CONSISTENCY V4 */
'''

store_re=re.compile(r'\s*<a class="store-btn"\b[\s\S]*?</a>\s*')
details_re=re.compile(r'<details class="lang-menu">[\s\S]*?</details>')
support_re=re.compile(r'<a class="support-top"\b[^>]*>[\s\S]*?</a>')
github_re=re.compile(r'<a class="github-top"\b[^>]*>[\s\S]*?</a>')
topnav_re=re.compile(r'<div class="top-nav">[\s\S]*?</div>')
marker_re=re.compile(r'\n?/\* KOLFAT UI CONSISTENCY V4 \*/[\s\S]*?/\* END KOLFAT UI CONSISTENCY V4 \*/\n?')
feature_re=re.compile(r'(<div class="features">\s*(?:<div class="feature"[^>]*>[\s\S]*?</div>\s*)+</div>)')
sources_re=re.compile(r'(<div class="sources">\s*(?:<div class="source"[^>]*>[\s\S]*?</div>\s*)+</div>)')

changed=[]
for p in sorted(Path('.').rglob('index.html')):
    rel=p.as_posix().lstrip('./')
    text=p.read_text(encoding='utf-8')
    original=text
    parts=Path(rel).parts
    is_home=(rel=='index.html' or (len(parts)==2 and parts[0] in LANGS and parts[1]=='index.html'))
    is_product=(len(parts)==3 and parts[0] in LANGS and parts[1]=='Media_Kolfat' and parts[2]=='index.html')

    # Normalize top navigation on every page that has a language selector.
    dm=details_re.search(text)
    if dm:
        details=dm.group(0)
        prefix=parts[0] if len(parts)>1 and parts[0] in LANGS else None
        support_href=f'/{prefix}/support/' if prefix and prefix!='en' else '/support/'
        support=f'<a class="support-top" href="{support_href}">SUPPORT</a>'
        github=f'<a class="github-top" href="{GITHUB_URL}" target="_blank" rel="noopener noreferrer">GITHUB ↗</a>'

        # Remove current nav pieces so we can rebuild one canonical control group.
        text=topnav_re.sub('',text,1)
        text=support_re.sub('',text,1)
        text=github_re.sub('',text,1)
        text=details_re.sub('',text,1)
        nav=f'<div class="top-nav">{support}{github}{details}</div>\n'
        if '<main>' in text:
            text=text.replace('<main>',nav+'<main>',1)
        elif '<main ' in text:
            text=text.replace('<main ',nav+'<main ',1)
        else:
            text=text.replace('<body>', '<body>\n'+nav,1)

    # Store changes only on home and localized product pages.
    if is_home:
        text=store_re.sub('\n',text)
        fm=feature_re.search(text)
        if not fm:
            raise RuntimeError(f'Features block not found in {rel}')
        block=fm.group(1)+'\n      <div class="store-section">\n'+STORE+'\n      </div>'
        text=text[:fm.start()]+block+text[fm.end():]
    elif is_product:
        text=store_re.sub('\n',text)
        sm=sources_re.search(text)
        if not sm:
            raise RuntimeError(f'Sources block not found in {rel}')
        block=sm.group(1)+'\n'+STORE
        text=text[:sm.start()]+block+text[sm.end():]

    text=marker_re.sub('\n',text)
    if ('class="lang-menu"' in text or 'class="store-btn"' in text) and '</style>' in text:
        idx=text.rfind('</style>')
        text=text[:idx]+CSS+text[idx:]

    if text!=original:
        p.write_text(text,encoding='utf-8')
        changed.append(rel)

homes=['index.html']+[f'{l}/index.html' for l in sorted(LANGS)]
products=[f'{l}/Media_Kolfat/index.html' for l in sorted(LANGS)]
for rel in homes:
    t=Path(rel).read_text(encoding='utf-8')
    assert t.count('class="store-btn"')==1, (rel,'store count')
    assert t.count('class="store-section"')==1, (rel,'store section')
    assert t.find('class="features"') < t.find('class="store-section"'), (rel,'store must follow features')
    assert 'class="github-top"' in t and 'class="top-nav"' in t, (rel,'top nav')
for rel in products:
    t=Path(rel).read_text(encoding='utf-8')
    assert t.count('class="store-btn"')==1, (rel,'store count')
    assert t.find('class="sources"') < t.find('class="store-btn"'), (rel,'store must follow source row')
    assert 'class="github-top"' in t and 'class="top-nav"' in t, (rel,'top nav')
    assert '.source{color:#f2f2ee!important' in t, (rel,'readability')
    assert 'background:#fff!important' in t, (rel,'white store')

print(f'changed={len(changed)}')
for rel in changed:
    print(rel)
