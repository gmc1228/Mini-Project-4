import React, { useState } from 'react';

function BlogPostForm() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = {
      title,
      author,
      content,
    };

    try {
      const response = await fetch('/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Post created successfully!');
        setTitle('');
        setAuthor('');
        setContent('');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error creating post:', error);
      alert('Error creating post. Please try again.');
    }
  };

  return (
    <div className="create-post-form">
      <h1>Create a New Blog Post</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Title:</label>
        <input
          type="text"
          name="title"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        
        <label htmlFor="author">Author:</label>
        <input
          type="text"
          name="author"
          id="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          required
        />
        
        <label htmlFor="content">Content:</label>
        <textarea
          name="content"
          id="content"
          rows="5"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required/>
        
        <button type="submit">Create Post</button>
      </form>
    </div>
  );
}

export default BlogPostForm;
