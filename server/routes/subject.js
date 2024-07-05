const router = require("express").Router();
const ctrls = require("../controllers/Subject");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/", [verifyAccessToken, isAdmin], ctrls.createSubjectAndSession);
router.put("/:sid", [verifyAccessToken, isAdmin], ctrls.updateSubject);

module.exports = router;
