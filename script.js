const languageButton =
    document.querySelector(".language-button");

const languageMenu =
    document.querySelector(".language-menu");

const languageSelector =
    document.querySelector(".language-selector");


/* Show language button after loader */

setTimeout(function () {

    languageSelector.style.display = "block";

}, 4000);


/* Open language menu */

languageButton.addEventListener("click", function () {

    if (languageMenu.style.display === "block") {

        languageMenu.style.display = "none";

    } else {

        languageMenu.style.display = "block";

    }

});