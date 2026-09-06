/* Chabels Dynasty — shared site chrome (nav + footer).
   Every page carries <div id="site-nav"></div> and <div id="site-footer"></div>
   plus <script src="js/site.js"></script>; this fills them in so the nav is
   defined once. Active state is derived from the current filename. */
(function () {
  var PAGE = (location.pathname.split("/").pop() || "index.html").toLowerCase();

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

  var ddToggle = nav.querySelector(".nav-dropdown-toggle");
  if (ddToggle) {
    ddToggle.addEventListener("click", function () {
      var open = ddToggle.parentNode.classList.toggle("open");
      ddToggle.setAttribute("aria-expanded", String(open));
    });
  }

  var footer = frag(
    '<footer class="footer"><p><span class="gold">CHABELS DYNASTY LEAGUE</span>' +
    ' — Rebound &middot; Execute &middot; Defend</p></footer>');
  var fmount = document.getElementById("site-footer");
  if (fmount) fmount.replaceWith(footer);
  else document.body.appendChild(footer);
})();
