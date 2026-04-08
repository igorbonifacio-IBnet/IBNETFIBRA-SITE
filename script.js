const whatsappNumber = "556230302741";
const hamburger = document.querySelector(".hamburger");
const navPanel = document.querySelector(".nav-panel");
const currentYear = document.getElementById("currentYear");
const contactForm = document.getElementById("contactForm");
const interactivePanel = document.querySelector("[data-interactive-panel]");
const coverageCard = document.querySelector("[data-coverage-card]");
const coverageToggle = document.querySelector("[data-coverage-toggle]");
const blogSearch = document.getElementById("blogSearch");
const blogCards = [...document.querySelectorAll(".blog-card[data-category]")];
const blogFilters = [...document.querySelectorAll("[data-blog-filter]")];
const blogEmptyState = document.getElementById("blogEmptyState");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

if (hamburger && navPanel) {
    hamburger.onclick = () => {
        const isOpen = hamburger.classList.toggle("active");
        navPanel.classList.toggle("active");
        document.body.classList.toggle("menu-open");
        hamburger.setAttribute("aria-expanded", isOpen ? "true" : "false");
    };

    document.querySelectorAll(".nav-link").forEach((link) => {
        link.onclick = () => {
            navPanel.classList.remove("active");
            hamburger.classList.remove("active");
            hamburger.setAttribute("aria-expanded", "false");
            document.body.classList.remove("menu-open");
        };
    });
}

document.querySelectorAll(".faq-question").forEach((question) => {
    question.onclick = () => {
        const item = question.closest(".faq-item");
        const shouldOpen = item && !item.classList.contains("active");

        document.querySelectorAll(".faq-item").forEach((faqItem) => {
            faqItem.classList.remove("active");
        });

        if (item && shouldOpen) {
            item.classList.add("active");
        }
    };
});

if (contactForm) {
    contactForm.onsubmit = (event) => {
        event.preventDefault();

        const formData = new FormData(contactForm);
        const message =
            "Olá! Quero atendimento da IBnet Telecom.\n\n" +
            "Nome: " + (formData.get("name") || "") + "\n" +
            "Telefone: " + (formData.get("phone") || "") + "\n" +
            "E-mail: " + (formData.get("email") || "") + "\n" +
            "Interesse: " + (formData.get("plan") || "") + "\n" +
            "Mensagem: " + (formData.get("message") || "");

        window.open(
            "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(message),
            "_blank"
        );
    };
}

document.querySelectorAll(".js-plan-cta").forEach((button) => {
    button.onclick = (event) => {
        event.preventDefault();

        const planName = button.dataset.plan || "plano da IBnet Telecom";
        const message = "Olá! Tenho interesse no " + planName + ".";

        window.open(
            "https://wa.me/" + whatsappNumber + "?text=" + encodeURIComponent(message),
            "_blank"
        );
    };
});

if (interactivePanel) {
    interactivePanel.onmousemove = null;
    interactivePanel.onmouseleave = null;
    interactivePanel.style.transform = "none";
}

if (coverageCard && coverageToggle) {
    const setCoverageCardCollapsed = (shouldCollapse) => {
        coverageCard.classList.toggle("is-collapsed", shouldCollapse);
        coverageToggle.textContent = shouldCollapse ? "+" : "-";
        coverageToggle.setAttribute("aria-expanded", shouldCollapse ? "false" : "true");
        coverageToggle.setAttribute(
            "aria-label",
            shouldCollapse ? "Expandir informacoes do mapa" : "Minimizar informacoes do mapa"
        );
    };

    setCoverageCardCollapsed(false);

    coverageToggle.addEventListener("click", () => {
        setCoverageCardCollapsed(!coverageCard.classList.contains("is-collapsed"));
    });
}

let activeCategory = "all";

function filterBlogCards() {
    if (!blogCards.length) {
        return;
    }

    const term = (blogSearch && blogSearch.value ? blogSearch.value : "").trim().toLowerCase();
    let visibleCount = 0;

    blogCards.forEach((card) => {
        const haystack = ((card.dataset.title || "") + " " + (card.dataset.keywords || "")).toLowerCase();
        const matchesCategory = activeCategory === "all" || card.dataset.category === activeCategory;
        const matchesTerm = !term || haystack.includes(term);
        const shouldShow = matchesCategory && matchesTerm;

        card.hidden = !shouldShow;

        if (shouldShow) {
            visibleCount += 1;
        }
    });

    if (blogEmptyState) {
        blogEmptyState.hidden = visibleCount !== 0;
    }
}

if (blogSearch) {
    blogSearch.addEventListener("input", filterBlogCards);
}

blogFilters.forEach((button) => {
    button.addEventListener("click", () => {
        activeCategory = button.dataset.blogFilter || "all";

        blogFilters.forEach((filterButton) => {
            filterButton.classList.remove("active");
        });

        button.classList.add("active");
        filterBlogCards();
    });
});

filterBlogCards();
