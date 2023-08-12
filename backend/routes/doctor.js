var express = require("express");
const DoctorController = require("../controllers/DoctorController.js");


var router = express.Router();
router.post("/add", DoctorController.AddDoctor);
router.get("/detail/:name/:email", DoctorController.DoctorDetail);
router.get("/getschedule/:name/:email", DoctorController.DoctorSchedule);
router.get("/getscheduleedit/:name/:email", DoctorController.DoctorScheduleEdit);
router.get("/getappointments/:name/:email", DoctorController.DoctorAppointments);
router.post("/update", DoctorController.UpdateDoctor);
router.post("/updateschedule", DoctorController.UpdateDoctorSchedule);
router.post("/login", DoctorController.LoginDoctor);
router.delete("/del/:name/:address", DoctorController.DeleteDoctor);


module.exports = router;