const nodemailer = require("nodemailer");
const csv = require('csv-parser');
const fs = require('fs');
require('dotenv').config();

let transporter = nodemailer.createTransport({
    // service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});
let getMailDetails=(personName,personEmail)=>{
    let mailDetails = {
        from: 'alumniaffairs.uiet@gmail.com',
        to: personEmail,
        subject: 'Test Mail',
        text:'This is a test mail from Databse/Star office.For testing our mailing script.Kindly Ignore!'
    };
    return mailDetails;
}


let sendMail=(mailDetails)=>{
    transporter.sendMail(mailDetails, (err, data)=>{
        if(err) {
            console.log(mailDetails.to);
            console.log('Error Occurs',err);
        } else {
            console.log('Email sent successfully');
        }
    });
}

let idx=0;
fs.createReadStream('./xyz.csv')
  .pipe(csv())
  .on('data', (row) => {
    setTimeout(() => {
        let mailDetail=getMailDetails(row.Name,row['E-Mail ID']);
        sendMail(mailDetail);
    }, 2000 * idx);
    idx++;
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });