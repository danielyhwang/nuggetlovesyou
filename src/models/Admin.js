const mongoose = require("mongoose")
const validator = require("validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
//create Admin model with email, password, and tokens

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
        unique: true, //guarantees this property is unique!
        validate(value){
            if (!validator.isEmail(value)){
                throw new Error("Email is invalid!")
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 7,
        trim: true,
        validate(value){
            if (value.length < 7){
                throw new Error("Password is too short.")
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true,
        }
    }],
}, {
    timestamps: true
})

//finds an admin by credentials.
adminSchema.statics.findByCredentials = async (email, password) => {
    const admin= await Admin.findOne({email})
    if (!admin){
        throw new Error("Unable to login.");
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch){
        throw new Error("Unable to login."); 
    }

    return admin;
}  

//attachs an authentication token onto a new user
adminSchema.methods.generateAuthToken = async function () {
    const admin = this
    const token = jwt.sign({_id: admin._id.toString() }, process.env.JWT_SECRET)

    admin.tokens = admin.tokens.concat({token})
    await admin.save()
    
    return token
}   

//default method on an object, does the work of converting object to JSON
adminSchema.methods.toJSON = function () {
    const admin = this;
    const adminObject = admin.toObject();

    delete adminObject.password
    delete adminObject.tokens

    return adminObject;
}

//hash plain text password before saving
adminSchema.pre("save", async function (next) {
    const admin = this;

    if (admin.isModified("password")) {
        admin.password = await bcrypt.hash(admin.password, 8)
    }

    next() //ends the async function!
}) //run this before event "save" completes

const Admin = mongoose.model("Admin", adminSchema)

module.exports = Admin