
const express = require('express')
require('./db/mongoose')
const userRouter = require('./routers/user')
const taskRouter = require('./routers/task')


// const { aggregate } = require('./models/user');

const app = express();
 
const port = process.env.PORT;

app.use(express.json()) //json to object
app.use(userRouter)
app.use(taskRouter)


app.listen(port, () => {
    console.log('Server is up ' + port)
})
























// const Task = require('./models/task')
// const User = require('./models/user');
// const { findById } = require('./models/user');

// const main = async () => {
//     // const task = await Task.findById('61dc15b5ae2e6a10ec8c946d')
//     // await task.populate('owner').execPopulate()
//     // console.log(task.owner)

//     // const user = await User.findById('61dc144436470442acd21cbd')
//     // await user.populate('tasks').execPopulate()
//     // console.log(user.tasks)
// }

// main();


//middleware functions

// app.use((req, res, next) => {
//     if (req.method === 'GET'){
//         res.send('Get disabled')
//     } else {
//         next()
//     }
//     next() //done w middleware
// })


// app.use((req, res, next) => {
    
//     res.status(503).send('maintaining')

// })

