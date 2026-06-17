/* Precision Ratchet — Nissan & Infiniti VQ Specialist — interactions */
(function () {
  "use strict";

  // Current year in footer
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Smooth in-page scrolling for every hash link (top nav, logo, CTA buttons).
  // Driven by requestAnimationFrame instead of native smooth scroll, because
  // browsers force-disable scrollTo({behavior:"smooth"}) / CSS smooth scroll
  // when the OS reports prefers-reduced-motion — which would make it snap.
  var headerEl = document.querySelector(".header");
  function animateScroll(toY, duration) {
    var startY = window.pageYOffset || document.documentElement.scrollTop;
    var dist = toY - startY;
    if (Math.abs(dist) < 2) return;
    var startTime = null;
    var dur = duration || 900; // ~0.9s glide
    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    function step(ts) {
      if (startTime === null) startTime = ts;
      var t = Math.min((ts - startTime) / dur, 1);
      window.scrollTo({ top: Math.round(startY + dist * easeInOutCubic(t)), behavior: "auto" });
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  document.addEventListener("click", function (e) {
    var link = e.target.closest('a[href^="#"]');
    if (!link) return;
    var href = link.getAttribute("href");
    if (href === "#") { e.preventDefault(); return; }          // placeholder links
    if (href === "#top") { e.preventDefault(); animateScroll(0); return; } // logo → top
    var target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    var offset = (headerEl ? headerEl.offsetHeight : 0) + 14;
    var y = target.getBoundingClientRect().top +
            (window.pageYOffset || document.documentElement.scrollTop) - offset;
    animateScroll(Math.max(0, y));
  });

  // Mobile nav toggle
  var navToggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      navToggle.classList.toggle("is-open", open);
      navToggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("is-open");
        navToggle.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Scroll reveal — clean fade/rise on the section blocks (no blur, no word split)
  var revealEls = document.querySelectorAll(
    ".pillar, .card, .welcome__copy, .welcome__stat, .gallery__item, .about__media, .about__copy, .quotes figure, .contact__info, .form, .section__head"
  );
  revealEls.forEach(function (el) { el.classList.add("reveal"); });

  // Staggered cascade for photo grids
  function stagger(selector, step, max) {
    document.querySelectorAll(selector).forEach(function (el, i) {
      el.style.transitionDelay = Math.min(i, max) * step + "s";
    });
  }
  stagger("#gallery .gallery__item", 0.07, 6);
  stagger(".cards .card", 0.1, 3);

  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            el.classList.add("is-visible");
            // Clear the stagger delay once revealed so hover effects stay snappy
            window.setTimeout(function () { el.style.transitionDelay = ""; }, 800);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.1 }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // Lightbox for builds gallery
  var gallery = document.getElementById("gallery");
  var lightbox = document.getElementById("lightbox");
  var lightboxImg = document.getElementById("lightboxImg");
  var lightboxClose = document.getElementById("lightboxClose");

  function openLightbox(src, alt) {
    if (!lightbox || !lightboxImg) return;
    lightboxImg.src = src;
    lightboxImg.alt = alt || "";
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }
  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    lightboxImg.src = "";
    document.body.style.overflow = "";
  }

  if (gallery && lightbox) {
    gallery.addEventListener("click", function (e) {
      var img = e.target.closest(".gallery__item img");
      if (img) openLightbox(img.currentSrc || img.src, img.alt);
    });
    lightboxClose.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") closeLightbox();
    });
  }

  // Populate the vehicle Year dropdown (newest first, back to 1990)
  var yearSelect = document.getElementById("vehicleYear");
  if (yearSelect) {
    var topYear = new Date().getFullYear() + 1; // include the upcoming model year
    for (var yy = topYear; yy >= 1990; yy--) {
      var opt = document.createElement("option");
      opt.textContent = String(yy);
      yearSelect.appendChild(opt);
    }
  }

  // Booking form (demo — no backend)
  var form = document.getElementById("bookingForm");
  var note = document.getElementById("formNote");
  if (form && note) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var data = new FormData(form);
      var name = (data.get("name") || "").toString().trim();
      var phone = (data.get("phone") || "").toString().trim();

      if (!name || !phone) {
        note.textContent = "Please add your name and phone so we can reach you.";
        note.className = "form__note is-err";
        return;
      }
      note.textContent =
        "Thanks, " + name + "! To lock in your appointment fastest, call us at (602) 774-6227 — we'll confirm your time over the phone.";
      note.className = "form__note is-ok";
      form.reset();
    });
  }
})();
