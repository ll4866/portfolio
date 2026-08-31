
// ABOUT
document.addEventListener(
    "DOMContentLoaded",
    function () {
        const about = document.querySelector(".about");
        const aboutContent = document.querySelector(".about-content");
        const aboutBack = document.querySelector(".about-back");

        if (!about) {
            return;
        }

        const mobileBreakpoint = window.matchMedia("(max-width: 700px)");

        function isMobileLayout() { 
            if ( mobileBreakpoint.matches) {
                return true;
            }
            return false;
        }

        function isInsideContactForm(target) {
            const contactForm = target.closest( ".contact-form-container");

            if (contactForm) {
                return true;
            }
            return false;
        }

        function isInteractiveElement(target) {
            const interactiveElement = target.closest( "a, button, input, textarea, select, label");

            if (interactiveElement) {
                return true;
            }
            return false;
        }

        function resetTransform(element) {
            if (!element) {
                return;
            }

            element.style.transform = "perspective(1000px) " + "rotateX(0deg) " + "rotateY(0deg)";
        }

        function resetAboutLight() {
            about.style.setProperty( "--light-x", "-100%" );
            about.style.setProperty( "--light-y", "-100%" );
        }

        function resetCardLight(card) {
            if (!card) {
                return;
            }

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

        // FLIP CARD
        about.addEventListener(
            "click",
            function (event) {
                if ( isInsideContactForm( event.target )) {
                    return;
                }

                if ( isInteractiveElement( event.target )) {
                    return;
                }

                about.classList.toggle("flipped");
            }
        );

        // DESKTOP ABOUT INTERACTION
        about.addEventListener(
            "pointermove",
            function (event) {
                if ( isMobileLayout() ) {
                    return;
                }

                if ( isInsideContactForm( event.target )) {
                    return;
                }

                const rect = about.getBoundingClientRect();
                const x = (( event.clientX - rect.left ) / rect.width ) * 100;
                const y = (( event.clientY - rect.top ) / rect.height ) * 100;

                // LIGHT
                about.style.setProperty( "--light-x", x + "%" );
                about.style.setProperty( "--light-y", y + "%" );

                // TILT
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateY = (( event.clientX - rect.left - centerX ) / centerX ) * 3;
                const rotateX = (( centerY - ( event.clientY - rect.top )) / centerY ) * 3;

                about.style.transform = "perspective(1000px) " + "rotateX(" + rotateX + "deg) " + "rotateY(" + rotateY + "deg)";
            }
        );

        // DESKTOP ABOUT LEAVE
        about.addEventListener(
            "pointerleave",
            function () {
                if ( isMobileLayout() ) {
                    return;
                }

                resetAboutLight();
                resetTransform( about );
            }
        );

        // MOBILE CARD LIGHT + TILT
        const cards = document.querySelectorAll( ".about-content, .about-back" );
        let cardRects = [];
        let activeCard = null;

                // STORE CARD POSITIONS
        function updateCardRects() {
            cardRects = [];
            cards.forEach(
                function (card) {
                    resetTransform( card );
                    const rect = card.getBoundingClientRect();
                    cardRects.push(
                        {
                            card: card,
                            left: rect.left,
                            top: rect.top,
                            width: rect.width,
                            height: rect.height
                        }
                    );
                }
            );
        }

        // FIND MOBILE CARD
        function getCardAtPosition( clientX, clientY ) {
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
        document.addEventListener(
            "pointermove",
            function (event) {
                if (!isMobileLayout()) {
                    return;
                }

                if (isInsideContactForm( event.target )) {
                    if (activeCard) {
                        resetCardLight( activeCard );
                        resetTransform( activeCard );
                        activeCard = null;
                    }
                    return;
                }

                const data = getCardAtPosition( event.clientX, event.clientY );
                if (!data) {
                    if (activeCard) {
                        resetCardLight( activeCard );
                        resetTransform( activeCard );
                        activeCard = null;
                    }
                    return;
                }

                const card = data.card;
                if ( activeCard && activeCard !== card ) {
                    resetCardLight( activeCard );
                    resetTransform( activeCard );
                }
                activeCard = card;

                // CARD POSITION
                const cardX = ( event.clientX - data.left ) / data.width;
                const cardY = ( event.clientY - data.top ) / data.height;

                // LIGHT
                const lightX = cardX * 100;
                const lightY = cardY * 100;

                if ( card === aboutContent ) {
                    card.style.setProperty( "--content-light-x", lightX + "%" );
                    card.style.setProperty( "--content-light-y", lightY + "%" );
                } else {
                    card.style.setProperty( "--back-light-x", lightX + "%" );
                    card.style.setProperty( "--back-light-y", lightY + "%" );
                }

                // VIEWPORT POSITION
                const viewportX = event.clientX / window.innerWidth;
                const viewportY = event.clientY / window.innerHeight;

                // TILT
                const normalizedX = ( viewportX - 0.5 ) * 2;
                const normalizedY = ( 0.5 - viewportY ) * 2;
                const rotateY = normalizedX * 2;
                const rotateX = normalizedY * 2;
                card.style.transform = "perspective(1000px) " + "rotateX(" + rotateX + "deg) " + "rotateY(" + rotateY + "deg)";
            }
        );

        // MOBILE POINTER LEAVE
        document.addEventListener(
            "pointerout",
            function (event) {
                if ( !isMobileLayout() ) {
                    return;
                }

                if ( event.relatedTarget === null ) {
                    if (activeCard) {
                        resetCardLight( activeCard );
                        resetTransform( activeCard );
                        activeCard = null;
                    }
                }
            }
        );

        // RESPONSIVE CARD POSITIONS
        updateCardRects();

        window.addEventListener( "resize",
            function () {
                if ( isMobileLayout() ) {
                    updateCardRects();
                }
            }
        );

        // RESPONSIVE CHANGE
        function handleBreakpointChange() {
            resetAllInteraction();
            activeCard = null;
            updateCardRects();
        }

        mobileBreakpoint.addEventListener( "change", handleBreakpointChange );

        // INITIAL STATE
        resetAllInteraction();
    }
);