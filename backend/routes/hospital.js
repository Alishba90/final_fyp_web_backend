var express = require("express");
const HospitalController = require("../controllers/HospitalController.js");


var router = express.Router();
router.post("/add", HospitalController.AddHospital);
router.get("/detail/:name/:address", HospitalController.HospitalDetail);
router.delete("/del/:name/:address", HospitalController.DeleteHospital);
router.post("/update", HospitalController.UpdateHospital);
router.post("/login", HospitalController.LoginHospital);
router.get("/branch/:name", HospitalController.HospitalBranches);

router.get("/getdoctors/:org_name/:org_address", HospitalController.HospitalDoctors);
router.post("/adddoc", HospitalController.addDoctor);
router.post("/updatedoc", HospitalController.UpdateDoctors);
router.post("/deldoc", HospitalController.DeleteDoctors);

router.get("/getdeptdetail/:org_name/:org_address", HospitalController.GetDepartments);
router.get("/getdeptdetail/:org_name/:org_address/:department", HospitalController.departmentDoctors);
router.post("/logindep", HospitalController.LoginDepartment);
router.post("/adddep", HospitalController.AddDepartment);
router.post("/updatedep", HospitalController.updateDepartment);
router.delete("/deldep/:org_name/:org_address/:name", HospitalController.deleteDepartment);

router.get("/getforms/:org_name/:org_address", HospitalController.GetNCRforms);
router.post("/storeforms", HospitalController.saveNCRforms);
router.post("/resolveform", HospitalController.resolveNCRforms);

module.exports = router;