// ==========================================================================
//  SHARE OTSU — ORGAN DONOR REGISTRY PLATFORM ENGINE (v4)
//  3D Parallax, Real-Time Holographic Card Synthesis, Endpoint Integration
// ==========================================================================

(function () {
  "use strict";

  // Deployed Google Apps Script Web App Endpoint
  const SUBMIT_ENDPOINT = "https://script.google.com/macros/s/AKfycbzIsJuw0cfL6SHlAbvJnpxsYLPjU0IKg2aWoGpd3SIKX2Te20bvGw3cXKQwLkJ_7Fmp/exec";

  // DOM Elements
  const nav = document.getElementById("site-nav");
  const form = document.getElementById("donor-form");
  const thankYou = document.getElementById("thank-you");
  const submitBtn = document.getElementById("submit-btn");
  const organsGroup = document.getElementById("organs-group");
  const organsError = document.getElementById("organs-error");
  const allOrgans = document.getElementById("all-organs");

  // Live Card Display Elements
  const cardNameDisplay = document.getElementById("card-name-display");
  const cardBloodDisplay = document.getElementById("card-blood-display");
  const cardOrgansDisplay = document.getElementById("card-organs-display");
  const cardIdDisplay = document.getElementById("card-id-display");
  const digitalDonorCard = document.getElementById("digital-donor-card");
  const btnDownloadCard = document.getElementById("btn-download-card");
  const btnSaveCardThankyou = document.getElementById("btn-save-card-thankyou");

  // Light / Dark Theme and Impact Meter Elements
  const themeToggleBtn = document.getElementById("theme-toggle-btn");
  const meterCounterDisplay = document.getElementById("meter-counter-display");
  const meterFillBar = document.getElementById("meter-fill-bar");

  // Inputs & Stages
  const fullNameInput = document.getElementById("fullName");
  const bloodTypeSelect = document.getElementById("bloodType");
  const heroOrganStage = document.getElementById("hero-organ-stage");
  const organStagePortal = document.querySelector(".organ-stage-portal");
  const stageLayers = document.querySelectorAll(".stage-layer");

  // 1. Generate Unique Registry ID
  const randomRegId = "PH-SPMC-2026-" + Math.floor(1000 + Math.random() * 9000);
  if (cardIdDisplay) cardIdDisplay.textContent = randomRegId;

  // 1b. Light / Dark Theme Controller (Default: Light Theme)
  function initTheme() {
    const savedTheme = localStorage.getItem("spmc_donor_theme");
    const currentTheme = savedTheme || "light";
    document.documentElement.setAttribute("data-theme", currentTheme);
    if (themeToggleBtn) {
      themeToggleBtn.setAttribute("aria-pressed", currentTheme === "dark" ? "true" : "false");
      themeToggleBtn.setAttribute("title", currentTheme === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme");
    }
  }

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", function () {
      const current = document.documentElement.getAttribute("data-theme") || "light";
      const next = current === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("spmc_donor_theme", next);
      themeToggleBtn.setAttribute("aria-pressed", next === "dark" ? "true" : "false");
      themeToggleBtn.setAttribute("title", next === "dark" ? "Switch to Light Theme" : "Switch to Dark Theme");
    });
  }
  initTheme();

  // 2. Sticky Nav Scroll Observer
  window.addEventListener("scroll", function () {
    if (window.scrollY > 40) {
      nav.classList.add("scrolled");
    } else {
      nav.classList.remove("scrolled");
    }
  }, { passive: true });

  // 3. 3D Mouse Parallax & Gyroscope Engine
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  window.addEventListener("mousemove", function (e) {
    const halfW = window.innerWidth / 2;
    const halfH = window.innerHeight / 2;
    targetX = (e.clientX - halfW) / halfW;
    targetY = (e.clientY - halfH) / halfH;

    // Specular highlight coordinate variables on hero 3D organ centerpiece
    if (heroOrganStage) {
      const rect = heroOrganStage.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      heroOrganStage.style.setProperty("--mouse-x", `${x}%`);
      heroOrganStage.style.setProperty("--mouse-y", `${y}%`);
    }

    if (digitalDonorCard) {
      const rect = digitalDonorCard.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      digitalDonorCard.style.setProperty("--card-tilt-x", `${x}%`);
      digitalDonorCard.style.setProperty("--card-tilt-y", `${y}%`);
    }
  }, { passive: true });

  // Smooth Render Loop for 3D Stage
  function updateParallax() {
    mouseX += (targetX - mouseX) * 0.08;
    mouseY += (targetY - mouseY) * 0.08;

    // Translate Stage Background Layers by Depth
    stageLayers.forEach(function (layer) {
      const depth = parseFloat(layer.getAttribute("data-depth") || 0.1);
      const moveX = mouseX * depth * 80;
      const moveY = mouseY * depth * 80;
      layer.style.transform = `translate3d(${moveX}px, ${moveY}px, 0)`;
    });

    // 3D Tilt on Hero 3D Organ Centerpiece Stage
    if (organStagePortal) {
      const rotY = mouseX * 14;
      const rotX = -mouseY * 14;
      organStagePortal.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.02)`;
    }

    // 3D Tilt on Live Digital Donor Card
    if (digitalDonorCard) {
      const rotY = mouseX * 14;
      const rotX = -mouseY * 14;
      digitalDonorCard.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(15px)`;
    }

    requestAnimationFrame(updateParallax);
  }
  requestAnimationFrame(updateParallax);

  // 4. Live Holographic Donor Card Dynamic Synchronization
  function updateLiveCard() {
    // Name
    const nameVal = fullNameInput && fullNameInput.value.trim();
    if (cardNameDisplay) {
      cardNameDisplay.textContent = nameVal ? nameVal.toUpperCase() : "JUAN DELA CRUZ";
    }

    // Blood Type
    if (cardBloodDisplay && bloodTypeSelect) {
      cardBloodDisplay.textContent = bloodTypeSelect.value;
    }

    // Selected Organs
    if (cardOrgansDisplay && organsGroup) {
      const allSelected = allOrgans && allOrgans.checked;
      if (allSelected) {
        cardOrgansDisplay.textContent = "ALL ORGANS & TISSUES (TRANSPLANT & RESEARCH)";
      } else {
        const checkedBoxes = Array.from(organsGroup.querySelectorAll('input[type="checkbox"]:checked'))
          .filter(cb => cb !== allOrgans)
          .map(cb => cb.value);

        if (checkedBoxes.length > 0) {
          cardOrgansDisplay.textContent = checkedBoxes.join(", ");
        } else {
          cardOrgansDisplay.textContent = "Heart, Kidneys, Liver, Lungs, Corneas";
        }
      }
    }
  }

  if (fullNameInput) fullNameInput.addEventListener("input", updateLiveCard);
  if (bloodTypeSelect) bloodTypeSelect.addEventListener("change", updateLiveCard);

  // Organ Checklist Logic & Live Pledge Impact Meter
  function updatePledgeImpactMeter() {
    if (!organsGroup || !meterCounterDisplay || !meterFillBar) return;

    if (allOrgans && allOrgans.checked) {
      meterCounterDisplay.textContent = "8 Lives Saved · 50+ Healed (Max Potential)";
      meterFillBar.style.width = "100%";
      return;
    }

    let totalLives = 0;
    let totalHealed = 0;

    const checkedBoxes = Array.from(organsGroup.querySelectorAll('input[type="checkbox"]:checked'))
      .filter(cb => cb !== allOrgans);

    checkedBoxes.forEach(function (cb) {
      const parentLabel = cb.closest(".organ-check-item");
      if (parentLabel) {
        const lives = parseInt(parentLabel.getAttribute("data-lives") || "0", 10);
        const healed = parseInt(parentLabel.getAttribute("data-healed") || "0", 10);
        totalLives += lives;
        totalHealed += healed;
      }
    });

    if (totalLives === 0 && totalHealed === 0) {
      meterCounterDisplay.textContent = "0 Lives Saved · Please select organs";
      meterFillBar.style.width = "0%";
    } else {
      let text = "";
      if (totalLives > 0 && totalHealed > 0) {
        text = `${totalLives} ${totalLives === 1 ? "Life" : "Lives"} Saved · ${totalHealed}+ Healed`;
      } else if (totalLives > 0) {
        text = `${totalLives} ${totalLives === 1 ? "Life" : "Lives"} Saved`;
      } else {
        text = `${totalHealed}+ Individuals Healed`;
      }
      meterCounterDisplay.textContent = text;

      const livesFactor = Math.min(totalLives / 8, 1);
      const healedFactor = Math.min(totalHealed / 50, 1);
      const percent = Math.min(100, Math.max(12, Math.round((livesFactor * 0.7 + healedFactor * 0.3) * 100)));
      meterFillBar.style.width = `${percent}%`;
    }
  }

  if (allOrgans && organsGroup) {
    allOrgans.addEventListener("change", function () {
      if (allOrgans.checked) {
        organsGroup.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
          if (cb !== allOrgans) cb.checked = false;
        });
      }
      validateOrgans();
      updateLiveCard();
      updatePledgeImpactMeter();
    });

    organsGroup.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
      if (cb === allOrgans) return;
      cb.addEventListener("change", function () {
        if (cb.checked) allOrgans.checked = false;
        validateOrgans();
        updateLiveCard();
        updatePledgeImpactMeter();
      });
    });
  }

  function validateOrgans() {
    if (!organsGroup) return true;
    const checked = organsGroup.querySelectorAll('input[type="checkbox"]:checked').length;
    const ok = checked > 0;
    if (organsError) organsError.hidden = ok;
    return ok;
  }

  // 5. High-Resolution Digital Donor Card PNG Canvas Generator
  function generateAndDownloadCardPNG() {
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 756;
    const ctx = canvas.getContext("2d");

    // Background Gradient (Obsidian Titanium)
    const bgGrad = ctx.createRadialGradient(600, 300, 50, 600, 378, 800);
    bgGrad.addColorStop(0, "#0c1d3c");
    bgGrad.addColorStop(0.55, "#061124");
    bgGrad.addColorStop(1, "#020712");
    ctx.fillStyle = bgGrad;
    ctx.beginPath();
    ctx.roundRect(0, 0, 1200, 756, 44);
    ctx.fill();

    // Subtle Guilloche Curved Security Waves
    ctx.save();
    ctx.strokeStyle = "rgba(201, 162, 59, 0.08)";
    ctx.lineWidth = 1.2;
    for (let r = 80; r < 900; r += 32) {
      ctx.beginPath();
      ctx.arc(1050, 100, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    for (let r = 100; r < 800; r += 36) {
      ctx.beginPath();
      ctx.arc(150, 650, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();

    // Security Watermark
    ctx.save();
    ctx.translate(720, 420);
    ctx.rotate(-0.35);
    ctx.font = "bold 90px 'Space Mono', monospace";
    ctx.fillStyle = "rgba(201, 162, 59, 0.04)";
    ctx.textAlign = "center";
    ctx.fillText("SHARE OTSU", 0, 0);
    ctx.restore();

    // Metallic Gold Multi-Stop Beveled Outer Border
    ctx.lineWidth = 10;
    const borderGrad = ctx.createLinearGradient(0, 0, 1200, 756);
    borderGrad.addColorStop(0, "#8c6a1d");
    borderGrad.addColorStop(0.25, "#d4af37");
    borderGrad.addColorStop(0.5, "#fff1c2");
    borderGrad.addColorStop(0.75, "#c9a23b");
    borderGrad.addColorStop(1, "#664d14");
    ctx.strokeStyle = borderGrad;
    ctx.beginPath();
    ctx.roundRect(5, 5, 1190, 746, 40);
    ctx.stroke();

    // Inner Gold Inlay Hairline
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = "rgba(201, 162, 59, 0.38)";
    ctx.beginPath();
    ctx.roundRect(24, 24, 1152, 708, 28);
    ctx.stroke();

    // Top Ribbon Telemetry
    ctx.fillStyle = "#f4d381";
    ctx.font = "bold 20px 'Space Mono', monospace";
    ctx.fillText("REPUBLIC OF THE PHILIPPINES", 60, 75);

    ctx.fillStyle = "rgba(226, 232, 240, 0.9)";
    ctx.font = "bold 22px 'Space Mono', monospace";
    ctx.fillText("SOUTHERN PHILIPPINES MEDICAL CENTER · SHARE OTSU", 60, 108);

    ctx.fillStyle = "#f4d381";
    ctx.font = "bold 22px 'Space Mono', monospace";
    ctx.textAlign = "right";
    ctx.fillText(cardIdDisplay ? cardIdDisplay.textContent : randomRegId, 1140, 108);
    ctx.textAlign = "left";

    // Header Divider
    ctx.strokeStyle = "rgba(201, 162, 59, 0.3)";
    ctx.beginPath();
    ctx.moveTo(60, 130);
    ctx.lineTo(1140, 130);
    ctx.stroke();

    // 3D Metallic EMV Security Chip (88px x 64px)
    const chipX = 60;
    const chipY = 165;
    const chipW = 88;
    const chipH = 64;

    const chipGrad = ctx.createLinearGradient(chipX, chipY, chipX + chipW, chipY + chipH);
    chipGrad.addColorStop(0, "#fae29c");
    chipGrad.addColorStop(0.45, "#c9a23b");
    chipGrad.addColorStop(0.7, "#ffea9f");
    chipGrad.addColorStop(1, "#8c6a1d");
    ctx.fillStyle = chipGrad;
    ctx.beginPath();
    ctx.roundRect(chipX, chipY, chipW, chipH, 10);
    ctx.fill();
    ctx.strokeStyle = "rgba(80, 50, 10, 0.75)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // EMV Chip Grooves
    ctx.strokeStyle = "rgba(60, 38, 8, 0.75)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(chipX, chipY + chipH / 2);
    ctx.lineTo(chipX + chipW, chipY + chipH / 2);
    ctx.moveTo(chipX + chipW * 0.35, chipY);
    ctx.lineTo(chipX + chipW * 0.35, chipY + chipH);
    ctx.moveTo(chipX + chipW * 0.65, chipY);
    ctx.lineTo(chipX + chipW * 0.65, chipY + chipH);
    ctx.stroke();

    // Contactless Smart Waves
    ctx.save();
    ctx.strokeStyle = "#c9a23b";
    ctx.lineWidth = 3.5;
    ctx.lineCap = "round";
    const waveX = 180;
    const waveY = 197;
    for (let i = 1; i <= 3; i++) {
      ctx.beginPath();
      ctx.arc(waveX, waveY, i * 14, -Math.PI / 3, Math.PI / 3);
      ctx.stroke();
    }
    ctx.restore();

    // Donor Field Label
    ctx.fillStyle = "rgba(203, 213, 225, 0.65)";
    ctx.font = "bold 18px 'Space Mono', monospace";
    ctx.fillText("CERTIFIED ORGAN DONOR", 60, 275);

    // Embossed Gold Donor Name
    const nameText = cardNameDisplay ? cardNameDisplay.textContent : "JUAN DELA CRUZ";
    const nameGrad = ctx.createLinearGradient(60, 290, 60, 350);
    nameGrad.addColorStop(0, "#ffffff");
    nameGrad.addColorStop(0.35, "#ffea9f");
    nameGrad.addColorStop(0.7, "#d4af37");
    nameGrad.addColorStop(1, "#997424");

    ctx.fillStyle = "rgba(0, 0, 0, 0.85)";
    ctx.font = "bold 54px 'Fraunces', Georgia, serif";
    ctx.fillText(nameText, 62, 332); // drop shadow

    ctx.fillStyle = nameGrad;
    ctx.fillText(nameText, 60, 330);

    // Active Pledge Badge
    ctx.fillStyle = "#10b981";
    ctx.beginPath();
    ctx.arc(70, 375, 7, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#10b981";
    ctx.font = "bold 20px 'Space Mono', monospace";
    ctx.fillText("ACTIVE PLEDGE · REPUBLIC ACT NO. 7170", 90, 382);

    // Blood Type Pill Badge
    const bloodVal = cardBloodDisplay ? cardBloodDisplay.textContent : "O+";
    const pillX = 60;
    const pillY = 415;
    ctx.fillStyle = "rgba(201, 162, 59, 0.14)";
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, 250, 52, 26);
    ctx.fill();
    ctx.strokeStyle = "#c9a23b";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.fillStyle = "rgba(226, 232, 240, 0.85)";
    ctx.font = "bold 19px 'Space Mono', monospace";
    ctx.fillText("BLOOD TYPE:", pillX + 22, pillY + 34);

    ctx.fillStyle = "#e63946";
    ctx.font = "bold 24px 'Space Mono', monospace";
    ctx.fillText(bloodVal, pillX + 170, pillY + 35);

    // Pledged Organs Section
    ctx.fillStyle = "rgba(203, 213, 225, 0.7)";
    ctx.font = "bold 18px 'Space Mono', monospace";
    ctx.fillText("PLEDGED GIFTS:", 60, 515);

    const organsText = cardOrgansDisplay ? cardOrgansDisplay.textContent : "Heart, Kidneys, Liver, Lungs, Corneas";
    ctx.fillStyle = "#f8fafc";
    ctx.font = "26px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText(organsText.substring(0, 64), 60, 555);
    if (organsText.length > 64) {
      ctx.fillText(organsText.substring(64, 130), 60, 590);
    }

    // Legal Authority Footnote
    ctx.fillStyle = "rgba(148, 163, 184, 0.7)";
    ctx.font = "16px 'Plus Jakarta Sans', sans-serif";
    ctx.fillText("Official Donor Registry Credential · Southern Philippines Medical Center (SPMC SHARE OTSU).", 60, 685);

    // Official QR Security Seal
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.roundRect(1020, 550, 120, 120, 16);
    ctx.fill();
    ctx.strokeStyle = "#c9a23b";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.fillStyle = "#040914";
    ctx.font = "bold 15px 'Space Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText("SPMC", 1080, 605);
    ctx.fillText("REGISTRY", 1080, 625);
    ctx.fillText("VALIDATED", 1080, 645);
    ctx.textAlign = "left";

    // Download trigger
    const link = document.createElement("a");
    link.download = `SHARE_OTSU_Luxury_Donor_Card_${nameText.replace(/\s+/g, "_")}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  if (btnDownloadCard) btnDownloadCard.addEventListener("click", generateAndDownloadCardPNG);
  if (btnSaveCardThankyou) btnSaveCardThankyou.addEventListener("click", generateAndDownloadCardPNG);

  // 6. Confetti Particle Explosion
  function launchConfetti() {
    const count = 75;
    const colors = ["#c9a23b", "#f4d381", "#e63946", "#38bdf8", "#10b981", "#ffffff"];

    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      el.style.position = "fixed";
      el.style.zIndex = "9999";
      el.style.width = Math.random() * 9 + 5 + "px";
      el.style.height = Math.random() * 9 + 5 + "px";
      el.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      el.style.left = "50vw";
      el.style.top = "60vh";
      el.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
      el.style.pointerEvents = "none";
      el.style.transform = `translate3d(0,0,0)`;
      document.body.appendChild(el);

      const angle = Math.random() * Math.PI * 2;
      const velocity = Math.random() * 600 + 200;
      const vx = Math.cos(angle) * velocity;
      const vy = Math.sin(angle) * velocity - 300;
      const spin = (Math.random() - 0.5) * 720;

      const start = performance.now();
      const duration = 2200;

      function animateParticle(now) {
        const elapsed = (now - start) / 1000;
        if (elapsed > duration / 1000) {
          el.remove();
          return;
        }

        const currX = vx * elapsed;
        const currY = vy * elapsed + 450 * elapsed * elapsed;
        const opacity = 1 - elapsed / (duration / 1000);

        el.style.transform = `translate3d(${currX}px, ${currY}px, 0) rotate(${spin * elapsed}deg)`;
        el.style.opacity = opacity;

        requestAnimationFrame(animateParticle);
      }
      requestAnimationFrame(animateParticle);
    }
  }

  // 7. Form Submission Handler
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
      submitBtn.innerHTML = `
        <span class="pulse-dot"></span>
        <span>Registering With SPMC...</span>
      `;

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

  // 8. Scroll Reveal Observer with instant viewport activation
  const revealElements = document.querySelectorAll("[data-reveal]");
  if (revealElements.length > 0) {
    document.documentElement.classList.add("reveals-ready");

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
          }
        });
      }, { threshold: 0.05, rootMargin: "0px 0px 50px 0px" });

      revealElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom > 0) {
          el.classList.add("revealed");
        }
        observer.observe(el);
      });
    } else {
      revealElements.forEach(el => el.classList.add("revealed"));
    }
  }

  // Initialize live card display and pledge impact meter
  updateLiveCard();
  updatePledgeImpactMeter();
})();
