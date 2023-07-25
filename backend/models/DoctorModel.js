var mongoose = require("mongoose");
const bcrypt = require('bcrypt');

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
const DoctorSchema = new mongoose.Schema({

    Name: {type: String, required: true},
    Education: {type: String, required: true},
    Speciality: {type: String, required: true},
    Experience:{type: Number, required:true},
    Email:{type: String, required:true},
    Phone:{type: String, required:true},
    password:{type: String, required:true},
    Waiting :{type: Number},
    Description: {type: String},
    Ratings: {
      type: Number,
      default: 1,
      min: 0,
      max: 5,
      get: function(v) {
        return parseFloat(v.toFixed(2));
      }
    },
   
    Hospitals:[ClinicSchema]
}, {timestamps: true}
,
//collection name  
{
    collection: 'doctors' // Specify the desired collection name here
}

);

DoctorSchema.pre('save', async function(next){
    const doctor= this;
    
    if(!doctor.isModified('password')){
        return next();
    }
    
    doctor.password = await bcrypt.hash(doctor.password, 8);
    
    next();
})

module.exports = new mongoose.model("Doctor", DoctorSchema);