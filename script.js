(function () {
  "use strict";

  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute("aria-expanded", String(open));
      nav.classList.toggle("is-open", open);
    };
    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        setOpen(false);
        toggle.focus();
      }
    });
    window.addEventListener("resize", function () {
      if (window.innerWidth > 920) setOpen(false);
    });
  }

  var grid = document.getElementById("ws-grid");
  if (grid) {
    var cards = Array.prototype.slice.call(grid.querySelectorAll(".ws-card"));
    var ageChips = document.querySelectorAll(".chip[data-age]");
    var subjectChips = document.querySelectorAll(".chip[data-subject]");
    var countEl = document.getElementById("ws-count");
    var resetBtn = document.getElementById("ws-reset");
    var emptyEl = document.getElementById("ws-empty");
    var state = { age: "all", subject: "all" };
    var subjectNames = { math: "math", reading: "reading", writing: "writing", science: "science" };

    var setActive = function (chips, attr, value) {
      chips.forEach(function (chip) {
        var on = chip.getAttribute(attr) === value;
        chip.classList.toggle("is-active", on);
        chip.setAttribute("aria-pressed", String(on));
      });
    };

    var apply = function () {
      var shown = 0;
      var range = state.age === "all" ? null : state.age.split("-").map(Number);
      cards.forEach(function (card) {
        var min = Number(card.dataset.min);
        var max = Number(card.dataset.max);
        var ageOk = !range || (min <= range[1] && max >= range[0]);
        var subjOk = state.subject === "all" || card.dataset.subject === state.subject;
        var visible = ageOk && subjOk;
        card.hidden = !visible;
        if (visible) shown++;
      });

      var parts = [];
      if (state.subject !== "all") parts.push(subjectNames[state.subject]);
      var label = shown === 1 ? "worksheet" : "worksheets";
      var text;
      if (state.age === "all" && state.subject === "all") {
        text = "Showing all " + cards.length + " worksheets";
      } else {
        text = "Showing " + shown + " " + (parts.length ? parts[0] + " " : "") + label +
          (range ? " for ages " + range[0] + "–" + range[1] : "");
      }
      countEl.textContent = text;
      resetBtn.hidden = state.age === "all" && state.subject === "all";
      emptyEl.hidden = shown !== 0;
    };

    ageChips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        state.age = chip.dataset.age;
        setActive(ageChips, "data-age", state.age);
        apply();
      });
    });
    subjectChips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        state.subject = chip.dataset.subject;
        setActive(subjectChips, "data-subject", state.subject);
        apply();
      });
    });
    resetBtn.addEventListener("click", function () {
      state.age = "all";
      state.subject = "all";
      setActive(ageChips, "data-age", "all");
      setActive(subjectChips, "data-subject", "all");
      apply();
    });

    document.querySelectorAll("[data-subject-link]").forEach(function (link) {
      link.addEventListener("click", function () {
        state.subject = link.dataset.subjectLink;
        state.age = "all";
        setActive(subjectChips, "data-subject", state.subject);
        setActive(ageChips, "data-age", "all");
        apply();
      });
    });

    grid.addEventListener("click", function (e) {
      var btn = e.target.closest(".btn-print");
      if (!btn) return;
      var note = btn.parentElement.querySelector(".ws-note");
      if (note) {
        note.innerHTML = "The printable PDF is being finished — it'll be here soon. " +
          "<a href=\"#newsletter\">Join the Sunday list</a> to hear when it's up.";
      }
    });
  }

  var isEmail = function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v); };

  var request = document.getElementById("request-form");
  if (request) {
    request.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = request.querySelector(".form-msg");
      var email = request.querySelector("#req-email");
      var idea = request.querySelector("#req-idea");
      var bad = [];
      [email, idea].forEach(function (f) { f.closest(".field").classList.remove("invalid"); f.removeAttribute("aria-invalid"); });
      if (!isEmail(email.value.trim())) bad.push(email);
      if (idea.value.trim().length < 3) bad.push(idea);
      if (bad.length) {
        bad.forEach(function (f) { f.closest(".field").classList.add("invalid"); f.setAttribute("aria-invalid", "true"); });
        msg.className = "form-msg err";
        msg.textContent = "Please add " + (bad.length === 2 ? "your email and what the sheet should practise." : bad[0] === email ? "a valid email address." : "a few words about the skill.");
        bad[0].focus();
        return;
      }
      var name = request.querySelector("#req-name").value.trim();
      msg.className = "form-msg ok";
      msg.textContent = "Thanks" + (name ? ", " + name : "") + "! Your request is on our list — we'll email you if we make it.";
      request.reset();
    });
  }

  var nl = document.getElementById("nl-form");
  if (nl) {
    nl.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = nl.querySelector("input[type=email]");
      var msg = nl.querySelector(".form-msg");
      if (!isEmail(input.value.trim())) {
        msg.className = "form-msg err";
        msg.textContent = "That email doesn't look quite right — mind checking it?";
        input.setAttribute("aria-invalid", "true");
        input.focus();
        return;
      }
      input.removeAttribute("aria-invalid");
      msg.className = "form-msg ok";
      msg.textContent = "You're on the list! See you Sunday.";
      nl.reset();
    });
  }
})();
