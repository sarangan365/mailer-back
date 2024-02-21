const { sendEmailWithAttachment } = require('../services/emailService');

async function sendEmail(req, res) {
   const { email, companyName, postName, recruiterName } = req.body;

   try {
      // Check if req.file exists
      if (!req.file) {
         throw new Error('No file uploaded');
      }

      const resumePath = req.file.path;
      await sendEmailWithAttachment(email, companyName, postName, recruiterName, resumePath);
      res.status(200).send('Email sent successfully');
   } catch (error) {
      console.error(error);
      res.status(500).send('Error sending email');
   }
}

module.exports = {
   sendEmail
};
