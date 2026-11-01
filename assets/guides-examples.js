/* MEDIA KOLFAT Guides: language-aware, privacy-friendly illustrated examples.
 * Illustrations show sample files, not application screenshots or actual scan results.
 * Static progressive enhancement; existing article text works without JavaScript. */
(()=>{
"use strict";
const html=document.documentElement;
if(html.dataset.kolfatPage!=="guide-article")return;
const parts=location.pathname.split("/").filter(Boolean);
const slug=parts[parts.indexOf("guides")+1]||"";
const slugs=["organize-photos-by-date","organize-large-photo-library","find-duplicate-photos-safely","organize-photos-from-phone-and-usb","photo-organizer-for-windows","copy-vs-move-safely","photos-without-capture-dates","recover-interrupted-organization","understand-activity-reports"];
const idx=slugs.indexOf(slug);if(idx<0)return;
const data={
en:["Visual example","Illustrative example, not an application screenshot.","Before","Your action","After checking","Important","Try a small COPY first. Keep an independent backup and verify the results.","What should I check?","Verify a sample of the output, compare the files and check any report before removing originals.",["Date-based folders","Large library, small batches","Exact duplicates vs edited copies","Phone and USB import","Choosing a safe organizer","COPY compared with MOVE","Missing dates without guessing","Recover after an interruption","Read and verify activity reports"]],
de:["Anschauliches Beispiel","Nur eine Illustration, kein Screenshot der Anwendung.","Vorher","Ihr Schritt","Nach Prüfung","Wichtig","Zuerst eine kleine KOPIE testen. Unabhängiges Backup behalten und Ergebnisse prüfen.","Was muss ich prüfen?","Stichprobe öffnen, Dateien vergleichen und Berichte prüfen, bevor Originale entfernt werden.",["Ordner nach Aufnahmedatum","Große Bibliothek in kleinen Schritten","Identische Duplikate und bearbeitete Fotos","Import von Handy und USB","Sicheren Foto-Organizer auswählen","COPY und MOVE im Vergleich","Fehlende Daten ohne Raten","Nach Unterbrechung wiederherstellen","Aktivitätsberichte verstehen"]],
es:["Ejemplo visual","Esquema ilustrativo, no una captura de la aplicación.","Antes","Tu acción","Después de verificar","Importante","Empieza con una COPIA pequeña. Conserva una copia de seguridad independiente y revisa el resultado.","¿Qué debo comprobar?","Abre una muestra del resultado, compara los archivos y revisa los informes antes de retirar originales.",["Carpetas por fecha","Biblioteca grande en lotes pequeños","Duplicados exactos frente a ediciones","Importar desde móvil y USB","Elegir un organizador seguro","Comparar COPY y MOVE","Fechas desconocidas sin inventarlas","Recuperarse tras una interrupción","Entender los informes de actividad"]],
fa:["نمونهٔ تصویری","فقط یک تصویر آموزشی است، نه تصویر واقعی برنامه.","پیش از کار","اقدام شما","بعد از بررسی","مهم","ابتدا COPY را با مجموعه‌ای کوچک امتحان کنید. پشتیبان مستقل را نگه دارید و خروجی را بررسی کنید.","چه چیزی را بررسی کنم؟","چند فایل خروجی را باز کنید، مقایسه انجام دهید و پیش از حذف نسخهٔ اصلی گزارش‌ها را ببینید.",["پوشه‌بندی بر اساس تاریخ","کتابخانهٔ بزرگ در دسته‌های کوچک","تکراری‌های دقیق در برابر نسخه‌های ویرایش‌شده","ورود عکس از تلفن و USB","انتخاب ابزار مرتب‌سازی امن","مقایسهٔ COPY و MOVE","تاریخ‌های نامعلوم بدون حدس","بازیابی پس از وقفه","بررسی گزارش فعالیت"]],
ar:["مثال مرئي","رسم توضيحي فقط، وليس لقطة من التطبيق.","قبل البدء","خطوتك","بعد التحقق","مهم","ابدأ بنسخ مجموعة صغيرة عبر COPY. احتفظ بنسخة احتياطية مستقلة وراجع النتائج.","ماذا ينبغي أن أتحقق منه؟","افتح عينة من النتائج وقارن الملفات وراجع التقارير قبل إزالة أي ملفات أصلية.",["مجلدات حسب التاريخ","مكتبة كبيرة على دفعات صغيرة","التطابق التام مقابل الصور المعدلة","استيراد الهاتف وUSB","اختيار منظّم آمن","مقارنة COPY وMOVE","تواريخ مفقودة دون تخمين","التعافي بعد انقطاع","فهم تقارير النشاط"]],
fr:["Exemple visuel","Schéma illustratif, pas une capture d'écran du logiciel.","Avant","Votre action","Après vérification","Important","Commencez par un petit test en COPY. Gardez une sauvegarde indépendante et contrôlez les résultats.","Que faut-il vérifier ?","Ouvrez quelques fichiers, comparez-les et consultez les rapports avant de supprimer des originaux.",["Dossiers par date","Grande bibliothèque par petits lots","Doublons exacts et versions modifiées","Importer depuis téléphone et USB","Choisir un outil sûr","COPY et MOVE comparés","Dates absentes sans supposition","Reprendre après une interruption","Comprendre les rapports d'activité"]],
it:["Esempio visivo","Schema illustrativo, non uno screenshot dell'app.","Prima","La tua azione","Dopo la verifica","Importante","Prova prima una piccola operazione COPY. Conserva un backup indipendente e verifica i risultati.","Cosa devo controllare?","Apri alcuni file in uscita, confrontali e leggi i report prima di rimuovere gli originali.",["Cartelle per data","Grande libreria in piccoli lotti","Duplicati identici e versioni modificate","Importazione da telefono e USB","Scegliere un organizer sicuro","COPY e MOVE a confronto","Date mancanti senza inventarle","Riprendere dopo un'interruzione","Leggere i report delle attività"]],
pt:["Exemplo visual","Esquema ilustrativo, não uma captura da aplicação.","Antes","A sua ação","Depois de verificar","Importante","Comece com uma pequena operação COPY. Guarde um backup independente e confirme os resultados.","O que devo verificar?","Abra alguns ficheiros de saída, compare-os e consulte os relatórios antes de remover originais.",["Pastas por data","Biblioteca grande em pequenos lotes","Duplicados exatos e versões editadas","Importação de telefone e USB","Escolher um organizador seguro","COPY versus MOVE","Datas desconhecidas sem adivinhar","Recuperar após interrupção","Compreender relatórios de atividade"]],
hi:["चित्रों के साथ उदाहरण","सिर्फ़ समझाने वाला उदाहरण, ऐप का स्क्रीनशॉट नहीं।","पहले","आपका कदम","जाँच के बाद","महत्वपूर्ण","पहले छोटी मात्रा में COPY करें। स्वतंत्र बैकअप रखें और परिणाम सत्यापित करें।","क्या जाँचें?","कुछ आउटपुट फ़ाइलें खोलें, तुलना करें और मूल फ़ाइलें हटाने से पहले रिपोर्ट पढ़ें।",["तारीख़ के अनुसार फ़ोल्डर","बड़ी लाइब्रेरी, छोटे बैच","सटीक डुप्लिकेट बनाम संपादित फोटो","फ़ोन और USB से आयात","सुरक्षित आयोजक चुनें","COPY और MOVE की तुलना","गायब तारीख़ें बिना अनुमान","रुकावट के बाद रिकवरी","गतिविधि रिपोर्ट की जाँच"]],
ja:["図解例","説明用の図です。実際のアプリ画面ではありません。","作業前","操作","確認後","重要","最初は少量を COPY してください。独立したバックアップを残し、結果を確認してください。","何を確認する？","出力ファイルの一部を開き、比較して報告を確認してから元ファイルの整理を検討してください。",["撮影日別フォルダー","大きなライブラリーを小分けに","完全一致と編集済み写真","スマホと USB から取り込み","安全な整理ソフトの選択","COPY と MOVE の比較","不明な日付を推測しない","中断後の復旧","アクティビティ報告の確認"]],
ru:["Наглядный пример","Иллюстрация, а не снимок экрана приложения.","До","Ваш шаг","После проверки","Важно","Сначала выполните небольшую операцию COPY. Сохраните независимую резервную копию и проверьте результат.","Что проверить?","Откройте несколько файлов, сравните их и изучите отчёты перед удалением оригиналов.",["Папки по датам","Большая библиотека небольшими партиями","Точные дубликаты и отредактированные фото","Импорт с телефона и USB","Выбор безопасного органайзера","Сравнение COPY и MOVE","Пропущенные даты без догадок","Восстановление после прерывания","Чтение отчётов о действиях"]],
zh:["图解示例","仅用于说明，不是真实应用截图。","操作前","操作步骤","检查后","重要","请先少量执行 COPY。保留独立备份并核查结果。","应该检查什么？","打开部分输出文件、比对文件并查看报告，再决定是否移除原文件。",["按日期建立文件夹","大型媒体库分批处理","完全重复与已编辑照片","从手机和 USB 导入","选择安全的整理工具","COPY 与 MOVE 对比","未知日期不猜测","中断后的恢复","阅读活动报告"]]
};
const lang=(html.lang||"en").split("-")[0],d=data[lang]||data.en;
const examples=[
["Camera/DCIM/IMG_0001.jpg\nCamera/DCIM/IMG_0002.jpg","Copy by verified capture date","Library/2024/07/IMG_0001.jpg\nLibrary/Unknown_Date/IMG_0002.jpg"],
["Phone/2024/  Camera/  Old_USB/","Batch A → check → Batch B","Organized/2024/  Reports/  Backup/"],
["IMG_A.jpg  hash: 8F2…\nIMG_B.jpg  hash: 8F2…\nIMG_EDIT.jpg  hash: A41…","Review exact SHA-256 matches","A & B: identical bytes\nEDIT: not an exact duplicate"],
["Phone/DCIM/  USB/  Cloud_export/","Copy to local staging folder","Verified_Library/\nOriginal_devices_untouched/"],
["Privacy?  COPY?  Reports?","Compare features + test sample","Transparent folders + verified output"],
["Originals/photo.jpg","COPY → separate output\nMOVE → explicit Windows Advanced only","COPY: original stays\nMOVE: source location changes"],
["Screenshot.png  EXIF: none\nEdited.jpg  clock: uncertain","Review source and camera metadata","Unknown_Date/  (do not invent a capture date)"],
["Source/  Output/  Interrupted_job/","Inspect Activity + output; resume only when safely offered","Verified files / preserved originals / report"],
["Source: 15 samples\nDestination: 14 + 1 exception","Read operations, errors and verify output","Open sample files; investigate exception"]
];
function node(tag,cls,txt){const e=document.createElement(tag);if(cls)e.className=cls;if(txt!==undefined)e.textContent=txt;return e}
function setup(){
 const main=document.querySelector("main"),hero=main?.querySelector(":scope > .hero");
 if(!hero||main.querySelector(".kf-guide-example"))return;
 const wrap=node("section","kf-guide-example");wrap.setAttribute("aria-label",d[0]);
 const title=node("h2","",d[0]+": "+d[9][idx]);const note=node("p","kf-guide-example-caption",d[1]);
 const row=node("div","kf-guide-example-grid");
 const record=examples[idx];
 for(let j=0;j<3;j++){
  const card=node("div","kf-guide-example-card");
  card.append(node("span","kf-example-index",String(j+1).padStart(2,"0")));
  card.append(node("h3","",[d[2],d[3],d[4]][j]));
  const content=node("pre","kf-example-content",record[j]);content.setAttribute("dir","ltr");
  card.append(content);row.append(card);
 }
 const caution=node("div","kf-guide-example-caution");caution.append(node("strong","",d[5]),node("p","",d[6]));
 const faq=node("details","kf-guide-example-faq");faq.append(node("summary","",d[7]),node("p","",d[8]));
 wrap.append(title,note,row,caution,faq);hero.after(wrap);
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",setup,{once:true});else setup();
})();