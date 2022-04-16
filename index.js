const nodemailer = require("nodemailer");
const csv = require('csv-parser');
const fs = require('fs');
let template=require('./mailTemplate');
const { env } = require("process");
require('dotenv').config();

//Defining the transporter for the mail
let transporter = nodemailer.createTransport({
    // service: 'Go Daddy'
    host: "smtpout.secureserver.net",  
    secure: true,
    secureConnection: false, // TLS requires secureConnection to be false
    tls: {
        ciphers:'SSLv3'
    },
    requireTLS:true,
    port: 465,
    debug: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
});

//Defining the mail details
let getMailDetails=(personName,personEmail)=>{
    let mailDetails = {
        from:  {
            name: 'Alumni Affairs Cell UIET PU',
            address: 'alumniaffairs@uietpu.in'
        },
        to: personEmail,
        subject: `Test`,
        html:template()
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
let str=""
// let mailDetail=getMailDetails('Yuvraj','yuvrajmann282@gmail.com');
// sendMail(mailDetail);

fs.createReadStream('./2014EEE.csv')
  .pipe(csv())
  .on('data', (row) => {
    let mail=row['Email'];
    let name=row['Name']; 

    // cout<<mail<<" "<<name<<endl;
    setTimeout(() => {
        let mailDetail=getMailDetails(name,mail);
        sendMail(mailDetail);    
    }, 2000 * idx);
    idx++;
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });
