
// LOADING SCREEN
window.addEventListener("load", function () {
    const loader = document.getElementById("loader");
    const mainContent = document.getElementById("main-content");
    const languageSelector = document.querySelector(".language-selector");

    // HIDE MAIN CONTENT
    if (mainContent) {
        mainContent.style.opacity = "0";
        mainContent.style.visibility = "hidden";
    }

    // SHOW CONTENT AFTER LOADING
    setTimeout(function () {
        // HIDE LOADER
        if (loader) {
            loader.style.display = "none";
        }

        // SHOW MAIN CONTNET
        if (mainContent) {
            mainContent.style.opacity = "1";
            mainContent.style.visibility = "visible";
        }

        // SHOW LANGUAGE BUTTON
        if (languageSelector) {
            languageSelector.style.display = "block";
        }
    }, 4000);
});