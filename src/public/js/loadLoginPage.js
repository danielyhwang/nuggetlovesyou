/**
 * This is the code we run upon loading the window
 */
window.onload = function () {
    const quoteForm = document.getElementById("loginForm")
    quoteForm.addEventListener("submit", loginFunction)
}