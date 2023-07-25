var mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  org_name: {
    type: String,
    required: true,
  },
  org_address: {
    type: String,
    required: true,
  },
  items: [{
    name:String,
    quantity:String,
    price:String
  }],
   date : {
    type: String,
    required: true,
  },
    amount:{
    type: Number,
    required: true,
  },
    buyer_name:{
    type: String,
    required: true,
  },
    discount:{
    type:String
    }
},    { timestamps: true },
//collection name  
{
    collection: 'transactions' // Specify the desired collection name here
}
);

module.exports = new mongoose.model("Transaction", TransactionSchema)
