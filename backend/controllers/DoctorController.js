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
    console.log('this is recieveeddddddd',req.body)
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
    console.log('this is recieve',req.body)
    try{
        Doctor.findOne({Name:req.body.name , Email:req.body.email}).then(dr=>{
                if(dr){
                    return res.status(430).send({error:"This Doctor already exist"});
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
                    return res.status(200).send({message:"Doctor registered successfully"});
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
      console.log('Received update request:', req.body);
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
  
        console.log('Updating doctor with:', updateFields);
  
        Doctor.findOneAndUpdate(
				{Name:req.body.old_name , Email:req.body.old_email},
				doctor
				).then(()=>{

                
                    var doc=Doctor.find({Name:req.body.doctorinfo.name,Email:req.body.doctorinfo.email})

                    console.log('the doctor updated and send',doc)
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
    console.log('this is recieve',req.body)
    try{
        
        Doctor.findOneAndUpdate(
				{Name:req.body.name , Email:req.body.email},
				{Hospitals:req.body.schedule}
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
    console.log('this is recieve',req.body)
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
        console.log('this is recieved ',req.body)
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
    console.log('this is recieve',req.params)
    try{
         Doctor.findOne({Name:req.params.name , Email:req.params.email}).then(dr=>{
                if(dr){
                       
                    var doctor=new DoctorData(dr)
                    var schedule=doctor.Hospitals
                    console.log(schedule)
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
    console.log('this is recieved',req.params)
    console.log('this is recieved',req.params)
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
    console.log('this is receive app', req.params);
    try {
        const { name, email } = req.params;

        // const doctor = await Doctor.findOne({ Name: name, Email: email });
        // /const dr = await Doctor.findOne({ Name: req.params.name, Email: req.params.email });/
        const dr = await Doctor.findOne({ Name: 'Dr Zainabb', Email: 'SHAEENkhan90@gmail.com' });
        if (dr) {
            const appointments = await Appointment.find({ doctorId: dr._id }).exec();
            console.log(appointments);
            return res.status(200).json({ appointment: appointments });
        } else {
            return res.status(430).json({ null_data: "No such doctor found" });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err });
    }
};

exports.DoctorChart=[
    (req, res) => {
     
        try {
        }
        catch(err){
            console.log(err)
            return res.status(430).json({ error: err });
        }
    }
]
exports.DoctorChart=[
    (req, res) => {
     
        try {
        }
        catch(err){
            console.log(err)
            return res.status(430).json({ error: err });
        }
    }
]