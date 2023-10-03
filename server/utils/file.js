const fs = require('fs');

exports.deleteFile = filePath => {
  fs.access(filePath, fs.constants.F_OK, err => {
    if (!err) {
      fs.unlink(filePath, unlinkErr => {
        if (unlinkErr) {
          return;
        }
      });
    }
  });
};
