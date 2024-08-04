const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name :{
        type:String,
        required:[true,"Full_Name Required"]
    },
    email:{
        type:String,
        required:[true,"Email ID Required"],
        unique:true,
    },
    password:{
        type:String,
        required:[true,"Password is Required"],
    },
    balance:{
        type:Number,
        required:[true,"Balance is required"],
        default:0,
    },
    reset_code:{
        type:Number,
    },

},{
    timestamps:true
});


const usersModel = mongoose.model('users',userSchema);

module.exports = usersModel;