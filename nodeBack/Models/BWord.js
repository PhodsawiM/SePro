const mongoose = require('mongoose');
const exerciseName = new mongoose.Schema({
    Btext: {type: String, unique: true},
});
const Btext = mongoose.model('Btext', exerciseName);

module.exports = {
    Btext,

};
