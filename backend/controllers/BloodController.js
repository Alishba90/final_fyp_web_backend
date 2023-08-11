const Blood = require("../models/BloodModel");
const bcrypt = require('bcrypt');

const Transaction = require("../models/TransactionModel");

// Blood Bank Schema
function BloodData(data) {
    
    this.name =data.name;
    this.longitude=data.longitude;
    this.latitude=data.latitude;
	this.address =data.address;
	this.email=data.email;
    this.coordinates=data.coordinates;
	this.password =data.password;
	this.phone=data.phone;
	this.city =data.city;
    this.coordinates=data.coordinates;
	this.time=data.time;
	this.BloodGroup=data.BloodGroup
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

//To get Blood Bank details
exports.BloodBankDetail = [

	async (req, res) => {
    console.log('this is recieve',req.body)
    try{
        await Blood.findOne({name:req.params.name , address:req.params.address}).then(blood=>{
                if(blood){
                        
                    var b=new BloodData(blood[0])

                    return res.status(200).send({org:b});
                }
                else{
                    return res.status(430).send({ null_data:"No such bloodbank found"});
                }    
            })
    }
    catch(err){
        console.log(err);
        return res.status(430).send({ error: err});
    }
    }
];

//Add a new Blood Bank 
exports.AddBloodBank = [

	(req, res) => {
    console.log('this is recieve',req.body)
    try{
        Blood.findOne({name:req.body.name , address:req.body.address}).then(bank=>{
                if(bank){
                    return res.status(430).send({error:"This Blood Bank already exist"});
                }
                else{
                    
                    var blood=new Blood({
                        name:req.body.name,
                        longitude:req.body.longitude,
                        latitude:req.body.latitude,
	                    address:req.body.address,
	                    email:req.body.email,
	                    password :req.body.password,
	                    phone:req.body.phone,
	                    city:req.body.city,
                        coordinates:{type:'Point',coordinates:[req.body.longitude,req.body.latitude]},
	                    time:settime(req.body.time.open,req.body.time.close)

                    })
					blood.save()
                    return res.status(200).send({message:"Blood Bank added successfully"});
                }    
            })
    }
    catch(err){
        console.log(err);
        return res.status(420).send({ error: err});
    }
    }
];

//Update Blood Bank 
exports.UpdateBloodBank = [
	(req, res) => {
    console.log('this is recieve',req.body)
    try{

        Blood.findOneAndUpdate(
          { name: req.body.old_name, address: req.body.old_address },
          {
            name: req.body.bloodbankinfo.name,
            address: req.body.bloodbankinfo.address,
            email: req.body.bloodbankinfo.email,
            password: req.body.bloodbankinfo.password,
            phone: req.body.bloodbankinfo.phone,
            time: (req.body.bloodbankinfo.time.open === '' || req.body.bloodbankinfo.time.close === '')
              ? '24/7'
              : settime(req.body.bloodbankinfo.time.open, req.body.bloodbankinfo.time.close)
          },
          { new: true } // Add this option to return the updated document
        ).then(()=>{
                
                
                if(req.body.bloodbankinfo.name!=req.body.old_name||req.body.bloodbankinfo.address!=req.body.old_address){
                 



                    Transaction.updateMany({org_name:req.body.old_name,org_address:req.body.old_address},
                    {org_name:req.body.bloodbankinfo.name,org_address:req.body.bloodbankinfo.address})


                }
                    console.log('i am here',req.body.bloodbankinfo,req.body.bloodbankinfo.email)
                    Blood.findOne({ name: req.body.bloodbankinfo.name, email: req.body.bloodbankinfo.email })
                        .then(b => {
                            if (b) {
                                console.log('the bloodbank updated and send', b);
                                return res.status(200).send({ bloodbank: b });
                            }
                        })


                }    
            )
    }
    catch(err){
        console.log(err);
        return res.status(430).send({ error: err});
    }
    }
];

//Delete Blood Bank
exports.DeleteBloodBank = [

	(req, res) => {
    console.log('this is recieve',req.body)
    try{
		
        Blood.deleteOne(
				{name:req.params.name , address:req.params.address},
				
				).then(()=>{
                
                    return res.status(200).send({message:"Blood Bank deleted successfully"});
                }    
            )
    }
    catch(err){
        console.log(err);
        return res.status(430).send({ error: err});
    }
    }
];

//function to display all Blood Bank branches
exports.BloodBankBranches = [
	
	async (req, res) => {
    console.log('this is recieve',req.body)
    try{
        Blood.find({name:req.params.name}).then(bb=>{
            if(bb.length){
                let branches_name=[]
                for (var b=0;b<bb.length;b++){
                    var branch=new BloodData(bb[b])
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

//function to login to a blood bank
exports.LoginBloodBank=[
    async (req,res)=>{
        console.log('this is recieved ',req.body)
        try{
            Blood.find({name:req.body.name,address:req.body.branch}).then(blood=>{
                if(blood.length){
                    let bb=new BloodData(blood[0])
                    if(compare(bb.password,req.body.password)){
                        return res.status(200).send({user:bb})
                    }
                    else{
                        return res.status(430).send({error:'Please enter correct password'})
                    }
                }
                else{
                    return res.status(420).send({error:"No such blood bank exist"})
                }
            })
        }
        catch(err){
            console.log(err)
        }
    }
]

//function to get all the blood groups
exports.AllBloodGroups=[
	
	async (req, res) => {
    console.log('this is recieve',req.params)
    try{
        await Blood.findOne({name:req.params.org_name , address:req.params.org_address}).then(bank=>{
          
                if(bank){
                        
                    var bloodgroups=bank.BloodGroup
                  console.log('bank is',bloodgroups)
                    return res.status(200).send({ bloodgroups:bloodgroups});
                }
                else{

                    return res.status(430).send({ error:"No such bloodbank found"});
                }    
            })
    }
    catch(err){
        console.log(err);
        return res.status(430).send({ error: err});
    }
    }
]

//function to update blood group
exports.updateBloodGroup = [
  async (req, res) => {
    console.log('this is received', req.body);

    try {
        const { name, address, blood_list } = req.body;
        const bank=await Blood.findOne({
            name: name, address 
        })  
      
      if (bank) {

        const Bloodtoupdate =bank.BloodGroup.find(m=>m.AvailableBloodGroup ===blood_list[0].oldtype )

        if(Bloodtoupdate){
            Bloodtoupdate.AvailableBloodGroup=blood_list[0].type;
            Bloodtoupdate.price=parseInt(blood_list[0].price);
            Bloodtoupdate.quantity=parseInt(blood_list[0].quantity);

            await bank.save();
            console.log("Blood Group updated successfully");
            return res.status(200).send({ message: "Blood Group updated successfully" });
        }


      } else {
        return res.status(422).send({ error: "No such blood bank exists" });
      }
    } catch (err) {
      console.log(err);
      return res.status(430).send({ error: err });
    }
  }
];

//function to delete selected blood groups
exports.deleteSelectedBlood = [
  async (req, res) => {
    console.log('this is received', req.params);

    try {
      const { name, address, fields } = req.params;

      const deletedBlood = fields.split(',');

      const bank = await Blood.findOne({ name: name, address });

      if (bank) {
        deletedBlood.forEach((deletedBloodgroup) => {
          bank.BloodGroup = bank.BloodGroup.filter(
            (BloodGroup) => BloodGroup.AvailableBloodGroup !== deletedBloodgroup
          );
        });

        await bank.save();

        console.log("Blood types deleted successfully");
        return res.status(200).send({ message: "Blood types deleted successfully" });
      } else {
        return res.status(422).send({ error: "No such blood bank exists" });
      }
    } catch (err) {
      console.log(err);
      return res.status(430).send({ error: err });
    }
  }
];

//function to add blood group 
exports.AddBloodGroup=[

  async (req, res) => {
    console.log('this is receive', req.body);

    try {
      const blood = await Blood.findOne({
        name: req.body.name,
        address: req.body.address
      });

      if (blood) {
        const bloodList = req.body.blood_list;

        for (let i = 0; i < bloodList.length; i++) {
          const b = bloodList[i];
          
          const existingBloodGroup = blood.BloodGroup.find(m => m.AvailableBloodGroup === b.type );

          if (existingBloodGroup) {
          
            if(b.price>0){
            existingBloodGroup.price = b.price;}
            existingBloodGroup.quantity =parseInt(existingBloodGroup.quantity)+ parseInt(b.quantity);
          } else {

            blood.BloodGroup.push({
              AvailableBloodGroup: b.type,
              price: b.price,
              quantity: b.quantity,
              
            });
          }
        }

        await blood.save();

        console.log("Blood Groups added successfully");
        return res.status(200).send({ message: "Blood Groups added successfully" });
      } else {
        return res.status(430).send({ error: "No such blood bank exists" });
      }
    } catch (err) {
      console.log("db error", err);
      return res.status(422).send({ error: err });
    }
  }
]

//To get Blood Bank stats
exports.BloodBankStats = [
    (req, res) => {
     
        try {
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
            let item_sold_today = 0;
            let popular_blood = '';

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
                    ]).exec()
                ]);
            }).then(([transactionResult]) => {
                if (transactionResult[0] ) {
                    popular_blood = transactionResult[0]._id;
                } 


                // Send the response
                return res.status(200).json({
                    popular_blood: popular_blood,
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
