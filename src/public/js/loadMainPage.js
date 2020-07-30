/**
 * Howler.js code
 */
let sound = undefined
const musicButton = document.getElementById("musicButton")

musicButton.addEventListener("click", function () {
    if (!sound){
        sound = new Howl({
            src: "../../audio/QuirkyDog.mp3",
            html5: true
        });
    }
    if (!sound.playing()){
        sound.play()
    }
    else{
        sound.pause()
    }
    musicButton.classList.toggle("pausedText")
})

function copyLinkToClipboard() {
    //credits: 30secondsofcode.org
    var copyText = document.getElementById("linkURL")
    navigator.clipboard.writeText(copyText.value)
}

/**
 * Code that toggles between different navs on our contribute content form.
 */

 /**
  * Code that loads in a random image for our 404 page.
  */

/**
 * Code that loads in random images and quotes from our database for our main page.
 */
