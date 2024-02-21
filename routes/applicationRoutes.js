const express = require('express');
const router = express.Router();
const Application = require('../models/Application');

// Route to get applied jobs
router.get('/appliedJobs', async (req, res) => {
   try {
      const appliedJobs = await Application.find({}).exec();
      res.json(appliedJobs);
   } catch (error) {
      console.error('Error fetching applied jobs:', error);
      res.status(500).json({ error: 'Internal server error' });
   }
});

// Route to update job status
router.patch('/appliedJobs/:id', async (req, res) => {
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
router.delete('/appliedJobs/:id', async (req, res) => {
   const { id } = req.params;
   try {
      await Application.findByIdAndDelete(id).exec();
      res.status(204).send();
   } catch (error) {
      console.error('Error deleting applied job:', error);
      res.status(500).json({ error: 'Internal server error' });
   }
});

module.exports = router;
