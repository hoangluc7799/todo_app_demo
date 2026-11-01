
const siteRouter = require('./site')
const userRouter = require('./user');
const taskRouter = require('./task')
const adminRouter = require('./admin')

// chuyển route vào 
function route(app){

    app.use('/', siteRouter);
    app.use('/user', userRouter);
    app.use('/task', taskRouter);
    app.use('/admin', adminRouter);
}


module.exports = route