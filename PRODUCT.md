# PRODUCT SPECIFICATION — SHARE OTSU ORGAN DONOR PLEDGE PLATFORM

## 1. Product Identity & Purpose
- **Platform Name**: SHARE OTSU Organ Donor Registry Portal
- **Institution**: Southern Philippines Medical Center (SPMC) — Human Advocate and Retrieval Effort (SHARE) Organ Transplant Services Unit (OTSU) in coordination with Department of Health (DOH).
- **Core Mission**: Modernize the organ donor pledge experience. Convert casual visitors into registered organ donors through emotional resonance, clear medical transparency, and verifiable digital pledge certification.

## 2. Target Audience
- **Primary**: General public (ages 18+) across the Philippines considering organ donation.
- **Secondary**: Transplant coordinators, hospital staff, and donor family members who share and verify pledge commitments.

## 3. Key Functional Deliverables
1. **One Organ per Screen**:
   - Eight full-screen parallax scenes: heart, lungs, liver, kidneys, pancreas, bones, eyes, skin.
   - Each scene shows the number of people the organ can help and the conditions it treats.
   - The hero background is a HyperFrames loop (`media/leaf-loop.mp4`).
2. **Sign-up Form**:
   - Organ and tissue checklist that matches the printed donor card, or "All organs and tissues".
   - Conforme based on Republic Act No. 7170 (Organ Donation Act of 1991).
   - Google Apps Script endpoint submission (`fetch` with fallback).
3. **Digital Donor Card**:
   - The printed SHARE OTSU donor card, front and back, filled from the form as the donor types.
   - One PNG export with both faces. The signature line stays empty.
4. **How It Works and FAQ**:
   - Three steps: sign up, tell your family, give life.

## 4. Success Criteria
- Submissions post reliably to Google Apps Script endpoint.
- Smooth 60fps parallax rendering across desktop and mobile.
- Zero layout shift during video loop load.
- High accessibility score (WCAG AA contrast, reduced-motion fallbacks).
