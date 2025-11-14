  // ===== Scroll reveal =====
  const revealEls = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  revealEls.forEach((el) => revealObserver.observe(el));

  // ===== Modal logic =====
  const backdrop = document.getElementById("modalBackdrop");
  const modalTitle = document.getElementById("modalTitle");
  const modalSubtitle = document.getElementById("modalSubtitle");
  const requestTypeInput = document.getElementById("requestType");
  const modalCloseBtn = backdrop.querySelector(".modal-close");

  function openModal(type) {
    if (type === "price") {
      modalTitle.textContent = "Получить прайс";
      modalSubtitle.textContent =
        "Оставьте контакты, и мы отправим вам актуальный прайс и предложим варианты поставок под ваш формат.";
      requestTypeInput.value = "price";
    } else {
      modalTitle.textContent = "Оставить заявку";
      modalSubtitle.textContent =
        "Расскажите о своём формате и задачах — подготовим предложение по ассортименту и условиям поставок.";
      requestTypeInput.value = "consult";
    }
    backdrop.classList.add("visible");
    backdrop.setAttribute("aria-hidden", "false");
  }

  function closeModal() {
    backdrop.classList.remove("visible");
    backdrop.setAttribute("aria-hidden", "true");
  }

  document.querySelectorAll("[data-open-modal]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const type = e.currentTarget.getAttribute("data-open-modal");
      openModal(type);
    });
  });

  modalCloseBtn.addEventListener("click", closeModal);
  backdrop.addEventListener("click", (e) => {
    if (e.target === backdrop) {
      closeModal();
    }
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });

  // ===== Main form validation (front only) =====
  const requestForm = document.getElementById("requestForm");
  const statusEl = document.getElementById("formStatus");

  function setError(name, message) {
    const field = requestForm.querySelector('[name="' + name + '"]');
    const err = requestForm.querySelector('[data-error-for="' + name + '"]');
    if (!field || !err) return;
    if (message) {
      field.classList.add("input-error");
      err.textContent = message;
    } else {
      field.classList.remove("input-error");
      err.textContent = "";
    }
  }

  requestForm.addEventListener("submit", (e) => {
    e.preventDefault();
    statusEl.style.display = "none";

    const data = Object.fromEntries(new FormData(requestForm).entries());
    let valid = true;

    if (!data.name || data.name.trim().length < 2) {
      setError("name", "Укажите имя контактного лица.");
      valid = false;
    } else setError("name");

    if (!data.phone || data.phone.replace(/\D/g, "").length < 10) {
      setError("phone", "Укажите корректный номер телефона.");
      valid = false;
    } else setError("phone");

    if (!data.company || data.company.trim().length < 2) {
      setError("company", "Укажите название компании.");
      valid = false;
    } else setError("company");

    if (!document.getElementById("consent").checked) {
      alert("Необходимо согласиться с обработкой персональных данных.");
      valid = false;
    }

    if (!valid) return;

    // Здесь вместо console.log можно повесить отправку на ваш backend (fetch/XHR)
    console.log("Request form data:", data);

    statusEl.style.display = "block";
    requestForm.reset();
  });

  // ===== Inline contact form (нижняя короткая) =====
  const inlineForm = document.getElementById("inlineContactForm");
  const inlineStatus = document.getElementById("inlineFormStatus");

  inlineForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(inlineForm).entries());
    console.log("Inline contact form:", data);
    inlineStatus.textContent = "Заявка отправлена. Мы свяжемся с вами.";
    inlineForm.reset();
  });