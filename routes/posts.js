const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const sanitizeHtml = require("sanitize-html");

const removeHtmlAndShorten = (body) => {
  const filtered = sanitizeHtml(body, {
    allowedTags: ["h1", "h2", "h3", "h4", "h5", "h6"],
    // disallowedTagsMode: "recursiveEscape",
  }).replace(/<h[1-6]>.*<\/h[1-6]>/, "");
  return filtered.length < 200 ? filtered : filtered.slice(0, 200) + "...";
};

router.get("/", async (req, res) => {
  const offset = +req.query.offset || 0;
  const limit = +req.query.limit || 5;

  try {
    const posts = await Post.find()
      .sort("-createdAt")
      .skip(offset)
      .limit(limit)
      .exec();

    res.json(
      posts
        .map((post) => post.toJSON())
        .map((post) => ({ ...post, body: removeHtmlAndShorten(post.body) }))
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", getPostById, async (req, res) => {
  return res.send(res.post);
});

router.post("/", async (req, res) => {
  const post = new Post({
    title: req.body.title,
    body: req.body.body,
    tags: req.body.tags,
  });
  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete("/:id", getPostById, async (req, res) => {
  try {
    await res.post.remove();
    res.json({ message: "Deleted post" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.patch("/:id", getPostById, async (req, res) => {
  if (req.body.title) {
    res.post.title = req.body.title;
  }
  if (req.body.body) {
    res.post.body = req.body.body;
  }
  if (req.body.tags) {
    res.post.tags = req.body.tags;
  }
  try {
    const updatedPost = await res.post.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

async function getPostById(req, res, next) {
  let post;
  try {
    post = await Post.findById(req.params.id);
    if (post === null) {
      return res.status(404).json({ message: "Cannot find subscriber" });
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.post = post;
  next();
}

module.exports = router;
