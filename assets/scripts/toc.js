
// TABLE OF CONTENT
function updateTableOfContent(localizedProjects) {
    // SELECT THE TABLE OF CONTENT LIST
    const container = document.getElementById("toc-project-list");
    if (!container) {
        return;
    }

    // FIND THE CURRENT PROJECT TAB VISIBLE
    const activeTab = document.querySelector( ".project-tab.active");
    if (!activeTab) {
        return;
    }
    const target = activeTab.getAttribute("data-target");
    container.innerHTML = "";

    // FAVORITES GALLERY
    if (target === "favorites-view") {
        // GET ONLY THE PROJECTS SHOWN ON THE PAGE RANGE
        const start = currentFavoritePage * FAVORITE_PROJECTS_PER_PAGE;
        const end = start + FAVORITE_PROJECTS_PER_PAGE;
        const visibleProjects = localizedProjects.slice( start,end );

        visibleProjects.forEach(
            function (project) {
                const link = document.createElement("a");
                link.className = "toc-project";
                link.href = `#favorite-project-${project.projectIndex}`;
                link.dataset.projectIndex = project.projectIndex;
                link.innerHTML = `
                    <span class="toc-number">
                        ${String(project.projectIndex + 1 ).padStart(2, "0")}
                    </span>

                    <span class="toc-title"> ${project.title}</span>
                `;

                container.appendChild(link);
            }
        );

        return;
    }

    // CATEGORY GALLERY
    if (target === "category-view") {
        const categories = [];

        // COLLECT CATEGORY OPTIONS
        localizedProjects.forEach(function (project) {
            project.categories.forEach(function (category) {
                if (!categories.includes(category)) {
                    categories.push(category);
                }
            });
        });

        // CREATE LINK FOR EACH CATEGORY
        categories.forEach(function (category) {
            const link = document.createElement("a");
            link.className = "toc-project";
            link.href = `#category-${createCategoryId(category)}`;
            link.dataset.category = category;
            link.textContent = category;
            container.appendChild(link);
        });

        return;
    }

    // TIMELINE
    if (target === "timeline-view") {
        // SORT PROJECT BY END DATE
        const sortedProjects = [...localizedProjects]
            .sort(function (a, b) {
                return (createProjectDate(b.endDate) - createProjectDate(a.endDate));
            });

        // CREATE TOC LINKS
        sortedProjects.forEach(function (project) {
            const link = document.createElement("a");
            link.className = "toc-project";
            link.href = `#timeline-project-${project.projectIndex}`;
            link.dataset.projectIndex = project.projectIndex;
            link.textContent = project.title;
            container.appendChild(link);
        });
    }
}

// UPDATE TABLE OF CONTENTS AFTER TAB CHANGE
document.addEventListener("DOMContentLoaded", function () {
    const tabs = document.querySelectorAll(".project-tab");
    
    tabs.forEach(function (tab) {
        tab.addEventListener("click",function () {
            const language = getCurrentLanguage();
            const localizedProjects = 
                projects.map(function (project,index) {
                    return {
                        ...project,
                        ...project.languages[language],
                        projectIndex: index
                    };
                });
                
                updateTableOfContent(localizedProjects);
        });
    });
});

// CREATE A VALID ID FOR EACH CATEGORY
function createCategoryId(category) {
    return category
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\u4e00-\u9fff]+/g,"-")
        .replace(/^-+|-+$/g,"");
}

// TABLE OF CONTENT SCROLL SYNC
function initializeTableOfContentScroll() {
    const toc = document.querySelector( ".table-of-content" );
    const tocProjects = document.querySelectorAll( ".toc-project");
    let ticking = false;

    // HIGHLIGHT THE PROJECT VISIBLE
    function updateActiveProject() {
        const activeTab = document.querySelector( ".project-tab.active" );
        if (!activeTab) {
            ticking = false;
            return;
        }

        // WHICH GALLERY IT IS ON
        const target = activeTab.getAttribute( "data-target");
        let projectsSelector;
        if ( target === "favorites-view") {
            projectsSelector = ".favorite-project";
        } else if ( target === "category-view") {
            projectsSelector = ".category-column";
        } else if ( target === "timeline-view") {
            projectsSelector = ".timeline-project";
        } else {
            ticking = false;
            return;
        }

        // FIND THE PROJECT CLOSEST TO THE CENTER OF THE SCREEN
        const projectsOnPage = document.querySelectorAll( projectsSelector );
        const tocProjects = document.querySelectorAll(".toc-project");
        const viewportCenter = window.innerHeight / 2;

        let closestProject = null;
        let closestDistance = Infinity;

        projectsOnPage.forEach( function (project) {
                const rect = project.getBoundingClientRect();
                const projectCenter = rect.top + rect.height / 2;
                const distance = Math.abs( projectCenter - viewportCenter );

                if ( distance < closestDistance ) {
                    closestDistance = distance;
                    closestProject = project;
                }
            }
        );

        if (!closestProject) {
            ticking = false;
            return;
        }

        // MATCH TO TOC
        const projectIndex = closestProject.dataset.projectIndex;
        const category = closestProject.dataset.category;
        let activeLink = null;
        if (category) {
            activeLink = document.querySelector(`.toc-project[data-category="${CSS.escape(category)}"]`);
        } else if (projectIndex) {
            activeLink = document.querySelector(`.toc-project[data-project-index="${projectIndex}"]`);
        }

        if (!activeLink) {
            ticking = false;
            return;
        }

        // UPDTAE TOC
        const currentActive = document.querySelector(".toc-project.active");
        if (currentActive !== activeLink) {
            tocProjects.forEach(function (link) {
                link.classList.remove("active");
            });
            activeLink.classList.add("active");
            centerTocItem(activeLink);
        }
        ticking = false;
    }

    // PREVENT MULTIPLE SCROLL UPDATE AT ONCE
    function requestUpdate() {
        if (ticking) {
            return;
        }

        ticking = true;
        window.requestAnimationFrame(updateActiveProject);
    }

    // UPDATE LINKS WHEN SCROLLING
    window.addEventListener("scroll", requestUpdate, {passive: true});
    window.addEventListener("resize",requestUpdate);
    requestUpdate();
}

// CENTER ACTIVE TABLE OF CONTENT ITEM
function centerTocItem(item) {
    const tocList = document.getElementById("toc-project-list");

    // STOP IF NOT AVAILABLE
    if (!tocList || !item) {
        return;
    }

    // CALCULATE DISTANCE BTW CURRENT AND TARGET
    const listRect = tocList.getBoundingClientRect();
    const itemRect = item.getBoundingClientRect();
    const itemCenter = itemRect.top + itemRect.height / 2;
    const listCenter = listRect.top + listRect.height / 2;
    const offset = itemCenter - listCenter;

    if (Math.abs(offset) < 1) {
        return;
    }

    // MOVE TO TARGET SCROLL
    tocList.scrollBy({top: offset, behavior: "smooth"});
}

// TABLE OF CONTENT CLICK
document.addEventListener("click", function (event) {
    const link = event.target.closest(".toc-project");

    // PREVENT INSTANT JUMP
    event.preventDefault();

    // GET THE TARGET
    const href = link.getAttribute( "href" );
    if (!href) {
        return;
    }

    const target = document.querySelector(href);
    if (!target) {
        return;
    }

    // CALCULATE TO CENTER TARGET
    const targetRect = target.getBoundingClientRect();
    const targetCenter = targetRect.top + targetRect.height / 2;
    const viewportCenter = window.innerHeight / 2;
    const scrollPosition = window.scrollY + targetCenter - viewportCenter;

    window.scrollTo({ top: scrollPosition, behavior: "smooth"});
    document.querySelectorAll( ".toc-project" ).forEach(function (tocItem) {
        tocItem.classList.remove("active");
    });

    // HIGHLIGHT SELECTED TOC LINK
    link.classList.add( "active" );

    // KEEP SELECTED TOC LINK CENTERED
    centerTocItem(link);
});