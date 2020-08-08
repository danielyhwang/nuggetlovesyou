/**
 * This file contains the core logic between the different requests to the database for the Image model.
 * In other words, this file contains the CRUD (Create, Remove, Update, Delete) functionality of the Image model.
 */

/**
 * Imports needed for this file. 
 * Requests are handled via an express router [runs code depending on which page you visit]
 * Image model needed to search the Image database.
 */
const express = require("express")
const router = new express.Router()
const Image = require("../models/Image")
const multer = require("multer")
const sharp = require("sharp")

/**
 * Multer middleware - will allow us to do image verification
 */
const nuggetPhoto = multer({
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) { //this is a regular (regex) expression, telling us to accept either doc or docx
            cb(new Error("Please upload an image (jpg, jpeg, or png)"))
        }
        cb(undefined, true)
        //cb(new Error("File must be an image")) //callback exits the function with error
        //cb(undefined, true) //callback silently accepts the function
        //cb(undefined, false) //callback silently rejects the function - don't use
    }
})

/**
 * Create an Image (with imageData + descriptionAlt + photographer fields) given valid data from a request and save it to the database.
 */
router.post("/images", nuggetPhoto.single("upload"), async (req, res) => {
    const buffer = await sharp(req.file.buffer).resize({ width: undefined, height: 300}).png().toBuffer() //passed data to sharp, asked sharp for data back. can also resize and convert to specific file
    const image = new Image({ ...req.body, imageData: buffer }) //image itself will be stored in imageData
    image.verified = false
    try {
        await image.save()
        res.status(201).send(image)
    }
    catch (e) {
        console.log(e)
        res.status(500).send({error: e})
    }
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
}) //end function handles errors

/**
 * Read an random image from the database.
 */
router.get("/randomImage", async (req, res) => {
    try {
        const randomImages = await Image.aggregate([{ $match: { verified: true} }, {$sample: { size: 1 } }]) //https://stackoverflow.com/questions/2824157/random-record-from-mongodb
        const firstRandomImage = randomImages[0]
        res.send(firstRandomImage)
    }
    catch (e) {
        res.status(500).send(e)
    }
})

/**
 * Read an Image by ID.
 */
router.get("/images/:id", async (req, res) => {
    const _id = req.params.id
    try {
        const image = await Image.findOne({ _id })
        if (!image) {
            return res.status(404).send()
        }
        res.send(image)
        //res.set("Content-Type", "image/png") //make sure we send back data
        //res.send(image.imageData)
    }
    catch (e) {
        res.status(500).send(e)
    }
})

/**
 * Update image in the database by id.
 */
router.patch("/images/:id", async (req, res) => {
    //check if the fields in the request body match those of the image model. send an error if not.
    const currentFields = Object.keys(req.body)
    const validUpdates = ["photographer", "descriptionAlt", "imageData"]
    const isValidOperation = currentFields.every((field) => {
        return validUpdates.includes(field)
    })
    if (!isValidOperation) {
        return res.status(400).send({ "Error": "Invalid field included. Please make sure the fields you're updating are part of the Image model." })
    }

    //save id into a variable
    const _id = req.params.id
    const photographer = req.params.photographer
    try {
        const image = await Image.findOne({ _id, photographer})

        if (!image) {
            return res.status(404).send()
        }

        currentFields.forEach((field) => {
            image[field] = req.body[field]
        })
        await image.save()
        res.status(200).send(image)
    }
    catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})

/**
 * Delete image in the database by id.
 */
router.delete("/images/:id", async (req, res) => {
    const _id = req.params.id
    try {
        const image = await Image.findOneAndDelete({ _id })
        if (!image) {
            return res.status(404).send()
        }
        res.send(image)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router