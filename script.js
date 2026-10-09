// ==========================================================================
//  SHARE — Organ donor sign-up
//  Scene parallax, live donor card (front and back), PNG export, form submit
// ==========================================================================

(function () {
  "use strict";

  // Deployed Google Apps Script Web App Endpoint
  const SUBMIT_ENDPOINT = "https://script.google.com/macros/s/AKfycbzIsJuw0cfL6SHlAbvJnpxsYLPjU0IKg2aWoGpd3SIKX2Te20bvGw3cXKQwLkJ_7Fmp/exec";

  const root = document.documentElement;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // DOM Elements
  const nav = document.getElementById("site-nav");
  const form = document.getElementById("donor-form");
  const thankYou = document.getElementById("thank-you");
  const submitBtn = document.getElementById("submit-btn");
  const organsGroup = document.getElementById("organs-group");
  const organsError = document.getElementById("organs-error");
  const allOrgans = document.getElementById("all-organs");
  const meterCounterDisplay = document.getElementById("meter-counter-display");
  const meterFillBar = document.getElementById("meter-fill-bar");

  const donorCard = document.getElementById("digital-donor-card");
  const cardFill = document.getElementById("dcard-fill");
  const btnFlipCard = document.getElementById("btn-flip-card");
  const btnDownloadCard = document.getElementById("btn-download-card");
  const btnSaveCardThankyou = document.getElementById("btn-save-card-thankyou");

  const fullNameInput = document.getElementById("fullName");
  const bloodTypeSelect = document.getElementById("bloodType");
  const contactNameInput = document.getElementById("contactName");
  const contactNumberInput = document.getElementById("contactNumber");

  // ------------------------------------------------------------------------
  // 1. Donor card geometry. Units are pixels of the 854 x 480 card art.
  //    The live card and the PNG export both read these values.
  // ------------------------------------------------------------------------
  const CARD_W = 854;
  const CARD_H = 480;
  const INK = "#0d3b21";

  // Each text field sits on a printed line: x = start, line = y of the line, right = line end.
  const TEXT_FIELDS = {
    name: { x: 206, line: 40, right: 812 },
    blood: { x: 322, line: 76, right: 812 },
    kin: { x: 392, line: 148, right: 812 },
    contact: { x: 338, line: 189, right: 812 }
  };
  const TEXT_HEIGHT = 26;

  // Centers of the printed checkboxes.
  const CHECK_BOXES = {
    Heart: [105, 274], Lungs: [105, 306], Liver: [105, 338], Kidneys: [105, 371],
    Pancreas: [282, 274], Bones: [282, 306], Eyes: [282, 338], Skin: [282, 371],
    All: [501, 274]
  };

  const fillText = {};
  const fillChecks = {};

  if (cardFill) {
    Object.keys(TEXT_FIELDS).forEach(function (key) {
      const f = TEXT_FIELDS[key];
      const el = document.createElement("span");
      el.className = "fill-text";
      el.style.left = (f.x / CARD_W) * 100 + "%";
      el.style.top = ((f.line - TEXT_HEIGHT - 2) / CARD_H) * 100 + "%";
      el.style.width = ((f.right - f.x) / CARD_W) * 100 + "%";
      el.style.height = (TEXT_HEIGHT / CARD_H) * 100 + "%";
      cardFill.appendChild(el);
      fillText[key] = el;
    });
    Object.keys(CHECK_BOXES).forEach(function (key) {
      const c = CHECK_BOXES[key];
      const el = document.createElement("span");
      el.className = "fill-check";
      el.style.left = (c[0] / CARD_W) * 100 + "%";
      el.style.top = (c[1] / CARD_H) * 100 + "%";
      el.innerHTML = '<svg viewBox="0 0 20 20"><path d="M3 10.5l5 5L18 3" fill="none" stroke="#008037" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      cardFill.appendChild(el);
      fillChecks[key] = el;
    });
  }

  function cardState() {
    const allSelected = !!(allOrgans && allOrgans.checked);
    const checked = {};
    if (organsGroup) {
      organsGroup.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
        if (cb !== allOrgans && cb.checked) checked[cb.value] = true;
      });
    }
    if (allSelected) checked.All = true;
    return {
      name: fullNameInput ? fullNameInput.value.trim() : "",
      blood: bloodTypeSelect ? bloodTypeSelect.value : "",
      kin: contactNameInput ? contactNameInput.value.trim() : "",
      contact: contactNumberInput ? contactNumberInput.value.trim() : "",
      checked: checked
    };
  }

  function updateLiveCard() {
    const s = cardState();
    Object.keys(fillText).forEach(function (key) {
      fillText[key].textContent = s[key];
    });
    Object.keys(fillChecks).forEach(function (key) {
      fillChecks[key].classList.toggle("on", !!s.checked[key]);
    });
  }

  function setCardSide(side) {
    if (!donorCard) return;
    donorCard.setAttribute("data-side", side);
    if (btnFlipCard) btnFlipCard.setAttribute("aria-pressed", side === "back" ? "true" : "false");
  }

  if (btnFlipCard) {
    btnFlipCard.addEventListener("click", function () {
      setCardSide(donorCard.getAttribute("data-side") === "back" ? "front" : "back");
    });
  }

  // The back holds the donor's details, so show it when the donor starts the form.
  if (form) {
    form.addEventListener("focusin", function () { setCardSide("back"); }, { once: true });
    form.addEventListener("input", updateLiveCard);
    form.addEventListener("change", updateLiveCard);
  }

  // ------------------------------------------------------------------------
  // 2. Organ checklist and impact meter
  // ------------------------------------------------------------------------
  function updatePledgeImpactMeter() {
    if (!organsGroup || !meterCounterDisplay || !meterFillBar) return;

    if (allOrgans && allOrgans.checked) {
      meterCounterDisplay.textContent = "8 lives saved · 50+ people helped";
      meterFillBar.style.width = "100%";
      return;
    }

    let totalLives = 0;
    let totalHealed = 0;
    organsGroup.querySelectorAll('input[type="checkbox"]:checked').forEach(function (cb) {
      const item = cb.closest(".organ-check-item");
      if (!item || cb === allOrgans) return;
      totalLives += parseInt(item.getAttribute("data-lives") || "0", 10);
      totalHealed += parseInt(item.getAttribute("data-healed") || "0", 10);
    });

    if (totalLives === 0 && totalHealed === 0) {
      meterCounterDisplay.textContent = "Choose an organ";
      meterFillBar.style.width = "0%";
      return;
    }

    const parts = [];
    if (totalLives > 0) parts.push(totalLives + (totalLives === 1 ? " life saved" : " lives saved"));
    // Eyes alone restore sight to exactly 2 people. Bone and skin counts are lower bounds.
    if (totalHealed > 0) parts.push(totalHealed + (totalHealed > 2 ? "+" : "") + " people helped");
    meterCounterDisplay.textContent = parts.join(" · ");

    const livesFactor = Math.min(totalLives / 8, 1);
    const healedFactor = Math.min(totalHealed / 32, 1);
    meterFillBar.style.width = Math.max(10, Math.round((livesFactor * 0.7 + healedFactor * 0.3) * 100)) + "%";
  }

  function validateOrgans() {
    if (!organsGroup) return true;
    const ok = organsGroup.querySelectorAll('input[type="checkbox"]:checked').length > 0;
    if (organsError) organsError.hidden = ok;
    return ok;
  }

  if (allOrgans && organsGroup) {
    organsGroup.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
      cb.addEventListener("change", function () {
        if (cb === allOrgans && allOrgans.checked) {
          organsGroup.querySelectorAll('input[type="checkbox"]').forEach(function (other) {
            if (other !== allOrgans) other.checked = false;
          });
        } else if (cb.checked) {
          allOrgans.checked = false;
        }
        validateOrgans();
        updateLiveCard();
        updatePledgeImpactMeter();
      });
    });
  }

  // ------------------------------------------------------------------------
  // 3. Donor card PNG: front on top, back below, filled from the form
  // ------------------------------------------------------------------------
  function loadImage(src) {
    return new Promise(function (resolve, reject) {
      const img = new Image();
      img.onload = function () { resolve(img); };
      img.onerror = reject;
      img.src = src;
    });
  }

  function drawCardBack(ctx, img, s, scale) {
    ctx.drawImage(img, 0, 0, CARD_W * scale, CARD_H * scale);
    ctx.fillStyle = INK;
    ctx.textBaseline = "alphabetic";
    Object.keys(TEXT_FIELDS).forEach(function (key) {
      const f = TEXT_FIELDS[key];
      const text = (s[key] || "").toUpperCase();
      if (!text) return;
      const maxW = (f.right - f.x) * scale;
      let size = 22 * scale;
      ctx.font = "700 " + size + "px 'Albert Sans', Arial, sans-serif";
      const w = ctx.measureText(text).width;
      if (w > maxW) {
        size = Math.max(11 * scale, size * (maxW / w));
        ctx.font = "700 " + size + "px 'Albert Sans', Arial, sans-serif";
      }
      ctx.fillText(text, f.x * scale, (f.line - 5) * scale, maxW);
    });
    ctx.strokeStyle = "#008037";
    ctx.lineWidth = 3.6 * scale;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    Object.keys(CHECK_BOXES).forEach(function (key) {
      if (!s.checked[key]) return;
      const cx = CHECK_BOXES[key][0] * scale;
      const cy = CHECK_BOXES[key][1] * scale;
      const u = 1.05 * scale; // one unit of the 20-unit check glyph
      ctx.beginPath();
      ctx.moveTo(cx - 7 * u, cy + 0.5 * u);
      ctx.lineTo(cx - 2 * u, cy + 5.5 * u);
      ctx.lineTo(cx + 8 * u, cy - 7 * u);
      ctx.stroke();
    });
  }

  function downloadCardPNG() {
    const scale = 2;
    const gap = 24 * scale;
    const w = CARD_W * scale;
    const h = CARD_H * scale;
    const s = cardState();

    const ready = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
    return Promise.all([loadImage("assets/card-front.png"), loadImage("assets/card-back.png"), ready])
      .then(function (res) {
        const canvas = document.createElement("canvas");
        canvas.width = w;
        canvas.height = h * 2 + gap;
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(res[0], 0, 0, w, h);
        ctx.save();
        ctx.translate(0, h + gap);
        drawCardBack(ctx, res[1], s, scale);
        ctx.restore();

        const link = document.createElement("a");
        const safeName = (s.name || "donor").replace(/[^A-Za-z0-9]+/g, "_").replace(/^_+|_+$/g, "") || "donor";
        link.download = "SHARE_Donor_Card_" + safeName + ".png";
        link.href = canvas.toDataURL("image/png");
        document.body.appendChild(link);
        link.click();
        link.remove();
        return canvas;
      });
  }

  if (btnDownloadCard) btnDownloadCard.addEventListener("click", downloadCardPNG);
  if (btnSaveCardThankyou) btnSaveCardThankyou.addEventListener("click", downloadCardPNG);

  // ------------------------------------------------------------------------
  // 4. Parallax: pointer drives --mx / --my, scroll drives --p per scene
  // ------------------------------------------------------------------------
  const scenes = Array.prototype.slice.call(document.querySelectorAll("[data-scene]"));
  const dots = Array.prototype.slice.call(document.querySelectorAll(".scene-dots a"));
  const hero = document.getElementById("hero");
  const visibleScenes = new Set();

  let targetX = 0, targetY = 0, mouseX = 0, mouseY = 0;
  let scrollDirty = true;

  function onScroll() {
    scrollDirty = true;
    if (nav) nav.classList.toggle("scrolled", window.scrollY > 40);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
  onScroll();

  if ("IntersectionObserver" in window) {
    const sceneObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) visibleScenes.add(entry.target);
        else visibleScenes.delete(entry.target);
        scrollDirty = true;
      });
    }, { rootMargin: "20% 0px 20% 0px" });
    scenes.forEach(function (s) { sceneObserver.observe(s); });

    // Copy reveal and active dot follow the scene nearest the middle of the screen.
    const activeObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in-view");
        const i = scenes.indexOf(entry.target);
        dots.forEach(function (d, j) { d.classList.toggle("active", i === j); });
      });
    }, { rootMargin: "-45% 0px -45% 0px" });
    scenes.forEach(function (s) { activeObserver.observe(s); });

    const dotsNav = document.querySelector(".scene-dots");
    const scenesWrap = document.getElementById("organs");
    if (dotsNav && scenesWrap) {
      new IntersectionObserver(function (entries) {
        dotsNav.classList.toggle("visible", entries[0].isIntersecting);
      }, { rootMargin: "-45% 0px -45% 0px" }).observe(scenesWrap);
    }
  } else {
    scenes.forEach(function (s) { s.classList.add("in-view"); });
  }

  if (!reduceMotion) {
    window.addEventListener("pointermove", function (e) {
      if (e.pointerType === "touch") return;
      targetX = (e.clientX / window.innerWidth) * 2 - 1;
      targetY = (e.clientY / window.innerHeight) * 2 - 1;

      if (donorCard) {
        const r = donorCard.getBoundingClientRect();
        const inside = e.clientX > r.left - 80 && e.clientX < r.right + 80 && e.clientY > r.top - 80 && e.clientY < r.bottom + 80;
        const nx = inside ? ((e.clientX - r.left) / r.width) * 2 - 1 : 0;
        const ny = inside ? ((e.clientY - r.top) / r.height) * 2 - 1 : 0;
        donorCard.style.setProperty("--tilt-y", (nx * 9).toFixed(2) + "deg");
        donorCard.style.setProperty("--tilt-x", (ny * -7).toFixed(2) + "deg");
      }
    }, { passive: true });

    // Phones: tilt the layers with the device when the browser allows it without a prompt.
    if (window.DeviceOrientationEvent && typeof DeviceOrientationEvent.requestPermission !== "function") {
      window.addEventListener("deviceorientation", function (e) {
        if (e.gamma == null || e.beta == null) return;
        targetX = Math.max(-1, Math.min(1, e.gamma / 30));
        targetY = Math.max(-1, Math.min(1, (e.beta - 45) / 30));
      }, { passive: true });
    }

    (function frame() {
      const dx = targetX - mouseX;
      const dy = targetY - mouseY;
      if (Math.abs(dx) > 0.0005 || Math.abs(dy) > 0.0005) {
        mouseX += dx * 0.08;
        mouseY += dy * 0.08;
        root.style.setProperty("--mx", mouseX.toFixed(4));
        root.style.setProperty("--my", mouseY.toFixed(4));
      }
      if (scrollDirty) {
        scrollDirty = false;
        const vh = window.innerHeight;
        if (hero && window.scrollY < vh * 1.2) hero.style.setProperty("--sy", window.scrollY.toFixed(0));
        visibleScenes.forEach(function (scene) {
          const r = scene.getBoundingClientRect();
          const p = ((vh / 2) - (r.top + r.height / 2)) / vh;
          scene.style.setProperty("--p", Math.max(-1.2, Math.min(1.2, p)).toFixed(4));
        });
      }
      requestAnimationFrame(frame);
    })();
  }

  // ------------------------------------------------------------------------
  // 5. Thank-you burst, in the card colors
  // ------------------------------------------------------------------------
  function launchConfetti() {
    if (reduceMotion) return;
    const colors = ["#008037", "#cdd8be", "#658058", "#00612a", "#e6ecdd"];
    for (let i = 0; i < 48; i++) {
      const el = document.createElement("div");
      const size = Math.random() * 9 + 6;
      el.style.cssText = "position:fixed;z-index:9999;pointer-events:none;left:50vw;top:60vh;border-radius:60% 0 60% 0;" +
        "width:" + size + "px;height:" + size + "px;background:" + colors[i % colors.length];
      document.body.appendChild(el);

      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 520 + 180;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity - 280;
      const spin = (Math.random() - 0.5) * 720;
      const start = performance.now();

      (function animate(now) {
        const t = (now - start) / 1000;
        if (t > 2.2) { el.remove(); return; }
        el.style.transform = "translate3d(" + vx * t + "px," + (vy * t + 420 * t * t) + "px,0) rotate(" + spin * t + "deg)";
        el.style.opacity = 1 - t / 2.2;
        requestAnimationFrame(animate);
      })(start);
    }
  }

  // ------------------------------------------------------------------------
  // 6. Form submission
  // ------------------------------------------------------------------------
  if (form) {
    form.action = SUBMIT_ENDPOINT;

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      if (!form.checkValidity() || !validateOrgans()) {
        form.reportValidity();
        if (!validateOrgans() && organsGroup) {
          organsGroup.scrollIntoView({ behavior: "smooth", block: "center" });
        }
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Sending your sign-up...";

      // Build simple url-encoded post body
      const data = new URLSearchParams(new FormData(form));

      fetch(SUBMIT_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        body: data
      })
      .then(showThankYouState)
      .catch(showThankYouState);
    });
  }

  function showThankYouState() {
    if (!thankYou) return;
    form.hidden = true;
    thankYou.hidden = false;
    thankYou.scrollIntoView({ behavior: "smooth", block: "center" });
    launchConfetti();
  }

  // ------------------------------------------------------------------------
  // 7. Scroll reveal
  // ------------------------------------------------------------------------
  const revealElements = document.querySelectorAll("[data-reveal]");
  if (revealElements.length > 0 && "IntersectionObserver" in window) {
    root.classList.add("reveals-ready");
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05, rootMargin: "0px 0px 50px 0px" });
    revealElements.forEach(function (el) { observer.observe(el); });
  }

  // ------------------------------------------------------------------------
  // 8. Falling leaves: they fall down the whole page and land on the leaf hill
  // ------------------------------------------------------------------------
  const leafCanvas = document.getElementById("leaf-fall");
  const leafHill = document.getElementById("leaf-hill");
  const hillVideo = leafHill ? leafHill.querySelector("video") : null;

  if (hillVideo && "IntersectionObserver" in window) {
    // The loop plays only while the hill is on screen.
    new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting && !reduceMotion) hillVideo.play().catch(function () {});
      else hillVideo.pause();
    }, { rootMargin: "200px 0px" }).observe(leafHill);
  }

  if (leafCanvas && !reduceMotion) {
    const ctx = leafCanvas.getContext("2d");
    const LEAF_COLORS = ["#cdd8be", "#b9c9a6", "#8fa77f", "#658058", "#d9d98f", "#008037"];
    let cw = 0, ch = 0, dpr = 1, leavesFalling = [];

    function resizeLeaves() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cw = window.innerWidth;
      ch = window.innerHeight;
      leafCanvas.width = cw * dpr;
      leafCanvas.height = ch * dpr;
      const count = cw < 700 ? 9 : 20;
      leavesFalling = [];
      for (let i = 0; i < count; i++) leavesFalling.push(newLeaf(true));
    }

    function newLeaf(anywhere) {
      const depth = Math.random();                // 0 far, 1 near
      return {
        x: Math.random() * cw,
        y: anywhere ? Math.random() * ch : -30,
        size: 7 + depth * 11,
        speed: 28 + depth * 46,                   // px per second
        sway: 14 + Math.random() * 34,
        swayRate: 0.5 + Math.random() * 0.9,
        spin: (Math.random() - 0.5) * 2.4,
        phase: Math.random() * 6.28,
        alpha: 0.3 + depth * 0.4,
        color: LEAF_COLORS[Math.floor(Math.random() * LEAF_COLORS.length)]
      };
    }

    let lastTime = performance.now();
    let lastScroll = window.scrollY;
    function drawLeaves(now) {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      // Scroll moves the page under the leaves, so the leaves shift a little with it.
      const scrollDelta = window.scrollY - lastScroll;
      lastScroll = window.scrollY;

      // The leaves stop at the ground line of the hill when the hill is on screen.
      let ground = ch + 40;
      if (leafHill) {
        const r = leafHill.getBoundingClientRect();
        if (r.top < ch) ground = Math.min(ground, r.bottom - r.height * 0.08);
      }

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cw, ch);
      const time = now / 1000;
      for (let i = 0; i < leavesFalling.length; i++) {
        const l = leavesFalling[i];
        l.y += l.speed * dt - scrollDelta * 0.35;
        if (l.y > ground || l.y < -60) { leavesFalling[i] = newLeaf(false); if (l.y < -60) leavesFalling[i].y = ch * Math.random(); continue; }
        const x = l.x + Math.sin(time * l.swayRate + l.phase) * l.sway;
        const fade = Math.min(1, (ground - l.y) / 40);
        ctx.save();
        ctx.translate(x, l.y);
        ctx.rotate(time * l.spin + l.phase);
        ctx.scale(1, 0.55 + 0.45 * Math.cos(time * l.swayRate * 2 + l.phase));
        ctx.globalAlpha = l.alpha * fade;
        ctx.fillStyle = l.color;
        ctx.beginPath();
        ctx.moveTo(0, -l.size);
        ctx.quadraticCurveTo(l.size * 0.7, -l.size * 0.2, 0, l.size);
        ctx.quadraticCurveTo(-l.size * 0.7, -l.size * 0.2, 0, -l.size);
        ctx.fill();
        ctx.restore();
      }
      if (!document.hidden) requestAnimationFrame(drawLeaves);
    }

    window.addEventListener("resize", resizeLeaves, { passive: true });
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) { lastTime = performance.now(); requestAnimationFrame(drawLeaves); }
    });
    resizeLeaves();
    requestAnimationFrame(drawLeaves);
  }

  updateLiveCard();
  updatePledgeImpactMeter();

  // Test hook: lets a check script render the card PNG without a click.
  window.__donorCard = { download: downloadCardPNG, state: cardState };
})();
