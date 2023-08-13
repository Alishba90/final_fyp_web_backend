var mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const HospitalSchema = new mongoose.Schema({
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
 longitude: {
  type: String,

},
latitude: {
  type: String,

},
  time:{
    type: String,
  },
  password:{
    type: String,
    required: true

  },
  Hospitaldr: [
    {
      Name: String,
      email: String,
      Education: String,
      Speciality: String,
      Experience: String,
      Department: String,
      availability: [
        {
          day:String,
          time:[String],
        }
      ],
      fee: Number,
    },
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
}
,
//collection name  
{
    collection: 'hospitals' // Specify the desired collection name here
}
);

HospitalSchema.pre('save', async function(next){
    const hospital= this;
    
    if(!hospital.isModified('password')){
        return next();
    }
    
    hospital.password = await bcrypt.hash(hospital.password, 8);

    next();
},
//collection name  
{
    collection: 'hospitals' // Specify the desired collection name here
}

)

module.exports = new mongoose.model("Hospital", HospitalSchema);

