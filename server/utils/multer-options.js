const multer = require('multer');

const normalizeFileName = fileName => {
  // Loại bỏ và thay thế các ký tự không hợp lệ bằng dấu gạch ngang
  return fileName.replace(/[^a-zA-Z0-9.]/g, '-');
};

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    const normalizedFileName = normalizeFileName(file.originalname);
    cb(null, new Date().toISOString() + '-' + normalizedFileName);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

module.exports = {
  fileFilter,
  fileStorage,
};
