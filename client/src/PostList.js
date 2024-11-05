import React, { useEffect, useState } from 'react';

function PostList() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/posts'); 
        if (!response.ok) {
          throw new Error('Failed to fetch posts');
        }
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        setError(error.message);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (postId) => {
    const confirmed = window.confirm('Are you sure you want to delete this post?');
    if (confirmed) {
      try {
        const response = await fetch(`/delete/${postId}`, {
          method: 'POST',
        });
        if (!response.ok) {
          throw new Error('Failed to delete the post');
        }
        setPosts(posts.filter((post) => post.id !== postId));
      } catch (error) {
        setError(error.message);
      }
    }
  };

  return (
    <div>
      <h1>Blog Posts</h1>
      {error && <p className="error">{error}</p>}
      <a href="/create">
        <button className="create-button">Create a New Post</button>
      </a>
      <ul>
        {posts.length > 0 ? (
          posts.map((post) => (
            <li key={post.id}>
              <h2>{post.title}</h2>
              <p>{post.content}</p>
              <p>
                <em>By {post.authorId} on {new Date(post.date).toLocaleDateString()}</em>
              </p>
              <a href={`/edit/${post.id}`}>
                <button className="edit-button">Edit</button>
              </a>
              <button
                className="delete-button"
                onClick={() => handleDelete(post.id)}
              >
                Delete
              </button>
            </li>
          ))
        ) : (
          <p>No posts available.</p>
        )}
      </ul>
    </div>
  );
}

export default PostList;
