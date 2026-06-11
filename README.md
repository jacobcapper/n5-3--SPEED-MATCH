# 速攻マッチ — JLPT Speed Match

A fast-paced Japanese vocabulary quiz game covering JLPT N5–N3. Built as a single self-contained HTML file — no framework installs, no server, no account needed. Works offline once loaded.

**[▶ Play it here](https://jacobcapper.github.io/n5-3--SPEED-MATCH/)**

---

## Features

- **2,179 embedded words** across N5, N4, and N3 — nouns, verbs, adjectives, adverbs, phrases, question words, conjunctions, greetings, keigo verbs, and katakana loanwords
- **Three question modes**
  - 意味 → かな — meaning shown, pick the kana reading
  - 語 → 意味 — word shown, pick the meaning
  - 漢字 → かな — kanji shown, pick the reading
- **Two game styles**
  - タイムアタック (Time Attack) — 60 second clock, wrong answers cost −5s, sub-2s answers earn a speed bonus
  - エンドレス (Endless) — per-word countdown that shrinks with each correct answer, ends on 3 strikes or timeout
- **Combo multiplier** up to ×4 (every 5 correct in a row bumps it)
- **Vocabulary focus** — filter by nouns, verbs, adjectives, adverbs, or set phrases/expressions
- **Level select** — N5, N4, N3, or all levels combined
- **Missed words review** on the results screen with kanji, reading, and meaning
- **Personal bests** saved in your browser per settings combination, with a NEW RECORD callout on the results screen
- Live pool size counter on the setup screen so you know before you start
- Arcade aesthetic: dark theme, pixel title font, WebAudio sound effects, animated combo counter

---

## Word Coverage

| Level | Words | Notes |
|-------|-------|-------|
| N5 | 515 | Essentially complete — core vocab, all days of week, directions, family terms, greetings, question words |
| N4 | 484 | Near-complete — includes keigo (いらっしゃる・申す・参る etc.) and conjunctions |
| N3 | 1,180 | Broad coverage — abstract/suru nouns, body & nature, transitive/intransitive verb pairs, adjectives, adverbs, conjunctions, and common katakana loanwords |

Note: JLPT does not publish official vocabulary lists. Coverage is based on widely-used community word lists with a bias toward high-frequency items.

---

## Scoring

**Base points per correct answer:** 100

**Multipliers and bonuses:**

- Combo multiplier: `min(1 + floor(combo / 5) × 0.5, 4.0)` — maxes out at ×4 after a 25-word streak
- Time Attack speed bonus: +50 points if answered in under 2 seconds
- Endless speed bonus: remaining seconds × 10 added per correct answer

**Penalties:**

- Time Attack: −5 seconds per wrong answer
- Endless: 1 strike per wrong answer or timeout (3 strikes = game over)


## Building from Source

The source is a single React JSX file (`japanese-speed-match.jsx`). To rebuild `index.html`:

```bash
npm install react react-dom esbuild

# Create an entry point
cat > entry.jsx << 'EOF'
import { createRoot } from "react-dom/client";
import SpeedMatch from "./japanese-speed-match.jsx";
createRoot(document.getElementById("root")).render(<SpeedMatch />);
EOF

# Bundle
npx esbuild entry.jsx \
  --bundle \
  --minify \
  --loader:.jsx=jsx \
  --jsx=automatic \
  --outfile=bundle.js
```

Then wrap `bundle.js` in a minimal HTML shell:

```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <meta name="theme-color" content="#0B0D17">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <title>速攻マッチ — JLPT Speed Match</title>
  <style>html,body{margin:0;padding:0;background:#0B0D17}</style>
</head>
<body>
  <div id="root"></div>
  <script><!-- paste bundle.js contents here --></script>
</body>
</html>
```

---

## Tech

- React 18 (bundled — no CDN dependency)
- WebAudio API for sound effects
- Google Fonts — [DotGothic16](https://fonts.google.com/specimen/DotGothic16) (arcade title), [Noto Sans JP](https://fonts.google.com/noto/specimen/Noto+Sans+JP) (Japanese text)
- No other dependencies
- Entire vocabulary dataset is embedded in the bundle — works offline after first load (except font fetch)
