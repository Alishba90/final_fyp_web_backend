var mongoose = require("mongoose");

const NCRformsSchema = new mongoose.Schema({
  org_name: {
    type: String,
    required: true,
  },
  org_address: {
    type: String,
    required: true,
  },
  form_description: {
    type: String,
    
  },
  form_department: {
    type: String,
    required: true,
  },
   form_type: {
    type: String,
    required: true,
  },
   form_date : {
    type: String,
    required: true,
  },
    form_no:{
    type: Number,
    required: true,
  },
    form_title:{
    type: String,
    required: true,
  },
    entree_name:{
    type: String,
    required: true,
  },
    resolution_description:{
    type: String,
    
  },
    resolver_name:{
    type: String,
    
  },
    resolution_date:{
    type: String,
    
  },
},    { timestamps: true },
//collection name  
{
    collection: 'NCRforms' // Specify the desired collection name here
}
);

module.exports = new mongoose.model("NCRforms", NCRformsSchema)
