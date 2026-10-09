# DESIGN SPECIFICATION — DONOR CARD GREEN (v5)

## 1. Direction

The printed SHARE OTSU donor card is the design reference.
The site uses the card colors, the card leaf art, and the card typography weight.
The site has one light theme.
The obsidian and gold theme of v4 is removed.

## 2. Tokens

### Color

- `--green`: `#008037` (card title green, primary action).
- `--green-deep`: `#00612a` (hover, links).
- `--green-ink`: `#0d3b21` (dark text on the card, footer background).
- `--sage`: `#cdd8be` (card ribbon, large numerals, borders).
- `--sage-soft`: `#e6ecdd` (soft fills).
- `--leaf`: `#658058` (leaf mid tone).
- `--mist`: `#f4f8ef` (alternate section background).
- `--paper`: `#ffffff` (page background).
- `--ink`: `#16261b`, `--text`: `#33443a`, `--muted`: `#55655a` (text).

### Type

- Display: `Archivo`, width 125, weight 900, uppercase. It matches the "DONOR CARD" title.
- Body: `Albert Sans`.

## 3. Images

- `media/organs/*.webp`: eight organ renders, one for each organ on the card.
- Each render is a green-on-transparent conversion of a 3D glass render.
- `media/leaf-a.webp`, `leaf-b.webp`, `leaf-c.webp`: three parts of the leaf strip of the card front, with a transparent background.
- `assets/card-front.png` and `assets/card-back.png`: the printed card faces, not changed.

## 4. Parallax

- Each organ has one section of one screen height (`.scene`).
- `script.js` writes `--p` on each visible scene: -1 below the screen, 0 at the center, 1 above.
- `script.js` writes `--mx` and `--my` on the root from the pointer position.
- Each layer has a depth `--d`. The far leaves are 0.5, the organ is 0.45, the mid leaves are 1.3, and the near leaves are 2.6.
- The near leaves are in front of the organ. The far leaves and the near leaves have blur.
- Each leaf image sways about its stem edge.
- The organ also turns on the X and Y axes with `--p`, `--mx`, and `--my`.
- The hero background is a HyperFrames loop of the same leaves on three Z planes with a camera that drifts. The source is `videos/leaf-loop`. The web file is `media/leaf-loop.mp4`.
- The header is a glass bar: a translucent white fill, a 22 px backdrop blur, and a light border.

## 5. Digital donor card

- The card shows the two printed faces and turns between them in 3D.
- `script.js` holds the positions of the text lines and the checkboxes in card pixels (854 x 480).
- The live card and the PNG export read the same positions.
- The signature line stays empty.

## 6. Accessibility

- Body text contrast is 4.5:1 or more on white and on mist.
- Each control is 44 px or more in height.
- `prefers-reduced-motion` stops the parallax, the loop, and the entrance motion.
