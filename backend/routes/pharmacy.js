var express = require("express");
const PharmacyController = require("../controllers/PharmacyController.js");
const MedicineController = require("../controllers/MedicineController.js");

var router = express.Router();

router.get("/detail/:name/:address", PharmacyController.PharmacyDetail);
router.get("/stats/:name/:address", PharmacyController.PharmacyStats);
router.post("/add", PharmacyController.AddPharmacy);
router.post("/update", PharmacyController.UpdatePharmacy);
router.get("/branch/:name", PharmacyController.PharmacyBranches);
router.post("/login", PharmacyController.LoginPharmacy);
router.delete("/del/:name/:address", PharmacyController.DeletePharmacy);

router.get("/detailmed/:org_name/:org_address", MedicineController.allMedicines);
router.get("/lowmeds/:org_name/:org_address", MedicineController.LowMedicines);
router.post("/addmed", MedicineController.addMedicine);
router.post("/updatemed", MedicineController.updateMedicines);
router.delete("/delmed/:name/:address/:fields", MedicineController.deleteSelectedMedicines);


module.exports = router;