const express = require("express")
const Admin = require("../models/Admin")
const auth = require("../middleware/auth")
const router = new express.Router()

//admin router. Primarily login functionality. 

//sends back req.admin generated in auth.
router.get("/admin/me", auth, async (req, res) => {
    res.send(req.admin)
})

//create admin. TEMPORARILY AVAILABLE FOR ANYTHING
//TODO: resolve this so only admin can create other admin.
router.post("/admin", async (req, res) => {
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

//logins user using body, creates auth token for them to use
router.post("/admin/login", async (req, res) => {
    try {
        const admin = await Admin.findByCredentials(req.body.email, req.body.password)
        const token = await admin.generateAuthToken()
        res.send({admin, token}) //admin will automatically strip sensitive info thanks to toJSON
    }
    catch (e){
        console.log(e)
        res.status(400).send()
    }
})

//logouts admin, removes currently used auth token
router.post("/admin/logout", auth, async (req, res) => {
    try {
        req.admin.tokens = req.admin.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.admin.save()
        res.status(200).send()
    }
    catch (e){
        res.status(500).send()
    }
})

//logouts admin and erases all tokens on current admin
router.post("/admin/logoutAll", auth, async (req, res) => {
    try {
        req.admin.tokens = []
        await req.admin.save()
        res.send()
    }
    catch (e){
        res.status(500).send()
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
            return res.status(404).send()
        } //return 404 in case if user cannot be found

        res.send(req.admin) //send back updated user

    } catch (e) {
        res.status(400).send(e) //validation error
    }
})

module.exports = router