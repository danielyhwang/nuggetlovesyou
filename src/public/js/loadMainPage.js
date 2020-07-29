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