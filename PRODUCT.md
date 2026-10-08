# PRODUCT SPECIFICATION — SHARE OTSU ORGAN DONOR PLEDGE PLATFORM

## 1. Product Identity & Purpose
- **Platform Name**: SHARE OTSU Organ Donor Registry Portal
- **Institution**: Southern Philippines Medical Center (SPMC) — Human Advocate and Retrieval Effort (SHARE) Organ Transplant Services Unit (OTSU) in coordination with Department of Health (DOH).
- **Core Mission**: Modernize the organ donor pledge experience. Convert casual visitors into registered organ donors through emotional resonance, clear medical transparency, and verifiable digital pledge certification.

## 2. Target Audience
- **Primary**: General public (ages 18+) across the Philippines considering organ donation.
- **Secondary**: Transplant coordinators, hospital staff, and donor family members who share and verify pledge commitments.

## 3. Key Functional Deliverables
1. **Cinematic 3D Parallax Landing Experience**:
   - Aggressive multi-layer parallax stage featuring HyperFrames ambient motion loops (`hero-loop.mp4`, `flow-loop.mp4`).
   - Floating 3D organ cutouts (`kidney.webp`, `kidneys.webp`, `bloodwave.webp`, `lens.webp`) responding dynamically to scroll and mouse gyro tilt.
2. **Interactive Organ Pledge Suite**:
   - Granular organ & tissue checklist (Kidneys, Liver, Heart, Lungs, Pancreas, Corneas, Bone/Tissue, or "All Organs").
   - Transparent legal conforme based on Republic Act No. 7170 (Organ Donation Act of 1991).
   - Frictionless Google Apps Script endpoint submission (`fetch` with fallback).
3. **Live Digital Donor Card Generator**:
   - Real-time canvas/HTML card render updating as user types their name, blood type, and emergency contacts.
   - Holographic gold seal with SPMC/SHARE OTSU insignias.
   - One-click instant PNG export for wallet/mobile storage.
4. **Educational Impact Telemetry**:
   - Interactive impact counter: 1 donor = 8 major organs + 50+ tissue beneficiaries.
   - 3-step procedural pathway: Pledge -> Inform Family -> Save Lives.

## 4. Success Criteria
- Submissions post reliably to Google Apps Script endpoint.
- Smooth 60fps parallax rendering across desktop and mobile.
- Zero layout shift during video loop load.
- High accessibility score (WCAG AA contrast, reduced-motion fallbacks).
