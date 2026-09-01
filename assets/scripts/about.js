
// ABOUT
document.addEventListener( "DOMContentLoaded", function () {
    // SELECT ABOUT ELEMENTS
    const about = document.querySelector(".about");
    const aboutContent = document.querySelector(".about-content");
    const aboutBack = document.querySelector(".about-back");

    // MOBILE LAYOUT
    const mobileBreakpoint = window.matchMedia("(max-width: 700px)");

    // CHECK FOR MOBILE MODE
    function isMobileLayout() { 
        if ( mobileBreakpoint.matches) {
            return true;
        }
        return false;
    }

    // CHECK IF MOUSE IS INSIDE CONTACT CARD
    function isInsideContactForm(target) {
        const contactForm = target.closest( ".contact-form-container");
        if (contactForm) {
            return true;
        }
        return false;
    }

    // CHECK IF MOUSE IS AT THE CONTENT IN THE CONTACT CARD
    function isInteractiveElement(target) {
        const interactiveElement = target.closest( "a, button, input, textarea, select, label");
        if (interactiveElement) {
            return true;
        }
        return false;
    }

    // RESET ELEMENT TRANSFORMATION
    function resetTransform(element) {
        if (!element) {
            return;
        }

        element.style.transform = "perspective(1000px) " + "rotateX(0deg) " + "rotateY(0deg)";
    }

    // RESET DESKTOP CARD LIGHT
    function resetAboutLight() {
        about.style.setProperty( "--light-x", "-100%" );
        about.style.setProperty( "--light-y", "-100%" );
    }

    // RESET CARD LIGHT
    function resetCardLight(card) {
        if (!card) {
            return;
        }

        // RESET FRONT & BACK CARD LIGHT
        if ( card === aboutContent ) {
            card.style.setProperty( "--content-light-x", "-100%" );
            card.style.setProperty( "--content-light-y", "-100%" );
        } else {
            card.style.setProperty( "--back-light-x", "-100%" );
            card.style.setProperty( "--back-light-y", "-100%" );
        }
    }

    // RESET ALL INTERACTION
    function resetAllInteraction() {
        resetAboutLight();
        resetTransform( about );
        resetCardLight( aboutContent );
        resetCardLight( aboutBack );
        resetTransform( aboutContent );
        resetTransform( aboutBack );
    }

    // WHEN CARD CLICKED
    about.addEventListener("click", function (event) {
        // DEACTIVATE CONTACT FORM
        if ( isInsideContactForm( event.target )) {
            return;
        }
        
        // DEACTIVATE FILL IN ELEMENTS 
        if ( isInteractiveElement( event.target )) {
            return;
        }
        
        // FLIP CARD
        about.classList.toggle("flipped");
    });

    // DESKTOP MODE - MOUSE
    about.addEventListener( "pointermove", function (event) {
        // MAKE SURE NOT MOBILE MODE
        if ( isMobileLayout() ) {
            return;
        }

        // TURN OFF CONTACT FORM INTERACTION
        if ( isInsideContactForm( event.target )) {
            return;
        }

        // CALCULATE CARD POSITION AND MOUSE DISTANCE
        const rect = about.getBoundingClientRect();
        const x = (( event.clientX - rect.left ) / rect.width ) * 100;
        const y = (( event.clientY - rect.top ) / rect.height ) * 100;

        // UPDATE CARD LIGHT
        about.style.setProperty( "--light-x", x + "%" );
        about.style.setProperty( "--light-y", y + "%" );

        // UPDATE CARD TILT
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateY = (( event.clientX - rect.left - centerX ) / centerX ) * 3;
        const rotateX = (( centerY - ( event.clientY - rect.top )) / centerY ) * 3;
        about.style.transform = 
            "perspective(1000px) " + 
            "rotateX(" + rotateX + "deg) " + 
            "rotateY(" + rotateY + "deg)";
    });

    // IF DESKTOP MOUSE LEAVE ABOUT SECTION
    about.addEventListener( "pointerleave", function () {
        // MAKE SURE NOT MOBILE MODE
        if ( isMobileLayout() ) {
            return;
        }

        // RESET EFFECTS
        resetAboutLight();
        resetTransform( about );
    });

    // STORE CARD POSITIONS & INFORMATION
    const cards = document.querySelectorAll( ".about-content, .about-back" );
    let cardRects = [];
    let activeCard = null;

    function updateCardRects() {
        cardRects = [];
        cards.forEach( function (card) {
            resetTransform( card );
            const rect = card.getBoundingClientRect();
            cardRects.push({
                card: card,
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height
            });
        });
    }

    // FIND MOBILE CARD POINTER POSITION
    function getCardAtPosition( clientX, clientY ) {
        // CHECK IF POINTER IS INSIDE CARD
        for ( const card of cards ) {
            const rect = card.getBoundingClientRect();
            if (
                (clientX >= rect.left) &&
                (clientX <= rect.left + rect.width) &&
                (clientY >= rect.top) &&
                (clientY <= rect.top + rect.height)
            ) {
                return {
                    card: card,
                    left: rect.left,
                    top: rect.top,
                    width: rect.width,
                    height: rect.height
                };
            }
        }
        return null;
    }

    // MOBILE POINTER MOVE
    document.addEventListener( "pointermove", function (event) {
        // MAKE SURE IT IS NOT DESKTOP MODE
        if (!isMobileLayout()) {
            return;
        }

        // TURN OFF EFFECTS WHEN INSIDE CONTACT FORM
        if (isInsideContactForm( event.target )) {
            if (activeCard) {
                resetCardLight( activeCard );
                resetTransform( activeCard );
                activeCard = null;
            }
            return;
        }

        // TURN OFF EFFECTS WHEN OUTSIDE CARD
        const data = getCardAtPosition( event.clientX, event.clientY );
        if (!data) {
            if (activeCard) {
                resetCardLight( activeCard );
                resetTransform( activeCard );
                activeCard = null;
            }
            return;
        }

        // WHAT SIDE OF THE CARD IS POINTER OVER AT
        const card = data.card;
        if ( activeCard && activeCard !== card ) {
            resetCardLight( activeCard );
            resetTransform( activeCard );
        }
        activeCard = card;

        // UPDATE CARD LIGHT FOR BOTH FRONT AND BACK
        const cardX = ( event.clientX - data.left ) / data.width;
        const cardY = ( event.clientY - data.top ) / data.height;
        const lightX = cardX * 100;
        const lightY = cardY * 100;
        if ( card === aboutContent ) {
            card.style.setProperty( "--content-light-x", lightX + "%" );
            card.style.setProperty( "--content-light-y", lightY + "%" );
        } else {
            card.style.setProperty( "--back-light-x", lightX + "%" );
            card.style.setProperty( "--back-light-y", lightY + "%" );
        }

        // APPLY CARD TILT
        const viewportX = event.clientX / window.innerWidth;
        const viewportY = event.clientY / window.innerHeight;
        const normalizedX = ( viewportX - 0.5 ) * 2;
        const normalizedY = ( 0.5 - viewportY ) * 2;
        const rotateY = normalizedX * 2;
        const rotateX = normalizedY * 2;
        card.style.transform = 
            "perspective(1000px) " + 
            "rotateX(" + rotateX + "deg) " + 
            "rotateY(" + rotateY + "deg)";
    });

    // MOBILE WHEN POINTER LEAVE
    document.addEventListener( "pointerout", function (event) {
        // MAKE SURE IT IS NOT DESKTOP MODE
        if ( !isMobileLayout() ) {
            return;
        }

        // RESET CARD WHEN POINTER LEAVES PAGE
        if ( event.relatedTarget === null ) {
            if (activeCard) {
                resetCardLight( activeCard );
                resetTransform( activeCard );
                activeCard = null;
            }
        }
    });

    // UPDATE CARD POSITIONS WHEN RESIZE SCREEN
    updateCardRects();
    window.addEventListener( "resize", function () {
        if ( isMobileLayout() ) {
            updateCardRects();
        }
    });

    // RESET EVERYTHING WHEN RESIZE SCREEN
    function handleBreakpointChange() {
        resetAllInteraction();
        activeCard = null;
        updateCardRects();
    }
    mobileBreakpoint.addEventListener( "change", handleBreakpointChange );
    resetAllInteraction();
});