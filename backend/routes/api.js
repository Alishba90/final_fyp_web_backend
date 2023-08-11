var express = require("express");
var PharmacyRouter=require('./pharmacy');
var BloodRouter=require('./blood');
var DoctorRouter=require('./doctor');
var HospitalRouter=require('./hospital');

var TransactionRouter=require("./transaction");
var app = express();



app.use('/pharmacy',PharmacyRouter);
app.use('/hospital',HospitalRouter);
app.use('/doctor',DoctorRouter);
app.use('/bloodbank',BloodRouter);
app.use('/transactionandorder',TransactionRouter);

module.exports = app;