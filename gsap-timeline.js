/**
 * ============================================================================
 * GSAP 3D Organ Slideshow Timeline Architecture
 * Repository: organ-donor-signup
 * Pinned section: #organ-slideshow-section
 * Specs: 60fps GPU-only transforms, scrub: 1, pin: true, anticipatePin: 1
 * Modules: ESM / CommonJS / Browser Global compatible
 * ============================================================================
 */

(function (global, factory) {
  if (typeof exports === 'object' && typeof module !== 'undefined') {
    module.exports = factory();
  } else if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else {
    const exportsObj = factory();
    global.createOrgan3DSlideshowTimeline = exportsObj.createOrgan3DSlideshowTimeline;
    global.ORGAN_SLIDES = exportsObj.SLIDES;
    global.ORGAN_DEFAULT_CONFIG = exportsObj.DEFAULT_CONFIG;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : this, function () {
  'use strict';

  /**
   * Eight clinical organs matching official registry card checklist.
   */
  const SLIDES = ['Heart', 'Kidneys', 'Lungs', 'Liver', 'Pancreas', 'Bones', 'Eyes', 'Skin'];

  /**
   * Clinical metadata for each slide in the organ sequence.
   */
  const SLIDE_METADATA = [
    {
      id: 'heart',
      name: 'Heart',
      index: 1,
      total: 8,
      category: 'Vital Organ',
      livesSaved: '1 life saved',
      lede: 'A donated heart gives one person with end-stage heart failure a second life.',
      conditions: ['End-stage cardiomyopathy', 'Severe coronary disease', 'Congenital defects'],
      asset: 'media/organs/heart.webp'
    },
    {
      id: 'kidneys',
      name: 'Kidneys',
      index: 2,
      total: 8,
      category: 'Paired Organ',
      livesSaved: '2 lives saved',
      lede: 'Two kidneys can free two patients from life-long dialysis dependency.',
      conditions: ['End-stage renal disease', 'Diabetic nephropathy', 'Glomerulonephritis'],
      asset: 'media/organs/kidneys.webp'
    },
    {
      id: 'lungs',
      name: 'Lungs',
      index: 3,
      total: 8,
      category: 'Respiratory System',
      livesSaved: '2 lives saved',
      lede: 'Two lungs restore independent respiration to two individuals.',
      conditions: ['COPD and emphysema', 'Pulmonary fibrosis', 'Cystic fibrosis'],
      asset: 'media/organs/lungs.webp'
    },
    {
      id: 'liver',
      name: 'Liver',
      index: 4,
      total: 8,
      category: 'Metabolic Organ',
      livesSaved: 'Up to 2 lives saved',
      lede: 'A single liver can be split to save an adult and a pediatric patient simultaneously.',
      conditions: ['Liver cirrhosis', 'Biliary atresia in infants', 'Acute hepatic failure'],
      asset: 'media/organs/liver.webp'
    },
    {
      id: 'pancreas',
      name: 'Pancreas',
      index: 5,
      total: 8,
      category: 'Endocrine Organ',
      livesSaved: '1 life saved',
      lede: 'A new pancreas makes insulin again, often transplanted together with a kidney.',
      conditions: ['Type 1 diabetes', 'Diabetes with kidney failure', 'Severe hypoglycemia'],
      asset: 'media/organs/pancreas.webp'
    },
    {
      id: 'bones',
      name: 'Bones',
      index: 6,
      total: 8,
      category: 'Structural Tissue',
      livesSaved: '10+ people helped',
      lede: 'Donated bone rebuilds limbs and spines, preventing amputations and restoring mobility.',
      conditions: ['Bone cancer', 'Severe fractures & trauma', 'Spinal reconstruction'],
      asset: 'media/organs/bones.webp'
    },
    {
      id: 'eyes',
      name: 'Eyes & Corneas',
      index: 7,
      total: 8,
      category: 'Ocular Tissue',
      livesSaved: 'Sight for 2 people',
      lede: 'Clear corneal grafts restore vision and light to people blinded by injury or disease.',
      conditions: ['Corneal blindness', 'Keratoconus', 'Corneal dystrophy'],
      asset: 'media/organs/eyes.webp'
    },
    {
      id: 'skin',
      name: 'Skin Tissue',
      index: 8,
      total: 8,
      category: 'Biological Barrier',
      livesSaved: '20+ people helped',
      lede: 'Donated skin biological dressings protect severe burn victims, preventing fatal infection.',
      conditions: ['Critical burns', 'Large trauma wounds', 'Severe dermatological loss'],
      asset: 'media/organs/skin.webp'
    }
  ];

  /**
   * Default configuration adhering to motion doctrine and architectural rules.
   */
  const DEFAULT_CONFIG = {
    sectionSelector: '#organ-slideshow-section',
    stickyContainerSelector: '.organ-slideshow-sticky',
    progressBarSelector: '.organ-progress-fill',
    stepPillsContainerSelector: '.organ-step-pills',
    stepPillSelector: '.organ-step-pill',
    stageViewportSelector: '.organ-stage-viewport',
    slidesContainerSelector: '.organ-slides-container',
    slideSelector: '.organ-slide',
    specimenSelector: '.organ-specimen-3d',
    hudSelector: '.organ-hud-panel',
    vascularGlowSelector: '.vascular-glow',
    travelDistance: '350vh',
    pin: true,
    scrub: 1,
    anticipatePin: 1,
    markers: false,
    slides: SLIDES,
    activeClass: 'active',
    onSlideChange: null,
    onUpdate: null
  };

  /**
   * Configures and registers custom easing curves adhering to motion-doctrine.md.
   * E1 (Cinematic Luxury): cubic-bezier(0.16, 1, 0.3, 1)
   * E2 (Specimen Settling): Damped spring response
   * E3 (Telemetry Fade): cubic-bezier(0.25, 1, 0.5, 1)
   */
  function resolveEasings(gsap) {
    let easeCinematic = 'power3.out';
    let easeSettling = 'power2.out';
    let easeTelemetry = 'power2.out';

    if (gsap && gsap.parseEase) {
      try {
        easeCinematic = gsap.parseEase('cubic-bezier(0.16, 1, 0.3, 1)');
        easeSettling = gsap.parseEase('back.out(0.6)');
        easeTelemetry = gsap.parseEase('cubic-bezier(0.25, 1, 0.5, 1)');
      } catch (e) {
        easeCinematic = 'power3.out';
        easeSettling = 'back.out(0.6)';
        easeTelemetry = 'power2.out';
      }
    }

    return { easeCinematic, easeSettling, easeTelemetry };
  }

  /**
   * Main factory function creating the 3D organ slideshow timeline.
   *
   * @param {object} gsap - GreenSock GSAP core instance.
   * @param {object} ScrollTrigger - GreenSock ScrollTrigger plugin.
   * @param {object} options - Configuration overrides.
   * @returns {object} Controller object containing timeline, ScrollTrigger, and lifecycle hooks.
   */
  function createOrgan3DSlideshowTimeline(gsap, ScrollTrigger, options = {}) {
    if (!gsap) {
      throw new Error('createOrgan3DSlideshowTimeline requires a valid GSAP instance.');
    }

    if (ScrollTrigger && typeof gsap.registerPlugin === 'function') {
      gsap.registerPlugin(ScrollTrigger);
    }

    const config = Object.assign({}, DEFAULT_CONFIG, options);
    const sectionEl = document.querySelector(config.sectionSelector);

    // Fallback if section element does not exist in the DOM
    if (!sectionEl) {
      return {
        timeline: null,
        scrollTrigger: null,
        ctx: null,
        goToSlide: function () {},
        refresh: function () {},
        kill: function () {},
        revert: function () {}
      };
    }

    const reduceMotion = typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const { easeCinematic, easeSettling, easeTelemetry } = resolveEasings(gsap);

    // Context encapsulation for safe memory cleanup
    const ctx = gsap.context(() => {}, sectionEl);

    let masterTimeline = null;
    let mainScrollTrigger = null;
    const pillClickHandlers = [];

    ctx.add(() => {
      // Query DOM elements within section context
      const progressBar = sectionEl.querySelector(config.progressBarSelector);
      const stepPills = Array.from(sectionEl.querySelectorAll(config.stepPillSelector));
      const slides = Array.from(sectionEl.querySelectorAll(config.slideSelector));
      const stageViewport = sectionEl.querySelector(config.stageViewportSelector);

      // Enforce 3D hardware compositing styling
      if (stageViewport) {
        gsap.set(stageViewport, {
          perspective: 1200,
          transformStyle: 'preserve-3d',
          force3D: true
        });
      }

      // Collect slide components
      const slideElements = slides.map((slide, index) => {
        const specimen = slide.querySelector(config.specimenSelector);
        const hud = slide.querySelector(config.hudSelector);
        const glow = slide.querySelector(config.vascularGlowSelector);

        // Set hardware acceleration markers
        if (specimen) {
          gsap.set(specimen, {
            transformStyle: 'preserve-3d',
            willChange: 'transform, opacity',
            force3D: true
          });
        }
        if (hud) {
          gsap.set(hud, {
            willChange: 'transform, opacity',
            force3D: true
          });
        }

        return { index, slide, specimen, hud, glow };
      });

      const totalSlides = slideElements.length > 0 ? slideElements.length : config.slides.length;
      let activeSlideIndex = 0;

      // Function to sync pill active state
      function updateActivePill(newIndex) {
        if (newIndex === activeSlideIndex) return;
        activeSlideIndex = newIndex;

        stepPills.forEach((pill, idx) => {
          if (idx === activeSlideIndex) {
            pill.classList.add(config.activeClass);
            pill.setAttribute('aria-selected', 'true');
          } else {
            pill.classList.remove(config.activeClass);
            pill.setAttribute('aria-selected', 'false');
          }
        });

        if (typeof config.onSlideChange === 'function') {
          const currentName = config.slides[activeSlideIndex] || `Slide ${activeSlideIndex + 1}`;
          config.onSlideChange(activeSlideIndex, currentName);
        }
      }

      // Initial state setup
      slideElements.forEach(({ specimen, hud, glow }, idx) => {
        if (idx === 0) {
          // Slide 0: initially active at focal plane (z: 0px)
          if (specimen) {
            gsap.set(specimen, {
              x: 0,
              y: 0,
              z: 0,
              rotationX: 0,
              rotationY: 0,
              scale: 1,
              opacity: 1,
              visibility: 'visible'
            });
          }
          if (hud) {
            gsap.set(hud, {
              x: 0,
              y: 0,
              opacity: 1,
              visibility: 'visible'
            });
          }
          if (glow) {
            gsap.set(glow, { opacity: 0.85, scale: 1 });
          }
        } else {
          // Slides 1..N-1: initially waiting in deep approach depth
          if (specimen) {
            gsap.set(specimen, {
              x: 0,
              y: 0,
              z: reduceMotion ? 0 : 300,
              rotationX: 0,
              rotationY: reduceMotion ? 0 : -10,
              scale: reduceMotion ? 1 : 1.15,
              opacity: 0,
              visibility: 'hidden'
            });
          }
          if (hud) {
            gsap.set(hud, {
              x: reduceMotion ? 0 : 40,
              y: 0,
              opacity: 0,
              visibility: 'hidden'
            });
          }
          if (glow) {
            gsap.set(glow, { opacity: 0, scale: 0.9 });
          }
        }
      });

      if (progressBar) {
        gsap.set(progressBar, {
          scaleX: 1 / totalSlides,
          transformOrigin: 'left center',
          willChange: 'transform'
        });
      }

      // Create master scrubbed timeline
      masterTimeline = gsap.timeline({
        paused: false,
        defaults: { ease: easeCinematic }
      });

      // Construct ScrollTrigger if plugin is present
      if (ScrollTrigger) {
        mainScrollTrigger = ScrollTrigger.create({
          trigger: sectionEl,
          pin: config.pin,
          start: 'top top',
          end: `+=${config.travelDistance}`,
          scrub: config.scrub,
          anticipatePin: config.anticipatePin,
          markers: config.markers,
          animation: masterTimeline,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // Update progress bar
            if (progressBar) {
              const currentProgress = (1 / totalSlides) + (self.progress * ((totalSlides - 1) / totalSlides));
              gsap.set(progressBar, { scaleX: Math.min(1, Math.max(0, currentProgress)) });
            }

            // Calculate active slide index
            const stepFraction = 1 / (totalSlides - 1);
            const calculatedIndex = Math.min(
              totalSlides - 1,
              Math.max(0, Math.round(self.progress / stepFraction))
            );
            updateActivePill(calculatedIndex);

            if (typeof config.onUpdate === 'function') {
              config.onUpdate(self);
            }
          }
        });
      }

      // Build sequence transitions
      const segmentDuration = 1.0;
      const overlapRatio = 0.7; // Incoming slide starts at 70% of outgoing exit

      for (let i = 0; i < totalSlides - 1; i++) {
        const current = slideElements[i];
        const next = slideElements[i + 1];
        const segStart = i * segmentDuration;
        const incomingStart = segStart + (segmentDuration * overlapRatio);

        if (!current || !next) continue;

        // --- Current slide exit tweens (Rule C2) ---
        if (reduceMotion) {
          if (current.specimen) {
            masterTimeline.to(current.specimen, {
              opacity: 0,
              duration: segmentDuration,
              ease: easeTelemetry
            }, segStart);
          }
          if (current.hud) {
            masterTimeline.to(current.hud, {
              opacity: 0,
              duration: segmentDuration * 0.7,
              ease: easeTelemetry
            }, segStart);
          }
        } else {
          if (current.specimen) {
            masterTimeline.to(current.specimen, {
              scale: 1.08,
              rotationY: 8,
              rotationX: -4,
              z: -350,
              opacity: 0,
              duration: segmentDuration,
              ease: easeCinematic,
              onComplete: () => {
                if (current.specimen) current.specimen.style.visibility = 'hidden';
              }
            }, segStart);
          }

          if (current.hud) {
            masterTimeline.to(current.hud, {
              x: -30,
              opacity: 0,
              duration: segmentDuration * 0.6,
              ease: easeCinematic,
              onComplete: () => {
                if (current.hud) current.hud.style.visibility = 'hidden';
              }
            }, segStart);
          }

          if (current.glow) {
            masterTimeline.to(current.glow, {
              opacity: 0,
              duration: segmentDuration * 0.5,
              ease: 'power1.out'
            }, segStart);
          }
        }

        // --- Next slide entrance tweens (Rules C3, C4, C5) ---
        if (reduceMotion) {
          if (next.specimen) {
            masterTimeline.set(next.specimen, { visibility: 'visible' }, incomingStart);
            masterTimeline.to(next.specimen, {
              opacity: 1,
              duration: segmentDuration * (1 - overlapRatio + 0.3),
              ease: easeTelemetry
            }, incomingStart);
          }
          if (next.hud) {
            masterTimeline.set(next.hud, { visibility: 'visible' }, incomingStart + 0.05);
            masterTimeline.to(next.hud, {
              opacity: 1,
              duration: segmentDuration * 0.4,
              ease: easeTelemetry
            }, incomingStart + 0.05);
          }
        } else {
          if (next.specimen) {
            masterTimeline.set(next.specimen, { visibility: 'visible' }, incomingStart);
            masterTimeline.to(next.specimen, {
              z: 0,
              rotationY: 0,
              rotationX: 0,
              scale: 1.0,
              opacity: 1,
              duration: segmentDuration * (1 - overlapRatio + 0.4),
              ease: easeSettling
            }, incomingStart);
          }

          if (next.hud) {
            const hudDelay = 0.06; // 60ms scrub equivalent delay (Rule C4)
            masterTimeline.set(next.hud, { visibility: 'visible' }, incomingStart + hudDelay);
            masterTimeline.to(next.hud, {
              x: 0,
              opacity: 1,
              duration: segmentDuration * 0.5,
              ease: easeCinematic
            }, incomingStart + hudDelay);
          }

          if (next.glow) {
            masterTimeline.to(next.glow, {
              opacity: 0.85,
              scale: 1.0,
              duration: segmentDuration * 0.4,
              ease: 'power2.out'
            }, incomingStart + 0.1);
          }
        }
      }

      // Wire interactive step indicator pills
      stepPills.forEach((pill, pillIndex) => {
        const clickHandler = (e) => {
          e.preventDefault();
          if (!mainScrollTrigger) return;
          const totalDist = mainScrollTrigger.end - mainScrollTrigger.start;
          const targetProgress = pillIndex / (totalSlides - 1);
          const targetScrollY = mainScrollTrigger.start + (targetProgress * totalDist);

          if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
            window.scrollTo({
              top: targetScrollY,
              behavior: 'smooth'
            });
          }
        };

        pill.addEventListener('click', clickHandler);
        pillClickHandlers.push({ pill, handler: clickHandler });
      });
    });

    /**
     * Programmatically scrolls to a specific slide index (0 to N-1).
     * @param {number} slideIndex
     */
    function goToSlide(slideIndex) {
      if (!mainScrollTrigger) return;
      const totalSlides = config.slides.length;
      const clampedIndex = Math.min(totalSlides - 1, Math.max(0, slideIndex));
      const totalDist = mainScrollTrigger.end - mainScrollTrigger.start;
      const targetProgress = clampedIndex / (totalSlides - 1);
      const targetScrollY = mainScrollTrigger.start + (targetProgress * totalDist);

      if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
        window.scrollTo({
          top: targetScrollY,
          behavior: 'smooth'
        });
      }
    }

    /**
     * Re-computes scroll metrics on resize or dynamic layout changes.
     */
    function refresh() {
      if (mainScrollTrigger && typeof mainScrollTrigger.refresh === 'function') {
        mainScrollTrigger.refresh();
      }
    }

    /**
     * Disposes timeline, ScrollTrigger, and removes event listeners without layout leaks.
     */
    function kill() {
      pillClickHandlers.forEach(({ pill, handler }) => {
        pill.removeEventListener('click', handler);
      });
      pillClickHandlers.length = 0;

      if (mainScrollTrigger && typeof mainScrollTrigger.kill === 'function') {
        mainScrollTrigger.kill(true);
        mainScrollTrigger = null;
      }

      if (masterTimeline && typeof masterTimeline.kill === 'function') {
        masterTimeline.kill();
        masterTimeline = null;
      }
    }

    /**
     * Completely reverts all DOM styles applied by GSAP back to clean pristine state.
     */
    function revert() {
      kill();
      if (ctx && typeof ctx.revert === 'function') {
        ctx.revert();
      }
    }

    return {
      timeline: masterTimeline,
      scrollTrigger: mainScrollTrigger,
      ctx,
      goToSlide,
      refresh,
      kill,
      revert
    };
  }

  return {
    createOrgan3DSlideshowTimeline,
    SLIDES,
    SLIDE_METADATA,
    DEFAULT_CONFIG
  };
});
