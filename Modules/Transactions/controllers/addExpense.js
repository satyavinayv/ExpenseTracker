const mongoose = require("mongoose");
const validator = require("validator");

const addExpense = async (req,res)=>{

    const usersModel = mongoose.model("users");
    const transactionsModel = mongoose.model("transactions");

    const {amount, remarks} = req.body;

    if(!amount) throw "Amount is required";
    if(amount <= 0) throw "Amount must be greater than Zero";
    if(!remarks) throw "Remarks required";
    if (remarks.length < 5) throw "Remarks must be at least 5 characters long!";
    
    if(!validator.isNumeric(amount.toString())) throw "Amount must be Numberic";

    await transactionsModel.create({
        user_id : req.user._id,
        amount : amount,
        remarks:remarks,
        transaction_type:"expense"
    });

    await usersModel.updateOne(
        {
          _id: req.user._id,
        },
        {
          $inc: {
            balance: amount * -1,
          },
        },
        {
          runValidators: true,
        }
      );
    
    res.status(200).json({
        status:"success",
        message:"Expense added successfully",
    })
}

module.exports = addExpense;