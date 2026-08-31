
// CATEGORIES
function renderCategories(
    localizedProjects
) {
    const container =
        document.getElementById(
            "category-list"
        );

    const language =
        getCurrentLanguage();

    const text =
        uiText[language];

    if (!container) {
        return;
    }

    container.innerHTML = "";

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
            const column =
                document.createElement(
                    "div"
                );

            column.className =
                "category-column";

            column.id =
                `category-${createCategoryId(category)}`;

            column.dataset.category =
                category;

            column.innerHTML = `
                <h3>${category}</h3>
                <div class="category-projects"></div>
            `;

            const projectContainer =
                column.querySelector(
                    ".category-projects"
                );

            localizedProjects
                .filter(
                    function (project) {
                        return project.categories.includes(
                            category
                        );
                    }
                )
                .forEach(
                    function (project) {
                        const element =
                            document.createElement(
                                "article"
                            );

                        element.className =
                            "category-project";

                        element.innerHTML = `
                            <img
                                src="${project.image}"
                                alt="${project.title}"
                            >

                            <span class="project-year">
                                ${getProjectYear(project)}
                            </span>

                            <h4>
                                ${project.title}
                            </h4>

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
                                class="more-info">
                                ${text.moreInfo}
                            </a>
                        `;

                        projectContainer.appendChild(
                            element
                        );
                    }
                );

            container.appendChild(
                column
            );
        }
    );

    initializeCategoryLight();
    initializeCategoryTilt();
}

// CATEGORY PROJECT LIGHT
function initializeCategoryLight() {
    const categoryProjects =
        document.querySelectorAll(
            ".category-project"
        );

    categoryProjects.forEach(
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

// CATEGORY PROJECT TILT
function initializeCategoryTilt() {
    const categoryProjects =
        document.querySelectorAll(
            ".category-project"
        );

    categoryProjects.forEach(
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
                        ) * -6;

                    const rotateY =
                        (
                            (x - centerX) /
                            centerX
                        ) * 6;

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