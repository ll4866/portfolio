
const FAVORITE_PROJECTS_PER_PAGE = 10;
const FAVORITE_DESCRIPTION_WORD_LIMIT = 80;
let currentFavoritePage = 0;

// UI LANGUAGE
const uiText = {
    en: {
        favorite: "Favorite",
        category: "Category",
        keywords: "Keywords",
        tools: "Tools/Skills",
        duration: "Duration",
        moreInfo: "More Info →",
        expand: "expand",
        collapse: "collapse",
        previous: "‹",
        next: "›",
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
        favorite: "收藏",
        category: "类别",
        keywords: "关键词",
        tools: "工具/技能",
        duration: "时长",
        moreInfo: "更多信息 →",
        expand: "更多",
        collapse: "收起",
        previous: "‹",
        next: "›",
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
        favorite: "Favorito",
        category: "Categoria",
        keywords: "Palavras-chave",
        tools: "Ferramentas/Habilidades",
        duration: "Duração",
        moreInfo: "Mais informações →",
        expand: "Ver mais",
        collapse: "Ver menos",
        previous: "‹",
        next: "›",
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

// PAGE LOAD
document.addEventListener(
    "DOMContentLoaded",
    function () {
        renderProjects();
    }
);

// RENDER ALL PROJECTS
function renderProjects() {
    const language =
        getCurrentLanguage();

    const localizedProjects =
        projects.map(function (project, index) {
            return {
                ...project,
                ...project.languages[language],
                projectIndex: index
            };
        });

    renderFavorites(
        localizedProjects
    );

    renderCategories(
        localizedProjects
    );

    renderTimeline(
        localizedProjects
    );

    updateTableOfContent(
        localizedProjects
    );

    initializeTimelineLight();

    initializeTableOfContentScroll();
}

// DATE FUNCTIONS
// Create a local date without timezone conversion
function createProjectDate(dateString) {
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

// Get only the year from the project end date
function getProjectYear(project) {
    const date =
        createProjectDate(
            project.endDate
        );

    return date.getFullYear();
}

// Format a complete date
function formatProjectDate(dateString) {
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
function getProjectDuration(project) {
    if (
        !project.startDate ||
        !project.endDate
    ) {
        return "";
    }

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

    // Less than one week
    if (totalDays < 7) {
        if (totalDays === 1) {
            return `1 ${text.day}`;
        }

        return `${totalDays} ${text.days}`;
    }

    // Less than one month
    if (totalDays < 30) {
        const weeks =
            Math.round(
                totalDays / 7
            );

        if (weeks === 1) {
            return `1 ${text.week}`;
        }

        return `${weeks} ${text.weeks}`;
    }

    // Calculate months
    const months =
        (
            (
                end.getFullYear() -
                start.getFullYear()
            ) * 12
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

    // Calculate years
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

    let yearText =
        text.years;

    let monthText =
        text.months;

    if (years === 1) {
        yearText =
            text.year;
    }

    if (remainingMonths === 1) {
        monthText =
            text.month;
    }

    return (
        `${years} ${yearText}, ` +
        `${remainingMonths} ${monthText}`
    );
}

// DESCRIPTION PREVIEW
function createDescription(
    description,
    projectIndex,
    wordLimit =
        FAVORITE_DESCRIPTION_WORD_LIMIT
) {
    const language =
        getCurrentLanguage();

    const text =
        uiText[language];

    if (!description) {
        return `
            <div class="project-description-wrapper">
                <p class="project-description"></p>
            </div>
        `;
    }

    const paragraphs =
        Array.isArray(description)
            ? description
            : [description];

    const fullDescription =
        paragraphs.join(" ");

    const words =
        fullDescription
            .trim()
            .split(/\s+/);

    // No expansion needed
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
                                ${paragraph}${index === paragraphs.length - 1 ? `
                                    <button
                                        type="button"
                                        class="description-expand"
                                        data-project-index="${projectIndex}">
                                        ${text.collapse}
                                    </button>
                                ` : ""}
                            </p>
                        `;
                    }
                ).join("")}
            </div>
        </div>
    `;
}

// DESCRIPTION EXPAND
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

        const expanded =
            wrapper.classList.contains(
                "expanded"
            );

        if (expanded) {
            wrapper.classList.remove(
                "expanded"
            );
        } else {
            wrapper.classList.add(
                "expanded"
            );
        }
    }
);