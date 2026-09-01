// PROJECT TABS
document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".project-tab");
    const views = document.querySelectorAll(".project-view");

    // SWITCH BETWEEN GALLERIES
    tabs.forEach(function (tab) {
        tab.addEventListener("click", function () {
            // GET THE SELECTED GALLERY
            const target =
                tab.getAttribute("data-target");

            // RESET ALL TABS
            tabs.forEach(function (item) {
                item.classList.remove("active");
            });

            // RESET ALL PROJECT VIEWS
            views.forEach(function (view) {
                view.classList.remove("active");
            });

            // ACTIVATE SELECTED TAB
            tab.classList.add("active");

            // SHOW SELECTED PROJECT VIEW
            const targetView =
                document.getElementById(target);

            if (targetView) {
                targetView.classList.add("active");
            }

            // UPDATE CATEGORY NAVIGATION VISIBILITY
            updateCategoryNavigationVisibility(target);

            // UPDATE TABLE OF CONTENT
            if (typeof updateTableOfContent === "function") {
                const language =
                    getCurrentLanguage();

                // CREATE LOCALIZED PROJECT DATA
                const localizedProjects =
                    projects.map(function (
                        project,
                        index
                    ) {
                        return {
                            ...project,
                            ...project.languages[language],
                            projectIndex: index
                        };
                    });

                // UPDATE TABLE OF CONTENT
                updateTableOfContent(
                    localizedProjects
                );
            }

            // RESET CATEGORY WHEN CATEGORY VIEW OPENS
            if (target === "category-view") {
                currentCategoryIndex = 0;

                setTimeout(function () {
                    if (
                        typeof updateCategoryNavigation ===
                        "function"
                    ) {
                        updateCategoryNavigation();
                    }

                    if (
                        typeof updateCategoryCarousel ===
                        "function"
                    ) {
                        updateCategoryCarousel(false);
                    }
                }, 50);
            }
        });
    });
});


// CATEGORY NAVIGATION VISIBILITY
function updateCategoryNavigationVisibility(target) {
    const navigation =
        document.querySelector(
            ".category-navigation"
        );

    if (!navigation) {
        return;
    }

    // SHOW CATEGORY NAVIGATION ONLY FOR CATEGORY VIEW
    if (target === "category-view") {
        navigation.classList.add("active");
    } else {
        navigation.classList.remove("active");
    }
}


// TABLE OF CONTENT SCROLLING
document.addEventListener("DOMContentLoaded", function () {
    const tocList =
        document.getElementById(
            "toc-project-list"
        );

    if (!tocList) {
        return;
    }

    // KEEP TABLE OF CONTENT SCROLLING INSIDE ITS OWN CONTAINER
    tocList.addEventListener(
        "wheel",
        function (event) {
            if (
                Math.abs(event.deltaY) >
                Math.abs(event.deltaX)
            ) {
                event.preventDefault();

                tocList.scrollTop +=
                    event.deltaY;
            }
        },
        { passive: false }
    );
});


// SMOOTH INTERNAL LINKS
document.addEventListener("DOMContentLoaded", function () {
    const links =
        document.querySelectorAll(
            'a[href^="#"]'
        );

    // SCROLL DOWN TO SELECTED LINK
    links.forEach(function (link) {
        link.addEventListener(
            "click",
            function (event) {
                // GET THE LINK TARGET
                const targetId =
                    link.getAttribute("href");

                if (
                    !targetId ||
                    targetId === "#"
                ) {
                    return;
                }

                // FIND THE TARGET ELEMENT
                const target =
                    document.querySelector(
                        targetId
                    );

                if (!target) {
                    return;
                }

                // SCROLL TO TARGET
                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        );
    });
});


// TABLE OF CONTENT CATEGORY LINKS
document.addEventListener(
    "click",
    function (event) {
        // CHECK IF IT IS A CATEGORY LINK
        const categoryLink =
            event.target.closest(
                ".toc-category"
            );

        if (!categoryLink) {
            return;
        }

        // GET THE CATEGORY TARGET
        const targetId =
            categoryLink.getAttribute("href");

        if (
            !targetId ||
            targetId === "#"
        ) {
            return;
        }

        // FIND THE CATEGORY
        const target =
            document.querySelector(
                targetId
            );

        if (!target) {
            return;
        }

        // MOVE CATEGORY INTO VIEW
        event.preventDefault();

        target.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }
);

// TABLE OF CONTENT INTERACTION
document.addEventListener("DOMContentLoaded", function () {
    const tocTrigger =
        document.getElementById(
            "toc-trigger"
        );

    const tableOfContent =
        document.querySelector(
            ".table-of-content"
        );

    const aboutSection =
        document.querySelector(
            ".about"
        );

    const projectPage =
        document.querySelector(
            ".project-page"
        );

    if (
        !tocTrigger ||
        !tableOfContent
    ) {
        return;
    }

    // OPEN TOC WHEN MOUSE APPROACHES THE TRIGGER
    tocTrigger.addEventListener(
        "mouseenter",
        function () {
            tableOfContent.classList.add(
                "toc-active"
            );

            if (aboutSection) {
                aboutSection.classList.add(
                    "toc-active"
                );
            }

            if (projectPage) {
                projectPage.classList.add(
                    "toc-active"
                );
            }
        }
    );

    // CLOSE TOC WHEN MOUSE LEAVES THE TRIGGER
    tocTrigger.addEventListener(
        "mouseleave",
        function () {
            if (
                tableOfContent.matches(
                    ":hover"
                )
            ) {
                return;
            }

            tableOfContent.classList.remove(
                "toc-active"
            );

            if (aboutSection) {
                aboutSection.classList.remove(
                    "toc-active"
                );
            }

            if (projectPage) {
                projectPage.classList.remove(
                    "toc-active"
                );
            }
        }
    );

    // KEEP TOC OPEN WHILE MOUSE IS OVER IT
    tableOfContent.addEventListener(
        "mouseenter",
        function () {
            tableOfContent.classList.add(
                "toc-active"
            );

            if (aboutSection) {
                aboutSection.classList.add(
                    "toc-active"
                );
            }

            if (projectPage) {
                projectPage.classList.add(
                    "toc-active"
                );
            }
        }
    );

    // CLOSE TOC WHEN MOUSE LEAVES IT
    tableOfContent.addEventListener(
        "mouseleave",
        function () {
            tableOfContent.classList.remove(
                "toc-active"
            );

            if (aboutSection) {
                aboutSection.classList.remove(
                    "toc-active"
                );
            }

            if (projectPage) {
                projectPage.classList.remove(
                    "toc-active"
                );
            }
        }
    );

    // SHOW TOC WHILE SCROLLING
    let tocScrollTimer;

    window.addEventListener(
        "scroll",
        function () {
            // SHOW TOC
            tableOfContent.classList.add(
                "toc-active"
            );

            if (aboutSection) {
                aboutSection.classList.add(
                    "toc-active"
                );
            }

            if (projectPage) {
                projectPage.classList.add(
                    "toc-active"
                );
            }

            // RESET THE HIDE TIMER
            clearTimeout(
                tocScrollTimer
            );

            // HIDE TOC AFTER SCROLLING STOPS
            tocScrollTimer =
                setTimeout(
                    function () {
                        tableOfContent.classList.remove(
                            "toc-active"
                        );

                        if (aboutSection) {
                            aboutSection.classList.remove(
                                "toc-active"
                            );
                        }

                        if (projectPage) {
                            projectPage.classList.remove(
                                "toc-active"
                            );
                        }
                    },
                    800
                );
        },
        { passive: true }
    );
});