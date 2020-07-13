/**
  * This file contains the core logic between the different requests to the database for the Quote model.
  * In other words, this file contains the CRUD (Create, Remove, Update, Delete) functionality of the Quote model.
  * A lot of these pages will be deprecated as the data will be stored on Google Sheets.
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
   */
  router.post("/quotes", async (req, res) => {
      const quote = new quote(req.body)
      try {
          await quote.save()
          res.status(201).send(quote)
      }
      catch (e){
          res.status(400).send(e)
      }
  })
  /**
   * Read all Quote data in the database.
   */
  router.get("/quotes", async (req, res) => {
    try {
        const images = await Quote.find({})
        res.status(200).send(quotes)
    }
    catch (e){
        res.status(400).send(e)
    }
  })

/**
 * Read an Quote by ID.
 */
router.get("/quotes/:id", async (req, res) => {
    const _id = req.params.id
    try{
        const quote = await Quote.findOne({_id})
        if (!quote){
            return res.status(404).send(quote)
        }
        res.send(quote)
    }
    catch(e){
        res.status(500).send(e)
    }
})

//UPDATE POINT - NEED TO UPDATE UP TO BELOW
  /**
   * Update image in the database by id.
   */
  router.patch("/quotes/:id", async (req, res) => {
    //check if the fields in the request body match those of the image model. send an error if not.
    const currentFields = Object.keys(req.body)
    const validUpdates = ["photographer", "descriptionAlt" , "imageData"]
    const isValidOperation = currentFields.every((field) => {
        return validUpdates.includes(field)
    })
    if (!isValidOperation){
        return res.status(400).send({"Error": "Invalid field included. Please make sure the fields you're updating are part of the Image model."})
    }

    //search 
    const _id = req.params.id
    try{
        //const task = await Task.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true})
        //replaced by middleware
        const task = await Task.findOne({_id, author: req.user._id})

        if (!task){
            return res.status(404).send()
        }

        currentFields.forEach((field) => {
            task[field] = req.body[field]
        })
        await task.save()
        res.status(200).send(task)
    }
    catch(e){
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
            const image = await Image.findOneAndDelete({_id})
            if (!image){
                return res.status(404).send()
            }
            res.send(image)
        }catch (e){
            res.status(500).send(e)
        }   
    })

  module.exports = router