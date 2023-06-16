const multer = require("multer");
const fs = require("fs");

let dir = `./public/uploads/img/`;

const ImageStorage = multer.diskStorage({
  destination: (req, file, cd) => {
    cd(null, dir);
  },
  filename: (req, file, cb) => {
    let filePath = dir + file.originalname;
    if (!fs.existsSync(filePath)) cb(null, file.originalname);
    else cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploadImage = multer({
  storage: ImageStorage,
  limits: { fileSize: 1024 * 1024 * 10 },
});

module.exports = uploadImage;
