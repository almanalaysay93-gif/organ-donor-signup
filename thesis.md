# Interaction Thesis and Anti-Slop Doctrine

This document defines the interaction thesis and the anti-slop rules for the SHARE OTSU organ donor platform.
Southern Philippines Medical Center and the Department of Health operate this donor program.

## 1. Interaction Thesis

The specimen stage presents human organs with clinical reverence and physical reality.
The interface locks into a three-dimensional examination chamber when the user enters the organ matrix.

### Pipeline Cast

The interaction system executes four coordinated functions.

- `P1` (User Action): The user scrolls vertically down the page.
The user also moves the pointer across the viewport.
- `P2` (System Action): The viewport pins for 350vh of total travel.
Scroll input couples directly to a GSAP 3.12 ScrollTrigger timeline.
The active three-dimensional specimen rotates along the X and Y axes within strict degree bounds.
The specimen moves from focal plane Z zero to deep background Z negative 600 pixels.
The subsequent specimen approaches from Z positive 180 pixels to focal plane Z zero.
Golden vascular illumination pulses along vessel structures.
Monospace telemetry readouts update with clinical metrics.
The timeline unpins smoothly when the progression reaches the final organ.
- `P3` (Physical Sensation): The specimen exhibits solid mass and inertia.
Movement exhibits hydraulic resistance and physical damping.
The specimen never floats or drifts without scroll input.
Pointer movement causes subtle parallax tilt with measurable resistance.
Optical focus remains sharp at the focal plane and blurs in the background.
- `P4` (Anti-Slop Validation): The motion couples to exact scroll distance.
No timer drives the macro animation.
When scroll stops, all specimen motion settles immediately.

## 2. Anti-Slop Doctrine

Generic artificial intelligence templates generate predictable visual patterns.
This project eliminates six specific synthetic tropes.

- `A1` (No Generic Purple AI Lighting): Purple neon gradients and chromatic aberration haze are forbidden.
The visual palette uses official printed donor card green `#008037`, deep ink `#0d3b21`, surgical sage `#cdd8be`, and 24K vascular gold `#c9a23b`.
- `A2` (No Floaty Non-Physical Easing): Spring curves with uncontrolled rubber oscillations are forbidden.
All motion uses calibrated cubic-bezier deceleration `cubic-bezier(0.16, 1, 0.3, 1)` and damped springs with high resistance.
- `A3` (No Escapable Scroll Traps): Uncontrolled scroll hijacking and automatic page locking without release are forbidden.
The pinned section has a fixed 350vh travel budget and releases cleanly to the pledge form.
- `A4` (No Blurry Canvas Rescaling): Stretched bitmaps and low-resolution raster scaling are forbidden.
Organ specimens use alpha-masked WebP cutouts rendered at high resolution with sub-pixel specular rim lighting.
- `A5` (No Bouncy Text Overshoot): Bouncing numerical values and elastic typography are forbidden.
Monospace telemetry digits switch with discrete stepping and zero spatial bounce.
- `A6` (No Fictional Medical Buzzwords): Exaggerated slogans and emotional hyperbole are forbidden.
Copy uses exact legal definitions from Republic Act 7170 and verifiable clinical donor data.

## 3. Physical Mechanics and Tactile Quality

The specimen stage uses physical optics parameters.
Each organ specimen occupies a calibrated focal field.
Moving the pointer rotates the specimen along fixed axis limits.
A depth blur filter simulates optical lens focus.
Foreground leaves translate across the near plane with fast parallax speed.
Background textures receive depth blur on the far plane.
The user controls specimen position directly with scroll input.

## 4. Accessibility and Reduction Standards

The system protects users with vestibular sensitivity.

- `R1` (Reduced Motion): The system reads `prefers-reduced-motion`.
When active, three-dimensional depth, camera swings, and continuous scrub disable completely.
- `R2` (Contrast Integrity): Body text maintains a contrast ratio of 4.5 to 1 or higher across all surfaces.
- `R3` (Touch Ergonomics): Every interactive target maintains a minimum height of 48 pixels.
