// ============================================================
//  Organ Donor Landing — submit + validation
//
//  Submissions POST to a Google Apps Script web app (no Google login
//  for donors). Set the deployed /exec URL in SUBMIT_ENDPOINT below.
//  The Apps Script appends each submission as a row in your Sheet.
//  See apps-script.gs + README.md for the script and deploy steps.
// ============================================================

// ---- Scroll reveal: each [data-reveal] section fades-up + staggers in ----
(function () {
  "use strict";
  var sections = document.querySelectorAll("[data-reveal]");
  if (!sections.length) return;
  // Mark JS active so the hiding CSS applies (no-JS visitors still see content).
  document.documentElement.classList.add("reveals-ready");

  if (!("IntersectionObserver" in window)) {
    sections.forEach(function (s) { s.classList.add("in-view"); });
    return;
  }
  // Toggle both ways: animate in on enter, reset on exit, so scrolling
  // back UP replays the appear animation each time a section re-enters.
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      e.target.classList.toggle("in-view", e.isIntersecting);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });
  sections.forEach(function (s) { io.observe(s); });
})();

(function () {
  "use strict";

  // ============================================================
  //  >>> PASTE YOUR DEPLOYED APPS SCRIPT WEB-APP URL HERE <<<
  //  (Apps Script > Deploy > New deployment > Web app,
  //   "Who has access: Anyone", then copy the URL ending in /exec)
  var SUBMIT_ENDPOINT = "https://script.google.com/macros/s/AKfycbzIsJuw0cfL6SHlAbvJnpxsYLPjU0IKg2aWoGpd3SIKX2Te20bvGw3cXKQwLkJ_7Fmp/exec";
  // ============================================================

  var form = document.getElementById("donor-form");
  if (!form) return;

  var iframe = document.getElementById("gform_target");
  var thankYou = document.getElementById("thank-you");
  var submitBtn = document.getElementById("submit-btn");
  var organsGroup = document.getElementById("organs-group");
  var organsError = document.getElementById("organs-error");
  var allOrgans = document.getElementById("all-organs");

  form.action = SUBMIT_ENDPOINT;
  var submitting = false;

  // "All organs" convenience: ticking it clears the individual organs.
  if (allOrgans) {
    allOrgans.addEventListener("change", function () {
      if (allOrgans.checked) {
        organsGroup.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
          if (cb !== allOrgans) cb.checked = false;
        });
      }
      validateOrgans();
    });
    organsGroup.querySelectorAll('input[type="checkbox"]').forEach(function (cb) {
      if (cb === allOrgans) return;
      cb.addEventListener("change", function () {
        if (cb.checked) allOrgans.checked = false;
        validateOrgans();
      });
    });
  }

  function validateOrgans() {
    var checked = organsGroup.querySelectorAll('input[type="checkbox"]:checked').length;
    var ok = checked > 0;
    organsError.hidden = ok;
    return ok;
  }

  function showThankYou() {
    if (thankYou.hidden === false) return;
    form.hidden = true;
    thankYou.hidden = false;
    thankYou.scrollIntoView({ behavior: "smooth", block: "center" });
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault(); // we submit via fetch (Apps Script blocks iframe framing)

    if (!form.checkValidity() || !validateOrgans()) {
      form.reportValidity();
      if (!validateOrgans()) organsGroup.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    if (SUBMIT_ENDPOINT.indexOf("PASTE_") === 0) {
      alert("Form endpoint not set yet. Paste your Apps Script /exec URL into SUBMIT_ENDPOINT in script.js.");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting…";

    // URL-encoded body keeps it a "simple" request (no CORS preflight); repeated
    // "organs" entries are preserved so the script gets all checked organs.
    var data = new URLSearchParams(new FormData(form));
    fetch(SUBMIT_ENDPOINT, { method: "POST", mode: "no-cors", body: data })
      .then(showThankYou)
      .catch(showThankYou); // no-cors response is opaque; the POST still lands
  });
})();
