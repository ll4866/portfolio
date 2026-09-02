const DESCRIPTION_WORD_LIMIT = 50;
let currentCategory = "all";
let currentSort = "favorites";
let currentSearch = "";

// UI LANGUAGE
const uiText = {
    en: {
        category: "CATEGORY",
        all: "ALL",
        favorite: "FAVORITES ↓",
        newest: "NEWEST ↑",
        oldest: "OLDEST ↓",
        tools: "Tools/Skills",
        duration: "Duration",
        moreInfo: "More Info →",
        expand: "(expand)",
        collapse: "(collapse)",
        day: "day",
        days: "days",
        week: "week",
        weeks: "weeks",
        month: "month",
        months: "months",
        year: "year",
        years: "years"
    },

    zh: {
        category: "类别",
        all: "全部",
        favorite: "收藏 ↑",
        newest: "最新 ↑",
        oldest: "最早 ↓",
        tools: "工具/技能",
        duration: "时长",
        moreInfo: "更多信息 →",
        expand: "(更多)",
        collapse: "(收起)",
        day: "天",
        days: "天",
        week: "周",
        weeks: "周",
        month: "个月",
        months: "个月",
        year: "年",
        years: "年"
    },

    pt: {
        category: "CATEGORIA",
        all: "TODOS",
        favorite: "FAVORITOS ↑",
        newest: "MAIS RECENTES ↑",
        oldest: "MAIS ANTIGOS ↓",
        tools: "Ferramentas/Habilidades",
        duration: "Duração",
        moreInfo: "Mais informações →",
        expand: "(Ver mais)",
        collapse: "(Ver menos)",
        day: "dia",
        days: "dias",
        week: "semana",
        weeks: "semanas",
        month: "mês",
        months: "meses",
        year: "ano",
        years: "anos"
    }
};

// LOAD PAGE WHEN READY
document.addEventListener("DOMContentLoaded", function () {

    renderProjects();
    initializeProjectControls();

});

// RENDER PROJECTS
function renderProjects() {

    const language =
        getCurrentLanguage();

    const localizedProjects =
        projects.map(
            function (project, index) {

                const localized =
                    project.languages &&
                    project.languages[language]
                        ? project.languages[language]
                        : project.languages.en;

                return {
                    ...project,
                    ...localized,
                    projectIndex: index
                };

            }
        );

    renderCategoryNavigation(
        localizedProjects
    );

    let filteredProjects =
        filterProjects(
            localizedProjects
        );

    filteredProjects =
        searchProjects(
            filteredProjects
        );

    filteredProjects =
        sortProjects(
            filteredProjects
        );

    renderProjectGrid(
        filteredProjects
    );

    updateTableOfContent(
        filteredProjects
    );

    initializeProjectCardEffects();

    updateSortLabel();
}
// FILTER PROJECTS BY CATEGORY
function filterProjects(
    localizedProjects
) {

    if (currentCategory === "all") {
        return [...localizedProjects];
    }

    return localizedProjects.filter(
        function (project) {

            if (!project.categories) {
                return false;
            }

            const categories =
                Array.isArray(project.categories)
                    ? project.categories
                    : [project.categories];

            return categories.some(
                function (category) {

                    return (
                        normalizeCategory(
                            category
                        ) ===
                        normalizeCategory(
                            currentCategory
                        )
                    );

                }
            );

        }
    );

}

/* Search projects */
function searchProjects(projectList) {

    if (!currentSearch.trim()) {
        return projectList;
    }

    const language =
        getCurrentLanguage();

    const searchTerm =
        currentSearch
            .trim()
            .toLowerCase();

    return projectList.filter(
        function (project) {

            const localized =
                project.languages &&
                project.languages[language]
                    ? project.languages[language]
                    : {};

            const title =
                String(
                    localized.title || ""
                ).toLowerCase();

            const tools =
                Array.isArray(
                    localized.tools
                )
                    ? localized.tools.join(" ")
                    : String(
                        localized.tools || ""
                    );

            return (
                title.includes(
                    searchTerm
                ) ||
                tools
                    .toLowerCase()
                    .includes(
                        searchTerm
                    )
            );

        }
    );

}

// NORMALIZE CATEGORY
function normalizeCategory(category) {

    return String(category)
        .trim()
        .toLowerCase()
        .replace(
            /[\s_-]+/g,
            " "
        );

}

// SORT PROJECTS
function sortProjects(
    projectList
) {

    const sortedProjects =
        [...projectList];

    // FAVORITES
    if (currentSort === "favorites") {

        return sortedProjects.sort(
            function (a, b) {

                return (
                    a.projectIndex -
                    b.projectIndex
                );

            }
        );

    }

    // NEWEST
    if (currentSort === "newest") {

        return sortedProjects.sort(
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

    }

    // OLDEST
    if (currentSort === "oldest") {

        return sortedProjects.sort(
            function (a, b) {

                return (
                    createProjectDate(
                        a.startDate
                    ) -
                    createProjectDate(
                        b.startDate
                    )
                );

            }
        );

    }

    return sortedProjects;

}

// RENDER CATEGORY NAVIGATION
function renderCategoryNavigation(
    localizedProjects
) {

    const container =
        document.getElementById(
            "category-options"
        );

    const select =
        document.getElementById(
            "category-select"
        );

    if (!container && !select) {
        return;
    }

    const language =
        getCurrentLanguage();

    const text =
        uiText[language];

    // FIND UNIQUE CATEGORIES
    const categories = [];

    localizedProjects.forEach(
        function (project) {

            if (!project.categories) {
                return;
            }

            const projectCategories =
                Array.isArray(
                    project.categories
                )
                    ? project.categories
                    : [project.categories];

            projectCategories.forEach(
                function (category) {

                    if (!category) {
                        return;
                    }

                    const exists =
                        categories.some(
                            function (existing) {

                                return (
                                    normalizeCategory(
                                        existing
                                    ) ===
                                    normalizeCategory(
                                        category
                                    )
                                );

                            }
                        );

                    if (!exists) {

                        categories.push(
                            category
                        );

                    }

                }
            );

        }
    );

    // DESKTOP CATEGORY OPTIONS
    if (container) {

        container.innerHTML = "";

        // ALL
        const allButton =
            document.createElement(
                "button"
            );

        allButton.type =
            "button";

        allButton.className =
            "project-category";

        allButton.dataset.category =
            "all";

        const allText =
            document.createElement(
                "span"
            );

        allText.className =
            "project-category-text";

        allText.textContent =
            text.all;

        allButton.appendChild(
            allText
        );

        if (
            currentCategory ===
            "all"
        ) {

            allButton.classList.add(
                "active"
            );

        }

        container.appendChild(
            allButton
        );

        // SEPARATOR AFTER ALL
        if (categories.length > 0) {

            const separator =
                document.createElement(
                    "span"
                );

            separator.className =
                "project-category-separator";

            separator.textContent =
                "·";

            container.appendChild(
                separator
            );

        }

        // CATEGORIES
        categories.forEach(
            function (category, index) {

                const button =
                    document.createElement(
                        "button"
                    );

                button.type =
                    "button";

                button.className =
                    "project-category";

                button.dataset.category =
                    category;

                const categoryText =
                    document.createElement(
                        "span"
                    );

                categoryText.className =
                    "project-category-text";

                categoryText.textContent =
                    category;

                button.appendChild(
                    categoryText
                );

                if (
                    normalizeCategory(
                        currentCategory
                    ) ===
                    normalizeCategory(
                        category
                    )
                ) {

                    button.classList.add(
                        "active"
                    );

                }

                container.appendChild(
                    button
                );

                // SEPARATOR
                if (
                    index <
                    categories.length - 1
                ) {

                    const separator =
                        document.createElement(
                            "span"
                        );

                    separator.className =
                        "project-category-separator";

                    separator.textContent =
                        "·";

                    container.appendChild(
                        separator
                    );

                }

            }
        );

    }

    // MOBILE CATEGORY SELECT
    if (select) {

        select.innerHTML = "";

        // ALL
        const allOption =
            document.createElement(
                "option"
            );

        allOption.value =
            "all";

        allOption.textContent =
            text.all;

        select.appendChild(
            allOption
        );

        // CATEGORIES
        categories.forEach(
            function (category) {

                const option =
                    document.createElement(
                        "option"
                    );

                option.value =
                    category;

                option.textContent =
                    category;

                select.appendChild(
                    option
                );

            }
        );

        // SET CURRENT CATEGORY
        if (
            currentCategory ===
            "all"
        ) {

            select.value =
                "all";

        } else {

            const matchingCategory =
                categories.find(
                    function (category) {

                        return (
                            normalizeCategory(
                                category
                            ) ===
                            normalizeCategory(
                                currentCategory
                            )
                        );

                    }
                );

            select.value =
                matchingCategory ||
                "all";

        }

    }

}

// RENDER PROJECT GRID
function renderProjectGrid(projectList) {

    const container =
        document.getElementById("projects-list");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    if (!projectList.length) {
        container.innerHTML = `
            <div class="projects-empty">
                No projects found.
            </div>
        `;
        return;
    }

    projectList.forEach(function (project) {

        container.appendChild(
            createProjectCard(project)
        );

    });
}

// CREATE PROJECT CARD
function createProjectCard(
    project
) {

    const language =
        getCurrentLanguage();

    const text =
        uiText[language];

    const article =
        document.createElement(
            "article"
        );

    article.className =
        "project-card";

    article.dataset.projectId =
        `project-${project.projectIndex}`;

    article.dataset.projectIndex =
        project.projectIndex;

    const year =
        getProjectYear(project);

    // PROJECT INDEX NUMBER
    const projectNumber =
        `#${String(
            project.projectIndex + 1
        ).padStart(2, "0")}`;

    article.innerHTML = `
        <div class="project-image-wrapper">

            <img
                class="project-image"
                src="${project.image}"
                alt="${project.title || ""}"
                loading="lazy"
            >

        </div>

        <div class="project-info">

            <div class="project-year-rank">

                <span class="project-year">
                    ${year}
                </span>

                <span class="project-rank">
                    ${projectNumber}
                </span>

            </div>

            <h3 class="project-title">
                ${project.title || ""}
            </h3>

            ${createDescription(
                project.description,
                project.projectIndex
            )}

            <div class="project-details">

                <span class="project-tools">
                    ${formatTools(
                        project.tools
                    )}
                </span>

                <span class="project-duration">
                    ${getProjectDuration(
                        project
                    )}
                </span>

            </div>

            <a
                class="project-more-info"
                href="${project.link}">
                ${text.moreInfo}
            </a>

        </div>
    `;

    return article;

}

// FORMAT TOOLS
function formatTools(tools) {

    if (!tools) {
        return "";
    }

    if (Array.isArray(tools)) {
        return tools.join(" · ");
    }

    return tools;

}

// DATE FUNCTIONS
function createProjectDate(
    dateString
) {

    if (!dateString) {
        return new Date(0);
    }

    const parts =
        dateString.split("-");

    return new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2])
    );

}

// GET PROJECT YEAR
function getProjectYear(
    project
) {

    const date =
        createProjectDate(
            project.endDate
        );

    return date.getFullYear();

}

// FORMAT PROJECT DATE
function formatProjectDate(
    dateString
) {

    const date =
        createProjectDate(
            dateString
        );

    const language =
        getCurrentLanguage();

    if (language === "zh") {

        return date.toLocaleDateString(
            "zh-CN",
            {
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );

    }

    if (language === "pt") {

        return date.toLocaleDateString(
            "pt-BR",
            {
                year: "numeric",
                month: "long",
                day: "numeric"
            }
        );

    }

    return date.toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );

}

// PROJECT DURATION
function getProjectDuration(
    project
) {

    const language =
        getCurrentLanguage();

    const text =
        uiText[language];

    const start =
        createProjectDate(
            project.startDate
        );

    const end =
        createProjectDate(
            project.endDate
        );

    const totalDays =
        Math.round(
            (end - start) /
            (1000 * 60 * 60 * 24)
        ) + 1;

    // DAYS
    if (totalDays < 7) {

        if (totalDays === 1) {
            return `1 ${text.day}`;
        }

        return `${totalDays} ${text.days}`;

    }

    // WEEKS
    const weeks =
        Math.round(
            totalDays / 7
        );

    if (totalDays < 30) {

        if (weeks === 1) {
            return `1 ${text.week}`;
        }

        return `${weeks} ${text.weeks}`;

    }

    // MONTHS
    const months =
        (
            (end.getFullYear() -
                start.getFullYear()) *
            12
        ) +
        (
            end.getMonth() -
            start.getMonth()
        );

    if (months < 12) {

        if (months === 1) {
            return `1 ${text.month}`;
        }

        return `${months} ${text.months}`;

    }

    // YEARS
    const years =
        Math.floor(
            months / 12
        );

    const remainingMonths =
        months % 12;

    if (remainingMonths === 0) {

        if (years === 1) {
            return `1 ${text.year}`;
        }

        return `${years} ${text.years}`;

    }

    const yearText =
        years === 1
            ? text.year
            : text.years;

    const monthText =
        remainingMonths === 1
            ? text.month
            : text.months;

    return (
        `${years} ${yearText}, ` +
        `${remainingMonths} ${monthText}`
    );

}

// DESCRIPTION PREVIEW
function createDescription(
    description,
    projectIndex,
    wordLimit = DESCRIPTION_WORD_LIMIT
) {

    const language =
        getCurrentLanguage();

    const text =
        uiText[language];

    if (!description) {
        return "";
    }

    const paragraphs =
        Array.isArray(description)
            ? description.filter(
                function (paragraph) {
                    return (
                        paragraph &&
                        paragraph.trim()
                    );
                }
            )
            : [description];

    const fullDescription =
        paragraphs.join(" ");

    const words =
        fullDescription
            .trim()
            .split(/\s+/);

    // DESCRIPTION DOES NOT NEED EXPANSION
    if (words.length <= wordLimit) {

        return `
            <div class="project-description-wrapper">

                ${paragraphs.map(
                    function (paragraph) {

                        return `
                            <p class="project-description">
                                ${paragraph}
                            </p>
                        `;

                    }
                ).join("")}

            </div>
        `;

    }

    // CREATE PREVIEW
    const preview =
        words
            .slice(
                0,
                wordLimit
            )
            .join(" ");

    return `
        <div class="project-description-wrapper">

            <div class="description-short">

                <p class="project-description">
                    ${preview}...
                    <button
                        type="button"
                        class="description-expand"
                        data-project-index="${projectIndex}">
                        ${text.expand}
                    </button>
                </p>

            </div>

            <div class="description-full">

                ${paragraphs.map(
                    function (
                        paragraph,
                        index
                    ) {

                        return `
                            <p class="project-description">
                                ${paragraph}

                                ${
                                    index ===
                                    paragraphs.length - 1
                                        ? `
                                            <button
                                                type="button"
                                                class="description-expand"
                                                data-project-index="${projectIndex}">
                                                ${text.collapse}
                                            </button>
                                        `
                                        : ""
                                }

                            </p>
                        `;

                    }
                ).join("")}

            </div>

        </div>
    `;

}

// PROJECT CONTROLS
function initializeProjectControls() {

    // DESKTOP CATEGORY BUTTONS
    document.addEventListener(
        "click",
        function (event) {

            const categoryButton =
                event.target.closest(
                    ".project-category"
                );

            if (!categoryButton) {
                return;
            }

            const category =
                categoryButton.dataset.category;

            if (!category) {
                return;
            }

            currentCategory =
                category === "all"
                    ? "all"
                    : category;

            renderProjects();

        }
    );

    // MOBILE CATEGORY SELECT
    const categorySelect =
        document.getElementById(
            "category-select"
        );

    if (categorySelect) {

        categorySelect.addEventListener(
            "change",
            function () {

                currentCategory =
                    categorySelect.value;

                renderProjects();

            }
        );

    }

// SORT BUTTON
const sortButton =
    document.getElementById(
        "project-sort-button"
    );

if (sortButton) {

    sortButton.addEventListener(
        "click",
        function (event) {

            event.preventDefault();
            event.stopPropagation();

            cycleProjectSort();

        }
    );

}

const searchInput =
    document.getElementById(
        "project-search"
    );

if (searchInput) {

    searchInput.addEventListener(
        "input",
        function () {

            currentSearch =
                searchInput.value;

            renderProjects();

        }
    );

}

}

// CYCLE PROJECT SORT
function cycleProjectSort() {

    if (currentSort === "favorites") {

        currentSort = "newest";

    } else if (
        currentSort === "newest"
    ) {

        currentSort = "oldest";

    } else {

        currentSort = "favorites";

    }

    renderProjects();

    updateSortLabel();

}

// UPDATE SORT LABEL
function updateSortLabel() {

    const button =
        document.getElementById(
            "project-sort-button"
        );

    if (!button) {
        return;
    }

    const language =
        getCurrentLanguage();

    const text =
        uiText[language];

    if (currentSort === "favorites") {

        button.textContent =
            text.favorite;

    } else if (
        currentSort === "newest"
    ) {

        button.textContent =
            text.newest;

    } else {

        button.textContent =
            text.oldest;

    }

    button.dataset.sort =
        currentSort;

}

// DESCRIPTION EXPAND / COLLAPSE
document.addEventListener(
    "click",
    function (event) {

        const button =
            event.target.closest(
                ".description-expand"
            );

        if (!button) {
            return;
        }

        const wrapper =
            button.closest(
                ".project-description-wrapper"
            );

        if (!wrapper) {
            return;
        }

        wrapper.classList.toggle(
            "expanded"
        );

    }
);

// PROJECT CARD LIGHT EFFECT
function initializeProjectCardEffects() {

    const cards =
        document.querySelectorAll(
            ".project-card"
        );

    cards.forEach(
        function (card) {

            card.addEventListener(
                "mousemove",
                function (event) {

                    const rect =
                        card.getBoundingClientRect();

                    const x =
                        (
                            (event.clientX - rect.left) /
                            rect.width
                        ) * 100;

                    const y =
                        (
                            (event.clientY - rect.top) /
                            rect.height
                        ) * 100;

                    card.style.setProperty(
                        "--light-x",
                        `${x}%`
                    );

                    card.style.setProperty(
                        "--light-y",
                        `${y}%`
                    );

                }
            );

            card.addEventListener(
                "mouseleave",
                function () {

                    card.style.setProperty(
                        "--light-x",
                        "-100%"
                    );

                    card.style.setProperty(
                        "--light-y",
                        "-100%"
                    );

                }
            );

        }
    );

}