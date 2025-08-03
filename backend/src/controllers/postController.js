import Post from "../models/Post.js";

// ✅ Create a new post
export const createPost = async (req, res) => {
  try {
    const post = await Post.create({ author: req.user.id, content: req.body.content });
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Get all posts
export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name profileImage")
      .populate("comments.user", "name profileImage")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Like/Unlike a post
export const toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const userId = req.user.id;
    const isLiked = post.likes.includes(userId);

    if (isLiked) {
      post.likes = post.likes.filter((id) => id.toString() !== userId);
    } else {
      post.likes.push(userId);
    }

    await post.save();
    res.json({ message: isLiked ? "Post unliked" : "Post liked", likes: post.likes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ✅ Add a comment
export const addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    const comment = { user: req.user.id, text: req.body.text };
    post.comments.push(comment);

    await post.save();
    await post.populate("comments.user", "name profileImage");

    res.status(201).json(post.comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const toggleReaction = async (req, res) => {
  const { type } = req.body; // "like", "love", "clap"
  const userId = req.user.id;

  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: "Post not found" });

    // Remove user from all reactions first
    Object.keys(post.reactions).forEach((key) => {
      post.reactions[key] = post.reactions[key].filter(id => id.toString() !== userId);
    });

    // Add user to selected reaction
    post.reactions[type].push(userId);

    await post.save();
    await post.populate("author comments.user", "name profileImage");
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const editComment = async (req, res) => {
  const { text } = req.body;
  try {
    const post = await Post.findById(req.params.id);
    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: "Comment not found" });
    if (comment.user.toString() !== req.user.id) return res.status(403).json({ message: "Unauthorized" });

    comment.text = text;
    await post.save();
    res.json(post.comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    post.comments = post.comments.filter(c => c._id.toString() !== req.params.commentId);
    await post.save();
    res.json(post.comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

