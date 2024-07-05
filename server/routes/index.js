const { notFound, errHandler } = require('../middlewares/errHandler')
const userRouter = require('./user')
const subjectRouter = require('./subject')
const initRoutes = (app) => {
    app.use('/api/user', userRouter)
    app.use('/api/subject',subjectRouter)

    app.use(notFound)
    app.use(errHandler)
}
module.exports = initRoutes