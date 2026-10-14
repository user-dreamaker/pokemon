const Views = (function () {
  const el = Dex.el;

  const SEX_OF_SIGN = { "♂": "m", "♀": "f" };

  function nameWithSign(label) {
    const sign = label.slice(-1);
    const kind = SEX_OF_SIGN[sign];
    if (!kind) return document.createTextNode(label);
    const box = el("span", "pname");
    box.appendChild(el("span", "pname__text", label.slice(0, -1)));
    box.appendChild(el("span", "psex psex--" + kind, sign));
    return box;
  }

    async function pokemonList(root, params) {
    if (params.get("q")) await Dex.loadLearnsets();
    const list = filtered(params);
    const sort = params.get("sort") || "dex";
    const dir = params.get("dir") === "more" ? -1 : 1;

    const head = el("header", "page__head");
    head.appendChild(el("h1", "page__title", "Pokémon by Dreamaker"));
    root.appendChild(head);

    if (!list.length) {
      root.appendChild(el("div", "empty", "No Pokémon found."));
      return;
    }

    const wrap = el("div", "tablewrap tablewrap--narrow");
    wrap.appendChild(pokemonTable(list, sort, dir, params));
    root.appendChild(wrap);
  }

    function pokemonTable(list, sort, dir, params, extraClass, keys) {
    const k = keys || { sort: "sort", dir: "dir" };
    const table = el("table", "ptable ptable--flat" + (extraClass ? " " + extraClass : ""));

    const thead = el("thead");
    const hr = el("tr");
    hr.appendChild(el("th", "w-icon"));
    hr.appendChild(sortTh("Pokémon", "name", "w-name", sort, dir, params,
      "Click to switch between dex number and A-Z", k));
    hr.appendChild(el("th", "w-types", "Types"));
    hr.appendChild(el("th", "w-ability w-ability--1", "Ability 1"));
    hr.appendChild(el("th", "w-ability w-ability--2", "Ability 2"));
    STAT_META.forEach(function (s) {
      hr.appendChild(sortTh(s.short, "stats." + s.key, "w-stat", sort, dir, params,
        "Click to sort by " + s.short, k));
    });
    thead.appendChild(hr);
    table.appendChild(thead);

    const tbody = el("tbody");
    list.forEach(function (p, i) {
      const tr = pokemonRow(p, i);
      tr.classList.add(i % 2 === 0 ? "is-odd" : "is-even");
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    return table;
  }

    function sortPokemon(list, sort, dir) {
    const key = function (p) {
      if (sort === "name") return p.label.toLowerCase();
      if (sort && sort.indexOf("stats.") === 0) {
        return p.stats[sort.slice(6)] || 0;
      }
      return p.id;
    };
    return list.slice().sort(function (a, b) {
      const av = key(a);
      const bv = key(b);
      const cmp = typeof av === "string" ? av.localeCompare(bv, "en") : av - bv;
      return cmp * dir;
    });
  }

    function sortTh(label, value, className, sort, dir, params, hint, keys) {
    const k = keys || { sort: "sort", dir: "dir" };
    const th = el("th", "is-sortable " + className, label);
    th.title = hint;
    th.tabIndex = 0;
    th.setAttribute("role", "button");

    const active = value === "name" ? sort === "name" || sort === "dex" : sort === value;
    th.setAttribute("aria-sort", active ? (dir === 1 ? "ascending" : "descending") : "none");
    if (active) th.classList.add(dir === 1 ? "is-asc" : "is-desc");

    const go = function () {
      const base = currentHash().split("?")[0] || "#/pokemon";
      if (value === "name") {

        const next = {};
        next[k.sort] = sort === "name" ? "dex" : "name";
        next[k.dir] = null;
        navigate(base + "?" + mergeParams(params, next));
        return;
      }

      const nextDir = sort === value ? (dir === -1 ? "less" : "more") : "more";
      const next = {};
      next[k.sort] = value;
      next[k.dir] = nextDir;
      navigate(base + "?" + mergeParams(params, next));
    };
    th.addEventListener("click", go);
    th.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        go();
      }
    });
    return th;
  }

    function statCell(key, value) {
    const td = el("td", "scell w-stat");
    td.appendChild(el("span", "scell__k", key));
    td.appendChild(el("span", "scell__v", String(value)));
    return td;
  }

  function pokemonRow(p, index) {
    const tr = el("tr");
    const iconCell = el("td", "w-icon");

    iconCell.appendChild(Dex.iconBox(p.slug, false, false, index));
    tr.appendChild(iconCell);

    const nameCell = el("td", "c-name w-name");
    const link = el("a", "plink");
    link.appendChild(nameWithSign(p.label));
    link.href = "#/pokemon/" + p.slug;
    nameCell.appendChild(link);
    tr.appendChild(nameCell);

      const typeCell = el("td", "w-types");

      typeCell.appendChild(Dex.typeTags(p.types, null, true));
    tr.appendChild(typeCell);

    tr.appendChild(abilityCell(p.abilities[0], 1));
    tr.appendChild(abilityCell(p.abilities[1], 2));

    STAT_META.forEach(function (s) {
      tr.appendChild(statCell(s.short, p.stats[s.key] || 0));
    });
    tr.dataset.search = p.label.replace(/[\u2640\u2642]$/, "").toLowerCase();
    tr.dataset.id = String(p.id);
    return tr;
  }

  function abilityCell(id, slot) {
    const td = el("td", "c-ability w-ability" + (slot ? " w-ability--" + slot : ""));
    if (!id) {
      td.appendChild(el("span", "muted", "—"));
      return td;
    }
    const a = Dex.ability(id);
    const link = el("a", null, a ? a.label : "#" + id);
    link.href = "#/abilities/" + Dex.abilitySlug(id);
    link.title = a && a.description ? a.description : "";
    td.appendChild(link);
    return td;
  }

    const TYPE_COL_1 = ["fire", "grass", "water", "electric", "bug", "flying", "rock", "normal"];
  const TYPE_COL_2 = ["poison", "ground", "ice", "fighting",
    "psychic", "ghost", "dragon", "dark", "steel"];

  function typeFilter(params) {
    const wrap = el("div", "fset");
    wrap.appendChild(el("span", "fset__label", "Filter the list by type"));
    const chosen = (params.get("type") || "").split(",").filter(Boolean);
    const grid = el("div", "chips chips--2col");

    const makeChip = function (name) {
      const b = el("button", "chip chip--type type type--" + name,
        Dex.typeLabel(name));
      b.type = "button";
      b.title = "Go to the " + Dex.typeLabel(name) + " type page";
      b.style.setProperty("--tc", TYPE_COLORS[name]);
      b.classList.toggle("is-on", chosen.indexOf(name) !== -1);

      b.addEventListener("click", function () {
        navigate("#/types/" + name);
      });
      return b;
    };

    const col1 = el("div", "chips__col");
    const all = el("button", "chip chip--none type type--mystery", "???");
    all.type = "button";
    all.title = "Clear the type filter";
    all.classList.toggle("is-on", !chosen.length);
    all.addEventListener("click", function () {
      navigate("#/pokemon?" + mergeParams(params, { type: null }));
    });
    col1.appendChild(all);
    TYPE_COL_1.forEach(function (n) { col1.appendChild(makeChip(n)); });

    const col2 = el("div", "chips__col");
    TYPE_COL_2.forEach(function (n) { col2.appendChild(makeChip(n)); });

    grid.appendChild(col1);
    grid.appendChild(col2);
    wrap.appendChild(grid);
    return wrap;
  }

  function mergeParams(params, changes) {
    const next = new URLSearchParams(params);
    Object.keys(changes).forEach(function (key) {
      const value = changes[key];
      if (value === null || value === "" || value === undefined) next.delete(key);
      else next.set(key, value);
    });
    return next.toString();
  }

  function filtered(params) {
    const q = (params.get("q") || "").trim().toLowerCase();
    const types = (params.get("type") || "").split(",").filter(Boolean);
    const sort = params.get("sort") || "dex";
    const dir = params.get("dir") === "more" ? -1 : 1;

    let list = Dex.data.pokemon.slice();

    if (types.length) {
      list = list.filter(function (p) {
        return types.every((t) => p.types.indexOf(t) !== -1);
      });
    }

    if (q) {
      list = list.filter(function (p) {
        if (p.label.toLowerCase().indexOf(q) !== -1) return true;
        if (String(p.id) === q) return true;
        const ls = (window.LEARNSETS || {})[p.slug] || [];
        return ls.some(function (m) {
          const move = Dex.move(m[0]);
          return move && move.label.toLowerCase().indexOf(q) !== -1;
        });
      });
    }

    const key = function (p) {
      if (sort.indexOf("stats.") === 0) return p.stats[sort.slice(6)] || 0;
      if (sort === "total") return Dex.statTotal(p);
      if (sort === "name") return p.label.toLowerCase();
      return p.id;
    };

    list.sort(function (a, b) {
      const av = key(a);
      const bv = key(b);
      const cmp = typeof av === "string" ? av.localeCompare(bv, "en") : av - bv;
      return cmp * dir;
    });
    return list;
  }

    function pokemonDetail(root, id) {
    const p = Dex.pokemon(id);
    if (!p) {
      root.appendChild(el("div", "empty", "Pokémon not found."));
return;
    }
    const nav = el("nav", "pnav");
    const near = Dex.neighbors(id);
    if (near.prev) nav.appendChild(stepLink(near.prev, "Previous", "prev"));
    const back = el("a", "pnav__back", "← Pokémon");
    back.href = "#/pokemon";
    nav.appendChild(back);
    if (near.next) nav.appendChild(stepLink(near.next, "Next", "next"));
    root.appendChild(nav);

        const top = el("div", "pdtop");
    top.appendChild(el("p", "ddex", "#" + String(p.id).padStart(3, "0")));
    const h1 = el("h1", "dtitle");
    h1.appendChild(nameWithSign(p.label));
    top.appendChild(h1);
    root.appendChild(top);

    const head = el("header", "dhead");

const box = el("div", "dsprite");
    const img = el("img", "dsprite__img");
    img.src = Dex.sprite(p.slug, "front_normal");
    img.alt = p.label;
    img.width = 96;
    img.height = 96;
    const shiny = el("img", "dsprite__img");
    shiny.src = Dex.sprite(p.slug, "front_shiny");
    shiny.alt = p.label + " shiny";
    shiny.width = 96;
    shiny.height = 96;
        const cellA = el("div", "dsprite__cell");
    cellA.appendChild(img);
    const cellB = el("div", "dsprite__cell");
    cellB.appendChild(shiny);
    box.append(cellA, cellB);
    head.appendChild(box);

        const info = el("dl", "pdinfo");
    const typeRow = el("div", "pdinfo__row");
    typeRow.appendChild(el("dt", "pdinfo__k", "Type"));
    const typeDd = el("dd", "pdinfo__v");
    typeDd.appendChild(Dex.typeTags(p.types, "type--lg", true));
    typeRow.appendChild(typeDd);
    info.appendChild(typeRow);
    head.appendChild(info);

    const stats = statBlock(p);
    stats.classList.add("stats--pd");
    head.appendChild(stats);

        const abBox = el("div", "pdabil");
    abBox.appendChild(el("p", "pdinfo__k", "Abilities"));
    abBox.appendChild(abilityList(p));
    head.appendChild(abBox);
    root.appendChild(head);

        root.appendChild(evolutionBlock(p));

        root.appendChild(card("Type effectiveness", defensiveBlock(p)));
    moveTable(p).then(function (table) {
      root.appendChild(card("Moves", table));
    });
  }

    const EVO_GLYPH = {
    "fire stone": "🔥",
    "water stone": "💧",
    "thunder stone": "⚡",
    "moon stone": "🌙",
    "sun stone": "☀️",
    "leaf stone": "🍃",
        "ice stone": "❄️",
  };

  function evoIcon(method) {
    const low = String(method).toLowerCase();
    let glyph = "";
    if (/^level\b/.test(low)) glyph = "🍬";
    else if (/trade/.test(low)) glyph = "🤝";
    else if (/friendship/.test(low)) glyph = "❤️";
    else glyph = EVO_GLYPH[low] || "";
    if (!glyph) return null;
    return el("span", "evo__emoji", glyph);
  }

    function dexTag(id) {
    return el("span", "dexnum", "#" + String(id).padStart(3, "0"));
  }

    function evolutionBlock(p) {
    const box = el("div", "devo");
    const paths = Dex.evolutionPaths(p);
    if (!paths.length) {
            box.appendChild(el("p", "devo__k", "Evolution"));
      box.appendChild(el("p", "devo__none", "None"));
      return box;
    }
    const label = el("p", "devo__k", paths.length > 1 ? "Evolves into" : "Evolution");
    box.appendChild(label);
    const list = el("div", "devo__paths");
    paths.forEach(function (path) {
      const line = el("div", "devo__path");
      path.forEach(function (step, i) {
        if (i) {
                    const icon = evoIcon(step.via);
          if (icon) line.appendChild(icon);
          line.appendChild(el("span", "devo__via", step.via));
          line.appendChild(el("span", "devo__arrow", "→"));
        }
        if (step.id) {
                    const link = el("a", "devo__name");
          link.appendChild(nameWithSign(step.name));
          link.href = "#/pokemon/" + step.slug;
          line.appendChild(link);
        } else {
          const tag = el("span", "devo__name");
          tag.appendChild(nameWithSign(step.name));
          line.appendChild(tag);
        }
      });
      list.appendChild(line);
    });
    box.appendChild(list);
    return box;
  }

  function stepLink(p, label, dir) {
    const a = el("a", "pnav__link pnav__link--" + dir);
    a.href = "#/pokemon/" + p.slug;
        a.appendChild(el("span", "pnav__arrow", dir === "prev" ? "←" : "→"));
    const text = el("span", "pnav__text");
    text.appendChild(el("small", null, label));
    const name = el("strong");
    name.appendChild(dexTag(p.id));
    name.appendChild(nameWithSign(p.label));
    text.appendChild(name);
    a.appendChild(text);
    if (dir === "next") a.classList.add("is-right");
    return a;
  }

  function card(title, node) {
    const section = el("section", "card");
    if (title) section.appendChild(el("h2", "card__title", title));
    if (node) section.appendChild(node);
    return section;
  }

    function statBlock(p) {
    const box = el("div", "stats");

    const head = el("div", "stat stat--head");
    head.appendChild(el("span", "stat__k"));
    head.appendChild(el("span", "stat__v"));
    head.appendChild(el("span", "stat__bar"));
    head.appendChild(el("span", "stat__rng", "Lv. 100"));
    box.appendChild(head);

    STAT_META.forEach(function (s) {
      const value = p.stats[s.key] || 0;
      const row = el("div", "stat stat--" + s.key);
      row.appendChild(el("span", "stat__k", s.short));
      row.appendChild(el("span", "stat__v", String(value)));
      const track = el("span", "stat__bar");
      const fill = el("span", "stat__fill");
      fill.style.width = (value / Dex.statCap) * 100 + "%";
      track.appendChild(fill);
      row.appendChild(track);
      const r = Dex.statRange(p, s.key, 100);
      row.appendChild(el("span", "stat__rng", r[0] + "–" + r[1]));
      box.appendChild(row);
    });

    const total = el("div", "stat stat--total");
    total.appendChild(el("span", "stat__k", "Total"));
    total.appendChild(el("span", "stat__v", String(Dex.statTotal(p))));
    box.appendChild(total);
    return box;
  }

    const EFF_BUCKETS = [4, 2, 1, 0.5, 0.25, 0];

  function effTable(p, comAbility) {
    const rows = Dex.data.types.map(function (t) {
      return {
        name: t.name,
        mult: comAbility ? Dex.defenseVs(p, t.name) : Dex.multiplier(t.name, p.types),
      };
    });
    const byMult = new Map();
    rows.forEach(function (r) {
      if (!byMult.has(r.mult)) byMult.set(r.mult, []);
      byMult.get(r.mult).push(r.name);
    });

    let entries = EFF_BUCKETS.map(function (m) {
      return { mult: m, types: byMult.get(m) || [] };
    });
    if (comAbility) {
      byMult.forEach(function (types, m) {
        if (EFF_BUCKETS.indexOf(m) === -1) entries.push({ mult: m, types: types });
      });
    }
    entries = entries.filter(function (e) { return e.types.length; });
    entries.sort(function (a, b) { return b.mult - a.mult; });

    const box = el("div", "eff");
    entries.forEach(function (e) {
            const row = el("div", "eff__row");
      row.dataset.mult = String(e.mult);
      row.appendChild(el("span", "eff__k", Dex.multText(e.mult) + "x"));
      const list = el("div", "eff__list");
                  const names = e.types.slice().sort(function (a, b) {
        return Dex.typeRank(a) - Dex.typeRank(b);
      });
      names.forEach(function (n) { list.appendChild(Dex.typeBadge(n, null, true)); });
      row.appendChild(list);
      box.appendChild(row);
    });
    return box;
  }

  function defensiveBlock(p) {
    const notas = Dex.abilityNotes(p);
    const wrap = el("div");
    wrap.appendChild(effTable(p, !notas.length));
    notas.forEach(function (nota) {
      wrap.appendChild(abilityNoteLine(nota));
    });
    return wrap;
  }

  function abilityNoteLine(nota) {
    const p = el("p", "eff__note");
    p.appendChild(document.createTextNode("Notes: if this Pokémon has "));
    const link = el("a", "eff__note-link", nota.label);
    link.href = "#/abilities/" + Dex.abilitySlug(nota.id);
    p.appendChild(link);

    if (!nota.parts) {
      p.appendChild(document.createTextNode(
        ", only super effective moves can damage it; every other type deals 0×."));
      return p;
    }

    const frases = nota.parts.map(function (parte) {
      const span = el("span");
      span.appendChild(document.createTextNode("the effectiveness of "));
      span.appendChild(Dex.typeBadge(parte.type, "eff__note-type", true));
      span.appendChild(document.createTextNode("-type moves is "));
      const k = el("span", "eff__k", Dex.multText(parte.mult) + "x");
      k.dataset.mult = String(parte.mult);
      span.appendChild(k);
      return span;
    });

    p.appendChild(document.createTextNode(", "));
    frases.forEach(function (frase, i) {
      p.appendChild(frase);
      if (i < frases.length - 1) {
        p.appendChild(document.createTextNode(i === frases.length - 2 ? " and " : ", "));
      }
    });
    p.appendChild(document.createTextNode("."));
    return p;
  }

  function abilityList(p) {
    const list = el("ul", "alist");
    if (!p.abilities.length) {
      list.appendChild(el("li", "muted", "No ability."));
      return list;
    }
    p.abilities.filter(function (id, i) {
      return id && p.abilities.indexOf(id) === i;
    }).forEach(function (id) {
      const a = Dex.ability(id);
      const li = el("li", "aitem");
      if (!a) return;
      const link = el("a", "aitem__name", a.label);
      link.href = "#/abilities/" + Dex.abilitySlug(a.id);
      li.appendChild(link);
      li.appendChild(el("p", "aitem__desc", a.description || ""));
      list.appendChild(li);
    });
    return list;
  }

    async function moveTable(p) {
    await Dex.loadLearnsets();
    const table = el("div", "dextable dextable--compact");

        const METHOD_RANK = METHOD_ORDER;

    let sortBy = "method";
    let sortDir = 1;

    const byLabel = function (a, b) {
      return Dex.moveLabel(a.label).localeCompare(Dex.moveLabel(b.label), "en");
    };
    const catRank = { physical: 0, special: 1, status: 2 };

        const natural = function (a, b) {
      return (a._nat - b._nat) * sortDir;
    };

    function compare(a, b) {
      if (sortBy === "name") return byLabel(a, b) * sortDir || natural(a, b);
      if (sortBy === "dex") return (a.id - b.id) * sortDir || natural(a, b);
      if (sortBy === "type") {
        return Dex.typeLabel(a.type).localeCompare(Dex.typeLabel(b.type), "en")
          * sortDir || byLabel(a, b) || natural(a, b);
      }
      if (sortBy === "category") {
        return (catRank[a.category] - catRank[b.category]) * sortDir
          || byLabel(a, b) || natural(a, b);
      }
      if (sortBy === "power" || sortBy === "accuracy" || sortBy === "pp") {
                const av = a[sortBy] ? a[sortBy] : -1;
        const bv = b[sortBy] ? b[sortBy] : -1;
        return (av - bv) * sortDir || byLabel(a, b) || natural(a, b);
      }
            return (METHOD_RANK[a.method] - METHOD_RANK[b.method]) * sortDir
        || ((a.number || 0) - (b.number || 0)) * sortDir
        || natural(a, b);
    }

        let touched = false;

    function nextSort(value) {
            if (touched && sortBy === value) {
        sortDir = -sortDir;
        return sortDir;
      }
            const first = (value === "power" || value === "accuracy"
        || value === "pp" || value === "dex") ? -1 : 1;
      sortBy = value;
      sortDir = first;
      touched = true;
      return sortDir;
    }

    const th = function (cls, text, value, hint) {
      const d = el("div", cls + " mrow__th mrow__th--sort is-sortable");
      d.appendChild(el("span", "mrow__thl", text));
      d.title = hint || "Sort by " + text;
      d.tabIndex = 0;
      d.setAttribute("role", "button");
      d.setAttribute("aria-sort", sortBy === value
        ? (sortDir === 1 ? "ascending" : "descending") : "none");
      if (sortBy === value) {
        d.classList.add(sortDir === 1 ? "is-asc" : "is-desc");
      }
      const go = function () {
        nextSort(value);
        paint();
      };
      d.addEventListener("click", go);
      d.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); go(); }
      });
      return d;
    };

    const HEAD = [
      ["mrow__method", "Method", "method", "Sort by method"],
      ["mrow__name", "Move", "name", "Sort by name"],
      ["mrow__type", "Type", "type", "Sort by type"],
      ["mrow__damage", "Category", "category", "Sort by category"],
      ["mrow__stat mrow__power", "Power", "power", "Sort by power"],
      ["mrow__stat mrow__accuracy", "Accuracy", "accuracy", "Sort by accuracy"],
      ["mrow__stat mrow__pp", "PP", "pp", "Sort by PP"],
      ["mrow__desc", "Description"]
    ];

    function headRow() {
      const row = el("div", "mrow mrow--head");
      HEAD.forEach(function (c) { row.appendChild(th(c[0], c[1], c[2], c[3])); });
      return row;
    }

    const thead = headRow();
    table.appendChild(thead);

        const lista = Dex.movesOf(p);
    lista.forEach(function (m, i) { m._nat = i; });
    const nodes = lista.map(function (m) {
      const line = el("div", "mrow");

      const methodBox = el("div", "mrow__method mrow__method--v",
        Dex.methodText(m));
      line.appendChild(methodBox);

      const nameBox = el("div", "mrow__name");
      const link = el("a", "mrow__link", Dex.moveLabel(m.label));
      link.href = "#/moves/" + Dex.moveSlug(m);
      nameBox.appendChild(link);
      line.appendChild(nameBox);

      const typeBox = el("div", "mrow__type");
      typeBox.appendChild(Dex.typeBadge(m.type, null, true));
      line.appendChild(typeBox);

      const cat = el("div", "mrow__damage");
      cat.appendChild(el("span", "c-cat c-cat--" + m.category,
        CATEGORY_LABEL[m.category] || m.category));
      line.appendChild(cat);

      line.appendChild(el("div", "mrow__stat mrow__power",
        m.power ? String(m.power) : "—"));
      line.appendChild(el("div", "mrow__stat mrow__accuracy",
        m.accuracy ? m.accuracy + "%" : "—"));
      line.appendChild(el("div", "mrow__stat mrow__pp", String(m.pp)));
      line.appendChild(Object.assign(el("div", "mrow__desc", m.description || "—"), { title: m.description || "" }));

      line._move = m;
      return line;
    });

        function paint() {
      nodes.slice().sort(function (a, b) { return compare(a._move, b._move); })
        .forEach(function (line, i) {
          line.classList.toggle("mrow--odd", i % 2 === 0);
          line.classList.toggle("mrow--even", i % 2 === 1);
          table.appendChild(line);
        });
      const old = table.querySelector(".mrow--head");
      if (old) table.replaceChild(headRow(), old);
    }

        nodes.forEach(function (line, i) {
      line.classList.add(i % 2 === 0 ? "mrow--odd" : "mrow--even");
      table.appendChild(line);
    });
    return table;
  }

      function movesTable(list, params, parent, countEl, keys) {
    const k = keys || { sort: "sort", dir: "dir" };
    const bar = el("div", "sortbar");
    const wrap = el("div", "sortbar__group");
    wrap.appendChild(el("span", "sortbar__label", "Search: "));
    const input = el("input", "minisearch");
    input.type = "search";
    input.placeholder = "move or type name…";
    input.value = params.get("q") || "";
    wrap.appendChild(input);
    bar.appendChild(wrap);
    parent.appendChild(bar);

        const table = el("div", "dextable");

    const thead = el("div", "mrow mrow--head");
        let sortBy = params.get(k.sort) || "name";
    if (["name", "dex", "type", "category", "power", "accuracy", "pp"]
      .indexOf(sortBy) < 0) sortBy = "name";
    let sortDir = params.get(k.dir) === "more" ? -1 : 1;
        const base = currentHash().split("?")[0] || "#/moves";

    function nextSort(value) {
      if (value === "name") {
                return { sort: sortBy === "name" ? "dex" : "name", dir: null };
      }
            const first = value === "type" || value === "category" ? "less" : "more";
      const nextDir = sortBy === value
        ? (sortDir === -1 ? "less" : "more")
        : first;
      return { sort: value, dir: nextDir };
    }

    function goSort(value) {
      const next = nextSort(value);
      sortBy = next.sort;
      sortDir = next.dir === "more" ? -1 : 1;
      const change = {};
      change[k.sort] = next.sort;
      change[k.dir] = next.dir;
      navigate(base + "?" + mergeParams(params, change));
    }

    const th = function (cls, text, value, hint) {
      const d = el("div", cls + " mrow__th" + (value ? " mrow__th--sort is-sortable" : ""));
      d.appendChild(el("span", "mrow__thl", text));
      if (!value) return d;
      d.title = hint;
      d.tabIndex = 0;
      d.setAttribute("role", "button");
      const active = value === "name"
        ? (sortBy === "name" || sortBy === "dex")
        : sortBy === value;
      d.setAttribute("aria-sort", active
        ? (sortDir === 1 ? "ascending" : "descending")
        : "none");
      if (active) d.classList.add(sortDir === 1 ? "is-asc" : "is-desc");
      d.addEventListener("click", function () { goSort(value); });
      d.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          goSort(value);
        }
      });
      return d;
    };

    thead.appendChild(th("mrow__name", "Move", "name",
      sortBy === "name"
        ? "Sorted by name. Click for dex number."
        : "Sorted by dex number. Click for name."));
    thead.appendChild(th("mrow__type", "Type", "type", "Sort by type"));
    thead.appendChild(th("mrow__damage", "Category", "category", "Sort by category"));
    thead.appendChild(th("mrow__stat mrow__power", "Power", "power",
      "Sort by power"));
    thead.appendChild(th("mrow__stat mrow__accuracy", "Accuracy", "accuracy",
      "Sort by accuracy"));
    thead.appendChild(th("mrow__stat mrow__pp", "PP", "pp", "Sort by PP"));
    thead.appendChild(th("mrow__desc", "Description"));
    table.appendChild(thead);

    const rows = [];
    const lista = list.slice();
    const byLabel = function (a, b) {
      return Dex.moveLabel(a.label).localeCompare(Dex.moveLabel(b.label), "en");
    };
        const byType = function (a, b) {
      return Dex.typeLabel(a.type).localeCompare(Dex.typeLabel(b.type), "en");
    };
    const catRank = { physical: 0, special: 1, status: 2 };
    lista.sort(function (a, b) {
      if (sortBy === "dex") return (a.id - b.id) || byLabel(a, b);
      if (sortBy === "type") {
        return byType(a, b) * sortDir || byLabel(a, b);
      }
      if (sortBy === "category") {
        return (catRank[a.category] - catRank[b.category]) * sortDir || byLabel(a, b);
      }
      if (sortBy === "power" || sortBy === "accuracy" || sortBy === "pp") {
                const av = a[sortBy] ? a[sortBy] : -1;
        const bv = b[sortBy] ? b[sortBy] : -1;
        return (av - bv) * sortDir || byLabel(a, b);
      }
      return byLabel(a, b);
    });
    lista.forEach(function (m) {
      const line = el("div", "mrow");
      const nameBox = el("div", "mrow__name");
      const link = el("a", "mrow__link", Dex.moveLabel(m.label));
      link.href = "#/moves/" + Dex.moveSlug(m);
      nameBox.appendChild(link);
      line.appendChild(nameBox);

      const typeBox = el("div", "mrow__type");
      typeBox.appendChild(Dex.typeBadge(m.type, null, true));
      line.appendChild(typeBox);

      const cat = el("div", "mrow__damage");
      cat.appendChild(el("span", "c-cat c-cat--" + m.category,
        CATEGORY_LABEL[m.category] || m.category));
      line.appendChild(cat);

      line.appendChild(el("div", "mrow__stat mrow__power",
        m.power ? String(m.power) : "—"));
      line.appendChild(el("div", "mrow__stat mrow__accuracy",
        m.accuracy ? m.accuracy + "%" : "—"));
      line.appendChild(el("div", "mrow__stat mrow__pp", String(m.pp)));
      line.appendChild(Object.assign(el("div", "mrow__desc", m.description || "—"), { title: m.description || "" }));

      line.dataset.search = (m.label + " " + m.type).toLowerCase();
      line.dataset.type = m.type;
            line.dataset.id = String(m.id);
      line.dataset.name = Dex.moveLabel(m.label);
      table.appendChild(line);
      rows.push(line);
    });

        function stripe() {
      let n = 0;
      rows.forEach(function (node) {
        if (node.hidden) return;
        node.classList.toggle("mrow--odd", n % 2 === 0);
        node.classList.toggle("mrow--even", n % 2 === 1);
        n++;
      });
    }
    stripe();

    parent.appendChild(table);

    const nothing = el("div", "empty");
    nothing.hidden = true;
    parent.appendChild(nothing);

    function refresh() {
      const term = input.value.trim().toLowerCase();
      let visible = 0;
      rows.forEach(function (tr) {
        const ok = !term || tr.dataset.search.indexOf(term) !== -1;
        tr.hidden = !ok;
        if (ok) visible++;
      });
      stripe();
      if (countEl) countEl.textContent = visible + "/" + rows.length;
            nothing.textContent = "Nothing found for \u201c" + input.value.trim() + "\u201d";
      nothing.hidden = !term || visible > 0;
    }
    input.addEventListener("input", refresh);
    refresh();
  }

  function movesIndex(root, params) {
    const head = el("header", "page__head");
    const row = el("div", "page__titlerow");
    const count = el("span", "page__count", String(Dex.data.moves.length));
    row.append(el("h1", "page__title", "Moves"), count);
    head.appendChild(row);
    root.appendChild(head);
    movesTable(Dex.data.moves, params, root, count);
  }

function moveFact(label, valueNode, badge) {
    const cell = el("div", badge ? "mdfact mdfact--badge" : "mdfact");
    cell.appendChild(el("span", "mdfact__k", label));
    const v = el("span", "mdfact__v");
    if (typeof valueNode === "string") v.textContent = valueNode;
    else if (valueNode) v.appendChild(valueNode);
    cell.appendChild(v);
    return cell;
  }

async function moveDetail(root, slug, params) {
    const m = Dex.moveBySlug(slug);
    if (!m) {
      root.appendChild(el("div", "empty", "Move not found."));
      return;
    }
    const learnsets = Dex.loadLearnsets();
    const q = params || new URLSearchParams();

        root.appendChild(el("h1", "page__title page__title--move", Dex.moveLabel(m.label)));

    const facts = el("div", "mdfacts");
facts.appendChild(moveFact("Type", Dex.typeBadge(m.type), true));
    facts.appendChild(moveFact("Category", el("span", "c-cat c-cat--" + m.category,
      CATEGORY_LABEL[m.category] || m.category), true));
    facts.appendChild(moveFact("Power", m.power ? m.power + " BP" : "—"));
    facts.appendChild(moveFact("Accuracy", m.accuracy ? m.accuracy + "%" : "—"));
    facts.appendChild(moveFact("Priority", String(m.priority)));
    facts.appendChild(moveFact("PP", String(m.pp)));
    root.appendChild(facts);

    if (m.description) root.appendChild(el("p", "mddesc", m.description));

    const target = Dex.moveTarget(m);
    if (target) {
      const p = el("p", "mdline");
      p.appendChild(el("strong", null, "Targets:"));
      p.appendChild(document.createTextNode(" " + target + "."));
      root.appendChild(p);
    }

    const flags = Dex.moveFlags(m);
    if (flags.length) {
      root.appendChild(el("p", "mdline mdline--flags", "Move flags:"));
      const ul = el("ul", "mdflags");
      flags.forEach((f) => ul.appendChild(el("li", null, f)));
      root.appendChild(ul);
    }

    await learnsets;
    const users = Dex.usersOfMove(m.id);
    if (users.length) {
      const sort = q.get("sort") || "dex";
      const dir = q.get("dir") === "more" ? -1 : 1;
      root.appendChild(el("h2", "mdlearn", "Pokémon"));
            const wrap = el("div", "tablewrap tablewrap--narrow");
      wrap.appendChild(pokemonTable(sortPokemon(users, sort, dir), sort, dir, q, "ptable--learn"));
      root.appendChild(wrap);
    }
  }

    function abilitiesIndex(root, params) {
    const head = el("header", "page__head");
    const row = el("div", "page__titlerow");
    row.append(el("h1", "page__title", "Abilities"),
      el("span", "page__count", String(Dex.data.abilities.length)));
    head.appendChild(row);
    const bar = el("div", "sortbar");
    const wrap = el("div", "sortbar__group");
    wrap.appendChild(el("span", "sortbar__label", "Search: "));
    const input = el("input", "minisearch");
    input.type = "search";
    input.placeholder = "ability name…";
    input.value = params.get("q") || "";
    wrap.appendChild(input);
    bar.appendChild(wrap);
    head.appendChild(bar);
    root.appendChild(head);

        const table = el("div", "dextable");
    const rows = [];
    Dex.data.abilities
      .slice()
      .sort((a, b) => a.label.localeCompare(b.label, "en"))
      .forEach(function (a) {
        const line = el("div", "abrow");
        const nameBox = el("div", "abrow__name");
        const link = el("a", "alink abrow__link", a.label);
        link.href = "#/abilities/" + Dex.abilitySlug(a.id);
        nameBox.appendChild(link);
        line.appendChild(nameBox);
        line.appendChild(Object.assign(el("div", "abrow__desc", a.description || "—"), { title: a.description || "" }));
        line.dataset.search = a.label.toLowerCase();
        table.appendChild(line);
        rows.push(line);
      });

        function stripe() {
      let n = 0;
      rows.forEach(function (node) {
        if (node.hidden) return;
        node.classList.toggle("abrow--odd", n % 2 === 0);
        node.classList.toggle("abrow--even", n % 2 === 1);
        n++;
      });
    }
    stripe();

    root.appendChild(table);

    input.addEventListener("input", function () {
      const term = input.value.trim().toLowerCase();
      let visible = 0;
      rows.forEach(function (node) {
        const ok = !term || node.dataset.search.indexOf(term) !== -1;
        node.hidden = !ok;
        if (ok) visible++;
      });
      stripe();
      row.querySelector(".page__count").textContent = visible + "/" + rows.length;
    });
  }

  function abilityDetail(root, id, params) {
    const a = Dex.ability(id);
    if (!a) {
      root.appendChild(el("div", "empty", "Ability not found."));
      return;
    }
    const head = el("header", "page__head");
    head.appendChild(el("h1", "page__title", a.label));
    if (a.description) head.appendChild(el("p", "page__sub", a.description));
    root.appendChild(head);

        const users = Dex.usersOfAbility(a.id);
    const section = el("section", "card");
    section.appendChild(el("h2", "card__title", "Pokémon (" + users.length + ")"));

    if (!users.length) {
      section.appendChild(el("div", "empty", "No Pokémon."));
      root.appendChild(section);
      return;
    }

    const q = params || new URLSearchParams();
    const sort = q.get("sort") || "dex";
    const dir = q.get("dir") === "more" ? -1 : 1;
        const wrap = el("div", "tablewrap tablewrap--narrow");
    wrap.appendChild(pokemonTable(sortPokemon(users, sort, dir), sort, dir, q));
    section.appendChild(wrap);
    root.appendChild(section);
  }

    function itemsIndex(root, params) {
        const items = Dex.data.items.filter(function (i) { return i.listed; });
    const head = el("header", "page__head");
    const row = el("div", "page__titlerow");
    row.append(el("h1", "page__title", "Items"),
      el("span", "page__count", String(items.length)));
    head.appendChild(row);
    const bar = el("div", "sortbar");
    const wrap = el("div", "sortbar__group");
    wrap.appendChild(el("span", "sortbar__label", "Search: "));
    const input = el("input", "minisearch");
    input.type = "search";
    input.placeholder = "item name…";
    input.value = params.get("q") || "";
    wrap.appendChild(input);
    bar.appendChild(wrap);
    head.appendChild(bar);
    root.appendChild(head);

        const table = el("div", "dextable");
    const rows = [];
    items
      .slice()
      .sort(function (a, b) {
        return Dex.itemLabel(a.name).localeCompare(Dex.itemLabel(b.name), "en");
      })
      .forEach(function (item) {
        const line = el("div", "irow");
        const nameBox = el("div", "irow__name");
        const link = el("a", "alink irow__link");
        const inner = el("span");
        if (item.icon) {
          const spriteBox = el("span", "isprite");
          const img = el("img", "isprite__img");
          img.src = Dex.itemIcon(item.icon);
          img.alt = "";
          img.width = 24;
          img.height = 24;
          spriteBox.appendChild(img);
          inner.appendChild(spriteBox);
        }
        inner.appendChild(el("span", null, Dex.itemLabel(item.name)));
        link.appendChild(inner);
        nameBox.appendChild(link);
        line.appendChild(nameBox);
        line.appendChild(Object.assign(el("div", "irow__desc", item.description || "—"), { title: item.description || "" }));
        line.dataset.search = item.name.toLowerCase();
        line.dataset.pocket = item.pocket;
        table.appendChild(line);
        rows.push(line);
      });

        function stripe() {
      let n = 0;
      rows.forEach(function (node) {
        if (node.hidden) return;
        node.classList.toggle("irow--odd", n % 2 === 0);
        node.classList.toggle("irow--even", n % 2 === 1);
        n++;
      });
    }
    stripe();

    root.appendChild(table);

    function refresh() {
      const term = input.value.trim().toLowerCase();
      let visible = 0;
      rows.forEach(function (tr) {
        const ok = !term || tr.dataset.search.indexOf(term) !== -1;
        tr.hidden = !ok;
        if (ok) visible++;
      });
      stripe();
      row.querySelector(".page__count").textContent = visible + "/" + rows.length;
    }
    input.addEventListener("input", refresh);
    refresh();
  }

      const GENDER_SIGN = { m: "♂", f: "♀" };
    const NATURE_STAT = {
    atk: "Atk", def: "Def", spe: "Spe", spa: "SpA", spd: "SpD",
  };

  function teamsIndex(root) {
    const times = Dex.teams();
    const head = el("header", "page__head");
    const row = el("div", "page__titlerow");
    row.append(el("h1", "page__title", "Teams"),
      el("span", "page__count", String(times.length)));
    head.appendChild(row);
    root.appendChild(head);

    if (!times.length) {
      root.appendChild(el("div", "empty", "No teams found."));
      return;
    }
    times.forEach(function (t) {
      root.appendChild(teamBlock(t));
    });
        root.appendChild(natureTable());
  }

  function teamBlock(t) {
    const sec = el("section", "team");
    const head = el("header", "team__head");

        if (t.pic) {
      const pic = el("div", "team__pic");
      const img = el("img", "team__img");
      img.src = "assets/trainers/" + t.pic + ".png";
      img.alt = t.lider;
      img.width = 64;
      img.height = 64;
      pic.appendChild(img);
      head.appendChild(pic);
    }

    const meta = el("div", "team__meta");
        meta.appendChild(el("p", "team__class",
      t.classe + (t.rematch ? " · Rematch" : "")));
    meta.appendChild(el("h2", "team__name", t.lider));
    meta.appendChild(el("p", "team__place", t.local));
    head.appendChild(meta);
    sec.appendChild(head);

    const party = el("div", "team__party");
    (t.pokemon || []).forEach(function (mon) {
      party.appendChild(teamMon(mon));
    });
    sec.appendChild(party);
    return sec;
  }

    function teamFact(label, valueNode) {
    const cell = el("div", "tmon__fact");
    cell.appendChild(el("span", "tmon__k", label));
    const v = el("span", "tmon__v");
    if (typeof valueNode === "string") v.textContent = valueNode;
    else if (valueNode) v.appendChild(valueNode);
    cell.appendChild(v);
    return cell;
  }

  function teamMon(mon) {
    const card = el("div", "tmon");
    const p = mon.slug ? Dex.pokemon(mon.slug) : null;

        const top = el("div", "tmon__top");

    const pic = el("div", "tmon__pic");
    if (p) {
      const img = el("img", "tmon__img");
      img.src = Dex.sprite(p.slug, mon.shiny ? "front_shiny" : "front_normal");
      img.alt = p.label;
      img.width = 96;
      img.height = 96;
            const a = el("a", "tmon__piclink");
      a.href = "#/pokemon/" + p.slug;
      a.setAttribute("aria-label", p.label);
      a.appendChild(img);
      pic.appendChild(a);
    }
    top.appendChild(pic);

    const info = el("div", "tmon__info");
    info.appendChild(teamFact("Types",
      p ? Dex.typeTags(p.types, null, true) : "—"));

    const ab = Dex.ability(mon.habilidade);
    if (ab) {
            const link = el("a", "alink", ab.label);
      link.href = "#/abilities/" + Dex.abilitySlug(ab.id);
      link.title = ab.description || "";
      info.appendChild(teamFact("Ability", link));
    } else {
      info.appendChild(teamFact("Ability", "None"));
    }

    const item = mon.item ? Dex.item(mon.item) : null;
    if (item) {
      const box = el("span", "tmon__item");
      const icon = el("span", "tmon__itemicon");
      icon.style.backgroundImage = "url(" + Dex.itemIcon(item.icon) + ")";
      box.appendChild(icon);
      box.appendChild(document.createTextNode(Dex.itemLabel(item.name)));
      info.appendChild(teamFact("Held item", box));
    } else {
      info.appendChild(teamFact("Held item", "None"));
    }

        const nat = el("span", "tmon__nature");
    if (mon.natureza) {
      nat.appendChild(document.createTextNode(mon.natureza));
      (mon.natureza_stats || []).slice()
                .sort(function (a, b) { return b[1] - a[1]; })
        .forEach(function (par) {
          nat.appendChild(el("span",
            "tmon__natstat " + (par[1] > 0 ? "is-up" : "is-down"),
            (par[1] > 0 ? "+" : "−") + (NATURE_STAT[par[0]] || par[0])));
        });
    } else {
      nat.textContent = "—";
    }
    info.appendChild(teamFact("Nature", nat));
    top.appendChild(info);
    card.appendChild(top);

        const idRow = el("div", "tmon__id");
    if (p) {
      const link = el("a", "tmon__name", p.label);
      link.href = "#/pokemon/" + p.slug;
      idRow.appendChild(link);
    } else {
      idRow.appendChild(el("span", "tmon__name", "—"));
    }
    const sign = GENDER_SIGN[mon.genero];
        if (sign) {
      idRow.appendChild(el("span",
        "tmon__gender tmon__gender--" + (mon.genero === "f" ? "f" : "m"), sign));
    }
        idRow.appendChild(el("span", "tmon__lv",
      mon.nivel ? "Lv. " + mon.nivel : "Lv. ??"));
    card.appendChild(idRow);

        const moves = el("div", "tmon__moves");
    (mon.golpes || []).forEach(function (id) {
      const m = Dex.move(id);
      if (!m) return;
            const hp = Dex.moveSlug(m) === "hidden-power";
      const tipo = hp ? (mon.hp_tipo || m.type) : m.type;
      const categoria = hp ? (mon.hp_categoria || m.category) : m.category;

      const chip = el("div", "tmove");
      const link = el("a", "tmove__name", Dex.moveLabel(m.label));
      link.href = "#/moves/" + Dex.moveSlug(m);
      chip.appendChild(link);
      const tags = el("div", "tmove__tags");
      tags.appendChild(Dex.typeBadge(tipo));
      tags.appendChild(el("span", "c-cat c-cat--" + categoria,
        CATEGORY_LABEL[categoria] || categoria));
      chip.appendChild(tags);
      moves.appendChild(chip);
    });
    card.appendChild(moves);
    return card;
  }

    const NEUTRAS = ["Hardy", "Docile", "Bashful", "Quirky", "Serious"];

  function natureTable() {
    const lista = window.TEAMS && window.TEAMS.natures;
    if (!lista || !lista.length) return document.createDocumentFragment();
        const stats = ["atk", "def", "spa", "spd", "spe"];

        const celulas = {};
    lista.forEach(function (n) {
      let sobe = null, desce = null;
      Object.keys(n.stats || {}).forEach(function (k) {
        if (n.stats[k] > 0) sobe = k;
        else desce = k;
      });
      if (!sobe && !desce) return;
      celulas[sobe + "/" + desce] = n.nome;
    });
    stats.forEach(function (k, i) {
      celulas[k + "/" + k] = NEUTRAS[i] || "";
    });

    const sec = el("section", "ntab");
    sec.appendChild(el("h2", "ntab__title", "Nature table"));

    const grid = el("div", "ntab__grid");
        grid.appendChild(el("div", "ntab__corner"));
    stats.forEach(function (k) {
      const h = el("div", "ntab__colhead");
      h.appendChild(el("span", "ntab__arrow", "↓"));
      h.appendChild(el("span", "ntab__stat", NATURE_STAT[k]));
      grid.appendChild(h);
    });
        stats.forEach(function (linha) {
      const h = el("div", "ntab__rowhead");
      h.appendChild(el("span", "ntab__arrow", "↑"));
      h.appendChild(el("span", "ntab__stat", NATURE_STAT[linha]));
      grid.appendChild(h);
      stats.forEach(function (coluna) {
        const nome = celulas[linha + "/" + coluna];
        grid.appendChild(el("div",
          "ntab__cell" + (linha === coluna ? " is-neutral" : ""),
          nome || ""));
      });
    });
    sec.appendChild(grid);
    return sec;
  }

        const LOREM_LONG = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
  const LOREM_MID = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore.";
  const LOREM_SHORT = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.";

    const FEATURES = [
    ["Lorem ipsum", LOREM_LONG, "#/pokemon"],
    ["Lorem ipsum", LOREM_LONG, "#/moves"],
    ["Lorem ipsum", LOREM_LONG, "#/abilities"],
    ["Lorem ipsum", LOREM_SHORT, "#/items"],
    ["Lorem ipsum", LOREM_MID, "#/types"],
    ["Lorem ipsum", LOREM_LONG, "#/teams"],
    ["Lorem ipsum", LOREM_SHORT, "#/pokemon/1"],
    ["Lorem ipsum", LOREM_LONG, "#/types"],
    ["Lorem ipsum", LOREM_SHORT, "#/teams"],
    ["Lorem ipsum", LOREM_LONG, "#/search"],
    ["Lorem ipsum", LOREM_SHORT, "#/teams"],
    ["Lorem ipsum", LOREM_MID, "#/pokemon"],
    ["Lorem ipsum", LOREM_LONG, "#/teams"],
    ["Lorem ipsum", LOREM_SHORT, "#/downloads"],
    ["Lorem ipsum", LOREM_LONG, "#/pokemon"],
    ["Lorem ipsum", LOREM_SHORT, "#/downloads"],
    ["Lorem ipsum", LOREM_LONG, "#/pokemon"],
    ["Lorem ipsum", LOREM_SHORT, "#/downloads"],
  ];

    const DOWNLOADS = [
    ["Lorem ipsum", LOREM_LONG, "data/pokedex.json"],
    ["Lorem ipsum", LOREM_SHORT, "data/pokedex.js"],
    ["Lorem ipsum", LOREM_LONG, "data/learnsets.js"],
  ];

    const FAMILIA_PAR = [["tauros", "miltank"]];

    const FAMILIA_DIVIDIDA = ["eevee"];

  function downloadsIndex(root) {
    root.appendChild(el("h1", "page__title", "Download"));

        const feat = el("section", "dlsec");
    feat.appendChild(el("h2", "dlsec__title", "Features"));
    const flist = el("ul", "feats");
    FEATURES.forEach(function (f) {
      const li = el("li", "feat");
            li.appendChild(el("span", "feat__name", f[0]));
      li.appendChild(el("p", "feat__desc", f[1]));
      flist.appendChild(li);
    });
    feat.appendChild(flist);
    root.appendChild(feat);

    root.appendChild(el("hr", "dlsep"));

        const down = el("section", "dlsec");
    down.appendChild(el("h2", "dlsec__title", "Downloads"));
    const dlist = el("div", "dls");
    DOWNLOADS.forEach(function (d) {
      const row = el("div", "dlrow");
      const link = el("a", "alink dlrow__file", d[0]);
            link.href = d[0];
      link.setAttribute("download", d[0].split("/").pop());
      row.appendChild(link);
      row.appendChild(el("p", "dlrow__desc", d[1]));
      dlist.appendChild(row);
    });
    down.appendChild(dlist);
    root.appendChild(down);

    root.appendChild(el("hr", "dlsep"));

        const sheet = el("section", "dlsec");
    sheet.appendChild(el("h2", "dlsec__title", "Pokémon Sprites"));

        const familias = Dex.evolutionFamilies();

        const linhas = [];
    familias.forEach(function (grupo) {
      const base = grupo[0];
      const par = FAMILIA_PAR.filter(function (p) {
        return p.indexOf(base.slug) >= 0;
      })[0];
      if (par) {
        const m = par.map(function (slug) { return Dex.bySlug(slug); })
          .filter(Boolean);
        if (m.length !== 2) return;
                linhas.push({
          via: "par",
          grupo: par[0] === base.slug ? [m[0], m[1]] : [m[1], m[0]],
        });
        return;
      }
      if (FAMILIA_DIVIDIDA.indexOf(base.slug) >= 0) {
        Dex.evolutionPaths(base).forEach(function (c) {
          linhas.push({
            via: "evo",
            grupo: c.map(function (s) { return Dex.bySlug(s.slug); })
              .filter(Boolean),
          });
        });
        return;
      }
      linhas.push({ via: "evo", grupo: grupo });
    });

    const sheetBox = el("div", "sheet");
    linhas.forEach(function (linha) {
      const row = el("div", "sheet__row");
      linha.grupo.forEach(function (p, i) {
                if (i) {
          row.appendChild(el("span", "sheet__arrow", linha.via === "par" ? "↔" : "→"));
        }
        const stage = el("div", "sheet__stage");
        const label = el("a", "sheet__label", "#" + String(p.id).padStart(3, "0") + " ");
        label.appendChild(nameWithSign(p.label));
        label.href = "#/pokemon/" + p.slug;
        label.title = p.label;
        stage.appendChild(label);

        const pair = el("div", "sheet__pair");
                [["front_normal", "Normal"], ["front_shiny", "Shiny"]].forEach(function (par) {
          const box = el("a", "sheet__box");
          box.href = "#/pokemon/" + p.slug;
          box.title = p.label + " · " + par[1];
          const img = el("img", "sheet__img");
          img.src = Dex.sprite(p.slug, par[0]);
          img.alt = p.label + " " + par[1].toLowerCase();
          img.loading = "lazy";
          img.width = 128;
          img.height = 128;
          box.appendChild(img);
          pair.appendChild(box);
        });
        stage.appendChild(pair);
        row.appendChild(stage);
      });
      sheetBox.appendChild(row);
    });
    sheet.appendChild(sheetBox);
    root.appendChild(sheet);
  }

      const TYPE_ORDER = ["normal", "fire", "grass", "water", "electric", "bug",
    "flying", "rock", "poison", "ground", "ice", "fighting", "psychic",
    "ghost", "dragon", "dark", "steel"];

    function typesIndex(root) {
    const all = Dex.data.types;
    const names = TYPE_ORDER.filter(function (n) {
      return all.some(function (t) { return t.name === n; });
    });

    root.appendChild(el("h1", "page__title", "Types"));

    const table = el("table", "typechart");
    const thead = el("thead");
const hr = el("tr");
        hr.appendChild(el("th"));
    names.forEach(function (n) {
      const th = el("th");
      const box = el("div");
      box.appendChild(Dex.typeBadge(n, null, true));
      th.appendChild(box);
      hr.appendChild(th);
    });
    thead.appendChild(hr);
    table.appendChild(thead);

    const tbody = el("tbody");
    names.forEach(function (atk) {
      const t = all.find(function (x) { return x.name === atk; });
      const row = el("tr");
      const th = el("th", null, null);
      th.setAttribute("scope", "row");
      th.appendChild(Dex.typeBadge(atk, null, true));
      row.appendChild(th);

      names.forEach(function (tgt) {
        const td = el("td");
        const m = (t.chart && t.chart[tgt] !== undefined) ? t.chart[tgt] : 1.0;
        td.appendChild(el("div", "typechart__m typechart__m--" + multClass(m), multText(m)));
        row.appendChild(td);
      });
      tbody.appendChild(row);
    });
    table.appendChild(tbody);
        const chartWrap = el("div", "typechartwrap");
    chartWrap.appendChild(table);
    root.appendChild(chartWrap);

    root.appendChild(soloDefenseBlock());
    root.appendChild(ivSpreadBlock());
  }

    function ivSpreadBlock() {
    const list = Dex.ivSpreads();
    if (!list.length) return document.createDocumentFragment();

    const wrap = el("section", "ivs");
    wrap.appendChild(el("h2", "ivs__title", "IV Spreads | Hidden Power"));

    const grid = el("div", "ivs__grid");
    list.forEach(function (entry) {
      const name = String(entry.tipo || "").toLowerCase();
      const block = el("div", "ivs__block");

      const head = el("div", "ivs__head");
            const badge = Dex.typeBadge(name, null, true);
      if (!Dex.data.types.some(function (t) { return t.name === name; })) {
        badge.classList.add("type--unknown");
      }
      head.appendChild(badge);
      block.appendChild(head);

      const rows = el("div", "ivs__rows");
      (entry.spreads || []).forEach(function (spread) {
        const line = el("div", "ivs__row");
                spread.forEach(function (iv) {
          line.appendChild(el("span", "ivs__iv" + (iv === 31 ? " is-31" : ""),
            String(iv)));
        });
        rows.appendChild(line);
      });
      block.appendChild(rows);
      grid.appendChild(block);
    });
    wrap.appendChild(grid);
    return wrap;
  }

  function multText(m) {
    if (m === 0) return "×0";
    if (m >= 2) return "×2";
    if (m <= 0.5) return "×½";
    return "×1";
  }

  function multClass(m) {
    if (m === 0) return "x0";
    if (m >= 2) return "x2";
    if (m <= 0.5) return "xh";
    return "x1";
  }

    function soloDefenseBlock() {
    const MAX_TYPES = 2;
    let chosen = [];
    let ability = "";

    const wrap = el("section", "solo");

    const pick = el("div", "solo__pick");
    pick.appendChild(el("span", "solo__label", "Choose defending Pokémon types"));
    const typeGrid = el("div", "solo__types");

    const abilityBox = el("div", "solo__ability");
    abilityBox.appendChild(el("span", "solo__label", "Choose ability"));
    const sel = el("select", "miniselect solo__select");
    sel.appendChild(new Option("None", ""));
    Object.keys(Dex.soloAbilities)
      .map(function (key) { return [key, Dex.soloAbilityLabel(key)]; })
      .filter(function (x) { return x[1]; })
      .sort(function (a, b) { return a[1].localeCompare(b[1]); })
      .forEach(function (x) { sel.appendChild(new Option(x[1], x[0])); });
    sel.addEventListener("change", function () {
      ability = sel.value;
      refresh();
    });
    abilityBox.appendChild(sel);

    const clear = el("button", "btn btn--ghost solo__clear", "Clear choices");
    clear.type = "button";
    clear.addEventListener("click", function () {
      chosen = [];
      ability = "";
      sel.value = "";
      refresh();
    });

    pick.appendChild(typeGrid);
    pick.appendChild(abilityBox);
    pick.appendChild(clear);

    const out = el("div", "solo__out");

        function refresh() {
      typeGrid.textContent = "";
      TYPE_ORDER.forEach(function (name) {
        if (!Dex.data.types.some(function (t) { return t.name === name; })) return;
        const on = chosen.indexOf(name) !== -1;
        const label = Dex.typeLabel(name);
        const b = el("button", "chip chip--type solo__chip type type--" + name, label);
        b.type = "button";
        b.style.setProperty("--tc", TYPE_COLORS[name]);
        b.classList.toggle("is-on", on);
        b.setAttribute("aria-pressed", on ? "true" : "false");
        b.title = on ? "Remove " + label : "Defend with " + label;
        b.addEventListener("click", function () {
          const i = chosen.indexOf(name);
          if (i !== -1) {
            chosen.splice(i, 1);
          } else {
            chosen.push(name);
                        if (chosen.length > MAX_TYPES) chosen.shift();
          }
          refresh();
        });
        typeGrid.appendChild(b);
      });

      out.textContent = "";
      const grupos = {};
      TYPE_ORDER.forEach(function (name) {
        if (!Dex.data.types.some(function (t) { return t.name === name; })) return;
        const m = Dex.defenseMultiplier(name, chosen, ability);
        if (!grupos[m]) grupos[m] = [];
        grupos[m].push(name);
      });
      Object.keys(grupos)
        .map(Number)
        .sort(function (a, b) { return b - a; })
        .forEach(function (m) {
          const box = el("div", "solo__group");
          box.appendChild(el("span", "solo__label", "Takes " + Dex.multText(m) + "× from"));
          const grid = el("div", "solo__result");
          grupos[m].forEach(function (name) {
            grid.appendChild(Dex.typeBadge(name, null, true));
          });
          box.appendChild(grid);
          out.appendChild(box);
        });
    }

    wrap.appendChild(pick);
    wrap.appendChild(out);
    refresh();
    return wrap;
  }

    function typeDetail(root, name, params) {
   const t = Dex.data.types.find(function (x) { return x.name === name; });
    if (!t) {
      root.appendChild(el("div", "empty", "Unknown type."));
      return;
    }

    root.appendChild(el("h1", "page__title tpage__title", t.label));

        const eff = el("div", "teff");

    const atk = el("div", "teff__col");
    atk.appendChild(el("h2", "teff__title", "Offensive Effectiveness"));
    atk.appendChild(effRow("No effect against:", t.immune, true));
    atk.appendChild(effRow("Weak against:", t.resist, false));
    atk.appendChild(effRow("Strong against:", t.weak, false));

    const def = el("div", "teff__col");
    def.appendChild(el("h2", "teff__title", "Defensive Effectiveness"));
    def.appendChild(effRow("Immune to:", t.def_immune, true));
    def.appendChild(effRow("Resists:", t.def_resist, false));
    def.appendChild(effRow("Weak to:", t.def_weak, false));

    eff.appendChild(atk);
    eff.appendChild(def);
    root.appendChild(eff);

    const mons = Dex.data.pokemon.filter(function (p) {
      return p.types.indexOf(t.name) !== -1;
    });

    const q = params || new URLSearchParams();
    const pKeys = { sort: "psort", dir: "pdir" };
    const mKeys = { sort: "msort", dir: "mdir" };

    root.appendChild(el("h2", "tpage__h2", "Pokémon"));
    if (!mons.length) {
      root.appendChild(el("div", "empty", "No Pokémon of this type."));
    } else {
      const sort = q.get(pKeys.sort) || "dex";
      const dir = q.get(pKeys.dir) === "more" ? -1 : 1;

      const bar = el("div", "sortbar");
      const group = el("div", "sortbar__group");
      group.appendChild(el("span", "sortbar__label", "Search: "));
      const input = el("input", "minisearch");
      input.type = "search";
      input.placeholder = "pok\u00e9mon name\u2026";
      input.value = q.get("q") || "";
      group.appendChild(input);
      const count = el("span", "page__count", String(mons.length));
      group.appendChild(count);
      bar.appendChild(group);
      root.appendChild(bar);

      const wrap = el("div", "tablewrap tablewrap--narrow");
      const table = pokemonTable(sortPokemon(mons, sort, dir), sort, dir, q, "ptable--typepage", pKeys);
      wrap.appendChild(table);
      root.appendChild(wrap);

      const tbody = table.querySelector("tbody");
      const rows = Array.prototype.slice.call(tbody.rows);
      const nothing = el("div", "empty");
      nothing.hidden = true;
      root.appendChild(nothing);

          function stripe() {
        let n = 0;
        rows.forEach(function (tr) {
          if (tr.hidden) return;
          tr.classList.toggle("is-odd", n % 2 === 0);
          tr.classList.toggle("is-even", n % 2 === 1);
          n++;
        });
      }

          function refresh() {
        const term = input.value.trim().toLowerCase();
        const digits = term.replace(/\D+/g, "");
        let visible = 0;
        rows.forEach(function (tr) {
          const hit = !term || tr.dataset.search.indexOf(term) !== -1
            || (digits !== "" && tr.dataset.id.indexOf(digits) === 0);
          tr.hidden = !hit;
          if (hit) visible++;
        });
        stripe();
        count.textContent = visible + "/" + rows.length;
        nothing.textContent = "Nothing found for \u201c" + input.value.trim() + "\u201d";
        nothing.hidden = !term || visible > 0;
      }
      input.addEventListener("input", refresh);
      refresh();
    }

        const moves = Dex.data.moves.filter(function (m) {
      return m.type === t.name;
    });

    root.appendChild(el("h2", "tpage__h2", "Moves"));
    if (!moves.length) {
      root.appendChild(el("div", "empty", "No moves of this type."));
      return;
    }
    movesTable(moves, params, root, null, mKeys);
  }

    function effRow(label, names, immune) {
    const dl = el("dl", "teff__list");
    dl.appendChild(el("dt", null, label));
    const dd = el("dd");
    if (!names.length) {
      dd.appendChild(el("span", "muted", "—"));
    } else {
      const list = el("span", "ttags");
      names.forEach(function (n) {

        list.appendChild(Dex.typeBadge(n, null, true));
      });
      dd.appendChild(list);
    }
    dl.appendChild(dd);
    return dl;
  }

    function searchPage(root, params) {
    const head = el("header", "page__head");
    head.appendChild(el("h1", "page__title", "Search"));
    root.appendChild(head);

    const form = el("form", "bigsearch");
    const input = el("input", "bigsearch__input");
    input.type = "search";
    input.placeholder = "Pokémon, move, ability or item…";
    input.value = params.get("q") || "";
    input.autofocus = true;
    form.appendChild(input);

    const typeBox = el("div", "searchtypes");
    typeBox.appendChild(typeFilter(params));

    const results = el("div", "sresults");

function run() {
   const term = input.value.trim().toLowerCase();
   results.innerHTML = "";
      if (!term) return;

      const mons = Dex.data.pokemon.filter((p) =>
        p.label.toLowerCase().indexOf(term) !== -1 || String(p.id) === term
      ).slice(0, 24);
      const moves = Dex.data.moves.filter((m) =>
        m.label.toLowerCase().indexOf(term) !== -1
      ).slice(0, 24);
      const abis = Dex.data.abilities.filter((a) =>
        a.label.toLowerCase().indexOf(term) !== -1
      ).slice(0, 24);
      const items = Dex.data.items.filter((i) =>
        i.name.toLowerCase().indexOf(term) !== -1
      ).slice(0, 24);

      section("Pokémon", mons, (p) => "#/pokemon/" + p.slug, (p) => nameWithSign(p.label), "icon");
      section("Moves", moves, (m) => "#/moves/" + Dex.moveSlug(m), (m) => Dex.moveLabel(m.label));
      section("Abilities", abis, (a) => "#/abilities/" + Dex.abilitySlug(a.id), (a) => a.label);
      section("Items", items, (i) => "#/items", (i) => Dex.itemLabel(i.name));

      if (!mons.length && !moves.length && !abis.length && !items.length) {
        results.appendChild(el("p", "muted", "Nothing found for “" + input.value + "”."));
      }
    }

    function section(title, itemsList, href, label, spriteKind) {
      if (!itemsList.length) return;
      const box = el("div", "sgroup");
      box.appendChild(el("h2", "sgroup__title", title + " (" + itemsList.length + ")"));
      const chips = el("div", "chips");
      itemsList.forEach(function (item) {
        const a = el("a", "monchip" + (spriteKind ? " monchip--icon" : ""));
        a.href = href(item);
        if (spriteKind) a.appendChild(Dex.iconBox(item.slug, false, true));
        const text = label(item);
        a.appendChild(typeof text === "string" ? el("span", null, text) : text);
        chips.appendChild(a);
      });
      box.appendChild(chips);
      results.appendChild(box);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
    });
    input.addEventListener("input", run);
    root.appendChild(form);
    root.appendChild(typeBox);
    root.appendChild(results);
    run();
  }

  return {
    pokemonList: pokemonList,
    pokemonDetail: pokemonDetail,
    movesIndex: movesIndex,
    moveDetail: moveDetail,
    abilitiesIndex: abilitiesIndex,
    abilityDetail: abilityDetail,
    itemsIndex: itemsIndex,
    typesIndex: typesIndex,
    downloadsIndex: downloadsIndex,
    teamsIndex: teamsIndex,
    typeDetail: typeDetail,
    searchPage: searchPage,
  };
})();
