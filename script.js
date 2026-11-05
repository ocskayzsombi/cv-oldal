/* =====================================================================
   Ocskay Zsombor Máté – CV oldal szkript
   ===================================================================== */

/* ---------------------------------------------------------------------
   ⚙️  KAPCSOLATI ADATOK – ITT CSERÉLD KI A HELYŐRZŐKET!
   Minden link és az e-mail cím innen töltődik be az oldalra.
   --------------------------------------------------------------------- */
// Ha valamelyik üres (""), az a sor nem jelenik meg az oldalon.
const CONTACT = {
  github:   "https://github.com/ocskayzsombi",
  linkedin: "", // pl. "https://www.linkedin.com/in/felhasznalonev"
  email:    "zsombi.ocskay06@gmail.com",
};

/* ---------------------------------------------------------------------
   1. Kapcsolati linkek beállítása
   --------------------------------------------------------------------- */
function setupContactLinks() {
  // A profilnév megjelenítése a link utolsó részéből (pl. ".../in/nev" -> "nev")
  const handle = (url) => url.replace(/\/+$/, "").split("/").pop();

  // Egy sor beállítása; ha nincs megadva érték, a sor elrejtődik
  const setRow = (linkId, textId, href, text) => {
    const link = document.getElementById(linkId);
    if (!href) { link.hidden = true; return; }
    link.href = href;
    document.getElementById(textId).textContent = text;
  };

  setRow("linkEmail", "emailText", CONTACT.email && "mailto:" + CONTACT.email, CONTACT.email);
  setRow("linkLinkedin", "linkedinText", CONTACT.linkedin, handle(CONTACT.linkedin));
  setRow("linkGithub", "githubText", CONTACT.github, handle(CONTACT.github));

  if (!CONTACT.email) document.getElementById("copyEmail").hidden = true;
}

/* ---------------------------------------------------------------------
   2. E-mail cím másolása vágólapra
   --------------------------------------------------------------------- */
function setupCopyEmail() {
  const btn = document.getElementById("copyEmail");
  const hint = document.getElementById("copyHint");

  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(CONTACT.email);
      hint.textContent = "Másolva ✓";
    } catch (e) {
      // Ha a böngésző nem engedi (pl. file:// alatt), megnyitjuk a levelezőt
      window.location.href = "mailto:" + CONTACT.email;
    }
    setTimeout(() => (hint.textContent = "E-mail cím másolása"), 2000);
  });
}

/* ---------------------------------------------------------------------
   3. Sötét / világos mód váltó (a választás megmarad)
   --------------------------------------------------------------------- */
function setupThemeToggle() {
  const root = document.documentElement;
  document.getElementById("themeToggle").addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", next);
    try { localStorage.setItem("theme", next); } catch (e) { /* privát mód */ }
  });
}

/* ---------------------------------------------------------------------
   4. Mobil menü
   --------------------------------------------------------------------- */
function setupMobileMenu() {
  const burger = document.getElementById("navBurger");
  const links = document.getElementById("navLinks");

  const close = () => {
    links.classList.remove("is-open");
    burger.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
  };

  burger.addEventListener("click", () => {
    const open = links.classList.toggle("is-open");
    burger.classList.toggle("is-open", open);
    burger.setAttribute("aria-expanded", String(open));
  });

  // Linkre kattintva bezárul a menü
  links.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));
}

/* ---------------------------------------------------------------------
   5. Navigáció: árnyék görgetéskor + aktív menüpont kiemelése
   --------------------------------------------------------------------- */
function setupNavOnScroll() {
  const nav = document.getElementById("nav");
  const links = [...document.querySelectorAll(".nav__links a")];
  const sections = links
    .map((a) => document.querySelector(a.getAttribute("href")))
    .filter(Boolean);

  const onScroll = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 10);

    // Az utolsó olyan szekció, amelynek teteje már a képernyő felső harmada fölött van
    let current = null;
    sections.forEach((sec) => {
      if (sec.getBoundingClientRect().top < window.innerHeight * 0.35) current = sec.id;
    });
    links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + current));
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ---------------------------------------------------------------------
   6. Elemek megjelenítése görgetéskor (fade-in animáció)
   --------------------------------------------------------------------- */
function setupReveal() {
  const items = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  items.forEach((el) => observer.observe(el));
}

/* ---------------------------------------------------------------------
   Indítás
   --------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();
  setupContactLinks();
  setupCopyEmail();
  setupThemeToggle();
  setupMobileMenu();
  setupNavOnScroll();
  setupReveal();
});
