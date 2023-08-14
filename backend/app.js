//modules import
var express = require("express");
var path = require("path");
var cors = require("cors");
const http = require('http');
const socketIO = require('socket.io');
const Order = require("./models/OrderModel");


//internal server files being included
require("dotenv").config();
var apiRouter=require('./routes/api.js');


// DB connection
var MONGODB_URL = process.env.MONGODB_URL;
var mongoose = require("mongoose");
const DB = 'mongodb+srv://fasih:fasih123@cluster0.rnhle3d.mongodb.net/?retryWrites=true&w=majority'
mongoose.set('strictQuery', true);

mongoose.connect(DB, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("DB is connected");
    })
    .catch((err) => 
        console.log('no connection',err)
        
    );
var db = mongoose.connection;

var app = express();

//To allow cross-origin requests
app.use(cors());

const server = http.createServer(app);

// Initialize socket.io
const io = new socketIO.Server(server, {
    cors: {
      origin: "http://localhost:3000", // Replace with your frontend URL
      methods: ["GET", "POST"]
    }
  });


const changeStream=Order.watch()
changeStream.on('change', change => {
    console.log(change.fullDocument)
    // Emit the change event to connected clients
    io.emit('entryAdded', change.fullDocument);
});

io.on('connection', socket => {
    console.log('A client connected');

    // Handle disconnections
    socket.on('disconnect', () => {
        console.log('A client disconnected');
    });
});

//Route Prefixes
app.use("/api/",apiRouter)

server.listen(process.env.PORT || 5000,()=>{
	console.log("server working fine!");
	})

