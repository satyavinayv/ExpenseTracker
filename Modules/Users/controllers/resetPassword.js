const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const emailManager  = require("../../../managers/emailManager");


const resetPassword = async (req,res)=>{

    const userModel = mongoose.model("users");

    const {email,new_password,reset_code} = req.body;

    if(!email) throw "Email id is required";
    if(!new_password) throw "Please enter new_password"
    if(new_password.length < 5) throw "Password must be atleast 6 character"
    if(!reset_code) throw "Reset code must be provided"

    const getUserWithReset_code = await userModel.findOne({
        email : email,
        reset_code : reset_code,
    });

    if(!getUserWithReset_code) throw "UserCredentiald Doesnot match. Check resetcode and email id."

    const hashedPassword = await bcrypt.hash(new_password,12);

    await userModel.updateOne({
        email : email
    },{
        password: hashedPassword,
        reset_code : "",
    });

    await emailManager(email,"Your password reset successfull",
        "Password Reset Successfull.")

    res.status(200).json({
        status:"Reset Successfull."
    })
}

module.exports = resetPassword;