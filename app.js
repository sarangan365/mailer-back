const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const emailRoutes = require('./routes/emailRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const path = require('path');
dotenv.config();

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

app.use(express.static(path.join(__dirname, 'public')));
// Mount routes
app.use(emailRoutes);
app.use(applicationRoutes);

// Start the server
app.listen(PORT, () => {
   console.log(`Server is running on port ${PORT}`);
});
