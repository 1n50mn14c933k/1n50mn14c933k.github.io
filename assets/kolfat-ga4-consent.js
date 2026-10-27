/* KOLFAT GA4: optional analytics, basic consent mode (no Google request before opt-in). */
(() => {
  "use strict";
  if (window.__kolfatGa4ConsentLoaded) return;
  window.__kolfatGa4ConsentLoaded = true;
  const MEASUREMENT_ID = "G-F14QLKP9SC";
  const STORAGE_KEY = "kolfat_ga4_consent_v1";
  const labels = {"en":{"title":"Help improve KOLFAT","body":"Optional Google Analytics helps us measure visits, page views and clicks to the Microsoft Store or GitHub releases. Analytics loads only if you accept. You can change your choice at any time.","accept":"Accept analytics","reject":"Reject optional","settings":"Privacy settings","policy":"Privacy policy"},"de":{"title":"KOLFAT verbessern","body":"Optionales Google Analytics misst Besuche, Seitenaufrufe und Klicks zum Microsoft Store oder zu GitHub-Releases. Es wird erst nach Ihrer Zustimmung geladen. Sie können Ihre Wahl jederzeit ändern.","accept":"Analyse erlauben","reject":"Optionales ablehnen","settings":"Datenschutzeinstellungen","policy":"Datenschutzerklärung"},"fa":{"title":"کمک به بهبود KOLFAT","body":"Google Analytics اختیاری، بازدیدها، نمایش صفحات و کلیک روی لینک‌های Microsoft Store و GitHub را اندازه‌گیری می‌کند. فقط با رضایت شما فعال می‌شود. هر زمان می‌توانید تصمیم خود را تغییر دهید.","accept":"پذیرش آمار","reject":"رد موارد اختیاری","settings":"تنظیمات حریم خصوصی","policy":"سیاست حریم خصوصی"},"fr":{"title":"Améliorer KOLFAT","body":"Google Analytics, facultatif, mesure les visites, les pages vues et les clics vers Microsoft Store ou les versions GitHub. Il ne se charge qu'avec votre accord. Vous pouvez changer d'avis à tout moment.","accept":"Accepter les statistiques","reject":"Refuser","settings":"Confidentialité","policy":"Politique de confidentialité"},"es":{"title":"Mejorar KOLFAT","body":"Google Analytics es opcional y mide visitas, páginas vistas y clics hacia Microsoft Store o versiones de GitHub. Solo se activa con tu consentimiento, que puedes cambiar cuando quieras.","accept":"Aceptar estadísticas","reject":"Rechazar","settings":"Privacidad","policy":"Política de privacidad"},"pt":{"title":"Melhorar o KOLFAT","body":"O Google Analytics opcional mede visitas, visualizações de páginas e cliques para a Microsoft Store ou versões no GitHub. Só é ativado com o seu consentimento, que pode alterar a qualquer momento.","accept":"Aceitar análise","reject":"Rejeitar","settings":"Privacidade","policy":"Política de privacidade"},"it":{"title":"Migliorare KOLFAT","body":"Google Analytics facoltativo misura visite, visualizzazioni delle pagine e clic verso Microsoft Store o le versioni GitHub. Si attiva solo con il tuo consenso, che puoi modificare in ogni momento.","accept":"Accetta statistiche","reject":"Rifiuta","settings":"Impostazioni privacy","policy":"Informativa privacy"},"ja":{"title":"KOLFAT の改善にご協力ください","body":"任意の Google Analytics は訪問数、ページ表示数、Microsoft Store と GitHub リリースへのクリック数を測定します。同意後にのみ読み込まれ、設定はいつでも変更できます。","accept":"解析に同意","reject":"拒否する","settings":"プライバシー設定","policy":"プライバシーポリシー"},"zh":{"title":"帮助改进 KOLFAT","body":"可选的 Google Analytics 用于统计访问量、页面浏览量以及前往 Microsoft Store 和 GitHub 发行版的点击。仅在您同意后启用，您可以随时更改选择。","accept":"同意分析","reject":"拒绝","settings":"隐私设置","policy":"隐私政策"},"hi":{"title":"KOLFAT को बेहतर बनाने में मदद करें","body":"वैकल्पिक Google Analytics विज़िट, पेज व्यू और Microsoft Store या GitHub रिलीज़ लिंक पर क्लिक मापता है। यह केवल आपकी सहमति के बाद सक्रिय होगा। आप अपनी पसंद कभी भी बदल सकते हैं।","accept":"एनालिटिक्स स्वीकार करें","reject":"अस्वीकार करें","settings":"गोपनीयता सेटिंग","policy":"गोपनीयता नीति"},"ru":{"title":"Помогите улучшить KOLFAT","body":"Необязательный Google Analytics измеряет посещения, просмотры страниц и переходы в Microsoft Store или на релизы GitHub. Он включается только после вашего согласия, которое можно изменить в любой момент.","accept":"Разрешить аналитику","reject":"Отклонить","settings":"Настройки приватности","policy":"Политика конфиденциальности"},"ar":{"title":"المساعدة في تحسين KOLFAT","body":"يقيس Google Analytics الاختياري الزيارات ومشاهدات الصفحات والنقرات على روابط Microsoft Store وإصدارات GitHub. لا يتم تفعيله إلا بعد موافقتك، ويمكنك تغيير اختيارك في أي وقت.","accept":"قبول التحليلات","reject":"رفض الاختياري","settings":"إعدادات الخصوصية","policy":"سياسة الخصوصية"}};
  const css = "\n#kf-ga-consent,#kf-ga-settings{box-sizing:border-box;font-family:Arial,\"Segoe UI\",sans-serif!important;direction:inherit;color:#f5f5f2}\n#kf-ga-consent *,#kf-ga-settings{box-sizing:border-box}\n#kf-ga-consent{position:fixed;z-index:2147483645;left:50%;bottom:12px;transform:translateX(-50%);width:min(550px,calc(100% - 24px));padding:19px 20px;background:#101010;border:1px solid rgba(255,255,255,.5);border-radius:14px;box-shadow:0 8px 48px rgba(0,0,0,.86);line-height:1.5;text-align:start}\n#kf-ga-consent strong{font-size:16px;display:block;line-height:1.3;margin:0 0 7px;color:#fff}\n#kf-ga-consent p{font-size:13px;margin:0 0 11px;color:#dedede}\n#kf-ga-consent a{font-size:12px;color:#fca66e;text-decoration:underline}\n#kf-ga-consent .kf-ga-actions{display:flex;flex-wrap:wrap;gap:9px;margin-top:15px}\n#kf-ga-consent button{flex:1 1 170px;min-height:44px;padding:9px 13px;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit}\n#kf-ga-consent .kf-ga-accept{background:#ff812e;color:#111;border:1px solid #ff812e}\n#kf-ga-consent .kf-ga-reject{background:#191919;color:#fff;border:1px solid #eee}\n#kf-ga-settings{position:fixed;z-index:2147483644;bottom:12px;left:12px;padding:7px 11px;background:#121212;color:#fff;border:1px solid #888;border-radius:8px;font-size:12px;cursor:pointer;max-width:190px}\nhtml[dir=\"rtl\"] #kf-ga-settings{bottom:76px;left:12px;right:auto}\n#kf-ga-settings:focus-visible,#kf-ga-consent button:focus-visible,#kf-ga-consent a:focus-visible{outline:3px solid #ffa763;outline-offset:2px}\n@media(max-width:500px){#kf-ga-consent{padding:15px;bottom:7px}#kf-ga-consent .kf-ga-actions{flex-direction:column}#kf-ga-consent button{flex-basis:auto;min-height:42px}#kf-ga-settings{font-size:11px}}\n";
  const locale = (document.documentElement.lang || "en").toLowerCase().split("-")[0];
  const lang = Object.prototype.hasOwnProperty.call(labels,locale) ? locale : "en";
  const t = labels[lang];
  const privacyUrl = lang === "en" ? "/privacy/" : "/" + lang + "/privacy/";
  let enabled = false;
  const readChoice = () => {
    try { return localStorage.getItem(STORAGE_KEY); } catch { return null; }
  };
  const saveChoice = (choice) => {
    try { localStorage.setItem(STORAGE_KEY, choice); } catch { /* Consent remains session-only if storage unavailable. */ }
  };
  function eraseAnalyticsCookies() {
    const names = document.cookie.split(";").map(x => x.trim().split("=")[0]);
    for (const name of names) {
      if (!/^_ga(?:_|$)/.test(name)) continue;
      for (const domain of ["", "; domain=kolfat.app", "; domain=.kolfat.app"]) {
        document.cookie = name + "=; Max-Age=0; path=/" + domain + "; SameSite=Lax";
      }
    }
  }
  function activate() {
    if (enabled) return;
    enabled = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };
    window.gtag("consent", "default", {
      analytics_storage:"denied", ad_storage:"denied",
      ad_user_data:"denied", ad_personalization:"denied"
    });
    window.gtag("consent", "update", {
      analytics_storage:"granted", ad_storage:"denied",
      ad_user_data:"denied", ad_personalization:"denied"
    });
    window.gtag("js", new Date());
    window.gtag("config", MEASUREMENT_ID, {
      allow_google_signals:false,
      allow_ad_personalization_signals:false,
      send_page_view:true
    });
    const tag = document.createElement("script");
    tag.async = true;
    tag.src = "https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(MEASUREMENT_ID);
    document.head.appendChild(tag);
    // A separate semantic event for download intentions; GA4's automatic outbound
    // click event remains enabled, but we do not duplicate the automatic "click" event.
    document.addEventListener("click", (event) => {
      const a = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!a) return;
      let url;
      try { url = new URL(a.href, location.href); } catch { return; }
      const host = url.hostname.toLowerCase();
      const path = url.pathname.toLowerCase();
      let source = "";
      if (host === "apps.microsoft.com" || (host === "www.microsoft.com" && path.includes("/store/"))) {
        source = "microsoft_store";
      } else if (host === "github.com" && /^\/1n50mn14c933k\/media_kolfat\/releases\/tag\//.test(path)) {
        source = "github_release";
      }
      if (!source || typeof window.gtag !== "function") return;
      window.gtag("event", "kolfat_download_click", {
        download_source:source,
        link_url:url.origin + url.pathname,
        page_language:lang
      });
    }, {passive:true});
  }
  function createNode(tag, className, content) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (content) el.textContent = content;
    return el;
  }
  function showPanel(settingsButton) {
    if (document.getElementById("kf-ga-consent")) return;
    settingsButton.hidden = true;
    const panel = createNode("section", "", "");
    panel.id = "kf-ga-consent";
    panel.setAttribute("role", "group");
    panel.setAttribute("aria-label", t.title);
    panel.setAttribute("dir", document.documentElement.dir === "rtl" ? "rtl" : "ltr");
    panel.appendChild(createNode("strong", "", t.title));
    panel.appendChild(createNode("p", "", t.body));
    const policy = createNode("a", "", t.policy);
    policy.href = privacyUrl;
    panel.appendChild(policy);
    const actions = createNode("div", "kf-ga-actions");
    const reject = createNode("button", "kf-ga-reject", t.reject);
    reject.type = "button";
    const accept = createNode("button", "kf-ga-accept", t.accept);
    accept.type = "button";
    const choose = (choice) => {
      saveChoice(choice);
      panel.remove();
      settingsButton.hidden = false;
      if (choice === "accepted") activate();
      else if (enabled) {
        // A loaded Google tag cannot be reliably unloaded: revoke and reload.
        window.gtag?.("consent", "update", {analytics_storage:"denied",ad_storage:"denied",ad_user_data:"denied",ad_personalization:"denied"});
        eraseAnalyticsCookies();
        location.reload();
      } else eraseAnalyticsCookies();
    };
    reject.addEventListener("click", () => choose("rejected"));
    accept.addEventListener("click", () => choose("accepted"));
    actions.append(reject, accept);
    panel.appendChild(actions);
    document.body.appendChild(panel);
    if (document.activeElement === settingsButton) reject.focus();
  }
  function init() {
    if (!document.body) return;
    const style = createNode("style");
    style.textContent = css;
    document.head.appendChild(style);
    const settings = createNode("button", "", t.settings);
    settings.id = "kf-ga-settings";
    settings.type = "button";
    settings.addEventListener("click", () => showPanel(settings));
    document.body.appendChild(settings);
    const choice = readChoice();
    if (choice === "accepted") activate();
    else {
      if (choice !== "rejected") showPanel(settings);
      eraseAnalyticsCookies();
    }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, {once:true});
  else init();
})();
