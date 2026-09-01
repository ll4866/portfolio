// TABLE OF CONTENT
function updateTableOfContent(localizedProjects) {
    // SELECT THE TABLE OF CONTENT LIST
    const container =
        document.getElementById(
            "toc-project-list"
        );

    if (!container) {
        return;
    }

    // FIND THE CURRENT PROJECT TAB VISIBLE
    const activeTab =
        document.querySelector(
            ".project-tab.active"
        );

    if (!activeTab) {
        return;
    }

    const target =
        activeTab.getAttribute(
            "data-target"
        );

    // SELECT THE TABLE OF CONTENT
    const tableOfContent =
        document.querySelector(
            ".table-of-content"
        );

    // UPDATE TABLE OF CONTENT CATEGORY STATE
    if (tableOfContent) {
        if (target === "category-view") {
            tableOfContent.classList.add(
                "category-active"
            );
        } else {
            tableOfContent.classList.remove(
                "category-active"
            );
        }
    }

    // CLEAR CURRENT TOC PROJECTS
    container.innerHTML = "";

    // FAVORITES GALLERY
    if (target === "favorites-view") {
        // GET ONLY THE PROJECTS SHOWN ON THE CURRENT PAGE
        const start =
            currentFavoritePage *
            FAVORITE_PROJECTS_PER_PAGE;

        const end =
            start +
            FAVORITE_PROJECTS_PER_PAGE;

        const visibleProjects =
            localizedProjects.slice(
                start,
                end
            );

        // CREATE TOC LINK FOR EACH PROJECT
        visibleProjects.forEach(
            function (project) {
                const link =
                    document.createElement(
                        "a"
                    );

                link.className =
                    "toc-project";

                link.href =
                    `#favorite-project-${project.projectIndex}`;

                link.dataset.projectIndex =
                    project.projectIndex;

                link.innerHTML = `
                    <span class="toc-number">
                        ${String(
                            project.projectIndex + 1
                        ).padStart(2, "0")}
                    </span>

                    <span class="toc-title">
                        ${project.title}
                    </span>
                `;

                container.appendChild(
                    link
                );
            }
        );

        return;
    }

    // CATEGORY GALLERY
    if (target === "category-view") {
        // CATEGORY NAVIGATION IS ALREADY DISPLAYED ABOVE THE GALLERY
        // DO NOT DUPLICATE CATEGORY LINKS INSIDE THE TOC
        return;
    }

    // TIMELINE GALLERY
    if (target === "timeline-view") {
        // SORT PROJECTS BY END DATE
        const sortedProjects =
            [...localizedProjects]
                .sort(function (a, b) {
                    return (
                        createProjectDate(
                            b.endDate
                        ) -
                        createProjectDate(
                            a.endDate
                        )
                    );
                });

        // CREATE TOC LINK FOR EACH PROJECT
        sortedProjects.forEach(
            function (project) {
                const link =
                    document.createElement(
                        "a"
                    );

                link.className =
                    "toc-project";

                link.href =
                    `#timeline-project-${project.projectIndex}`;

                link.dataset.projectIndex =
                    project.projectIndex;

                link.textContent =
                    project.title;

                container.appendChild(
                    link
                );
            }
        );
    }
}
// UPDATE TABLE OF CONTENTS AFTER TAB CHANGE
document.addEventListener(
    "DOMContentLoaded",
    function () {
        const tabs =
            document.querySelectorAll(
                ".project-tab"
            );

        tabs.forEach(
            function (tab) {
                tab.addEventListener(
                    "click",
                    function () {
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
                                        ...project.languages[
                                            language
                                        ],
                                        projectIndex:
                                            index
                                    };
                                }
                            );

                        updateTableOfContent(
                            localizedProjects
                        );
                    }
                );
            }
        );
    }
);


// TABLE OF CONTENT SCROLL SYNC
function initializeTableOfContentScroll() {
    const toc =
        document.querySelector(
            ".table-of-content"
        );

    if (!toc) {
        return;
    }

    let ticking = false;

    // HIGHLIGHT THE PROJECT VISIBLE
    function updateActiveProject() {
        const activeTab =
            document.querySelector(
                ".project-tab.active"
            );

        if (!activeTab) {
            ticking = false;
            return;
        }

        // GET THE CURRENT GALLERY
        const target =
            activeTab.getAttribute(
                "data-target"
            );

        let projectsSelector;

        if (target === "favorites-view") {
            projectsSelector =
                ".favorite-project";
        } else if (
            target === "category-view"
        ) {
            // CATEGORY VIEW DOES NOT USE TOC PROJECT ITEMS
            ticking = false;
            return;
        } else if (
            target === "timeline-view"
        ) {
            projectsSelector =
                ".timeline-project";
        } else {
            ticking = false;
            return;
        }

        // FIND PROJECTS IN THE CURRENT GALLERY
        const projectsOnPage =
            document.querySelectorAll(
                projectsSelector
            );

        const tocProjects =
            document.querySelectorAll(
                ".toc-project"
            );

        if (
            !projectsOnPage.length ||
            !tocProjects.length
        ) {
            ticking = false;
            return;
        }

        // FIND THE PROJECT CLOSEST TO THE CENTER OF THE SCREEN
        const viewportCenter =
            window.innerHeight / 2;

        let closestProject = null;
        let closestDistance = Infinity;

        projectsOnPage.forEach(
            function (project) {
                const rect =
                    project.getBoundingClientRect();

                const projectCenter =
                    rect.top +
                    rect.height / 2;

                const distance =
                    Math.abs(
                        projectCenter -
                        viewportCenter
                    );

                if (
                    distance <
                    closestDistance
                ) {
                    closestDistance =
                        distance;

                    closestProject =
                        project;
                }
            }
        );

        if (!closestProject) {
            ticking = false;
            return;
        }

        // GET PROJECT INDEX
        const projectIndex =
            closestProject.dataset.projectIndex;

        if (
            projectIndex === undefined
        ) {
            ticking = false;
            return;
        }

        // FIND MATCHING TOC LINK
        const activeLink =
            document.querySelector(
                `.toc-project[data-project-index="${projectIndex}"]`
            );

        if (!activeLink) {
            ticking = false;
            return;
        }

        // UPDATE TOC ACTIVE STATE
        const currentActive =
            document.querySelector(
                ".toc-project.active"
            );

        if (
            currentActive !==
            activeLink
        ) {
            tocProjects.forEach(
                function (link) {
                    link.classList.remove(
                        "active"
                    );
                }
            );

            activeLink.classList.add(
                "active"
            );

            // KEEP ACTIVE TOC ITEM CENTERED
            centerTocItem(
                activeLink
            );
        }

        ticking = false;
    }


    // PREVENT MULTIPLE SCROLL UPDATES AT ONCE
    function requestUpdate() {
        if (ticking) {
            return;
        }

        ticking = true;

        window.requestAnimationFrame(
            updateActiveProject
        );
    }


    // UPDATE TOC WHEN SCROLLING
    window.addEventListener(
        "scroll",
        requestUpdate,
        {
            passive: true
        }
    );


    // UPDATE TOC WHEN WINDOW SIZE CHANGES
    window.addEventListener(
        "resize",
        requestUpdate
    );


    // INITIAL UPDATE
    requestUpdate();
}


// CENTER ACTIVE TABLE OF CONTENT ITEM
function centerTocItem(item) {
    const tocList =
        document.getElementById(
            "toc-project-list"
        );

    // STOP IF NOT AVAILABLE
    if (
        !tocList ||
        !item
    ) {
        return;
    }

    // CALCULATE DISTANCE BETWEEN CURRENT AND TARGET
    const listRect =
        tocList.getBoundingClientRect();

    const itemRect =
        item.getBoundingClientRect();

    const itemCenter =
        itemRect.top +
        itemRect.height / 2;

    const listCenter =
        listRect.top +
        listRect.height / 2;

    const offset =
        itemCenter -
        listCenter;

    if (
        Math.abs(offset) < 1
    ) {
        return;
    }

    // MOVE TO TARGET
    tocList.scrollBy({
        top: offset,
        behavior: "smooth"
    });
}


// TABLE OF CONTENT CLICK
document.addEventListener(
    "click",
    function (event) {
        const link =
            event.target.closest(
                ".toc-project"
            );

        // STOP IF THE CLICK IS NOT A TOC PROJECT
        if (!link) {
            return;
        }

        // PREVENT INSTANT JUMP
        event.preventDefault();

        // GET THE TARGET
        const href =
            link.getAttribute(
                "href"
            );

        if (!href) {
            return;
        }

        const target =
            document.querySelector(
                href
            );

        if (!target) {
            return;
        }

        // CALCULATE TARGET CENTER
        const targetRect =
            target.getBoundingClientRect();

        const targetCenter =
            targetRect.top +
            targetRect.height / 2;

        const viewportCenter =
            window.innerHeight / 2;

        const scrollPosition =
            window.scrollY +
            targetCenter -
            viewportCenter;

        // MOVE TARGET TO CENTER
        window.scrollTo({
            top: scrollPosition,
            behavior: "smooth"
        });

        // REMOVE ACTIVE STATE FROM OTHER TOC ITEMS
        document
            .querySelectorAll(
                ".toc-project"
            )
            .forEach(
                function (tocItem) {
                    tocItem.classList.remove(
                        "active"
                    );
                }
            );

        // HIGHLIGHT SELECTED TOC LINK
        link.classList.add(
            "active"
        );

        // KEEP SELECTED TOC LINK CENTERED
        centerTocItem(
            link
        );
    }
);