/**
 * The object representation of an Image in our MongoDB database.
 * 
 * Three properties [all required]:
 * photographer - name of person who took photo [format: Firstname Lastname]
 * descriptionAlt - a brief one-sentence description of your image. Will be displayed in case image doesn't display (somehow).
 * imageData - the actual image itself. Stored as a buffer.
 */

 /**
  * Only required import is mongoose (mongoDB, but much easier to work with)
  * We create a schema (blueprint laying out the properties of the object) as described above with timestamps.
  */
const mongoose = require("mongoose")
const imageSchema = new mongoose.Schema({
    photographer: {
        type: String,
        required: true,
        trim: true
    },
    descriptionAlt: {
        type: String,
        required: true,
        trim: true
    },
    imageData: {
        type: Buffer,
        required: true,
    },
    verified:{
        type: Boolean,
        required: true,
        default: false,
    }
}, {
    timestamps: true
})



/**
 * Store our blueprint into a model [the actual object stored in the database] and export it. 
 */
const Image = mongoose.model("Image", imageSchema)
module.exports = Image