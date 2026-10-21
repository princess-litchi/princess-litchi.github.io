(function () {
  var stories = Array.prototype.slice.call(document.querySelectorAll(".story"));
  var ids = stories.map(function (story) { return story.id; });
  var body = document.body;
  var navTitle = document.getElementById("nav-title");
  var navPrev = document.getElementById("nav-prev");
  var navNext = document.getElementById("nav-next");
  var prev = document.getElementById("prev");
  var next = document.getElementById("next");
  var bar = document.querySelector(".progress span");
  var envelope = document.querySelector(".envelope");
  var homeTitle = document.title;
  var current = -1;

  function point(link, story, label) {
    link.hidden = !story;
    if (!story) return;
    link.href = "#" + story.id;
    var strong = link.querySelector("strong");
    if (strong) strong.textContent = story.dataset.title;
    else link.setAttribute("aria-label", label + "：" + story.dataset.title);
  }

  function onScroll() {
    if (current === -1) return;
    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    bar.style.width = (max > 0 ? Math.min(1, doc.scrollTop / max) * 100 : 100) + "%";
    navTitle.classList.toggle("is-shown", doc.scrollTop > 240);
  }

  function route() {
    var id = decodeURIComponent(location.hash.slice(1));
    var wasReading = current !== -1;
    current = ids.indexOf(id);

    stories.forEach(function (story, i) {
      story.classList.toggle("is-active", i === current);
    });

    if (current === -1) {
      body.classList.remove("is-reading");
      document.title = homeTitle;
      if (envelope) envelope.classList.remove("is-open");
      var target = id && document.getElementById(id);
      if (target) target.scrollIntoView();
      else if (wasReading) window.scrollTo(0, 0);
      return;
    }

    var story = stories[current];
    body.classList.add("is-reading");
    navTitle.textContent = story.dataset.title;
    point(navPrev, stories[current - 1], "上一篇");
    point(navNext, stories[current + 1], "下一篇");
    point(prev, stories[current - 1]);
    point(next, stories[current + 1]);
    document.title = story.dataset.title + " · " + homeTitle;
    window.scrollTo(0, 0);
    onScroll();
  }

  if (envelope) {
    envelope.addEventListener("click", function (event) {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      event.preventDefault();
      envelope.classList.add("is-open");
      setTimeout(function () { location.hash = "letter"; }, 950);
    });
  }

  document.addEventListener("keydown", function (event) {
    if (current === -1 || event.altKey || event.ctrlKey || event.metaKey) return;
    var to = event.key === "ArrowLeft" ? stories[current - 1]
      : event.key === "ArrowRight" ? stories[current + 1] : null;
    if (to) location.hash = to.id;
  });

  window.addEventListener("hashchange", route);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  route();
})();
