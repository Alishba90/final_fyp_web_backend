const Doctor=require('../models/DoctorModel')
const apiResponse = require("../helpers/apiResponse");
const Note=require('../models/NoteModel');
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
    console.log('this is recieve',req.body)
    try{
        await Doctor.findOne({Name:req.params.name , Email:req.params.email}).then(dr=>{
                if(dr){
                        
                    var doctor=new DoctorData(dr[0])

                    return res.status(200).send({org:doctor});
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

//Update doctor
exports.UpdateDoctor = [

	(req, res) => {
    console.log('this is recieve',req.body)
    try{
		var doctor=new Doctor({
                Name:req.body.doctorinfo.name,
                Education:req.body.doctorinfo.education,
                Speciality:req.body.doctorinfo.speciality,
                Experience:req.body.doctorinfo.experience,
                Email:req.body.doctorinfo.email,
                Phone:req.body.doctorinfo.phone,
                password:req.body.doctorinfo.password,
            })
        Doctor.findOneAndUpdate(
				{Name:req.body.old_name , Email:req.body.old_email},
				doctor
				).then(()=>{
                if(req.body.doctorinfo.name!=req.body.old_name||req.body.email!=req.body.old_email){
                    Note.updateMany({org_name:req.body.old_name,org_address:req.body.old_email},
                    {org_name:req.body.doctorinfo.name,org_address:req.body.doctorinfo.address})
                }
                console.log('i am here')
                    var doc=Doctor.find({Name:req.body.doctorinfo.name,Email:req.body.doctorinfo.email})

console.log('the doctor updated and send',doc)
                    return res.status(200).send({doctor:doc});
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

	async (req, res) => {
    console.log('this is recieve',req.params)
    try{
        await Doctor.findOne({Name:req.params.name , Email:req.params.email}).then(dr=>{
                if(dr){
                       
                    var doctor=new DoctorData(dr)
                    var schedule=doctor.Hospitals
                    if(schedule.length){
                        // Initialize an empty array to store the new formatted data
                        var formattedSchedule = [];
                        const findDay = (day) => {
                            return formattedSchedule.find(entry => entry.day === day);
                        };

                        // Iterate through each entry in the 'availability' array
                        schedule.forEach(entry => {
                            entry.availability.forEach(availabilityEntry => {
                                // Find or create a day entry in the formattedSchedule array
                                let dayEntry = findDay(availabilityEntry.day);
                                if (!dayEntry) {
                                    dayEntry = { day: availabilityEntry.day, availability: [] };
                                    formattedSchedule.push(dayEntry);
                                }


                                // Push the availability information into the day entry
                                dayEntry.availability.push({
                                    name: entry.name,
                                    time: availabilityEntry.time
                                });
                            });
                        });

                    }
                    else{
                        var formattedSchedule = [{day:'',availability:[{name:'',time:[]}]}];
                    }
                    
                    return res.status(200).send({schedule:formattedSchedule});
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
];

exports.DoctorAppointments = async (req, res) => {
    console.log('this is receive app', req.params);
    try {
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
