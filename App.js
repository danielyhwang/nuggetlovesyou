/**
 * Set up express webserver
 */
const express = require("express")
const port = process.env.PORT || 3000;
const app = express()




app.get("*", (req, res) => {
    res.send()
})

app.listen(port, () => {
    console.log("Server is up on port", port)
}) //starts up the default port