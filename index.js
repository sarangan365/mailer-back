const express = require('express');
const nodemailer = require('nodemailer');
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path');
const ejs = require('ejs');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const Application = require('./models/Application');

const app = express();
app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
   useNewUrlParser: true,
   useUnifiedTopology: true,
}).then(() => {
   console.log('MongoDB connected');
}).catch(err => console.error('MongoDB connection error:', err));

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
   const { email, companyName, postName, recruiterName, gmailUser, gmailPass, applicantName } = req.body;
   const resumePath = req.file.path;

   try {
      // Render EJS template
      const emailTemplate = await ejs.renderFile(path.join(__dirname, 'views', 'emailTemplate.ejs'), {
         companyName: companyName,
         postName: postName,
         recruiterName: recruiterName, // Pass recruiter's name to EJS template
         applicantName: req.body.applicantName // Pass applicant's name to EJS template
      });

      // Create reusable transporter object using the provided SMTP transport if gmailUser and gmailPass are provided
      let transporter;
      if (gmailUser && gmailPass) {
         transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
               user: gmailUser, // Using provided email
               pass: gmailPass // Using provided password
            }
         });
      } else {
         // If gmailUser and gmailPass are not provided, use environment variables
         transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
               user: process.env.GMAIL_USER, // Using environment variable for email
               pass: process.env.GMAIL_PASS // Using environment variable for password
            }
         });
      }

      // Mail options
      let mailOptions = {
         from: process.env.GMAIL_USER, // Sender's email
         to: email, // Recipient email
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

      // Save application to MongoDB
      const application = new Application({
         companyName,
         recruiterName,
         email,
         postName,
         applicantName
      });
      await application.save();

      // Delete the uploaded file after sending the email
      await fs.unlink(resumePath);

      res.status(200).send('Email sent successfully');
   } catch (error) {
      console.error(error);
      res.status(500).send('Error sending email');
   }
});


// Route to get applied jobs
app.get('/appliedJobs', async (req, res) => {
   try {
      const appliedJobs = await Application.find({}).exec();
      res.json(appliedJobs);
   } catch (error) {
      console.error('Error fetching applied jobs:', error);
      res.status(500).json({ error: 'Internal server error' });
   }
});

// Route to update job status
app.patch('/appliedJobs/:id', async (req, res) => {
   const { id } = req.params;
   const { status } = req.body;
   try {
      const updatedJob = await Application.findByIdAndUpdate(id, { status }, { new: true }).exec();
      res.json(updatedJob);
   } catch (error) {
      console.error('Error updating job status:', error);
      res.status(500).json({ error: 'Internal server error' });
   }
});

// Route to delete applied job
app.delete('/appliedJobs/:id', async (req, res) => {
   const { id } = req.params;
   try {
      await Application.findByIdAndDelete(id).exec();
      res.status(204).send();
   } catch (error) {
      console.error('Error deleting applied job:', error);
      res.status(500).json({ error: 'Internal server error' });
   }
});

// Start the server
app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});
