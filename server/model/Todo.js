const mongoose = require("mongoose");

const Schema = mongoose.Schema;

var todoSchema = new Schema({
    title: String,
    subject: String,
    content: String,
    users_id: String,
    startDate: Date,
    finishDate: Date,
    createdAt: { type: Date, default: Date.now() },
    updatedAt: Date,
});

module.exports = mongoose.model('todos', todoSchema);