#!/usr/bin/env python3
"""Carimba a versão no jogo: cada arquivo .js/.css recebe ?v=<versão> via import map,
então o celular baixa a versão nova em vez de usar a guardada no cache.
Uso: python3 tools/stamp.py   (rode antes de cada commit)"""
import re, time, pathlib
root = pathlib.Path(__file__).resolve().parent.parent / "web"
v = time.strftime("%Y%m%d-%H%M%S")
mods = sorted(p for p in (root / "js").glob("*.js"))
imap = {"three": "./js/vendor/three.module.min.js"}
for p in mods:
    imap[f"./js/{p.name}"] = f"./js/{p.name}?v={v}"
import json
tag = '<script type="importmap">' + json.dumps({"imports": imap}, ensure_ascii=False) + '</script>'
html = (root / "index.html").read_text()
html = re.sub(r'<script type="importmap">.*?</script>', lambda m: tag, html, flags=re.S)
html = re.sub(r'(<script type="module" src="js/main\.js)(\?v=[^"]*)?(")', rf'\1?v={v}\3', html)
html = re.sub(r'(<link rel="stylesheet" href="style\.css)(\?v=[^"]*)?(")', rf'\1?v={v}\3', html)
html = re.sub(r'v(__BUILD__|\d{8}-\d{6})', f'v{v}', html)
(root / "index.html").write_text(html)
print("versão", v)
