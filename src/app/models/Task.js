const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    Title: { type: String, required: true },
    Description: { type: String },
    Status0: { type: String, default: 'Chưa Hoàn Thành' },
    Duedate: { type: Date },
    UserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Task = mongoose.model("Task", TaskSchema)

module.exports = Task