const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

let posts = [];
let postIdCounter = 1; 


const authenticateUser = (req, res, next) => {
  req.user = { id: 'exampleUserId' }; 
  next();
};

app.post('/create', authenticateUser, (req, res) => {
  const { title, content } = req.body;
  const newPost = {
    id: postIdCounter++,
    title,
    content,
    authorId: req.user.id,
    date: new Date().toISOString(),
  };
  
  posts.push(newPost);
  res.status(201).json(newPost);
});

let users = [];

app.post('/api/signup', (req, res) => {
  const { user_id, password, name } = req.body;
  
  const existingUser = users.find(user => user.user_id === user_id);
  if (existingUser) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const newUser = { user_id, password, name };
  users.push(newUser);
  
  res.status(201).json({ message: 'User created successfully' });
});

app.post('/api/signin', (req, res) => {
  const { user_id, password } = req.body;

  const user = users.find(user => user.user_id === user_id && user.password === password);
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.status(200).json({ message: 'Sign in successful' });
});

app.get('/posts', (req, res) => {
  res.json(posts);
});

app.post('/delete/:id', authenticateUser, (req, res) => {
  const postId = parseInt(req.params.id);
  const userId = req.user.id;
  
  const postIndex = posts.findIndex(post => post.id === postId);

  if (postIndex === -1) {
    return res.status(404).send('Post not found!');
  }

  if (posts[postIndex].authorId !== userId) {
    return res.status(403).send('You are not allowed to delete this post!');
  }

  posts.splice(postIndex, 1);
  res.status(200).send('Post deleted successfully!');
});

app.listen(5000, () => {
  console.log("Server started on port 5000!");
});
