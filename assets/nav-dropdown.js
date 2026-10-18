/* Keep the KOLFAT menu and language chooser mutually exclusive. */
(() => {
  const init = () => {
    const menus = Array.from(document.querySelectorAll(".kolfat-menu, .lang-menu"));
    if (!menus.length) return;
    menus.forEach(menu => menu.addEventListener("toggle", () => {
      if (menu.open) menus.filter(other => other !== menu).forEach(other => other.open = false);
    }));
    document.addEventListener("pointerdown", event => {
      menus.forEach(menu => {
        if (menu.open && !menu.contains(event.target)) menu.open = false;
      });
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape") {
        const openMenu = menus.find(menu => menu.open);
        if (openMenu) {
          openMenu.open = false;
          openMenu.querySelector("summary")?.focus();
        }
      }
    });
  };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, {once:true});
  else init();
})();
