/* NEW GREEN — progressive enhancement only.
   Every feature on this site works with JavaScript disabled;
   this file only makes a few interactions smoother. */
(function () {
  "use strict";

  /* Product gallery: click a thumbnail to swap the main image. */
  var main = document.querySelector("[data-gallery-main]");
  if (main) {
    var thumbs = document.querySelectorAll("[data-gallery-thumb]");
    thumbs.forEach(function (btn) {
      btn.addEventListener("click", function (ev) {
        ev.preventDefault();
        var img = btn.querySelector("img");
        if (!img) return;
        main.src = img.currentSrc || img.src;
        if (img.alt) main.alt = img.alt;
        thumbs.forEach(function (b) { b.classList.remove("is-active"); });
        btn.classList.add("is-active");
      });
    });
  }

  /* Inquiry form: compose a mailto draft (no backend, nothing stored).
     The visible email address next to the form is the no-JS fallback. */
  var form = document.querySelector("[data-inquiry-form]");
  if (form) {
    form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      /* honeypot: bots that fill hidden fields get silently dropped */
      var hp = form.querySelector('[name="company_website"]');
      if (hp && hp.value) return;

      var get = function (name) {
        var el = form.querySelector('[name="' + name + '"]');
        return el ? el.value.trim() : "";
      };
      var to = form.getAttribute("data-email") || "";
      var product = get("product");
      var subject = "Inquiry" + (product ? ": " + product : "") + " — " + get("name");
      var body =
        "Name: " + get("name") + "\n" +
        "Company: " + get("company") + "\n" +
        "Email: " + get("email") + "\n" +
        (product ? "Product: " + product + "\n" : "") +
        "\n" + get("message") + "\n";
      window.location.href =
        "mailto:" + encodeURIComponent(to) +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(body);
    });
  }

  /* Close the mobile menu after choosing a link. */
  var navBox = document.getElementById("nav-open");
  if (navBox) {
    document.querySelectorAll(".nav a").forEach(function (a) {
      a.addEventListener("click", function () { navBox.checked = false; });
    });
  }

  /* Catalog page: highlight the current category in the sticky nav
     while scrolling (scrollspy). Pure enhancement — anchors work without it. */
  var catNav = document.querySelector("[data-cat-nav]");
  if (catNav && "IntersectionObserver" in window) {
    var box = catNav.querySelector(".cat-nav-in") || catNav;
    var links = {};
    box.querySelectorAll('a[href^="#"]').forEach(function (a) {
      links[a.getAttribute("href").slice(1)] = a;
    });
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var current = null;
    var setActive = function (id) {
      if (id === current || !links[id]) return;
      current = id;
      Object.keys(links).forEach(function (k) {
        links[k].classList.toggle("is-active", k === id);
      });
      var a = links[id];
      var rel = a.getBoundingClientRect().left - box.getBoundingClientRect().left + box.scrollLeft;
      box.scrollTo({
        left: rel - box.clientWidth / 2 + a.offsetWidth / 2,
        behavior: reduceMotion ? "auto" : "smooth"
      });
    };
    var tops = new Map();
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        tops.set(e.target.id, e.isIntersecting ? e.boundingClientRect.top : Infinity);
      });
      var best = null, bestTop = Infinity;
      tops.forEach(function (top, id) {
        if (top < bestTop) { bestTop = top; best = id; }
      });
      if (best) setActive(best);
    }, { rootMargin: "-125px 0px -55% 0px", threshold: 0 });
    document.querySelectorAll(".cat-sec[id]").forEach(function (s) { spy.observe(s); });
  }
})();
