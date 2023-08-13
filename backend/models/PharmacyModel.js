var mongoose = require("mongoose");
const bcrypt = require('bcrypt');


const MedicineSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    category: { type: String, required: true },
});

const PharmacySchema = new mongoose.Schema({
    pharmacyname: {
        type: String,
        required: true
    },
    longitude: {
        type: String,
    
      },
      latitude: {
        type: String,
    
      },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        
    },
    time: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        
    },
    password: {
        type: String,
        required: true,
    },
    medicine:[MedicineSchema],
    coordinates: {
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
},
    { timestamps: true });

PharmacySchema.pre('save', async function(next){
    const pharmacy= this;
    
    if(!pharmacy.isModified('password')){
        return next();
    }
    
    pharmacy.password = await bcrypt.hash(pharmacy.password, 8);

    next();
},
//collection name  
{
    collection: 'pharmacies' // Specify the desired collection name here
}
)

module.exports = new mongoose.model("Pharmacy", PharmacySchema)

