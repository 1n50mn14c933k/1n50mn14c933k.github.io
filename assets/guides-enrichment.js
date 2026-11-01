/* MEDIA KOLFAT guides enhancement, 2026-11-01.
   Original CSS diagrams (not fabricated UI screenshots). Progressive enhancement:
   the actual translated guide text and links remain available without JavaScript. */
(()=>{
"use strict";
const root=document.documentElement;
if(root.dataset.kolfatPage!=="guide-article")return;
const lang=(root.lang||"en").split("-")[0];
const dictionary={
en:["Visual walkthrough","A simple picture of the workflow. This is an illustration, not an app screenshot.","Your safe-finish checklist","Tick each item after you have completed it. Nothing is uploaded or stored.","Originals protected","Small sample checked","Destination verified","Illustrative workflow","Next: keep learning","Copy first","Review results","Only then clean up","Safety reminder: organization is not a backup."],
de:["Visueller Ablauf","Veranschaulichung der Schritte, kein Screenshot der Anwendung.","Checkliste für einen sicheren Abschluss","Haken Sie erledigte Punkte ab. Nichts wird gespeichert oder hochgeladen.","Originale geschützt","Stichprobe geprüft","Zielordner kontrolliert","Beispielhafter Ablauf","Weitere Anleitungen","Zuerst kopieren","Ergebnisse prüfen","Erst dann bereinigen","Wichtig: Organisation ersetzt keine Sicherung."],
es:["Guía visual","Representación del proceso, no una captura de la aplicación.","Lista de verificación final","Marca las tareas realizadas. No se guarda ni envía información.","Originales protegidos","Muestra comprobada","Destino verificado","Proceso ilustrativo","Sigue aprendiendo","Copiar primero","Revisar resultados","Limpiar después","Recuerda: organizar no sustituye una copia de seguridad."],
fa:["راهنمای تصویری","این یک نمودار آموزشی است، نه تصویر واقعی برنامه.","چک‌لیست پایان امن","پس از انجام هر کار علامت بزنید. هیچ اطلاعاتی ذخیره یا ارسال نمی‌شود.","اصل فایل‌ها محفوظ است","نمونهٔ کوچک بررسی شده","مقصد تأیید شده","نمونهٔ تصویری روند","راهنماهای بیشتر","اول کپی کنید","نتیجه را بررسی کنید","بعد پاک‌سازی کنید","یادآوری: مرتب‌سازی جای پشتیبان‌گیری را نمی‌گیرد."],
ar:["دليل مرئي","رسم توضيحي للعملية وليس لقطة شاشة من التطبيق.","قائمة التحقق النهائية","ضع علامة عند إكمال كل مهمة. لا تُحفظ البيانات ولا تُرفع.","حماية الملفات الأصلية","اختبار عينة صغيرة","التحقق من الوجهة","مخطط توضيحي","أدلة إضافية","انسخ أولًا","راجع النتائج","نظّف بعد ذلك","تذكير: تنظيم الملفات لا يغني عن النسخ الاحتياطي."],
fr:["Parcours visuel","Schéma explicatif du processus, pas une capture d'écran du logiciel.","Liste de contrôle finale","Cochez les étapes réalisées. Aucune donnée n'est enregistrée ni envoyée.","Originaux protégés","Échantillon contrôlé","Destination vérifiée","Schéma illustratif","Autres guides","Copier d'abord","Examiner les résultats","Nettoyer ensuite","Rappel : le classement ne remplace pas une sauvegarde."],
it:["Percorso visivo","Schema illustrativo del processo, non schermata dell'applicazione.","Lista di controllo finale","Spunta i punti completati. Nessun dato viene salvato o inviato.","Originali protetti","Campione verificato","Destinazione controllata","Schema illustrativo","Altre guide","Prima copia","Controlla i risultati","Poi pulisci","Ricorda: organizzare non equivale a fare un backup."],
pt:["Percurso visual","Diagrama ilustrativo, não uma captura de ecrã da aplicação.","Lista de verificação final","Assinale os pontos concluídos. Nenhum dado é guardado ou enviado.","Originais protegidos","Amostra verificada","Destino confirmado","Esquema ilustrativo","Mais guias","Copiar primeiro","Rever resultados","Só depois limpar","Lembre-se: organização não substitui a cópia de segurança."],
hi:["दृश्य मार्गदर्शिका","यह प्रक्रिया का चित्र है, ऐप का वास्तविक स्क्रीनशॉट नहीं।","सुरक्षित समाप्ति सूची","पूरा होने पर टिक करें। कुछ भी सहेजा या अपलोड नहीं होता।","मूल फ़ाइलें सुरक्षित","छोटा नमूना जाँचा","गंतव्य सत्यापित","उदाहरण चित्र","अगली मार्गदर्शिकाएँ","पहले कॉपी करें","नतीजे जाँचें","फिर सफ़ाई करें","याद रखें: व्यवस्थित करना बैकअप नहीं है।"],
ja:["図解ガイド","手順を示した説明図であり、アプリのスクリーンショットではありません。","完了チェックリスト","確認した項目にチェックしてください。データは保存・送信されません。","元ファイルを保護","少量のサンプルを確認","保存先を検証","手順のイメージ","ほかのガイド","まずコピー","結果を確認","その後に整理","注意：ファイル整理はバックアップの代わりではありません。"],
ru:["Наглядная схема","Это иллюстрация рабочего процесса, а не снимок экрана программы.","Контрольный список","Отмечайте выполненные пункты. Ничего не сохраняется и не отправляется.","Оригиналы защищены","Пробный набор проверен","Папка назначения проверена","Пример процесса","Другие руководства","Сначала копия","Проверка результата","Затем очистка","Помните: организация файлов не заменяет резервное копирование."],
zh:["可视化流程","这是操作流程示意图，并非应用程序的真实截图。","完成检查清单","完成后勾选。不会保存或上传任何数据。","原始文件已保护","小批量测试已检查","目标文件夹已核实","示意流程","继续阅读","先复制","检查结果","最后清理","提醒：文件整理不能代替备份。"]
};
const t=dictionary[lang]||dictionary.en;
const slug=location.pathname.split("/").filter(Boolean).slice(-1)[0];
const kind={
"recover-interrupted-organization":"recover",
"understand-activity-reports":"reports",
"organize-photos-by-date":"date",
"organize-large-photo-library":"large",
"find-duplicate-photos-safely":"duplicate",
"organize-photos-from-phone-and-usb":"sources",
"photo-organizer-for-windows":"choose",
"copy-vs-move-safely":"choose",
"photos-without-capture-dates":"date"
}[slug];
if(!kind)return;
const main=document.querySelector("main"),hero=main?.querySelector(":scope > .hero");
if(!main||!hero)return;
const graph=document.createElement("section");
graph.className="kf-guide-workflow-visual";
graph.setAttribute("aria-label",t[0]);
const h=document.createElement("h2");h.textContent=t[0];
const p=document.createElement("p");p.textContent=t[1];
const layout=document.createElement("div");layout.className="kf-workflow-canvas";
const themes={
date:{icons:["calendar","folder","check"],labels:["2024 / 06","2025 / 11","2026 / 01"],sub:[t[9],t[10],t[11]]},
large:{icons:["devices","copy","folder"],labels:["Small batch","Verified copy","Full library"],sub:[t[9],t[10],t[11]]},
duplicate:{icons:["hash","equal","shield"],labels:["SHA-256","Exact match","Review first"],sub:[t[9],t[10],t[11]]},
sources:{icons:["devices","copy","folder"],labels:["Phone + USB","Separate intake","One library"],sub:[t[9],t[10],t[11]]},
choose:{icons:["shield","folder","check"],labels:["Local files","COPY first","Clear reports"],sub:[t[9],t[10],t[11]]},
recover:{icons:["shield","copy","check"],labels:["Check interruption","Inspect copies","Resume if offered"],sub:[t[9],t[10],t[11]]},
reports:{icons:["folder","hash","check"],labels:["Read report","Investigate errors","Verify files"],sub:[t[9],t[10],t[11]]}
};
const translatedLabels={"en":{"large":["Small batch","Verified copy","Full library"],"duplicate":["SHA-256","Exact match","Review first"],"sources":["Phone + USB","Separate intake","One library"],"choose":["Local files","COPY first","Clear reports"],"recover":["Check interruption","Inspect copies","Resume if offered"],"reports":["Read report","Investigate errors","Verify files"]},"de":{"large":["Kleine Auswahl","Kopie geprüft","Gesamte Bibliothek"],"duplicate":["SHA-256","Identische Datei","Zuerst prüfen"],"sources":["Handy + USB","Getrennter Import","Eine Bibliothek"],"choose":["Lokale Dateien","Zuerst COPY","Klare Berichte"],"recover":["Unterbrechung prüfen","Kopien kontrollieren","Falls möglich fortsetzen"],"reports":["Bericht lesen","Fehler untersuchen","Dateien prüfen"]},"es":{"large":["Lote pequeño","Copia verificada","Toda la biblioteca"],"duplicate":["SHA-256","Coincidencia exacta","Revisar primero"],"sources":["Móvil + USB","Importación separada","Una biblioteca"],"choose":["Archivos locales","Primero COPY","Informes claros"],"recover":["Revisar interrupción","Comprobar copias","Reanudar si se ofrece"],"reports":["Leer informe","Investigar errores","Verificar archivos"]},"fa":{"large":["دستهٔ کوچک","کپی تأییدشده","کل کتابخانه"],"duplicate":["SHA-256","تطابق دقیق","اول بررسی کنید"],"sources":["تلفن و USB","ورودی جداگانه","یک کتابخانه"],"choose":["فایل‌های محلی","ابتدا COPY","گزارش‌های روشن"],"recover":["بررسی وقفه","بازبینی کپی‌ها","ادامه فقط در صورت امکان"],"reports":["خواندن گزارش","بررسی خطاها","تأیید فایل‌ها"]},"ar":{"large":["دفعة صغيرة","نسخة تم التحقق منها","المكتبة الكاملة"],"duplicate":["SHA-256","تطابق تام","راجع أولاً"],"sources":["الهاتف و USB","استيراد منفصل","مكتبة واحدة"],"choose":["ملفات محلية","ابدأ بـ COPY","تقارير واضحة"],"recover":["افحص الانقطاع","راجع النسخ","استأنف إن كان متاحاً"],"reports":["اقرأ التقرير","حقق في الأخطاء","تحقق من الملفات"]},"fr":{"large":["Petit lot","Copie vérifiée","Bibliothèque complète"],"duplicate":["SHA-256","Copie identique","Examiner d'abord"],"sources":["Téléphone + USB","Import séparé","Une seule bibliothèque"],"choose":["Fichiers locaux","COPY en premier","Rapports clairs"],"recover":["Examiner l'arrêt","Contrôler les copies","Reprendre si proposé"],"reports":["Lire le rapport","Analyser les erreurs","Vérifier les fichiers"]},"it":{"large":["Piccolo lotto","Copia verificata","Libreria completa"],"duplicate":["SHA-256","File identico","Prima verificare"],"sources":["Telefono + USB","Import separato","Una libreria"],"choose":["File locali","Prima COPY","Report chiari"],"recover":["Esamina l'interruzione","Controlla le copie","Riprendi se disponibile"],"reports":["Leggi il rapporto","Esamina gli errori","Verifica i file"]},"pt":{"large":["Pequeno lote","Cópia verificada","Biblioteca completa"],"duplicate":["SHA-256","Cópia idêntica","Rever primeiro"],"sources":["Telemóvel + USB","Importação separada","Uma biblioteca"],"choose":["Ficheiros locais","Primeiro COPY","Relatórios claros"],"recover":["Verificar interrupção","Conferir cópias","Retomar se disponível"],"reports":["Ler relatório","Investigar erros","Verificar ficheiros"]},"hi":{"large":["छोटा बैच","सत्यापित कॉपी","पूरी लाइब्रेरी"],"duplicate":["SHA-256","बिल्कुल एक जैसी फ़ाइल","पहले समीक्षा करें"],"sources":["फ़ोन + USB","अलग आयात","एक लाइब्रेरी"],"choose":["स्थानीय फ़ाइलें","पहले COPY","स्पष्ट रिपोर्ट"],"recover":["रुकावट जाँचें","कॉपी जाँचें","विकल्प मिलने पर Resume"],"reports":["रिपोर्ट पढ़ें","त्रुटियाँ जाँचें","फ़ाइलें सत्यापित करें"]},"ja":{"large":["少量ずつ","コピーを検証","ライブラリー全体"],"duplicate":["SHA-256","完全一致","まず確認"],"sources":["スマホ + USB","個別に取り込み","ひとつのライブラリー"],"choose":["ローカルファイル","まず COPY","明確なレポート"],"recover":["中断を調べる","コピーを確認","利用可能な場合のみ再開"],"reports":["報告を読む","エラーを調査","ファイルを検証"]},"ru":{"large":["Небольшой набор","Копия проверена","Вся библиотека"],"duplicate":["SHA-256","Полное совпадение","Сначала проверка"],"sources":["Телефон + USB","Отдельный импорт","Одна библиотека"],"choose":["Локальные файлы","Сначала COPY","Понятные отчёты"],"recover":["Проверить прерывание","Проверить копии","Возобновить, если доступно"],"reports":["Прочитать отчёт","Разобрать ошибки","Проверить файлы"]},"zh":{"large":["小批量","已验证的副本","完整媒体库"],"duplicate":["SHA-256","完全相同","先检查"],"sources":["手机 + USB","分开导入","统一媒体库"],"choose":["本地文件","先执行 COPY","清晰报告"],"recover":["检查中断原因","核查副本","仅在支持时恢复"],"reports":["阅读报告","调查错误","验证文件"]}};
const conf=themes[kind];
conf.labels=translatedLabels[lang]?.[kind]||conf.labels;
const symbol={
calendar:'<rect x="4" y="6" width="16" height="15" rx="2"/><path d="M8 3v6M16 3v6M4 11h16"/>',
folder:'<path d="M2 6h8l2 3h10v11H2Z"/><path d="M7 14h10"/>',
check:'<circle cx="12" cy="12" r="9"/><path d="m7 12 3 3 7-7"/>',
copy:'<rect x="7" y="7" width="13" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h2"/>',
devices:'<rect x="3" y="6" width="14" height="11" rx="2"/><path d="M7 20h10M19 9h3v11h-3z"/>',
hash:'<path d="M9 3 6 21M17 3l-3 18M3 9h18M2 16h18"/>',
equal:'<path d="M4 9h16M4 15h16"/>',
shield:'<path d="m12 2 9 4v6c0 5-3.5 8.2-9 10-5.5-1.8-9-5-9-10V6Z"/><path d="m8 12 3 3 5-6"/>'
};
for(let i=0;i<3;i++){
 const step=document.createElement("div");step.className="kf-workflow-node";
 const icon=document.createElement("span");icon.className="kf-workflow-icon";icon.setAttribute("aria-hidden","true");
 icon.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+symbol[conf.icons[i]]+'</svg>';
 const label=document.createElement("strong");label.textContent=conf.labels[i];
 const small=document.createElement("small");small.textContent=conf.sub[i];
 step.append(icon,label,small);layout.append(step);
 if(i<2){const arrow=document.createElement("span");arrow.className="kf-workflow-arrow";arrow.textContent=root.dir==="rtl"?"←":"→";arrow.setAttribute("aria-hidden","true");layout.append(arrow);}
}
const caption=document.createElement("p");caption.className="kf-workflow-caption";caption.textContent=t[7];
graph.append(h,p,layout,caption);hero.after(graph);
const sections=[...main.querySelectorAll(":scope > section.section")];
if(sections.length>0){
 const checklist=document.createElement("section");checklist.className="kf-guide-checklist";checklist.setAttribute("aria-label",t[2]);
 const ch=document.createElement("h2");ch.textContent=t[2];
 const info=document.createElement("p");info.textContent=t[3];
 const inputs=document.createElement("div");inputs.className="kf-guide-checklist-items";
 for(let i=4;i<=6;i++){
   const item=document.createElement("label");item.className="kf-guide-checklist-item";
   const check=document.createElement("input");check.type="checkbox";check.name="guide-check-"+i;
   const label=document.createElement("span");label.textContent=t[i];
   item.append(check,label);inputs.append(item);
 }
 const reminder=document.createElement("p");reminder.className="kf-guide-checklist-warning";reminder.textContent=t[12];
 checklist.append(ch,info,inputs,reminder);
 const last=sections.at(-1);last.before(checklist);
}
})();