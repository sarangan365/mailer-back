const express = require('express');
const router = express.Router();
const { sendEmailWithAttachment } = require('../services/emailService');
const uploadMiddleware = require('../middleware/uploadMiddleware');

// API endpoint to handle sending email with attachment
router.post('/sendEmail', uploadMiddleware, async (req, res) => {
   const { email, companyName, postName, recruiterName } = req.body;

   // Check if req.file exists
   if (!req.file) {
      return res.status(400).send('No file uploaded');
   }

   const resumePath = req.file.path;

   try {
      await sendEmailWithAttachment(email, companyName, postName, recruiterName, resumePath);
      res.status(200).send('Email sent successfully');
   } catch (error) {
      console.error(error);
      res.status(500).send('Error sending email');
   }
});

module.exports = router;
