# Brainstorming and Architectural Decisions

This document records the architectural brainstorming for the 3D scroll slideshow.
It documents key decisions, questions, edge cases, and alternatives before code execution.
It follows Simplified Technical English rules.
Each sentence occupies its own line.

## 1. Questions and Assumptions

- `Q1`: Does the 3D slideshow replace the existing eight separate scene sections or encapsulate them?
The current implementation renders eight independent full-height sections.
The new architecture replaces the disjoint scenes with one pinned stage container of 350vh total scroll travel.
All eight organs remain present in the exact order of the printed donor card.

- `Q2`: How does the system handle asset loading and network failures for external CDN scripts?
The application relies on GSAP 3.12 and ScrollTrigger from the jsDelivr CDN.
If the CDN fails to load, the script must detect the missing global objects.
It must fall back to a clean native scroll layout without breaking the page.

- `Q3`: How does the pinned stage coordinate with the existing pointer and device orientation parallax?
The existing script updates CSS custom variables for pointer coordinates.
The new design retains pointer tilt on the active focal plane organ.
GSAP controls the macro Z-depth and rotation choreography during scroll.

- `Q4`: How does the system maintain accessibility for users who prefer reduced motion?
Users with vestibular motion sensitivity can experience nausea from 3D camera travel.
The system checks the prefers-reduced-motion media query.
When active, the system bypasses the pinned scroll timeline.
It presents the eight organ exhibits as standard accessible stacked panels.

- `Q5`: What is the exact organ sequence across the platform?
The printed SHARE OTSU donor card contains eight specific checkboxes.
The sequence is Heart, Lungs, Liver, Kidneys, Pancreas, Bones, Eyes, and Skin.
The 3D slideshow preserves this eight organ sequence.

## 2. Architecture Alternatives Evaluated

- `A1`: GSAP 3.12 with ScrollTrigger (Selected Architecture).
GSAP provides hardware-accelerated timeline scrubbing.
It handles pinned scroll containers across desktop and mobile browsers.
It provides precise sub-pixel rendering and damped scrub synchronization.

- `A2`: Pure CSS Scroll-Driven Animations (Rejected Architecture).
CSS scroll-timeline is not supported across all mobile Safari and older Chrome browsers.
It does not support complex multi-stage Z-axis spring dampening.
Browser support remains inconsistent in 2026 for production medical registries.

- `A3`: Three.js / WebGL Specimen Canvas (Rejected Architecture).
WebGL increases bundle size by more than 600 kilobytes.
Shader compilation can stutter on entry-level mobile devices.
The existing assets are high-resolution transparent WebP specimens.
DOM-based CSS 3D transforms with GSAP deliver 60 frames per second at minimal memory cost.

## 3. Core Decisions

- `D1`: Pinned Travel Distance.
The organ matrix section pins for exactly 350vh of total scroll distance.
This gives enough physical travel distance for smooth transitions across eight organs.

- `D2`: Scrub Damping Value.
ScrollTrigger uses a 1.0 second damping scrub parameter.
This matches the physical weight specification in the motion doctrine.

- `D3`: 3D Stage Depth Coordinates.
The focal viewing plane sits at Z position 0px.
Incoming organs approach from Z position 300px with scaling down from 1.15 to 1.00.
Exiting organs recede to Z position -350px with scaling up to 1.08.

- `D4`: Single Master Timeline Architecture.
One continuous GSAP timeline controls all eight organ transitions.
Each organ receives an equal portion of the scroll travel distance.
An overlap factor of 30 percent allows smooth cross-fading and z-depth passing.

- `D5`: Dual Theme Token Integration.
The stage connects directly to tokens.css.
It supports both light paper mode and obsidian dark mode without style duplication.

## 4. Edge Cases Identified

- `E1`: Rapid Direction Reversal.
A user can scroll down quickly and then reverse scroll direction immediately.
GSAP scrub damping smoothly reverses the timeline without frame drops.

- `E2`: Viewport Resize During Pinned State.
Resizing the window or rotating a mobile device can recalculate scroll coordinates.
The script attaches a debounced resize listener that calls ScrollTrigger.refresh.

- `E3`: Direct Hash Navigation.
A user clicking a nav link like Skip to Organs or Sign Up must navigate cleanly.
The implementation provides safe scroll targets that do not get trapped in pinned loops.

- `E4`: Mobile Address Bar Dynamic Resize.
Mobile Safari and Chrome dynamically resize the window height as the user scrolls.
The sticky container uses 100svh instead of 100vh to prevent visual snapping.
