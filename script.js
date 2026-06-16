/* Precision Ratchet — Nissan & Infiniti VQ Specialist — interactions */
(function () {
  "use strict";

  // Current year in footer
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

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

  // Scroll reveal
  // Wrap section/welcome titles word-by-word for a staggered text reveal
  var titles = document.querySelectorAll(".section__title, .welcome h2");
  titles.forEach(function (title) {
    var words = title.textContent.trim().split(/\s+/);
    title.textContent = "";
    words.forEach(function (word, i) {
      var span = document.createElement("span");
      span.className = "w";
      span.textContent = word;
      span.style.transitionDelay = i * 0.06 + "s";
      title.appendChild(span);
      if (i < words.length - 1) title.appendChild(document.createTextNode(" "));
    });
  });

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
        "Thanks, " + name + "! This is a demo form — call (602) 555-0142 to confirm your appointment.";
      note.className = "form__note is-ok";
      form.reset();
    });
  }
})();
