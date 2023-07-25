//modules import
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");

//internal server files being included
require("dotenv").config();
var apiRouter=require('./routes/api.js');
var apiResponse = require("./helpers/apiResponse");


// DB connection
var MONGODB_URL = process.env.MONGODB_URL;
var mongoose = require("mongoose");
const DB = 'mongodb+srv://fasih:fasih123@cluster0.rnhle3d.mongodb.net/?retryWrites=true&w=majority'
mongoose.set('strictQuery', true);

mongoose.connect(DB)
    .then(() => {
        console.log("DB is connected");
    })
    .catch((err) => 
        console.log('no connection',err)
        
    );
var db = mongoose.connection;

var app = express();

//don't show the log when it is test
if(process.env.NODE_ENV !== "test") {
	app.use(logger("dev"));
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


//To allow cross-origin requests
app.use(cors());

//Route Prefixes
app.use("/api/",apiRouter)

app.listen(process.env.PORT || 5000,()=>{
	console.log("server working fine!");
	})