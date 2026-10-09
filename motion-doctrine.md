# Motion Doctrine

This document defines the motion specification for the organ donor registration platform.
It applies principles from LottieFiles and physical animation systems.

## 1. Primary Easing Curves

The motion system uses two primary curves for all spatial changes.

- `E1` (Cinematic Luxury): `cubic-bezier(0.16, 1, 0.3, 1)` controls camera transitions and HUD movements.
This curve gives smooth deceleration without sudden stops.
- `E2` (Specimen Settling): `spring(0.8, 200, 15)` controls physical specimen landing and scale adjustments.
This curve simulates mass, tension, and damping for biological artifacts.
- `E3` (Telemetry Fade): `cubic-bezier(0.25, 1, 0.5, 1)` controls opacity transitions for numerical readouts.

## 2. Duration and Scrub Scale

The timeline couples directly to user scroll position.

- `S1` (Pinned Travel Distance): The organ matrix section pins for 350vh of total scroll distance.
- `S2` (Scrub Damping): ScrollTrigger applies a 1.0 second damping scrub for smooth motion.
- `S3` (Micro Interactions): Button states and toggles execute within 150 to 250 milliseconds.
- `S4` (Macro Transitions): Organ swaps distribute across equal segments of the 350vh scroll distance.
- `S5` (Storytelling Scrub): The complete six organ progression finishes before releasing to the registration form.

## 3. 3D Organ Slide Choreography

Six organs advance in sequential order: Heart, Kidneys, Lungs, Liver, Corneas, and Tissue.
Each organ cycle follows a strict exit and entrance routine.

- `C1` (Organ Sequence): The display order is Heart to Kidneys to Lungs to Liver to Corneas to Tissue.
- `C2` (Active Organ Exit): The active organ zooms to scale 1.08.
The active organ rotates from -12 degrees to 8 degrees.
The active organ recedes along the Z axis to -350px.
The opacity of the exiting organ decreases to 0.
- `C3` (Incoming Organ Entrance): The next organ materializes at Z position 300px with opacity 0.
The incoming organ scales down from 1.15 to 1.00 using spring settling.
The incoming organ rotates to 0 degrees as it approaches the focal plane at Z position 0px.
- `C4` (Telemetry HUD Slide): Clinical telemetry panels slide in from the right edge with a 60 millisecond delay.
- `C5` (Vascular Illumination): A subtle green glow pulses along the organ contours as the specimen reaches center view.
- `C6` (Overlap and Anticipation): The incoming organ begins its forward travel at 70 percent of the exit cycle.

## 4. LottieFiles and Disney Motion Principles

The choreography applies classic animation principles adapted for interface engineering.

- `M1` (Anticipation): The active organ scales up slightly before receding into deep space.
- `M2` (Staging): Only one organ occupies the focal plane at Z position 0px at any scroll moment.
- `M3` (Follow-Through): Telemetry text badges settle after the primary organ specimen stops moving.
- `M4` (Overlapping Action): Vascular pulse illumination begins before the organ completes its rotational alignment.
- `M5` (Weight and Energy): Heavier organs such as the Liver exhibit higher spring settling resistance.

## 5. Anti-Slop Rules

Strict execution constraints prevent visual artifacts and poor interaction performance.

- `A1` (No Bouncy Text Overshoot): Typography elements must never bounce or overshoot their target positions.
- `A2` (No Linear Scroll): Linear interpolation curves are strictly forbidden for spatial motion.
- `A3` (No Generic Purple Haze): Glow effects must use clinical card green `#008037` and sage tones, never purple.
- `A4` (Preserve 60 FPS GPU Transforms): All spatial transformations must use `transform` and `opacity` properties only.
- `A5` (No Layout Shifts): Layout geometry like width and height must remain fixed during transitions.
- `A6` (Respect Reduced Motion): When `prefers-reduced-motion` is active, the system disables 3D depth and scrub animations.

## 6. Technology Architecture Decision

The project evaluates three implementation options for scroll animation.

- `D1` (GSAP 3.12 and ScrollTrigger): Selected architecture.
GSAP delivers high frame rates, precise scrub synchronization, and flexible timeline sequencing.
- `D2` (Lottie Web): Rejected architecture.
Vector animations cannot handle dynamic depth sorting and custom 3D rotation transforms efficiently.
- `D3` (Pure CSS Scroll Driven Animations): Rejected architecture.
Browser support across mobile platforms remains inconsistent for complex pinned scrubbing.

Implementation uses GSAP 3.12 with ScrollTrigger and hardware-accelerated CSS 3D transforms.
