const Pharmacy = require("../models/PharmacyModel.js");
const Note=require('../models/NoteModel');
const Order = require("../models/OrderModel");
const bcrypt = require('bcrypt');
const Transaction=require('../models/TransactionModel.js')
// Pharmacy Schema
function PharmacyData(data) {
    
    this.pharmacyname =data.pharmacyname;
	this.address =data.address;
	this.email=data.email;
	this.password =data.password;
	this.phone=data.phone;
	this.city =data.city;
	this.time=data.time;
	this.medicine=data.medicine;
}
//set the time whether its 24/7 or something else
function settime(open,close){
    if (open===''&&close===''){
        return '24/7'
    }
    else{
        return open+'-'+close
    }
}

//To get Pharmacy details
exports.PharmacyDetail = [

	async (req, res) => {
    console.log('this is recieve',req.body)
    try{
        await Pharmacy.findOne({pharmacyname:req.params.name , address:req.params.address}).then(pharma=>{
                if(pharma){
                        
                    var pharmacy=new PharmacyData(pharma)

                    return res.status(200).send({org:pharmacy});
                }
                else{
                    return res.status(430).send({ null_data:"No such pharmacy found"});
                }    
            })
    }
    catch(err){
        console.log(err);
        return res.status(430).send({ error: err});
    }
    }
];

//To get Pharmacy stats
exports.PharmacyStats = [
    (req, res) => {
        console.log('this is received for stats', req.params);
        try {
            var currentDateorder = new Date().toLocaleDateString('en-GB');
            
            currentDateorder=parseInt(currentDateorder.split('/')[2])+ '-'+currentDateorder.split('/')[1]+ '-'+currentDateorder.split('/')[0];
            currentDateorder=currentDateorder.toString()
            console.log(currentDateorder)

            var currentDatetransact = new Date().toLocaleDateString('en-GB');
            currentDatetransact = parseInt(currentDatetransact.split('/')[0]) + '/' + parseInt(currentDatetransact.split('/')[1]) + '/' + parseInt(currentDatetransact.split('/')[2]);
            currentDatetransact = currentDatetransact.toString();

            // Get the date exactly one week ago from the current date
            var oneWeekAgo = new Date();
            oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
            oneWeekAgo = oneWeekAgo.toLocaleDateString('en-GB');
            oneWeekAgo = parseInt(oneWeekAgo.split('/')[0]) + '/' + parseInt(oneWeekAgo.split('/')[1]) + '/' + parseInt(oneWeekAgo.split('/')[2]);
            oneWeekAgo = oneWeekAgo.toString();

            let transac_amount_today = 0;
            let transac_amount_week = 0;
            let total_orders_today = 0;
            let pending_orders_today = 0;
            let item_sold_today = 0;
            let popular_med = '';

            // Total amount of sales for the day
            Transaction.aggregate([
                { $match: { org_name: req.params.name, org_address: req.params.address, date: currentDatetransact } },
                { $group: { _id: null, totalAmountToday: { $sum: '$amount' } } }
            ]).exec().then(resultToday => {
                if (resultToday[0]) {
                    transac_amount_today = resultToday[0].totalAmountToday;
                }

                // Total amount of sales for the past week
                return Transaction.aggregate([
                    { $match: { org_name: req.params.name, org_address: req.params.address, date: { $gte: oneWeekAgo, $lte: currentDatetransact } } },
                    { $group: { _id: null, totalAmountWeek: { $sum: '$amount' } } }
                ]).exec();
            }).then(resultWeek => {
                if (resultWeek[0]) {
                    transac_amount_week = resultWeek[0].totalAmountWeek;
                }

                // For orders today
                return Order.countDocuments({ date: currentDateorder, org_name: req.params.name, org_address: req.params.address });
            }).then(todayOrders => {
                total_orders_today = todayOrders;

                // For today orders pending
                return Order.countDocuments({ date: currentDateorder, org_name: req.params.name, org_address: req.params.address, status: 'pending' });
            }).then(todayPendingOrders => {
                pending_orders_today = todayPendingOrders;


                // Calculate total number of items sold for the day
                return Transaction.aggregate([
                    { $match: { org_name: req.params.name, org_address: req.params.address, date: currentDatetransact } },
                    { $unwind: '$items' },
                    { $group: { _id: null, totalItemsSold: { $sum: { $toInt: '$items.quantity' } } } }
                ]).exec();
            }).then(resultItemsSold => {
                if (resultItemsSold[0]) {
                    item_sold_today = resultItemsSold[0].totalItemsSold;
                }

                // Get the popular item based on both transactions and orders
                return Promise.all([
                    Transaction.aggregate([
                        { $match: { org_name: req.params.name, org_address: req.params.address } },
                        { $unwind: '$items' },
                        { $group: { _id: '$items.name', totalQuantity: { $sum: { $toInt: '$items.quantity' } } } },
                        { $sort: { totalQuantity: -1 } },
                        { $limit: 1 }
                    ]).exec(),
                    Order.aggregate([
                        { $match: { org_name: req.params.name, org_address: req.params.address } },
                        { $unwind: '$items' },
                        { $group: { _id: '$items.name', totalQuantity: { $sum: { $toInt: '$items.quantity' } } } },
                        { $sort: { totalQuantity: -1 } },
                        { $limit: 1 }
                    ]).exec()
                ]);
            }).then(([transactionResult, orderResult]) => {
                if (transactionResult[0] && orderResult[0]) {
                    popular_med = transactionResult[0]._id;
                } else if (transactionResult[0]) {
                    popular_med = transactionResult[0]._id;
                } else if (orderResult[0]) {
                    popular_med = orderResult[0]._id;
                }

                console.log('..................................................', popular_med, pending_orders_today, total_orders_today, transac_amount_today, transac_amount_week, item_sold_today);

                // Send the response
                return res.status(200).json({
                    popular_med: popular_med,
                    pending_orders_today: pending_orders_today,
                    total_orders_today: total_orders_today,
                    transac_amount_today: transac_amount_today,
                    transac_amount_week: transac_amount_week,
                    item_sold_today: item_sold_today
                });
            }).catch(err => {
                console.log(err);
                return res.status(430).json({ error: err });
            });
        } catch (err) {
            console.log(err);
            return res.status(430).json({ error: err });
        }
    }
];

//Add a new pharmacy 
exports.AddPharmacy = [

	(req, res) => {
    console.log('this is recieve',req.body)
    try{
        Pharmacy.findOne({pharmacyname:req.body.name , address:req.body.address}).then(pharma=>{
                if(pharma){
                    
                    return res.status(430).send({error:"This Pharmacy already exist"});
                }
                else{
                    
                    var pharmacy=new Pharmacy(
                        {
                            pharmacyname:req.body.name,
	                        address:req.body.address,
	                        email:req.body.email,
	                        password :req.body.password,
	                        phone:req.body.phone,
	                        city:req.body.city,
	                        time:settime(req.body.time.open,req.body.time.close)
	            
                            }    
                        )



					pharmacy.save()
                    return res.status(200).send({message:"Pharmacy added successfully"});
                }    
            })
    }
    catch(err){
        console.log(err);
        return res.status(420).send({ error: err});
    }
    }
];

//update pharmacy

exports.UpdatePharmacy = [
  (req, res) => {
    console.log('this is recieve', req.body);
    try {
      var pharmacy = {
        pharmacyname: req.body.pharmacyinfo.pharmacyname,
        address: req.body.pharmacyinfo.address,
        email: req.body.pharmacyinfo.email,
        password: req.body.pharmacyinfo.password,
        phone: req.body.pharmacyinfo.phone,
        time: settime(req.body.pharmacyinfo.time.open, req.body.pharmacyinfo.time.close)
      };

      Pharmacy.findOneAndUpdate(
        { pharmacyname: req.body.old_name, address: req.body.old_address },
        pharmacy,
        { new: true, omitUndefined: true } // Add options to return the updated document and omit undefined fields
      ).then(updatedPharmacy => {
        if (!updatedPharmacy) {
          return res.status(404).send({ error: 'Pharmacy not found' });
        }

        if (req.body.pharmacyinfo.name !== req.body.old_name || req.body.pharmacyinfo.address !== req.body.old_address) {
          Note.updateMany(
            { org_name: req.body.old_name, org_address: req.body.old_address },
            { org_name: req.body.pharmacyinfo.pharmacyname, org_address: req.body.pharmacyinfo.address }
          );

          Order.updateMany(
            { org_name: req.body.old_name, org_address: req.body.old_address },
            { org_name: req.body.pharmacyinfo.pharmacyname, org_address: req.body.pharmacyinfo.address }
          );

          Transaction.updateMany(
            { org_name: req.body.old_name, org_address: req.body.old_address },
            { org_name: req.body.pharmacyinfo.pharmacyname, org_address: req.body.pharmacyinfo.address }
          );
        }

        console.log('the pharmacy updated and send', updatedPharmacy);
        return res.status(200).send({ pharmacy: updatedPharmacy });
      });
    } catch (err) {
      console.log(err);
      return res.status(430).send({ error: err });
    }
  }
];


//Delete pharmacy 
exports.DeletePharmacy = [

	(req, res) => {
    console.log('this is recieve',req.body)
    try{
		
        Pharmacy.deleteOne(
				{pharmacyname:req.params.name , address:req.params.address},
				
				).then(()=>{
                
                    return res.status(200).send({message:"Pharmacy deleted successfully"});
                }    
            )
    }
    catch(err){
        console.log(err);
        return res.status(430).send({ error: err});
    }
    }
];

//function to display all Pharmacy branches
exports.PharmacyBranches = [
	
	async (req, res) => {
    console.log('this is recieve',req.params.name)
    try{
        Pharmacy.find({pharmacyname:req.params.name}).then(pb=>{
            if(pb.length){
                let branches_name=[]
                for (var b=0;b<pb.length;b++){
                    var branch=new PharmacyData(pb[b])
                    branches_name.push(branch.address)
                }
                return res.status(200).send({ branch:branches_name });
            }
            else{
                return res.status(430).send({ null_data:"No branches found"});
            }
            
        })
    }
    catch(err){
        console.log(err);
        return res.status(430).send({ error: err});
    }
    }
]

async function compare(a,b){
    let c=await bcrypt.hash(b, 8)
    return a=c
}

//function to login to a pharmacy
exports.LoginPharmacy=[
    async (req,res)=>{
        console.log('this is recieved ',req.body)
        try{
            Pharmacy.find({pharmacyname:req.body.name,address:req.body.branch}).then(pharma=>{
                if(pharma.length){
                    let pharm=new PharmacyData(pharma[0])
                    if(compare(pharm.password,req.body.password)){
                        return res.status(200).send({user:pharm})
                    }
                    else{
                        return res.status(430).send({error:'Please enter correct password'})
                    }
                }
                else{
                    return res.status(420).send({error:"No such pharmacy exist"})
                }
            })
        }
        catch(err){
            console.log(err)
        }
    }
]