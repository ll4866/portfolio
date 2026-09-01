
// FAVORITES
function renderFavorites( localizedProjects ) {
    const list = document.getElementById( "favorites-list");
    
    // CURRENT LANGUAGE
    const language = getCurrentLanguage();
    const text = uiText[language];
    
    // NUMBER OF PAGES
    const totalPages = Math.ceil( localizedProjects.length / FAVORITE_PROJECTS_PER_PAGE );

    // CURRENT PAGE RANGE
    const start = currentFavoritePage * FAVORITE_PROJECTS_PER_PAGE;
    const end = start + FAVORITE_PROJECTS_PER_PAGE;
    const visibleProjects = localizedProjects.slice( start, end );

    // GET PROJECTS WITHIN THIS RANGE
    list.innerHTML = visibleProjects
        // CREATE PROJECT CARD
        .map( function ( project, index) {
            const image = `
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title}"> 
                </div>
            `;

            const information = `
                <div class="project-information">
                    <div class="project-meta">
                        <span class="favorite-rank">
                            ${text.favorite} #${project.projectIndex + 1}
                        </span>

                        <span class="project-year"> ${getProjectYear(project)} </span>
                    </div>

                    <h3> ${project.title} </h3>

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
                    
                    <a class="more-info" href="${project.link}"> ${text.moreInfo} </a>
                </div>
            `;

            // ALTERNATING ORDER OF IMAGE & DESCRIPTION
            if (index % 2 === 0) {
                return `
                    <article class="favorite-project" id="favorite-project-${project.projectIndex}" 
                        data-project-index="${project.projectIndex}">
                        ${image}
                        ${information}
                    </article>
                `;
            }
            return `
                <article class="favorite-project"
                    id="favorite-project-${project.projectIndex}"
                    data-project-index="${project.projectIndex}">
                    ${information}
                    ${image}
                </article>
            `;
        })
        .join("");

    // CREATE FAVORITE STICKY BOTTOM PAGES RANGE
    renderFavoritePagination( localizedProjects.length );
    
    // SPECIAL EFFECT
    initializeFavoriteLight();
    initializeFavoriteTilt();
}

// FAVORITES PAGE RANGES
function renderFavoritePagination( totalProjects ) {
    // SELECT PAGE RANGE
    const oldPagination = document.querySelector( ".favorites-pagination" );

    // REMOVE OLD PAGE RANGE
    if (oldPagination) {
        oldPagination.remove();
    }

    // CALCULATE THE TOTAL NUMBER OF PAGES
    const totalPages = Math.ceil( totalProjects / FAVORITE_PROJECTS_PER_PAGE );

    // CURRENT LANGUAGE
    const language = getCurrentLanguage();
    const text = uiText[language];
    
    // CREATE STICKY CONTAINER FOR PAGE RANGES
    const pagination = document.createElement( "div" );
    pagination.className = "favorites-pagination";
    let html = "";

    // PREVIOUS PAGE BUTTON
    html += ` 
        <button class="favorite-page-arrow" data-page="previous" type="button" 
            aria-label="${text.previous}">
            ${text.previous}
        </button>`;

    // PAGE RANGE BUTTONS
    for ( let page = 0; page < totalPages; page++ ) {
        const start = page * FAVORITE_PROJECTS_PER_PAGE + 1;
        const end = Math.min(( page + 1 ) * FAVORITE_PROJECTS_PER_PAGE, totalProjects );

        html += `
            <button class="favorite-page" data-page="${page}" type="button">
                ${start}–${end}
            </button>`;

        if ( page < totalPages - 1 ) {
            html += `<span class="favorite-page-separator"> | </span>`;
        }
    }

    // NEXT PAGE BUTTON
    html += `
        <button class="favorite-page-arrow" data-page="next" type="button"
            aria-label="${text.next}">
            ${text.next}
        </button>
    `;
    pagination.innerHTML = html;

    // CURRENT PAGE BUTTON SHOW AS ACTIVE
    const activePage = pagination.querySelector( `.favorite-page[data-page="${currentFavoritePage}"]`);
    if (activePage) {
        activePage.classList.add( "active" );
    }

    // SHOWCASE THIS STICKY CONTAINER
    const list = document.getElementById( "favorites-list" );
    if (list) {
        list.insertAdjacentElement( "afterend", pagination );
    }
}

// WHEN CLICK
document.addEventListener( "click", function (event) {
    // GO TO THE CORRESPONDING PAGE RANGE
    const button = event.target.closest( ".favorite-page, .favorite-page-arrow");
    const page = button.dataset.page;
    const totalPages = Math.ceil( projects.length / FAVORITE_PROJECTS_PER_PAGE );
    if ( page === "previous" ) {
        if ( currentFavoritePage > 0 ) {
            currentFavoritePage--;
        }
    } else if ( page === "next" ) {
        if ( currentFavoritePage < totalPages - 1 ) {
            currentFavoritePage++;
        }
    } else {
        currentFavoritePage = Number(page);
    }

    // BASED ON CURRENT LANGUAGE
    const language = getCurrentLanguage();
    const localizedProjects = projects.map( function ( project, index ) {
        return {
            ...project,
            ...project.languages[language],
            projectIndex: index
        };
    });

    // UPDATE INFORMATION
    renderFavorites(localizedProjects);
    updateTableOfContent(localizedProjects);
    initializeTableOfContentScroll();

    // GO TO SELECTED PROJECT IN TOC
    const favoritesView = document.getElementById("favorites-view");
    if ( favoritesView ) {
        const rect = favoritesView.getBoundingClientRect();

        window.scrollTo({ 
            top: window.scrollY + rect.top - 100,
            behavior: "smooth"
        });
    }
});

// FAVORITE PROJECT LIGHT EFFECT
function initializeFavoriteLight() {
    const favoriteProjects = document.querySelectorAll( ".favorite-project" );
    favoriteProjects.forEach( function (project) {
        project.style.setProperty( "--light-x", "-100%" );
        project.style.setProperty( "--light-y", "-100%" );
        
        // WHEN MOUSE INSIDE PROJECT, 
        // ACTIVATE LIGHT EFFECT BASED ON POSITION
        project.addEventListener( "pointermove", function (event) {
            const rect = project.getBoundingClientRect();
            const x = (( event.clientX - rect.left ) / rect.width ) * 100;
            const y = (( event.clientY - rect.top ) / rect.height ) * 100;

            project.style.setProperty( "--light-x", x + "%" );
            project.style.setProperty( "--light-y", y + "%" );
        });

        // WHEN MOUSE OUTSIDE PROJECT
        // LIGHT EFFECT OFF
        project.addEventListener( "pointerleave", function () {
            project.style.setProperty( "--light-x", "-100%" );
            project.style.setProperty( "--light-y", "-100%" );
        });
    });
}

// FAVORITES SECTION - PROJECT CARD TILT
function initializeFavoriteTilt() {
    const favoriteProjects = document.querySelectorAll( ".favorite-project" );
    favoriteProjects.forEach( function (project) { 
        // WHEN MOUSE IF INSIDE PROJECT
        // UPDATE TILT
        project.addEventListener("mousemove", function (event) {
            const rect = project.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -2;
            const rotateY = ((x - centerX) / centerX) * 2;
            project.style.transform =
                `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
        });
        
        // WHEN MOUSE IS OUTSIDE PROJECT
        // TITL IS OFF
        project.addEventListener("mouseleave", function () {
            project.style.transform = "";
        });
    });
}