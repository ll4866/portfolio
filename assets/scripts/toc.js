
// TABLE OF CONTENT
function updateTableOfContent(
    localizedProjects
) {
    const container =
        document.getElementById(
            "toc-project-list"
        );

    if (!container) {
        return;
    }

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

    container.innerHTML = "";

    // FAVORITES
    if (
        target ===
        "favorites-view"
    ) {
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

    // CATEGORY
    if (
        target ===
        "category-view"
    ) {
        const categories = [];

        localizedProjects.forEach(
            function (project) {
                project.categories.forEach(
                    function (category) {
                        if (
                            !categories.includes(
                                category
                            )
                        ) {
                            categories.push(
                                category
                            );
                        }
                    }
                );
            }
        );

        categories.forEach(
            function (category) {
                const link =
                    document.createElement(
                        "a"
                    );

                link.className =
                    "toc-project";

                link.href =
                    `#category-${createCategoryId(category)}`;

                link.dataset.category =
                    category;

                link.textContent =
                    category;

                container.appendChild(
                    link
                );
            }
        );

        return;
    }

    // TIMELINE
    if (
        target ===
        "timeline-view"
    ) {
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

// UPDATE TABLE OF CONTENT AFTER TAB CHANGE
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
                                        ...project.languages[language],
                                        projectIndex: index
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

// CREATE CATEGORY ID
function createCategoryId(
    category
) {
    return category
        .toLowerCase()
        .trim()
        .replace(
            /[^a-z0-9\u4e00-\u9fff]+/g,
            "-"
        )
        .replace(
            /^-+|-+$/g,
            ""
        );
}