const mongoose = require('mongoose');
const MeetingSchema = new mongoose.Schema({
    meeting_id: { type: String, required: true, unique: true },
    meeting_topic: { type: String, required: true },
    scores: { type: Number, required: true }
});

module.exports = mongoose.model('Meeting', MeetingSchema);
