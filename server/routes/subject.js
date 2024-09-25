const router = require("express").Router();
const ctrls = require("../controllers/subject");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/create", [verifyAccessToken,isAdmin], ctrls.createSubjectAndSession);
router.put("/:sid", [verifyAccessToken, isAdmin], ctrls.updateSubject);
router.get("/", [verifyAccessToken, isAdmin], ctrls.getSubjects);
router.get("/current/:sid", [verifyAccessToken, isAdmin], ctrls.getSubject);
router.delete("/:sid", [verifyAccessToken, isAdmin], ctrls.deleteSubject);
router.put("/:sid/:ssid", [verifyAccessToken, isAdmin], ctrls.updateSubjectAndSession);
router.get("/err/:tid", [verifyAccessToken, isAdmin], ctrls.getSessionsBySubject);
module.exports = router;
