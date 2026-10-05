import os
import struct
import sys
import zlib
import tempfile

RAIZ = os.path.dirname(os.path.abspath(__file__))
LOG = os.path.join(tempfile.gettempdir(), "gerar_paletas.log")
SAIDA = (("normal", "normal.pal"), ("shiny", "shiny.pal"))

linhas = []


def registrar(msg):
    linhas.append(msg)


def achar_paleta(pasta, nome_pal):
    atual = pasta
    while True:
        cand = os.path.join(atual, nome_pal)
        if os.path.isfile(cand):
            return cand
        pai = os.path.dirname(atual)
        if pai == atual or len(pai) < len(RAIZ):
            return None
        atual = pai


def ler_pal(caminho):
    with open(caminho, "r", encoding="utf-8", errors="replace") as f:
        bruto = f.read().replace("\r\n", "\n").split("\n")
    linhas_util = [x.strip() for x in bruto if x.strip()]
    if not linhas_util or not linhas_util[0].upper().startswith("JASC-PAL"):
        raise ValueError("nao e um .pal JASC: %s" % caminho)
    total = int(linhas_util[2])
    cores = []
    for linha in linhas_util[3:3 + total]:
        partes = linha.replace(",", " ").split()
        if len(partes) >= 3:
            cores.append(tuple(int(float(v)) for v in partes[:3]))
    if not cores:
        raise ValueError("paleta sem cores: %s" % caminho)
    return cores


def partes_png(dados):
    if dados[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError("nao e um PNG")
    i = 8
    while i + 8 <= len(dados):
        tam, tipo = struct.unpack(">I4s", dados[i:i + 8])
        yield tipo, dados[i + 8:i + 8 + tam]
        i += 12 + tam


def montar(blocos):
    saida = [b"\x89PNG\r\n\x1a\n"]
    for tipo, corpo in blocos:
        saida.append(struct.pack(">I", len(corpo)) + tipo + corpo
                     + struct.pack(">I", zlib.crc32(tipo + corpo) & 0xFFFFFFFF))
    return b"".join(saida)


def aplicar_paleta(png, paleta):
    blocos = list(partes_png(png))
    atuais = None
    for tipo, corpo in blocos:
        if tipo == b"PLTE":
            atuais = [tuple(corpo[k:k + 3]) for k in range(0, len(corpo), 3)]
    if atuais is None:
        raise ValueError("PNG sem chunk PLTE (nao e indexado)")
    if len(paleta) < len(atuais):
        raise ValueError("a paleta tem %d cores e o PNG usa %d"
                         % (len(paleta), len(atuais)))
    novas = paleta[:len(atuais)]
    corpo = b"".join(bytes(c) for c in novas)
    blocos = [(b"PLTE" if t == b"PLTE" else t,
               corpo if t == b"PLTE" else c) for t, c in blocos]
    trocadas = sum(1 for a, b in zip(atuais, novas) if a != b)
    return montar(blocos), trocadas


def principal():
    pastas = []
    for base, _dirs, arquivos in os.walk(RAIZ):
        if "front.png" in arquivos:
            pastas.append(base)
    pastas.sort()

    feitos, ignoradas, problemas = 0, 0, []

    for pasta in pastas:
        nome = os.path.basename(pasta)
        with open(os.path.join(pasta, "front.png"), "rb") as f:
            original = f.read()
        for sufixo, nome_pal in SAIDA:
            destino = os.path.join(pasta, "front_%s.png" % sufixo)
            origem_pal = achar_paleta(pasta, nome_pal)
            if origem_pal is None:
                problemas.append("%s: sem %s" % (nome, nome_pal))
                ignoradas += 1
                continue
            try:
                paleta = ler_pal(origem_pal)
                dados, trocadas = aplicar_paleta(original, paleta)
            except Exception as erro:
                problemas.append("%s (%s): %s" % (nome, sufixo, erro))
                ignoradas += 1
                continue
            with open(destino, "wb") as f:
                f.write(dados)
            feitos += 1
            registro = "%-12s front_%s.png  %d de %d cores trocadas" % (
                nome, sufixo, trocadas, len(paleta))
            registrar(registro)

    cabecalho = [
        "pastas com front.png : %d" % len(pastas),
        "arquivos gerados     : %d" % feitos,
        "ignorados            : %d" % ignoradas,
        "",
    ]
    with open(LOG, "w", encoding="utf-8") as f:
        f.write("\n".join(cabecalho + linhas + problemas) + "\n")

    resumo = "%d arquivos gerados em %d pastas.\n\nLog: %s" % (feitos, len(pastas), LOG)
    if problemas:
        resumo += "\n\n%d pastas com problema (primeiros 8):\n%s" % (
            len(problemas), "\n".join(problemas[:8]))

    try:
        import tkinter
        raiz = tkinter.Tk()
        raiz.withdraw()
        tkinter.messagebox.showinfo("Paletas geradas", resumo)
        raiz.destroy()
    except Exception:
        with open(LOG, "a", encoding="utf-8") as f:
            f.write("\n\n" + resumo + "\n")


if __name__ == "__main__":
    principal()