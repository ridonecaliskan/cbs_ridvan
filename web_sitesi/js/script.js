function $(id) { return document.getElementById(id); }

// ========= PROJECTS =========

const projects = [
  {
    id: "p-fire",
    icon: "🔥",
    title: "Yangın Şiddeti Haritalama",
    desc: "Sentinel-2 dNBR ile yanık şiddeti sınıflandırma, vektörleştirme ve raporlama.",
    category: "GIS",
    tags: ["Sentinel-2", "dNBR", "Raster", "QGIS"],
    github: "https://github.com/ridonecaliskan/cbs_ridvan"
  },
  {
    id: "p-quake",
    icon: "🏚️",
    title: "Deprem Hasar Tespiti",
    desc: "Ortofoto tileleme + YOLO tabanlı tespit ve görselleştirme pipeline’ı.",
    category: "GeoAI",
    tags: ["YOLO", "OBB", "Ortofoto", "Active Learning"],
    github: "https://github.com/ridonecaliskan/cbs_ridvan"
  },
  {
    id: "p-rag",
    icon: "🧠",
    title: "Kurumsal RAG Asistanı",
    desc: "Doküman arama, özetleme ve aksiyon çıkarımı için LLM destekli iç sistem.",
    category: "Infra",
    tags: ["RAG", "LLM", "Vector DB", "Security"],
    github: "https://github.com/ridonecaliskan/cbs_ridvan"
  },
  {
    id: "p-dr",
    icon: "🛡️",
    title: "DR ve Backup GFS Tasarımı",
    desc: "Veeam job tasarımı, GFS retention, kapasite planlama ve raporlama.",
    category: "Infra",
    tags: ["Veeam", "GFS", "Capacity", "Restore Test"],
    github: "https://github.com/ridonecaliskan/cbs_ridvan"
  },
  {
    id: "p-postgis",
    icon: "🗺️",
    title: "PostGIS Mekansal Analitik",
    desc: "Yakınlık analizleri, indeksleme, overlay ve performans tuning.",
    category: "GIS",
    tags: ["PostGIS", "SQL", "Spatial Index", "ETL"],
    github: "https://github.com/ridonecaliskan/cbs_ridvan"
  },
  {
    id: "p-ops",
    icon: "⚙️",
    title: "vSphere Operasyon Otomasyonları",
    desc: "Host/cluster bakımı, raporlar ve küçük bakım scriptleri.",
    category: "Infra",
    tags: ["vSphere", "PowerCLI", "Automation", "Health"],
    github: "https://github.com/ridonecaliskan/cbs_ridvan"
  }
];

// ========= GALLERY =========


const photos = [
  { id: "ph0", title: "Ay Manzarası",       place: "Ankara, Türkiye",   coords: [39.908931, 32.752556], img: "main/web_sitesi/images/1.jpeg" },
  { id: "ph1", title: "Karagöl'de Kar Manzarası", place: "Ankara, Türkiye", coords: [40.411060, 32.913951], img: "main/web_sitesi/images/2.jpeg" },
  { id: "ph2", title: "Amasya'da Kış Vakti",   place: "Amasya, Türkiye", coords: [40.650169, 35.807350], img: "main/web_sitesi/images/3.jpeg" },
  { id: "ph3", title: "Kuzey Ankara", place: "Ankara, Türkiye",    coords: [40.008381, 32.893208], img: "main/web_sitesi/images/4.jpeg" },
  { id: "ph4", title: "Karapürçek",   place: "Ankara, Türkiye",  coords: [39.968368, 32.951947], img: "main/web_sitesi/images/5.jpeg" },
  { id: "ph5", title: "Sonbahar Manzarası",     place: "Ankara, Türkiye",   coords: [40.015389, 32.885467], img: "main/web_sitesi/images/6.jpeg" }
];

// ========= PROJECTS =========
(function initProjects() {
  if (!$("projectsGrid") || !$("projFilters") || !$("projSearch")) return;

  const projectsGrid = $("projectsGrid");
  const filtersEl = $("projFilters");
  const searchEl = $("projSearch");

  const categories = ["Hepsi", ...Array.from(new Set(projects.map(p => p.category)))];
  let activeCategory = "Hepsi";
  let searchText = "";

  function renderFilters() {
    filtersEl.innerHTML = categories
      .map(c => `<div class="chip ${c === activeCategory ? "active" : ""}" data-cat="${c}">${c}</div>`)
      .join("");

    filtersEl.querySelectorAll(".chip").forEach(chip => {
      chip.addEventListener("click", () => {
        activeCategory = chip.dataset.cat;
        renderFilters();
        renderProjects();
      });
    });
  }

  function matches(p) {
    const catOk = activeCategory === "Hepsi" || p.category === activeCategory;
    if (!catOk) return false;

    const hay = (p.title + " " + p.desc + " " + p.tags.join(" ") + " " + p.category).toLowerCase();
    return hay.includes(searchText.toLowerCase());
  }

  function renderProjects() {
    const list = projects.filter(matches);

    projectsGrid.innerHTML = list
      .map(p => `
        <article class="proj" id="${p.id}">
          <div class="top">
            <div>
              <h3>${p.icon} ${p.title}</h3>
              <p style="margin:0">${p.desc}</p>
            </div>
            <span class="badge">${p.category}</span>
          </div>

          <div class="tags">
            ${p.tags.map(t => `<span class="tag">${t}</span>`).join("")}
          </div>

          <div class="links">
            <a class="a" href="${p.github}" target="_blank" rel="noopener">GitHub</a>
          </div>
        </article>
      `)
      .join("");

    if (list.length === 0) {
      projectsGrid.innerHTML = `
        <div class="card" style="grid-column:1 / -1;">
          <h3>Sonuç yok</h3>
          <p>Filtreyi değiştir veya arama terimini kısalt.</p>
        </div>
      `;
    }
  }

  searchEl.addEventListener("input", e => {
    searchText = e.target.value || "";
    renderProjects();
  });

  renderFilters();
  renderProjects();
})();

// ========= GALLERY =========
(function initGallery() {
  if (!$("galleryGrid") || !$("galleryMap")) return;
  if (typeof L === "undefined") return; // Leaflet not loaded

  const grid = $("galleryGrid");


  grid.innerHTML = photos
    .map(
      (p, idx) => `
      <article class="shot" id="${p.id}" data-photo-idx="${idx}" role="button" tabindex="0" aria-label="${p.title} konumunu haritada göster">
        <img src="${p.img}" alt="${p.title} - ${p.place}" loading="lazy" />
        <div class="cap">
          <div>
            <b>${p.title}</b>
            <small>${p.place}</small>
          </div>
          <small>${p.coords[0].toFixed(3)}, ${p.coords[1].toFixed(3)}</small>
        </div>
      </article>
    `
    )
    .join("");

  // Map
  const galleryMap = L.map("galleryMap", { worldCopyJump: true });
  window.__galleryMap = galleryMap;

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap"
  }).addTo(galleryMap);

  const bounds = L.latLngBounds([]);
  const photoMarkers = [];

  function highlight(card) {
    if (!card) return;
    card.classList.add("highlight");
    window.setTimeout(() => card.classList.remove("highlight"), 1800);
  }

  function scrollToPhoto(idx) {
    const p = photos[idx];
    const card = p ? document.getElementById(p.id) : null;
    if (!card) return;
    card.scrollIntoView({ behavior: "smooth", block: "center" });
    highlight(card);
  }

  photos.forEach((p, idx) => {
    const marker = L.marker(p.coords).addTo(galleryMap);
    photoMarkers[idx] = marker;
    bounds.extend(p.coords);

    marker.bindPopup(`
      <div style="min-width:190px">
        <b>${p.title}</b><br/>
        <span style="color:#a7b4d6">${p.place}</span>
        <img class="popupimg" src="${p.img}" alt="${p.title}" />
      </div>
    `);

  
    marker.on("click", () => {
      scrollToPhoto(idx);
    });
  });

  function focusOn(idx) {
    const p = photos[idx];
    const marker = photoMarkers[idx];
    if (!p || !marker) return;

    const targetZoom = Math.max(galleryMap.getZoom() || 0, 14);
    galleryMap.setView(p.coords, targetZoom, { animate: true });
    marker.openPopup();

    const card = document.getElementById(p.id);
    highlight(card);
  }

  document.querySelectorAll("#galleryGrid .shot").forEach(card => {
    const idx = Number(card.dataset.photoIdx);
    if (Number.isNaN(idx)) return;

    card.addEventListener("click", () => focusOn(idx));
    card.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        focusOn(idx);
      }
    });
  });

  galleryMap.fitBounds(bounds.pad(0.25));
})();

// ========= CONTACT PAGE  =========
(function initContactMap() {
  if (!$("contactMap")) return;
  if (typeof L === "undefined") return;

  const ankara = [39.9334, 32.8597];

  const contactMap = L.map("contactMap");
  window.__contactMap = contactMap;

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap"
  }).addTo(contactMap);

  contactMap.setView(ankara, 12);
  L.marker(ankara)
    .addTo(contactMap)
    .bindPopup("<b>Ankara</b><br/>Buradayım (işaretli konum).")
    .openPopup();
})();

// ========= FOOTER  =========
if ($("year")) $("year").textContent = new Date().getFullYear();

// UX: maps sometimes need invalidateSize when becoming visible
if (typeof IntersectionObserver !== "undefined") {
  const galleryEl = document.getElementById("galleryMap");
  const contactEl = document.getElementById("contactMap");

  const io = new IntersectionObserver(
    entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          if (e.target.id === "galleryMap" && window.__galleryMap) window.__galleryMap.invalidateSize();
          if (e.target.id === "contactMap" && window.__contactMap) window.__contactMap.invalidateSize();
        }
      });
    },
    { threshold: 0.2 }
  );

  if (galleryEl) io.observe(galleryEl);
  if (contactEl) io.observe(contactEl);
}
