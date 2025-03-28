
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    meetings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Meeting' }] // References Meeting model
});

module.exports = mongoose.model('User', UserSchema);

