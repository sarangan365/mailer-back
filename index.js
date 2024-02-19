const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');
const ejs = require('ejs');
require('dotenv').config();
const cors = require('cors');

const app = express();
app.use(cors());
const PORT = process.env.PORT || 3000;

// Multer storage configuration
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, 'uploads/');
   },
   filename: (req, file, cb) => {
      cb(null, file.originalname);
   }
});

const upload = multer({ storage });

// Express middleware to serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// API endpoint to handle sending email with attachment
app.post('/sendEmail', upload.single('resume'), async (req, res) => {
   const { email, companyName, postName, recruiterName } = req.body;
   const resumePath = req.file.path;

   try {
      // Render EJS template
      const emailTemplate = await ejs.renderFile(path.join(__dirname, 'views', 'emailTemplate.ejs'), {
         companyName: companyName,
         postName: postName,
         recruiterName: recruiterName // Pass recruiter's name to EJS template
      });

      // Create reusable transporter object using the default SMTP transport
      let transporter = nodemailer.createTransport({
         service: 'gmail',
         auth: {
            user: process.env.GMAIL_USER, // Using environment variable for email
            pass: process.env.GMAIL_PASS // Using environment variable for password
         }
      });

      // Mail options
      let mailOptions = {
         from: 'rightsight365@gmail.com', // Your email
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

      // Delete the uploaded file after sending the email
      await fs.unlink(resumePath);

      res.status(200).send('Email sent successfully');
   } catch (error) {
      console.error(error);
      res.status(500).send('Error sending email');
   }
});

// Start the server
app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});
