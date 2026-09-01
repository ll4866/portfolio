
// TIMELINE
function renderTimeline( localizedProjects) {
    const container = document.getElementById( "timeline-list" );
    const language = getCurrentLanguage();
    const text = uiText[language];

    // SORT BY END DATE FROM NEWEST TO OLDEST
    const sortedProjects = [...localizedProjects]
        .sort( function (a, b) {
            return ( createProjectDate( b.endDate ) - createProjectDate( a.endDate ));
        });

    // CREATE ENTRY
    sortedProjects.forEach( function (project) {
        const endDate = createProjectDate( project.endDate );
        let month;

        // BASED ON LANGUAGE
        if (language === "zh") {
            month = endDate.toLocaleDateString(
                "zh-CN",
                { month: "short"}
            );
        } else if (
            language === "pt"
        ) {
            month = endDate.toLocaleDateString(
                "pt-BR",
                {month: "short"}
            );
        } else {
            month = endDate.toLocaleDateString(
                "en-US",
                {month: "short"}
            );
        }

        // GET THE RPOJECT DATA
        const day = endDate.getDate();
        const year = endDate.getFullYear();
        const element = document.createElement( "article" );

        element.className = "timeline-project";
        element.id = `timeline-project-${project.projectIndex}`;
        element.dataset.projectIndex = project.projectIndex;

        // BUILD THE CONTENT
        element.innerHTML = `
            <div class="timeline-date">
                <span class="timeline-year"> ${year} </span>
            </div>
            
            <div class="timeline-dot"></div>
            
            <div class="timeline-content">
                <div class="timeline-day"> ${month} ${day} </div>

                <div class="timeline-project-content">
                    <div class="timeline-image">
                        <img src="${project.image}" alt="${project.title}">
                    </div>

                    <div class="timeline-information">
                        <h3> ${project.title} </h3>

                        ${createDescription(
                            project.description,
                            project.projectIndex,
                            FAVORITE_DESCRIPTION_WORD_LIMIT
                        )}
                        
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
                        
                        <a href="${project.link}" class="more-info"> ${text.moreInfo} </a>
                    </div>
                </div>
            </div>`;

            // ATTACH TO THE THE TIMELINE
            container.appendChild(element);
        }
    );
}

// TIMELINE MOUSE GLOW
function initializeTimelineLight() {
    const timeline = document.querySelector( ".timeline" );

    // HIDE THE LIGHT WHEN MOUSE IS OUTSIDE TIMELINE CONTAINER
    timeline.style.setProperty( "--timeline-light-x", "-100%");
    timeline.style.setProperty( "--timeline-light-y", "-100%");
    
    // ACTIVATE THE LIGHT WHEN MOUSE IS INSIDE TIMELINE CONTAINER
    timeline.addEventListener( "pointerenter", function () {
        timeline.classList.add( "timeline-light-active" );
    });

    // MOVE THE LIGHT TO FOLLOW MOUSE
    timeline.addEventListener( "pointermove", function (event) {
        const rect = timeline.getBoundingClientRect();
        const x = (( event.clientX - rect.left ) / rect.width ) * 100;
        const y = (( event.clientY - rect.top ) / rect.height ) * 100;

        timeline.style.setProperty( "--timeline-light-x", x + "%" );
        timeline.style.setProperty( "--timeline-light-y", y + "%" );
    });

    // HIDE THE LIGHT WHEN THE MOUSE LEAVES TIMELINE CONTAINER
    timeline.addEventListener( "pointerleave", function () {
        timeline.classList.remove("timeline-light-active");
        timeline.style.setProperty("--timeline-light-x", "-100%");
        timeline.style.setProperty("--timeline-light-y", "-100%");
    });
}