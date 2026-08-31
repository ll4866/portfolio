
// TIMELINE
function renderTimeline(
    localizedProjects
) {
    const container =
        document.getElementById(
            "timeline-list"
        );

    const language =
        getCurrentLanguage();

    const text =
        uiText[language];

    if (!container) {
        return;
    }

    container.innerHTML = "";

    // Newest → oldest
    const sortedProjects =
        [...localizedProjects]
            .sort(
                function (a, b) {
                    return (
                        createProjectDate(
                            b.endDate
                        ) -
                        createProjectDate(
                            a.endDate
                        )
                    );
                }
            );

    sortedProjects.forEach(
        function (project) {
            const endDate =
                createProjectDate(
                    project.endDate
                );

            let month;

            if (language === "zh") {
                month =
                    endDate.toLocaleDateString(
                        "zh-CN",
                        {
                            month: "short"
                        }
                    );
            } else if (
                language === "pt"
            ) {
                month =
                    endDate.toLocaleDateString(
                        "pt-BR",
                        {
                            month: "short"
                        }
                    );
            } else {
                month =
                    endDate.toLocaleDateString(
                        "en-US",
                        {
                            month: "short"
                        }
                    );
            }

            const day =
                endDate.getDate();

            const year =
                endDate.getFullYear();

            const element =
                document.createElement(
                    "article"
                );

            element.className =
                "timeline-project";

            element.id =
                `timeline-project-${project.projectIndex}`;

            element.dataset.projectIndex =
                project.projectIndex;

            element.innerHTML = `
                <div class="timeline-date">
                    <span class="timeline-year">
                        ${year}
                    </span>
                </div>

                <div class="timeline-dot"></div>

                <div class="timeline-content">
                    <div class="timeline-day">
                        ${month} ${day}
                    </div>

                    <div class="timeline-project-content">
                        <div class="timeline-image">
                            <img
                                src="${project.image}"
                                alt="${project.title}"
                            >
                        </div>

                        <div class="timeline-information">
                            <h3>
                                ${project.title}
                            </h3>

                            ${createDescription(
                                project.description,
                                project.projectIndex,
                                FAVORITE_DESCRIPTION_WORD_LIMIT
                            )}

                            <p class="project-tags">
                                <strong>${text.keywords}:</strong>
                                ${project.tags.join(" · ")}
                            </p>

                            <p class="project-tools">
                                <strong>${text.tools}:</strong>
                                ${project.tools.join(" · ")}
                            </p>

                            <p class="project-duration">
                                <strong>${text.duration}:</strong>
                                ${getProjectDuration(project)}
                            </p>

                            <a
                                href="${project.link}"
                                class="more-info"
                            >
                                ${text.moreInfo}
                            </a>
                        </div>
                    </div>
                </div>
            `;

            container.appendChild(
                element
            );
        }
    );
}

// TIMELINE MOUSE GLOW
function initializeTimelineLight() {
    const timeline =
        document.querySelector(
            ".timeline"
        );

    if (!timeline) {
        return;
    }

    timeline.style.setProperty(
        "--timeline-light-x",
        "-100%"
    );

    timeline.style.setProperty(
        "--timeline-light-y",
        "-100%"
    );

    timeline.addEventListener(
        "pointerenter",
        function () {
            timeline.classList.add(
                "timeline-light-active"
            );
        }
    );

    timeline.addEventListener(
        "pointermove",
        function (event) {
            const rect =
                timeline.getBoundingClientRect();

            const x =
                (
                    (
                        event.clientX -
                        rect.left
                    ) /
                    rect.width
                ) * 100;

            const y =
                (
                    (
                        event.clientY -
                        rect.top
                    ) /
                    rect.height
                ) * 100;

            timeline.style.setProperty(
                "--timeline-light-x",
                x + "%"
            );

            timeline.style.setProperty(
                "--timeline-light-y",
                y + "%"
            );
        }
    );

    timeline.addEventListener(
        "pointerleave",
        function () {
            timeline.classList.remove(
                "timeline-light-active"
            );

            timeline.style.setProperty(
                "--timeline-light-x",
                "-100%"
            );

            timeline.style.setProperty(
                "--timeline-light-y",
                "-100%"
            );
        }
    );
}

// TABLE OF CONTENT SCROLL SYNC
function initializeTableOfContentScroll() {
    const toc =
        document.querySelector(
            ".table-of-content"
        );

    const tocProjects =
        document.querySelectorAll(
            ".toc-project"
        );

    if (!toc || !tocProjects.length) {
        return;
    }

    let ticking = false;

    function updateActiveProject() {
        const activeTab =
            document.querySelector(
                ".project-tab.active"
            );

        if (!activeTab) {
            ticking = false;
            return;
        }

        const target =
            activeTab.getAttribute(
                "data-target"
            );

        let projectsSelector;

        if (
            target ===
            "favorites-view"
        ) {
            projectsSelector =
                ".favorite-project";
        } else if (
            target ===
            "category-view"
        ) {
            projectsSelector =
                ".category-column";
        } else if (
            target ===
            "timeline-view"
        ) {
            projectsSelector =
                ".timeline-project";
        } else {
            ticking = false;
            return;
        }

        const projectsOnPage =
            document.querySelectorAll(
                projectsSelector
            );

        if (!projectsOnPage.length) {
            ticking = false;
            return;
        }

        const tocProjects =
            document.querySelectorAll(
                ".toc-project"
            );

        const viewportCenter =
            window.innerHeight / 2;

        let closestProject = null;
        let closestDistance =
            Infinity;

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

        const projectIndex =
            closestProject.dataset.projectIndex;

        const category =
            closestProject.dataset.category;

        let activeLink = null;

        if (category) {
            activeLink =
                document.querySelector(
                    `.toc-project[data-category="${CSS.escape(category)}"]`
                );
        } else if (projectIndex) {
            activeLink =
                document.querySelector(
                    `.toc-project[data-project-index="${projectIndex}"]`
                );
        }

        if (!activeLink) {
            ticking = false;
            return;
        }

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

            centerTocItem(
                activeLink
            );
        }

        ticking = false;
    }

    function requestUpdate() {
        if (ticking) {
            return;
        }

        ticking = true;

        window.requestAnimationFrame(
            updateActiveProject
        );
    }

    window.addEventListener(
        "scroll",
        requestUpdate,
        {
            passive: true
        }
    );

    window.addEventListener(
        "resize",
        requestUpdate
    );

    requestUpdate();
}

// CENTER ACTIVE TABLE OF CONTENT ITEM
function centerTocItem(
    item
) {
    const tocList =
        document.getElementById(
            "toc-project-list"
        );

    if (!tocList || !item) {
        return;
    }

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

        if (!link) {
            return;
        }

        event.preventDefault();

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

        window.scrollTo({
            top: scrollPosition,
            behavior: "smooth"
        });

        document.querySelectorAll(
            ".toc-project"
        ).forEach(
            function (tocItem) {
                tocItem.classList.remove(
                    "active"
                );
            }
        );

        link.classList.add(
            "active"
        );

        centerTocItem(
            link
        );
    }
);