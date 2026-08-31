
// Keep the main content hidden while
// the loading animation is playing.
window.addEventListener("load", function () {
    const loader = document.getElementById("loader");
    const mainContent = document.getElementById("main-content");
    const languageSelector = document.querySelector(".language-selector");

    // HIDE MAIN CONTENT
    if (mainContent) {
        mainContent.style.opacity = "0";
        mainContent.style.visibility = "hidden";
    }

    // SHOW CONTENT
    setTimeout(function () {
        if (loader) {
            loader.style.display = "none";
        }

        if (mainContent) {
            mainContent.style.opacity = "1";
            mainContent.style.visibility = "visible";
        }

        if (languageSelector) {
            languageSelector.style.display = "block";
        }
    }, 4000);
});