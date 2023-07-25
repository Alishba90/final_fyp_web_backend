var mongoose = require("mongoose");
const bcrypt = require('bcrypt');

const DepartmentSchema = new mongoose.Schema({
  org_name: {
    type: String,
    required: true,
  },
  org_address: {
    type: String,
    required: true,
  },
   password: {
    type: String,
    required: true,
  },
    admin_name:{
    type: String,
    required: true,
    },
    phone: {
        type: String,
        required: true
    },
    name:{
        type: String,
        required: true
    },
},//collection name  
{
    collection: 'departments' // Specify the desired collection name here
}
);


DepartmentSchema.pre('save', async function(next){
    const department= this;
    
    if(!department.isModified('password')){
        return next();
    }
    
    department.password = await bcrypt.hash(department.password, 8);

    next();
},
//collection name  
{
    collection: 'departments' // Specify the desired collection name here
}
);

module.exports = new mongoose.model("Department", DepartmentSchema)