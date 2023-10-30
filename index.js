const express = require('express');
const {connection} = require('./db');
const cors = require('cors');
const { userRouter } = require('./routes/userRoutes');
const doctorRouter = require('./routes/doctorRoutes');
require('dotenv').config()



const app = express();
app.use(express.json());
app.use(cors());

app.use("/users",userRouter);
app.use("/doctors",doctorRouter);













app.listen(process.env.port,async ()=>{
    try {
        await connection;
        console.log(`server is Runing at port ${process.env.port}`)
        console.log("connect to the DB")
    } catch (error) {
        console.log("something error");
        console.log(error)
    }
})