const router = require("express").Router();
const ctrls = require("../controllers/session");
const { verifyAccessToken, isAdmin } = require("../middlewares/verifyToken");

router.post("/", [verifyAccessToken, isAdmin], ctrls.createSession);
router.get("/", [verifyAccessToken, isAdmin], ctrls.getSessions);
router.put("/:sid", [verifyAccessToken, isAdmin], ctrls.updateSession);
router.get("/:ssid", [verifyAccessToken, isAdmin], ctrls.getSession);
router.delete("/:sid/:ssid", [verifyAccessToken, isAdmin], ctrls.deleteSession);
router.post("/:sid", [verifyAccessToken, isAdmin], ctrls.importExcelToSessionUsers);
router.put("/",[verifyAccessToken, isAdmin],ctrls.updateUserSession)
module.exports = router;
