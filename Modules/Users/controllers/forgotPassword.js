const mongoose = require("mongoose");
// const nodemailer = require("nodemailer");
const emailManager  = require("../../../managers/emailManager");


const forgotPassword = async (req,res)=>{

    const userModel = mongoose.model("users");

    const {email} =req.body;

    if(!email) throw "Email must be provided";

    const getUser = await userModel.findOne({
        email : email,
    })

    if(!getUser) throw "Email doesnot Exists."

    const reset_code = Math.floor(10000 + Math.random()*90000);

    await userModel.updateOne({
        email : email
    },{
        reset_code : reset_code
    },{
        runValidators:true,
    });


    await emailManager(email,"Your password reset code : "+reset_code,
        "Reset Your Password - Expense Tracker");

    res.status(200).json({
        status:"Reset Code sent successfully."
    })
}

module.exports = forgotPassword;