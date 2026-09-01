
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
        expand: "(expand)",
        collapse: "(collapse)",
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
        expand: "(更多)",
        collapse: "(收起)",
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
        expand: "(Ver mais)",
        collapse: "(Ver menos)",
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

// LOAD PAGE WHEN READY
document.addEventListener("DOMContentLoaded", function () {
    renderProjects();
});

// RENDER ALL PROJECTS
function renderProjects() {
    // PROJECT LIST
    const language = getCurrentLanguage();
    const localizedProjects =projects.map(function (project, index) {
        return {
            ...project,
            ...project.languages[language],
            projectIndex: index
        };
    });

    // SEND THE PROJECT LIST TO EACH GALLERY
    renderFavorites(localizedProjects);
    renderCategories(localizedProjects);
    renderTimeline(localizedProjects);

    // UPDATE TOC BASED ON DATA LIST
    updateTableOfContent(localizedProjects);

    // INTERACTIVE EFFECTS
    initializeTimelineLight();
    initializeTableOfContentScroll();
}

// DATE FUNCTIONS
function createProjectDate(dateString) {
    // RETURN A DEFAULT DATE WHEN NO DATE IS PROVIDED
    if (!dateString) {
        return new Date(0);
    }

    // CONVERT THE DATE STRING INTO YEAR, MONTH, AND DAY
    const parts = dateString.split("-");

    // CREATE THE DATE WITHOUT TIMEZONE CONVERSION
    return new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2])
    );
}

// GET THE PROJECT YEAR (END YEAR)
function getProjectYear(project) {
    const date = createProjectDate(project.endDate);
    return date.getFullYear();
}

// FORMAT PROJECT DATE
function formatProjectDate(dateString) {
    const date = createProjectDate( dateString );
    const language = getCurrentLanguage();

    // FORMAT BASED ON LANGUAGE
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
    const language = getCurrentLanguage();
    const text = uiText[language];
    const start = createProjectDate(project.startDate);
    const end = createProjectDate(project.endDate);

    // CALCULATE TOTAL NUM OF DAYS
    const totalDays = Math.round((end - start) / (1000 * 60 * 60 * 24)) + 1;

    // DISPLAY DAYS WHEN SHORTER THAN A WEEK
    if (totalDays < 7) {
        if (totalDays === 1) {
            return `1 ${text.day}`;
        }
        return `${totalDays} ${text.days}`;
    }

    // DISPLAY WEEKS WHEN SHORTER THAN A MONTH 
    const weeks = Math.round(totalDays / 7 );
    if (totalDays < 30) {
        // SINGULAR VS PLURAL
        if (weeks === 1) {
            return `1 ${text.week}`;
        }
        return `${weeks} ${text.weeks}`;
    }

    // CALCULATE THE NUMBER OF COMPLETE MONTHS
    const months = 
        (( end.getFullYear() - start.getFullYear() ) * 12) +
        ( end.getMonth() - start.getMonth());

    // DISPLAY MONTHS WHEN SHORTER THAN A YEAR
    if (months < 12) {
        // SINGULAR VS PLURAL
        if (months === 1) {
            return `1 ${text.month}`;
        }
        return `${months} ${text.months}`;
    }

    // CALCULATE THE NUMBER OF COMPLETE YEARS
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    if (remainingMonths === 0) {
        // SINGULAR VS PLURAL
        if (years === 1) {
            return `1 ${text.year}`;
        }
        return `${years} ${text.years}`;
    }

    // COMBINE REMAINDER
    let yearText = text.years;
    let monthText = text.months;
    if (years === 1) {
        yearText = text.year;
    }
    if (remainingMonths === 1) {
        monthText = text.month;
    }
    return ( 
        `${years} ${yearText}, ` +
        `${remainingMonths} ${monthText}`
    );
}

// DESCRIPTION PREVIEW
function createDescription( description, projectIndex, wordLimit = FAVORITE_DESCRIPTION_WORD_LIMIT) {
    const language = getCurrentLanguage();
    const text = uiText[language];

    // CHECK HOW MANY PARAGRPAHS
    let paragraphs;
    if (Array.isArray(description)) {
        paragraphs = description;
    } else {
        paragraphs = [description];
    }

    // COMBINE INTO ONE PARAGRAPH
    const fullDescription = paragraphs.join(" ");
    const words = fullDescription
            .trim()
            .split(/\s+/);

    // SHOW COMPLETE DESCRIPTION IF IT FITS LIMIT
    if (words.length <= wordLimit) {
        return `
            <div class="project-description-wrapper">
                ${paragraphs.map( function (paragraph) {
                    return `<p class="project-description"> ${paragraph} </p>`;
                }).join("")}
            </div>
        `;
    }

    // CREATE SHORT DESCRIPTION VERSION 
    const preview = words
        .slice( 0, wordLimit )
        .join(" ");

    return `
        <div class="project-description-wrapper">
            <div class="description-short">
                <p class="project-description">
                    ${preview}...
                    <button type="button" class="description-expand"
                        data-project-index="${projectIndex}">
                        ${text.expand}
                    </button>
                </p>
            </div>

            <div class="description-full">
                ${paragraphs.map(function ( paragraph, index) {
                    return `
                        <p class="project-description">
                            ${paragraph}${index === paragraphs.length - 1 ? `
                                <button type="button" class="description-expand"
                                    data-project-index="${projectIndex}">
                                    ${text.collapse}
                                </button>
                            ` : ""}
                        </p>
                    `;
                }).join("")}
            </div>
        </div>
    `;
}

// DESCRIPTION EXPAND
document.addEventListener("click", function (event) {
    /// CHECK THE CLICK BUTTON IF IT IS EXPAND/COLLAPSE
    const button = event.target.closest(".description-expand");
    if (!button) {
        return;
    }

    // SWITCH BETWEEN DESCRIPTIONS EXPAND/COLLAPSE
    const wrapper = button.closest(".project-description-wrapper");
    const expanded = wrapper.classList.contains("expanded");
    if (expanded) {
        wrapper.classList.remove("expanded");
    } else {
        wrapper.classList.add("expanded");
    }
});