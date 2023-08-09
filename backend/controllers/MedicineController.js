
const apiResponse = require("../helpers/apiResponse");
const Pharmacy = require("../models/PharmacyModel");

//function to add medicines in the inventory and if exist upate their quantity to add the new stock

exports.addMedicine = [

  async (req, res) => {
    console.log('this is receive', req.body);

    try {
      const pharmacy = await Pharmacy.findOne({
        pharmacyname: req.body.pharmacyname,
        address: req.body.address
      });

      if (pharmacy) {
        const medList = req.body.med_list;

        for (let i = 0; i < medList.length; i++) {
          const med = medList[i];

          const existingMedicine = pharmacy.medicine.find(m => m.name === med.name);

          if (existingMedicine) {
            existingMedicine.price = med.price;
            existingMedicine.quantity =parseInt(existingMedicine.quantity)+ parseInt(med.quantity);
            if(!existingMedicine.category.toLowerCase().includes(med.category.toLowerCase())){
              existingMedicine.category=existingMedicine.category+','+med.category;
            }
          } else {
            pharmacy.medicine.push({
              name: med.name,
              price: med.price,
              quantity: med.quantity,
              category: med.category
            });
          }
        }

        await pharmacy.save();

        console.log("Medicines added successfully");
        return res.status(200).send({ message: "Medicines added successfully" });
      } else {
        return res.status(430).send({ error: "No such pharmacy exists" });
      }
    } catch (err) {
      console.log("db error", err);
      return res.status(422).send({ error: err });
    }
  }
]

//function to delete selected medicines
exports.deleteSelectedMedicines = [
  async (req, res) => {
    console.log('this is received', req.params);

    try {
      const { name, address, fields } = req.params;

      const deletedMedicines = fields.split(',');

      const pharmacy = await Pharmacy.findOne({ pharmacyname: name, address });

      if (pharmacy) {
        deletedMedicines.forEach((deletedMedicine) => {
          console.log('med is ',)
          pharmacy.medicine = pharmacy.medicine.filter(
            (medicine) => medicine.name !== deletedMedicine
          );
        console.log('pharmacy.medicine after filtering:', pharmacy.medicine);
        });

        await pharmacy.save();

        console.log("Medicines deleted successfully");
        return res.status(200).send({ message: "Medicines deleted successfully" });
      } else {
        return res.status(422).send({ error: "No such pharmacy exists" });
      }
    } catch (err) {
      console.log(err);
      return res.status(430).send({ error: err });
    }
  }
];

//function to display all Medicines
exports.allMedicines = [
	
	async (req, res) => {
    
    try{
        await Pharmacy.findOne({pharmacyname:req.params.org_name , address:req.params.org_address}).then(pharma=>{

                if(pharma){
                    
                    var medicines=pharma.medicine
                    
                    return res.status(200).send({ medicines:medicines});
                }
                else{

                    return res.status(430).send({ error:"No such pharmacy found"});
                }    
            })
    }
    catch(err){
        console.log(err);
        return res.status(430).send({ error: err});
    }
    }
]

exports.LowMedicines = [
  async (req, res) => {
    console.log('this is received', req.params);
    try {
      const pharmacy = await Pharmacy.findOne({ pharmacyname: req.params.org_name, address: req.params.org_address });
      if (pharmacy) {
        const lowMedicines = pharmacy.medicine.filter(medicine => medicine.quantity <= 5);
        return res.status(200).send({ medicines: lowMedicines });
      } else {
        return res.status(430).send({ error: "No such pharmacy found" });
      }
    } catch (err) {
      console.log(err);
      return res.status(430).send({ error: err });
    }
  }
];

exports.updateMedicines = [
  async (req, res) => {
    console.log('this is received', req.body);

    try {
        const { name, address, med_list } = req.body;
        const pharmacy=await Pharmacy.findOne({
            pharmacyname: name, address 
        })  
      
      if (pharmacy) {

        const Medicinestoupdate =pharmacy.medicine.find(m=>m.name ===med_list[0].oldname )

        if(Medicinestoupdate){
            Medicinestoupdate.name=med_list[0].name;
            Medicinestoupdate.price=parseInt(med_list[0].price);
            Medicinestoupdate.category=med_list[0].category;

            await pharmacy.save();
            console.log("Medicines updated successfully");
            return res.status(200).send({ message: "Medicines updated successfully" });
        }


      } else {
        return res.status(422).send({ error: "No such pharmacy exists" });
      }
    } catch (err) {
      console.log(err);
      return res.status(430).send({ error: err });
    }
  }
];



