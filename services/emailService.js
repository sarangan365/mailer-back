const nodemailer = require('nodemailer');
const ejs = require('ejs');
const fs = require('fs').promises;
const path = require('path');

async function sendEmailWithAttachment(email, companyName, postName, recruiterName, resumePath) {
   try {
      // Render EJS template
      const emailTemplate = await ejs.renderFile(path.join(__dirname, '..', 'views', 'emailTemplate.ejs'), {
         companyName,
         postName,
         recruiterName // Pass recruiter's name to EJS template
      });

      // Create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
         service: 'gmail',
         auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS
         }
      });

      // Mail options
      let mailOptions = {
         from: 'rightsight365@gmail.com',
         to: email,
         subject: 'Job Application',
         html: emailTemplate,
         attachments: [{
            filename: 'resume.pdf',
            path: resumePath
         }]
      };

      // Send mail with defined transport object
      let info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
   } catch (error) {
      console.error('Error sending email:', error);
      throw error;
   }
}

module.exports = { sendEmailWithAttachment };
