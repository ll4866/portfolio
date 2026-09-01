
// PROJECT TABS
document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".project-tab");
    const views = document.querySelectorAll(".project-view");

    // SWITCH BETWEEEN GALLERIES
    tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
            // VISUALIZE SELECTED GALLERY
            const target = tab.getAttribute("data-target");

            // RESET ALL TABS BEFORE ACTIVATING THE SELECTED ONE
            tabs.forEach(function (item) {
                item.classList.remove("active");
            });

            // RESET ALL PROJECTS VIEWS BEFORE SHOWING THE SELECTED ONE
            views.forEach(function (view) {
                view.classList.remove("active");
            });

            // HIGHLIGHT SELECTED TAB
            tab.classList.add("active");
            const targetView = document.getElementById(target);
            if (targetView) {
                targetView.classList.add("active");
            }

            // UPDATE THE TABLE OF CONTENT TO MATCH GALLERY
            if (typeof updateTableOfContent === "function") {
                const language = getCurrentLanguage();

                // CREATE EACH PROJECT
                const localizedProjects =
                    projects.map( function ( project, index) {
                        return {
                            ...project,
                            ...project.languages[language],
                            projectIndex: index
                        };
                    });

                // UPDATE THE TABLE OF CONTENT PROJECTS
                updateTableOfContent(localizedProjects);
            }
        });
    });
});

// CATEGORY SCROLLING
document.addEventListener("DOMContentLoaded", function () {
    const scrollAreas = document.querySelectorAll(".category-list");

    // ALLOW MOUSE TO CONTROL HORIZONTAL CATEGORY
    scrollAreas.forEach( function (scrollArea) {
        scrollArea.addEventListener("wheel", function (event) {
            if ( Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
                event.preventDefault();  
                scrollArea.scrollLeft += event.deltaY;
            }
        },
        { passive: false });
    });
});

// TABLE OF CONTENT SCROLLING
document.addEventListener("DOMContentLoaded", function () {
    const tocList = document.getElementById("toc-project-list");

    // KEEP TABLE OF CONTENT SCROLLING INSIDE ITS OWN CONTAINER
    tocList.addEventListener("wheel", function (event) {
        if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
            event.preventDefault();
            tocList.scrollTop += event.deltaY;
        }
    },
    { passive: false });
});

// SMOOTH INTERNAL LINKS
document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll('a[href^="#"]');

    // SCROLL DOWN TO SELECTED LINK
    links.forEach(function (link) {
        link.addEventListener("click", function (event) {
            // LOCATION THE LINK LEADS TO
            const targetId = link.getAttribute("href");
            if (!targetId || targetId === "#") {
                return;
            }

            // FIND THE SECTION LINK DIRECTS TO
            const target = document.querySelector(targetId);
            if (!target) {
                return;
            }

            // SCROLL TO TARGET
            event.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start"});
        });
    });
});

// TABLE OF CONTENT CATEGORY LINKS
document.addEventListener("click", function (event) {
    // CHECK IF IT IS CATEGORY LINK
    const categoryLink = event.target.closest(".toc-category");
    if (!categoryLink) {
        return;
    }

    // GET THE CATEGROY SECTION THE LINK LEADS TO
    const targetId = categoryLink.getAttribute("href");
    if (!targetId || targetId === "#") {
        return;
    }

    // FIND THE CATEGORY SECTION ON THE PAGE
    const target = document.querySelector(targetId);
    if (!target) {
        return;
    }

    // SMOOTH MOVE TO CATEGORY SECTION
    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "center"});
});

// TABLE OF CONTENT INTERACTION
const tocTrigger = document.getElementById('toc-trigger');
const tableOfContent = document.querySelector('.table-of-content');
const aboutSection = document.querySelector('.about');
const projectPage = document.querySelector('.project-page');

// OPEN TOC WHEN HOVERING OVER THE TRIGGER
tocTrigger.addEventListener('mouseenter', function() {
    tableOfContent.classList.add('toc-active');
    aboutSection.classList.add('toc-active');
    projectPage.classList.add('toc-active');
});

// CLOSE TOC WHEN LEAVING THE TRIGGER
tocTrigger.addEventListener('mouseleave', function() {
    if (tableOfContent.matches(':hover')) {
        return;
    }
    tableOfContent.classList.remove('toc-active');
    aboutSection.classList.remove('toc-active');
    projectPage.classList.remove('toc-active');
});

// KEEP TOC OPEN WHILE HOVERING OVER IT
tableOfContent.addEventListener('mouseenter', function() {
    tableOfContent.classList.add('toc-active');
    aboutSection.classList.add('toc-active');
    projectPage.classList.add('toc-active');
});

// CLOSE TOC WHEN LEAVING IT
tableOfContent.addEventListener('mouseleave', function() {
    tableOfContent.classList.remove('toc-active');
    aboutSection.classList.remove('toc-active');
    projectPage.classList.remove('toc-active');
});

// SHOW TABLE OF CONTENT WHILE SCROLLING
let tocScrollTimer;
window.addEventListener("scroll", function () {
    // SHOW THE TOC WHILE THE PAGE IS MOVING
    tableOfContent.classList.add("toc-active");
    aboutSection.classList.add("toc-active");
    projectPage.classList.add("toc-active");

    // RESET THE HIDE TIMER AFTER EACH SCROLL EVENT
    clearTimeout(tocScrollTimer);

    // HIDE THE TOC AFTER SCROLLING STOPS
    tocScrollTimer = setTimeout(function () {
        tableOfContent.classList.remove("toc-active");
        aboutSection.classList.remove("toc-active");
        projectPage.classList.remove("toc-active");
    }, 800);
}, { passive: true });