const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Ensure you have this line for CORS

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory storage for posts
let posts = [];
let postIdCounter = 1; // Simple counter for post IDs

// Middleware to simulate user authentication
const authenticateUser = (req, res, next) => {
  req.user = { id: 'exampleUserId' }; // Example user ID; replace with actual logic
  next();
};

// Endpoint to create a new post
app.post('/create', authenticateUser, (req, res) => {
  const { title, content } = req.body; // Expecting title and content in the request body
  const newPost = {
    id: postIdCounter++, // Incrementing ID for each new post
    title,
    content,
    authorId: req.user.id,
    date: new Date().toISOString(),
  };
  
  posts.push(newPost); // Add the new post to the in-memory array
  res.status(201).json(newPost);
});
// In your index.js file

// Dummy in-memory user storage
let users = [];

// Endpoint to sign up a new user
app.post('/api/signup', (req, res) => {
  const { user_id, password, name } = req.body;
  
  // Check if user already exists
  const existingUser = users.find(user => user.user_id === user_id);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // Create a new user
  const newUser = { user_id, password, name };
  users.push(newUser);
  
  res.status(201).json({ message: 'User created successfully' });
});

// Endpoint to sign in a user
app.post('/api/signin', (req, res) => {
  const { user_id, password } = req.body;

  // Find the user
  const user = users.find(user => user.user_id === user_id && user.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.status(200).json({ message: 'Sign in successful' });
});

// Endpoint to get all posts
app.get('/posts', (req, res) => {
  res.json(posts); // Return all posts
});

// Endpoint to delete a post
app.post('/delete/:id', authenticateUser, (req, res) => {
  const postId = parseInt(req.params.id);
  const userId = req.user.id; // Get the authenticated user's ID

  // Find the index of the post to delete
  const postIndex = posts.findIndex(post => post.id === postId);

  if (postIndex === -1) {
    return res.status(404).send('Post not found!');
  }

  // Check if the user is the creator of the post
  if (posts[postIndex].authorId !== userId) {
    return res.status(403).send('You are not allowed to delete this post!');
  }

  // Remove the post from the array
  posts.splice(postIndex, 1);
  res.status(200).send('Post deleted successfully!');
});

// Start the server
app.listen(5000, () => {
  console.log("Server started on port 5000!");
});
