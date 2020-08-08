/**
 * This is the code we run upon loading the window
 */
window.onload=function(){
    const quoteForm = document.getElementById("quoteForm")
    quoteForm.addEventListener("submit", submitQuote)
}

/**
 * Howler.js code
 */
let sound = undefined
const musicButton = document.getElementById("musicButton")
musicButton.addEventListener("click", function () {
    if (!sound) {
        sound = new Howl({
            src: "../../audio/QuirkyDog.mp3",
            html5: true
        });
    }
    if (!sound.playing()) {
        sound.play()
    }
    else {
        sound.pause()
    }
    musicButton.classList.toggle("pausedText")
})

/**
 * Copy functionality on share modal.
 */
function copyLinkToClipboard() {
    //credits: 30secondsofcode.org
    var copyText = document.getElementById("linkURL")
    navigator.clipboard.writeText(copyText.value)
}

/**
 * Loading in random quote
 */
const displayedQuote = document.getElementById("displayedQuote")
fetch("/randomQuote").then((response) => {
    //only load in quote if response is nonempty
    if(Object.keys(response).length){
        response.json().then((data) => {
            displayedQuote.innerText = `"${data.quote}" - ${data.author}` 
        })
    }
})



/**
 * Submitting new quote to the database
 * Used in window.onload
 */
submitQuote = async (event) => {
    const quoteForm = document.getElementById("quoteForm");
    event.preventDefault()

    const response = await fetch('/quotes', {
        method: 'POST',
        body: new FormData(quoteForm)
    });
    const result = await response.json();
    console.log(result)
}