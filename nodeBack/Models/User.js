const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String },
    // Add additional fields for user data here
});

const User = mongoose.model('User', userSchema);
module.exports = User;

// curl -X POST -H "Content-Type: application/json" -d "{\"username\": \"testuser2\", \"password\": \"testpass2\"}" http://localhost:5000/register
