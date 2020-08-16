const express = require("express")
const Admin = require("../models/Admin")
const Quote = require("../models/Quote")
const Image = require("../models/Image")
const auth = require("../middleware/auth")
const router = new express.Router()

//admin router. Primarily login functionality. 

//sends back req.admin generated in auth.
router.get("/admin/me", auth, async (req, res) => {
    res.send(req.admin)
})

//create admin. 
//TODO: REQUIRE AUTHENTICATION ONCE FIRST USER HAS BEEN CREATED.
router.post("/admin/newAdmin", async (req, res) => {
    const admin = new Admin(req.body)
    try {
        await admin.save();
        const token = await admin.generateAuthToken()
        res.status(201).send({admin, token})
    }
    catch (e){
        console.log(e)
        res.status(400).send(e)
    }
})

router.get('/admin', auth, async (req, res) => {
    if (req.admin){
        return res.render("admin")
    }
    else{
        return res.redirect(400, "/login")
    }
})

//logins user using body, creates auth token for them to use
router.post("/login", async (req, res) => {
    try {
        const admin = await Admin.findByCredentials(req.body.email, req.body.password)
        const token = await admin.generateAuthToken()
        //res.set("Authentication", `Bearer ${token}`)
        // Setting the auth token in cookies
        res.cookie('AuthToken', token);
        res.redirect("/admin") //render the admin page with token loaded in header
    }
    catch (e){
        res.redirect(400, "/login")
    }
})

router.get("/admin/getQuoteEntries", auth, async (req, res) => {
    try {
        const results = await Quote.find({}) //.skip(start) //.limit(limit)
        res.status(201).send({results})
    }
    catch (error){
        console.log(error)
        res.status(400).send({error})
    }
})

router.get("/admin/getImageEntries", auth, async (req, res) => {
    try {
        const results = await Image.find({})
        console.log(results)
        const resultsCopy = results.map(r => r.toObject())
        console.log(resultsCopy)
        //test
        resultsCopy.forEach(result => {
            result.imageData = result.imageData.toString("base64")
        })
        res.status(201).send({results: resultsCopy})
    }
    catch (error){
        console.log(error)
        res.status(400).send({error})
    }
})

//logouts admin, removes currently used auth token
router.post("/logout", auth, async (req, res) => {
    try {
        req.admin.tokens = req.admin.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.admin.save()
        res.status(200).send({"message": "Successfully logged out."})
    }
    catch (e){
        res.status(500).send({"error": "Couldn't log out."})
    }
})

//logouts admin and erases all tokens on current admin
router.post("/logoutAll", auth, async (req, res) => {
    try {
        req.admin.tokens = []
        await req.admin.save()
        res.send({"message": "Successfully logged out of all sessions."})
    }
    catch (e){
        res.status(500).send({"error": "Couldn't log out."})
    }
})

//updates the admin object.
router.patch("/admin/me", auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ["email", "password"]
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update)
    }) //for every field in body, check if it's allowed. Return true if all of them are valid, false otherwise.

    if (!isValidOperation){
        return res.status(400).send({"error": "Invalid Updates!"}) 
    } //send error message if operation is invalid

    try {
        updates.forEach((update) => {
            req.admin[update] = req.body[update]
        }) //run updates on admin

        await req.admin.save() //save changes

        if (!req.admin){
            return res.status(404).send({"error" : "User not found."})
        } //return 404 in case if user cannot be found

        res.send(req.admin) //send back updated user

    } catch (e) {
        res.status(400).send(e) //send back validation error
    }
})

module.exports = router