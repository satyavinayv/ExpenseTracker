require("express-async-errors");

const express = require("express");
const cors = require("cors");

const errorHandler = require("./Handlers/errorHandler");
const mongoose = require("mongoose");
const userRoutes = require("./Modules/Users/users.routes");
const transactionsRoutes = require("./Modules/Transactions/transactions.routes");

require("dotenv").config();

const app=express();
app.use(cors());

mongoose.connect(process.env.mongo_connection,{}).then(()=>{
    console.log("Mongo Connection Successful.");
}).catch(()=>{
    console.log("Mongo Connection failed.");
});


// Models Initialization

require("./models/users.model")
require("./models/transactions.model")

app.use(express.json());

// Routes

app.use("/api/Users",userRoutes);
app.use("/api/transactions",transactionsRoutes);


// After writing all routes add errorHandler
app.all("*",(req,res,next)=>{
    res.status(404).json({
        status:"Failed",
        message:"Not Found",
    })
})
app.use(errorHandler);

app.listen(8000,()=>{
    console.log("Server Started Successfully");
});