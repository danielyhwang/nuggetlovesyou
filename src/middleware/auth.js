const jwt = require("jsonwebtoken")
const Admin = require("../models/Admin")

//authentication function. Sets token and admin equal to appropriate values if token links to valid user.
const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "") //extract token data
        const decoded = jwt.verify(token, process.env.JWT_SECRET) //ensure it's valid
        const admin = await Admin.findOne({ _id: decoded._id, "tokens.token" : token}) //find admin with that token

        if (!admin){
            throw new Error()
        }
        req.token = token;
        req.admin = admin;
        next()
    }
    catch (e) {
        res.status(401).send({"error": "Please authenticate."})
    }
}

module.exports = auth