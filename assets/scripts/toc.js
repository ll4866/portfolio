/* Table of content */
document.addEventListener(
    "DOMContentLoaded",
    function () {

        initializeTableOfContent();
        initializeTableOfContentScroll();

    }
);

/* Update table of content */
function updateTableOfContent(projectList) {

    const container =
        document.getElementById(
            "toc-project-list"
        );

    if (!container) {
        return;
    }

    container.innerHTML = "";

projectList.forEach(function (project) {

    const link =
        document.createElement("a");

    link.className =
        "toc-project";

    link.href =
        `#project-${project.projectIndex}`;

    link.dataset.projectIndex =
        project.projectIndex;

    link.textContent =
        project.title;

    container.appendChild(link);

});

    updateTableOfContentScroll();

}

/* Table of content appearance */
function initializeTableOfContent() {

    const toc =
        document.getElementById(
            "table-of-content"
        );

    const trigger =
        document.getElementById(
            "toc-trigger"
        );

    if (!toc || !trigger) {
        return;
    }

    if (window.innerWidth <= 700) {
        return;
    }

    let hideTimeout;

    function showToc() {

        if (window.innerWidth <= 700) {
            return;
        }

        clearTimeout(hideTimeout);

        toc.classList.add(
            "toc-active"
        );

        document.body.classList.add(
            "toc-visible"
        );

    }

    function hideToc() {

        hideTimeout =
            setTimeout(function () {

                if (
                    !toc.matches(":hover") &&
                    !trigger.matches(":hover")
                ) {

                    toc.classList.remove(
                        "toc-active"
                    );

                    document.body.classList.remove(
                        "toc-visible"
                    );

                }

            }, 250);

    }

    trigger.addEventListener(
        "mouseenter",
        showToc
    );

    trigger.addEventListener(
        "mouseleave",
        hideToc
    );

    toc.addEventListener(
        "mouseenter",
        showToc
    );

    toc.addEventListener(
        "mouseleave",
        hideToc
    );

}

/* Table of content scroll behavior */
function initializeTableOfContentScroll() {

    if (window.innerWidth <= 700) {
        return;
    }

    let scrollTimeout;

    window.addEventListener(
        "scroll",
        function () {

                    if (window.innerWidth <= 700) {
            return;
        }
        
            const toc =
                document.getElementById(
                    "table-of-content"
                );

            if (!toc) {
                return;
            }

            toc.classList.add(
                "toc-active"
            );

            document.body.classList.add(
                "toc-visible"
            );

            clearTimeout(
                scrollTimeout
            );

            scrollTimeout =
                setTimeout(function () {

                    if (
                        !toc.matches(":hover") &&
                        !document
                            .getElementById(
                                "toc-trigger"
                            )
                            ?.matches(":hover")
                    ) {

                        toc.classList.remove(
                            "toc-active"
                        );

                        document.body.classList.remove(
                            "toc-visible"
                        );

                    }

                }, 700);

            updateTableOfContentScroll();

        },
        {
            passive: true
        }
    );

    window.addEventListener(
        "resize",
        updateTableOfContentScroll
    );

    updateTableOfContentScroll();

}

/* Update active table of content item */
function updateTableOfContentScroll() {

    const toc =
        document.getElementById(
            "table-of-content"
        );

    if (!toc) {
        return;
    }

    const sections = [
        {
            element:
                document.getElementById(
                    "about-section"
                ),
            link:
                toc.querySelector(
                    '.toc-section[href="#about-section"]'
                )
        },
        {
            element:
                document.getElementById(
                    "projects-section"
                ),
            link:
                toc.querySelector(
                    '.toc-section[href="#projects-section"]'
                )
        },
        {
            element:
                document.getElementById(
                    "experience-section"
                ),
            link:
                toc.querySelector(
                    '.toc-section[href="#experience-section"]'
                )
        },
        {
            element:
                document.getElementById(
                    "education-section"
                ),
            link:
                toc.querySelector(
                    '.toc-section[href="#education-section"]'
                )
        },
        {
            element:
                document.getElementById(
                    "skills-section"
                ),
            link:
                toc.querySelector(
                    '.toc-section[href="#skills-section"]'
                )
        }
    ].filter(function (section) {

        return (
            section.element &&
            section.link
        );

    });

    if (!sections.length) {
        return;
    }

    const referencePoint =
        window.innerHeight * 0.35;

    let currentSection =
        sections[0];

    sections.forEach(function (section) {

        const rect =
            section.element.getBoundingClientRect();

        if (
            rect.top <=
            referencePoint
        ) {

            currentSection =
                section;

        }

    });

    sections.forEach(function (section) {

        section.link.classList.remove(
            "active"
        );

    });

    currentSection.link.classList.add(
        "active"
    );

    updateActiveProject();

}

/* Update active project */
function updateActiveProject() {

    const projectsSection =
        document.getElementById(
            "projects-section"
        );

    const toc =
        document.getElementById(
            "table-of-content"
        );

    if (
        !projectsSection ||
        !toc
    ) {
        return;
    }

    const projects =
        document.querySelectorAll(
            ".project-card"
        );

    const tocProjects =
        document.querySelectorAll(
            ".toc-project"
        );

    if (
        !projects.length ||
        !tocProjects.length
    ) {
        return;
    }

    const sectionRect =
        projectsSection.getBoundingClientRect();

    const referencePoint =
        window.innerHeight * 0.35;

    const insideProjects =
        sectionRect.top <=
        referencePoint &&
        sectionRect.bottom >
        referencePoint;

    if (!insideProjects) {

        tocProjects.forEach(function (link) {

            link.classList.remove(
                "active"
            );

        });

        return;
    }

    let currentProject =
        null;

    projects.forEach(function (project) {

        const rect =
            project.getBoundingClientRect();

        if (
            rect.top <=
            referencePoint
        ) {

            currentProject =
                project;

        }

    });

    if (!currentProject) {

        currentProject =
            projects[0];

    }

    const projectIndex =
        currentProject.dataset.projectIndex;

    const activeLink =
        toc.querySelector(
            `.toc-project[data-project-index="${projectIndex}"]`
        );

    if (!activeLink) {
        return;
    }

    tocProjects.forEach(function (link) {

        link.classList.remove(
            "active"
        );

    });

    activeLink.classList.add(
        "active"
    );

    centerTocItem(
        activeLink
    );

}

/* Center active table of content item */
function centerTocItem(item) {

    const tocList =
        document.getElementById(
            "toc-project-list"
        );

    if (
        !tocList ||
        !item
    ) {
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