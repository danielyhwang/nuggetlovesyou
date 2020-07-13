/**
 * Nugget Loves You
 * good website for a greater dog
 * @author whydaniel
 */

 /**
  * App.js - sets up the app.
  * Five main functions:
  * Load in the mongoDB database
  * Set up the web server using express
  * Configure web server to be compatible with handlebars
  * Connect routers to the app
  * Render our two pages (default and 404)
  */

 /**
  * Set up database (see src/mongoose.js)
  */
 require("./db/mongoose")

 /**
  * Set up the web server using express
  */
const express = require("express")
//define port
const port = process.env.PORT;
const app = express()

/**
 * Set up handlebars (hbs/dynamic html templating)
 * Configure custom paths (with package path) and link them with our app
 */
const hbs = require("hbs")
const path = require("path")

//define the three paths/directories to link to our app
const publicDirectoryPath = path.join(__dirname, "./public")
const viewsPath = path.join(publicDirectoryPath, "/templates/views")
const partialsPath = path.join(publicDirectoryPath, "/templates/partials")

//configures app to use hbs templates
app.set("view engine", "hbs")

//links views and partials to our defined paths
app.set("views", viewsPath)
hbs.registerPartials(partialsPath)

//allows us to use static files (css/img/js) in the public directory.
app.use(express.static(publicDirectoryPath))

/**
 * Connect routers (image, quote) to app (see /routers)
 * also configure the app to take in JSON data only
 */
const imageRouter = require("./routers/image")
const quoteRouter = require("./routers/quote")
app.use(express.json())
app.use(imageRouter)
app.use(quoteRouter)


/**
 * Default route - what the user will see upon arrival. See main.hbs
 */
app.get("/", (req, res) => {
    res.render("main")
})

/**
 * 404 page in case user visits any other page. See 404.hbs
 */
app.get("*", (req, res) => {
    res.render("404")
})

/**
 * Sets up the app on defined port.
 */
app.listen(port, () => {
    console.log("Server is up on port", port)
})