// multer
const fs = require("fs");
const uploadsDir = "./src/uploads/";
const imagesDir = `${uploadsDir}images`;
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
    if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir);
    cb(null, imagesDir);
  },
  filename: function (req, file, cb) {
    var fileExtension = file.mimetype.split("/").pop();
    if (!file.originalname.toLowerCase().match(/\.(jpg|jpeg|png)$/)) {
      const err = new Error("Invalid File Type");
      err.status = 400;
      return cb(err);
    }
    cb(null, +Date.now() + "." + fileExtension);
  },
});
const upload = multer({
  storage,
  limits: {
    fieldNameSize: 300,
    fileSize: 15728640,
  },
});
exports.uploadcompanyLogo = upload.single("companyLogo");
exports.uploadSingle = upload.single("image");
