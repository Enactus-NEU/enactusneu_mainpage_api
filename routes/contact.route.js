const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

const contactEmail = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAILPASS,
    },
});
  
contactEmail.verify((error) => {
    if (error) {
        console.log(error);
    } 
});



router.post("/", (req, res) => {
    const name = req.body.name;
    const email = req.body.email;
    const subject = req.body.subject;
    const message = req.body.message; 
    const mail = {
      from: name,
      to: "neu.enactus@gmail.com",
      subject: `[GỬI TỪ WEB] - ${subject}`,
      html: `<p>Name: ${name}</p>
             <p>Email: ${email}</p>
             <p>Message: ${message}</p>`,
    };
    contactEmail.sendMail(mail, (error) => {
        if (error) {
            res.json({ status: "ERROR" });
    }   else {
            res.json({ status: "Message Sent" });
    }
    });
});

module.exports = router;