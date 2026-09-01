
// CATEGORIES
function renderCategories( localizedProjects ) {
    const container = document.getElementById( "category-list" );

    // GET CURRENT LANGUAGE
    const language = getCurrentLanguage();
    const text = uiText[language];

    // STORE CURRENT CATEGORIES
    container.innerHTML = "";
    const categories = [];
    localizedProjects.forEach( function (project) {
        project.categories.forEach( function (category) {
            if (!categories.includes( category )) {
                categories.push( category );
            }
        });
    });

    // CREATE CATEGORY GALLERY
    // FOR EACH CATEGORY DO THE FOLLOWING:
    categories.forEach( function (category) {
        const column = document.createElement( "div" );
        column.className = "category-column";
        column.id = `category-${createCategoryId(category)}`;
        column.dataset.category = category;
        
        // CATEGORY HEADER
        column.innerHTML = `
            <h3>${category}</h3>
            <div class="category-projects"></div>
        `;

        // FIND PROJECTS OF THIS CATEGORY
        const projectContainer = column.querySelector( ".category-projects" );
        localizedProjects
            .filter( function (project) {
                return project.categories.includes(category);
            })

            // PROJECT INFORMATION
            .forEach( function (project) {
                const element = document.createElement( "article" );
                element.className = "category-project";
                element.innerHTML = `
                    <img src="${project.image}" alt="${project.title}" >

                    <span class="project-year"> ${getProjectYear(project)} </span>

                    <h4> ${project.title} </h4>

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
                `;

                // PLACE PROJECT IN THE CATEGORY
                projectContainer.appendChild( element );
            });

        // ADD CATEGORY TO PAGE
        container.appendChild( column );
    });

    // SPECIAL EFFECTS
    initializeCategoryLight();
    initializeCategoryTilt();
}

// CATEGORY PROJECT LIGHT
function initializeCategoryLight() {
    const categoryProjects = document.querySelectorAll( ".category-project" );

    // FOR EACH PROJECT LIGHT EFFECT
    categoryProjects.forEach( function (project) {
        // WHEN MOUSE INSIDE PROJECT CARD
        // APPLY LIGHT EFFECT
        project.addEventListener( "pointermove", function (event) {
            const rect = project.getBoundingClientRect();
            const x = (( event.clientX - rect.left ) / rect.width) * 100;
            const y = (( event.clientY - rect.top ) / rect.height) * 100;

            project.style.setProperty( "--light-x", x + "%" );
            project.style.setProperty( "--light-y", y + "%" );
        });

        // WHEN MOUSE OUTSIDE PROJECT CARD
        // LIGHT EFFECT IS ON DEFAULT
        project.addEventListener( "pointerleave", function () {
            project.style.setProperty( "--light-x", "-100%" );
            project.style.setProperty( "--light-y", "-100%" );
        });
    });
}

// CATEGORY PROJECT TILT
function initializeCategoryTilt() {
    const categoryProjects = document.querySelectorAll( ".category-project" );

    // FOR EACH PROJECT
    categoryProjects.forEach( function (project) {
        // WHEN MOUSE IS INSIDE PROJECT CARD
        // APPLY TILT EFFECT
        project.addEventListener( "mousemove", function (event) {
            const rect = project.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY ) * -6;
            const rotateY = ((x - centerX) / centerX ) * 6;
            project.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
        });

        // WHEN MOUSE IS OUTSIDE PROJECT CARD
        // DEFAULT TILT EFFECT
        project.addEventListener( "mouseleave", function () {
            project.style.transform = "";
        });
    });
}