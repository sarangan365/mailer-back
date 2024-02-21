const { getAppliedJobs, updateJobStatus, deleteAppliedJob } = require('../services/applicationService');

async function getAppliedJobsController(req, res) {
   try {
      const appliedJobs = await getAppliedJobs();
      res.json(appliedJobs);
   } catch (error) {
      console.error('Error fetching applied jobs:', error);
      res.status(500).json({ error: 'Internal server error' });
   }
}

async function updateJobContorller(req, res) {
   const { id } = req.params;
   const { status } = req.body;
   try {
      const updatedJob = await updateJobStatus(id, status);
      res.json(updatedJob);
   } catch (error) {
      console.error('Error updating job status:', error);
      res.status(500).json({ error: 'Internal server error' });
   }
}

async function deleteJobController(req, res) {
   const { id } = req.params;
   try {
      await deleteAppliedJob(id);
      res.status(204).send();
   } catch (error) {
      console.error('Error deleting applied job:', error);
      res.status(500).json({ error: 'Internal server error' });
   }
}

module.exports = {
   getAppliedJobsController,
   updateJobContorller,
   deleteJobController
};
