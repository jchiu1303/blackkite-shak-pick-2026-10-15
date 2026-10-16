# Union motion pass — 2026-10-17 (~01:50 HKT)

Soft mockup only. Not live. Not publishable.

## What changed
Motion grammar adapted for Black Kite Union (feel only — no third-party copy, brand, or assets).

1. **Hero film** — slow ken-burns on the glider still; headline fades/slides in on load.
2. **Scroll-reveal** — section blocks (`.reveal`, existing chapters) via IntersectionObserver; `prefers-reduced-motion: reduce` shows content instantly with no animation.
3. **Cursor-over** — month/shop can tiles lift + soft shadow; nav underline grows on hover/focus/active; bridge / mail CTAs get a soft hover.
4. **Beer chips** — four chips (Skybound, Czechmate, 呢度重女, FLOCKFEST) open detail panels on hover/focus/tap; close on leave, outside click, Close, or Escape. Keyboard accessible. Photos + copy already on the pack only.
5. Soft banner + `beer@blackkite.hk` stay in the fold.

## Files
- `../assets/union-motion.css` (new)
- `../assets/union-motion.js` (new)
- `index.html`, `shop.html`, `trade.html`, `visit.html` (link + chips on home/shop)

## How to open locally
From `/workspace/blackkite-shak-pick`:
```bash
python3 -m http.server 8765
```
Then open `http://127.0.0.1:8765/union/` (or `union/index.html`).

Reduced-motion: enable OS “reduce motion” — ken-burns, headline entrance, and lifts turn off; chips still open for accessibility.
