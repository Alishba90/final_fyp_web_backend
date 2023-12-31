const Transaction = require("../models/TransactionModel");
const Order =require('../models/OrderModel')
const Pharmacy = require("../models/PharmacyModel.js");
const Blood = require("../models/BloodModel");

//function to get all transactions
exports.allTransactions=[
	async (req, res) => {
    console.log('this is recieve',req.params.org_name,req.params.org_address)
    try{
        Transaction.find({org_name:req.params.org_name,org_address:req.params.org_address}).then(trans=>{
            if(trans.length){
                    var transaction=trans;
                return res.status(200).send({ history:transaction });
            }
            else{
                return res.status(430).send({ null_data:"No transactions found"});
            }
        })
    }

    catch(err){
        console.log(err);
        return res.status(430).send({ error: err});
    }
    }
]

//function to get last transaction
exports.LastTransaction = [
  async (req, res) => {
    console.log('this is received', req.params.org_name, req.params.org_address);
    try {
      var trans = await Transaction.findOne({ org_name: req.params.org_name, org_address: req.params.org_address })
        .sort({ createdAt: -1 })
        .lean(); // <-- Use .lean() to convert the MongoDB document to a plain JavaScript object

      if (trans) {
        var transaction = trans;
        
        return res.status(200).send({ transaction: transaction });
      } else {
        return res.status(430).send({ null_data: "No transactions found" });
      }
    } catch (err) {
      console.log(err);
      return res.status(430).send({ error: err });
    }
  },
];

//function to add a new transaction for pharmacies
exports.addTransactionMeds=[
	async (req, res) => {
    
    try{
        
           await Pharmacy.find({
            pharmacyname: req.body.org_name, address:req.body.address 
            }).then(pharmacy=>{  
            if (pharmacy.length) {
                
                req.body.transactioninfo.items.map((i,ind)=>{
                    
                    
                    pharmacy[0].medicine.forEach((medicine) => {
                        if (medicine.name === i.name) {

                            
                                medicine.quantity -= parseInt(i.quantity);
                            
                        }
                    });
                    });
                    pharmacy[0].save();
            }
            else{
                return res.status(430).send({ error: err});
            }

            })


            let transaction=new Transaction({
                org_name:req.body.org_name,
                org_address:req.body.address,
                items:req.body.transactioninfo.items,
                date:req.body.transactioninfo.date,
                amount:req.body.transactioninfo.amount,
                buyer_name:req.body.transactioninfo.buyer_name,
                discount:req.body.transactioninfo.discount
            })
            transaction.save();
            console.log("Transaction created successfully")


            return res.status(200).send({ message: "Transaction created successfully" });
        
    
    }
    catch(err){
        console.log(err);
        return res.status(430).send({ error: err});
    }
     }
]

//function to add a new transaction for bloodbank
exports.addTransactionBlood=[
	 async (req, res) => {
    console.log('this is recieve',req.body)

    try{
            await Blood.find({
                name: req.body.org_name, address:req.body.address 
            }).then(blood=>{
             
            if (blood.length) {
                req.body.transactioninfo.items.map((i,ind)=>{
                    
                    
                    blood[0].BloodGroup.forEach((b) => {
                        if (b.AvailableBloodGroup === i.name) {

                                b.quantity -= parseInt(i.quantity);
                            
                        }
                    });
                    });
                    try{
                        blood[0].save();
                        console.log("Blood Group stock updated successfully");
                    }catch(e){
                        console.log("problem updating blood stock",e);
                    }

            }
            else{
                return res.status(430).send({ error: err});
            }
            })
            let transaction=new Transaction({
                org_name:req.body.org_name,
                org_address:req.body.address,
                items:req.body.transactioninfo.items,
                date:req.body.transactioninfo.date,
                amount:req.body.transactioninfo.amount,
                buyer_name:req.body.transactioninfo.buyer_name,
                discount:req.body.transactioninfo.discount
            })
            transaction.save();
            console.log("Transaction created successfully")


            return res.status(200).send({ message: "Transaction created successfully" });
        
    
    }
    catch(err){
        console.log(err);
        return res.status(430).send({ error: err});
    }
     }
]