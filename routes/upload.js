const express = require("express");
const router = express.Router();

const upload = require("../modules/multer");

const PostController = require("../controllers/post");

router.post("/", upload.single("image"), PostController.uploadImage);

module.exports = router;
