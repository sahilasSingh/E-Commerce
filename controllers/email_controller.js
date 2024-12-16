const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');

const sendEmail = asyncHandler(async(data,req,res)=>{
    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        service: 'gmail',
        secure: true,
        auth: {
          user: process.env.MAIL_ID,
          pass: process.env.MP,
        },
      });
    
      const mailOptions = {
        from: process.env.MAIL_ID,
        to: data.to,
        subject: data.subject,
        text: data.text,
        html:data.htm,
      };
     await transporter.sendMail(mailOptions);
});

module.exports = sendEmail;