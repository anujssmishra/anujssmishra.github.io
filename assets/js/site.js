/* Anuj S.S. Mishra: site behaviour
   - light/dark theme toggle (remembers the choice in this browser)
   - mobile menu, header rule on scroll, current-section highlighting
   - "Copy citation" / "Copy email" buttons
   - the research chain in the hero, built from every publication entry that has a data-chain attribute */

(function () {
  "use strict";

  var root = document.documentElement;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var live = document.getElementById("live");

  function announce(text) {
    if (!live) return;
    live.textContent = "";
    window.setTimeout(function () { live.textContent = text; }, 50);
  }

  /* ---------- Theme ---------- */

  var themeBtn = document.querySelector(".theme-btn");
  var darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
  var PAPER = { light: "#f1f4f2", dark: "#0e1513" };

  function currentTheme() {
    return root.dataset.theme || (darkQuery.matches ? "dark" : "light");
  }

  function syncThemeUi() {
    var theme = currentTheme();
    if (themeBtn) {
      themeBtn.setAttribute("aria-label", theme === "dark" ? "Switch to light theme" : "Switch to dark theme");
    }
    if (root.dataset.theme) {
      document.querySelectorAll('meta[name="theme-color"]').forEach(function (m) {
        m.setAttribute("content", PAPER[theme]);
      });
    }
  }

  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = currentTheme() === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch (e) { /* storage unavailable: theme lasts for this visit */ }
      syncThemeUi();
    });
  }
  if (darkQuery.addEventListener) darkQuery.addEventListener("change", syncThemeUi);
  syncThemeUi();

  /* ---------- Mobile menu ---------- */

  var menuBtn = document.querySelector(".menu-btn");
  var navList = document.getElementById("nav-list");

  function setMenu(open) {
    if (!menuBtn || !navList) return;
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.textContent = open ? "Close" : "Menu";
    navList.classList.toggle("is-open", open);
  }

  if (menuBtn && navList) {
    menuBtn.addEventListener("click", function () {
      setMenu(menuBtn.getAttribute("aria-expanded") !== "true");
    });
    navList.addEventListener("click", function (e) {
      if (e.target.closest("a")) setMenu(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && navList.classList.contains("is-open")) {
        setMenu(false);
        menuBtn.focus();
      }
    });
  }

  /* ---------- Header rule and current section ---------- */

  var head = document.querySelector(".site-head");
  function onScroll() {
    if (head) head.classList.toggle("is-scrolled", window.scrollY > 8);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if ("IntersectionObserver" in window) {
    var links = {};
    document.querySelectorAll('.nav-list a[href^="#"]').forEach(function (a) {
      links[a.getAttribute("href").slice(1)] = a;
    });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = links[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          Object.keys(links).forEach(function (k) { links[k].removeAttribute("aria-current"); });
          link.setAttribute("aria-current", "true");
        } else if (link.getAttribute("aria-current") === "true" && entry.boundingClientRect.top > 0) {
          link.removeAttribute("aria-current");
        }
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(links).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) spy.observe(section);
    });
  }

  /* ---------- Copy buttons ---------- */

  function copyText(text) {
    if (navigator.clipboard && window.isSecureContext) {
      return navigator.clipboard.writeText(text).then(function () { return true; }, function () { return legacyCopy(text); });
    }
    return Promise.resolve(legacyCopy(text));
  }

  function legacyCopy(text) {
    var ta = document.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.position = "fixed";
    ta.style.top = "-1000px";
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    ta.remove();
    return ok;
  }

  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-copy]");
    if (!btn) return;
    var text = btn.getAttribute("data-copy");
    var label = btn.getAttribute("data-label") || btn.textContent;
    btn.setAttribute("data-label", label);
    copyText(text).then(function (ok) {
      if (ok) {
        var done = btn.getAttribute("data-done") || "Copied";
        btn.textContent = done;
        announce(done);
        window.setTimeout(function () { btn.textContent = label; }, 2000);
      } else {
        // Clipboard blocked: show the text so it can be selected by hand.
        var holder = btn.closest(".entry-body, .email-line");
        if (holder && !holder.querySelector(".copy-fallback")) {
          var p = document.createElement("p");
          p.className = "copy-fallback entry-venue";
          p.textContent = text;
          holder.appendChild(p);
        }
        announce("Copying is blocked in this browser. The text is now shown so you can select it.");
      }
    });
  });

  /* ---------- Research chain ---------- */

  var chain = document.getElementById("chain");
  var scroller = document.querySelector(".chain-scroll");
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var GENESIS = new Array(65).join("0");

  function toHex(buffer) {
    return Array.prototype.map.call(new Uint8Array(buffer), function (b) {
      return ("0" + b.toString(16)).slice(-2);
    }).join("");
  }

  function sha256(text) {
    return window.crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)).then(toHex);
  }

  function updateEdges() {
    if (!scroller) return;
    var max = scroller.scrollWidth - scroller.clientWidth;
    if (max <= 2) { scroller.removeAttribute("data-edge"); return; }
    var x = scroller.scrollLeft;
    scroller.setAttribute("data-edge", x <= 2 ? "start" : (x >= max - 2 ? "end" : "middle"));
  }

  function buildChain() {
    if (!chain) return;
    var records = Array.prototype.map.call(document.querySelectorAll("[data-chain]"), function (el) {
      var title = el.querySelector(".entry-title");
      var venue = el.querySelector(".entry-venue");
      return {
        id: el.id,
        date: el.getAttribute("data-date") || "",
        short: el.getAttribute("data-short") || "",
        place: el.getAttribute("data-place") || "",
        pending: el.getAttribute("data-state") === "pending",
        title: title ? title.textContent.trim() : "",
        venue: venue ? venue.textContent.trim() : ""
      };
    }).sort(function (a, b) { return a.date < b.date ? -1 : (a.date > b.date ? 1 : 0); });

    var blocks = records.map(function (r, i) {
      var parts = r.date.split("-");
      var when = MONTHS[parseInt(parts[1], 10) - 1] + " " + parts[0];
      var height = "#" + ("0" + (i + 1)).slice(-2);

      var li = document.createElement("li");
      li.className = "block" + (r.pending ? " block--pending" : "");
      var a = document.createElement("a");
      a.href = "#" + r.id;
      // The visible words stay first in the link's name; the paper title is added for screen readers.
      a.innerHTML =
        '<span class="block-height" aria-hidden="true"></span>' +
        '<span class="block-venue"></span>' +
        '<span class="block-place"></span>' +
        '<span class="block-date"></span>' +
        '<span class="sr-only block-sr"></span>' +
        '<span class="block-hash" aria-hidden="true">········</span>';
      a.querySelector(".block-height").textContent = height;
      a.querySelector(".block-venue").textContent = r.short;
      a.querySelector(".block-place").textContent = r.place;
      a.querySelector(".block-date").textContent = when;
      a.querySelector(".block-sr").textContent = (r.pending ? ", scheduled" : "") + ": " + r.title;
      li.appendChild(a);
      chain.appendChild(li);
      return li;
    });

    if (scroller) {
      scroller.scrollLeft = scroller.scrollWidth; // open on the newest blocks
      updateEdges();
      scroller.addEventListener("scroll", updateEdges, { passive: true });
      window.addEventListener("resize", updateEdges);
    }

    function reveal() {
      blocks.forEach(function (li, i) {
        if (reduceMotion) { li.classList.add("is-verified"); return; }
        window.setTimeout(function () { li.classList.add("is-verified"); }, 120 + i * 90);
      });
    }

    if (!(window.crypto && window.crypto.subtle && window.TextEncoder)) {
      // No Web Crypto here (an insecure context): keep the chain, drop the fingerprints.
      chain.querySelectorAll(".block-hash").forEach(function (h) { h.remove(); });
      var note = document.querySelector(".chain-note");
      if (note) note.textContent = "Dashed blocks are scheduled for Lisbon in December 2026.";
      reveal();
      return;
    }

    var prev = GENESIS;
    records.reduce(function (p, r, i) {
      return p.then(function () {
        return sha256([prev, r.date, r.short, r.venue, r.title].join("\n")).then(function (hex) {
          prev = hex;
          var h = blocks[i].querySelector(".block-hash");
          h.textContent = hex.slice(0, 4) + "…" + hex.slice(-4);
          h.title = "SHA-256 " + hex;
        });
      });
    }, Promise.resolve()).then(reveal, reveal);
  }

  buildChain();
})();
