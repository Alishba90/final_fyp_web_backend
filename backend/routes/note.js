var express = require("express");
const NoteController = require("../controllers/NoteController");

var router = express.Router();


router.post("/savenewnote", NoteController.addNotes);
router.post("/updatenote", NoteController.updateNotes);
router.get("/getnotes/:org_name/:org_address", NoteController.allNotes);
router.get("/open/:title/:org_name/:org_address",NoteController.openNote);
router.delete("/del/:title/:org_name/:org_address", NoteController.deleteSelectedNotes);


module.exports = router;