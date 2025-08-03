export default function PostCard({ post }) {
  return (
    <div className="border p-4 rounded shadow mb-3">
      <p className="font-bold">{post.author?.name}</p>
      <p>{post.content}</p>
      <span className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleString()}</span>
    </div>
  );
}
