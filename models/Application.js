const mongoose = require('mongoose');

// Define schema
const applicationSchema = new mongoose.Schema({
   companyName: { type: String, required: true },
   recruiterName: { type: String, required: true },
   email: { type: String, required: true },
   postName: { type: String, required: true },
   status: { type: String, enum: ['applied', 'contacted', 'rejected', 'selected'], default: 'applied' },
   createdDate: { type: Date, default: Date.now }
});

// Create model
const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
