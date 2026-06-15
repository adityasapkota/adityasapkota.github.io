/* Aditya Sapkota — portfolio interactions
   Vanilla JS, no dependencies. Loaded with `defer`. */
(function () {
  "use strict";

  var root = document.documentElement;

  /* ---------- Theme toggle ---------- */
  var toggle = document.querySelector(".theme-toggle");

  function applyTheme(theme, persist) {
    root.setAttribute("data-theme", theme);
    if (toggle) { toggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false"); }
    if (persist) { try { localStorage.setItem("theme", theme); } catch (e) {} }
  }

  // Reflect the theme the pre-paint script already set.
  applyTheme(root.getAttribute("data-theme") === "dark" ? "dark" : "light", false);

  if (toggle) {
    toggle.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next, true);
    });
  }

  // Follow the OS theme live, but only while the user hasn't chosen one.
  if (window.matchMedia) {
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    var onChange = function (e) {
      var stored;
      try { stored = localStorage.getItem("theme"); } catch (err) { stored = null; }
      if (!stored) { applyTheme(e.matches ? "dark" : "light", false); }
    };
    if (mq.addEventListener) { mq.addEventListener("change", onChange); }
    else if (mq.addListener) { mq.addListener(onChange); }
  }

  /* ---------- Reveal on scroll (staggered) ---------- */
  var reveals = Array.prototype.slice.call(document.querySelectorAll(".reveal"));

  // Stagger siblings within the same parent for a cascade effect.
  var counts = new Map();
  reveals.forEach(function (el) {
    var p = el.parentNode;
    var i = counts.get(p) || 0;
    el.style.setProperty("--d", Math.min(i, 6) * 70 + "ms");
    counts.set(p, i + 1);
  });

  if ("IntersectionObserver" in window) {
    var revealIO = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("in-view");
          obs.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    reveals.forEach(function (el) { revealIO.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("in-view"); });
  }

  /* ---------- Scrollspy nav ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll(".nav-link"));
  var linkById = {};
  var sections = [];

  navLinks.forEach(function (a) {
    var id = (a.getAttribute("href") || "").replace("#", "");
    var section = document.getElementById(id);
    if (section) { linkById[id] = a; sections.push(section); }
  });

  function setActive(id) {
    navLinks.forEach(function (a) {
      a.classList.remove("active");
      a.removeAttribute("aria-current");
    });
    var link = linkById[id];
    if (link) { link.classList.add("active"); link.setAttribute("aria-current", "true"); }
  }

  if ("IntersectionObserver" in window && sections.length) {
    var spyIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { setActive(entry.target.id); }
      });
    }, { rootMargin: "-45% 0px -50% 0px", threshold: 0 });
    sections.forEach(function (s) { spyIO.observe(s); });
  }
})();
