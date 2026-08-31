const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelectorAll("img.product-logo, img.brand-logo").forEach((img) => {
  img.addEventListener("error", function () {
    const raw = (this.alt || "?").replace(/Logo\s*/i, "").trim();
    const text = raw.replace(/[^A-Za-zÀ-ú0-9]/g, " ")
      .trim()
      .split(/\s+/)
      .map((w) => w[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || raw.slice(0, 2).toUpperCase();
    const fb = document.createElement("span");
    fb.className = "img-fallback";
    fb.setAttribute("aria-label", raw);
    fb.textContent = text;
    this.parentNode.insertBefore(fb, this);
    this.remove();
  });
});

const header = document.querySelector(".site-header");
window.addEventListener("scroll", () => {
  header?.classList.toggle("scrolled", window.scrollY > 12);
}, { passive: true });

const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector(".main-nav");

navToggle?.addEventListener("click", () => {
  const open = mainNav.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(open));
});

document.querySelectorAll(".main-nav a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav?.classList.remove("is-open");
    navToggle?.setAttribute("aria-expanded", "false");
  });
});

const sections = [...document.querySelectorAll("main section[id]")];
const headerLinks = [...document.querySelectorAll(".main-nav a")];

sections.forEach((s) =>
  new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        headerLinks.forEach((l) =>
          l.classList.toggle("active", l.getAttribute("href") === `#${e.target.id}`)
        );
      });
    },
    { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
  ).observe(s)
);

if (!prefersReducedMotion) {
  const revealObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          revealObs.unobserve(e.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -24px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => revealObs.observe(el));
} else {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
}

const contactForm = document.querySelector("#contact-form");

document.querySelectorAll(".partner-cta-item[data-tipo]").forEach((item) => {
  item.addEventListener("click", () => {
    const tipo = item.dataset.tipo;
    const select = contactForm?.querySelector("[name='tipo']");
    if (!tipo || !select) return;
    const match = [...select.options].find((o) => o.text.toLowerCase() === tipo.toLowerCase());
    if (match) select.value = match.value;
  });
});

const form = contactForm;
const note = form?.querySelector(".form-note");

function showNote(msg, type = "default") {
  if (!note) return;
  note.textContent = msg;
  note.className = "form-note";
  if (type === "error") note.classList.add("is-error");
  if (type === "success") note.classList.add("is-success");
}

form?.addEventListener("submit", (e) => {
  e.preventDefault();
  const d = new FormData(form);
  const nome = d.get("nome")?.trim();
  const email = d.get("email")?.trim();
  const mensagem = d.get("mensagem")?.trim();

  if (!nome) {
    showNote("Por favor, informe seu nome.", "error");
    form.querySelector("[name='nome']")?.focus();
    return;
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showNote("Por favor, informe um e-mail válido.", "error");
    form.querySelector("[name='email']")?.focus();
    return;
  }
  if (!mensagem) {
    showNote("Por favor, escreva uma mensagem.", "error");
    form.querySelector("[name='mensagem']")?.focus();
    return;
  }

  showNote("Abrindo seu cliente de e-mail...", "success");
  const tipo = d.get("tipo") || "Contato";
  const subject = encodeURIComponent(`Contato Rafylsck Industries — ${tipo}`);
  const body = encodeURIComponent(
    [`Nome: ${nome}`, `E-mail: ${email}`, `Tipo de interesse: ${tipo}`, "", "Mensagem:", mensagem].join("\n")
  );
  window.location.href = `mailto:contato@rafylsckindustries.com.br?subject=${subject}&body=${body}`;
});
