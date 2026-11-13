/* =========================================================
   英文筆記本 — 全站唯一腳本
   依 data/notes.js 產生：頁首導覽、首頁卡片 / 搜尋 / 分類篩選、
   筆記頁的分類與難度徽章、同分類筆記、上一篇 / 下一篇、頁尾
   筆記頁只需要 <body data-note="id" data-root="../">
   ========================================================= */
(function () {
  var NOTES = window.NOTES || [];
  var body = document.body;
  var current = body.getAttribute("data-note") || "";
  var pageType = body.getAttribute("data-page") || "";
  var root = body.getAttribute("data-root") || "";

  // 分類：新增分類時要同步更新 CLAUDE.md 第 4.1 節與 style.css
  var CATEGORY = {
    grammar: "文法",
    vocab: "單字",
    phrase: "片語搭配",
    mistake: "常見錯誤",
    talk: "情境會話"
  };
  var LEVEL = { 1: "基礎", 2: "中級", 3: "進階" };

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }
  function href(n) { return root + "notes/" + n.id + ".html"; }
  function badges(n) {
    return '<span class="badges"><span class="cat cat-' + esc(n.category) + '">' + esc(CATEGORY[n.category] || n.category) +
      '</span><span class="level">' + esc(LEVEL[n.level] || "") + "</span></span>";
  }

  // 1. 頁首導覽
  var header = document.getElementById("site-header");
  if (header) {
    header.className = "site-header";
    var urlCat = pageType === "home" ? new URLSearchParams(location.search).get("cat") : null;
    if (!CATEGORY[urlCat]) urlCat = null;
    var links = '<a href="' + root + 'index.html"' + (pageType === "home" && !urlCat ? ' aria-current="page"' : "") + ">全部筆記</a>";
    Object.keys(CATEGORY).forEach(function (c) {
      links += '<a href="' + root + "index.html?cat=" + c + '"' + (urlCat === c ? ' aria-current="page"' : "") + ">" + CATEGORY[c] + "</a>";
    });
    links += '<a href="' + root + 'about.html"' + (pageType === "about" ? ' aria-current="page"' : "") + ">關於</a>";
    header.innerHTML = '<div class="bar"><a class="brand" href="' + root + 'index.html">我的<span>英文筆記本</span></a>' +
      '<nav class="main-nav" aria-label="主選單">' + links + "</nav></div>";
  }

  // 2. 首頁：統計、搜尋、分類篩選、卡片（最新的在最前面）
  var grid = document.getElementById("note-cards");
  if (grid) {
    var stats = document.getElementById("stats");
    if (stats) {
      var html = "<li><b>" + NOTES.length + "</b>篇筆記</li>";
      Object.keys(CATEGORY).forEach(function (c) {
        var k = NOTES.filter(function (n) { return n.category === c; }).length;
        html += "<li><b>" + k + "</b>" + CATEGORY[c] + "</li>";
      });
      stats.innerHTML = html;
    }

    var params = new URLSearchParams(location.search);
    var activeCat = CATEGORY[params.get("cat")] ? params.get("cat") : "all";
    var filters = document.getElementById("filters");
    var search = document.getElementById("search");
    var countEl = document.getElementById("result-count");

    var cats = [["all", "全部"]].concat(Object.keys(CATEGORY).map(function (c) { return [c, CATEGORY[c]]; }));
    filters.innerHTML = cats.map(function (c) {
      return '<button type="button" class="filter" data-cat="' + c[0] + '" aria-pressed="' + (c[0] === activeCat) + '">' + c[1] + "</button>";
    }).join("");

    function render() {
      var q = (search.value || "").trim().toLowerCase();
      var list = NOTES.slice().reverse().filter(function (n) {
        if (activeCat !== "all" && n.category !== activeCat) return false;
        if (!q) return true;
        return [n.title, n.en, n.summary, (n.tags || []).join(" "), CATEGORY[n.category]].join(" ").toLowerCase().indexOf(q) >= 0;
      });
      grid.innerHTML = list.length ? list.map(function (n) {
        return '<a class="note-card cat-' + esc(n.category) + '" href="' + href(n) + '">' + badges(n) +
          "<h2>" + esc(n.title) + '</h2><p class="en" lang="en">' + esc(n.en) + '</p><p class="sum">' + esc(n.summary) + "</p></a>";
      }).join("") : '<p class="empty">找不到符合的筆記，換個關鍵字試試看。</p>';
      countEl.textContent = "顯示 " + list.length + " / " + NOTES.length + " 篇";
    }

    filters.addEventListener("click", function (e) {
      var btn = e.target.closest(".filter");
      if (!btn) return;
      activeCat = btn.getAttribute("data-cat");
      try { history.replaceState(null, "", activeCat === "all" ? location.pathname : "?cat=" + activeCat); } catch (err) {}
      Array.prototype.forEach.call(document.querySelectorAll(".main-nav a"), function (a) {
        var m = /[?&]cat=(\w+)/.exec(a.getAttribute("href"));
        var isHome = /index\.html$/.test(a.getAttribute("href"));
        var on = m ? m[1] === activeCat : (isHome && activeCat === "all");
        if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
      });
      Array.prototype.forEach.call(filters.children, function (b) {
        b.setAttribute("aria-pressed", String(b === btn));
      });
      render();
    });
    search.addEventListener("input", render);
    render();
  }

  // 3. 筆記頁：徽章、同分類筆記、上一篇 / 下一篇
  var idx = -1;
  for (var i = 0; i < NOTES.length; i++) if (NOTES[i].id === current) idx = i;
  if (idx >= 0) {
    var note = NOTES[idx];
    var slot = document.getElementById("note-badges");
    if (slot) slot.outerHTML = badges(note);

    var related = document.getElementById("related");
    if (related) {
      var same = NOTES.filter(function (n) { return n.category === note.category && n.id !== note.id; });
      related.innerHTML = "<h2>同分類筆記</h2>" + (same.length
        ? '<ul class="related-list">' + same.map(function (n) {
            return '<li><a href="' + href(n) + '">' + esc(n.title) + '<small lang="en">' + esc(n.en) + "</small></a></li>";
          }).join("") + "</ul>"
        : '<p class="empty">這個分類目前只有這一篇，之後新增的筆記會自動出現在這裡。</p>');
    }

    var pager = document.getElementById("pager");
    if (pager) {
      pager.className = "pager";
      var prev = NOTES[idx - 1], next = NOTES[idx + 1];
      pager.innerHTML =
        (prev ? '<a class="prev" href="' + href(prev) + '"><small>← 上一篇</small>' + esc(prev.title) + "</a>" : "<span></span>") +
        (next ? '<a class="next" href="' + href(next) + '"><small>下一篇 →</small>' + esc(next.title) + "</a>" : "<span></span>");
    }
  }

  // 4. 頁尾
  var footer = document.getElementById("site-footer");
  if (footer) {
    footer.className = "site-footer";
    footer.innerHTML = "<p>廖嘉哲的英文筆記本｜一個主題一頁，持續更新中</p>" +
      '<p>本站依 <a href="https://github.com/p16141134-beep/english-notes/blob/main/CLAUDE.md">CLAUDE.md</a> 的規則新增內容</p>';
  }
})();
