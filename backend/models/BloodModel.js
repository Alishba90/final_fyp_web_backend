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
BloodGroup: [
  {
    AvailableBloodGroup: String,
    price:String,
    quantity: Number,
    
  }
]
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