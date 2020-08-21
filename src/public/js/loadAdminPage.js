/**
 * GOALS FOR NOW: 
 * displays 50 quotes at a time - keep track of index
 * displays 25 images at a time - keep track of index
 * create modification functions 
 * create form that changes id.
 */

 /**
  * Enable popovers.
  * https://stackoverflow.com/questions/16990573/how-to-bind-bootstrap-popover-on-dynamic-elements
  */
 var popOverSettings = {
    placement: 'left',
    container: 'body',
    html: true,
    selector: '[data-toggle="popover"]',
    content: function () {
        return $('#popover-content').html();
    }
}

$('body').popover(popOverSettings);

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
            //if the quote is verified, change the background color to green to indicate addition.
            if (quote.verified){
                newRow.classList.add("bg-success")
            }
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
            
            //if the image is verified, change the background color to green to indicate addition.
            if (image.verified){
                newRow.classList.add("bg-success")
            }
            
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
            const btnGroup = imageButtonGroup(image._id, image.verified)
            newButtonGroup.appendChild(btnGroup)
            
        }
    }
    //remove tbody and add on new body
    document.querySelector("#imageTable tbody").remove()
    document.getElementById("imageTable").appendChild(newImageTableBody)
})

//creates imageButtonGroup
const imageButtonGroup = (imageId, imageVerified) => {
    const group = document.createElement("div")
    group.classList.add("btn-group")
    group.setAttribute("role", "group")
    group.setAttribute("aria-label", `Image button group ${imageId.toString()}`)

    //add on delete button
    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.classList.add("btn")
    deleteButton.classList.add("btn-danger")
    deleteButton.setAttribute("data-toggle", "popover")
    deleteButton.title = "Delete Image"
    deleteButton.innerHTML = '<i class="fa fa-trash customIcon"></i>'

    group.appendChild(deleteButton)

    //add on modify button
    const modifyButton = document.createElement("button");
    modifyButton.type = "button";
    modifyButton.classList.add("btn")
    modifyButton.classList.add("btn-primary")
    modifyButton.title = "Modify Image"
    modifyButton.innerHTML = '<i class="fa fa-edit customIcon"></i>'
    //create image modify modal here and configure the form on bootstrap.
    
    group.appendChild(modifyButton)

    //add on toggle visibility button
    const toggleButton = document.createElement("button");
    toggleButton.type = "button";
    toggleButton.classList.add("btn")
    toggleButton.classList.add("btn-info")
    toggleButton.title = "Toggle Visibility"
    toggleButton.innerHTML = '<i class="fa fa-eye customIcon"></i>'
    //the following function will update the visibility of the image.
    toggleButton.addEventListener("click", async (event) => {
        event.preventDefault();
        const data = {
            "verified" : !imageVerified
        }
        //make a patch request to change the visibility of the image.
        const response = await fetch(`/images/${imageId.toString()}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        let result = await response.json();
        if (response.status >= 400) {
            console.error(result)
        }
        loadImageTable(imageIndex, imagesPerPage)
    })
    group.appendChild(toggleButton)
    
    return group
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