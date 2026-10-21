(function () {
  var stories = Array.prototype.slice.call(document.querySelectorAll(".story"));
  var ids = stories.map(function (story) { return story.id; });
  var body = document.body;
  var select = document.getElementById("story-select");
  var prev = document.getElementById("prev");
  var next = document.getElementById("next");
  var bar = document.querySelector(".progress span");
  var homeTitle = document.title;

  function setLink(link, story) {
    link.hidden = !story;
    if (!story) return;
    link.href = "#" + story.id;
    link.querySelector("strong").textContent = story.dataset.title;
  }

  function progress() {
    if (!body.classList.contains("is-reading")) return;
    var doc = document.documentElement;
    var max = doc.scrollHeight - doc.clientHeight;
    bar.style.width = (max > 0 ? Math.min(1, doc.scrollTop / max) * 100 : 100) + "%";
  }

  function route() {
    var id = decodeURIComponent(location.hash.slice(1));
    var index = ids.indexOf(id);

    stories.forEach(function (story, i) {
      story.classList.toggle("is-active", i === index);
    });

    if (index === -1) {
      body.classList.remove("is-reading");
      document.title = homeTitle;
      var target = id && document.getElementById(id);
      if (target) target.scrollIntoView();
      return;
    }

    body.classList.add("is-reading");
    select.value = id;
    setLink(prev, stories[index - 1]);
    setLink(next, stories[index + 1]);
    document.title = stories[index].dataset.title + " · " + homeTitle;
    window.scrollTo(0, 0);
    progress();
  }

  select.addEventListener("change", function () {
    location.hash = select.value;
  });
  window.addEventListener("hashchange", route);
  window.addEventListener("scroll", progress, { passive: true });
  window.addEventListener("resize", progress);
  route();
})();
