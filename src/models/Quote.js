/**
 * The object representation of an Quote in our MongoDB database.
 * 
 * Two properties [all required]:
 * quote: The main quote itself. [format: Text block, NO QUOTATION MARKS]
 * author: The person/entity who is credited for the quote [format: Firstname Lastname]
 */

 /**
  * Only required import is mongoose (mongoDB, but much easier to work with)
  * We create a schema (blueprint laying out the properties of the object) as described above with timestamps.
  */
 const mongoose = require("mongoose")
 const quoteSchema = new mongoose.Schema({
     quote: {
         type: String,
         required: true,
         trim: true
     },
     author: {
         type: String,
         required: true,
         trim: true
     },
     verified: {
         type: Boolean,
         required: true,
         default: false
     }
 }, {
     timestamps: true
 })
 
 /**
  * Store our blueprint into a model [the actual object stored in the database] and export it. 
  */
 const Quote = mongoose.model("Quote", quoteSchema)
 module.exports = Quote