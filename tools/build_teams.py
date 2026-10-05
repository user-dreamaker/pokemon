import argparse
import json
import os
import re
import sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DEFAULT_DECOMP = r"C:\cygwin64\home\Admin\Glorious-Purpose"

TRAINERS = ""
PARTIES = ""
NATURE_NAMES = ""
POKEMON_C = ""
TRAINER_PICS = ""
SPECIES_H = ""
POKEMON_H = ""
POKEDEX = os.path.join(ROOT, "data", "pokedex.js")
OUT = os.path.join(ROOT, "data", "teams.js")

LIDERES = [
    ("BROCK", "Pewter Gym"),
    ("MISTY", "Cerulean Gym"),
    ("LT. SURGE", "Vermilion Gym"),
    ("ERIKA", "Celadon Gym"),
    ("KOGA", "Fuchsia Gym"),
    ("SABRINA", "Saffron Gym"),
    ("BLAINE", "Cinnabar Gym"),
    ("GIOVANNI", "Viridian Gym"),
    ("FALKNER", "Fly Location"),
    ("BUGSY", "Viridian Forest"),
    ("WHITNEY", "Celadon City"),
    ("MORTY", "Pokémon Tower"),
    ("CHUCK", "Fighting Dojo"),
    ("JASMINE", "Sea Cottage"),
    ("PRYCE", "Seafoam Islands"),
    ("CLAIR", "Cinnabar Island"),
    ("LORELEI", "Pokémon League"),
    ("BRUNO", "Pokémon League"),
    ("AGATHA", "Pokémon League"),
    ("LANCE", "Pokémon League"),
]

CLASSE = {
    "TRAINER_CLASS_LEADER": "Leader",
    "TRAINER_CLASS_ELITE_FOUR": "Elite Four",
}

GENERO = {"MON_MALE": "m", "MON_FEMALE": "f", "MON_GENDERLESS": "n"}

TYPES = {}

NATURE_STATS = ["atk", "def", "spe", "spa", "spd"]

NATURE_HIDDEN_POWER_PHYSICAL = {
    "NATURE_HARDY", "NATURE_LONELY", "NATURE_BRAVE", "NATURE_ADAMANT",
    "NATURE_NAUGHTY", "NATURE_DOCILE", "NATURE_RELAXED", "NATURE_IMPISH",
    "NATURE_LAX", "NATURE_JOLLY", "NATURE_NAIVE", "NATURE_CAREFUL",
}


def configure(decomp):
    global TRAINERS, PARTIES, NATURE_NAMES, POKEMON_C, TRAINER_PICS
    global SPECIES_H, POKEMON_H
    TRAINERS = os.path.join(decomp, "src", "data", "trainers.h")
    PARTIES = os.path.join(decomp, "src", "data", "trainer_parties.h")
    NATURE_NAMES = os.path.join(decomp, "src", "data", "text", "nature_names.h")
    POKEMON_C = os.path.join(decomp, "src", "pokemon.c")
    TRAINER_PICS = os.path.join(decomp, "graphics", "trainers", "front_pics")
    SPECIES_H = os.path.join(decomp, "include", "constants", "species.h")
    POKEMON_H = os.path.join(decomp, "include", "constants", "pokemon.h")


def norm(text):
    out = re.sub(r"[^a-z0-9]+", "-", text.lower())
    return out.strip("-")


def squash(text):
    return re.sub(r"[^a-z0-9]", "", text.lower())


def read(path):
    return open(path, encoding="utf-8", errors="replace").read()


def species_ids():
    out = {}
    for const, value in re.findall(r"#define\s+(SPECIES_\w+)\s+(\d+)", read(SPECIES_H)):
        sid = int(value)
        if 1 <= sid <= 251:
            out[const] = sid
    return out


def load_pokedex():
    raw = read(POKEDEX)
    data = json.loads(raw[raw.index("{"):raw.rindex("}") + 1])
    by_id = dict((p["id"], p) for p in data["pokemon"])
    moves = {}
    for m in data["moves"]:
        moves[norm(m["label"])] = m["id"]
    items = {}
    for i in data["items"]:
        items[norm(i["name"])] = i["id"]
        items[norm(i["name"].replace(" ", ""))] = i["id"]
        items[squash(i["name"])] = i["id"]
    return by_id, moves, items


def type_constants():
    out = {}
    for const, value in re.findall(r"#define\s+(TYPE_\w+)\s+(\d+)",
                                    read(POKEMON_H)):
        out[int(value)] = const[len("TYPE_"):].lower()
    return out


def hidden_power_type(ivs, types):
    bits = 0
    for i, chave in enumerate(("hp", "atk", "def", "spe", "spa", "spd")):
        bits |= (ivs[chave] & 1) << i
    value = (15 * bits) // 63 + 1
    mystery = [n for n, nome in types.items() if nome == "mystery"][0]
    if value >= mystery:
        value += 1
    return types.get(value, "???")


def parse_parties():
    text = read(PARTIES)
    parties = {}
    for name, body in re.findall(
        r"static const struct TrainerMonFull (sParty_\w+)\[\] = \{(.*?)\n\};", text, re.S
    ):
        slots = []
        for lvl, species, item, moves, nature, gender, ability, hp, atk, df, spa, spd, spe, shiny in re.findall(
            r"\.lvl = (\d+),.*?\.species = (\w+),.*?\.heldItem = (\w+),"
            r".*?\.moves = \{([^}]*)\},.*?\.nature = (\w+),"
            r".*?\.gender = (\w+),.*?\.ability = (\d+),"
            r".*?\.hpIV = (\d+), \.atkIV = (\d+), \.defIV = (\d+),"
            r" \.spAtkIV = (\d+), \.spDefIV = (\d+), \.speedIV = (\d+),"
            r".*?\.shiny = (TRUE|FALSE|[01]),",
            body, re.S,
        ):
            slots.append({
                "lvl": int(lvl),
                "species": species,
                "heldItem": item,
                "moves": [m.strip() for m in moves.split(",") if m.strip()],
                "nature": nature,
                "gender": gender,
                "ability": int(ability),
                "ivs": dict(zip(("hp", "atk", "def", "spa", "spd", "spe"),
                                [int(x) for x in (hp, atk, df, spa, spd, spe)])),
                "shiny": 1 if shiny in ("TRUE", "1") else 0,
            })
        parties[name] = slots
    return parties


def parse_natures():
    nomes = {}
    for const, label in re.findall(
        r"const u8 s(\w+)NatureName\[\] = _\(\"([^\"]*)\"\)", read(NATURE_NAMES)
    ):
        nomes["NATURE_" + const.upper()] = label.title()

    text = read(POKEMON_C)
    tabela = re.search(
        r"sNatureStatTable\[NUM_NATURES\]\[NUM_NATURE_STATS\] =\s*\{(.*?)\n\};",
        text, re.S)
    out = {}
    for linha in re.findall(r"\[(NATURE_\w+)\]\s*=\s*\{([^}]*)\}", tabela.group(1)):
        const, valores = linha
        stats = {}
        for chave, texto in zip(NATURE_STATS, valores.split(",")):
            n = int(texto.strip().replace("+", ""))
            if n:
                stats[chave] = n
        out[const] = {"nome": nomes.get(const, const), "stats": stats}
    return out


def parse_trainers():
    text = read(TRAINERS)
    out = {}
    for const, body in re.findall(r"\[(TRAINER_\w+)\] = \{(.*?)\n    \},", text, re.S):
        klass = re.search(r"\.trainerClass = (\w+)", body)
        nome = re.search(r'\.trainerName = _\("([^"]*)"\)', body)
        party = re.search(r"\.party = TRAINER_PARTY_FULL\((sParty_\w+)\)", body)
        pic = re.search(r"\.trainerPic = TRAINER_PIC_(\w+)", body)
        if not (klass and nome and party):
            continue
        out[const] = {
            "class": klass.group(1),
            "name": nome.group(1),
            "party": party.group(1),
            "pic": pic.group(1).lower() if pic else None,
        }
    return out


def main(argv=None):
    parser = argparse.ArgumentParser(
        description="Extrai os times dos lideres do decomp e escreve data/teams.js.",
        epilog="python tools/build_teams.py --decomp C:\\caminho\\do\\decomp",
    )
    parser.add_argument("--decomp", default=DEFAULT_DECOMP,
                        help="raiz do decomp (padrao: %s)" % DEFAULT_DECOMP)
    parser.add_argument("--check", action="store_true",
                        help="so confere e imprime, sem escrever data/teams.js")
    args = parser.parse_args(argv)
    configure(args.decomp)

    global TYPES
    parties = parse_parties()
    trainers = parse_trainers()
    natures_tab = parse_natures()
    sids = species_ids()
    TYPES = type_constants()
    by_id, move_ids, item_ids = load_pokedex()

    por_nome = {}
    for const, t in trainers.items():
        if t["class"] not in CLASSE:
            continue
        rec = por_nome.setdefault(t["name"], {"classe": t["class"], "times": {}})
        rec["classe"] = t["class"]
        rec["times"]["rematch" if const.endswith("_2") else "battle"] = t

    faltando = [n for n, _ in LIDERES if n not in por_nome]
    if faltando:
        print("lideres nao encontrados: %s" % ", ".join(faltando))
        return 1

    desconhecidos = sorted(set(por_nome) - set(n for n, _ in LIDERES))
    if desconhecidos:
        print("lideres no decomp fora da lista: %s" % ", ".join(desconhecidos))

    times = []
    stats = {"times": 0, "pokemon": 0, "nivel_zero": 0, "sem_especie": 0,
             "golpes": 0, "itens": 0, "genero": {}, "hp": {}, "hp_cat": {}}
    problemas = []

    for nome, local in LIDERES:
        rec = por_nome[nome]
        for rematch in (False, True):
            t = rec["times"].get("rematch" if rematch else "battle")
            if not t:
                problemas.append("%s sem %s" % (nome, "rematch" if rematch else "batalha"))
                continue
            party = parties.get(t["party"], [])
            mons = []
            for slot in party:
                sid = sids.get(slot["species"])
                mon = by_id.get(sid) if sid else None
                golpes = []
                for mv in slot["moves"]:
                    if mv == "MOVE_NONE":
                        continue
                    rotulo = mv[len("MOVE_"):].replace("_", " ")
                    mid = move_ids.get(norm(rotulo))
                    if mid is None:
                        problemas.append("golpe sem id no pokedex.js: %s" % mv)
                    else:
                        golpes.append(mid)
                item = 0
                if slot["heldItem"] != "ITEM_NONE":
                    iid = item_ids.get(squash(slot["heldItem"][len("ITEM_"):]))
                    if iid is None:
                        problemas.append("item sem id no pokedex.js: %s" % slot["heldItem"])
                    else:
                        item = iid
                        stats["itens"] += 1
                habilidade = 0
                if mon and 1 <= slot["ability"] <= len(mon["abilities"]):
                    habilidade = mon["abilities"][slot["ability"] - 1]
                g = GENERO.get(slot["gender"], "n")
                stats["genero"][g] = stats["genero"].get(g, 0) + 1
                stats["golpes"] += len(golpes)
                stats["pokemon"] += 1
                if slot["lvl"] == 0:
                    stats["nivel_zero"] += 1
                if not mon:
                    stats["sem_especie"] += 1
                natures = natures_tab.get(slot["nature"])
                hp_tipo = hidden_power_type(slot["ivs"], TYPES)
                hp_categoria = ("physical"
                                if slot["nature"] in NATURE_HIDDEN_POWER_PHYSICAL
                                else "special")
                stats["hp"][hp_tipo] = stats["hp"].get(hp_tipo, 0) + 1
                stats["hp_cat"][hp_categoria] = stats["hp_cat"].get(hp_categoria, 0) + 1
                mons.append({
                    "slug": mon["slug"] if mon else None,
                    "nivel": slot["lvl"],
                    "genero": g,
                    "item": item,
                    "habilidade": habilidade,
                    "golpes": golpes,
                    "hp_tipo": hp_tipo,
                    "hp_categoria": hp_categoria,
                    "shiny": slot["shiny"],
                    "natureza": natures["nome"] if natures else None,
                    "natureza_stats": ([[k, v] for k, v in natures["stats"].items()]
                                       if natures else []),
                })
            times.append({
                "lider": nome.title(),
                "local": local,
                "classe": CLASSE[rec["classe"]],
                "rematch": rematch,
                "pic": t.get("pic"),
                "pokemon": mons,
            })
            stats["times"] += 1

    sem_pic = [t["lider"] for t in times if not t["pic"]]
    for t in times:
        if t["pic"] and not os.path.exists(
            os.path.join(TRAINER_PICS, t["pic"] + "_front_pic.png")):
            problemas.append("retrato nao encontrado no decomp: %s" % t["pic"])
    stats["retratos"] = len({t["pic"] for t in times if t["pic"]})

    print("times extraidos   : %d (%d lideres x batalha + rematch)"
          % (stats["times"], len(LIDERES)))
    print("pokemon nos times : %d" % stats["pokemon"])
    print("nivel 0 (lv ??)   : %d" % stats["nivel_zero"])
    print("sem especie       : %d" % stats["sem_especie"])
    print("golpes resolvidos : %d" % stats["golpes"])
    print("itens resolvidos  : %d" % stats["itens"])
    print("retratos usados   : %d" % stats["retratos"])
    print("natures distintas : %d" % len({n for n in natures_tab}))
    print("hidden power tipo : %s"
          % ", ".join("%s=%d" % (k, v) for k, v in sorted(stats["hp"].items())))
    print("hidden power cat  : %s"
          % ", ".join("%s=%d" % (k, v) for k, v in sorted(stats["hp_cat"].items())))
    if sem_pic:
        print("sem retrato       : %s" % ", ".join(sorted(set(sem_pic))))
    print("genero            : %s"
          % ", ".join("%s=%d" % (k, v) for k, v in sorted(stats["genero"].items())))
    if problemas:
        print("problemas         :")
        for p in sorted(set(problemas)):
            print("  %s" % p)

    if args.check:
        return 0

    natures = [{"nome": v["nome"], "stats": v["stats"]}
               for _, v in sorted(natures_tab.items(), key=lambda kv: kv[1]["nome"])]
    body = json.dumps({"times": times, "natures": natures},
                      ensure_ascii=False, separators=(",", ":"))
    open(OUT, "w", encoding="utf-8", newline="\n").write(
        "window.TEAMS = " + body + ";\n")
    print()
    print("escrito %s (%d bytes)" % (OUT, os.path.getsize(OUT)))
    return 0


if __name__ == "__main__":
    sys.exit(main())