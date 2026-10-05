const SPRITE_DIR = "assets/sprites/";

const TYPE_COLORS = {
  normal: "#a8a878",
  fire: "#f0803c",
  water: "#5b8fe0",
  electric: "#f2c93b",
  grass: "#6fbf52",
  ice: "#7fd4d8",
  fighting: "#d1443c",
  poison: "#9c4fb4",
  ground: "#c79a4b",
  flying: "#9b8ce0",
  psychic: "#ee5a8b",
  bug: "#9aa824",
  rock: "#a8923c",
  ghost: "#6b4a94",
  dragon: "#6a3ce0",
  dark: "#6b4a3c",
  steel: "#94a8b8",
  mystery: "#7c8894",
};

const STAT_META = [
  { key: "hp", short: "HP" },
  { key: "atk", short: "Atk" },
  { key: "def", short: "Def" },
  { key: "spa", short: "SpA" },
  { key: "spd", short: "SpD" },
  { key: "spe", short: "Spe" },
];

const METHODS = [
  ["level", "Level up", "Level up"],
  ["tm", "TM", "TM"],
  ["hm", "HM", "HM"],
  ["tutor", "Move Tutor", "Move Tutor"],
  ["egg", "Egg Move", "Egg Move"],
  ["event", "Event Move", "Event Move"],
];

const METHOD_ORDER = {};
METHODS.forEach((m, i) => { METHOD_ORDER[m[0]] = i; });

const CATEGORY_LABEL = {
  physical: "Physical",
  special: "Special",
  status: "Status",
};

const Dex = (function () {
  let data = null;
  let typeByName = {};
  let moveById = {};
  let abilityById = {};
let itemById = {};
  let pokemonById = {};
  let pokemonBySlug = {};

  function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function capitalize(text) {
    if (!text) return "";
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

    function moveLabel(text) {
    if (!text) return "";
    const lower = text.toLowerCase();

    return lower.replace(/(^|[\s\-/&])(\w)/g, function (all, sep, ch) {
      return sep + ch.toUpperCase();
    });
  }

    function itemLabel(text) {
    return moveLabel(text);
  }

    function itemIcon(slug) {
    return slug ? "assets/items/" + slug + ".png" : "";
  }

  function typeLabel(name) {
        if (name === "mystery") return "???";
    const t = typeByName[name];
    return t ? t.label : capitalize(name);
  }

      function moveInfo(m) {
    const info = window.MOVEINFO && window.MOVEINFO.moves;
    if (!info) return null;
    return info[m.label] || null;
  }

    function targetLabel(id) {
    if (!id) return "";
    let s = id;
    if (id === "Scripted") s = "DamageDealer";
    else if (id === "Normal") s = "AnyAdjacent";
    else if (id === "RandomNormal") s = "RandomAdjacentFoe";
    s = s.replace(/([a-z0-9])([A-Z])/g, "$1 $2");

    return s.charAt(0) + s.slice(1).toLowerCase();
  }

    function moveFlags(m) {
    const info = moveInfo(m);
    if (!info || !info.flags || !info.flags.length) return [];
    const dict = (window.MOVEINFO && window.MOVEINFO.meta.flagDescriptions) || {};
    return info.flags
      .map((f) => dict[f])
      .filter(Boolean);
  }

  function moveTarget(m) {
    const info = moveInfo(m);
    return info ? targetLabel(info.target) : "";
  }

    function moveSlug(m) {
    return norm(m.label);
  }

    const TYPE_ORDER = ["normal", "fire", "grass", "water", "electric", "bug", "flying",
    "rock", "poison", "ground", "ice", "fighting", "psychic", "ghost", "dragon",
    "dark", "steel"];
  const TYPE_RANK = {};
  TYPE_ORDER.forEach(function (n, i) { TYPE_RANK[n] = i; });

  function typeRank(name) {
    return TYPE_RANK[name] === undefined ? 99 : TYPE_RANK[name];
  }

  function typeBadge(name, extra, link) {

    const cls = "type type--" + name + (extra ? " " + extra : "");
    const node = link
      ? el("a", cls, typeLabel(name))
      : el("span", cls, typeLabel(name));
    node.style.setProperty("--tc", TYPE_COLORS[name] || "#6b7280");
    if (link) node.href = "#/types/" + name;
    return node;
  }

  function typeTags(names, extra, link) {
    const wrap = el("span", "ttags");
    names.forEach((n) => wrap.appendChild(typeBadge(n, extra, link)));
    return wrap;
  }

  function sprite(slug, kind) {
    return SPRITE_DIR + slug + "/" + (kind || "icon") + ".png";
  }

    function iconBox(slug, shiny, small, index) {
    const classes = ["mon-icon"];
    if (small) classes.push("mon-icon--sm");
    else if (index !== undefined) classes.push("mon-icon--blink");
    if (shiny) classes.push("mon-icon--shiny");
    const node = el("span", classes.join(" "));
    node.style.backgroundImage = "url(" + sprite(slug, "icon") + ")";
    if (index !== undefined) node.style.setProperty("--i", String(index));
    return node;
  }

    function multiplier(atk, defenders) {
    const type = typeByName[atk];
    if (!type) return 1;
    let total = 1;
    defenders.forEach(function (d) {
      const value = type.damage[d];
      if (typeof value === "number") total *= value;
    });
    return total;
  }

  const MULT_LABEL = {
    0: "0", 0.0625: "1/16", 0.125: "⅛", 0.25: "¼", 0.5: "½", 0.75: "¾",
    1: "1", 1.25: "1¼", 1.5: "1½", 1.75: "1¾", 2: "2", 2.5: "2½",
    3: "3", 4: "4", 6: "6", 8: "8",
  };

  function multText(m) {
    const known = MULT_LABEL[m];
    if (known) return known;
    return String(Math.round(m * 1000) / 1000);
  }

    const SOLO_ABILITIES = {
    levitate: { id: 26, rule: { ground: 0 } },
    flash_fire: { id: 18, rule: { fire: 0 } },
    water_absorb: { id: 11, rule: { water: 0 } },
    volt_absorb: { id: 10, rule: { electric: 0 } },
    lightning_rod: { id: 31, rule: { electric: 0 } },
    motor_drive: { id: 79, rule: { electric: 0 } },
    thick_fat: { id: 47, rule: { fire: 0.5, ice: 0.5 } },
    dry_skin: { id: 85, rule: { fire: 1.25, water: 0 } },
    filter: { id: 102, after: "cut_se" },
    solid_rock: { id: 104, after: "cut_se" },
    wonder_guard: { id: 25, after: "only_se" },
  };

    function defenseMultiplier(atk, defenders, abilityKey) {
    const ab = SOLO_ABILITIES[abilityKey];
    let n = 1;
    if (ab && ab.rule && typeof ab.rule[atk] === "number") n *= ab.rule[atk];
    n *= multiplier(atk, defenders);
        if (ab && ab.after === "only_se" && n <= 1) n = 0;
    if (ab && ab.after === "cut_se" && n > 1) n *= 0.75;
    return n;
  }

    const SOLO_ABILITY_BY_ID = {};
  Object.keys(SOLO_ABILITIES).forEach(function (k) {
    SOLO_ABILITY_BY_ID[SOLO_ABILITIES[k].id] = k;
  });

    function defenseVs(pokemon, atk) {
    let n = 1;
    let after = null;
    pokemon.abilities.filter(function (id, i) {
      return id && pokemon.abilities.indexOf(id) === i;
    }).forEach(function (id) {
      const key = SOLO_ABILITY_BY_ID[id];
      const ab = key ? SOLO_ABILITIES[key] : null;
      if (!ab) return;
      if (ab.rule && typeof ab.rule[atk] === "number") n *= ab.rule[atk];
      if (ab.after) after = ab.after;
    });
    n *= multiplier(atk, pokemon.types);
    if (after === "only_se" && n <= 1) n = 0;
    if (after === "cut_se" && n > 1) n *= 0.75;
    return n;
  }

  function abilityNotes(pokemon) {
    const ids = (pokemon.abilities || []).filter(Boolean);
    const unicos = ids.filter(function (id, i) { return ids.indexOf(id) === i; });
    if (unicos.length < 2) return [];
    const keys = [];
    unicos.forEach(function (id) {
      const key = SOLO_ABILITY_BY_ID[id];
      if (key && keys.indexOf(key) === -1) keys.push(key);
    });
    const notas = [];
    keys.forEach(function (key) {
      const ab = SOLO_ABILITIES[key];
      const parts = [];
      if (ab.after === "only_se") {
        notas.push({ id: ab.id, label: soloAbilityLabel(key) || key, parts: null });
        return;
      }
      data.types.forEach(function (t) {
        const base = multiplier(t.name, pokemon.types);
        const com = defenseMultiplier(t.name, pokemon.types, key);
        if (com !== base) parts.push({ type: t.name, mult: com });
      });
      if (parts.length) {
        notas.push({ id: ab.id, label: soloAbilityLabel(key) || key, parts: parts });
      }
    });
    return notas;
  }

  function soloAbilityLabel(key) {
    const ab = SOLO_ABILITIES[key];
    if (!ab) return null;
    const found = abilityById[ab.id];
    return (found && (found.label || found.name)) || null;
  }

  function move(id) {
    return moveById[id] || null;
  }

    function moveBySlug(slug) {
    if (slug === undefined || slug === null || slug === "") return null;
    const key = String(slug);
    if (/^\d+$/.test(key)) {
      const byId = moveById[parseInt(key, 10)];
      if (byId) return byId;
    }
    const wanted = norm(key);
    return moveBySlugIndex[wanted]
      || moveBySlugIndex[norm(key.replace(/-/g, ""))]
      || moveBySlugIndex[key.toLowerCase().replace(/[^a-z0-9]/g, "")]
      || null;
  }

  function norm(text) {
    return String(text).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  }

  const moveBySlugIndex = {};

  function moveEntry(raw) {
    const m = moveById[raw[0]];
    if (!m) return null;
    return {
      id: m.id,
      label: m.label,
      type: m.type,
      category: m.category,
      power: m.power,
      accuracy: m.accuracy,
      pp: m.pp,
      description: m.description,
      level: raw[1],
      method: raw[2],
      number: raw[1],
    };
  }

    function methodText(m) {
    if (m.method === "level") return "Lv " + m.number;
    if (m.method === "tm") return "TM" + String(m.number).padStart(2, "0");
    if (m.method === "hm") return "HM" + String(m.number).padStart(2, "0");
    const row = METHODS.filter((x) => x[0] === m.method)[0];
    return row ? row[1] : m.method;
  }

      function evolutionFamilies() {
    const evo = window.EVOLUTIONS;
    if (!evo || !evo.edges || !evo.edges.length) return [];
    const parent = {};
    const adj = {};
    evo.edges.forEach(function (e) {
      parent[e[1]] = e[0];
      (adj[e[0]] = adj[e[0]] || []).push(e[1]);
      (adj[e[1]] = adj[e[1]] || []).push(e[0]);
    });

    const seen = {};
    const families = [];
    Object.keys(adj).sort(function (a, b) {
      return (pokemonBySlug[a] ? pokemonBySlug[a].id : 999)
        - (pokemonBySlug[b] ? pokemonBySlug[b].id : 999);
    }).forEach(function (start) {
      if (seen[start]) return;
      const grupo = [];
      const fila = [start];
      seen[start] = true;
      while (fila.length) {
        const slug = fila.shift();
        grupo.push(slug);
        (adj[slug] || []).forEach(function (vizinho) {
          if (seen[vizinho]) return;
          seen[vizinho] = true;
          fila.push(vizinho);
        });
      }
            const raiz = grupo.filter(function (s) { return !parent[s]; })[0] || start;
      const profundidade = {};
      profundidade[raiz] = 0;
      grupo.forEach(function (s) {
        if (profundidade[s] === undefined) {
          profundidade[s] = profundidade[parent[s]] === undefined
            ? 1 : profundidade[parent[s]] + 1;
        }
      });
      grupo.sort(function (a, b) {
        return (profundidade[a] - profundidade[b])
          || ((pokemonBySlug[a] ? pokemonBySlug[a].id : 999)
            - (pokemonBySlug[b] ? pokemonBySlug[b].id : 999));
      });
            families.push(grupo.map(function (slug) { return pokemonBySlug[slug]; })
        .filter(Boolean));
    });

        const dentro = {};
    families.forEach(function (f) {
      f.forEach(function (p) { dentro[p.slug] = true; });
    });
    data.pokemon.forEach(function (p) {
      if (!dentro[p.slug]) families.push([p]);
    });

        const posicao = function (familia) {
      const kanto = familia.filter(function (p) { return p.id <= 151; });
      return Math.min.apply(null, (kanto.length ? kanto : familia).map(function (p) {
        return p.id;
      }));
    };
    families.sort(function (a, b) {
      return posicao(a) - posicao(b) || a[0].id - b[0].id;
    });
    return families;
  }

  function evolutionPaths(pokemon) {
    const evo = window.EVOLUTIONS;
    const slug = pokemon && pokemon.slug;
    if (!evo || !evo.edges || !evo.edges.length || !slug) return [];
    const parent = {}, via = {}, kids = {};
    evo.edges.forEach(function (e) {
      parent[e[1]] = e[0];
      via[e[1]] = e[2];
      (kids[e[0]] = kids[e[0]] || []).push(e[1]);
    });
    if (parent[slug] === undefined && kids[slug] === undefined) return [];

    const trunk = [slug];
    let node = slug;
    for (let g = 0; parent[node] !== undefined && g < 32; g++) {
      node = parent[node];
      trunk.unshift(node);
    }
    const down = [];
    (function walk(at, acc) {
      const next = kids[at];
      if (!next || !next.length || down.length > 32) { down.push(acc.slice()); return; }
      next.forEach(function (k) { acc.push(k); walk(k, acc); acc.pop(); });
    })(slug, []);
    if (!down.length) down.push([]);

    return down.map(function (tail) {
      return trunk.concat(tail).map(function (s, i) {
        const p = pokemonBySlug[s];
        return { slug: s, name: p ? p.label : s, id: p ? p.id : null, via: i === 0 ? null : via[s] };
      });
    });
  }

  function movesOf(pokemon) {
    const rows = ((window.LEARNSETS || {})[pokemon.slug] || []).slice();
    const list = rows.map(moveEntry).filter(Boolean);
    list.sort((a, b) => {
      const d = METHOD_ORDER[a.method] - METHOD_ORDER[b.method];
      if (d) return d;
      if ((a.number || 0) !== (b.number || 0)) return (a.number || 0) - (b.number || 0);
      return moveLabel(a.label).localeCompare(moveLabel(b.label), "en");
    });
    return list;
  }

  function usersOfMove(moveId) {
    const extra = window.LEARNSETS || {};
    return data.pokemon.filter(function (p) {
      return (extra[p.slug] || []).some(function (m) { return m[0] === moveId; });
    });
  }

  function usersOfAbility(abilityId) {
    return data.pokemon.filter((p) => p.abilities.indexOf(abilityId) !== -1);
  }

  const STAT_CAP = 255;

  function statRange(pokemon, key, level) {
    const base = (pokemon.stats && pokemon.stats[key]) || 0;
    if (key === "hp") {
      return [
        Math.floor((2 * base * level) / 100) + level + 10,
        Math.floor(((2 * base + 94) * level) / 100) + level + 10,
      ];
    }
    const lo = Math.round(level * 0.9);
    const hi = Math.round(level * 1.1);
    return [
      Math.floor(((2 * base - 1) * lo) / 100) + 5,
      Math.floor(((2 * base + 94) * hi) / 100) + 5,
    ];
  }

  function statTotal(pokemon) {
    return STAT_META.reduce((sum, s) => sum + (pokemon.stats[s.key] || 0), 0);
  }

  async function load() {
    if (data) return data;

    if (window.POKEDEX) {
      data = window.POKEDEX;
    } else {
      const res = await fetch("data/pokedex.json");
      if (!res.ok) throw new Error("HTTP " + res.status);
      data = await res.json();
    }
    data.types.forEach((t) => (typeByName[t.name] = t));
    data.moves.forEach((m) => {
      moveById[m.id] = m;

      moveBySlugIndex[norm(m.label)] = m;
      moveBySlugIndex[norm(m.label.replace(/\s+/g, ""))] = m;
      moveBySlugIndex[m.label.toLowerCase().replace(/[^a-z0-9]/g, "")] = m;
    });
    data.abilities.forEach((a) => {
      abilityById[a.id] = a;
            abilityBySlug[norm(a.label)] = a;
      abilityBySlug[norm(a.name || a.label)] = a;
    });
    data.pokemon.forEach((p) => { pokemonById[p.id] = p; pokemonBySlug[p.slug] = p; });
        data.items.forEach((i) => { itemById[i.id] = i; });
    return data;
  }

  let learnsetPromise = null;

  function loadLearnsets() {
    if (window.LEARNSETS) return Promise.resolve(window.LEARNSETS);
    if (learnsetPromise) return learnsetPromise;
    learnsetPromise = new Promise(function (resolve, reject) {
      const s = document.createElement("script");
      s.src = "data/learnsets.js";
      s.onload = function () { resolve(window.LEARNSETS); };
      s.onerror = function () { reject(new Error("data/learnsets.js")); };
      document.head.appendChild(s);
    });
    return learnsetPromise;
  }
    function pokemonByRef(ref) {
    if (ref === null || ref === undefined) return null;
    const s = String(ref).trim().toLowerCase();
    if (/^\d+$/.test(s)) return pokemonById[parseInt(s, 10)] || null;
    return pokemonBySlug[s]
      || pokemonBySlug[norm(s)]
            || pokemonBySlug[s.replace(/-/g, "_")]
      || null;
  }
    const abilityBySlug = {};
  function abilityByRef(ref) {
    if (ref === null || ref === undefined) return null;
    const s = String(ref).trim().toLowerCase();
    if (/^\d+$/.test(s)) return abilityById[parseInt(s, 10)] || null;
    return abilityBySlug[s] || abilityBySlug[norm(s)] || null;
  }

  return {

    load: load,
    loadLearnsets: loadLearnsets,
    el: el,
    capitalize: capitalize,
    moveLabel: moveLabel,
    moveInfo: moveInfo,
    moveFlags: moveFlags,
    moveTarget: moveTarget,
    moveSlug: moveSlug,
    targetLabel: targetLabel,
    itemLabel: itemLabel,
    itemIcon: itemIcon,
    typeLabel: typeLabel,
    typeRank: typeRank,
    typeBadge: typeBadge,
    typeTags: typeTags,
    sprite: sprite,
    iconBox: iconBox,
    multiplier: multiplier,
    multText: multText,
    abilityNotes: abilityNotes,
    defenseMultiplier: defenseMultiplier,
    defenseVs: defenseVs,
    soloAbilities: SOLO_ABILITIES,
    soloAbilityLabel: soloAbilityLabel,
    move: move,
    moveBySlug: moveBySlug,
    methodText: methodText,
    evolutionPaths: evolutionPaths,
    evolutionFamilies: evolutionFamilies,
    movesOf: movesOf,
    usersOfMove: usersOfMove,
    usersOfAbility: usersOfAbility,
    statTotal: statTotal,
    statRange: statRange,
    statCap: STAT_CAP,
    ability: abilityByRef,
        abilitySlug: (id) => {
      const a = abilityByRef(id);
      return a ? norm(a.label) : String(id);
    },
    pokemon: pokemonByRef,
        ivSpreads: () => (window.IV_SPREADS && window.IV_SPREADS.tipos) || [],
        teams: () => (window.TEAMS && window.TEAMS.times) || [],
    item: (id) => itemById[id] || null,
    bySlug: (slug) => data.pokemon.filter((p) => p.slug === slug)[0] || null,
    neighbors: function (id) {
      return { prev: pokemonById[id - 1] || null, next: pokemonById[id + 1] || null };
    },
    get data() {
      return data;
    },
  };
})();
