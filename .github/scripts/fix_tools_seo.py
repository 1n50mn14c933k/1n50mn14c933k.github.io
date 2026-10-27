#!/usr/bin/env python3
"""Repair static Tools SEO metadata across existing five languages; idempotent."""
from pathlib import Path
from html import escape, unescape
import re
import sys
import xml.etree.ElementTree as ET

ROOT = Path(__file__).resolve().parents[2]
LANGS = ("en", "de", "fa", "fr", "es")
CHECK = "--check" in sys.argv
META = {
"tools/index.html": ("Découvrez 48 outils gratuits de photo, fichiers, code, réseau et sécurité dans votre navigateur.", "Descubre 48 herramientas gratuitas de fotos, archivos, código, redes y seguridad desde tu navegador."),
"tools/photo-file/index.html": ("Convertissez, organisez et vérifiez vos photos et fichiers avec 12 outils gratuits pour le navigateur.", "Convierte, organiza y comprueba fotos y archivos con 12 herramientas gratuitas para el navegador."),
"tools/code-data/index.html": ("Formatez, validez et convertissez du code et des données avec 12 outils gratuits pour le navigateur.", "Formatea, valida y convierte código y datos con 12 herramientas gratuitas para el navegador."),
"tools/networking/index.html": ("Planifiez des réseaux et automatisez des tâches avec 12 outils pratiques pour le navigateur.", "Planifica redes y automatiza tareas con 12 herramientas prácticas para el navegador."),
"tools/security/index.html": ("Vérifiez du texte, générez des mots de passe et analysez des données avec 12 outils de sécurité.", "Comprueba textos, genera contraseñas y analiza datos con 12 herramientas de seguridad."),
"tools/exif-cleaner/index.html": ("Supprimez les métadonnées EXIF et GPS de vos images pour protéger votre vie privée.", "Elimina los metadatos EXIF y GPS de tus imágenes para proteger tu privacidad."),
"tools/image-compressor/index.html": ("Compressez et redimensionnez des photos directement dans votre navigateur, sans les transférer.", "Comprime y cambia el tamaño de fotos en el navegador sin subir tus archivos."),
"tools/image-converter/index.html": ("Convertissez vos images entre formats courants directement dans votre navigateur.", "Convierte imágenes entre formatos habituales directamente desde tu navegador."),
"tools/photo-date-detective/index.html": ("Examinez les dates de prise de vue et métadonnées de vos photos pour mieux les organiser.", "Examina las fechas y los metadatos de tus fotos para organizarlas mejor."),
"tools/duplicate-checker/index.html": ("Comparez vos fichiers afin d’identifier des doublons avant de les organiser.", "Compara archivos para identificar duplicados antes de organizarlos."),
"tools/batch-file-renamer/index.html": ("Préparez des noms cohérents pour plusieurs fichiers à la fois avec cet outil de renommage.", "Prepara nombres coherentes para varios archivos a la vez con esta herramienta."),
"tools/image-watermark/index.html": ("Ajoutez un filigrane personnalisé à vos photos directement dans votre navigateur.", "Añade una marca de agua personalizada a tus fotos desde el navegador."),
"tools/photo-rotator/index.html": ("Faites pivoter et recadrez vos photos dans votre navigateur avec des réglages simples.", "Gira y recorta tus fotos en el navegador con controles sencillos."),
"tools/image-to-pdf/index.html": ("Regroupez des images dans un fichier PDF sans les envoyer vers un serveur.", "Reúne imágenes en un archivo PDF sin subirlas a un servidor."),
"tools/sha256-verifier/index.html": ("Comparez des empreintes SHA-256 pour contrôler l’intégrité de vos fichiers.", "Compara hashes SHA-256 para comprobar la integridad de tus archivos."),
"tools/qr-code-generator/index.html": ("Créez des codes QR à partir de texte ou d’adresses Web directement dans votre navigateur.", "Crea códigos QR a partir de texto o direcciones web desde tu navegador."),
"tools/photo-color-palette/index.html": ("Extrayez une palette de couleurs et explorez les teintes dominantes d’une photo.", "Extrae una paleta de colores y explora los tonos dominantes de una foto."),
"tools/code-data/json-formatter/index.html": ("Validez, indentez et minifiez du JSON directement dans votre navigateur.", "Valida, formatea y minimiza JSON directamente en tu navegador."),
"tools/code-data/yaml-json-converter/index.html": ("Convertissez des données structurées entre YAML et JSON dans le navigateur.", "Convierte datos estructurados entre YAML y JSON en el navegador."),
"tools/code-data/csv-json-converter/index.html": ("Convertissez des tableaux CSV en JSON et inversement avec cet outil gratuit.", "Convierte tablas CSV a JSON y viceversa con esta herramienta gratuita."),
"tools/code-data/xml-formatter/index.html": ("Formatez et validez du XML pour rendre vos données plus faciles à lire.", "Formatea y valida XML para hacer que tus datos sean más legibles."),
"tools/code-data/base64-encoder/index.html": ("Encodez et décodez du texte en Base64 directement dans votre navigateur.", "Codifica y decodifica texto en Base64 directamente en tu navegador."),
"tools/code-data/url-encoder/index.html": ("Encodez et décodez des caractères spéciaux pour les adresses URL.", "Codifica y decodifica caracteres especiales de direcciones URL."),
"tools/code-data/regex-tester/index.html": ("Testez des expressions régulières sur des textes et examinez les correspondances.", "Prueba expresiones regulares con texto y examina las coincidencias."),
"tools/code-data/uuid-generator/index.html": ("Générez des identifiants UUID pour vos applications, tests et données.", "Genera identificadores UUID para aplicaciones, pruebas y datos."),
"tools/code-data/html-entity-converter/index.html": ("Convertissez les caractères spéciaux en entités HTML et inversement.", "Convierte caracteres especiales a entidades HTML y viceversa."),
"tools/code-data/sql-formatter/index.html": ("Mettez en forme vos requêtes SQL pour faciliter leur lecture.", "Da formato a consultas SQL para facilitar su lectura."),
"tools/code-data/markdown-preview/index.html": ("Prévisualisez le rendu de votre texte Markdown pendant la rédaction.", "Previsualiza el resultado de tu texto Markdown mientras escribes."),
"tools/code-data/json-schema-validator/index.html": ("Validez vos données JSON à l’aide d’un schéma et repérez les problèmes de structure.", "Valida datos JSON con un esquema para detectar problemas de estructura."),
"tools/networking/ipv4-subnet-calculator/index.html": ("Calculez les sous-réseaux IPv4, masques CIDR et plages d’adresses utilisables.", "Calcula subredes IPv4, máscaras CIDR y rangos de direcciones utilizables."),
"tools/networking/ipv6-prefix-calculator/index.html": ("Examinez les préfixes IPv6 et plages d’adresses pour planifier vos réseaux.", "Examina prefijos IPv6 y rangos de direcciones para planificar tus redes."),
"tools/networking/vlsm-subnet-planner/index.html": ("Planifiez des sous-réseaux IPv4 avec des masques variables grâce à VLSM.", "Planifica subredes IPv4 con máscaras variables utilizando VLSM."),
"tools/networking/ip-range-cidr-converter/index.html": ("Convertissez des plages IP en blocs CIDR et examinez leur répartition.", "Convierte rangos IP en bloques CIDR y examina su distribución."),
"tools/networking/vlan-ip-planner/index.html": ("Organisez vos VLAN et plages d’adresses IP pour documenter votre réseau.", "Organiza VLAN y rangos de direcciones IP para documentar tu red."),
"tools/networking/network-port-reference/index.html": ("Consultez les ports réseau courants et les services qui les utilisent.", "Consulta puertos de red habituales y los servicios que los utilizan."),
"tools/networking/cron-expression-builder/index.html": ("Créez des expressions cron pour planifier vos tâches automatisées.", "Crea expresiones cron para programar tareas automatizadas."),
"tools/networking/systemd-timer-builder/index.html": ("Préparez des minuteries systemd pour planifier vos tâches Linux.", "Prepara temporizadores systemd para programar tareas en Linux."),
"tools/networking/unix-timestamp-converter/index.html": ("Convertissez des horodatages Unix en dates lisibles et inversement.", "Convierte marcas de tiempo Unix a fechas legibles y viceversa."),
"tools/networking/time-zone-converter/index.html": ("Comparez des horaires entre fuseaux horaires pour coordonner vos activités.", "Compara horarios entre zonas horarias para coordinar actividades."),
"tools/networking/linux-chmod-calculator/index.html": ("Calculez les permissions chmod Linux en notation numérique et symbolique.", "Calcula permisos chmod de Linux en notación numérica y simbólica."),
"tools/networking/docker-compose-checker/index.html": ("Vérifiez la structure de fichiers YAML Docker Compose directement dans le navigateur.", "Comprueba la estructura de archivos YAML Docker Compose en el navegador."),
"tools/security/password-generator/index.html": ("Générez des mots de passe aléatoires avec longueur et types de caractères configurables.", "Genera contraseñas aleatorias con longitud y tipos de caracteres configurables."),
"tools/security/passphrase-generator/index.html": ("Créez des phrases secrètes avec des options adaptées à vos besoins.", "Crea frases de contraseña con opciones adaptadas a tus necesidades."),
"tools/security/password-strength/index.html": ("Estimez la robustesse d’un mot de passe et découvrez les facteurs importants.", "Estima la resistencia de una contraseña y descubre los factores importantes."),
"tools/security/jwt-inspector/index.html": ("Décodez un jeton JWT pour examiner ses données sans vérifier sa signature.", "Decodifica un token JWT para examinar sus datos sin verificar su firma."),
"tools/security/text-hash-generator/index.html": ("Calculez des empreintes cryptographiques de texte dans votre navigateur.", "Calcula hashes criptográficos de texto directamente en tu navegador."),
"tools/security/secret-leak-scanner/index.html": ("Recherchez des motifs pouvant révéler des secrets ou clés dans un texte.", "Busca patrones que puedan revelar secretos o claves en un texto."),
"tools/security/sensitive-text-redactor/index.html": ("Masquez les informations sensibles d’un texte avant de le partager.", "Oculta información sensible de un texto antes de compartirlo."),
"tools/security/text-code-diff/index.html": ("Comparez deux textes ou versions de code pour repérer les différences.", "Compara dos textos o versiones de código para detectar diferencias."),
"tools/security/unicode-inspector/index.html": ("Inspectez les caractères Unicode et les symboles qui se ressemblent.", "Inspecciona caracteres Unicode y símbolos visualmente parecidos."),
"tools/security/punycode-converter/index.html": ("Convertissez des domaines internationaux entre Unicode et Punycode.", "Convierte dominios internacionales entre Unicode y Punycode."),
"tools/security/url-safety-inspector/index.html": ("Examinez la structure d’une URL et repérez des éléments suspects sans ouvrir la page.", "Examina la estructura de una URL y detecta elementos sospechosos sin abrir la página."),
"tools/security/text-hex-utf8/index.html": ("Inspectez le texte, les octets hexadécimaux et les données UTF-8.", "Inspecciona texto, bytes hexadecimales y datos UTF-8."),
}
LINK_RX = re.compile(r'<link\b(?=[^>]*\brel=["\']alternate["\'])(?=[^>]*\bhreflang=["\'][^"\']+["\'])[^>]*>', re.I)
CANON_RX = re.compile(r'<link\b[^>]*\brel=["\']canonical["\'][^>]*>', re.I)
DESC_RX = re.compile(r'<meta\b[^>]*\bname=["\']description["\'][^>]*>', re.I)
OG_DESC_RX = re.compile(r'<meta\b[^>]*\bproperty=["\']og:description["\'][^>]*>', re.I)
OG_TITLE_RX = re.compile(r'<meta\b[^>]*\bproperty=["\']og:title["\'][^>]*>', re.I)
TITLE_RX = re.compile(r'<title>(.*?)</title>', re.I | re.S)

def set_meta(content, regex, tag):
    if regex.search(content):
        return regex.sub(lambda _: tag, content, count=1)
    return content.replace('</head>', tag + '</head>', 1)

def run():
    originals = sorted((ROOT / 'tools').rglob('index.html'))
    assert len(originals) == 53, ('English Tools inventory changed', len(originals))
    assert set(str(p.relative_to(ROOT)) for p in originals) == set(META), 'Translation inventory mismatch'
    sitemap = ET.parse(ROOT / 'sitemap.xml')
    ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
    locs = [e.text for e in sitemap.findall('.//s:loc', ns)]
    assert len(locs) == len(set(locs)) == 446, 'Sitemap inventory changed'
    indexed_urls = set(locs)
    pending = []
    changed = 0
    for src in originals:
        suffix = src.relative_to(ROOT).as_posix()
        pathurl = suffix.removesuffix('index.html')
        for lang in LANGS:
            page = src if lang == 'en' else ROOT / lang / suffix
            assert page.is_file(), ('Missing locale page', page)
            url = 'https://kolfat.app/' + ('' if lang == 'en' else lang + '/') + pathurl
            assert url in indexed_urls, ('Missing sitemap URL', url)
            old = page.read_text(encoding='utf-8')
            assert '</head>' in old and '</body>' in old, page
            assert re.search(r'<html\b[^>]*lang=["\']' + lang + r'["\']', old, re.I), ('Language mismatch', page)
            head = old.split('</head>', 1)[0]
            m = CANON_RX.search(head)
            assert m and len(CANON_RX.findall(head)) == 1, ('Canonical missing/duplicated', page)
            new = LINK_RX.sub('', old)
            new = CANON_RX.sub('<link rel="canonical" href="' + url + '">', new, count=1)
            links = ''.join(
                '<link rel="alternate" hreflang="' + l + '" href="https://kolfat.app/'
                + ('' if l == 'en' else l + '/') + pathurl + '">'
                for l in LANGS
            )
            links += '<link rel="alternate" hreflang="x-default" href="https://kolfat.app/' + pathurl + '">'
            if lang in ('fr', 'es'):
                title_match = TITLE_RX.search(new)
                assert title_match, ('No title', page)
                title = unescape(title_match.group(1).strip())
                index = 0 if lang == 'fr' else 1
                desc = escape(META[suffix][index], quote=True)
                og_title = escape(title, quote=True)
                assert DESC_RX.search(new), ('Description missing', page)
                new = DESC_RX.sub(lambda _: '<meta name="description" content="' + desc + '">', new, count=1)
                new = set_meta(new, OG_DESC_RX, '<meta property="og:description" content="' + desc + '">')
                new = set_meta(new, OG_TITLE_RX, '<meta property="og:title" content="' + og_title + '">')
            new = new.replace('</head>', links + '</head>', 1)
            expected_langs = [*LANGS, 'x-default']
            actual_langs = re.findall(r'<link rel="alternate" hreflang="([^"]+)"', new)
            assert actual_langs == expected_langs, ('Incorrect reciprocal alternates', page, actual_langs)
            assert '<link rel="canonical" href="' + url + '">' in new, ('Incorrect canonical', page)
            assert new.split('</head>', 1)[1] == old.split('</head>', 1)[1], ('Body changed', page)
            if new != old:
                changed += 1
                pending.append((page, new))
    if CHECK:
        assert changed == 0, ('Files need SEO regeneration', changed)
        print('PASS: 265 Tools pages, 5 reciprocal locales, 446 sitemap URLs, 106 localized FR/ES descriptions')
        return
    assert changed == 265, ('Unexpected modification count', changed)
    for page, content in pending:
        page.write_text(content, encoding='utf-8')
    doc = ROOT / 'docs/WEBSITE_UPDATES.md'
    note = (
        '\n### 2026-10-27 — Verified Tools SEO rollout\n'
        '- Updated and statically validated 265 existing Tools pages: 53 routes x en/de/fa/fr/es.\n'
        '- Canonicals remain self-referential; six reciprocal hreflang links (en, de, fa, fr, es, x-default) appear on each page.\n'
        '- Translated 53 French and 53 Spanish meta descriptions and aligned their Open Graph descriptions/titles with localized metadata.\n'
        '- Sitemap remains 446 unique existing routes. No design, scripts, tools, backgrounds or other languages changed.\n'
        '- Validation: full file and sitemap checks passed in the rollout script; the workflow runs its --check mode before committing.\n'
        '- Live Google recrawl, rankings and manual browser QA are not verified by static checks.\n'
        '- Rollback: revert the workflow bot commit that changed Tools HTML and this documentation.\n'
    )
    current = doc.read_text(encoding='utf-8')
    if '2026-10-27 — Verified Tools SEO rollout' not in current:
        doc.write_text(current.rstrip() + '\n' + note, encoding='utf-8')
    print('UPDATED: 265 Tools HTML pages, 106 French/Spanish metadata pairs, site documentation')

if __name__ == '__main__':
    run()
