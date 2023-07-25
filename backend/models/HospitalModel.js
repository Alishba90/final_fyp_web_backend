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
  ],
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

