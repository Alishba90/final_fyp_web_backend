var mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
  org_name: {
    type: String,
    required: true,
  },
  org_address: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  content:{
    type: String,
  }
},
//collection name  
{
    collection: 'notes' // Specify the desired collection name here
}
);

module.exports = new mongoose.model("Note", NoteSchema)
