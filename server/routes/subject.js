const router = require('express').Router()
const ctrls = require('../controllers/subject')
const { verifyAccessToken, isAdmin } = require('../middlewares/verifyToken')

router.post ('/' ,[verifyAccessToken, isAdmin ],ctrls.createSubjectAndSession) 



module.exports = router