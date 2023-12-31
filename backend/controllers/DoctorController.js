const Doctor=require('../models/DoctorModel')
const apiResponse = require("../helpers/apiResponse");
const Appointment=require('../models/Appointmentmodel')
const bcrypt = require('bcrypt');
// Doctor Schema
function DoctorData(data) {
    
    this.Name=data.Name;
    this.Education=data.Education;
    this.Speciality=data.Speciality;
    this.Experience=data.Experience;
    this.Email=data.Email;
    this.Phone=data.Phone;
    this.password=data.password;
    this.Waiting=data.Waiting;
    this.Description=data.Description;
    this.Ratings=data.Ratings;
    this.Hospitals=data.Hospitals;
}

//To get Doctor details

exports.DoctorDetail = [

	async (req, res) => {

    try{
        const { name, email } = req.params;

        const doctor = await Doctor.findOne({ Name: name, Email: email });
    
        if (doctor) {
          return res.status(200).json({ doctor });
        } else {
          return res.status(404).json({ error: 'Doctor not found' });
        }
    }
    catch(err){
        console.error(err);
    return res.status(500).json({ error: 'Internal server error' });
    }
    }
];

//Add a new doctor
exports.AddDoctor = [

	(req, res) => {

    try{
        Doctor.findOne({Name:req.body.name , Email:req.body.email}).then(dr=>{
                if(dr){
                    return res.status(430).send({error:"This org already exist"});
                }
                else{
                    var doctor=new Doctor({
                            Name:req.body.name,
                            Education:req.body.education,
                            Speciality:req.body.speciality,
                            Experience:req.body.experience,
                            Email:req.body.email,
                            Phone:req.body.phone,
                            password:req.body.password,
                    })

					doctor.save()
                    return res.status(200).send({user:doctor});
                }    
            })
    }
    catch(err){
        console.log(err);
        return res.status(430).send({ error: err});
    }
    }
];

//update doctor information
exports.UpdateDoctor = [
    (req, res) => {
    
      try {
        const updateFields = {
          Name: req.body.doctorinfo.Name,
          Education: req.body.doctorinfo.Education,
          Speciality: req.body.doctorinfo.Speciality,
          Experience: req.body.doctorinfo.Experience,
          Email: req.body.doctorinfo.Email,
          Phone: req.body.doctorinfo.Phone,
          password: req.body.doctorinfo.password,
          Hospitals: req.body.doctorinfo.Hospitals, // Add updated hospitals here
        };
  
        
  
        Doctor.findOneAndUpdate(
				{Name:req.body.old_name , Email:req.body.old_email},
				doctor
				).then(()=>{

                
                    var doc=Doctor.find({Name:req.body.doctorinfo.name,Email:req.body.doctorinfo.email})

            
                    return res.status(200).send({doctor:doc});
                }    
            )
    }
    catch(err){
        console.log(err);
        return res.status(430).send({ error: err });
      }
    }
];

//Update doctor schedule
exports.UpdateDoctorSchedule = [

	(req, res) => {


    try{
        
        var element=[]
        var s=req.body.schedule
        for(var i=0;i<s.length;i++){
            var availabilityarray=[]
            for(var j=0;j<s[i].availability.length;j++){
                var timeslot=[]
                for(var y=0;y<s[i].availability[j].time.length;y++){
                    if(s[i].availability[j].time[y].trim().length>0){
                        
                        timeslot.push(s[i].availability[j].time[y])
                    }
                }
                
                if(timeslot.length>0){
                    availabilityarray.push({day:s[i].availability[j].day,time:timeslot})
                }
                
            }
            
            if(availabilityarray!=[]){
                var longitude=0;var latitude=0;
                if (s[i].longitude !== '' && s[i].latitude !== '' &&
                !isNaN(parseFloat(s[i].longitude)) && !isNaN(parseFloat(s[i].latitude))) {
                    longitude=parseFloat(s[i].longitude)
                    latitude=parseFloat(s[i].longitude)
                }    
                element.push({
                    name:(s[i].name!='')?s[i].name:'Unnamed',
                    address:s[i].address,
                    longitude:s[i].longitude,
                    latitude:s[i].latitude,
                    coordinates:{type:'Point',coordinates:[longitude,latitude]},
                    fee:s[i].fee!=''?s[i].fee:0,
                    availability:availabilityarray})
            }
        }
        
     
        Doctor.findOneAndUpdate(
				{Name:req.body.name , Email:req.body.email},
				{Hospitals:element}
				).then(()=>{

                    return res.status(200).send({message:"Successfully updated doctor"});
                }    
            )
        
    }
    catch(err){
        console.log(err);
        return res.status(430).send({ error: err});
    }
    }
];

//Delete doctor
exports.DeleteDoctor = [

	(req, res) => {
     try{
		
        Doctor.deleteOne(
				{Name:req.params.name , Email:req.params.email},
				
				).then(()=>{
                
                    return res.status(200).send({message:"Doctor deleted successfully"});
                }    
            )
    }
    catch(err){
        console.log(err);
        return res.status(430).send({ error: err});
    }
    }
];


async function compare(a,b){
    let c=await bcrypt.hash(b, 8)
    return a=c
}

//function to login as a doctor
exports.LoginDoctor=[
    async (req,res)=>{
        
        try{

            Doctor.find({Email:req.body.email}).then(dr=>{
                
                if(dr.length){
                    let doctor=new DoctorData(dr[0])

                    if(compare(doctor.password,req.body.password)){
                        return res.status(200).send({user:doctor})
                    }
                    else{
                        return res.status(430).send({error:'Please enter correct password'})
                    }
                }
                else{
                    return res.status(420).send({error:"No such doctor exist"})
                }
            })
        }
        catch(err){
            console.log(err)
        }
    }
]

//get schedule
exports.DoctorSchedule = [

	(req, res) => {
  
    try{
         Doctor.findOne({Name:req.params.name , Email:req.params.email}).then(dr=>{
                if(dr){
                       
                    var doctor=new DoctorData(dr)
                    var schedule=doctor.Hospitals
                  
                    return res.status(200).send({schedule:schedule});
                }
                else{
                    return res.status(430).send({ null_data:"No such doctor found"});
                }    
            })

    }
    catch(err){
        console.log(err);
        return res.status(430).send({ error: err});
    }
    }
]

//get schedule for edit
exports.DoctorScheduleEdit = [
	async (req, res) => {
    try{
        await Doctor.findOne({Name:req.params.name , Email:req.params.email}).then(dr=>{
                if(dr){
                       
                    var doctor=new DoctorData(dr)
                    var schedule=doctor.Hospitals
                    
                    
                    
                    return res.status(200).send({schedule:schedule});
                }
                else{
                    return res.status(430).send({ null_data:"No such doctor found"});
                }    
            })
    }
    catch(err){
        console.log(err);
        return res.status(430).send({ error: err});
    }
    }]


exports.DoctorAppointments = async (req, res) => {

    try {
        const { name, email } = req.params;

        const dr = await Doctor.findOne({ Name: name, Email: email });
       
        //const dr = await Doctor.findOne({ Name: 'Dr Zainabb', Email: 'SHAEENkhan90@gmail.com' });
        if (dr) {
            const appointments = await Appointment.find({ doctorId: dr._id }).exec();
          
            return res.status(200).json({ appointment: appointments })
            // Emit the updated order data to connected clients
            io.emit('appointmentUpdate', { appointment: appointments});
        } else {
            return res.status(430).json({ null_data: "No such doctor found" });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err });
    }
};


