
// FAVORITES
function renderFavorites(
    localizedProjects
) {
    const list =
        document.getElementById(
            "favorites-list"
        );

    if (!list) {
        return;
    }

    const language =
        getCurrentLanguage();

    const text =
        uiText[language];

    const totalPages =
        Math.ceil(
            localizedProjects.length /
            FAVORITE_PROJECTS_PER_PAGE
        );

    if (
        currentFavoritePage >=
        totalPages
    ) {
        currentFavoritePage =
            totalPages - 1;
    }

    if (
        currentFavoritePage < 0
    ) {
        currentFavoritePage = 0;
    }

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

    list.innerHTML =
        visibleProjects
            .map(
                function (
                    project,
                    index
                ) {
                    const image = `
                        <div class="project-image">
                            <img
                                src="${project.image}"
                                alt="${project.title}">
                        </div>
                    `;

                    const information = `
                        <div class="project-information">
                            <div class="project-meta">
                                <span class="favorite-rank">
                                    ${text.favorite} #${project.projectIndex + 1}
                                </span>

                                <span class="project-year">
                                    ${getProjectYear(project)}
                                </span>
                            </div>

                            <h3>
                                ${project.title}
                            </h3>

                            ${createDescription(
                                project.description,
                                project.projectIndex,
                                FAVORITE_DESCRIPTION_WORD_LIMIT
                            )}

                            <div class="project-details">
                                <p class="project-categories">
                                    <strong>${text.category}:</strong>
                                    ${project.categories.join(" · ")}
                                </p>

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
                            </div>

                            <a
                                class="more-info"
                                href="${project.link}">
                                ${text.moreInfo}
                            </a>
                        </div>
                    `;

                    if (index % 2 === 0) {
                        return `
                            <article
                                class="favorite-project"
                                id="favorite-project-${project.projectIndex}"
                                data-project-index="${project.projectIndex}">
                                ${image}
                                ${information}
                            </article>
                        `;
                    }

                    return `
                        <article
                            class="favorite-project"
                            id="favorite-project-${project.projectIndex}"
                            data-project-index="${project.projectIndex}">
                            ${information}
                            ${image}
                        </article>
                    `;
                }
            )
            .join("");

    renderFavoritePagination(
        localizedProjects.length
    );

    initializeFavoriteLight();
    initializeFavoriteTilt();
}

// FAVORITES PAGINATION
function renderFavoritePagination(
    totalProjects
) {
    const oldPagination =
        document.querySelector(
            ".favorites-pagination"
        );

    if (oldPagination) {
        oldPagination.remove();
    }

    const totalPages =
        Math.ceil(
            totalProjects /
            FAVORITE_PROJECTS_PER_PAGE
        );

    if (
        totalPages <= 1
    ) {
        return;
    }

    const language =
        getCurrentLanguage();

    const text =
        uiText[language];

    const pagination =
        document.createElement(
            "div"
        );

    pagination.className =
        "favorites-pagination";

    let html = "";

    // Previous page
    html += `
        <button
            class="favorite-page-arrow"
            data-page="previous"
            type="button"
            aria-label="${text.previous}">
            ${text.previous}
        </button>
    `;

    // Page ranges
    for (
        let page = 0;
        page < totalPages;
        page++
    ) {
        const start =
            page *
            FAVORITE_PROJECTS_PER_PAGE +
            1;

        const end =
            Math.min(
                (
                    page + 1
                ) *
                FAVORITE_PROJECTS_PER_PAGE,
                totalProjects
            );

        html += `
            <button
                class="favorite-page"
                data-page="${page}"
                type="button">
                ${start}–${end}
            </button>
        `;

        if (
            page <
            totalPages - 1
        ) {
            html += `
                <span class="favorite-page-separator">
                    |
                </span>
            `;
        }
    }

    // Next page
    html += `
        <button
            class="favorite-page-arrow"
            data-page="next"
            type="button"
            aria-label="${text.next}">
            ${text.next}
        </button>
    `;

    pagination.innerHTML =
        html;

    const activePage =
        pagination.querySelector(
            `.favorite-page[data-page="${currentFavoritePage}"]`
        );

    if (activePage) {
        activePage.classList.add(
            "active"
        );
    }

    const list =
        document.getElementById(
            "favorites-list"
        );

    if (list) {
        list.insertAdjacentElement(
            "afterend",
            pagination
        );
    }
}

// FAVORITES PAGINATION CLICK
document.addEventListener(
    "click",
    function (event) {
        const button =
            event.target.closest(
                ".favorite-page, .favorite-page-arrow"
            );

        if (!button) {
            return;
        }

        const page =
            button.dataset.page;

        const totalPages =
            Math.ceil(
                projects.length /
                FAVORITE_PROJECTS_PER_PAGE
            );

        if (
            page ===
            "previous"
        ) {
            if (
                currentFavoritePage >
                0
            ) {
                currentFavoritePage--;
            }
        } else if (
            page ===
            "next"
        ) {
            if (
                currentFavoritePage <
                totalPages - 1
            ) {
                currentFavoritePage++;
            }
        } else {
            currentFavoritePage =
                Number(page);
        }

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

        renderFavorites(
            localizedProjects
        );

        updateTableOfContent(
            localizedProjects
        );

        initializeTableOfContentScroll();

        const favoritesView =
            document.getElementById(
                "favorites-view"
            );

        if (
            favoritesView
        ) {
            const rect =
                favoritesView.getBoundingClientRect();

            window.scrollTo({
                top:
                    window.scrollY +
                    rect.top -
                    100,
                behavior: "smooth"
            });
        }
    }
);

// FAVORITE PROJECT LIGHT
function initializeFavoriteLight() {
    const favoriteProjects =
        document.querySelectorAll(
            ".favorite-project"
        );

    favoriteProjects.forEach(
        function (project) {
            project.style.setProperty(
                "--light-x",
                "-100%"
            );

            project.style.setProperty(
                "--light-y",
                "-100%"
            );

            project.addEventListener(
                "pointermove",
                function (event) {
                    const rect =
                        project.getBoundingClientRect();

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

                    project.style.setProperty(
                        "--light-x",
                        x + "%"
                    );

                    project.style.setProperty(
                        "--light-y",
                        y + "%"
                    );
                }
            );

            project.addEventListener(
                "pointerleave",
                function () {
                    project.style.setProperty(
                        "--light-x",
                        "-100%"
                    );

                    project.style.setProperty(
                        "--light-y",
                        "-100%"
                    );
                }
            );
        }
    );
}

// FAVORITES SECTION - PROJECT CARD TILT
function initializeFavoriteTilt() {
    const favoriteProjects =
        document.querySelectorAll(
            ".favorite-project"
        );

    favoriteProjects.forEach(
        function (project) {
            project.addEventListener(
                "mousemove",
                function (event) {
                    const rect =
                        project.getBoundingClientRect();

                    const x =
                        event.clientX -
                        rect.left;

                    const y =
                        event.clientY -
                        rect.top;

                    const centerX =
                        rect.width / 2;

                    const centerY =
                        rect.height / 2;

                    const rotateX =
                        (
                            (y - centerY) /
                            centerY
                        ) * -2;

                    const rotateY =
                        (
                            (x - centerX) /
                            centerX
                        ) * 2;

                    project.style.transform =
                        `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
                }
            );

            project.addEventListener(
                "mouseleave",
                function () {
                    project.style.transform =
                        "";
                }
            );
        }
    );
}