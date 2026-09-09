/**
 * Octen Search API Interactive Experience (main.js)
 * Implements Navbar transition, API Explorer controls, Code Copy, and Accordion
 */

document.addEventListener("DOMContentLoaded", () => {
  // 1. Dynamic Header Navigation on Scroll
  const headerNav = document.querySelector(".header-nav-exact") || document.querySelector(".header-nav");
  if (headerNav) {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        headerNav.classList.add("scrolled");
      } else {
        headerNav.classList.remove("scrolled");
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Initial check
  }

  // Helper: Simple JSON & cURL Syntax Highlighter
  function highlightCode(code, type) {
    if (type === "json") {
      return code
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
          let cls = 'k-num';
          if (/^"/.test(match)) {
            if (/:$/.test(match)) {
              cls = 'k-key';
            } else {
              cls = 'k-str';
            }
          } else if (/true|false/.test(match)) {
            cls = 'k-num';
          }
          return `<span class="${cls}">${match}</span>`;
        });
    } else {
      // cURL string highlight
      return code
        .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        .replace(/"([^"\\]|\\.)*"/g, '<span class="k-str">$&</span>')
        .replace(/#.*$/gm, '<span class="k-cm">$&</span>');
    }
  }

  // 2. Four APIs Sticky Scrollytelling Controller (x.ai/grok style)
  const scrollySteps = document.querySelectorAll('.endpoints-api-step');
  const scrollySlots = document.querySelectorAll('.sticky-graphic-slot');
  let activeStepIndex = 0;

  function setScrollyActive(index) {
    if (index === activeStepIndex) return;
    activeStepIndex = index;

    scrollySteps.forEach((step, i) => {
      step.classList.toggle('is-active', i === index);
    });

    scrollySlots.forEach((slot, i) => {
      slot.classList.toggle('active', i === index);
    });
  }

  if (scrollySteps.length > 0) {
    // 1. Scroll-spy tracking using viewport middle target
    const updateScrollySpy = () => {
      const viewportTarget = window.innerHeight * 0.45;
      let closestIndex = 0;
      let minDistance = Infinity;

      scrollySteps.forEach((step, i) => {
        const rect = step.getBoundingClientRect();
        const stepCenter = rect.top + rect.height * 0.5;
        const distance = Math.abs(stepCenter - viewportTarget);
        if (distance < minDistance) {
          minDistance = distance;
          closestIndex = i;
        }
      });

      setScrollyActive(closestIndex);
    };

    window.addEventListener('scroll', updateScrollySpy, { passive: true });
    window.addEventListener('resize', updateScrollySpy, { passive: true });
    updateScrollySpy(); // Initial check

    // 2. Click to navigate & activate step
    scrollySteps.forEach(step => {
      step.addEventListener('click', () => {
        const idx = parseInt(step.dataset.apiIndex, 10);
        if (!isNaN(idx)) {
          setScrollyActive(idx);
          step.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });
  }

  // 3. FAQ Accordion Logic (Mutually exclusive: only one open at a time)
  const faqCards = document.querySelectorAll(".faq-card");
  faqCards.forEach(card => {
    const btn = card.querySelector(".faq-btn");
    const grid = card.querySelector(".accordion-grid");
    if (!btn || !grid) return;

    btn.addEventListener("click", () => {
      const isOpen = card.classList.contains("open");

      // Close all other cards first (mutually exclusive)
      faqCards.forEach(c => {
        c.classList.remove("open");
        c.querySelector(".accordion-grid")?.classList.remove("open");
        c.querySelector(".faq-btn")?.setAttribute("aria-expanded", "false");
      });

      // If this card was closed, expand it
      if (!isOpen) {
        card.classList.add("open");
        grid.classList.add("open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  // 4. Smooth Anchor Scrolling for nav links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    // Exclude dropdown trigger since it manages menu expansion
    if (anchor.classList.contains("nav-dropdown-trigger")) return;
    
    anchor.addEventListener("click", function(e) {
      const href = this.getAttribute("href");
      if (href === "#" || !href) return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // 5. Products Navigation Dropdown (Figma Node 13569:7315)
  const productDropdown = document.querySelector(".nav-item-dropdown");
  if (productDropdown) {
    const trigger = productDropdown.querySelector(".nav-dropdown-trigger");

    const toggleDropdown = (open) => {
      const willOpen = typeof open === "boolean" ? open : !productDropdown.classList.contains("is-open");
      productDropdown.classList.toggle("is-open", willOpen);
      if (trigger) {
        trigger.setAttribute("aria-expanded", willOpen ? "true" : "false");
      }
    };

    if (trigger) {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        toggleDropdown();
      });
    }

    // Dismiss on click outside
    document.addEventListener("click", (e) => {
      if (!productDropdown.contains(e.target)) {
        toggleDropdown(false);
      }
    });

    // Dismiss on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && productDropdown.classList.contains("is-open")) {
        toggleDropdown(false);
        trigger?.focus();
      }
    });

    // Product menu navigation & tab switching
    const productLinks = productDropdown.querySelectorAll(".nav-product-link");

    productLinks.forEach(item => {
      // Click to navigate / trigger category
      item.addEventListener("click", (e) => {
        const product = item.dataset.product;
        toggleDropdown(false);

        if (product) {
          const targetTab = document.querySelector(`.api-tab-btn[data-category="${product}"]`);
          if (targetTab) {
            targetTab.click();
          }
          const endpointsSection = document.getElementById("endpoints");
          if (endpointsSection) {
            e.preventDefault();
            endpointsSection.scrollIntoView({ behavior: "smooth" });
          }
        }
      });
    });
  }

  // 6. Hero Primary Button Hover: Highlight Credit Note
  const heroPrimaryBtn = document.querySelector(".btn-hero-primary");
  const heroCreditNote = document.querySelector(".hero-credit-note");
  if (heroPrimaryBtn && heroCreditNote) {
    heroPrimaryBtn.addEventListener("mouseenter", () => heroCreditNote.classList.add("is-highlighted"));
    heroPrimaryBtn.addEventListener("mouseleave", () => heroCreditNote.classList.remove("is-highlighted"));
  }

  // 7. Production-grade Performance Metrics (No Parallax)
  const performanceSection = document.getElementById("performance");
  const metricsUnified = document.querySelector(".metrics-overview-unified");

  if (performanceSection && metricsUnified) {
    const triggerNumbers = () => {
      const numberFlows = metricsUnified.querySelectorAll("number-flow[data-target-value]");
      numberFlows.forEach(nf => {
        const targetVal = nf.getAttribute("data-target-value");
        if (targetVal !== null) {
          const num = parseFloat(targetVal);
          if (!isNaN(num)) {
            nf.value = num;
          }
        }
      });
    };

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            triggerNumbers();
            observer.disconnect();
          }
        });
      }, { threshold: 0.15 });
      observer.observe(performanceSection);
    } else {
      triggerNumbers();
    }
  }

});

