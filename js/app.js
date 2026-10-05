(function () {
  const view = document.getElementById("view");
  const pagina = document.querySelector(".page");
  const LAYOUT_W = 1280;
  const TEM_ZOOM = !!(window.CSS && CSS.supports && CSS.supports("zoom", "1"));
  let zAtual = 1;

  function ajustarAltura() {
    if (TEM_ZOOM || !pagina) {
      document.body.style.removeProperty("height");
      return;
    }
    document.body.style.height = Math.round(pagina.offsetHeight * zAtual) + "px";
  }

  function ajustarLargura() {
    const largura = window.innerWidth;
    const z = largura / LAYOUT_W;
    zAtual = z;
    document.documentElement.style.setProperty("--z", String(z));
    document.documentElement.style.setProperty("--layout-w", LAYOUT_W + "px");
    if (TEM_ZOOM) {
      document.documentElement.classList.add("tem-zoom");
      document.documentElement.style.zoom = z === 1 ? "" : String(z);
    }
    ajustarAltura();
  }

  ajustarLargura();
  window.addEventListener("resize", ajustarLargura);
  window.addEventListener("orientationchange", ajustarLargura);
  if (pagina && window.ResizeObserver) {
    let agendado = false;
    new ResizeObserver(function () {
      if (agendado) return;
      agendado = true;
      requestAnimationFrame(function () { agendado = false; ajustarAltura(); });
    }).observe(pagina);
  }

    function escapeHtml(text) {
    return String(text).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

let current = "";

  function remember() {
    try {
      sessionStorage.setItem("dex.route", current);
    } catch (err) {
    }
  }

  function recall() {
    try {
      return sessionStorage.getItem("dex.route") || "";
    } catch (err) {
      return "";
    }
  }

  window.navigate = function (hash) {
    current = hash || "#/pokemon";
    remember();
    if (history.pushState) {
      if (history.state) history.pushState({ route: current }, "");
      else history.replaceState({ route: current }, "");
    }
    route();
  };

    window.currentHash = function () {
    return current;
  };

    function cleanUrl() {
    if (location.hash && history.replaceState) {
      history.replaceState(null, "", location.pathname + location.search);
    }
  }

    document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey ||
        e.shiftKey || e.altKey) return;
    const a = e.target.closest("a[href]");
    if (!a) return;
    const href = a.getAttribute("href") || "";
    if (href.charAt(0) !== "#" || href === "#") return;
    if (a.target && a.target !== "_self") return;
    e.preventDefault();
    window.navigate(href);
  });

  function parse() {
    const raw = current.replace(/^#/, "");
    const at = raw.indexOf("?");
    const path = at === -1 ? raw : raw.slice(0, at);
    const params = new URLSearchParams(at === -1 ? "" : raw.slice(at + 1));
    return { parts: path.split("/").filter(Boolean), params: params };
  }

  function markNav(key) {
    document.querySelectorAll("[data-nav]").forEach(function (a) {
      a.classList.toggle("is-active", a.dataset.nav === key);
    });
  }

    let lastPath = null;

  function route() {
    const ctx = parse();
    const parts = ctx.parts;
    const params = ctx.params;
    view.innerHTML = "";

        const path = current.replace(/^#/, "").split("?")[0];
    const trocouDePagina = path !== lastPath;
    lastPath = path;

    const section = parts[0] || "pokemon";

        switch (section) {
      case "pokemon":
        markNav("pokemon");
        if (parts[1]) {
                    const mon = Dex.pokemon(parts[1]);
          Views.pokemonDetail(view, mon ? mon.id : parts[1]);
        } else {
          Views.pokemonList(view, params);
        }
        break;
      case "moves":
        markNav("moves");
        if (parts[1]) Views.moveDetail(view, parts[1], params);
        else Views.movesIndex(view, params);
        break;
      case "abilities":
        markNav("abilities");
        if (parts[1]) {
                    const ab = Dex.ability(parts[1]);
          Views.abilityDetail(view, ab ? ab.id : parts[1], params);
        } else {
          Views.abilitiesIndex(view, params);
        }
        break;
      case "items":
        markNav("items");
        Views.itemsIndex(view, params);
        break;
      case "types":
        markNav("types");
        if (parts[1]) {
          Views.typeDetail(view, parts[1], params);
        } else {
          Views.typesIndex(view, params);
        }
        break;
      case "teams":
        markNav("teams");
        Views.teamsIndex(view);
        break;
      case "downloads":
        markNav("download");
        Views.downloadsIndex(view);
        break;
      case "search":
        markNav("search");
        Views.searchPage(view, params);
        break;
      default:
        window.navigate("#/pokemon");
        return;
    }
    if (trocouDePagina) window.scrollTo(0, 0);
  }

  const toggle = document.getElementById("theme-toggle");

  function labelTheme(light) {
    const to = light ? "dark" : "light";
    toggle.title = "Toggle theme";
    toggle.setAttribute("aria-label", "Switch to " + to + " theme");
  }

  toggle.addEventListener("click", function () {
    const light = document.body.classList.toggle("theme-light");
    labelTheme(light);
    try {
      localStorage.setItem("dex.theme", light ? "light" : "dark");
    } catch (err) {
          }
  });

  let saved = null;
  try {
    saved = localStorage.getItem("dex.theme");
  } catch (err) {
      }
  if (saved === "light") document.body.classList.add("theme-light");
  labelTheme(document.body.classList.contains("theme-light"));

  Dex.load()
    .then(function () {
      document.body.classList.add("is-ready");
      current = location.hash || recall() || "#/pokemon";
      remember();
      cleanUrl();
      history.replaceState({ route: current }, "");
      window.addEventListener("popstate", function (e) {
        if (e.state && e.state.route) current = e.state.route;
        route();
      });
      window.addEventListener("hashchange", function () {
        current = location.hash || "#/pokemon";
        remember();
        cleanUrl();
        route();
      });
      route();
    })
    .catch(function (err) {
            view.innerHTML =
        '<div class="empty"><p>Could not load the data.</p>' +
        "<p class='muted'>Check that <code>data/pokedex.js</code> exists.</p>" +
        (err && err.message
          ? "<p class='muted'>Reason: " + escapeHtml(err.message) + "</p>"
          : "") +
        "</div>";
    });
})();
