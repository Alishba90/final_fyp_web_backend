const Pharmacy = require("../models/PharmacyModel.js");
const Note=require('../models/NoteModel');

const bcrypt = require('bcrypt');

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

//Update pharmacy 
exports.UpdatePharmacy = [

	(req, res) => {
    console.log('this is recieve',req.body)
    try{
        var pharmacy=new Pharmacy(
            {
                pharmacyname:req.body.pharmacyinfo.pharmacyname,
                address:req.body.pharmacyinfo.address,
                email:req.body.pharmacyinfo.email,
                password :req.body.pharmacyinfo.password,
                phone:req.body.pharmacyinfo.phone,
                time:settime(req.body.pharmacyinfo.time.open,req.body.pharmacyinfo.time.close)
    
                }    
            )
        Pharmacy.findOneAndUpdate(
				{pharmacyname:req.body.old_name , address:req.body.old_address},
				pharmacy
				).then(()=>{
                
                if(req.body.pharmacyinfo.name!=req.body.old_name||req.body.pharmacyinfo.address!=req.body.old_address){
                    Note.updateMany({org_name:req.body.old_name,org_address:req.body.old_address},
                    {org_name:req.body.pharmacyinfo.pharmacyname,org_address:req.body.pharmacyinfo.address})

                    Order.updateMany({org_name:req.body.old_name,org_address:req.body.old_address},
                    {org_name:req.body.pharmacyinfo.pharmacyname,org_address:req.body.pharmacyinfo.address})

                    Transaction.updateMany({org_name:req.body.old_name,org_address:req.body.old_address},
                    {org_name:req.body.pharmacyinfo.pharmacyname,org_address:req.body.pharmacyinfo.address})

                }
                    console.log('i am here')
                    var p=Pharmacy.find({Name:req.body.pharmacyinfo.name,Email:req.body.pharmacyinfo.email})

                    console.log('the pharmacy updated and send',p)
                    return res.status(200).send({pharmacy:p});
                }    
            )
    }
    catch(err){
        console.log(err);
        return res.status(430).send({ error: err});
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