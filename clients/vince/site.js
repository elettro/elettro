/* ============================================================
   VINCE MOLINARI — site.js
   Custom broadcast audio player with resume-on-reload.
   Activates any element with [data-player].
   ============================================================ */
(function () {
  function fmt(s) {
    if (!isFinite(s) || s < 0) s = 0;
    var m = Math.floor(s / 60);
    var sec = Math.floor(s % 60);
    return m + ":" + (sec < 10 ? "0" : "") + sec;
  }

  function initPlayer(root) {
    var audio = root.querySelector("[data-audio]");
    if (!audio) return;
    var playBtn = root.querySelector("[data-play]");
    var prog = root.querySelector("[data-prog]");
    var bar = root.querySelector("[data-seek]");
    var curEl = root.querySelector("[data-cur]");
    var durEl = root.querySelector("[data-dur]");
    var backBtn = root.querySelector("[data-back]");
    var fwdBtn = root.querySelector("[data-fwd]");
    var rateBtn = root.querySelector("[data-rate]");

    var key = "vm-podcast-pos:" + (audio.getAttribute("data-src") || "default");
    var rates = [1, 1.25, 1.5, 2];
    var rateIdx = 0;

    function setPlayIcon(playing) {
      if (playBtn) playBtn.textContent = playing ? "❚❚" : "▶";
    }

    // restore saved position
    function restore() {
      try {
        var saved = parseFloat(localStorage.getItem(key));
        if (!isNaN(saved) && saved > 0 && saved < (audio.duration || Infinity) - 1) {
          audio.currentTime = saved;
        }
      } catch (e) {}
    }

    audio.addEventListener("loadedmetadata", function () {
      if (durEl) durEl.textContent = fmt(audio.duration);
      restore();
      update();
    });
    if (audio.readyState >= 1) {
      if (durEl) durEl.textContent = fmt(audio.duration);
      restore();
    }

    function update() {
      var pct = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
      if (prog) prog.style.width = pct + "%";
      if (curEl) curEl.textContent = fmt(audio.currentTime);
    }

    audio.addEventListener("timeupdate", function () {
      update();
      try { localStorage.setItem(key, audio.currentTime); } catch (e) {}
    });
    audio.addEventListener("play", function () { setPlayIcon(true); });
    audio.addEventListener("pause", function () { setPlayIcon(false); });
    audio.addEventListener("ended", function () {
      setPlayIcon(false);
      try { localStorage.removeItem(key); } catch (e) {}
    });

    if (playBtn) playBtn.addEventListener("click", function () {
      if (audio.paused) audio.play(); else audio.pause();
    });
    if (backBtn) backBtn.addEventListener("click", function () {
      audio.currentTime = Math.max(0, audio.currentTime - 15);
    });
    if (fwdBtn) fwdBtn.addEventListener("click", function () {
      audio.currentTime = Math.min(audio.duration || 0, audio.currentTime + 30);
    });
    if (rateBtn) rateBtn.addEventListener("click", function () {
      rateIdx = (rateIdx + 1) % rates.length;
      audio.playbackRate = rates[rateIdx];
      rateBtn.textContent = rates[rateIdx] + "×";
    });
    if (bar) bar.addEventListener("click", function (e) {
      var rect = bar.getBoundingClientRect();
      var ratio = (e.clientX - rect.left) / rect.width;
      if (audio.duration) audio.currentTime = ratio * audio.duration;
    });

    // Only attach the source once we've confirmed the file exists,
    // so a not-yet-uploaded episode doesn't throw a console error.
    var src = audio.getAttribute("data-src");
    var sub = root.querySelector(".player-sub");
    function markUnavailable() {
      if (playBtn) { playBtn.style.opacity = ".45"; playBtn.style.pointerEvents = "none"; }
      if (sub) sub.textContent = "Episode coming soon — upload assets/podcast.m4a to go live.";
    }
    if (src) {
      fetch(src, { method: "HEAD" })
        .then(function (res) {
          if (res && res.ok) { audio.src = src; }
          else { markUnavailable(); }
        })
        .catch(function () { markUnavailable(); });
    }
  }

  function initCarousel(root) {
    var slides = root.querySelectorAll(".carousel-slide");
    var dots = root.querySelectorAll("[data-carousel-dot]");
    var prevBtn = root.querySelector("[data-carousel-prev]");
    var nextBtn = root.querySelector("[data-carousel-next]");
    if (!slides.length) return;

    var index = 0;
    var DURATION = 8000;
    var timer = null;

    function show(i) {
      index = (i + slides.length) % slides.length;
      slides.forEach(function (s, n) { s.classList.toggle("is-active", n === index); });
      dots.forEach(function (d, n) { d.classList.toggle("is-active", n === index); });
    }

    function next() { show(index + 1); }
    function prev() { show(index - 1); }

    function restart() {
      if (timer) clearInterval(timer);
      timer = setInterval(next, DURATION);
    }

    if (nextBtn) nextBtn.addEventListener("click", function () { next(); restart(); });
    if (prevBtn) prevBtn.addEventListener("click", function () { prev(); restart(); });
    dots.forEach(function (d, n) {
      d.addEventListener("click", function () { show(n); restart(); });
    });

    slides.forEach(function (s, n) {
      s.addEventListener("click", function () {
        openLightbox(slides, n);
      });
    });

    // touch swipe support
    var touchStartX = null;
    root.addEventListener("touchstart", function (e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    root.addEventListener("touchend", function (e) {
      if (touchStartX === null) return;
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) {
        if (dx < 0) next(); else prev();
        restart();
      }
      touchStartX = null;
    }, { passive: true });

    show(0);
    restart();
  }

  var lightboxEl = null;
  var lightboxImg = null;
  var lightboxSlides = [];
  var lightboxIndex = 0;

  function openLightbox(slides, index) {
    if (!lightboxEl) return;
    lightboxSlides = slides;
    lightboxIndex = index;
    lightboxImg.src = slides[index].src;
    lightboxImg.alt = slides[index].alt || "";
    lightboxEl.classList.add("is-open");
    lightboxEl.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    if (!lightboxEl) return;
    lightboxEl.classList.remove("is-open");
    lightboxEl.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  function showLightbox(i) {
    if (!lightboxSlides.length) return;
    lightboxIndex = (i + lightboxSlides.length) % lightboxSlides.length;
    lightboxImg.src = lightboxSlides[lightboxIndex].src;
    lightboxImg.alt = lightboxSlides[lightboxIndex].alt || "";
  }

  function initLightbox() {
    lightboxEl = document.querySelector("[data-lightbox]");
    if (!lightboxEl) return;
    lightboxImg = lightboxEl.querySelector("[data-lightbox-img]");
    var closeBtn = lightboxEl.querySelector("[data-lightbox-close]");
    var prevBtn = lightboxEl.querySelector("[data-lightbox-prev]");
    var nextBtn = lightboxEl.querySelector("[data-lightbox-next]");

    if (closeBtn) closeBtn.addEventListener("click", closeLightbox);
    if (prevBtn) prevBtn.addEventListener("click", function () { showLightbox(lightboxIndex - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { showLightbox(lightboxIndex + 1); });

    // click on the dark backdrop (outside the image) closes
    lightboxEl.addEventListener("click", function (e) {
      if (e.target === lightboxEl) closeLightbox();
    });

    document.addEventListener("keydown", function (e) {
      if (!lightboxEl.classList.contains("is-open")) return;
      if (e.key === "Escape") closeLightbox();
      else if (e.key === "ArrowLeft") showLightbox(lightboxIndex - 1);
      else if (e.key === "ArrowRight") showLightbox(lightboxIndex + 1);
    });

    // touch swipe support
    var touchStartX = null;
    lightboxEl.addEventListener("touchstart", function (e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    lightboxEl.addEventListener("touchend", function (e) {
      if (touchStartX === null) return;
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) {
        if (dx < 0) showLightbox(lightboxIndex + 1); else showLightbox(lightboxIndex - 1);
      }
      touchStartX = null;
    }, { passive: true });
  }

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var tmp = arr[i]; arr[i] = arr[j]; arr[j] = tmp;
    }
    return arr;
  }

  function initHeroPhotos(root) {
    var photos = Array.prototype.slice.call(root.querySelectorAll(".hero-photo"));
    if (photos.length < 2) return;
    var prevBtn = root.querySelector("[data-hero-prev]");
    var nextBtn = root.querySelector("[data-hero-next]");
    var DURATION = 15000;
    var order = shuffle(photos.map(function (_, i) { return i; }));
    var pos = 0;
    var timer = null;

    function render() {
      photos.forEach(function (p) { p.classList.remove("is-active"); });
      photos[order[pos]].classList.add("is-active");
    }

    function advance(dir) {
      pos += dir;
      if (pos >= order.length) {
        pos = 0;
        order = shuffle(photos.map(function (_, i) { return i; }));
      } else if (pos < 0) {
        order = shuffle(photos.map(function (_, i) { return i; }));
        pos = order.length - 1;
      }
      render();
    }

    function restart() {
      if (timer) clearInterval(timer);
      timer = setInterval(function () { advance(1); }, DURATION);
    }

    // start on a random photo immediately, rather than always the first one
    pos = Math.floor(Math.random() * order.length);
    render();
    restart();

    if (nextBtn) nextBtn.addEventListener("click", function () { advance(1); restart(); });
    if (prevBtn) prevBtn.addEventListener("click", function () { advance(-1); restart(); });

    // touch swipe support (mobile/tablet)
    var touchStartX = null;
    root.addEventListener("touchstart", function (e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    root.addEventListener("touchend", function (e) {
      if (touchStartX === null) return;
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) {
        advance(dx < 0 ? 1 : -1);
        restart();
      }
      touchStartX = null;
    }, { passive: true });
  }

  function initPortraitCarousel(root) {
    var photos = Array.prototype.slice.call(root.querySelectorAll(".portrait-photo"));
    if (photos.length < 2) return;
    var caption = root.querySelector("[data-portrait-caption]");
    var prevBtn = root.querySelector("[data-portrait-prev]");
    var nextBtn = root.querySelector("[data-portrait-next]");
    var DURATION = 10000;
    var timer = null;
    var fixedFirst = root.hasAttribute("data-portrait-fixed-first");

    // with a fixed first photo, photos[0] always starts the sequence and the
    // rest rotate randomly; otherwise every photo (including index 0) is
    // shuffled into the rotation and the starting photo is random too
    var pool = fixedFirst
      ? photos.slice(1).map(function (_, i) { return i + 1; })
      : photos.map(function (_, i) { return i; });
    var order = shuffle(pool.slice());
    var pos = fixedFirst ? -1 : Math.floor(Math.random() * order.length);

    function render() {
      photos.forEach(function (p) { p.classList.remove("is-active"); });
      var activeIndex = pos === -1 ? 0 : order[pos];
      photos[activeIndex].classList.add("is-active");
      if (caption) caption.classList.toggle("is-hidden", activeIndex !== 0);
    }

    function advance(dir) {
      if (dir > 0) {
        pos++;
        if (pos >= order.length) {
          pos = 0;
          order = shuffle(pool.slice());
        }
      } else {
        pos--;
        if (pos < 0) {
          order = shuffle(pool.slice());
          pos = order.length - 1;
        }
      }
      render();
    }

    function restart() {
      if (timer) clearInterval(timer);
      timer = setInterval(function () { advance(1); }, DURATION);
    }

    render();
    restart();

    if (nextBtn) nextBtn.addEventListener("click", function () { advance(1); restart(); });
    if (prevBtn) prevBtn.addEventListener("click", function () { advance(-1); restart(); });

    // touch swipe support (mobile/tablet)
    var touchStartX = null;
    root.addEventListener("touchstart", function (e) {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });
    root.addEventListener("touchend", function (e) {
      if (touchStartX === null) return;
      var dx = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(dx) > 40) {
        advance(dx < 0 ? 1 : -1);
        restart();
      }
      touchStartX = null;
    }, { passive: true });
  }


  function initVideoSheet() {
    var grid = document.querySelector("[data-video-sheet]");
    if (!grid) return;

    var SHEET_ID = "1R81gIQBLICMpccV2fYTHnSI_j8BKEu_fTum-nEGsw0g";
    var SHEET_GID = "0";
    var SHEET_NAME = "Videos";

    function normalizeHeader(value) {
      return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "");
    }

    function escapeHtml(value) {
      return String(value || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }

    function getYouTubeId(url) {
      url = String(url || "").trim();
      if (!url) return "";

      var patterns = [
        /youtube\.com\/watch\?[^#]*v=([^&#]+)/i,
        /youtube\.com\/shorts\/([^?&#]+)/i,
        /youtube\.com\/embed\/([^?&#]+)/i,
        /youtu\.be\/([^?&#]+)/i
      ];

      for (var i = 0; i < patterns.length; i++) {
        var match = url.match(patterns[i]);
        if (match && match[1]) return match[1];
      }

      try {
        var parsed = new URL(url);
        return parsed.searchParams.get("v") || "";
      } catch (e) {
        return "";
      }
    }

    function toEmbedUrl(url) {
      var id = getYouTubeId(url);
      if (id) return "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id);
      return String(url || "").trim();
    }

    function renderVideos(videos) {
      if (!videos.length) {
        grid.innerHTML = [
          '<div class="vcard">',
            '<div class="vmeta">',
              '<div class="vshow">No active videos</div>',
              '<div class="vtitle">No TRUE rows with video_url were found in the Google Sheet.</div>',
            '</div>',
          '</div>'
        ].join("");
        return;
      }

      grid.innerHTML = videos.map(function (video) {
        var embedUrl = toEmbedUrl(video.video_url);
        var title = escapeHtml(video.title);
        var description = escapeHtml(video.description);
        var buttonText = escapeHtml(video.button_text || "Watch Video");
        var buttonUrl = escapeHtml(video.button_url || video.video_url);

        return [
          '<div class="vcard">',
            '<div class="vframe">',
              '<iframe src="' + embedUrl + '" title="' + title + '" loading="lazy" allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>',
            '</div>',
            '<div class="vmeta">',
              '<div class="vshow">FINTECH.TV</div>',
              '<div class="vtitle">' + title + '</div>',
              description ? '<p class="vdesc">' + description + '</p>' : '',
              buttonUrl ? '<a class="video-button" href="' + buttonUrl + '" target="_blank" rel="noopener">' + buttonText + '</a>' : '',
            '</div>',
          '</div>'
        ].join("");
      }).join("");
    }

    function showError(message) {
      console.error("Vince video sheet error:", message);
      grid.innerHTML = [
        '<div class="vcard">',
          '<div class="vmeta">',
            '<div class="vshow">Video sheet error</div>',
            '<div class="vtitle">' + escapeHtml(message || "Could not load the Google Sheet.") + '</div>',
          '</div>',
        '</div>'
      ].join("");
    }

    function getCell(row, index) {
      if (index == null || index < 0) return "";
      if (!row || !row.c || !row.c[index]) return "";
      var cell = row.c[index];
      return cell.v != null ? cell.v : "";
    }

    function parseGoogleTable(table) {
      if (!table || !table.rows || !table.cols) {
        throw new Error("Google returned no table rows or columns.");
      }

      console.log("Vince video sheet raw table:", table);

      var headerMap = {};
      table.cols.forEach(function (col, index) {
        var key = normalizeHeader(col.label);
        if (key) headerMap[key] = index;
      });

      console.log("Vince video sheet detected headers from cols:", headerMap);

      var rows = table.rows.slice();

      /*
        Fallback:
        Sometimes Google does not treat row 1 as headers.
        If required headers are missing, use the first row as the header row.
      */
      if (headerMap.active == null || headerMap.title == null || headerMap.videourl == null) {
        var firstRow = rows[0];
        var fallbackHeaderMap = {};

        if (firstRow && firstRow.c) {
          firstRow.c.forEach(function (cell, index) {
            var key = normalizeHeader(cell && cell.v);
            if (key) fallbackHeaderMap[key] = index;
          });
        }

        if (fallbackHeaderMap.active != null && fallbackHeaderMap.title != null && fallbackHeaderMap.videourl != null) {
          headerMap = fallbackHeaderMap;
          rows = rows.slice(1);
          console.log("Vince video sheet using first row as headers:", headerMap);
        }
      }

      function idx(name) {
        return headerMap[normalizeHeader(name)];
      }

      var activeIndex = idx("Active");
      var sortIndex = idx("Sort");
      var titleIndex = idx("Title");
      var descriptionIndex = idx("Description");
      var videoUrlIndex = idx("video_url");
      var posterUrlIndex = idx("poster_url");
      var buttonTextIndex = idx("button_text");
      var buttonUrlIndex = idx("button_url");

      if (activeIndex == null || titleIndex == null || videoUrlIndex == null) {
        throw new Error("Missing required headers. Need Active, Title, and video_url. Found: " + Object.keys(headerMap).join(", "));
      }

      var videos = rows.map(function (row) {
        return {
          active: getCell(row, activeIndex),
          sort: Number(getCell(row, sortIndex)) || 999,
          title: getCell(row, titleIndex),
          description: getCell(row, descriptionIndex),
          video_url: getCell(row, videoUrlIndex),
          poster_url: getCell(row, posterUrlIndex),
          button_text: getCell(row, buttonTextIndex),
          button_url: getCell(row, buttonUrlIndex)
        };
      }).filter(function (video) {
        return String(video.active).toLowerCase() === "true" && String(video.video_url || "").trim();
      }).sort(function (a, b) {
        return a.sort - b.sort;
      });

      console.log("Vince active videos loaded:", videos);
      return videos;
    }

    function loadJsonp(url, onSuccess, onFailure) {
      var callbackName = "vmVideoSheetCallback_" + Date.now() + "_" + Math.floor(Math.random() * 100000);
      var script = document.createElement("script");
      var done = false;

      window[callbackName] = function (response) {
        done = true;
        try {
          delete window[callbackName];
        } catch (e) {
          window[callbackName] = undefined;
        }

        if (script.parentNode) script.parentNode.removeChild(script);

        if (!response || response.status === "error") {
          onFailure(response);
          return;
        }

        onSuccess(response);
      };

      script.onerror = function () {
        if (done) return;
        done = true;

        try {
          delete window[callbackName];
        } catch (e) {
          window[callbackName] = undefined;
        }

        if (script.parentNode) script.parentNode.removeChild(script);
        onFailure({ message: "Script failed to load: " + url });
      };

      script.src = url.replace("__CALLBACK__", encodeURIComponent(callbackName));
      console.log("Loading Vince video sheet URL:", script.src);
      document.body.appendChild(script);

      window.setTimeout(function () {
        if (done) return;
        done = true;

        try {
          delete window[callbackName];
        } catch (e) {
          window[callbackName] = undefined;
        }

        if (script.parentNode) script.parentNode.removeChild(script);
        onFailure({ message: "Timed out loading: " + url });
      }, 8000);
    }

    var urls = [
      "https://docs.google.com/spreadsheets/d/" + encodeURIComponent(SHEET_ID) + "/gviz/tq?tqx=responseHandler:__CALLBACK__&gid=" + encodeURIComponent(SHEET_GID) + "&headers=1",
      "https://docs.google.com/spreadsheets/d/" + encodeURIComponent(SHEET_ID) + "/gviz/tq?tqx=responseHandler:__CALLBACK__&sheet=" + encodeURIComponent(SHEET_NAME) + "&headers=1",
      "https://docs.google.com/spreadsheets/d/" + encodeURIComponent(SHEET_ID) + "/gviz/tq?tqx=responseHandler:__CALLBACK__&gid=" + encodeURIComponent(SHEET_GID)
    ];

    function tryNextUrl(index, errors) {
      errors = errors || [];

      if (index >= urls.length) {
        showError("Google Sheet did not load. Confirm Share is Anyone with the link, Publish to web is enabled, and tab gid is 0. Errors: " + errors.join(" | "));
        return;
      }

      loadJsonp(urls[index], function (response) {
        try {
          console.log("Vince video sheet response:", response);
          var videos = parseGoogleTable(response.table);
          renderVideos(videos);
        } catch (e) {
          errors.push(e.message);
          tryNextUrl(index + 1, errors);
        }
      }, function (response) {
        var msg = response && (response.message || response.detailed_message || JSON.stringify(response));
        errors.push(msg || "Unknown JSONP load failure");
        tryNextUrl(index + 1, errors);
      });
    }

    tryNextUrl(0, []);
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("[data-player]").forEach(initPlayer);
    initLightbox();
    document.querySelectorAll("[data-carousel]").forEach(initCarousel);
    document.querySelectorAll("[data-hero-photos]").forEach(initHeroPhotos);
    document.querySelectorAll("[data-portrait]").forEach(initPortraitCarousel);
    initVideoSheet();
  });
})();
