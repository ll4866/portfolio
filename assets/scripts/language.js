
// LANGUAGE SELECTOR
document.addEventListener("DOMContentLoaded", function () {
    const languageButton = document.querySelector(".language-button");
    const languageMenu = document.querySelector(".language-menu");

    if (!languageButton || !languageMenu) {
        return;
    }

    // TOGGLE LANGUAGE MENU
    languageButton.addEventListener(
        "click",
        function (event) {
            event.stopPropagation();

            if (window.innerWidth > 700) {
                return;
            }

            const isOpen = languageMenu.style.display === "block";

            if (isOpen) {
                languageMenu.style.display = "none";
            } else {
                languageMenu.style.display = "block";
            }
        }
    );

    // CLOSE WHEN CLICKING OUTSIDE
    document.addEventListener(
        "click",
        function () {
            if (window.innerWidth > 700) {
                return;
            }

            languageMenu.style.display = "none";
        }
    );

    // KEEP MENU OPEN WHEN CLICKED
    languageMenu.addEventListener(
        "click",
        function (event) {
            event.stopPropagation();
        }
    );
});


// CURRENT LANGUAGE
function getCurrentLanguage() {
    const path = window.location.pathname;

    if (path.endsWith("zh.html")) {
        return "zh";
    }

    if (path.endsWith("pt.html")) {
        return "pt";
    }

    return "en";
}