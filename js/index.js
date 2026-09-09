(function () {
  "use strict";

  function initNavigation() {
    var menuButton = document.querySelector(".mobile-menu-button");
    var navigation = document.querySelector(".desktop-navigation");
    var links;
    var i;

    if (!menuButton || !navigation) {
      return;
    }

    links = navigation.querySelectorAll("a");

    function closeMenu() {
      navigation.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
      document.body.classList.remove("is-menu-open");
    }

    menuButton.addEventListener("click", function () {
      var isOpen = navigation.classList.toggle("is-open");
      menuButton.setAttribute("aria-expanded", isOpen ? "true" : "false");
      document.body.classList.toggle("is-menu-open", isOpen);
    });

    for (i = 0; i < links.length; i += 1) {
      links[i].addEventListener("click", closeMenu);
    }

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" || event.keyCode === 27) {
        closeMenu();
      }
    });
  }

  function initAnalytics() {
    var links = document.querySelectorAll("[data-analytics-name]");
    var i;

    window.dataLayer = window.dataLayer || [];

    for (i = 0; i < links.length; i += 1) {
      links[i].addEventListener("click", function () {
        window.dataLayer.push({
          event: "anchor_point_click",
          link_name: this.getAttribute("data-analytics-name"),
          destination: this.getAttribute("href")
        });
      });
    }
  }

  function initTabs() {
    var tabList = document.querySelector(".tab-list");
    var tabs;
    var i;

    if (!tabList) {
      return;
    }

    tabs = tabList.querySelectorAll('[role="tab"]');

    function activateTab(tab) {
      var panelId = tab.getAttribute("aria-controls");
      var panel = document.getElementById(panelId);
      var tabIndex;
      var currentPanel;

      for (tabIndex = 0; tabIndex < tabs.length; tabIndex += 1) {
        currentPanel = document.getElementById(tabs[tabIndex].getAttribute("aria-controls"));
        tabs[tabIndex].setAttribute("aria-selected", tabs[tabIndex] === tab ? "true" : "false");
        tabs[tabIndex].tabIndex = tabs[tabIndex] === tab ? 0 : -1;
        if (currentPanel) {
          currentPanel.hidden = tabs[tabIndex] !== tab;
        }
      }

      if (panel) {
        panel.hidden = false;
      }
    }

    function focusTab(index) {
      if (index < 0) {
        index = tabs.length - 1;
      }
      if (index >= tabs.length) {
        index = 0;
      }
      tabs[index].focus();
      activateTab(tabs[index]);
    }

    for (i = 0; i < tabs.length; i += 1) {
      (function (tab) {
        tab.tabIndex = tab.getAttribute("aria-selected") === "true" ? 0 : -1;
        tab.addEventListener("click", function () {
          activateTab(tab);
        });
        tab.addEventListener("keydown", function (event) {
          var key = event.key || event.keyCode;
          var currentIndex = Array.prototype.indexOf.call(tabs, tab);

          if (key === "ArrowLeft" || key === 37) {
            event.preventDefault();
            focusTab(currentIndex - 1);
          } else if (key === "ArrowRight" || key === 39) {
            event.preventDefault();
            focusTab(currentIndex + 1);
          } else if (key === "Home" || key === 36) {
            event.preventDefault();
            focusTab(0);
          } else if (key === "End" || key === 35) {
            event.preventDefault();
            focusTab(tabs.length - 1);
          } else if (key === "Enter" || key === " " || key === 13 || key === 32) {
            event.preventDefault();
            activateTab(tab);
          }
        });
      }(tabs[i]));
    }
  }

  function initProjectCarousel() {
    var prevBtn = document.querySelector(".carousel-prev");
    var nextBtn = document.querySelector(".carousel-next");
    var dotsWrap = document.querySelector(".carousel-dots");
    var track = document.querySelector(".carousel-track");
    var dots;
    var currentIndex = 0;
    var totalSlides = 3;
    var i;

    if (!prevBtn || !nextBtn || !dotsWrap || !track) {
      return;
    }

    dots = dotsWrap.querySelectorAll(".carousel-dot");

    function applySlide(index) {
      currentIndex = (index + totalSlides) % totalSlides;
      for (i = 0; i < dots.length; i += 1) {
        dots[i].classList.toggle("carousel-dot-active", i === currentIndex);
        dots[i].setAttribute("aria-selected", i === currentIndex ? "true" : "false");
      }
      track.style.transform = "translateX(" + (-100 * currentIndex) + "%)";
    }

    for (i = 0; i < dots.length; i += 1) {
      (function (dot, idx) {
        dot.addEventListener("click", function () {
          applySlide(idx);
        });
      }(dots[i], i));
    }

    prevBtn.addEventListener("click", function () {
      applySlide(currentIndex - 1);
    });

    nextBtn.addEventListener("click", function () {
      applySlide(currentIndex + 1);
    });
  }

  function init() {
    initNavigation();
    initTabs();
    initProjectCarousel();
    initAnalytics();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
}());
