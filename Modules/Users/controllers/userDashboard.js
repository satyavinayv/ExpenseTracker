const mongoose = require("mongoose");

const userDashboard = async(req,res,next)=>{

  const userModel = mongoose.model("users");
  const transactionsModel = mongoose.model("transactions");

  console.log(req.user);
  
  const getUser = await userModel.findOne({
    _id : req.user._id,
  }).select("-password"); //This is for what data not to be displayed and remaining data will be displayed
  // or .select("name balance email") This is for what data to be displayed

  const transactions = await transactionsModel.find({
    user_id : req.user._id,
  }).sort("-createdAt").limit(5);


  res.status(200).json({
        status: "success",
        data : getUser,
        transactions,
      });
};

module.exports = userDashboard;