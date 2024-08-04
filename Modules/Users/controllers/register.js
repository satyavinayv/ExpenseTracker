const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwtManager = require("../../../managers/jwtManager");
const emailManager  = require("../../../managers/emailManager");
// const nodemailer = require("nodemailer");
// const jsonwebtoken = require("jsonwebtoken");

const register = async(req,res)=>{

    const usersModel = mongoose.model('users');

    const {
        email,password,confirm_password,name,balance
    }=req.body;

    if(!name) throw "Name is required";
    if(!email) throw "Email is required";
    if(password.length<=5) throw "Password must be atleast 6 Characters";
    if(password !== confirm_password) throw "Password must match with Confirm_Password";
    if(!balance) throw "Balance must be provided";

    const getDuplicatemailId = await usersModel.findOne({
        email :email,
    })

    if(getDuplicatemailId) throw "Email already exists.";

    // Hasging Password for user safety
    const hashedPassword = await bcrypt.hash(password,12);
    
    const createdUser = await usersModel.create({
        name:name,
        email:email,
        password:hashedPassword,
        balance:balance
    })

    const accessToken = jwtManager(createdUser);

    await emailManager(createdUser.email,"Welcome to Expense Tracker. We hope you will be confortable using our Platform to make your expenses organize easily.",
        "Welcome to Expense Tracker."
    );
    
    res.status(201).json({
        status:"User Registration Successfull.",
        accessToken:accessToken,
    })
}





module.exports = register;