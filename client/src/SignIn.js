import React, { useState } from 'react';

function SignIn() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, password }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // If sign-in is successful, store the user ID in local storage
        localStorage.setItem('userId', userId); // Store user ID in local storage
        setMessage(data.message); // Show success message
        // You can add redirection here if needed, e.g., window.location.href = '/';
      } else {
        // If sign-in fails, show error message
        setMessage(data.message);
      }
    } catch (error) {
      setMessage('Error signing in.');
    }
  };

  return (
    <div>
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>User ID:</label>
          <input
            type="text"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign In</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}

export default SignIn;
