# Linklaters 50 · Cocktail Quiz — Alternative Edition

A second design direction for the Linklaters 50 Years in Hong Kong cocktail quiz.
Same content (Q1–Q4), same drink mapping, same brand magenta `#FD3DB5`,
same fonts (CorporateACon + MSung HK Medium) — different look & feel.

## Direction

**Editorial magazine** — cream paper backdrop, oversized italic serif numerals,
generous whitespace, crisp white answer cards, soft magenta wash accents in the
corners and a slim magenta ribbon down the centre during the quiz. Progress pips
at the bottom (with a stretching current pip), and a subtle floating sparkle layer.

## Run

Pure static, no build:

```bash
# from this folder
python3 -m http.server 5174
# then open http://localhost:5174
```

Or simply double-click `index.html`.

## Files

- `index.html` — page shell with brand header, page surface, footer (progress + back)
- `styles.css` — editorial design tokens, layout, animations
- `app.js` — quiz state machine, drink mapping, SVG glass illustrations
- `assets/` — copied logo + fonts so the build is self-contained

## Drink mapping

| Element | Cocktail        | Mocktail       |
| ------- | --------------- | -------------- |
| Earth   | Central Reserve | Sunset Peak    |
| Fire    | Magenta         | Lion Rock      |
| Air     | Golden 50       | Glowy          |
| Water   | Harbour View    | Victoria Pulse |

Q3 (one-word Linklaters) and Q4 (HK icon) personalise the tasting note shown on the result page.
