import { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

import { getPosts, createPost } from "../api/api";


const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  withCredentials: true,
});
 // ✅ WebSocket connection to backend

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [commentText, setCommentText] = useState({});
  const [expandedPost, setExpandedPost] = useState(null);
  const [editCommentId, setEditCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ Fetch posts
  const fetchPosts = async () => {
    try {
      const { data } = await getPosts();
      setPosts(data);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
    }
  };

  useEffect(() => {
    fetchPosts();
    socket.on("refresh_feed", fetchPosts); // ✅ Real-time feed update
    return () => socket.off("refresh_feed");
  }, []);

  // ✅ Create a new post
  const handlePost = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    await createPost({ content });
    setContent("");
    socket.emit("new_post");
  };

  // ✅ Handle Reactions
  const handleReaction = async (postId, type) => {
    try {
      await axios.put(`${import.meta.env.VITE_API_URL}/posts/${postId}/reaction`, 
        { type }, 
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      socket.emit("reaction");
    } catch (err) {
      console.error("Reaction failed:", err);
    }
  };

  // ✅ Add Comment
  const handleComment = async (postId) => {
    const text = commentText[postId];
    if (!text?.trim()) return;
    await axios.post(`${import.meta.env.VITE_API_URL}/posts/${postId}/comment`, 
      { text }, 
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    setCommentText({ ...commentText, [postId]: "" });
    socket.emit("new_comment");
  };

  // ✅ Edit Comment
  const handleEditComment = async (postId, commentId) => {
    if (!editCommentText.trim()) return;
    await axios.put(`${import.meta.env.VITE_API_URL}/posts/${postId}/comment/${commentId}`, 
      { text: editCommentText }, 
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    setEditCommentId(null);
    socket.emit("new_comment");
  };

  // ✅ Delete Comment
  const handleDeleteComment = async (postId, commentId) => {
    await axios.delete(`${import.meta.env.VITE_API_URL}/posts/${postId}/comment/${commentId}`, 
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
    );
    socket.emit("new_comment");
  };

  return (
    <div className="bg-gray-100 min-h-screen">
 
      <div className="max-w-2xl mx-auto mt-6">

        {/* ✅ Create Post Section */}
        <div className="bg-white p-4 rounded-lg shadow mb-4">
          <div className="flex gap-3">
            <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || "User")}&background=random`} className="w-12 h-12 rounded-full border" />
            <form onSubmit={handlePost} className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                placeholder="Start a post..."
                rows="3"
              />
              <div className="flex justify-end mt-2">
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Post</button>
              </div>
            </form>
          </div>
        </div>

        {/* ✅ Render Posts */}
        {posts.length === 0 ? (
          <p className="text-center text-gray-500">No posts yet. Be the first to share something!</p>
        ) : (
          posts.map((p) => (
            <div key={p._id} className="bg-white p-4 rounded-lg shadow mb-4">
              
              {/* ✅ Post Header */}
              <div className="flex items-center gap-3 mb-2">
                <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(p.author?.name || "User")}&background=random`} className="w-10 h-10 rounded-full border" />
                <div>
                  <p className="font-bold">{p.author?.name}</p>
                  <p className="text-xs text-gray-500">{new Date(p.createdAt).toLocaleString()}</p>
                </div>
              </div>

              {/* ✅ Post Content */}
              <p className="text-gray-800 mb-3">{p.content}</p>

              {/* ✅ Reactions */}
              <div className="flex gap-4 text-sm border-t pt-2">
                {["like", "love", "clap"].map((type) => (
                  <button key={type} onClick={() => handleReaction(p._id, type)} className="hover:text-blue-600">
                    {type === "like" ? "👍" : type === "love" ? "❤️" : "👏"} {p.reactions?.[type]?.length || 0}
                  </button>
                ))}
                <button className="hover:text-blue-600" onClick={() => setExpandedPost(expandedPost === p._id ? null : p._id)}>
                  💬 {expandedPost === p._id ? "Hide" : "Comments"} ({p.comments?.length || 0})
                </button>
              </div>

              {/* ✅ Comments Section */}
              {expandedPost === p._id && (
                <div className="mt-3 border-t pt-3">
                  
                  {/* ✅ Display Comments */}
                  {p.comments?.length > 0 ? (
                    p.comments.map((c) => (
                      <div key={c._id} className="flex items-start gap-2 mb-2">
                        <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(c.user?.name || "User")}&background=random`} className="w-8 h-8 rounded-full" />
                        <div className="bg-gray-100 p-2 rounded-lg w-full">
                          {editCommentId === c._id ? (
                            <div>
                              <input value={editCommentText} onChange={(e) => setEditCommentText(e.target.value)} className="w-full border p-1 rounded text-sm" />
                              <div className="flex gap-2 mt-1">
                                <button onClick={() => handleEditComment(p._id, c._id)} className="text-blue-600 text-sm">Save</button>
                                <button onClick={() => setEditCommentId(null)} className="text-gray-500 text-sm">Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <p className="font-semibold text-sm">{c.user?.name}</p>
                              <p className="text-sm">{c.text}</p>
                              {c.user?._id === user?._id && (
                                <div className="flex gap-3 text-xs mt-1 text-gray-500">
                                  <button onClick={() => { setEditCommentId(c._id); setEditCommentText(c.text); }}>Edit</button>
                                  <button onClick={() => handleDeleteComment(p._id, c._id)}>Delete</button>
                                </div>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No comments yet.</p>
                  )}

                  {/* ✅ Add Comment Box */}
                  <div className="flex items-center gap-2 mt-3">
                    <input
                      type="text"
                      value={commentText[p._id] || ""}
                      onChange={(e) => setCommentText({ ...commentText, [p._id]: e.target.value })}
                      placeholder="Write a comment..."
                      className="border rounded-lg p-2 flex-1 text-sm"
                    />
                    <button onClick={() => handleComment(p._id)} className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
                      Post
                    </button>
                  </div>

                </div>
              )}

            </div>
          ))
        )}
      </div>
    </div>
  );
}
