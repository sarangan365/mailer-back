const fs = require('fs').promises;

async function deleteFile(filePath) {
   try {
      await fs.unlink(filePath);
   } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
   }
}

module.exports = { deleteFile };
