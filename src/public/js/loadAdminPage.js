/**
 * GOALS FOR NOW: Admin page displays all quotes in rows
 * Admin page currently displays all quotes
 * displays all images
 * display image field upon clicking
 * displays 50 quotes at a time - keep track of index
 * displays 25 images at a time - keep track of index
 * create modification functions 
 * create form that changes id.
 */

const quoteTable = document.getElementById("quoteTable")
let index = 0;
fetch("/admin/getQuoteEntries").then(async (response) => {
    if (response.error){
        const row = quoteTable.insertRow(0);
        row.innerHTML = "<tr><td>ERROR</td><td>ERROR</td><td>ERROR</td><td>ERROR</td></tr>"
    }
    else{

    }
})