/**
  * This file contains the core logic between the different requests to the database for the Quote model.
  * In other words, this file contains the CRUD (Create, Remove, Update, Delete) functionality of the Quote model.
  */

/**
 * Imports needed for this file. 
 * Requests are handled via an express router [runs code depending on which page you visit]
 * Quote model needed to search the Image database.
 */
const express = require("express")
const router = new express.Router()
const Quote = require("../models/Quote")

/**
 * Create an Quote (with quote + author fields) given valid data from a request and save it to the database.
 * Quote is automatically unverified upon entry.
 */
router.post("/quotes", async (req, res) => {
    console.log(req.body);
    res.status(200).send("recieved your request!");
    /** 
    const quote = new Quote(req.body.quote)
    quote.verified = false;
    try {
        await quote.save()
        res.status(201).send(quote)
    }
    catch (e) {
        res.status(400).send(e)
    }
    */
})

/**
 * Read a random quote from the database. 
 */
router.get("/randomQuote", async (req, res) => {
    try {
        const randomQuotes = await Quote.aggregate([{ $match: { verified: true} }, {$sample: { size: 1 } }]) //https://stackoverflow.com/questions/2824157/random-record-from-mongodb
        const firstRandomQuote = randomQuotes[0]
        res.status(200).send(firstRandomQuote)
    }
    catch (e) {
        res.status(400).send(e)
    }
})

/**
 * Update quote in the database by id. Admin permissions required.
 */
router.patch("/quotes/:id", async (req, res) => {
    //check if the fields in the request body match those of the quote model. send an error if not.
    const currentFields = Object.keys(req.body)
    const validUpdates = ["quote", "author", "verified"]
    const isValidOperation = currentFields.every((field) => {
        return validUpdates.includes(field)
    })
    if (!isValidOperation) {
        return res.status(400).send({ "Error": "Invalid field included. Please make sure the fields you're updating are part of the Quote model." })
    }

    //store the id to search from
    const _id = req.params.id
    try {
        //find quote with matching ID
        const quote = await Quote.findById(_id)

        if (!quote) {
            return res.status(404).send()
        }
        //update the quote
        currentFields.forEach((field) => {
            quote[field] = req.body[field]
        })
        await quote.save()
        res.status(200).send(quote)
    }
    catch (e) {
        console.log(e)
        res.status(500).send(e)
    }
})

/**
 * Delete image in the database by id. Admin permissions required.
 */
router.delete("/quotes/:id", async (req, res) => {
    const _id = req.params.id
    try {
        const quote = await Quote.findByIdAndDelete(_id)
        if (!quote) {
            return res.status(404).send()
        }
        res.send(quote)
    } catch (e) {
        res.status(500).send(e)
    }
})

module.exports = router