const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const jwtManager = require("../../../managers/jwtManager");

const login = async (req,res)=>{
    const usersModel = mongoose.model("users");

    const {email,password} = req.body;

    const getUser = await usersModel.findOne({
        email:email
    });

    const accessToken = jwtManager(getUser);

    if(!getUser) throw "Email doesnot exists";
    
    const comparePassword = await bcrypt.compare(password,getUser.password);
    if(!comparePassword) throw "Password doesn't match";

    res.status(200).json({
        status:"success",
        message :"Login Successfull.",
        accessToken :accessToken,
    });
};


module.exports = login;