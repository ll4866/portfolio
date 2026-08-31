
// PROJECT TABS
document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".project-tab");
    const views = document.querySelectorAll(".project-view");

    tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
            const target = tab.getAttribute("data-target");

            tabs.forEach(function (item) {
                item.classList.remove("active");
            });

            views.forEach(function (view) {
                view.classList.remove("active");
            });

            tab.classList.add("active");

            const targetView = document.getElementById(target);

            if (targetView) {
                targetView.classList.add("active");
            }

            // Update table of contents
            if (typeof updateTableOfContent === "function") {
                const language =
                    getCurrentLanguage();

                const localizedProjects =
                    projects.map(
                        function (
                            project,
                            index
                        ) {
                            return {
                                ...project,
                                ...project.languages[language],
                                projectIndex: index
                            };
                        }
                    );

                updateTableOfContent(
                    localizedProjects
                );
            }
        });
    });
});

// CATEGORY SCROLLING
document.addEventListener(
    "DOMContentLoaded",
    function () {
        const scrollAreas =
            document.querySelectorAll(
                ".category-list"
            );

        scrollAreas.forEach(
            function (scrollArea) {
                scrollArea.addEventListener(
                    "wheel",
                    function (event) {
                        if (
                            Math.abs(event.deltaY) >
                            Math.abs(event.deltaX)
                        ) {
                            event.preventDefault();

                            scrollArea.scrollLeft +=
                                event.deltaY;
                        }
                    },
                    {
                        passive: false
                    }
                );
            }
        );
    }
);

// TABLE OF CONTENT SCROLLING
document.addEventListener("DOMContentLoaded", function () {
    const tocList = document.getElementById("toc-project-list");

    if (!tocList) {
        return;
    }

    tocList.addEventListener(
        "wheel",
        function (event) {
            if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
                event.preventDefault();
                tocList.scrollTop += event.deltaY;
            }
        },
        {
            passive: false
        }
    );
});

// SMOOTH INTERNAL LINKS
document.addEventListener("DOMContentLoaded", function () {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(function (link) {
        link.addEventListener("click", function (event) {
            const targetId = link.getAttribute("href");

            if (!targetId || targetId === "#") {
                return;
            }

            const target = document.querySelector(targetId);

            if (!target) {
                return;
            }

            event.preventDefault();

            target.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    });
});

// TABLE OF CONTENT CATEGORY LINKS
document.addEventListener("click", function (event) {
    const categoryLink = event.target.closest(".toc-category");

    if (!categoryLink) {
        return;
    }

    const targetId = categoryLink.getAttribute("href");

    if (!targetId || targetId === "#") {
        return;
    }

    const target = document.querySelector(targetId);

    if (!target) {
        return;
    }

    event.preventDefault();

    target.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
});

/* Table of content interaction */
const tocTrigger = document.getElementById('toc-trigger');
const tableOfContent = document.querySelector('.table-of-content');
const aboutSection = document.querySelector('.about');
const projectPage = document.querySelector('.project-page');

if (tocTrigger) {
    tocTrigger.addEventListener('mouseenter', () => {
        tableOfContent?.classList.add('toc-active');
        aboutSection?.classList.add('toc-active');
        projectPage?.classList.add('toc-active');
    });

    tocTrigger.addEventListener('mouseleave', (event) => {
        if (
            tableOfContent &&
            tableOfContent.matches(':hover')
        ) {
            return;
        }

        tableOfContent?.classList.remove('toc-active');
        aboutSection?.classList.remove('toc-active');
        projectPage?.classList.remove('toc-active');
    });
}

if (tableOfContent) {
    tableOfContent.addEventListener('mouseenter', () => {
        tableOfContent.classList.add('toc-active');
        aboutSection?.classList.add('toc-active');
        projectPage?.classList.add('toc-active');
    });

    tableOfContent.addEventListener('mouseleave', () => {
        tableOfContent.classList.remove('toc-active');
        aboutSection?.classList.remove('toc-active');
        projectPage?.classList.remove('toc-active');
    });
}