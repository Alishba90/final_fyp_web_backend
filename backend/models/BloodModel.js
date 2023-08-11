var mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const BloodBankSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  email:{
    type: String,
  }
 ,
  password:{
    type: String,
    required: true
  },
  time: {
    type: String,

  },
  longitude: {
    type: String,

  },
  latitude: {
    type: String,

  },
BloodGroup: [
  {
    AvailableBloodGroup: String,
    price:String,
    quantity: Number,
    
  }
],coordinates: {
  // Add the coordinates field for geospatial indexing
  type: {
    type: String,
    enum: ["Point"],
    default: "Point",
  },
  coordinates: {
    type: [Number], // [longitude, latitude]
    index: "2dsphere", // Create a 2dsphere index for geospatial queries
  }
}
})
BloodBankSchema.pre('save', async function(next){
    const blood= this;
    
    if(!blood.isModified('password')){
        return next();
    }
    
    blood.password = await bcrypt.hash(blood.password, 8);

    next();
},
//collection name  
{
    collection: 'bloodbanks' // Specify the desired collection name here
}
)

module.exports = new mongoose.model("BloodBank", BloodBankSchema)