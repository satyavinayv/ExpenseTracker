const mongoose = require("mongoose");
const validator = require("validator");

const editTransaction =async (req,res)=>{

    const transactionsModel =  mongoose.model("transactions");
    const userModel = mongoose.model("users");

    const {transaction_id, remarks, amount, transaction_type} = req.body;

    if(!transaction_id) throw "Transaction Id required";
    
    if(transaction_type!=="income" && transaction_type!=="expense") throw "Transaction_type must be income or expense";

    if(!validator.isMongoId(transaction_id.toString())) throw "Please enter valid Id."

    const getTransaction = await transactionsModel.findOne({
        _id : transaction_id
    });

    if(!getTransaction) throw "Transaction not found."

    await transactionsModel.updateOne({
        _id:transaction_id,
    },{
        remarks,
        transaction_type,
        amount,
    },{
        runValidators:true,
    });

    const originalAmount = getTransaction.amount;
    const originalType = getTransaction.transaction_type;

    let balanceUpdate;

    if (originalType === "income") {
        // Original transaction was income, subtract the original amount
        balanceUpdate = -originalAmount;
    } else {
        // Original transaction was expense, add the original amount
        balanceUpdate = originalAmount;
    }

    if (transaction_type === "income") {
        // New transaction is income, add the new amount
        balanceUpdate += amount;
    } else {
        // New transaction is expense, subtract the new amount
        balanceUpdate -= amount;
    }

    await userModel.updateOne({
        _id: getTransaction.user_id,
    }, {
        $inc: {
            balance: balanceUpdate,
        }
    }, {
        runValidators: true
    });

    res.status(200).json({
        status :"Transaction Edited Successfully."
    })
}

module.exports = editTransaction;