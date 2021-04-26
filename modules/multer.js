const multer = require("multer");
const multerS3 = require("multer-s3");
const aws = require("aws-sdk");

aws.config.loadFromPath(__dirname + "/../config/awsconfig.json");

const s3 = new aws.S3();
const upload = multer({
  storage: multerS3({
    s3,
    bucket: "blog-image-server",
    acl: "public-read",
    key: function (req, file, cb) {
      cb(
        null,
        "images/" + Date.now() + "." + file.originalname.split(".").pop()
      );
    },
  }),
});

module.exports = upload;
