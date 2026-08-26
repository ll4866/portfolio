// LANGUAGE SELECTOR
const languageSelector = document.querySelector(".language-selector");

setTimeout(function () {
    if (languageSelector) {
        languageSelector.style.display = "block";
    }
}, 4000);


// =========================
// ABOUT CARD
// =========================

const aboutCard = document.querySelector(".about");
const aboutContent = document.querySelector(".about-content");
const aboutBack = document.querySelector(".about-back");

if (aboutCard) {

    // flip between ABOUT and CONTACT
    aboutCard.addEventListener(
        "click",
        function (event) {

            // Don't flip when clicking contact side
            if (event.target.closest(".about-back")) {
                return;
            }

            // Don't flip when clicking links
            if (event.target.closest("a")) {
                return;
            }

            // Don't flip when clicking buttons
            if (event.target.closest("button")) {
                return;
            }

            // Don't flip when clicking form elements
            if (
                event.target.closest("input") ||
                event.target.closest("textarea") ||
                event.target.closest("form")
            ) {
                return;
            }

            aboutCard.classList.toggle("flipped");

            resetCard();
        }
    );


    // Disntinguish btw full or smalle screen size
    function getTiltElement() {

        // Determining what element should tilt (content only or photo & content)
        if (window.innerWidth <= 700) {

            // Contact side
            if (aboutCard.classList.contains("flipped")) {
                return aboutBack;
            }

            // About side
            return aboutContent;

        } else {
            return aboutCard;
        }
    }


    // update card display
    function updateCard(element, x, y) {

        if (!element) {
            return;
        }

        const rect = element.getBoundingClientRect();
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateY =
            ((x - centerX) / centerX) * 3;

        const rotateX =
            ((centerY - y) / centerY) * 3;

        element.style.transform =
            `perspective(1200px)
             rotateX(${rotateX}deg)
             rotateY(${rotateY}deg)`;


        const lightX =
            (x / rect.width) * 100;

        const lightY =
            (y / rect.height) * 100;


        // Reflection adjustment for full size
        if (element === aboutCard) {

            aboutCard.style.setProperty(
                "--light-x",
                `${lightX}%`
            );

            aboutCard.style.setProperty(
                "--light-y",
                `${lightY}%`
            );

        }


        // Reflection adjustments for smaller size
        if (element === aboutContent) {

            aboutContent.style.setProperty(
                "--content-light-x",
                `${lightX}%`
            );

            aboutContent.style.setProperty(
                "--content-light-y",
                `${lightY}%`
            );

        }


        // Reflection adjustments for contact side on smaller size
        if (element === aboutBack) {

            aboutBack.style.setProperty(
                "--back-light-x",
                `${lightX}%`
            );

            aboutBack.style.setProperty(
                "--back-light-y",
                `${lightY}%`
            );

        }

    }


    // when mouse move inside card, update card
    aboutCard.addEventListener(
        "mousemove",
        function (event) {

            const element = getTiltElement();

            if (!element) {
                return;
            }

            const rect =
                element.getBoundingClientRect();

            const x =
                event.clientX - rect.left;

            const y =
                event.clientY - rect.top;

            updateCard(
                element,
                x,
                y
            );

        }
    );


    // when mouse is outside card, default
    aboutCard.addEventListener(
        "mouseleave",
        function () {
            resetCard();
        }
    );


    // when touch card, update card
    aboutCard.addEventListener(
        "touchmove",
        function (event) {

            const touch =
                event.touches[0];

            const element =
                getTiltElement();

            if (!element) {
                return;
            }

            const rect =
                element.getBoundingClientRect();

            const x =
                touch.clientX - rect.left;

            const y =
                touch.clientY - rect.top;

            updateCard(
                element,
                x,
                y
            );

        },
        {passive: true}
    );


    // when not touch card. default
    aboutCard.addEventListener(
        "touchend",
        function () {
            resetCard();
        }
    );


    // default
    function resetCard() {

        // full screen
        aboutCard.style.transform =
            "perspective(1200px) rotateX(0deg) rotateY(0deg)";

        aboutCard.style.setProperty(
            "--light-x",
            "-100%"
        );

        aboutCard.style.setProperty(
            "--light-y",
            "-100%"
        );


        // smaller screen
        if (aboutContent) {

            aboutContent.style.transform =
                "perspective(1200px) rotateX(0deg) rotateY(0deg)";

            aboutContent.style.setProperty(
                "--content-light-x",
                "-100%"
            );

            aboutContent.style.setProperty(
                "--content-light-y",
                "-100%"
            );

        }


        // contact side on smaller screen
        if (aboutBack) {

            aboutBack.style.transform =
                "perspective(1200px) rotateX(0deg) rotateY(0deg)";

            aboutBack.style.setProperty(
                "--back-light-x",
                "-100%"
            );

            aboutBack.style.setProperty(
                "--back-light-y",
                "-100%"
            );

        }

    }


    // if screen size change reset
    window.addEventListener(
        "resize",
        function () {
            resetCard();
        }
    );

}


// =========================
// CONTACT FORM
// =========================

const contactForm =
    document.querySelector("#contact-form");

if (contactForm) {

    contactForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();

            const senderEmail =
                document.querySelector("#sender-email").value;

            const subject =
                document.querySelector("#email-subject").value;

            const message =
                document.querySelector("#email-message").value;

            const sendButton =
                contactForm.querySelector(".send-button");


            // change button while sending
            sendButton.textContent =
                "Sending...";

            sendButton.disabled = true;


            fetch(
                "YOUR_GOOGLE_APPS_SCRIPT_URL",
                {
                    method: "POST",

                    body: JSON.stringify({
                        email: senderEmail,
                        subject: subject,
                        message: message
                    })
                }
            )

            .then(
                function (response) {
                    return response.json();
                }
            )

            .then(
                function (data) {

                    if (data.success) {

                        // message successfully sent
                        sendButton.textContent =
                            "Sent ✓";

                        contactForm.reset();


                        // return button to default after a few seconds
                        setTimeout(
                            function () {

                                sendButton.textContent =
                                    "Send Message ↗";

                                sendButton.disabled =
                                    false;

                            },
                            3000
                        );

                    } else {

                        // something went wrong
                        sendButton.textContent =
                            "Something went wrong";

                        sendButton.disabled =
                            false;

                    }

                }
            )

            .catch(
                function (error) {

                    // something went wrong
                    sendButton.textContent =
                        "Something went wrong";

                    sendButton.disabled =
                        false;

                    console.error(error);

                }
            );

        }
    );

}


// =========================
// PROJECT TABS
// =========================

const projectTabs =
    document.querySelectorAll(".project-tab");

const projectViews =
    document.querySelectorAll(".project-view");


projectTabs.forEach(
    function (tab) {

        tab.addEventListener(
            "click",
            function () {

                const view =
                    tab.dataset.view;


                projectTabs.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                projectViews.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                tab.classList.add(
                    "active"
                );


                const selectedView =
                    document.querySelector(
                        "#" + view + "-view"
                    );


                if (selectedView) {

                    selectedView.classList.add(
                        "active"
                    );

                }

            }
        );

    }
);


// =========================
// PROJECT PAGE LANGUAGE
// =========================

const projectLanguageButtons =
    document.querySelectorAll(
        ".project-language-button"
    );

const projectLanguageContent =
    document.querySelectorAll(
        ".project-language-content"
    );


projectLanguageButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const language =
                    button.dataset.language;


                projectLanguageButtons.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                projectLanguageContent.forEach(
                    function (item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                projectLanguageContent.forEach(
                    function (item) {

                        if (
                            item.dataset.languageContent ===
                            language
                        ) {

                            item.classList.add(
                                "active"
                            );

                        }

                    }
                );

            }
        );

    }
);


// =========================
// DEFAULT PROJECT LANGUAGE
// =========================

const defaultProjectLanguage =
    document.querySelector(
        '.project-language-button[data-language="en"]'
    );


if (defaultProjectLanguage) {

    defaultProjectLanguage.classList.add(
        "active"
    );

}