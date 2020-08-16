/**
 * GOALS FOR NOW: 
 * displays 50 quotes at a time - keep track of index
 * displays 25 images at a time - keep track of index
 * create modification functions 
 * create form that changes id.
 */
const quoteTableBody = document.getElementById("quoteTable").getElementsByTagName("tbody")[0]
fetch("/admin/getQuoteEntries").then(async (response) => {
    const body = await response.json()
    if (body.error){
        //make a new row
        var newRow = quoteTableBody.insertRow(0);
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
            var newRow = quoteTableBody.insertRow(index);
            for (const i in [0, 1, 2, 3]){
                var newArray = [`${index+1}`, quote.quote, quote.author, "TEST"]
                var newCell = newRow.insertCell(i);
                var newText = document.createTextNode(newArray[i]);
                newCell.appendChild(newText)
            }
            index += 1
        })
    }
})

const imageTableBody = document.getElementById("imageTable").getElementsByTagName("tbody")[0]
const displayedImage = document.getElementById("displayedImage")

fetch("/admin/getImageEntries").then(async (response) => {
    const body = await response.json()
    if (body.error){
        //make a new row
        var newRow = imageTableBody.insertRow(0);
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
            var newRow = imageTableBody.insertRow(i);
            
            for (const j in [0, 1, 3, 4]){
                var newArray = [`${i+1}`, image.photographer, image.descriptionAlt, "TEST"]
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
            
        }
    }
})