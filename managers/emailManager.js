const nodemailer = require("nodemailer");

const emailManager = async (to,text,subject)=>{
    var transport = nodemailer.createTransport({
        host: "sandbox.smtp.mailtrap.io",
        port: 2525,
        auth: {
          user: "24c96a7476733a",
          pass: "4de49fe7cff1aa"
        }
      });

      await transport.sendMail({
        to:to,
        from:"info@expensetracker.com",
        text:text,
        subject:subject
      })
}

module.exports =  emailManager;