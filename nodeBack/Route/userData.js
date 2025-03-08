const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const url = "mongodb://localhost:27017/UserTest";

// Connect to MongoDB
mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB via Mongoose'))
    .catch(err => console.error('Error connecting to MongoDB', err));

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    company: String,
    city: String,
});

const User = mongoose.model('UserTest', userSchema,'userData');

router.get('/userData', async (req, res) => {
    try {
        let users = await User.find();
        console.log('Users fetched:', users);
        res.json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});
module.exports = router;
