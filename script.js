(() => {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Nav con fondo al hacer scroll */
  const nav = document.getElementById("nav");
  const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 24);
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Menú móvil */
  const toggle = document.getElementById("nav-toggle");
  const links = document.getElementById("nav-links");
  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("open");
    toggle.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
  links.querySelectorAll("a").forEach((a) =>
    a.addEventListener("click", () => {
      links.classList.remove("open");
      toggle.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    })
  );

  /* Reveal al entrar en pantalla */
  const reveals = document.querySelectorAll(".reveal");
  if (prefersReduced) {
    reveals.forEach((el) => el.classList.add("visible"));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    reveals.forEach((el) => io.observe(el));
  }

  /* Contadores animados */
  const counters = document.querySelectorAll(".stat-num");
  const animateCount = (el) => {
    const target = parseInt(el.dataset.count, 10);
    const dur = 1400;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const co = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          if (prefersReduced) e.target.textContent = e.target.dataset.count;
          else animateCount(e.target);
          co.unobserve(e.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((el) => co.observe(el));

  /* Efecto de tecleo en el nombre */
  const typed = document.getElementById("typed-name");
  if (typed && !prefersReduced) {
    const name = typed.textContent;
    typed.textContent = "";
    const caret = document.createElement("span");
    caret.className = "caret";
    typed.after(caret);
    let i = 0;
    const type = () => {
      if (i <= name.length) {
        typed.textContent = name.slice(0, i++);
        setTimeout(type, 75);
      } else {
        setTimeout(() => caret.remove(), 2200);
      }
    };
    setTimeout(type, 500);
  }

  /* Copiar correo */
  const copyBtn = document.getElementById("copy-email");
  const EMAIL = "e.torregrosallacer@edu.gva.es";
  copyBtn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = EMAIL;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
    }
    copyBtn.textContent = "¡Copiado!";
    copyBtn.classList.add("copied");
    setTimeout(() => {
      copyBtn.textContent = "Copiar correo";
      copyBtn.classList.remove("copied");
    }, 2000);
  });

  /* Año dinámico en el footer */
  document.getElementById("year").textContent = new Date().getFullYear();
})();
