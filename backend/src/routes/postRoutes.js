import express from "express";
import { createPost, getPosts, toggleLike, addComment,toggleReaction,editComment,deleteComment } from "../controllers/postController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createPost);       // ✅ create post
router.get("/", getPosts);                          // ✅ get all posts
router.put("/:id/like", authMiddleware, toggleLike); // ✅ like/unlike
router.post("/:id/comment", authMiddleware, addComment); // ✅ add comment
router.put("/:id/reaction", authMiddleware, toggleReaction); // ✅ new reactions
router.put("/:id/comment/:commentId", authMiddleware, editComment); // ✅ edit comment
router.delete("/:id/comment/:commentId", authMiddleware, deleteComment); // ✅ delete comment

export default router;
