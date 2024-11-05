const express = require('express');
const router = express.Router();
const db = require('../database');

router.post('/signin', async (req, res) => {
  const { user_id, password } = req.body;
  const user = await db.findUserById(user_id);
  if (user && user.password === password) {
    res.json({ message: 'Sign-in successful!' });
  } else {
    res.json({ message: 'Invalid credentials' });
  }
});

router.post('/signup', async (req, res) => {
  const { user_id, password, name } = req.body;
  try {
    await db.saveNewUser({ user_id, password, name });
    res.json({ message: 'Sign-up successful!' });
  } catch (error) {
    res.json({ message: 'Error during sign-up' });
  }
});

module.exports = router;
