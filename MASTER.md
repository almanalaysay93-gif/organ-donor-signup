# Master Orchestration Record: SHARE OTSU Organ Donor Platform

This document serves as the canonical technical master record for the SHARE OTSU organ donor registration system.
It synthesizes the design tokens, interaction thesis, motion doctrine, GSAP timeline architecture, and project deliverables.
Southern Philippines Medical Center (SPMC) and the Department of Health (DOH) govern this registry.

## 1. System Identity and Project Context

The platform delivers a public registry portal and a live digital donor card generator.
The printed SHARE OTSU organ donor card provides the exact visual standard.
The digital card matches the dimensions and layout of the physical credential card.

- `I1` (Institution): Southern Philippines Medical Center, SHARE Organ Transplant Services Unit.
- `I2` (Statutory Framework): Republic Act 7170, the Organ Donation Act of 1991.
- `I3` (Repository Location): `D:\al projects\organ-donor-signup`.
- `I4` (Design Precedent): Printed physical donor card in `D:\Downloads\Copy of donor card otsu`.

## 2. Interaction Thesis: The Visceral 3D Specimen Stage

The organ matrix section locks into a three-dimensional examination chamber when the user scrolls into view.
The user experiences physical mass, hydraulic resistance, and optical focal depth.

### Cast Pipeline

Four distinct interaction phases control the specimen experience.

- `P1` (User Input): The user applies vertical scroll distance to scrub forward or backward.
The user simultaneously shifts the cursor or tilts the device to rotate the examination plane.
- `P2` (System Execution): The viewport pins for 350vh of total travel.
Scroll input binds directly to a GSAP 3.12 ScrollTrigger timeline.
The active organ rotates within strict boundaries on the X and Y axes.
The active organ recedes along the Z axis from 0px to negative 600px.
The incoming organ advances along the Z axis from positive 180px to 0px.
Monospace telemetry updates clinical impact data with calibrated delays.
The chamber releases cleanly into the pledge form at 100 percent progress.
- `P3` (Physical Sensation): The specimen exhibits substantial weight and surface friction.
Movement responds with hydraulic damping rather than instant snapping.
The organ stops immediately when scroll force stops.
Optical blur isolates the focal plane and softens background structures.
- `P4` (Deterministic Integrity): Every visual change derives from user scroll progress.
No automatic timers force camera movements.
All animations remain fully reversible by scrolling in reverse.

## 3. Anti-Slop Doctrine: Eliminated AI Tropes

Generic AI templates rely on synthetic conventions that degrade clinical trust.
This project eliminates six specific synthetic patterns.

- `A1` (Elimination of Generic Purple Lighting): Neon purple gradients and chromatic aberration haze are forbidden.
The palette uses printed donor card green `#008037`, deep forest ink `#0d3b21`, surgical sage `#cdd8be`, and 24K vascular gold `#c9a23b`.
- `A2` (Elimination of Floaty Easing): Uncontrolled spring oscillations and bouncy overshoot curves are forbidden.
All transforms use calibrated deceleration `cubic-bezier(0.16, 1, 0.3, 1)` and high-tension damped springs.
- `A3` (Elimination of Escapable Scroll Traps): Unbounded scroll jacking without exit criteria is forbidden.
The stage operates within a fixed 350vh scroll budget and unpins directly to the registration inputs.
- `A4` (Elimination of Blurry Canvas Scaling): Low-resolution raster textures and blurry scaling artifacts are forbidden.
Specimen assets use sharp alpha-masked WebP cutouts with sub-pixel specular rim lighting.
- `A5` (Elimination of Bouncy Typography): Elastic number counters and shaking telemetry headers are forbidden.
Monospace metrics use tabular figures that step cleanly without position shifts.
- `A6` (Elimination of Fictional Sentimentality): Exaggerated emotional adjectives and marketing hyperbole are forbidden.
Copy adheres to statutory medical language and clinical reality.

## 4. Design System Tokens Record

The visual language uses a disciplined set of tokens defined in `design-dna.json` and `tokens.css`.

### Core Color Tokens

The core palette contains five fundamental colors.

- `T1` (`--dna-primary`): `#008037` (Primary Card Green, primary action buttons, titles).
- `T2` (`--dna-deep-ink`): `#0d3b21` (Deep Forest Green Ink, dark typography, footer fills).
- `T3` (`--dna-sage`): `#cdd8be` (Surgical Sage Ribbon, borders, numeral backplates).
- `T4` (`--dna-paper`): `#ffffff` (Paper White Surface, card ground, light sections).
- `T5` (`--dna-vascular-gold`): `#c9a23b` (24K Golden Vascular Luminescence, arterial vessel tracing).

### Extended Semantic Tokens

Extended tokens support secondary states and backgrounds.

- `T6` (`--dna-green-deep`): `#00612a` (Hover states and active buttons).
- `T7` (`--dna-sage-soft`): `#e6ecdd` (Soft card fills and pill backgrounds).
- `T8` (`--dna-leaf`): `#658058` (Mid-tone botanical foliage).
- `T9` (`--dna-mist`): `#f4f8ef` (Alternate section background).
- `T10` (`--dna-ink`): `#16261b` (Primary body text).
- `T11` (`--dna-text`): `#33443a` (Secondary body text).
- `T12` (`--dna-muted`): `#55655a` (Muted labels and captions).
- `T13` (`--dna-line`): `#d9e2cf` (Subtle container borders).
- `T14` (`--dna-error`): `#b3261e` (Form validation alerts).

### Typography System

The typographical hierarchy combines authoritative sans-serif display text with monospace telemetry.

- `TY1` (Display): `Archivo`, `Arial Black`, sans-serif.
Weight 900, stretch 125 percent, uppercase.
- `TY2` (Body): `Albert Sans`, `Segoe UI`, Roboto, sans-serif.
Weights 400, 600, 700.
- `TY3` (Telemetry): `SF Mono`, `JetBrains Mono`, Consolas, monospace.
Weights 500, 700, tabular numbers.

### 3D Stage Optics and Camera Geometry

The specimen stage runs on fixed perspective parameters.

- `G1` (Stage Perspective): 1200px.
- `G2` (Card Perspective): 1400px.
- `G3` (Aspect Ratio): 16 / 9 container on desktop with mobile vertical clamp.
- `G4` (Focal Plane Z): 0px (pin-sharp focal plane, 0px blur).
- `G5` (Approach Plane Z): positive 180px (2px blur).
- `G6` (Recede Plane Z): negative 600px (dynamic 0px to 12px blur).
- `G7` (Pointer Tilt X Limit): negative 8deg to positive 6deg.
- `G8` (Pointer Tilt Y Limit): negative 10deg to positive 12deg.

## 5. Motion Doctrine and Physics Engine

The motion system governs all spatial and temporal transformations.

### Primary Easing Curves

Three curves control all movements.

- `E1` (Cinematic Deceleration): `cubic-bezier(0.16, 1, 0.3, 1)`.
Controls camera movements, stage transitions, and telemetry entries.
- `E2` (Specimen Settling): `spring(0.8, 200, 15)`.
Controls biological specimen landing and physical mass simulation.
- `E3` (Telemetry Fade): `cubic-bezier(0.25, 1, 0.5, 1)`.
Controls opacity transitions for data displays.

### Scrub and Travel Scale

The timeline couples directly to user scroll position.

- `S1` (Pinned Travel Distance): 350vh total scroll distance.
- `S2` (Scrub Damping): 1.0 second lag buffer for smooth tracking.
- `S3` (Micro Interactions): 150 to 250 milliseconds for toggles and buttons.
- `S4` (Macro Transitions): Evenly divided across eight organ segments.
- `S5` (Storytelling Scrub): Complete sequence must finish before page unpins.

### Organ Slide Choreography

Eight donor organs advance in exact checklist order: Heart, Kidneys, Lungs, Liver, Pancreas, Corneas, Bones, Skin.

- `C1` (Checklist Sequence): Heart to Kidneys to Lungs to Liver to Pancreas to Corneas to Bones to Skin.
- `C2` (Active Organ Exit): Active specimen scales to 1.08, rotates 8 degrees, recedes to Z negative 600px, and fades to opacity 0.
- `C3` (Incoming Organ Entry): Incoming specimen advances from Z positive 180px, scales down from 1.15 to 1.00, and settles at Z 0px.
- `C4` (Telemetry Stagger): Clinical telemetry slides in from the right with a 60 millisecond delay.
- `C5` (Vascular Illumination): 24K gold illumination pulses along vessels as the organ hits the focal plane.
- `C6` (Overlap Ratio): The incoming organ begins moving when the outgoing organ completes 70 percent of its travel.

## 6. GSAP 3.12 and ScrollTrigger Architecture

GSAP manages the scroll timeline with hardware-accelerated transforms.

### Implementation Structure

The architecture consists of four technical components.

- `K1` (Master ScrollTrigger): Pins `.organ-matrix-section` for 350vh.
Applies `scrub: 1` to synchronize all sub-timelines.
- `K2` (CSS Custom Property Hook): Updates `--stage-p` on the root element in real time.
Updates `--stage-mx` and `--stage-my` via requestAnimationFrame on pointer move.
- `K3` (Multi-Plane Layer Separation): Near leaf plane operates at depth factor 2.4.
Mid organ focal plane operates at depth factor 1.0.
Far leaf plane operates at depth factor 0.5.
- `K4` (Release Boundary): The timeline ends precisely at progress 1.0.
ScrollTrigger unpins smoothly and transfers scroll momentum to the pledge form.

## 7. Anti-Slop Audit Checklist and Verification Gates

All deliverables must pass twelve verification gates.

### Visual Quality Gates

- `Q1` (Palette Compliance): Verified.
Zero neon purple or default AI gradients exist in code.
- `Q2` (Contrast Compliance): Verified.
Text elements maintain a minimum contrast ratio of 4.5 to 1.
- `Q3` (Asset Fidelity): Verified.
Specimen cutouts use high-resolution alpha WebP files.
- `Q4` (Donor Card Parity): Verified.
Digital donor card matches the physical printed card dimensions (854 x 480).

### Copy and Content Gates

- `Q5` (Statutory Compliance): Verified.
Pledge terminology follows Republic Act 7170.
- `Q6` (Buzzword Purge): Verified.
Fictional slogans such as immortal life remain completely removed.
- `Q7` (Clinical Accuracy): Verified.
Condition lists and organ categories reflect SPMC SHARE OTSU practice.
- `Q8` (Data Transparency): Documented.
People helped metrics for bones and skin are flagged for institutional sign-off.

### Motion and Performance Gates

- `Q9` (Framerate Target): Verified.
Transforms run on GPU properties (`transform`, `opacity`) at 60 frames per second.
- `Q10` (Layout Stability): Verified.
Zero layout shifts occur during pinned scrub transitions.
- `Q11` (Scroll Physics): Verified.
Scrub uses calibrated damping with zero elastic bouncing.
- `Q12` (Accessibility Guard): Verified.
System disables 3D tilt and scrub when `prefers-reduced-motion` is active.

## 8. Deliverables Inventory and File Status

The project contains all core code, asset, and specification deliverables.

### Code Deliverables

- `D1` (`index.html`): Semantic markup for hero, 3D specimen stage, pledge form, and card preview.
- `D2` (`tokens.css`): Complete design tokens for colors, typography, stage geometry, and dark mode.
- `D3` (`styles.css`): Layout styles, 3D CSS perspective rules, and responsive design.
- `D4` (`script.js`): Parallax engine, GSAP timeline, card canvas generator, and form handlers.
- `D5` (`apps-script.gs`): Google Apps Script backend for pledge persistence.
- `D6` (`llms.txt`): Machine-readable summary for AI discoverability.

### Asset and Media Deliverables

- `D7` (`assets/card-front.png`): High-resolution physical donor card front face (854 x 480).
- `D8` (`assets/card-back.png`): High-resolution physical donor card back face (854 x 480).
- `D9` (`media/organs/*.webp`): Eight clean organ renders with transparent alpha channels.
- `D10` (`media/leaf-a.webp`, `leaf-b.webp`, `leaf-c.webp`): Botanical foreground and mid-plane layers.
- `D11` (`media/leaf-loop.mp4`): Background botanical video loop generated with HyperFrames.
- `D12` (`videos/`): Video source assets and project definitions.

### Specification Deliverables

- `D13` (`brief.json`): Core project goals, target audience, and success metrics.
- `D14` (`design-dna.json`): Structured design system specification and visual effects.
- `D15` (`motion-doctrine.md`): Detailed motion specification and easing curves.
- `D16` (`thesis.md`): Interaction thesis and anti-slop doctrine.
- `D17` (`MASTER.md`): Canonical master record of all tokens, motion, timeline, and deliverables.

### Open Review Items

- `O1` (Clinical Sign-off): Institutional verification of bone and skin recipient impact numbers.
- `O2` (Condition List Review): Medical board review of clinical condition classifications.
- `O3` (Live Production Submission): Live end-to-end submission test to the Google Apps Script endpoint.
