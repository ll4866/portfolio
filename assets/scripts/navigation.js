/* Navigation */
document.addEventListener("DOMContentLoaded", function () {

    initializeInternalNavigation();
    initializeTableOfContentNavigation();

});

/* Internal page navigation */
function initializeInternalNavigation() {

    document.addEventListener("click", function (event) {

        const link =
            event.target.closest('a[href^="#"]');

        if (!link) {
            return;
        }

        if (link.classList.contains("toc-project")) {
            return;
        }

        const targetId =
            link.getAttribute("href");

        if (!targetId || targetId === "#") {
            return;
        }

        const target =
            document.querySelector(targetId);

        if (!target) {
            return;
        }

        event.preventDefault();

        target.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

    });

}

/* Table of content navigation */
function initializeTableOfContentNavigation() {

    document.addEventListener("click", function (event) {

        const projectLink =
            event.target.closest(".toc-project");

        if (!projectLink) {
            return;
        }

        event.preventDefault();

        const projectIndex =
            projectLink.dataset.projectIndex;

        if (
            projectIndex === undefined ||
            projectIndex === null
        ) {
            return;
        }

        const project =
            document.querySelector(
                `.project-card[data-project-index="${projectIndex}"]`
            );

        if (!project) {
            return;
        }

        project.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

    });

}