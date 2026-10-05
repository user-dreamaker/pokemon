import argparse
import io
import json
import os
import re
import sys
from collections import Counter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_DECOMP = r"C:\cygwin64\home\Admin\Glorious-Purpose"

SPECIES_H = ""
MOVES_H = ""
LEVEL_UP = ""
LEVEL_PTR = ""
TMHM = ""
TUTOR = ""
EGG = ""
PARTY_MENU = ""

POKEDEX = os.path.join(ROOT, "data", "pokedex.js")
LEARNSETS = os.path.join(ROOT, "data", "learnsets.js")
POKEDEX_JSON = os.path.join(ROOT, "data", "pokedex.json")
EVOLUTIONS = os.path.join(ROOT, "data", "evolutions.js")

ORDEM = ["level", "tm", "hm", "tutor", "event", "egg"]


def configure(decomp):
    global SPECIES_H, MOVES_H, LEVEL_UP, LEVEL_PTR, TMHM, TUTOR, EGG, PARTY_MENU
    SPECIES_H = os.path.join(decomp, "include", "constants", "species.h")
    MOVES_H = os.path.join(decomp, "include", "constants", "moves.h")
    LEVEL_UP = os.path.join(decomp, "src", "data", "pokemon", "level_up_learnsets.h")
    LEVEL_PTR = os.path.join(decomp, "src", "data", "pokemon", "level_up_learnset_pointers.h")
    TMHM = os.path.join(decomp, "src", "data", "pokemon", "tmhm_learnsets.h")
    TUTOR = os.path.join(decomp, "src", "data", "pokemon", "tutor_learnsets.h")
    EGG = os.path.join(decomp, "src", "data", "pokemon", "egg_moves.h")
    PARTY_MENU = os.path.join(decomp, "src", "party_menu.c")


def read(path):
    return io.open(path, encoding="utf-8", errors="replace").read()


def read_json(path, prefix):
    raw = read(path)
    return json.loads(raw[raw.index(prefix) + len(prefix):raw.rindex("}") + 1])


def move_ids():
    return {m[0]: int(m[1]) for m in re.findall(r"#define\s+(MOVE_\w+)\s+(\d+)", read(MOVES_H))}


def species_ids():
    out = {}
    for const, value in re.findall(r"#define\s+(SPECIES_\w+)\s+(\d+)", read(SPECIES_H)):
        sid = int(value)
        if 1 <= sid <= 251:
            out[const] = sid
    return out


def slugs_by_id():
    dex = read_json(POKEDEX, "=")
    return dict((p["id"], p["slug"]) for p in dex["pokemon"])


def parents():
    edges = read_json(EVOLUTIONS, "=")["edges"]
    return dict((b, a) for a, b, _ in edges)


def base_of(slug, pai):
    while slug in pai:
        slug = pai[slug]
    return slug


def level_up_rows(species, mids):
    text = read(LEVEL_UP)
    arrays = {}
    for nome, corpo in re.findall(
        r"static const u16 (s\w+LevelUpLearnset)\[\] = \{(.*?)\n\};", text, re.S
    ):
        arrays[nome] = [(int(nivel), golpe)
                        for nivel, golpe in re.findall(r"LEVEL_UP_MOVE\((\d+),\s*(MOVE_\w+)\)", corpo)]
    pointers = dict(re.findall(r"\[(SPECIES_\w+)\]\s*=\s*(s\w+LevelUpLearnset)", read(LEVEL_PTR)))

    out = {}
    for const, sid in species.items():
        arr = pointers.get(const)
        if not arr:
            continue
        rows = []
        for nivel, golpe in arrays.get(arr, []):
            mid = mids.get(golpe)
            if mid:
                rows.append([mid, nivel, "level"])
        if rows:
            out[sid] = rows
    return out


def blocos(path):
    txt = read(path)
    marcas = [(m.start(), m.group(1)) for m in re.finditer(r"\[(SPECIES_\w+)\]", txt)]
    out = {}
    for i, (inicio, const) in enumerate(marcas):
        fim = marcas[i + 1][0] if i + 1 < len(marcas) else len(txt)
        out[const] = txt[inicio:fim]
    return out


def tmhm_rows(species, mids):
    out = {}
    for const, bloco in blocos(TMHM).items():
        sid = species.get(const)
        if not sid:
            continue
        for tipo, numero, golpe in re.findall(r"TMHM\((TM|HM)(\d+)_(\w+)\)", bloco):
            mid = mids.get("MOVE_" + golpe)
            if mid:
                metodo = "tm" if tipo == "TM" else "hm"
                out.setdefault(sid, []).append([mid, int(numero), metodo])
    return out


def tutor_rows(species, mids):
    out = {}
    for const, bloco in blocos(TUTOR).items():
        sid = species.get(const)
        if not sid:
            continue
        rows = []
        for golpe in re.findall(r"TUTOR\((MOVE_\w+)\)", bloco):
            mid = mids.get(golpe)
            if mid and not any(r[0] == mid for r in rows):
                rows.append([mid, 0, "tutor"])
        if rows:
            out[sid] = rows
    return out


def egg_rows(species, mids):
    out = {}
    for nome, corpo in re.findall(r"egg_moves\((\w+),(.*?)\),", read(EGG), re.S):
        const = "SPECIES_" + nome.upper()
        sid = species.get(const)
        if not sid:
            continue
        rows = []
        for golpe in re.findall(r"MOVE_(\w+)", corpo):
            mid = mids.get("MOVE_" + golpe)
            if mid:
                rows.append([mid, 0, "egg"])
        if rows:
            out[sid] = rows
    return out


def trecho(txt, assinatura):
    for m in re.finditer(re.escape(assinatura) + r"\s*\{", txt):
        resto = txt[m.end():]
        fim = re.search(r"\n(?:static |void |bool8 |u8 |u16 |u32 |s8 |s16 |s32 |enum |struct )",
                        resto)
        return txt[m.start():m.end() + (fim.start() if fim else len(resto))]
    return ""


def event_rows(species, mids):
    if not os.path.exists(PARTY_MENU):
        return {}
    txt = read(PARTY_MENU)
    mapa = dict(re.findall(r"case (TUTOR_MOVE_\w+):\s*return (MOVE_\w+);", txt))
    corpo = trecho(txt, "static bool8 CanLearnTutorMove(u16 species, u8 tutor)")
    marcas = [(m.start(), m.group(1)) for m in re.finditer(r"case (TUTOR_MOVE_\w+):", corpo)]
    out = {}
    for i, (pos, tutor) in enumerate(marcas):
        fim = marcas[i + 1][0] if i + 1 < len(marcas) else len(corpo)
        bloco = corpo[pos:fim]
        especies = set(re.findall(r"case (SPECIES_\w+):", bloco))
        especies |= set(re.findall(r"species == (SPECIES_\w+)", bloco))
        if not especies:
            continue
        mid = mids.get(mapa.get(tutor, ""))
        if not mid:
            continue
        for const in especies:
            sid = species.get(const)
            if sid:
                out.setdefault(sid, []).append(mid)
    return dict((sid, sorted(set(rows))) for sid, rows in out.items())


def eventos_antigos():
    if not os.path.exists(LEARNSETS):
        return {}
    atual = read_json(LEARNSETS, "=")
    out = {}
    for slug, rows in atual.items():
        ev = [[r[0], r[1], r[2]] for r in rows if len(r) > 2 and r[2] == "event"]
        if ev:
            out[slug] = ev
    return out


def main(argv=None):
    parser = argparse.ArgumentParser(
        description="Extrai os golpes aprendidos de cada especie e escreve data/learnsets.js.",
        epilog="python tools/build_learnsets.py --decomp C:\\caminho\\do\\decomp",
    )
    parser.add_argument("--decomp", default=DEFAULT_DECOMP,
                        help="raiz do decomp (padrao: %s)" % DEFAULT_DECOMP)
    parser.add_argument("--check", action="store_true",
                        help="so confere e imprime, sem escrever data/learnsets.js")
    parser.add_argument("--no-json", action="store_true",
                        help="nao reescreve data/pokedex.json")
    args = parser.parse_args(argv)
    configure(args.decomp)

    mids = move_ids()
    species = species_ids()
    slugs = slugs_by_id()
    pai = parents()

    por_metodo = {
        "level": level_up_rows(species, mids),
        "tm": tmhm_rows(species, mids),
        "hm": {},
        "tutor": tutor_rows(species, mids),
        "egg": egg_rows(species, mids),
    }
    tm = {}
    hm = {}
    for sid, rows in por_metodo["tm"].items():
        for row in rows:
            (tm if row[2] == "tm" else hm).setdefault(sid, []).append(row)
    por_metodo["tm"] = tm
    por_metodo["hm"] = hm

    egg_base = por_metodo["egg"]
    eventos = event_rows(species, mids)
    id_by_slug = dict((slug, sid) for sid, slug in slugs.items())

    learnsets = {}
    stats = Counter()
    sem_egg = []
    sem_event = []
    for sid, slug in slugs.items():
        base_id = id_by_slug.get(base_of(slug, pai))
        rows = []
        counts = Counter()
        for metodo in ORDEM:
            if metodo == "event":
                parte = [[mid, 0, "event"] for mid in eventos.get(sid, [])]
            elif metodo == "egg":
                parte = egg_base.get(base_id, [])
            else:
                parte = por_metodo[metodo].get(sid, [])
            rows += parte
            counts[metodo] += len(parte)
        if rows:
            learnsets[slug] = rows
        for metodo in ORDEM:
            stats[metodo] += counts[metodo]
        if not counts.get("egg"):
            sem_egg.append(slug)
        if not counts.get("event"):
            sem_event.append(slug)

    total = sum(len(v) for v in learnsets.values())
    print("especies com golpes : %d de %d" % (len(learnsets), len(slugs)))
    print("linhas totais       : %d" % total)
    for metodo in ORDEM:
        print("  %-6s %5d" % (metodo, stats[metodo]))
    print("sem egg moves       : %d especies" % len(sem_egg))
    print("sem event moves     : %d especies" % len(sem_event))

    if os.path.exists(LEARNSETS):
        atual = read_json(LEARNSETS, "=")
        diff = Counter()
        changed = []
        for slug in sorted(set(atual) | set(learnsets)):
            antes = Counter(tuple(r) for r in atual.get(slug, []))
            depois = Counter(tuple(r) for r in learnsets.get(slug, []))
            if antes != depois:
                changed.append(slug)
                for row in depois - antes:
                    diff["+" + row[2]] += 1
                for row in antes - depois:
                    diff["-" + row[2]] += 1
        print("especies alteradas  : %d" % len(changed))
        for chave in sorted(diff):
            print("  %-8s %5d" % (chave, diff[chave]))

    if args.check:
        return 0

    io.open(LEARNSETS, "w", encoding="utf-8", newline="\n").write(
        "window.LEARNSETS = " + json.dumps(learnsets, ensure_ascii=False, separators=(",", ":")) + ";\n")
    print()
    print("escrito %s (%d KB)" % (LEARNSETS, os.path.getsize(LEARNSETS) // 1024))

    if not args.no_json:
        dex = read_json(POKEDEX, "=")
        payload = dict(dex)
        payload["pokemon"] = [dict(p, moves=learnsets.get(p["slug"], [])) for p in dex["pokemon"]]
        io.open(POKEDEX_JSON, "w", encoding="utf-8", newline="\n").write(
            json.dumps(payload, ensure_ascii=False, separators=(",", ":")))
        print("escrito %s (%d KB)" % (POKEDEX_JSON, os.path.getsize(POKEDEX_JSON) // 1024))
    return 0


if __name__ == "__main__":
    sys.exit(main())