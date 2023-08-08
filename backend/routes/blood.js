var express = require("express");
const BloodController = require("../controllers/BloodController.js");

var router = express.Router();

router.post("/add", BloodController.AddBloodBank);
router.get("/detail/:name/:address", BloodController.BloodBankDetail);
router.post("/update", BloodController.UpdateBloodBank);
router.post("/login", BloodController.LoginBloodBank);
router.get("/branch/:name", BloodController.BloodBankBranches);
router.delete("/del/:name/:address", BloodController.DeleteBloodBank);
router.get("/stats/:name/:address", BloodController.BloodBankStats);

router.get("/getblood/:org_name/:org_address", BloodController.AllBloodGroups);
router.post("/updatebloodgroup", BloodController.updateBloodGroup);
router.post("/addbloodgroup", BloodController.AddBloodGroup);
router.delete("/delblood/:name/:address/:fields", BloodController.deleteSelectedBlood);

module.exports = router;