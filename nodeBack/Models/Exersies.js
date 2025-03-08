const mongoose = require('mongoose');
const exerciseName = new mongoose.Schema({
    exercisename: { type: String, required: true, unique: true },
    describtion: { type: String, required: true,},
    replete:{type: Number, required: true,},
    set: {type: Number, required: true,},
    model_url:{type:String,require:true},
    createdAt: {type: Date,default: Date.now,},
});
const exerciseHis = new mongoose.Schema({
    exerciseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    exercisename: { type: String, required: true},
    createdAt: {type: Date,default: Date.now,},

});

const exerciseSImage = new mongoose.Schema({
    exerciseId: { type: mongoose.Schema.Types.ObjectId, ref:'Exercise', required: true },
    filename:{type: String},
    imagePath: { type: String, required: true },
    uploadDate: { type: Date, default: Date.now },},
    { collection: 'imagesExer' }
  );

const hunshBackLevel = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    AnalyzeLevel:{type:Number},
    AnalyzeDate: { type: Date }}, 
    { timestamps: true });

const Exercise = mongoose.model('Exercise', exerciseName);
const Level = mongoose.model('Level',hunshBackLevel)
const History = mongoose.model('History',exerciseHis)
const ExerciseImage = mongoose.model('ExerciseImage',exerciseSImage)
module.exports = {
    Exercise,
    Level,
    History,
    ExerciseImage
};
