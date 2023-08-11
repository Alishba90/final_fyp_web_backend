const Hospital = require("../models/HospitalModel");
const apiResponse = require("../helpers/apiResponse");
const HospitalDepartment=require("../models/DepartmentModel");
const bcrypt = require('bcrypt');
const Note= require('../models/NoteModel');
const Form=require('../models/NCRformsModel');

// Hospital Schema
function HospitalData(data) {
    
    this.name =data.name;
	this.address =data.address;
	this.email=data.email;
	this.password =data.password;
	this.phone=data.phone;
	this.time=data.time;
	this.Hospitaldr=data.Hospitaldr;
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

//To get Hospital details
exports.HospitalDetail = [

	async (req, res) => {
    console.log('this is recieve',req.body)
    try{
        await Hospital.findOne({name:req.params.name , address:req.params.address}).then(hos=>{
                if(hos){
                        
                    var hospital=new HospitalData(hos[0])

                    return res.status(200).send({org:hospital});
                }
                else{
                    return res.status(430).send({ null_data:"No such hospital found"});
                }    
            })
    }
    catch(err){
        console.log(err);
        return res.status(430).send({ error: err});
    }
    }
];

//Add a new hospital 
exports.AddHospital = [

	(req, res) => {
    console.log('this is recieve',req.body)
    try{
        Hospital.findOne({name:req.body.name , address:req.body.address}).then(hos=>{
                if(hos){
                    return res.status(430).send({error:"This Hospital already exist"});
                }
                else{
                    var hospital=new Hospital({
                            name:req.body.name,
	                        address:req.body.address,
	                        email:req.body.email,
	                        password:req.body.password,
	                        phone:req.body.phone,
	                        time:settime(req.body.time.open,req.body.time.close)
	
                })
					hospital.save()
                    return res.status(200).send({message:"Hospital added successfully"});
                }    
            })
    }
    catch(err){
        console.log(err);
        return res.status(430).send({ error: err});
    }
    }
];

//Update hospital 
exports.UpdateHospital = [

	(req, res) => {
    console.log('this is recieve',req.body)
    try{
		var hospital=new Hospital({
                            name:req.body.name,
	                        address:req.body.address,
	                        email:req.body.email,
	                        password:req.body.password,
	                        phone:req.body.phone,
	                        time:settime(req.body.time.open,req.body.time.close)
	
        })
        Hospital.findOneAndUpdate(
				{name:req.body.old_name , address:req.body.old_address},
				hospital
				).then(()=>{
                
                if(req.body.hospitalinfo.name!=req.body.old_name||req.body.hospitalinfo.address!=req.body.old_address){
                    Note.updateMany({org_name:req.body.old_name,org_address:req.body.old_address},
                    {org_name:req.body.hospitalinfo.name,org_address:req.body.hospitalinfo.address})

                    HospitalDepartment.updateMany({org_name:req.body.old_name,org_address:req.body.old_address},
                    {org_name:req.body.hospitalinfo.name,org_address:req.body.hospitalinfo.address})

                }

                    console.log('i am here')
                    var h=Hospital.find({Name:req.body.hospitalinfo.name,Email:req.body.hospitalinfo.email})

                    console.log('the hospital updated and send',h)
                    return res.status(200).send({hospital:h});
                }    
            )
    }
    catch(err){
        console.log(err);
        return res.status(430).send({ error: err});
    }
    }
];

//Delete hospital
exports.DeleteHospital = [

	(req, res) => {
    console.log('this is recieve',req.body)
    try{
		
        Hospital.deleteOne(
				{name:req.params.name , address:req.params.address},
				
				).then(()=>{
                
                    return res.status(200).send({message:"Hospital deleted successfully"});
                }    
            )
    }
    catch(err){
        console.log(err);
        return res.status(430).send({ error: err});
    }
    }
];

//function to display all Hospital branches
exports.HospitalBranches = [
	
	async (req, res) => {
    console.log('this is recieve',req.body)
    try{
        Hospital.find({name:req.params.name}).then(hb=>{
            if(hb){
                let branches_name=[]
                for (var b=0;b<hb.length;b++){
                    var branch=new HospitalData(hb[b])
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

//function to login to a hospital
exports.LoginHospital=[
    async (req,res)=>{
        console.log('this is recieved ',req.body)
        try{
            Hospital.find({name:req.body.name,address:req.body.branch}).then(hos=>{
                if(hos){
                    console.log(hos)
                    let hospital=new HospitalData(hos[0])

                    if(compare(hospital.password,req.body.password)){
                        return res.status(200).send({user:hospital})
                    }
                    else{
                        return res.status(430).send({error:'Please enter correct password'})
                    }
                }
                else{
                    return res.status(420).send({error:"No such hospital exist"})
                }
            })
        }
        catch(err){
            console.log(err)
        }
    }
]

//function to get all the doctors of the hospital
exports.HospitalDoctors=[
    async (req,res)=>{
        console.log('this is recieved ',req.params)
        try{
            await Hospital.findOne({name:req.params.org_name , address:req.params.org_address}).then(hos=>{

                    if(hos){
                            
                        var doctors=hos.Hospitaldr;

                        return res.status(200).send({ doctors:doctors});
                    }
                    else{

                        return res.status(430).send({ error:"No such hospital found"});
                    }    
                })
        }
        catch(err){
            console.log(err)
        }
    }

]

//function to add doctors 
exports.addDoctor = [
    async (req, res) => {
    console.log('this is receive', req.body);

    try {
        const hospital = await Hospital.findOne({
        name: req.body.org_name,
        address: req.body.org_address
        });

        if (hospital) {
        const docList = req.body.doc_list;

        for (let i = 0; i < docList.length; i++) {
            const doc = docList[i];

            hospital.Hospitaldr.push({
                Name: doc.name,
                email:doc.email,
                Education:doc.education,
                Speciality:doc.speciality,
                Experience:doc.experience,
                Department:doc.department,
                availability:doc.availability,
                fee:doc.fee
            });
        
        }

        await hospital.save();

        console.log("Doctors added successfully");
        return res.status(200).send({ message: "Doctors added successfully" });
        } else {
        return res.status(430).send({ error: "No such hospital exists" });
        }
    } catch (err) {
        console.log("db error", err);
        return res.status(422).send({ error: err });
    }
    }
]

//function to delete doctors
exports.DeleteDoctors=[

  async (req, res) => {
    console.log('hi')
    console.log('this is received', req.body);

    try {
      const { name, address, doc_list } = req.body;

      
    
      const hospital = await Hospital.findOne({ name, address });

      if (hospital) {
        doc_list.forEach((deletedDoctor) => {
          hospital.Hospitaldr = hospital.Hospitaldr.filter(
            (doctor) => doctor.Name !== deletedDoctor.name && doctor.Department!==deletedDoctor.department
          );
        });

        await hospital.save();

        console.log("Doctors deleted successfully");
        return res.status(200).send({ message: "Doctors deleted successfully" });
      } else {
        return res.status(422).send({ error: "No such hospital exists" });
      }
    } catch (err) {
      console.log(err);
      return res.status(430).send({ error: err });
    }
  }
]

//function to update doctors
exports.UpdateDoctors=[
  async (req, res) => {
    console.log('this is received', req.body);

    try {
        const { name, address, doc_list } = req.body;
        const hospital=await Hospital.findOne({
            name: name, address 
        })  
      
      if (hospital) {

        const Doctorstoupdate =hospital.Hospitaldr.find(m=>m.Name ===doc_list[0].oldname,m.Department===doc_list[0].olddep )

        if(Doctorstoupdate){
            Medicinestoupdate.Name=doc_list[0].name;
            Medicinestoupdate.email=doc_list[0].email;
            Medicinestoupdate.Education=doc_list[0].education;
            Medicinestoupdate.Speciality=doc_list[0].speciality;
            Medicinestoupdate.Experience=doc_list[0].experience;
            Medicinestoupdate.Department=doc_list[0].department;
            Medicinestoupdate.availability=doc_list[0].availability;
            Medicinestoupdate.fee=doc_list[0].fee;

            await hospital.save();
            console.log("Doctor updated successfully");
            return res.status(200).send({ message: "Doctor updated successfully" });
        }


      } else {
        return res.status(422).send({ error: "No such doctor exists" });
      }
    } catch (err) {
      console.log(err);
      return res.status(430).send({ error: err });
    }
  }
]

//function to get departments
exports.GetDepartments=[
  async (req, res) => {
    console.log('this is received', req.body);

    try {
        HospitalDepartment.find({org_name:req.params.org_name,org_address:req.params.org_address}).then(dep=>{
            if(dep.length){
                var department=dep;
                return res.status(200).send({department:department})
            }
            else{
                return res.status(430).send({ error:"No such department found"});
            }
        }
        )
      } 
    catch (err) {
      console.log(err);
      return res.status(430).send({ error: err });
    }
  }
]

//function to add departments
exports.AddDepartment=[
	 (req, res) => {
    console.log('this is recieve',req.body)
    try{
        HospitalDepartment.findOne({org_name:req.body.org_name,org_address:req.body.org_address,name:req.body.depinfo.name}).then((dept) => {
        if(dept){
            console.log("A department already exist with this name");
            return res.status(430).send({ error: "A department already exist with this name." });
        }else{
            let dep=new HospitalDepartment({
                org_name:req.body.org_name,
                org_address:req.body.org_address,
                name:req.body.depinfo.name,
                admin_name:req.body.depinfo.admin_name,
                phone:req.body.depinfo.phone,   
                password:req.body.depinfo.password
        })
            try{
            dep.save();
            console.log("Department created successfully")
            return res.status(200).send({ message: "Department created successfully" });}
            catch(e){
                console.log("Problem creating Department ",e)
            }
        }
    })
    }
    catch(err){
        console.log(err);
        return res.status(430).send({ error: err});
    }
    }
]



// function to login into a department
exports.LoginDepartment = [
  async (req, res) => {
    console.log('this is received ', req.body);
    try {
      HospitalDepartment.find({ org_name: req.body.org_name, org_address: req.body.org_address, name: req.body.name })
        .then(async (dept) => {
          if (dept.length > 0) { // Check if any department was found
            console.log(dept);
            let department = dept[0];

            // Compare the provided password with the hashed password in the database
            const isPasswordMatch = await bcrypt.compare(req.body.password, department.password);

            if (isPasswordMatch) {

              return res.status(200).send({ user: department });
            } else {
              return res.status(430).send({ error: 'Please enter correct password' });
            }
          } else {
            return res.status(420).send({ error: "No such department exists" });
          }
        });
    } catch (err) {
      console.log(err);
      return res.status(500).send({ error: err });
    }
  }
];


//function to delete department

exports.deleteDepartment = [
  async (req, res) => {
    console.log('this is receive', req.body);
    try {
      const hospital = await Hospital.findOne({
        name: req.body.org_name,
        address: req.body.org_address,
      });

      if (!hospital) {
        return res.status(404).send({ message: "Hospital not found" });
      }
        var msg="Problem deleting department"
        HospitalDepartment.findOne({
        org_name: req.body.org_name,
        org_address: req.body.org_address,
        name: req.body.dep_name
        }).then(async (d) => {
        if (d) {
            const isPasswordMatch = await bcrypt.compare(req.body.password, d.password);
            if (isPasswordMatch) {
            console.log('Password matches'); // Password is correct, you can delete now
            await HospitalDepartment.deleteOne({
                org_name: req.body.org_name,
                org_address: req.body.org_address,
                name: req.body.dep_name,
            });
            
            }msg="Hospital department deleted successfully"
        }})


      await hospital.save();

      return res.status(200).send({ message: msg });
    } catch (err) {
      console.log(err);
      return res.status(500).send({ error: err });
    }
  }
];

//function to update department
exports.updateDepartment=[
	async(req, res) => {
    console.log('this is recieve',req.body)
    try{
		var department=new HospitalDepartment({
                            org_name:req.body.org_name,
	                        org_address:req.body.org_address,
	                        name:req.body.depinfo.name,
                            admin_name:req.body.depinfo.admin_name,
	                        password:(req.body.depinfo.changepw!=0)?req.body.depinfo.password:HospitalDepartment.findOne(
                                {org_name:req.body.org_name , org_address:req.body.org_address,name:req.body.old_name}
                                ).password,
	                        phone:req.body.depinfo.phone,
	
        })
        HospitalDepartment.findOneAndUpdate(
				{org_name:req.body.org_name , org_address:req.body.org_address,name:req.body.old_name},
				department
				).then(()=>{
                    const H = Hospital.findOne({name:org_name,address:org_address}).then(()=>{
                        if(H){
                        const docs=H.Hospitaldr
                            if(docs){
                                for(var i=0;i<docs.length;i++){
                                    if(docs[i].Department===req.body.old_name){
                                        docs[i].Department=req.body.depinfo.name;
                                    }
                                }
                            }
                        H.save()
                        return res.status(200).send({department:department});
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
]

//function to get department doctors
exports.departmentDoctors=[
    async (req,res)=>{
        console.log('this is recieved ',req.params)
        try{
            await Hospital.findOne({name:req.params.org_name , address:req.params.org_address}).then(hos=>{

                    if(hos){
                            
                        var doctors=hos.Hospitaldr.find({Department:req.params.department});

                        return res.status(200).send({ doctors:doctors});
                    }
                    else{

                        return res.status(430).send({ error:"No such department found"});
                    }    
                })
        }
        catch(err){
            console.log(err)
        }
    }
]

//function to retrieve all NCR forms
exports.GetNCRforms=[
  async (req, res) => {
    console.log('this is received for form', req.params);

    try {
        Form.find({org_name:req.params.org_name,org_address:req.params.org_address}).then(f=>{
            if(f.length){
                var forms=f;
            
                return res.status(200).send({forms:forms})
            }
            else{
                return res.status(430).send({ error:"No such forms found"});
            }
        }
        )
      } 
    catch (err) {
      console.log(err);
      return res.status(430).send({ error: err });
    }
  }
]

//function to store NCR forms
exports.saveNCRforms=[
	 (req, res) => {
    console.log('this is recieve',req.body)
    try{
        Form.findOne({org_name:req.body.org_name,org_address:req.body.org_address,form_no:req.body.form_no}).then((f) => {
        if(f){
            console.log("A form already exist with this number");
            return res.status(430).send({ error: "A form already exist with this number." });
        }else{
            let form=new Form({
                org_name:req.body.org_name,
                org_address:req.body.org_address,
                form_type:req.body.depinfo.form_type,
                form_date:req.body.depinfo.form_date,
                form_department:req.body.depinfo.form_department,
                form_description:req.body.depinfo.form_description,
                form_no:req.body.depinfo.form_no,   
                form_title:req.body.depinfo.form_title,
                entree_name:req.body.depinfo.entree_name,
                resolution_description:req.body.depinfo.resolution_description,
                resolver_name:req.body.depinfo.resolver_name,
                resolution_date:req.body.depinfo.resolution_date

        })
            try{
            form.save();
            console.log("Form created successfully")
            return res.status(200).send({ message: "Form created successfully" });}
            catch(e){
                console.log("Problem creating Form",e)
            }
        }
    })
    }
    catch(err){
        console.log(err);
        return res.status(430).send({ error: err});
    }
    }
]

//function to update NCR forms for resolution
exports.resolveNCRforms=[
	 (req, res) => {
    console.log('this is recieve',req.body)
    try{
        Form.findOne({org_name:req.body.org_name,org_address:req.body.org_address,form_no:req.body.form_no}).then((f) => {
        if(f){
            f.resolution_date=req.body.resolution_date
            f.resolver_name=req.body.resolver_name
            f.resolution_description=req.body.resolution_description
            f.save();
            console.log("Form updated successfully")
            return res.status(200).send({ message: "Form updated successfully" })

        }else{
            console.log("No form exist with this number");
            return res.status(430).send({ error: "No form exist with this number." });
        }
    })
    }
    catch(err){
        console.log(err);
        return res.status(430).send({ error: err});
    }
    }
]