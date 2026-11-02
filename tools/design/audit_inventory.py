import re, sys, json, collections, itertools, os

import sys as _s
SRC = _s.argv[1] if len(_s.argv) > 1 else "src"
files = []
for root, _, fns in os.walk(SRC):
    for fn in fns:
        if fn.endswith((".tsx", ".ts")):
            files.append(os.path.join(root, fn))

def scan(pattern, cast=str):
    c = collections.Counter()
    loc = collections.defaultdict(list)
    for f in files:
        for i, line in enumerate(open(f, encoding="utf-8"), 1):
            for m in re.finditer(pattern, line):
                v = m.group(1)
                c[cast(v)] += 1
                loc[cast(v)].append(f"{os.path.relpath(f,SRC)}:{i}")
    return c, loc

out = {}
for name, pat, cast in [
    ("fontSize", r"fontSize:\s*(\d+)", int),
    ("borderRadius", r"borderRadius:\s*(\d+)", int),
    ("fontWeight", r"fontWeight:\s*'(\d+)'", int),
    ("gap", r"\bgap:\s*(\d+)", int),
    ("padding", r"\bpadding:\s*(\d+)", int),
    ("paddingHorizontal", r"paddingHorizontal:\s*(\d+)", int),
    ("paddingVertical", r"paddingVertical:\s*(\d+)", int),
    ("marginTop", r"marginTop:\s*(\d+)", int),
    ("lineHeight", r"lineHeight:\s*(\d+)", int),
]:
    c, _ = scan(pat, cast)
    out[name] = {"distinct": len(c), "values": sorted(c), "total_uses": sum(c.values())}

hexc, hexloc = scan(r"'(#[0-9A-Fa-f]{6})'")
out["hexColors"] = {"distinct": len(hexc), "total_uses": sum(hexc.values()),
                    "values": sorted(hexc.items(), key=lambda kv: -kv[1])}

print(json.dumps(out, indent=1, ensure_ascii=False))
