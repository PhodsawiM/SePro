const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true,},
    email:{type: String, required: true,},
    role: {type: String,require: true,enum: ['user', 'admin']},
    createdAt: {type: Date,default: Date.now,},
    dateOfBirth: {type: Date,required: true,},
});
const userData = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        author: {type: mongoose.Schema.Types.ObjectId,ref: 'User',required: true,},
        createdAt: {type: Date,default: Date.now,},
    }
)
const imageSchema = new mongoose.Schema({
    filename:{type: String},
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    imagePath: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now },},
    { collection: 'images' }
  );
const User = mongoose.model('User', userSchema);
const Data = mongoose.model('Data',userData)
const userImage = mongoose.model('userImage',imageSchema)
module.exports = {
    User,
    Data,
    userImage,
};
