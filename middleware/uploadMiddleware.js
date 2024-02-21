const multer = require('multer');

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

module.exports = upload.single('resume');
