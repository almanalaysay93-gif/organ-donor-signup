# DESIGN SPECIFICATION — OBSIDIAN GOLD MEDICAL LUXURY (v4)

## 1. Aesthetic Direction: Obsidian Royal Medical
The design bridges emotional dignity with high-technology clinical authority. Instead of generic pastel clinic tropes or cookie-cutter SaaS templates, the portal uses deep obsidian darkness pierced by radiant gold light and subtle biometric crimson pulses.

## 2. Design Tokens & Palette

### Base Canvas & Surfaces
- `--bg-void`: `#030712` (deepest black-blue)
- `--bg-obsidian`: `#060d1a` (stage background)
- `--bg-surface`: `rgba(8, 20, 38, 0.72)` (glass deck)
- `--bg-surface-elevated`: `rgba(14, 30, 56, 0.85)`
- `--border-subtle`: `rgba(201, 162, 59, 0.16)`
- `--border-gold`: `rgba(201, 162, 59, 0.45)`
- `--border-gold-glow`: `rgba(244, 211, 129, 0.6)`

### Metallic Gold Accents & Highlights
- `--gold-deep`: `#8c6a1d`
- `--gold-primary`: `#c9a23b`
- `--gold-light`: `#f4d381`
- `--gold-gradient`: `linear-gradient(135deg, #8c6a1d 0%, #c9a23b 35%, #f7e7b4 50%, #c9a23b 70%, #8c6a1d 100%)`
- `--gold-text-grad`: `linear-gradient(135deg, #ffffff 0%, #f4d381 40%, #c9a23b 100%)`

### Clinical Life-Signs
- `--crimson-pulse`: `#e63946`
- `--crimson-glow`: `rgba(230, 57, 70, 0.4)`
- `--cyan-clinical`: `#2dd4bf`

### Typography Hierarchy
- **Display Serif**: `"Fraunces", Georgia, serif` (9..144 variable optical size, dignified and human)
- **Interface Sans**: `"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`
- **Clinical Telemetry**: `"Space Mono", "JetBrains Mono", monospace`

## 3. 3D Parallax Architecture & Aggressive Motion Rules
1. **Multi-Plane Stage**:
   - `Layer -2`: HyperFrames video loops (`hero-loop.mp4`, `flow-loop.mp4`) at 35% opacity with vignette blend.
   - `Layer -1`: Atmospheric glowing nebulas and gold light rays (`lens.webp`).
   - `Layer 0`: Floating 3D anatomical organ cutouts (`kidneys.webp`, `bloodwave.webp`) with parallax Z-axis displacement (`translateZ(40px)`) and subtle floating oscillation.
   - `Layer 1`: Primary glass content cards and interactive controls with high z-index clarity.
2. **Interactive Cursor/Gyro 3D Tilt**:
   - Hero and Donor Card elements calculate cursor offset and apply smooth spring-damped `rotateX()`, `rotateY()`, and radial spotlight reflections.
3. **Scroll-Bound Parallax Transforms**:
   - Scroll listener smoothly translates parallax layers at differential velocities (0.08x, 0.22x, 0.45x).
4. **Aggressive Animation Choreography**:
   - EKG heartbeat rhythm pulse in the gold divider ribbons.
   - Fluid gold shimmer sweeps across CTA buttons on hover.
   - Live holographic card render reacting in real time to input changes.
   - Staggered entrance animations with cubic-bezier spring curves `cubic-bezier(0.16, 1, 0.3, 1)`.

## 4. Accessibility & Anti-Slop Discipline
- Contrast ratio >= 4.5:1 for all body text (`#e2e8f0` on obsidian).
- All interactive controls have min 48px touch targets.
- Full `@media (prefers-reduced-motion: reduce)` support: disables aggressive translations while keeping atmospheric opacity transitions.
