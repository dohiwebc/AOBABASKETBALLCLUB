(() => {
  /* ---------- Mobile nav ---------- */
  const header = document.getElementById("header");
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("globalNav");

  if (header && toggle && nav) {
    const closeNav = () => {
      header.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "メニューを開く");
      document.body.style.overflow = "";
    };

    const openNav = () => {
      header.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "メニューを閉じる");
      document.body.style.overflow = "hidden";
    };

    toggle.addEventListener("click", () => {
      if (header.classList.contains("is-open")) {
        closeNav();
      } else {
        openNav();
      }
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeNav();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 768) closeNav();
    });

    /* スクロール後はヘッダーを紙色の固定バーに */
    const onScroll = () => {
      if (window.scrollY > 40) {
        header.classList.add("is-scrolled");
      } else {
        header.classList.remove("is-scrolled");
      }
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  /* ---------- Scroll reveal ---------- */
  const revealTargets = document.querySelectorAll(
    ".about__grid, .activity__main, .schedule__panel, .join__top, .steps, .join__terms, .record__panel, .contact__grid"
  );

  revealTargets.forEach((el) => el.classList.add("reveal"));

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    revealTargets.forEach((el) => observer.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Contact form ---------- */
  const form = document.getElementById("contactForm");
  const success = document.getElementById("formSuccess");

  if (!form) return;

  const fields = {
    name: form.querySelector("#name"),
    email: form.querySelector("#email"),
    type: form.querySelector("#type"),
    message: form.querySelector("#message"),
    privacy: form.querySelector("#privacy"),
  };

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const setError = (key, message) => {
    const errorEl = form.querySelector(`[data-error-for="${key}"]`);
    const field = fields[key];
    if (errorEl) errorEl.textContent = message || "";
    if (field && field.type !== "checkbox") {
      field.classList.toggle("is-invalid", Boolean(message));
    }
  };

  const clearErrors = () => {
    Object.keys(fields).forEach((key) => setError(key, ""));
    if (success) success.hidden = true;
  };

  const validate = () => {
    let ok = true;
    clearErrors();

    if (!fields.name.value.trim()) {
      setError("name", "お名前を入力してください。");
      ok = false;
    }

    const email = fields.email.value.trim();
    if (!email) {
      setError("email", "メールアドレスを入力してください。");
      ok = false;
    } else if (!emailPattern.test(email)) {
      setError("email", "正しいメールアドレスを入力してください。");
      ok = false;
    }

    if (!fields.type.value) {
      setError("type", "お問い合わせ種別を選択してください。");
      ok = false;
    }

    if (!fields.privacy.checked) {
      setError("privacy", "内容をご確認のうえ、チェックしてください。");
      ok = false;
    }

    return ok;
  };

  ["name", "email", "type", "message"].forEach((key) => {
    fields[key].addEventListener("input", () => setError(key, ""));
    fields[key].addEventListener("change", () => setError(key, ""));
  });

  fields.privacy.addEventListener("change", () => setError("privacy", ""));

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!validate()) {
      const firstInvalid = form.querySelector(".is-invalid");
      firstInvalid?.focus();
      return;
    }

    if (success) {
      success.hidden = false;
      success.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }

    form.reset();
  });
})();
