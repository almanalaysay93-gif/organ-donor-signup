# Implementation Plan: 3D Morphing Scroll Slideshow

This document outlines the implementation plan for the 3D morphing scroll slideshow in the SHARE OTSU organ donor portal.
It integrates GSAP 3.12, ScrollTrigger, and CSS 3D perspective transforms into the landing page.
This plan follows Simplified Technical English rules.
Each full sentence occupies its own physical line.
This plan strictly forbids em dashes, en dashes, chained dashes, semicolons, analogies, and emoji.

## 1. Overview and Engineering Thesis

The organ matrix section will transform into a pinned 3D specimen stage.
As the visitor scrolls into the section, the viewport locks for 350vh of total scroll travel.
A master GSAP timeline scrubs the active organ along the Z axis.
The active 3D organ rotates and recedes into deep space.
The next organ approaches from positive Z space with golden vascular illumination.
Clinical telemetry panels update in synchronization with each organ transition.
Once all eight organs finish their sequence, the stage unpins cleanly into the donor card sign-up form.

## 2. Technical Stack and Dependencies

- `D1`: GSAP 3.12 core animation library loaded from jsDelivr CDN.
- `D2`: GSAP ScrollTrigger 3.12 plugin loaded from jsDelivr CDN.
- `D3`: CSS 3D hardware-accelerated transforms using perspective 1200px and preserve-3d.
- `D4`: High-resolution transparent WebP organ renders from media/organs/.
- `D5`: Design token system from tokens.css for dual light and dark theme support.


## 3. Phase 1: HTML Markup Update in index.html

Phase 1 updates the markup structure of index.html.
It prepares the head links, the pinned 3D stage container, the eight organ slides, the progress scrubber, and the script tags.

### Task 1.1: Add Token Stylesheet Link
- Location: index.html `<head>` block.
- Action: Insert `<link rel="stylesheet" href="tokens.css" />` immediately before `styles.css`.
- Purpose: Ensure design system variables load before component rules.

### Task 1.2: Add External GSAP 3.12 CDN Scripts
- Location: index.html before the closing `</body>` tag and before `script.js`.
- Action: Add the GSAP 3.12.5 core script tag.
- Action: Add the GSAP ScrollTrigger 3.12.5 plugin script tag.
- Target CDN URL for GSAP core: `https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js`.
- Target CDN URL for ScrollTrigger: `https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js`.

### Task 1.3: Replace Disjoint Scenes with Pinned 3D Stage Container
- Location: index.html `#organs` section container.
- Action: Replace the existing eight separate `<section class="scene">` elements with a single pinned master wrapper.
- Container element: `<section class="organ-stage-pin" id="organs" aria-label="Organs you can donate">`.
- Inside the pinned wrapper, add `<div class="stage-sticky-viewport">`.
- Inside the sticky viewport, add `<div class="stage-3d-scene">` with perspective geometry.
- Add background decorative ambient layers for subtle leaf drift and vascular lighting.

### Task 1.4: Build 3D Organ Slides Markup
- Location: Inside `.stage-3d-scene` within `<div class="stage-slides-stack">`.
- Action: Construct eight distinct organ slides representing the printed card checklist in exact order.
- Sequence of organs:
  1. Slide 1: Heart (`media/organs/heart.webp`)
  2. Slide 2: Lungs (`media/organs/lungs.webp`)
  3. Slide 3: Liver (`media/organs/liver.webp`)
  4. Slide 4: Kidneys (`media/organs/kidneys.webp`)
  5. Slide 5: Pancreas (`media/organs/pancreas.webp`)
  6. Slide 6: Bones (`media/organs/bones.webp`)
  7. Slide 7: Eyes (`media/organs/eyes.webp`)
  8. Slide 8: Skin (`media/organs/skin.webp`)
- Each slide receives the class `.organ-slide-3d` and a `data-organ-index` attribute from 0 to 7.
- Each slide contains two primary child containers:
  1. Specimen container (`.slide-specimen-box`):
     - Background leaf depth layer.
     - Vascular gold halo glow element (`.specimen-vascular-halo`).
     - Organ specimen image (`.specimen-image`).
     - Foreground leaf depth layer.
  2. Clinical telemetry HUD card (`.slide-hud`):
     - Index indicator badge (for example `01 / 08`).
     - Organ title heading.
     - Monospace impact readout showing people saved or helped.
     - Clinical lede summary sentence.
     - Eligible conditions list.

### Task 1.5: Add Progress Scrubber and Navigation Overlay
- Location: Fixed overlay within `.stage-sticky-viewport`.
- Action: Add `<div class="stage-hud-overlay">`.
- Elements included in the HUD overlay:
  - Scrubber track `<div class="stage-scrubber-track">` containing `<div class="stage-scrubber-bar" id="stage-scrubber-bar"></div>`.
  - Eight step pips `<div class="stage-pips">` with buttons for direct slide navigation.
  - Active organ telemetry label `<span class="stage-active-label" id="stage-active-label">Heart</span>`.
  - Step counter readout `<span class="stage-step-counter" id="stage-step-counter">01 / 08</span>`.
  - Direct skip anchor `<a class="stage-skip-cue" href="#studio">Skip to sign up</a>`.

## 4. Phase 2: CSS 3D Stage Styling in styles.css

Phase 2 implements the CSS 3D stage styling in styles.css.
It configures hardware acceleration, absolute slide stacking, theme styling, and mobile responsive behavior.

### Task 2.1: Configure Pinned Stage and Viewport Geometry
- Add rules for `.organ-stage-pin`:
  - Position: relative.
  - Total height: `var(--slideshow-travel, 350vh)`.
  - Background: `var(--theme-bg-surface)`.
- Add rules for `.stage-sticky-viewport`:
  - Position: sticky.
  - Top: 0.
  - Height: 100svh.
  - Width: 100%.
  - Overflow: hidden.
- Add rules for `.stage-3d-scene`:
  - Width: 100%.
  - Height: 100%.
  - Perspective: `var(--stage-perspective, 1200px)`.
  - Perspective-origin: 50% 50%.
  - Display: grid.
  - Place-items: center.
- Add rules for `.stage-slides-stack`:
  - Position: relative.
  - Width: min(1240px, 100% - 48px).
  - Height: min(760px, 80svh).
  - Transform-style: preserve-3d.

### Task 2.2: Implement Absolute Slide Stacking and 3D Planes
- Add rules for `.organ-slide-3d`:
  - Position: absolute.
  - Inset: 0.
  - Display: grid.
  - Grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr).
  - Align-items: center.
  - Gap: 48px.
  - Transform-style: preserve-3d.
  - Pointer-events: none.
  - Will-change: transform, opacity, filter.
- Invert column order on alternating slides using `.slide-flip` to maintain rhythmic interest.
- Define 3D depth anchors using CSS variables:
  - Approach plane: `translateZ(300px)` with scale 1.15.
  - Focal plane: `translateZ(0px)` with scale 1.00.
  - Recede plane: `translateZ(-350px)` with scale 1.08.

### Task 2.3: Style Golden Vascular Luminescence and Optics
- Add rules for `.specimen-vascular-halo`:
  - Position: absolute.
  - Border-radius: 50%.
  - Background: radial-gradient(circle, var(--theme-vascular-illumination) 0%, transparent 70%).
  - Filter: blur(28px).
  - Pointer-events: none.
  - Animation: vascular-pulse 4.5s ease-in-out infinite alternate.
- Add rules for `.specimen-image`:
  - Width: 100%.
  - Height: 100%.
  - Object-fit: contain.
  - Filter: drop-shadow(0 0 24px rgba(201, 162, 59, 0.35)) drop-shadow(0 26px 30px rgba(13, 59, 33, 0.18)).
- Add rules for `.slide-hud`:
  - Background: var(--glass-bg).
  - Backdrop-filter: blur(var(--glass-blur, 22px)) saturate(var(--glass-saturate, 170%)).
  - Border: var(--glass-border).
  - Border-radius: var(--radius-xl, 24px).
  - Padding: clamp(20px, 3.2vw, 36px).
  - Box-shadow: var(--glass-shadow).

### Task 2.4: Integrate Light and Dark Mode Themes
- Reference token variables from tokens.css for all backgrounds, borders, and text colors.
- Light mode styling:
  - Surface: var(--dna-paper).
  - Text primary: var(--dna-ink).
  - Accent action: var(--dna-primary).
  - Border: var(--dna-line).
- Dark mode styling (`[data-theme="dark"]` and `@media (prefers-color-scheme: dark)`):
  - Surface: #050b18.
  - Text primary: #f4f8ef.
  - Text secondary: #cdd8be.
  - Border: rgba(205, 216, 190, 0.16).
  - Vascular illumination: rgba(244, 211, 129, 0.65).
- Ensure contrast ratio meets or exceeds WCAG AA 4.5:1 for all text elements in both modes.

### Task 2.5: Add Mobile Responsive Rules
- Add media query for `@media (max-width: 900px)`:
  - Change grid to single column: `grid-template-columns: 1fr`.
  - Stack the specimen box above the HUD telemetry card.
  - Reduce specimen height to prevent screen overflow.
  - Compact HUD text size and padding.
- Add media query for `@media (max-width: 640px)`:
  - Position progress scrubber at the top edge of the sticky viewport.
  - Set minimum touch target of 44px by 44px for all interactive buttons and pips.
  - Adjust perspective to 900px to maintain proportion on narrow viewports.

## 5. Phase 3: GSAP 3.12 and ScrollTrigger Integration in script.js

Phase 3 implements the animation engine in script.js.
It manages timeline creation, organ morphing choreography, progress synchronization, and fallback behavior.

### Task 3.1: Environment Check and Plugin Registration
- Check for the existence of `window.gsap` and `window.ScrollTrigger`.
- Register the ScrollTrigger plugin with `gsap.registerPlugin(ScrollTrigger)`.
- If GSAP or ScrollTrigger is missing, log a clean warning and enable the fallback layout.

### Task 3.2: Initialize Master ScrollTrigger Timeline
- Query the pinned container element `#organs`.
- Query all `.organ-slide-3d` elements.
- Construct the master timeline:
  - Trigger: `#organs`.
  - Pin: true.
  - Start: `top top`.
  - End: `+=350vh`.
  - Scrub: 1.0 (enforces the 1.0 second damping scrub requirement).
  - AnticipatePin: 1.
  - InvalidationOnRefresh: true.

### Task 3.3: Construct 8-Organ Morph Choreography
- Divide the timeline into eight equal segment blocks.
- Set initial state for all slides:
  - Slide 0 (Heart): opacity 1, transform `translate3d(0, 0, 0px) scale(1) rotate(0deg)`.
  - Slides 1 through 7: opacity 0, transform `translate3d(0, 0, 300px) scale(1.15) rotate(8deg)`.
- For each transition from slide `i` to slide `i + 1`:
  - Active organ exit sequence:
    - Scale increases from 1.00 to 1.08 for anticipation.
    - Specimen rotates from 0deg to -12deg.
    - Specimen recedes along Z axis from 0px to -350px.
    - Opacity fades from 1 to 0.
    - recede easing uses `cubic-bezier(0.16, 1, 0.3, 1)`.
  - Incoming organ entrance sequence:
    - Starts at 70 percent of the exit duration for overlap.
    - Specimen advances along Z axis from 300px to 0px.
    - Specimen scales down from 1.15 to 1.00.
    - Specimen rotates from 8deg to 0deg.
    - Opacity fades in from 0 to 1.
  - Dwell duration:
    - Maintain slide at focal plane for user inspection before initiating the next transition.

### Task 3.4: Synchronize Progress Scrubber and Telemetry HUD
- Attach timeline update hooks:
  - Update `#stage-scrubber-bar` width from 0 percent to 100 percent.
  - Update `#stage-active-label` text to match the current focal organ name.
  - Update `#stage-step-counter` text to reflect current index (for example `03 / 08`).
  - Toggle `.is-active` class on corresponding navigation step pips.
- Allow clicking any step pip to scroll the window directly to the target timeline position.

### Task 3.5: Integrate Interactive Pointer and Gyroscope Tilt
- Listen to pointermove and deviceorientation events.
- Apply a subtle interactive tilt to the specimen at the focal plane only.
- Limit rotation to -8deg to +6deg on the X axis.
- Limit rotation to -10deg to +12deg on the Y axis.
- Update tilt transforms using `gsap.quickSetter` for optimal 60 frames per second rendering.

### Task 3.6: Handle Reduced Motion and Cleanup
- Evaluate `window.matchMedia("(prefers-reduced-motion: reduce)").matches`.
- When reduced motion is requested:
  - Do not create the pinned ScrollTrigger timeline.
  - Display slides in standard non-pinned accessible vertical flow.
  - Disable 3D depth zooms and rotation transforms.
- Add window resize listener that calls `ScrollTrigger.refresh()` with debounce.

## 6. Phase 4: Verification and Quality Assurance

Phase 4 defines the test procedures, acceptance criteria, and edge-case verification steps.

### Test Matrix and Acceptance Criteria

- `T1` (Syntax and Script Compilation Check):
  - Execute `node --check script.js`.
  - Verify zero syntax errors.
  - Check browser console for zero runtime exceptions.

- `T2` (HTML Markup Validation):
  - Validate all opening and closing tags in index.html.
  - Verify all image sources exist on disk in media/organs/.
  - Verify all accessibility labels and ARIA attributes are valid.

- `T3` (Asset and CDN Resolution Check):
  - Confirm HTTP 200 for GSAP 3.12 CDN script.
  - Confirm HTTP 200 for ScrollTrigger CDN script.
  - Confirm HTTP 200 for tokens.css and styles.css.
  - Verify all eight organ WebP images load properly without broken image icons.

- `T4` (ScrollTrigger Pin Mechanics and Travel Distance):
  - Test scrolling past the hero section into `#organs`.
  - Confirm viewport locks at `#organs`.
  - Measure scroll travel distance to confirm 350vh pinned duration.
  - Confirm smooth unpinning and transition into `#studio` sign-up form.

- `T5` (60 FPS Performance and GPU Acceleration):
  - Inspect Chrome DevTools rendering layer and performance panel.
  - Confirm all animated properties are transform, opacity, and filter.
  - Confirm zero forced layout reflows during scroll scrub.

- `T6` (Responsive Viewport Check):
  - Verify layout across standard viewports: 320px, 390px, 768px, 1024px, 1440px, 1920px.
  - Verify zero horizontal page scrolling or overflow issues.
  - Verify touch target dimensions are at least 44px by 44px on mobile devices.

- `T7` (Reduced Motion Media Query Verification):
  - Emulate `prefers-reduced-motion: reduce` in browser DevTools.
  - Confirm 3D camera travel and pinned scrolljacking are disabled.
  - Confirm information remains fully accessible and readable.

- `T8` (Dual Theme Contrast Verification):
  - Test both light theme and dark theme settings.
  - Confirm contrast ratio exceeds WCAG AA 4.5:1 for all body text.
  - Verify golden vascular illumination renders cleanly without visual clipping.

## 7. Risk Analysis and Mitigations

- `R1` (Risk: CDN Network Latency or Offline Mode):
  - Mitigation: Implement conditional feature check in script.js.
  - If GSAP fails to load, gracefully fall back to accessible CSS grid exhibit cards.

- `R2` (Risk: Mobile Address Bar Resizing Jitter):
  - Mitigation: Use CSS unit 100svh for the sticky viewport.
  - Avoid 100vh to prevent layout snapping as the mobile browser address bar shows or hides.

- `R3` (Risk: Accidental Pin Stacking with Form Anchors):
  - Mitigation: Ensure Skip to Sign Up link calculates actual document offset including pinned travel distance.
  - Test anchor jump behavior directly.
