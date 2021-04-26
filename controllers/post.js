const post = {
  uploadImage: async (req, res) => {
    const image = req.file.location;
    console.log(req.file);

    if (image === undefined) {
      return res
        .status(400)
        .send(util.fail(400, "이미지가 존재하지 않습니다."));
    }
    res.status(200).send(util.success(200, "요청 성공", image));
  },
};

const util = {
  success: (status, message, data) => {
    return {
      status,
      success: true,
      message,
      data,
    };
  },
  fail: (status, message) => {
    return { status, success: false, message };
  },
};

module.exports = post;
