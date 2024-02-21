const Application = require('../models/Application');

async function getAppliedJobs() {
   try {
      const appliedJobs = await Application.find({}).exec();
      return appliedJobs;
   } catch (error) {
      console.error('Error fetching applied jobs:', error);
      throw new Error('Error fetching applied jobs');
   }
}

async function updateJobStatus(id, status) {
   try {
      const updatedJob = await Application.findByIdAndUpdate(id, { status }, { new: true }).exec();
      return updatedJob;
   } catch (error) {
      console.error('Error updating job status:', error);
      throw new Error('Error updating job status');
   }
}

async function deleteAppliedJob(id) {
   try {
      await Application.findByIdAndDelete(id).exec();
   } catch (error) {
      console.error('Error deleting applied job:', error);
      throw new Error('Error deleting applied job');
   }
}

module.exports = {
   getAppliedJobs,
   updateJobStatus,
   deleteAppliedJob
};
