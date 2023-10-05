const mongoose = require("mongoose");

const Schema = mongoose.Schema;

var usersSchema = new Schema({
    username: String,
    email: String,
    password: String,
    lastLogin: Date,
    createdDate: { type: Date, default: Date.now() }
});

module.exports = mongoose.model("users", usersSchema);