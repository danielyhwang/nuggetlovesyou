const mongoose = require("mongoose")

//connect to database
mongoose.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false, //resolves deprecation warning,
    useUnifiedTopology: true //resolving server discover and monitoring engine
})