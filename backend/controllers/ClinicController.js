const Doctor=require('../models/DoctorModel')
const apiResponse = require("../helpers/apiResponse");

//set the time whether its 24/7 or something else
function settime(open,close){
    if (open===''&&close===''){
        return '24/7'
    }
    else{
        return open+'-'+close
    }
}