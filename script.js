/* =========================================================
   K&E Digital Solutions — Lógica
   ========================================================= */

/* ---------------------------------------------------------
   1) CONFIGURACIÓN — edita estos datos
   --------------------------------------------------------- */
const CONFIG = {
  // Número con código de país y sin signos. Costa Rica = 506
  whatsapp: "50600000000",
  email: "contacto@kedigitalsolutions.com",
};

/* ---------------------------------------------------------
   2) TRABAJOS / EMPRESAS QUE CONFIARON EN TI
   ---------------------------------------------------------
   Reemplaza estos ejemplos por tus clientes reales.
   Campos:
     nombre      → nombre del negocio
     categoria   → "Página web" | "Menú digital" | "Automatización"
     descripcion → qué hiciste para ellos
     imagen      → (opcional) ruta a una captura, ej: "img/cliente1.jpg"
     enlace      → (opcional) URL del proyecto en línea
   --------------------------------------------------------- */
const TRABAJOS = [
  {
    nombre: "Nombre del negocio 1",
    categoria: "Menú digital",
    descripcion: "Menú digital con QR para mesas, con categorías, fotos y precios fáciles de actualizar.",
    imagen: "",
    enlace: "",
  },
  {
    nombre: "Nombre del negocio 2",
    categoria: "Página web",
    descripcion: "Sitio web moderno que presenta los servicios del negocio y facilita el contacto con clientes.",
    imagen: "",
    enlace: "",
  },
  {
    nombre: "Nombre del negocio 3",
    categoria: "Automatización",
    descripcion: "Automatización de pedidos y respuestas para ahorrar tiempo en la gestión diaria.",
    imagen: "",
    enlace: "",
  },
];

/* ---------------------------------------------------------
   3) HELPERS
   --------------------------------------------------------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

const waLink = (text = "") =>
  `https://wa.me/${CONFIG.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ""}`;

const initials = (name) =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");

const escapeHTML = (str) =>
  String(str).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------------------------------------------------------
   4) HEADER + MENÚ MÓVIL
   --------------------------------------------------------- */
const header = $("#header");
const burger = $("#burger");
const menu = $("#menu");

const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 30);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

const closeMenu = () => {
  menu.classList.remove("is-open");
  burger.classList.remove("is-open");
  burger.setAttribute("aria-expanded", "false");
};

burger.addEventListener("click", () => {
  const open = menu.classList.toggle("is-open");
  burger.classList.toggle("is-open", open);
  burger.setAttribute("aria-expanded", String(open));
});
$$("a", menu).forEach((a) => a.addEventListener("click", closeMenu));

/* ---------------------------------------------------------
   5) PORTAFOLIO CON FILTROS
   --------------------------------------------------------- */
const worksEl = $("#works");
const filtersEl = $("#filters");

function renderFilters() {
  const cats = ["Todos", ...new Set(TRABAJOS.map((t) => t.categoria))];
  filtersEl.innerHTML = cats
    .map(
      (c, i) =>
        `<button class="filter${i === 0 ? " is-active" : ""}" data-cat="${escapeHTML(c)}" role="tab">${escapeHTML(c)}</button>`
    )
    .join("");
}

function renderWorks(cat = "Todos") {
  const list = cat === "Todos" ? TRABAJOS : TRABAJOS.filter((t) => t.categoria === cat);

  worksEl.innerHTML = list
    .map((t, i) => {
      const media = t.imagen
        ? `<img src="${escapeHTML(t.imagen)}" alt="Trabajo realizado para ${escapeHTML(t.nombre)}" loading="lazy" />`
        : `<span class="work__initials">${escapeHTML(initials(t.nombre))}</span>`;

      const link = t.enlace
        ? `<a class="work__link" href="${escapeHTML(t.enlace)}" target="_blank" rel="noopener">Ver proyecto</a>`
        : "";

      return `
        <article class="work" style="animation-delay:${i * 80}ms">
          <div class="work__media">
            ${media}
            <span class="work__badge">${escapeHTML(t.categoria)}</span>
          </div>
          <div class="work__body">
            <h3>${escapeHTML(t.nombre)}</h3>
            <p>${escapeHTML(t.descripcion)}</p>
            ${link}
          </div>
        </article>`;
    })
    .join("");
}

filtersEl.addEventListener("click", (e) => {
  const btn = e.target.closest(".filter");
  if (!btn) return;
  $$(".filter", filtersEl).forEach((b) => b.classList.toggle("is-active", b === btn));
  renderWorks(btn.dataset.cat);
});

renderFilters();
renderWorks();

/* ---------------------------------------------------------
   6) ANIMACIÓN AL HACER SCROLL
   --------------------------------------------------------- */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);
$$(".reveal").forEach((el, i) => {
  el.style.transitionDelay = `${(i % 4) * 90}ms`;
  revealObserver.observe(el);
});

/* ---------------------------------------------------------
   7) CONTACTO → WHATSAPP
   --------------------------------------------------------- */
$("#waDirect").href = waLink("Hola, me gustaría información sobre los servicios de K&E Digital Solutions.");
$("#waFloat").href = waLink("Hola, me gustaría información sobre los servicios de K&E Digital Solutions.");
$("#mailDirect").href = `mailto:${CONFIG.email}`;

const form = $("#contactForm");
const note = $("#formNote");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const data = Object.fromEntries(new FormData(form));
  const required = [form.nombre, form.servicio];
  let valid = true;

  required.forEach((field) => {
    const empty = !field.value.trim();
    field.classList.toggle("is-invalid", empty);
    if (empty) valid = false;
  });

  if (!valid) {
    note.textContent = "Por favor completa tu nombre y el servicio que te interesa.";
    return;
  }

  const mensaje = [
    "Hola K&E Digital Solutions 👋",
    `Soy ${data.nombre.trim()}${data.negocio.trim() ? ` de ${data.negocio.trim()}` : ""}.`,
    `Me interesa: ${data.servicio}.`,
    data.mensaje.trim() ? `\n${data.mensaje.trim()}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  note.textContent = "Abriendo WhatsApp…";
  window.open(waLink(mensaje), "_blank", "noopener");
  form.reset();
});

form.addEventListener("input", (e) => e.target.classList.remove("is-invalid"));

/* ---------------------------------------------------------
   8) AÑO EN EL FOOTER
   --------------------------------------------------------- */
$("#year").textContent = new Date().getFullYear();
