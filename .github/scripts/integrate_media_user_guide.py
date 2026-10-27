"""Add the reviewed guide to existing Guides hubs without changing product pages."""
from pathlib import Path
import html,json,re
from build_media_user_guide import ROOT,LANGUAGES,route

TITLES={
 'en':'MEDIA KOLFAT 2.0 Complete User Guide',
 'de':'MEDIA KOLFAT 2.0 – Vollständiges Benutzerhandbuch',
 'fa':'راهنمای کامل کاربری MEDIA KOLFAT 2.0',
 'fr':'MEDIA KOLFAT 2.0 — Guide utilisateur complet',
 'es':'MEDIA KOLFAT 2.0 — Guía de usuario completa',
 'pt':'MEDIA KOLFAT 2.0 — Guia completo do utilizador',
 'it':'MEDIA KOLFAT 2.0 — Guida utente completa',
 'ja':'MEDIA KOLFAT 2.0 完全ユーザーガイド',
 'zh':'MEDIA KOLFAT 2.0 完整用户指南',
 'hi':'MEDIA KOLFAT 2.0 की संपूर्ण उपयोगकर्ता मार्गदर्शिका',
 'ru':'MEDIA KOLFAT 2.0 — Полное руководство пользователя',
 'ar':'دليل المستخدم الكامل لـ MEDIA KOLFAT 2.0',
}

for lang in LANGUAGES:
 data=json.loads((ROOT/'content/media-kolfat-2-guide'/f'{lang}.json').read_text(encoding='utf-8'))
 title=html.escape(TITLES[lang]);description=html.escape(data['description']);link=route(lang)
 hub=ROOT/('guides' if lang=='en' else f'{lang}/guides')/'index.html'
 content=hub.read_text(encoding='utf-8')
 card=f'<article class="card" id="media-kolfat-complete-guide"><h2><a href="{link}">{title}</a></h2><p>{description}</p></article>'
 if f'href="{link}"' not in content:
  marker='<div class="grid">'
  assert content.count(marker)==1,hub
  content=content.replace(marker,marker+card,1)
 else:
  pattern=r'<article class="card"(?: id="media-kolfat-complete-guide")?><h2><a href="'+re.escape(link)+r'">.*?</article>'
  content,count=re.subn(pattern,lambda _:card,content,flags=re.S)
  assert count==1,hub
 hub.write_text(content,encoding='utf-8')

sitemap=ROOT/'sitemap.xml';content=sitemap.read_text(encoding='utf-8')
for lang in LANGUAGES:
 url='https://kolfat.app'+route(lang)
 if '<loc>'+url+'</loc>' not in content:
  content=content.replace('</urlset>','  <url><loc>'+url+'</loc></url>\n</urlset>')
sitemap.write_text(content,encoding='utf-8')
print('Integrated 12 localized Guides hubs and 12 sitemap routes; product pages untouched')
