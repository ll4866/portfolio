let currentCategoryIndex = 0;

// CATEGORIES
function renderCategories(localizedProjects) {
    const container =
        document.getElementById("category-list");

    if (!container) {
        return;
    }

    // GET CURRENT LANGUAGE
    const language = getCurrentLanguage();
    const text = uiText[language];

    // RESET CATEGORY CONTENT
    container.innerHTML = "";

    // FIND ALL UNIQUE CATEGORIES
    const categories = [];

    localizedProjects.forEach(function (project) {
        project.categories.forEach(function (category) {
            if (!categories.includes(category)) {
                categories.push(category);
            }
        });
    });

    // CREATE CATEGORY NAVIGATION
    createCategoryNavigation(categories);

    // STORE CATEGORY DATA
    container.dataset.categories =
        JSON.stringify(categories);

    // CREATE THE PROJECT GALLERY
    renderCategoryProjects(
        localizedProjects,
        categories[0]
    );

    // START WITH FIRST CATEGORY
    currentCategoryIndex = 0;

    updateCategoryNavigation();
}


// RENDER SELECTED CATEGORY PROJECTS
function renderCategoryProjects(
    localizedProjects,
    category
) {
    const container =
        document.getElementById("category-list");

    if (!container) {
        return;
    }

    // CLEAR PREVIOUS CATEGORY PROJECTS
    container.innerHTML = "";

    // GET CURRENT LANGUAGE
    const language = getCurrentLanguage();
    const text = uiText[language];

    // FIND PROJECTS BELONGING TO SELECTED CATEGORY
    const categoryProjects =
        localizedProjects.filter(function (project) {
            return project.categories.includes(category);
        });

    // CREATE PROJECT CARDS
    categoryProjects.forEach(function (project) {
        const element =
            document.createElement("article");

        element.className =
            "category-project";

        element.id =
            `category-project-${project.projectIndex}`;

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
                class="more-info"
            >
                ${text.moreInfo}
            </a>
        `;

        // ADD PROJECT TO SELECTED CATEGORY
        container.appendChild(element);
    });

    // RESET GALLERY POSITION
    container.style.transition = "none";
    container.style.transform = "translateX(0)";

    // START PROJECT EFFECTS
    initializeCategoryLight();
    initializeCategoryTilt();
}


// CATEGORY NAVIGATION
function createCategoryNavigation(categories) {
    // REMOVE PREVIOUS NAVIGATION
    const previousNavigation =
        document.querySelector(".category-navigation");

    if (previousNavigation) {
        previousNavigation.remove();
    }

    // FIND PROJECT HEADER
    const stickyHeader =
        document.querySelector(
            ".projects-sticky-header"
        );

    if (!stickyHeader) {
        return;
    }

    // CREATE CATEGORY NAVIGATION
    const navigation =
        document.createElement("nav");

    navigation.className =
        "category-navigation";

    categories.forEach(function (category, index) {
        // CREATE CATEGORY BUTTON
        const link =
            document.createElement("button");

        link.type = "button";

        link.className =
            "category-navigation-link";

        link.dataset.categoryIndex =
            index;

        link.textContent =
            category;

        // SELECT CATEGORY
        link.addEventListener(
            "click",
            function () {
                currentCategoryIndex = index;

                const language =
                    getCurrentLanguage();

                const localizedProjects =
                    projects.map(function (
                        project,
                        projectIndex
                    ) {
                        return {
                            ...project,
                            ...project.languages[language],
                            projectIndex:
                                projectIndex
                        };
                    });

                // GET SELECTED CATEGORY
                const selectedCategory =
                    categories[
                        currentCategoryIndex
                    ];

                // SHOW ONLY SELECTED CATEGORY PROJECTS
                renderCategoryProjects(
                    localizedProjects,
                    selectedCategory
                );

                // UPDATE ACTIVE CATEGORY
                updateCategoryNavigation();

                // UPDATE TOC
                updateCategoryTableOfContent();
            }
        );

        navigation.appendChild(link);

        // ADD CATEGORY SEPARATOR
        if (index < categories.length - 1) {
            const separator =
                document.createElement("span");

            separator.className =
                "category-navigation-separator";

            separator.textContent =
                "|";

            navigation.appendChild(separator);
        }
    });

    // FIND PROJECT TABS
    const tabs =
        stickyHeader.querySelector(
            ".projects-tabs"
        );

    if (tabs) {
        tabs.insertAdjacentElement(
            "afterend",
            navigation
        );
    } else {
        stickyHeader.appendChild(
            navigation
        );
    }
}


// CHANGE CATEGORY
function changeCategory() {
    const container =
        document.getElementById("category-list");

    if (!container) {
        return;
    }

    // GET CATEGORY DATA
    const categories =
        JSON.parse(
            container.dataset.categories ||
            "[]"
        );

    if (!categories.length) {
        return;
    }

    // GET CURRENT LANGUAGE
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

    // GET SELECTED CATEGORY
    const selectedCategory =
        categories[
            currentCategoryIndex
        ];

    // RENDER SELECTED CATEGORY
    renderCategoryProjects(
        localizedProjects,
        selectedCategory
    );

    // UPDATE CATEGORY NAVIGATION
    updateCategoryNavigation();

    // UPDATE TOC
    updateCategoryTableOfContent();
}


// UPDATE CATEGORY NAVIGATION
function updateCategoryNavigation() {
    const links =
        document.querySelectorAll(
            ".category-navigation-link"
        );

    links.forEach(function (link, index) {
        link.classList.toggle(
            "active",
            index === currentCategoryIndex
        );
    });
}


// UPDATE CATEGORY TABLE OF CONTENT
function updateCategoryTableOfContent() {
    const container =
        document.getElementById(
            "toc-project-list"
        );

    if (!container) {
        return;
    }

    // CATEGORY VIEW DOES NOT LIST CATEGORIES OR PROJECTS
    container.innerHTML = "";
}


// CATEGORY PROJECT LIGHT
function initializeCategoryLight() {
    const categoryProjects =
        document.querySelectorAll(
            ".category-project"
        );

    // APPLY LIGHT EFFECT TO EACH PROJECT
    categoryProjects.forEach(function (project) {
        project.addEventListener(
            "pointermove",
            function (event) {
                const rect =
                    project.getBoundingClientRect();

                const x =
                    ((event.clientX - rect.left) /
                        rect.width) * 100;

                const y =
                    ((event.clientY - rect.top) /
                        rect.height) * 100;

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

        // RESET LIGHT EFFECT
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
    });
}


// CATEGORY PROJECT TILT
function initializeCategoryTilt() {
    const categoryProjects =
        document.querySelectorAll(
            ".category-project"
        );

    // APPLY TILT EFFECT TO EACH PROJECT
    categoryProjects.forEach(function (project) {
        project.addEventListener(
            "mousemove",
            function (event) {
                const rect =
                    project.getBoundingClientRect();

                const x =
                    event.clientX - rect.left;

                const y =
                    event.clientY - rect.top;

                const centerX =
                    rect.width / 2;

                const centerY =
                    rect.height / 2;

                const rotateX =
                    ((y - centerY) /
                        centerY) * -6;

                const rotateY =
                    ((x - centerX) /
                        centerX) * 6;

                project.style.transform =
                    `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
            }
        );

        // RESET PROJECT TILT
        project.addEventListener(
            "mouseleave",
            function () {
                project.style.transform = "";
            }
        );
    });
}