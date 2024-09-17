const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const mongoose = require('mongoose')
const userData = require('./Route/userData')
const https = require('https');
const fs = require('fs');
const path = require('path');
const app = express();
app.use(express.json());
app.use(cors({
  origin: 'https://192.168.1.194:5173',
}));
// // Dummy user data (usually stored in a database)
// const users = [
//   {
//     id: 1,
//     username: 'testuser',
//     password: bcrypt.hashSync('password123', 8),
//   },
// ];

// // Login route
// app.post('/login', (req, res) => {
//   const { username, password } = req.body;

//   // Find user
//   const user = users.find((u) => u.username === username);
//   if (!user) return res.status(400).json({ message: 'User not found' });

//   // Check password
//   const passwordIsValid = bcrypt.compareSync(password, user.password);
//   if (!passwordIsValid) return res.status(401).json({ message: 'Invalid password' });

//   // Generate JWT token
//   const token = jwt.sign({ id: user.id }, 'secretkey', { expiresIn: 86400 }); // 24 hours
//   res.json({ message: 'Login successful', token });
// });

// // Protected route example
// app.get('/protected', (req, res) => {
//   const token = req.headers['x-access-token'];
//   if (!token) return res.status(403).json({ message: 'No token provided' });

//   jwt.verify(token, 'secretkey', (err, decoded) => {
//     if (err) return res.status(500).json({ message: 'Failed to authenticate token' });
//     res.json({ message: 'This is protected data' });
//   });
// });

app.use('/api',userData)

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});

// https.createServer(options, app).listen(443, () => {
//   console.log('HTTPS server running on port 443');
// });