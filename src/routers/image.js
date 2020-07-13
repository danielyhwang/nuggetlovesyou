 /**
  * This file contains the core logic between the different requests to the database for the Image model.
  * In other words, this file contains the CRUD (Create, Remove, Update, Delete) functionality of the Image model.
  * A lot of these pages will be deprecated as the data will be stored on Google Sheets.
  */

  /**
   * Imports needed for this file. 
   * Requests are handled via an express router [runs code depending on which page you visit]
   * Image model needed to search the Image database.
   */
  const express = require("express")
  const router = new express.Router()
  const Image = require("../models/Image")

  /**
   * Create an Image (with imageData + descriptionAlt + photographer fields) given valid data from a request and save it to the database.
   */
  router.post("/images", async (req, res) => {
      const image = new Image(req.body)
      try {
          await image.save()
          res.status(201).send(task)
      }
      catch (e){
          res.status(400).send(e)
      }
  })
  /**
   * Read all Image data in the database.
   */
  router.get("/images", async (req, res) => {
    try {
        const images = await Image.find({})
        res.status(200).send(images)
    }
    catch (e){
        res.status(400).send(e)
    }
  })

/**
 * Read an Image by ID.
 */
router.get("/images/:id", async (req, res) => {
    const _id = req.params.id
    try{
        const task = await Task.findOne({_id})
        if (!task){
            return res.status(404).send(task)
        }
        res.send(task)
    }
    catch(e){
        res.status(500).send(e)
    }
})

  /**
   * Update image in the database by id.
   */
  router.patch("/images/:id", async (req, res) => {
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

  /**
   * multer code that might be useful
   * const multer = require("multer")
const upload = multer({
    dest: "images",
    limits: {
        fileSize: 1000000,
    },
    fileFilter(req, file, cb){
        if (!file.originalname.match(/\.(doc|docx)$/)){ //this is a regular (regex) expression, telling us to accept either doc or docx
            cb(new Error("Please upload a word document"))
        }
        cb(undefined, true)
        //cb(new Error("File must be an image")) //callback exits the function with error
        //cb(undefined, true) //callback silently accepts the function
        //cb(undefined, false) //callback silently rejects the function - don't use
    }
})

//upload.single("keyToSearchFor") = multer middleware
app.post("/upload", upload.single("upload"), (req, res) => {
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
}) //this is an error function

//You can add multiple middleware.
//avatar.single("avatar"), configures multer middleware in avatar, looks for key "avatar" when user makes request
router.post("/users/me/avatar", auth, avatar.single("avatar"), async (req, res) => {
    //req.user.avatar = req.file.buffer //can only access without dest in avatar field
    const buffer = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer() //passed data to sharp, asked sharp for data back. can also resize and convert to specific file
    req.user.avatar = buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({error: error.message})
}) //this end function handles errors!

router.get("/users/:id/avatar", async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set("Content-Type", "image/png")//send back correct data, tell what type of file they're getting back.
        res.send(user.avatar)
    }
    catch (e){
        res.status(404).send()
    }
})
*/