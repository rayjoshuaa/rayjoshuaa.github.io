/* SIAMIS Computer Lesson Plan — enhancement layer (2026-10-28, fix round 2).
   Loading screen, position memory, search recents, term progress,
   dialog group coloring, footer date, mascot celebrations.
   Loaded after the main app script; everything degrades gracefully. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  /* ---------- Loading screen ---------- */
  (function loader() {
    var el = $('#site-loader');
    if (!el) return;
    var done = false;
    function finish(instant) {
      if (done) return; done = true;
      if (window.__loaderFailsafe) clearTimeout(window.__loaderFailsafe);
      document.documentElement.classList.remove('loading');
      try { sessionStorage.setItem('siamis-loader-seen', '1'); } catch (e) {}
      if (instant) { el.remove(); return; }
      el.classList.add('done');
      setTimeout(function () { el.remove(); }, 820);
    }
    var seen = false;
    try { seen = !!sessionStorage.getItem('siamis-loader-seen'); } catch (e) {}
    if (seen) { finish(true); return; }
    var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) { setTimeout(function () { finish(false); }, 350); return; }
    var p = 0, loaded = document.readyState === 'complete', t0 = Date.now();
    window.addEventListener('load', function () { loaded = true; });
    function draw() {
      var f = $('#loader-fill'), c = $('#loader-pct');
      if (f) f.style.width = p + '%';
      if (c) c.textContent = Math.floor(p) + '%';
    }
    var iv = setInterval(function () {
      var elapsed = Date.now() - t0;
      var target = (loaded || elapsed > 1500) ? 100 : Math.min(92, elapsed / 1500 * 92);
      p += (target - p) * 0.35 + 1.4;
      if (p >= 99.5) { p = 100; draw(); clearInterval(iv); setTimeout(function () { finish(false); }, 240); return; }
      draw();
    }, 90);
    el.addEventListener('click', function () { clearInterval(iv); finish(false); });
    setTimeout(function () { clearInterval(iv); finish(false); }, 4200);
  })();

  /* ---------- Term progress (dashboard) ---------- */
  var wrap = $('.school-status-wrap');
  var prog = document.createElement('div');
  prog.className = 'term-progress'; prog.id = 'term-progress'; prog.hidden = true;
  prog.innerHTML = '<div class="term-progress-head"><span id="tp-label"></span><span id="tp-pct"></span></div>' +
    '<div class="term-progress-track"><div class="term-progress-fill" id="tp-fill"></div></div>';
  if (wrap) wrap.appendChild(prog);
  function updateTermUI() {
    try {
      var cur = window.SCHOOL_CALENDAR && SCHOOL_CALENDAR.current();
      if (!cur || cur.term === undefined) { prog.hidden = true; return; }
      var total = (window.CURRICULUM || curriculum)['1'].Computing.terms[cur.term].weeks.length;
      var pct = Math.round((cur.week + 1) / total * 100);
      $('#tp-label').textContent = 'Term ' + (cur.term + 1) + ' progress — Week ' + (cur.week + 1) + ' of ' + total;
      $('#tp-pct').textContent = pct + '%';
      $('#tp-fill').style.width = pct + '%';
      prog.hidden = false;
    } catch (e) { prog.hidden = true; }
  }

  /* ---------- Position memory + search recents (wrappers) ---------- */
  var POS_KEY = 'siamis-pos', REC_KEY = 'siamis-recents';
  function savePos() {
    try { store.set(POS_KEY, JSON.stringify({ y: (typeof year !== 'undefined' ? year : null), t: term, s: subject })); } catch (e) {}
  }
  ['selectYear', 'selectTerm', 'selectSubject', 'mainMenu'].forEach(function (name) {
    var orig = window[name];
    if (typeof orig !== 'function') return;
    window[name] = function () { var r = orig.apply(null, arguments); savePos(); return r; };
  });
  var recTimer = null, origSearch = window.updateSearch;
  if (typeof origSearch === 'function') {
    window.updateSearch = function (v) {
      var r = origSearch.apply(null, arguments);
      var q = String(v || '').trim();
      if (q.length >= 3) {
        clearTimeout(recTimer);
        recTimer = setTimeout(function () {
          var list = [];
          try { list = JSON.parse(store.get(REC_KEY) || '[]'); } catch (e) {}
          list = [q].concat(list.filter(function (x) { return x.toLowerCase() !== q.toLowerCase(); })).slice(0, 5);
          store.set(REC_KEY, JSON.stringify(list));
        }, 700);
      }
      return r;
    };
  }

  /* ---------- Rows decoration: New badges, recents, friendly empty state ---------- */
  var RECENT_UPDATES = { 'y5-t1-w10': '2026-10-28' };
  function slugOf(v) { return String(v).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-$/, ''); }
  function isRecent(i) {
    var keys = ['y' + year + '-t' + (term + 1) + '-w' + (i + 1),
                'y' + year + '-' + slugOf(subject) + '-t' + (term + 1) + '-w' + (i + 1)];
    if (String(year) === '10-11') keys.push('y10-t' + (term + 1) + '-w' + (i + 1), 'y11-t' + (term + 1) + '-w' + (i + 1));
    for (var k = 0; k < keys.length; k++) {
      var d = RECENT_UPDATES[keys[k]];
      if (d) {
        var days = (Date.now() - new Date(d + 'T00:00:00+07:00').getTime()) / 86400000;
        if (days >= 0 && days <= 14) return true;
      }
    }
    return false;
  }
  var decorating = false;
  function decorate() {
    if (decorating) return; decorating = true;
    try {
      $$('#rows tr').forEach(function (tr) {
        var btn = $('.material-btn', tr); if (!btn) return;
        var m = /materials\((\d+)\)/.exec(btn.getAttribute('onclick') || ''); if (!m) return;
        var i = +m[1];
        if (isRecent(i) && !$('.new-badge', tr)) {
          var wn = $('.week-number', tr);
          if (wn) wn.insertAdjacentHTML('afterend', '<span class="new-badge">New</span> ');
        }
      });
      var emptyP = $('.search-empty p');
      if (emptyP && !emptyP.dataset.enh) {
        emptyP.textContent = 'Try a different topic — for example “search engines” — or reset the filters to see every week.';
        emptyP.dataset.enh = '1';
      }
      var input = $('#lesson-search'), head = $('.sectionhead');
      if (input && head && typeof query !== 'undefined' && !query && !$('.recent-searches')) {
        var recents = [];
        try { recents = JSON.parse(store.get(REC_KEY) || '[]'); } catch (e) {}
        if (recents.length) {
          var div = document.createElement('div');
          div.className = 'recent-searches';
          div.innerHTML = '<span>Recent searches:</span>' + recents.map(function (q) {
            return '<button type="button" class="recent-chip" data-q="' + q.replace(/"/g, '&quot;') + '">' + q.replace(/</g, '&lt;') + '</button>';
          }).join('');
          head.insertAdjacentElement('afterend', div);
        }
      }
    } catch (e) {}
    decorating = false;
  }

  /* ---------- Materials dialog: color rows by group ---------- */
  function decorateDialog() {
    var list = $('.material-list'); if (!list) return;
    var group = '';
    $$('#resourcecontent .material-list > *').forEach(function (node) {
      if (node.classList.contains('material-group-label')) {
        group = node.classList.contains('g-plan') ? 'row-plan' :
                node.classList.contains('g-pres') ? 'row-pres' :
                node.classList.contains('g-ref') ? 'row-ref' : '';
      } else if (node.classList.contains('resource-row') && group) {
        node.classList.add(group);
      }
    });
  }
  var rc = $('#resourcecontent');
  if (rc) new MutationObserver(function () { decorateDialog(); }).observe(rc, { childList: true });

  document.addEventListener('click', function (e) {
    var chip = e.target.closest ? e.target.closest('.recent-chip') : null;
    if (chip) {
      var input = $('#lesson-search');
      if (input) { input.value = chip.dataset.q; updateSearch(chip.dataset.q); input.focus(); }
    }
    if (e.target.closest && e.target.closest('#resourcecontent a[download]')) {
      var mascot = $('.page-mascot');
      if (mascot) setTimeout(function () { mascot.click(); }, 350);
    }
  });
  var content = $('#content');
  if (content) new MutationObserver(function () { requestAnimationFrame(decorate); }).observe(content, { childList: true, subtree: true });
  var status = $('#school-status');
  if (status) new MutationObserver(function () { updateTermUI(); }).observe(status, { childList: true });

  /* ---------- Boot: restore saved position ---------- */
  function boot() {
    try {
      var pos = JSON.parse(store.get(POS_KEY) || 'null');
      if (pos && pos.y !== null && pos.y !== undefined) {
        selectYear(pos.y);
        var subs = Object.keys((window.CURRICULUM || curriculum)[String(pos.y)] || {});
        if (pos.s && subs.indexOf(pos.s) !== -1 && pos.s !== subject) selectSubject(pos.s);
        if (pos.t) selectTerm(pos.t);
      }
    } catch (e) {}
    updateTermUI();
    decorate();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
  setInterval(updateTermUI, 30000);

  /* ---------- Footer: last updated (GitHub) ---------- */
  (function lastUpdated() {
    var el = $('#last-updated'); if (!el || !window.fetch) return;
    fetch('https://api.github.com/repos/rayjoshuaa/rayjoshuaa.github.io/commits?per_page=1')
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        if (!j || !j[0]) return;
        var d = new Date(j[0].commit.committer.date);
        el.textContent = 'Last updated ' + new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(d);
      })
      .catch(function () {});
  })();

  /* ---------- Service worker (offline shell) ---------- */
  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    navigator.serviceWorker.register('sw.js').catch(function () {});
  }
})();
