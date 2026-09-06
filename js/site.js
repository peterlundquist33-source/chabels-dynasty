/* Chabels Dynasty — shared site chrome (nav + footer + icon sprite).
   Every page carries <div id="site-nav"></div> and <div id="site-footer"></div>
   plus <script src="js/site.js"></script>; this fills them in so the nav is
   defined once. Active state is derived from the current filename.
   Icons: <svg class="icon"><use href="#i-trophy"></use></svg>  */
(function () {
  var PAGE = (location.pathname.split("/").pop() || "index.html").toLowerCase();

  /* ---- inline icon sprite (stroke, 24-grid, one style) ---- */
  var SPRITE =
    '<svg xmlns="http://www.w3.org/2000/svg" width="0" height="0" style="position:absolute" aria-hidden="true">' +
    '<symbol id="i-trophy" viewBox="0 0 24 24"><path d="M7 4h10v5a5 5 0 0 1-10 0V4Z"/><path d="M7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3M12 14v4M8 20h8M9 20l.5-2h5l.5 2"/></symbol>' +
    '<symbol id="i-crown" viewBox="0 0 24 24"><path d="M4 18h16M4 18 3 8l5 4 4-6 4 6 5-4-1 10"/></symbol>' +
    '<symbol id="i-medal" viewBox="0 0 24 24"><path d="m8 3 4 7 4-7"/><circle cx="12" cy="16" r="5"/><path d="M12 13v3l2 1"/></symbol>' +
    '<symbol id="i-trend-up" viewBox="0 0 24 24"><path d="M3 17 9 11l4 4 8-8M16 7h5v5"/></symbol>' +
    '<symbol id="i-trend-down" viewBox="0 0 24 24"><path d="M3 7 9 13l4-4 8 8M16 17h5v-5"/></symbol>' +
    '<symbol id="i-skull" viewBox="0 0 24 24"><path d="M12 3a8 8 0 0 0-5 14v2a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-2a8 8 0 0 0-5-14Z"/><circle cx="9" cy="12" r="1.4"/><circle cx="15" cy="12" r="1.4"/><path d="M11 17h2"/></symbol>' +
    '<symbol id="i-flame" viewBox="0 0 24 24"><path d="M12 3c1 3 4 5 4 9a4 4 0 0 1-8 0c0-1 .5-2 1-3 .5 2 2 2 2 2 .5-3-1-6 1-9Z"/></symbol>' +
    '<symbol id="i-swap" viewBox="0 0 24 24"><path d="M4 8h14M14 4l4 4-4 4M20 16H6M10 12l-4 4 4 4"/></symbol>' +
    '<symbol id="i-target" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3.4"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3"/></symbol>' +
    '<symbol id="i-shield" viewBox="0 0 24 24"><path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z"/></symbol>' +
    '<symbol id="i-star" viewBox="0 0 24 24"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z"/></symbol>' +
    '<symbol id="i-calendar" viewBox="0 0 24 24"><rect x="4" y="5" width="16" height="16" rx="2"/><path d="M4 10h16M9 3v4M15 3v4"/></symbol>' +
    '<symbol id="i-swords" viewBox="0 0 24 24"><path d="M14 3h5v5M19 3l-8 8M5 21l3-3M8.5 15.5 4 20l-1-1 4.5-4.5M10 3H5v5M5 3l8 8M19 21l-3-3M15.5 15.5 20 20l1-1-4.5-4.5"/></symbol>' +
    '<symbol id="i-chart" viewBox="0 0 24 24"><path d="M4 5v15h16M8 16v-4M12 16V8M16 16v-6"/></symbol>' +
    '<symbol id="i-list" viewBox="0 0 24 24"><path d="M8 6h13M8 12h13M8 18h13M4 6h.01M4 12h.01M4 18h.01"/></symbol>' +
    '<symbol id="i-clock" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l4 2"/></symbol>' +
    '<symbol id="i-hoops" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 3c-3 3-3 15 0 18M12 3c3 3 3 15 0 18M3.5 9h17M3.5 15h17"/></symbol>' +
    '<symbol id="i-mask" viewBox="0 0 24 24"><path d="M4 5c5-1 11-1 16 0 0 7-3 13-8 15C7 18 4 12 4 5Z"/><path d="M9 10h.01M15 10h.01M9 14c1 1 5 1 6 0"/></symbol>' +
    '<symbol id="i-lock" viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="10" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></symbol>' +
    '<symbol id="i-arrow" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></symbol>' +
    '</svg>';
  document.body.insertAdjacentHTML("afterbegin", SPRITE);

  var NAV = [
    { href: "index.html", label: "Home" },
    { href: "teams.html", label: "Teams" },
    { href: "draft.html", label: "Draft" },
    { label: "Analytics", menu: [
      { href: "rankings.html",               label: "Power Rankings" },
      { href: "grades.html",                 label: "Draft Grades" },
      { href: "analytics.html#analyzer",      label: "Trade Analyzer" },
      { href: "trades.html",                 label: "Trade History" },
      { href: "analytics.html#contribution",  label: "Player Contribution" },
      { href: "analytics.html#age",           label: "Roster Age" },
      { href: "awards.html",                 label: "Awards" },
      { href: "history.html",                label: "History" }
    ] }
  ];
  var UNDER_ANALYTICS = ["rankings.html", "grades.html", "analytics.html",
                         "trades.html", "awards.html", "history.html"];

  function frag(html) {
    var t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content.firstChild;
  }
  function isActive(href) { return href.split("#")[0] === PAGE; }

  var links = NAV.map(function (item) {
    if (item.menu) {
      var here = UNDER_ANALYTICS.indexOf(PAGE) >= 0;
      var sub = item.menu.map(function (m) {
        return '<a href="' + m.href + '"' + (isActive(m.href) ? ' class="active"' : "") + ">" + m.label + "</a>";
      }).join("");
      return '<div class="nav-dropdown"><span class="nav-dropdown-toggle' + (here ? " active" : "") + '" role="button" tabindex="0">' + item.label + ' <span aria-hidden="true">▾</span></span><div class="nav-dropdown-menu">' + sub + "</div></div>";
    }
    return '<a href="' + item.href + '"' + (isActive(item.href) ? ' class="active"' : "") + ">" + item.label + "</a>";
  }).join("");

  var nav = frag(
    '<nav class="nav" aria-label="Primary">' +
      '<div class="nav-inner">' +
        '<a href="index.html" class="nav-logo">CHABELS<span class="sub">Dynasty League</span></a>' +
        '<span class="nav-toggle" role="button" tabindex="0" aria-label="Menu"><span></span><span></span><span></span></span>' +
        '<div class="nav-links">' + links + "</div>" +
      "</div>" +
    "</nav>");

  var mount = document.getElementById("site-nav");
  if (mount) mount.replaceWith(nav);
  else document.body.insertBefore(nav, document.body.firstChild);

  var toggle = nav.querySelector(".nav-toggle");
  var linkbox = nav.querySelector(".nav-links");
  toggle.addEventListener("click", function () {
    var open = linkbox.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll(".nav-dropdown").forEach(function (dd) {
    var ddToggle = dd.querySelector(".nav-dropdown-toggle");
    if (!ddToggle) return;
    var setOpen = function (v) {
      dd.classList.toggle("open", v);
      ddToggle.setAttribute("aria-expanded", String(v));
    };
    ddToggle.addEventListener("click", function () {
      setOpen(!dd.classList.contains("open"));
    });
    ddToggle.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setOpen(!dd.classList.contains("open")); }
      if (e.key === "Escape") { setOpen(false); ddToggle.focus(); }
    });
    dd.addEventListener("mouseleave", function () { setOpen(false); });
    dd.querySelectorAll(".nav-dropdown-menu a").forEach(function (a) {
      a.addEventListener("click", function () { setOpen(false); });
    });
  });

  var footer = frag(
    '<footer class="footer"><p><span class="gold">CHABELS DYNASTY LEAGUE</span>' +
    ' — Rebound &middot; Execute &middot; Defend</p></footer>');
  var fmount = document.getElementById("site-footer");
  if (fmount) fmount.replaceWith(footer);
  else document.body.appendChild(footer);
})();
