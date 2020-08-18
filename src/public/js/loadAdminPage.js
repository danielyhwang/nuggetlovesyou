/**
 * GOALS FOR NOW: 
 * displays 50 quotes at a time - keep track of index
 * displays 25 images at a time - keep track of index
 * create modification functions 
 * create form that changes id.
 */

 /**
  * Load in entries from the quote database into quote table.
  */
const quoteTableBody = document.getElementById("quoteTableBody")
const loadQuoteTable = (page, limit) => fetch(`/admin/getQuoteEntries?page=${page}&limit=${limit}`).then(async (response) => {
    const body = await response.json()
    //create new quote body and populate it.
    const newQuoteTableBody = document.createElement('tbody');
    if (body.error){
        //make a new row
        var newRow = newQuoteTableBody.insertRow(0);
        //insert a new cell
        var newCell = newRow.insertCell(0);
        // Append a text node to the cell
        var newText = document.createTextNode('ERROR');
        newCell.appendChild(newText);
    }
    else{
        var index = 0
        body.results.forEach(quote => {
            //make a new row
            var newRow = newQuoteTableBody.insertRow(index);
            for (const i in [0, 1, 2, 3]){
                var newArray = [`${page * limit + index+1}`, quote.quote, quote.author, "TEST"]
                var newCell = newRow.insertCell(i);
                var newText = document.createTextNode(newArray[i]);
                newCell.appendChild(newText)
            }
            index += 1
        })
    }
    //remove tbody and add on new body
    document.querySelector("#quoteTable tbody").remove()
    document.getElementById("quoteTable").appendChild(newQuoteTableBody)
})

/**
 * Takes care of pagination on the quotes page.
 */
const quotesPerPage = 25;
let quoteIndex = 0;

//load in initially
loadQuoteTable(quoteIndex, quotesPerPage)

const quotePaginationInc = document.getElementById("quotePaginationInc");
const quotePaginationIndex = document.getElementById("quotePaginationIndex");
const quotePaginationDec = document.getElementById("quotePaginationDec");
let numOfQuotes = 0;
fetch("/admin/getNumOfQuoteEntries").then(response => {
    return response.json()
}).then(data => {
    numOfQuotes = data.count
})

quotePaginationInc.addEventListener("click", function () {
    if (quoteIndex < Math.floor(numOfQuotes/quotesPerPage)){
        quoteIndex += 1;
        quotePaginationIndex.textContent = `${quoteIndex + 1}`;
        loadQuoteTable(quoteIndex, quotesPerPage)
    }
})

quotePaginationDec.addEventListener("click", function () {
    if (quoteIndex > 0){
        quoteIndex -= 1;
        quotePaginationIndex.textContent = `${quoteIndex + 1}`;
        loadQuoteTable(quoteIndex, quotesPerPage)
    }
})


/**
 * Load in entries from the image database into image table.
 */
const imageTableBody = document.getElementById("imageTableBody")
const displayedImage = document.getElementById("displayedImage")

const loadImageTable = (page, limit) => fetch(`/admin/getImageEntries?page=${page}&limit=${limit}`).then(async (response) => {
    const body = await response.json()
    //create new image table body and populate it.
    const newImageTableBody = document.createElement('tbody');
    if (body.error){
        //make a new row
        var newRow = newImageTableBody.insertRow(0);
        //insert a new cell
        var newCell = newRow.insertCell(0);
        // Append a text node to the cell
        var newText = document.createTextNode('ERROR');
        newCell.appendChild(newText);
    }
    else{
        for (i = 0; i < body.results.length; i++) {
            //save in image
            const image = body.results[i]

            //make a new row
            var newRow = newImageTableBody.insertRow(i);
            
            for (const j in [0, 1, 3]){
                var newArray = [`${page * limit + i+1}`, image.photographer, image.descriptionAlt]
                var newCell = newRow.insertCell(j);
                var newText = document.createTextNode(newArray[j]);
                newCell.appendChild(newText)
            }
            
            const imageData = image.imageData
            
            //add in image content
            var newCell = newRow.insertCell(2);
            var btn = document.createElement('button');
            btn.type = "button";
            btn.classList.add("btn")
            btn.classList.add("btn-primary")
            btn.setAttribute("data-toggle", "modal");
            btn.setAttribute("data-target", "#displayImageModal");
            btn.textContent = "View Image";
            btn.onclick = () => {displayedImage.src = 'data:image/png;base64,' + imageData.toString("base64")};
            newCell.appendChild(btn);

            //add in image buttonGroup
            var newButtonGroup = newRow.insertCell(4)
            const btnGroup = imageButtonGroup(image._id)
            newButtonGroup.appendChild(btnGroup)

            /**
             * 
            <div class="btn-group" role="group" aria-label="Basic example">
                <button type="button" class="btn btn-secondary">Left</button>
                <button type="button" class="btn btn-secondary">Middle</button>
                <button type="button" class="btn btn-secondary">Right</button>
            </div>
             */
            
        }
    }
    //remove tbody and add on new body
    document.querySelector("#imageTable tbody").remove()
    document.getElementById("imageTable").appendChild(newImageTableBody)
})

//creates imageButtonGroup

const imageButtonGroup = (imageId) => {
    const test = document.createElement("div")
    test.innerHTML = `<div class="btn-group" role="group" aria-label="Basic example">
        <button type="button" class="btn btn-danger" data-toggle="popover" title="Delete Image" data-content="Are you sure?"><i class="fa fa-trash customIcon"></i></button>
        <button type="button" class="btn btn-primary"><i class="fa fa-edit customIcon"></i></button>
        <button type="button" class="btn btn-success"><i class="fa fa-eye customIcon"></i></button>

        <button type="button" class="btn btn-secondary" data-container="body" data-toggle="popover" data-placement="top" data-content="Vivamus sagittis lacus vel augue laoreet rutrum faucibus.">
  Popover on top
</button>
    </div>`
    return test
    //fa-eye-slash and fa-eye
}

/**
 * Takes care of pagination on the images page.
 */
const imagesPerPage = 10;
let imageIndex = 0;

//load in initially
loadImageTable(imageIndex, imagesPerPage)

const imagePaginationInc = document.getElementById("imagePaginationInc");
const imagePaginationIndex = document.getElementById("imagePaginationIndex");
const imagePaginationDec = document.getElementById("imagePaginationDec");
let numOfImages = 0;
fetch("/admin/getNumOfImageEntries").then(response => {
    return response.json()
}).then(data => {
    numOfImages = data.count
})

imagePaginationInc.addEventListener("click", function () {
    if (imageIndex < Math.floor(numOfImages/imagesPerPage)){
        imageIndex += 1;
        imagePaginationIndex.textContent = `${imageIndex + 1}`;
        loadImageTable(imageIndex, imagesPerPage)
    }
})

imagePaginationDec.addEventListener("click", function () {
    if (imageIndex > 0){
        imageIndex -= 1;
        imagePaginationIndex.textContent = `${imageIndex + 1}`;
        loadImageTable(imageIndex, imagesPerPage)
    }
})