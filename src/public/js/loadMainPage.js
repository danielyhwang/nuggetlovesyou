/**
 * This is the code we run upon loading the window
 */
window.onload = function () {
    const quoteForm = document.getElementById("quoteForm")
    quoteForm.addEventListener("submit", submitQuote)
    const imageForm = document.getElementById("imageForm")
    imageForm.addEventListener("submit", submitImage)
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
fetch("/randomQuote").then(response => {
    return response.json()
}).then(data => {
    displayedQuote.innerText = `"${data.quote} - ${data.author}`
})


/**
 * Loading in random image
 */
const nuggetPhoto = document.getElementById("nuggetPhoto")
const photographer = document.getElementById("photographer")
fetch("/randomImage").then(async (response) => {
    const data = await response.json();
    if (Object.keys(data).length) {
        nuggetPhoto.src = 'data:image/jpeg;base64,' + data.imageData.toString("base-64")
        nuggetPhoto.alt = data.descriptionAlt;
        photographer.value = "Photo by " + data.photographer;
    }
    /**
    //only load in image if response is nonempty
    if(Object.keys(response).length){
        response.json().then(async (data) => {
            console.log(data)
            const image = await sharp(data.imageData).png()
            //https://stackoverflow.com/questions/50989112/is-it-possible-to-insert-an-image-without-using-a-filepath-src
            const reader = new FileReader();
            reader.readAsDataURL(image)
            reader.onload = function() {
                nuggetPhoto.src = reader.result
            }
            console.log(data.descriptionAlt)
            console.log(data.photographer)
            console.log("test!")
            nuggetPhoto.alt = data.descriptionAlt;
            photographer.value = "Photo by " + data.photographer;
        })
    }
    else{
        console.log("Whoa!")
    }
    */
})

/**
 * Submitting new quote to the database
 * Used in window.onload
 */
submitQuote = async (event) => {
    event.preventDefault()

    //gave up on using a form, decided to manually fill in json data.
    const quoteFormQuote = document.getElementById("quoteFormQuote")
    const quoteFormAuthor = document.getElementById("quoteFormAuthor")
    data = {
        "quote": quoteFormQuote.value,
        "author": quoteFormAuthor.value
    }

    //make a post request to the database
    const response = await fetch('/quotes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data)
    })

    if (response.status == 201) {
        quoteFormQuote.value = ""
        quoteFormAuthor.value = ""
        alert("Your quote has been submitted. Thank you!")
    }
    else {
        alert("There was an error in submitting your quote, please try again! Error:", response.json().error)
    }
}

/**
 * Submitting new quote to the database
 * Used in window.onload
 */

submitImage = async (event) => {
    event.preventDefault()

    //gave up on using a form, decided to manually fill in multiform data.
    const imageFormPhotographer = document.getElementById("imageFormPhotographer")
    const imageFormNuggetPhoto = document.getElementById("imageFormNuggetPhoto")
    const imageFormDescriptionAlt = document.getElementById("imageFormDescriptionAlt")

    //convert image to imageBlob: https://javascript.info/formdata

    //create form data
    const imageFormData = new FormData();
    imageFormData.append("photographer", imageFormPhotographer.value);
    imageFormData.append("upload", imageFormNuggetPhoto.files[0]);
    imageFormData.append("descriptionAlt", imageFormDescriptionAlt.value)


    //make a post request to the database
    const response = await fetch('/images', {
        method: 'POST',
        /**headers: {
            'Content-Type': 'multipart/form-data'
            //'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },*/
        body: imageFormData
    })
    console.log(response)
    let result = await response.json();
    console.log(result)
    if (result.error) {
        alert("There was an error in submitting your image! Please check your submission and try again. ")
        console.error(result.error)
    }
    else {
        imageFormPhotographer.value = ""
        imageFormNuggetPhoto.value = null
        imageFormDescriptionAlt.value = ""
        alert("Your image has been submitted! Thank you!")
    }
}