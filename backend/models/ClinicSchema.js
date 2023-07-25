var mongoose = require("mongoose");

const ClinicSchema = new mongoose.Schema({
    name: {type: String, required: true},
    address: {type: String, required: true},
    fee:{type: Number, required:true},
    // type:{ type: String, enum:['hospital','clinic']},
    availability: [
        {
          day:String,
          time:[String],
        }
      ]
  });

module.exports = new mongoose.model("Clinic", ClinicSchema);